-- Insertar usuarios de prueba para tests

-- Insertar usuario administrador
INSERT INTO users (id, username, password, email, first_name, last_name, role, position, department, active, created_at, updated_at)
VALUES (1, 'admin', '$2a$10$WpD2XYoCOJRS/4sMniLhGeEuAhvjmjQafgnP1kWHf537L/tBRD0fy', 'admin@bitacora.com', 'Administrador', 'Sistema', 'ADMIN', 'Administrador de Sistema', 'Sistemas', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insertar usuario regular
INSERT INTO users (id, username, password, email, first_name, last_name, role, position, department, active, created_at, updated_at)
VALUES (2, 'usuario', '$2a$10$JyAzLeXpy3mAv/sC1bJ6Kuf4kCst0jKEbeO8vTToHzveJbp7z80vG', 'usuario@bitacora.com', 'Usuario', 'Regular', 'USUARIO', 'Operador', 'Operaciones', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insertar usuario de prueba
INSERT INTO users (id, username, password, email, first_name, last_name, role, position, department, active, created_at, updated_at)
VALUES (3, 'testuser', '$2a$10$sssEUdwJs884.Nsm7nN7SOkbIHlcyYG1VOGUs8n50FQUYK1S.ILSi', 'test@bitacora.com', 'Test', 'User', 'ADMIN', 'Tester', 'QA', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insertar permisos para el administrador
INSERT INTO user_permissions (user_id, permission) VALUES
(1, 'READ_ACTIVITIES'),
(1, 'WRITE_ACTIVITIES'),
(1, 'DELETE_ACTIVITIES'),
(1, 'READ_USERS'),
(1, 'WRITE_USERS'),
(1, 'DELETE_USERS'),
(1, 'GENERATE_REPORTS'),
(1, 'REQUEST_ACTIVITIES'),
(1, 'ASSIGN_ACTIVITIES'),
(1, 'EXECUTE_ACTIVITIES'),
(1, 'APPROVE_ACTIVITIES');

-- Insertar permisos para el usuario regular
INSERT INTO user_permissions (user_id, permission) VALUES
(2, 'READ_ACTIVITIES'),
(2, 'WRITE_ACTIVITIES'),
(2, 'REQUEST_ACTIVITIES'),
(2, 'EXECUTE_ACTIVITIES');

-- Insertar permisos para el usuario de prueba
INSERT INTO user_permissions (user_id, permission) VALUES
(3, 'READ_ACTIVITIES'),
(3, 'WRITE_ACTIVITIES'),
(3, 'DELETE_ACTIVITIES'),
(3, 'READ_USERS'),
(3, 'WRITE_USERS'),
(3, 'DELETE_USERS'),
(3, 'GENERATE_REPORTS'),
(3, 'REQUEST_ACTIVITIES'),
(3, 'ASSIGN_ACTIVITIES'),
(3, 'EXECUTE_ACTIVITIES'),
(3, 'APPROVE_ACTIVITIES');
