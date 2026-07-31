# Google Cloud — OAuth / SSO setup (local)

How to create the Google Cloud pieces Platform needs for **Continue with Google** (OIDC ID token via Google Identity Services).

Product plan: [00-Planning/MVP2.md](../00-Planning/MVP2.md) · security detail: [00-Planning/03-security.md](../00-Planning/03-security.md).

## Cost

Creating a Google Cloud **project**, configuring the **OAuth consent screen**, and creating an **OAuth Web client ID** for Sign-In / SSO testing does **not** bill you for typical use. Google Identity / OAuth login is free for normal development and testing.

The free trial credit ($100, etc.) is mainly for other Cloud products (VMs, databases, …). You can still set a **budget alert** under Billing if you want peace of mind.

**Do not** commit Client IDs or secrets to git. Use local env files (gitignored).

---

## What you will create

| Piece | Purpose |
|-------|---------|
| Google Cloud project | Container for credentials |
| OAuth consent screen | What users see when approving login; test users while in Testing |
| OAuth client ID (Web application) | Identifies Platform to Google; used by the web app and verified by the API (`aud`) |

For our flow (browser GIS → ID token → `POST /api/auth/oauth/google`), you need the **Client ID**. A **Client secret** is not required for ID-token verification with Google’s JWKS.

---

## Step-by-step

### 1. Open Google Cloud and create a project

1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Top bar → project picker → **New Project**.
3. Name e.g. `Platform` → **Create**.
4. Select that project so it is active in the top bar.

### 2. OAuth consent screen

1. Menu ☰ → **APIs & Services** → **OAuth consent screen**  
   (Spanish UI: **APIs y servicios** → **Pantalla de consentimiento de OAuth**).
2. User type: **External** (unless you only use an internal Google Workspace) → **Create**.
3. Fill:
   - **App name:** `Platform`
   - **User support email:** your email
   - **Developer contact:** your email  
   → **Save and Continue**.
4. **Scopes:** keep defaults / continue (GIS uses `openid`, `email`, `profile`).
5. **Test users:** **Add users** → add **your Gmail** → Save.  
   While the app is in **Testing**, only listed test users can sign in.
6. Finish to the dashboard.

### 3. Create OAuth client ID (Web)

1. **APIs & Services** → **Credentials** (**Credenciales**).
2. **+ Create credentials** → **OAuth client ID**.
3. **Application type:** **Web application**.
4. **Name:** e.g. `Platform Web`.
5. **Authorized JavaScript origins** → add:
   ```text
   http://localhost:5173
   ```
6. **Authorized redirect URIs:** leave empty for the GIS ID-token flow.  
   If the console requires at least one URI, you may add `http://localhost:5173`.
7. **Create**.
8. Copy the **Client ID** (`….apps.googleusercontent.com`).  
   Store the Client secret privately if shown; we do not need it for phase A.

Config can take a few minutes (sometimes longer) to apply.

### 4. Local env (when wiring the app)

Same Client ID in both places (examples — files must stay gitignored):

**Web** (`web/.env.local`):

```bash
VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
```

**API** (env or local override):

```bash
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
```

Never commit real values. Prefer `.env.example` with placeholders only.

### 5. Later (production)

When you deploy the web app (e.g. Vercel):

1. Edit the same OAuth client.
2. Add your production origin, e.g. `https://your-app.vercel.app`.
3. Publish the OAuth app (or keep Testing and add more test users) as needed.

---

## Checklist

- [ ] Google Cloud project created and selected
- [ ] OAuth consent screen (External) configured
- [ ] Your Gmail added as **test user**
- [ ] OAuth client type **Web application**
- [ ] JavaScript origin `http://localhost:5173`
- [ ] Client ID copied to a password manager / local env (not git)
- [ ] Budget alert optional under Billing

---

## How this ties to Platform SSO

```text
Browser (Vite :5173)
  → Google Identity Services (uses Client ID)
  → ID token
  → POST /api/auth/oauth/google { idToken }
  → API verifies token (aud must equal Client ID)
  → Platform session (same as password login)
```

Related GitHub issues (MVP2 phase A): schema → register → Google config → SSO API → GIS button → docs.

## Related

- Run the stack: [HOW-TO-RUN.md](HOW-TO-RUN.md)
- MVP2 plan: [../00-Planning/MVP2.md](../00-Planning/MVP2.md)
- Auth / Google SSO rules: [../00-Planning/03-security.md](../00-Planning/03-security.md)
