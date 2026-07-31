-- Seed roles and permissions only (users created by DataSeeder with BCrypt)

INSERT INTO roles (id, code, name, description) VALUES
    ('11111111-1111-1111-1111-111111111101', 'ADMIN', 'Administrator', 'Full access'),
    ('11111111-1111-1111-1111-111111111102', 'USER', 'User', 'Standard user');

INSERT INTO permissions (id, code, name, description) VALUES
    ('22222222-2222-2222-2222-222222222201', 'auth.me', 'View own profile', 'Access /api/auth/me'),
    ('22222222-2222-2222-2222-222222222202', 'users.read', 'Read users', 'Placeholder for future user listing'),
    ('22222222-2222-2222-2222-222222222203', 'assets.upload', 'Upload assets', 'Upload media files');

INSERT INTO role_permissions (role_id, permission_id) VALUES
    ('11111111-1111-1111-1111-111111111101', '22222222-2222-2222-2222-222222222201'),
    ('11111111-1111-1111-1111-111111111101', '22222222-2222-2222-2222-222222222202'),
    ('11111111-1111-1111-1111-111111111101', '22222222-2222-2222-2222-222222222203'),
    ('11111111-1111-1111-1111-111111111102', '22222222-2222-2222-2222-222222222201'),
    ('11111111-1111-1111-1111-111111111102', '22222222-2222-2222-2222-222222222203');
