"""Generate a Postman Collection v2.1 from ONVO OpenAPI, folders by tag order."""

from __future__ import annotations

import ast
import json
import re
import uuid
from copy import deepcopy
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parent
OPENAPI_PATH = ROOT / "openapi.yaml"
OUTPUT_PATH = ROOT / "postman.json"

HTTP_METHODS = {"get", "post", "put", "patch", "delete", "head", "options"}


class PlainSafeLoader(yaml.SafeLoader):
    """Keep timestamp-like scalars as strings (OpenAPI may include invalid dates)."""


PlainSafeLoader.yaml_implicit_resolvers = {
    key: [
        (tag, regexp)
        for tag, regexp in resolvers
        if tag != "tag:yaml.org,2002:timestamp"
    ]
    for key, resolvers in yaml.SafeLoader.yaml_implicit_resolvers.items()
}


def main() -> None:
    openapi = yaml.load(OPENAPI_PATH.read_text(encoding="utf-8"), Loader=PlainSafeLoader)

    tag_order: list[str] = []
    seen: set[str] = set()
    for tag in openapi.get("tags") or []:
        name = tag.get("name")
        if name and name not in seen:
            seen.add(name)
            tag_order.append(name)

    base_url = (openapi.get("servers") or [{}])[0].get("url", "https://api.onvopay.com")

    def resolve_ref(ref: str):
        if not isinstance(ref, str) or not ref.startswith("#/"):
            return None
        node = openapi
        for part in ref[2:].split("/"):
            if not isinstance(node, dict):
                return None
            node = node.get(part)
            if node is None:
                return None
        return node

    def deref(obj, depth: int = 0):
        if depth > 12 or not isinstance(obj, dict):
            return obj
        if "$ref" not in obj:
            return obj
        resolved = resolve_ref(obj["$ref"])
        if resolved is None:
            return obj
        merged = deref(deepcopy(resolved), depth + 1)
        if not isinstance(merged, dict):
            return merged
        for key, value in obj.items():
            if key != "$ref":
                merged[key] = value
        return merged

    def example_from_schema(schema, depth: int = 0, skip_readonly: bool = True):
        if depth > 8 or schema is None:
            return None
        schema = deref(schema, depth)
        if not isinstance(schema, dict):
            return None
        if skip_readonly and schema.get("readOnly"):
            return None
        if "example" in schema:
            return schema["example"]
        examples = schema.get("examples")
        if isinstance(examples, list) and examples:
            return examples[0]
        if "default" in schema:
            return schema["default"]
        if schema.get("enum"):
            return schema["enum"][0]
        if "oneOf" in schema:
            return example_from_schema(schema["oneOf"][0], depth + 1, skip_readonly)
        if "anyOf" in schema:
            return example_from_schema(schema["anyOf"][0], depth + 1, skip_readonly)
        if "allOf" in schema:
            merged: dict = {}
            for part in schema["allOf"]:
                ex = example_from_schema(part, depth + 1, skip_readonly)
                if isinstance(ex, dict):
                    merged.update(ex)
                elif ex is not None and not merged:
                    return ex
            return merged or None

        schema_type = schema.get("type")
        if schema_type == "object" or "properties" in schema:
            props = schema.get("properties") or {}
            required = set(schema.get("required") or [])
            obj: dict = {}
            for key, value in props.items():
                value = deref(value, depth + 1) if isinstance(value, dict) else value
                if skip_readonly and isinstance(value, dict) and value.get("readOnly"):
                    continue
                ex = example_from_schema(value, depth + 1, skip_readonly)
                if ex is not None:
                    obj[key] = ex
                elif key in required:
                    obj[key] = None
            if required:
                required_obj = {k: obj[k] for k in required if k in obj}
                if required_obj:
                    for key, value in obj.items():
                        if key not in required_obj and len(required_obj) < 12:
                            required_obj[key] = value
                    return required_obj
            return obj or None
        if schema_type == "array" or "items" in schema:
            item = example_from_schema(schema.get("items"), depth + 1, skip_readonly)
            return [item] if item is not None else []
        if schema_type == "string":
            fmt = schema.get("format")
            if fmt == "date":
                return "2026-01-01"
            if fmt == "date-time":
                return "2026-01-01T12:00:00.000Z"
            if fmt == "email":
                return "cliente@example.com"
            if fmt in {"uri", "url"}:
                return "https://example.com"
            return "string"
        if schema_type == "integer":
            return 0
        if schema_type == "number":
            return 0
        if schema_type == "boolean":
            return False
        return None

    def body_from_code_samples(op: dict):
        samples = op.get("x-codeSamples") or []
        for sample in samples:
            source = sample.get("source") or ""
            match = re.search(r"data\s*=\s*(\{.*?\}|\[.*?\])\s*\n", source, re.S)
            if match:
                try:
                    value = ast.literal_eval(match.group(1))
                    if isinstance(value, (dict, list)):
                        return value
                except (SyntaxError, ValueError):
                    pass
            match = re.search(r"-d\s+'(\{.*?\})'", source, re.S)
            if not match:
                match = re.search(r'-d\s+"(\{.*?\})"', source, re.S)
            if match:
                try:
                    return json.loads(match.group(1))
                except json.JSONDecodeError:
                    pass
        return None

    def path_to_url(path: str) -> dict:
        segments: list[str] = []
        variables: list[dict] = []
        for seg in path.strip("/").split("/"):
            match = re.fullmatch(r"\{([^}]+)\}", seg)
            if match:
                name = match.group(1)
                segments.append(f":{name}")
                variables.append(
                    {
                        "key": name,
                        "value": f"<{name}>",
                        "description": f"Path parameter: {name}",
                    }
                )
            else:
                segments.append(seg)
        raw = "{{baseUrl}}" + re.sub(r"\{([^}]+)\}", r"{{\1}}", path)
        url: dict = {"raw": raw, "host": ["{{baseUrl}}"], "path": segments}
        if variables:
            url["variable"] = variables
        return url

    def build_query(parameters) -> list[dict]:
        query: list[dict] = []
        for param in parameters or []:
            param = deref(param)
            if param.get("in") != "query":
                continue
            schema = deref(param.get("schema") or {})
            example = param.get("example")
            if example is None:
                example = example_from_schema(schema, skip_readonly=False)
            query.append(
                {
                    "key": param.get("name"),
                    "value": "" if example is None else str(example),
                    "description": (param.get("description") or "")[:500],
                    "disabled": not param.get("required", False),
                }
            )
        return query

    def build_headers(parameters, has_body: bool) -> list[dict]:
        headers: list[dict] = []
        for param in parameters or []:
            param = deref(param)
            if param.get("in") != "header":
                continue
            if (param.get("name") or "").lower() == "authorization":
                continue
            schema = deref(param.get("schema") or {})
            example = param.get("example")
            if example is None:
                example = example_from_schema(schema, skip_readonly=False)
            headers.append(
                {
                    "key": param.get("name"),
                    "value": "" if example is None else str(example),
                    "description": (param.get("description") or "")[:500],
                }
            )
        if has_body:
            headers.append({"key": "Content-Type", "value": "application/json"})
        return headers

    def build_body(request_body, op: dict | None = None):
        example = body_from_code_samples(op) if op else None
        if request_body and example is None:
            body = deref(request_body)
            content = body.get("content") or {}
            media = content.get("application/json") or next(
                iter(content.values()), None
            )
            if media:
                media = deref(media)
                if "example" in media:
                    example = media["example"]
                elif isinstance(media.get("examples"), dict) and media["examples"]:
                    first = next(iter(media["examples"].values()))
                    if isinstance(first, dict):
                        example = first.get("value", first)
                    else:
                        example = first
                if example is None:
                    example = example_from_schema(
                        media.get("schema"), skip_readonly=True
                    )
        if example is None:
            return None
        return {
            "mode": "raw",
            "raw": json.dumps(example, ensure_ascii=False, indent=2),
            "options": {"raw": {"language": "json"}},
        }

    def security_auth(security) -> str:
        if not security:
            security = openapi.get("security")
        if not security:
            return "secret"
        for requirement in security:
            if "SecretApiKey" in requirement:
                return "secret"
            if "PublishableApiKey" in requirement:
                return "publishable"
        return "secret"

    def make_request(method: str, path: str, op: dict) -> dict:
        params = list(op.get("parameters") or [])
        body = build_body(op.get("requestBody"), op)
        url = path_to_url(path)
        query = build_query(params)
        if query:
            url["query"] = query
        auth_kind = security_auth(op.get("security"))
        token = "{{secretApiKey}}" if auth_kind == "secret" else "{{publishableApiKey}}"
        name = op.get("summary") or op.get("operationId") or f"{method.upper()} {path}"
        description = (op.get("description") or "").strip()
        docs = f"OpenAPI: `{method.upper()} {path}`"
        if description:
            description = f"{description}\n\n{docs}"
        else:
            description = f"Consultá la documentación de ONVO.\n\n{docs}"

        request = {
            "method": method.upper(),
            "header": build_headers(params, body is not None),
            "auth": {
                "type": "bearer",
                "bearer": [{"key": "token", "value": token, "type": "string"}],
            },
            "url": url,
            "description": description,
        }
        if body:
            request["body"] = body
        return {"name": name, "request": request, "response": []}

    ops_by_tag: dict[str, list] = {tag: [] for tag in tag_order}
    extra_tags: list[str] = []

    for path, path_item in (openapi.get("paths") or {}).items():
        if not isinstance(path_item, dict):
            continue
        path_params = path_item.get("parameters") or []
        for method, op in path_item.items():
            if method.lower() not in HTTP_METHODS or not isinstance(op, dict):
                continue
            op = deepcopy(op)
            op["parameters"] = list(path_params) + list(op.get("parameters") or [])
            tags = op.get("tags") or ["Other"]
            tag = tags[0]
            if tag not in ops_by_tag:
                ops_by_tag[tag] = []
                extra_tags.append(tag)
            ops_by_tag[tag].append(make_request(method, path, op))

    tag_descriptions = {
        tag.get("name"): (tag.get("description") or "")
        for tag in (openapi.get("tags") or [])
        if tag.get("name")
    }

    folders = []
    for tag in tag_order + [t for t in extra_tags if t not in tag_order]:
        items = ops_by_tag.get(tag) or []
        if not items:
            continue
        folders.append(
            {
                "name": tag,
                "description": tag_descriptions.get(tag, ""),
                "item": items,
            }
        )

    collection = {
        "info": {
            "_postman_id": str(uuid.uuid4()),
            "name": "ONVO Pay API",
            "description": (
                "Colección generada desde la documentación oficial de ONVO Pay "
                "(https://docs.onvopay.com) y el OpenAPI (`openapi.yaml`).\n\n"
                "Los folders y requests siguen el orden de la referencia de API.\n\n"
                "Configurá `secretApiKey` y `publishableApiKey` con tus llaves "
                "del Dashboard (modo test o live)."
            ),
            "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
        },
        "auth": {
            "type": "bearer",
            "bearer": [
                {"key": "token", "value": "{{secretApiKey}}", "type": "string"}
            ],
        },
        "variable": [
            {"key": "baseUrl", "value": base_url},
            {"key": "secretApiKey", "value": "onvo_test_secret_key_..."},
            {"key": "publishableApiKey", "value": "onvo_test_publishable_key_..."},
        ],
        "item": folders,
    }

    OUTPUT_PATH.write_text(
        json.dumps(collection, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )

    total = sum(len(folder["item"]) for folder in folders)
    print("Folders:")
    for folder in folders:
        print(f"  {folder['name']}: {len(folder['item'])}")
    print(f"Total requests: {total}")
    print(f"Wrote {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
