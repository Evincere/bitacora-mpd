-- V14__Add_Workflow_Permissions.sql
-- Migración para agregar permisos específicos para el flujo de trabajo de actividades

-- Agregar permisos específicos para el flujo de trabajo a los usuarios existentes
INSERT INTO user_permissions (user_id, permission)
SELECT u.id, 'REQUEST_ACTIVITIES'
FROM users u
WHERE u.username IN ('admin', 'testuser')
AND NOT EXISTS (SELECT 1 FROM user_permissions WHERE user_id = u.id AND permission = 'REQUEST_ACTIVITIES');

INSERT INTO user_permissions (user_id, permission)
SELECT u.id, 'ASSIGN_ACTIVITIES'
FROM users u
WHERE u.username IN ('admin', 'testuser')
AND NOT EXISTS (SELECT 1 FROM user_permissions WHERE user_id = u.id AND permission = 'ASSIGN_ACTIVITIES');

INSERT INTO user_permissions (user_id, permission)
SELECT u.id, 'EXECUTE_ACTIVITIES'
FROM users u
WHERE u.username IN ('admin', 'testuser')
AND NOT EXISTS (SELECT 1 FROM user_permissions WHERE user_id = u.id AND permission = 'EXECUTE_ACTIVITIES');

INSERT INTO user_permissions (user_id, permission)
SELECT u.id, 'APPROVE_ACTIVITIES'
FROM users u
WHERE u.username IN ('admin', 'testuser')
AND NOT EXISTS (SELECT 1 FROM user_permissions WHERE user_id = u.id AND permission = 'APPROVE_ACTIVITIES');

-- Agregar permisos específicos para usuarios con roles específicos
-- SOLICITANTE
INSERT INTO user_permissions (user_id, permission)
SELECT u.id, 'REQUEST_ACTIVITIES'
FROM users u
WHERE u.role = 'SOLICITANTE'
AND NOT EXISTS (SELECT 1 FROM user_permissions WHERE user_id = u.id AND permission = 'REQUEST_ACTIVITIES');

-- ASIGNADOR
INSERT INTO user_permissions (user_id, permission)
SELECT u.id, 'ASSIGN_ACTIVITIES'
FROM users u
WHERE u.role = 'ASIGNADOR'
AND NOT EXISTS (SELECT 1 FROM user_permissions WHERE user_id = u.id AND permission = 'ASSIGN_ACTIVITIES');

-- EJECUTOR
INSERT INTO user_permissions (user_id, permission)
SELECT u.id, 'EXECUTE_ACTIVITIES'
FROM users u
WHERE u.role = 'EJECUTOR'
AND NOT EXISTS (SELECT 1 FROM user_permissions WHERE user_id = u.id AND permission = 'EXECUTE_ACTIVITIES');

-- ADMIN (todos los permisos)
INSERT INTO user_permissions (user_id, permission)
SELECT u.id, 'REQUEST_ACTIVITIES'
FROM users u
WHERE u.role = 'ADMIN'
AND NOT EXISTS (SELECT 1 FROM user_permissions WHERE user_id = u.id AND permission = 'REQUEST_ACTIVITIES');

INSERT INTO user_permissions (user_id, permission)
SELECT u.id, 'ASSIGN_ACTIVITIES'
FROM users u
WHERE u.role = 'ADMIN'
AND NOT EXISTS (SELECT 1 FROM user_permissions WHERE user_id = u.id AND permission = 'ASSIGN_ACTIVITIES');

INSERT INTO user_permissions (user_id, permission)
SELECT u.id, 'EXECUTE_ACTIVITIES'
FROM users u
WHERE u.role = 'ADMIN'
AND NOT EXISTS (SELECT 1 FROM user_permissions WHERE user_id = u.id AND permission = 'EXECUTE_ACTIVITIES');

INSERT INTO user_permissions (user_id, permission)
SELECT u.id, 'APPROVE_ACTIVITIES'
FROM users u
WHERE u.role = 'ADMIN'
AND NOT EXISTS (SELECT 1 FROM user_permissions WHERE user_id = u.id AND permission = 'APPROVE_ACTIVITIES');
