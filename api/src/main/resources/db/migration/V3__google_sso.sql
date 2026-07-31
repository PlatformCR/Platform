-- MVP2: Google SSO support
ALTER TABLE users ADD COLUMN google_sub VARCHAR(128);
ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;
CREATE UNIQUE INDEX uq_users_google_sub ON users (google_sub);
