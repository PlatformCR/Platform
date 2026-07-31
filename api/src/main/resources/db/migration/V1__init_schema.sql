CREATE TABLE users (
    id              UUID PRIMARY KEY,
    personal_id     VARCHAR(64)  NOT NULL,
    email           VARCHAR(255) NOT NULL,
    password_hash   VARCHAR(255) NOT NULL,
    enabled         BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_users_personal_id UNIQUE (personal_id),
    CONSTRAINT uq_users_email UNIQUE (email)
);

CREATE TABLE sessions (
    id           UUID PRIMARY KEY,
    user_id      UUID         NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    token_hash   VARCHAR(128) NOT NULL,
    expires_at   TIMESTAMP    NOT NULL,
    revoked_at   TIMESTAMP,
    created_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_sessions_token_hash UNIQUE (token_hash)
);

CREATE INDEX idx_sessions_user_id ON sessions (user_id);
CREATE INDEX idx_sessions_expires_at ON sessions (expires_at);

CREATE TABLE roles (
    id          UUID PRIMARY KEY,
    code        VARCHAR(64)  NOT NULL,
    name        VARCHAR(128) NOT NULL,
    description VARCHAR(512),
    created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_roles_code UNIQUE (code)
);

CREATE TABLE permissions (
    id          UUID PRIMARY KEY,
    code        VARCHAR(128) NOT NULL,
    name        VARCHAR(128) NOT NULL,
    description VARCHAR(512),
    created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_permissions_code UNIQUE (code)
);

CREATE TABLE role_permissions (
    role_id       UUID NOT NULL REFERENCES roles (id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES permissions (id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE user_roles (
    user_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES roles (id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

CREATE TABLE assets (
    id            UUID PRIMARY KEY,
    object_key    VARCHAR(512) NOT NULL,
    url           VARCHAR(1024) NOT NULL,
    content_type  VARCHAR(128) NOT NULL,
    size_bytes    BIGINT       NOT NULL,
    uploaded_by   UUID REFERENCES users (id) ON DELETE SET NULL,
    created_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_assets_object_key UNIQUE (object_key)
);
