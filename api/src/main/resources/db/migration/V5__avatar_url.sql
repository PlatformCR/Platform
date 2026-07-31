-- Google profile picture URL (hosted by Google; we store the URL only)
ALTER TABLE users ADD COLUMN avatar_url VARCHAR(1024);
