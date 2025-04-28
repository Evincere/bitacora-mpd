-- V8__Add_Employees_From_CSV.sql
-- Migración para agregar usuarios desde el archivo @empleados_todos.csv

-- Actualizar el usuario admin para que sea Semper Evincere
UPDATE users
SET first_name = 'Semper',
    last_name = 'Evincere',
    email = 'admin@mpd.gov.ar',
    position = 'Administrador de Sistema',
    department = 'Sistemas'
WHERE username = 'admin';

-- Eliminar actividades asociadas a usuarios que no sean admin
DELETE FROM activities WHERE user_id IN (SELECT id FROM users WHERE username != 'admin');

-- Eliminar permisos de usuarios que no sean admin
DELETE FROM user_permissions WHERE user_id IN (SELECT id FROM users WHERE username != 'admin');

-- Eliminar usuarios que no sean admin
DELETE FROM users WHERE username != 'admin';

-- Insertar usuarios desde el archivo CSV
-- Legajo 1001 - Juan Perez - SOLICITANTE
INSERT INTO users (
    username,
    password,
    email,
    first_name,
    last_name,
    role,
    position,
    department,
    active,
    created_at,
    updated_at
) VALUES (
    '28456789',
    '$2a$10$Nt/Ov0Ek1QGLQCnzTnXoUeRwX1WvUVxJgXJQA4U1aMeR4x3KcLcHO', -- Contraseña: 1001
    'juan.perez@mpd.gov.ar',
    'Juan',
    'Perez',
    'SOLICITANTE',
    'Ejecutivo de Ventas',
    'Ventas',
    TRUE,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Insertar permisos para Juan Perez
INSERT INTO user_permissions (user_id, permission)
SELECT id, 'READ_ACTIVITIES' FROM users WHERE username = '28456789';
INSERT INTO user_permissions (user_id, permission)
SELECT id, 'WRITE_ACTIVITIES' FROM users WHERE username = '28456789';

-- Legajo 1002 - Maria Gonzalez - SOLICITANTE
INSERT INTO users (
    username,
    password,
    email,
    first_name,
    last_name,
    role,
    position,
    department,
    active,
    created_at,
    updated_at
) VALUES (
    '30123456',
    '$2a$10$WpD2XYoCOJRS/4sMniLhGeEuAhvjmjQafgnP1kWHf537L/tBRD0fy', -- Contraseña: 1002
    'maria.gonzalez@mpd.gov.ar',
    'Maria',
    'Gonzalez',
    'SOLICITANTE',
    'Analista de Marketing',
    'Marketing',
    TRUE,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Insertar permisos para Maria Gonzalez
INSERT INTO user_permissions (user_id, permission)
SELECT id, 'READ_ACTIVITIES' FROM users WHERE username = '30123456';
INSERT INTO user_permissions (user_id, permission)
SELECT id, 'WRITE_ACTIVITIES' FROM users WHERE username = '30123456';

-- Legajo 1003 - Carlos Rodriguez - EJECUTOR
INSERT INTO users (
    username,
    password,
    email,
    first_name,
    last_name,
    role,
    position,
    department,
    active,
    created_at,
    updated_at
) VALUES (
    '25789012',
    '$2a$10$WpD2XYoCOJRS/4sMniLhGeEuAhvjmjQafgnP1kWHf537L/tBRD0fy', -- Contraseña: 1003
    'carlos.rodriguez@mpd.gov.ar',
    'Carlos',
    'Rodriguez',
    'EJECUTOR',
    'Desarrollador Senior',
    'Sistemas',
    TRUE,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Insertar permisos para Carlos Rodriguez
INSERT INTO user_permissions (user_id, permission)
SELECT id, 'READ_ACTIVITIES' FROM users WHERE username = '25789012';
INSERT INTO user_permissions (user_id, permission)
SELECT id, 'WRITE_ACTIVITIES' FROM users WHERE username = '25789012';

-- Legajo 1004 - Laura Martinez - SOLICITANTE
INSERT INTO users (
    username,
    password,
    email,
    first_name,
    last_name,
    role,
    position,
    department,
    active,
    created_at,
    updated_at
) VALUES (
    '33456123',
    '$2a$10$WpD2XYoCOJRS/4sMniLhGeEuAhvjmjQafgnP1kWHf537L/tBRD0fy', -- Contraseña: 1004
    'laura.martinez@mpd.gov.ar',
    'Laura',
    'Martinez',
    'SOLICITANTE',
    'Analista de RRHH',
    'Recursos Humanos',
    TRUE,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Insertar permisos para Laura Martinez
INSERT INTO user_permissions (user_id, permission)
SELECT id, 'READ_ACTIVITIES' FROM users WHERE username = '33456123';
INSERT INTO user_permissions (user_id, permission)
SELECT id, 'WRITE_ACTIVITIES' FROM users WHERE username = '33456123';

-- Legajo 1005 - Diego Fernandez - EJECUTOR
INSERT INTO users (
    username,
    password,
    email,
    first_name,
    last_name,
    role,
    position,
    department,
    active,
    created_at,
    updated_at
) VALUES (
    '27890345',
    '$2a$10$WpD2XYoCOJRS/4sMniLhGeEuAhvjmjQafgnP1kWHf537L/tBRD0fy', -- Contraseña: 1005
    'diego.fernandez@mpd.gov.ar',
    'Diego',
    'Fernandez',
    'EJECUTOR',
    'Contador',
    'Finanzas',
    TRUE,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Insertar permisos para Diego Fernandez
INSERT INTO user_permissions (user_id, permission)
SELECT id, 'READ_ACTIVITIES' FROM users WHERE username = '27890345';
INSERT INTO user_permissions (user_id, permission)
SELECT id, 'WRITE_ACTIVITIES' FROM users WHERE username = '27890345';

-- Legajo 1006 - Ana Lopez - SOLICITANTE
INSERT INTO users (
    username,
    password,
    email,
    first_name,
    last_name,
    role,
    position,
    department,
    active,
    created_at,
    updated_at
) VALUES (
    '31234567',
    '$2a$10$WpD2XYoCOJRS/4sMniLhGeEuAhvjmjQafgnP1kWHf537L/tBRD0fy', -- Contraseña: 1006
    'ana.lopez@mpd.gov.ar',
    'Ana',
    'Lopez',
    'SOLICITANTE',
    'Gerente de Ventas',
    'Ventas',
    TRUE,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Insertar permisos para Ana Lopez
INSERT INTO user_permissions (user_id, permission)
SELECT id, 'READ_ACTIVITIES' FROM users WHERE username = '31234567';
INSERT INTO user_permissions (user_id, permission)
SELECT id, 'WRITE_ACTIVITIES' FROM users WHERE username = '31234567';

-- Legajo 1007 - Pablo Sanchez - EJECUTOR
INSERT INTO users (
    username,
    password,
    email,
    first_name,
    last_name,
    role,
    position,
    department,
    active,
    created_at,
    updated_at
) VALUES (
    '29876543',
    '$2a$10$WpD2XYoCOJRS/4sMniLhGeEuAhvjmjQafgnP1kWHf537L/tBRD0fy', -- Contraseña: 1007
    'pablo.sanchez@mpd.gov.ar',
    'Pablo',
    'Sanchez',
    'EJECUTOR',
    'Administrador de Sistemas',
    'Sistemas',
    TRUE,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Insertar permisos para Pablo Sanchez
INSERT INTO user_permissions (user_id, permission)
SELECT id, 'READ_ACTIVITIES' FROM users WHERE username = '29876543';
INSERT INTO user_permissions (user_id, permission)
SELECT id, 'WRITE_ACTIVITIES' FROM users WHERE username = '29876543';

-- Legajo 1008 - Adriana Sanchez - ASIGNADOR (único usuario con este rol)
INSERT INTO users (
    username,
    password,
    email,
    first_name,
    last_name,
    role,
    position,
    department,
    active,
    created_at,
    updated_at
) VALUES (
    '32345678',
    '$2a$10$WpD2XYoCOJRS/4sMniLhGeEuAhvjmjQafgnP1kWHf537L/tBRD0fy', -- Contraseña: 1008
    'adriana.sanchez@mpd.gov.ar',
    'Adriana',
    'Sanchez',
    'ASIGNADOR',
    'Coordinadora de Operaciones',
    'Operaciones',
    TRUE,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Insertar permisos para Adriana Sanchez (ASIGNADOR)
INSERT INTO user_permissions (user_id, permission)
SELECT id, 'READ_ACTIVITIES' FROM users WHERE username = '32345678';
INSERT INTO user_permissions (user_id, permission)
SELECT id, 'WRITE_ACTIVITIES' FROM users WHERE username = '32345678';
INSERT INTO user_permissions (user_id, permission)
SELECT id, 'READ_USERS' FROM users WHERE username = '32345678';
INSERT INTO user_permissions (user_id, permission)
SELECT id, 'GENERATE_REPORTS' FROM users WHERE username = '32345678';

-- Legajo 1009 - Roberto Diaz - EJECUTOR
INSERT INTO users (
    username,
    password,
    email,
    first_name,
    last_name,
    role,
    position,
    department,
    active,
    created_at,
    updated_at
) VALUES (
    '26789012',
    '$2a$10$WpD2XYoCOJRS/4sMniLhGeEuAhvjmjQafgnP1kWHf537L/tBRD0fy', -- Contraseña: 1009
    'roberto.diaz@mpd.gov.ar',
    'Roberto',
    'Diaz',
    'EJECUTOR',
    'Supervisor de Logística',
    'Logistica',
    TRUE,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Insertar permisos para Roberto Diaz
INSERT INTO user_permissions (user_id, permission)
SELECT id, 'READ_ACTIVITIES' FROM users WHERE username = '26789012';
INSERT INTO user_permissions (user_id, permission)
SELECT id, 'WRITE_ACTIVITIES' FROM users WHERE username = '26789012';

-- Legajo 1010 - Lucia Torres - SOLICITANTE
INSERT INTO users (
    username,
    password,
    email,
    first_name,
    last_name,
    role,
    position,
    department,
    active,
    created_at,
    updated_at
) VALUES (
    '34567890',
    '$2a$10$WpD2XYoCOJRS/4sMniLhGeEuAhvjmjQafgnP1kWHf537L/tBRD0fy', -- Contraseña: 1010
    'lucia.torres@mpd.gov.ar',
    'Lucia',
    'Torres',
    'SOLICITANTE',
    'Diseñadora Gráfica',
    'Marketing',
    TRUE,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Insertar permisos para Lucia Torres
INSERT INTO user_permissions (user_id, permission)
SELECT id, 'READ_ACTIVITIES' FROM users WHERE username = '34567890';
INSERT INTO user_permissions (user_id, permission)
SELECT id, 'WRITE_ACTIVITIES' FROM users WHERE username = '34567890';

-- Legajo 1011 - Miguel Ramirez - EJECUTOR
INSERT INTO users (
    username,
    password,
    email,
    first_name,
    last_name,
    role,
    position,
    department,
    active,
    created_at,
    updated_at
) VALUES (
    '28901234',
    '$2a$10$WpD2XYoCOJRS/4sMniLhGeEuAhvjmjQafgnP1kWHf537L/tBRD0fy', -- Contraseña: 1011
    'miguel.ramirez@mpd.gov.ar',
    'Miguel',
    'Ramirez',
    'EJECUTOR',
    'Desarrollador Frontend',
    'Sistemas',
    TRUE,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Insertar permisos para Miguel Ramirez
INSERT INTO user_permissions (user_id, permission)
SELECT id, 'READ_ACTIVITIES' FROM users WHERE username = '28901234';
INSERT INTO user_permissions (user_id, permission)
SELECT id, 'WRITE_ACTIVITIES' FROM users WHERE username = '28901234';

-- Legajo 1012 - Valeria Acosta - SOLICITANTE
INSERT INTO users (
    username,
    password,
    email,
    first_name,
    last_name,
    role,
    position,
    department,
    active,
    created_at,
    updated_at
) VALUES (
    '31456789',
    '$2a$10$WpD2XYoCOJRS/4sMniLhGeEuAhvjmjQafgnP1kWHf537L/tBRD0fy', -- Contraseña: 1012
    'valeria.acosta@mpd.gov.ar',
    'Valeria',
    'Acosta',
    'SOLICITANTE',
    'Reclutadora',
    'Recursos Humanos',
    TRUE,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Insertar permisos para Valeria Acosta
INSERT INTO user_permissions (user_id, permission)
SELECT id, 'READ_ACTIVITIES' FROM users WHERE username = '31456789';
INSERT INTO user_permissions (user_id, permission)
SELECT id, 'WRITE_ACTIVITIES' FROM users WHERE username = '31456789';

-- Legajo 1013 - Federico Morales - EJECUTOR
INSERT INTO users (
    username,
    password,
    email,
    first_name,
    last_name,
    role,
    position,
    department,
    active,
    created_at,
    updated_at
) VALUES (
    '27345678',
    '$2a$10$WpD2XYoCOJRS/4sMniLhGeEuAhvjmjQafgnP1kWHf537L/tBRD0fy', -- Contraseña: 1013
    'federico.morales@mpd.gov.ar',
    'Federico',
    'Morales',
    'EJECUTOR',
    'Analista Financiero',
    'Finanzas',
    TRUE,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Insertar permisos para Federico Morales
INSERT INTO user_permissions (user_id, permission)
SELECT id, 'READ_ACTIVITIES' FROM users WHERE username = '27345678';
INSERT INTO user_permissions (user_id, permission)
SELECT id, 'WRITE_ACTIVITIES' FROM users WHERE username = '27345678';

-- Legajo 1014 - Natalia Herrera - SOLICITANTE
INSERT INTO users (
    username,
    password,
    email,
    first_name,
    last_name,
    role,
    position,
    department,
    active,
    created_at,
    updated_at
) VALUES (
    '33210987',
    '$2a$10$WpD2XYoCOJRS/4sMniLhGeEuAhvjmjQafgnP1kWHf537L/tBRD0fy', -- Contraseña: 1014
    'natalia.herrera@mpd.gov.ar',
    'Natalia',
    'Herrera',
    'SOLICITANTE',
    'Ejecutiva de Cuentas',
    'Ventas',
    TRUE,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Insertar permisos para Natalia Herrera
INSERT INTO user_permissions (user_id, permission)
SELECT id, 'READ_ACTIVITIES' FROM users WHERE username = '33210987';
INSERT INTO user_permissions (user_id, permission)
SELECT id, 'WRITE_ACTIVITIES' FROM users WHERE username = '33210987';

-- Legajo 1015 - Javier Castro - EJECUTOR
INSERT INTO users (
    username,
    password,
    email,
    first_name,
    last_name,
    role,
    position,
    department,
    active,
    created_at,
    updated_at
) VALUES (
    '29654321',
    '$2a$10$WpD2XYoCOJRS/4sMniLhGeEuAhvjmjQafgnP1kWHf537L/tBRD0fy', -- Contraseña: 1015
    'javier.castro@mpd.gov.ar',
    'Javier',
    'Castro',
    'EJECUTOR',
    'Desarrollador Backend',
    'Sistemas',
    TRUE,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Insertar permisos para Javier Castro
INSERT INTO user_permissions (user_id, permission)
SELECT id, 'READ_ACTIVITIES' FROM users WHERE username = '29654321';
INSERT INTO user_permissions (user_id, permission)
SELECT id, 'WRITE_ACTIVITIES' FROM users WHERE username = '29654321';

-- Legajo 1016 - Camila Ortiz - SOLICITANTE
INSERT INTO users (
    username,
    password,
    email,
    first_name,
    last_name,
    role,
    position,
    department,
    active,
    created_at,
    updated_at
) VALUES (
    '32109876',
    '$2a$10$WpD2XYoCOJRS/4sMniLhGeEuAhvjmjQafgnP1kWHf537L/tBRD0fy', -- Contraseña: 1016
    'camila.ortiz@mpd.gov.ar',
    'Camila',
    'Ortiz',
    'SOLICITANTE',
    'Community Manager',
    'Marketing',
    TRUE,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Insertar permisos para Camila Ortiz
INSERT INTO user_permissions (user_id, permission)
SELECT id, 'READ_ACTIVITIES' FROM users WHERE username = '32109876';
INSERT INTO user_permissions (user_id, permission)
SELECT id, 'WRITE_ACTIVITIES' FROM users WHERE username = '32109876';

-- Legajo 1017 - Alejandro Rios - EJECUTOR
INSERT INTO users (
    username,
    password,
    email,
    first_name,
    last_name,
    role,
    position,
    department,
    active,
    created_at,
    updated_at
) VALUES (
    '26543210',
    '$2a$10$WpD2XYoCOJRS/4sMniLhGeEuAhvjmjQafgnP1kWHf537L/tBRD0fy', -- Contraseña: 1017
    'alejandro.rios@mpd.gov.ar',
    'Alejandro',
    'Rios',
    'EJECUTOR',
    'Coordinador de Distribución',
    'Logistica',
    TRUE,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Insertar permisos para Alejandro Rios
INSERT INTO user_permissions (user_id, permission)
SELECT id, 'READ_ACTIVITIES' FROM users WHERE username = '26543210';
INSERT INTO user_permissions (user_id, permission)
SELECT id, 'WRITE_ACTIVITIES' FROM users WHERE username = '26543210';

-- Legajo 1018 - Daniela Vargas - SOLICITANTE
INSERT INTO users (
    username,
    password,
    email,
    first_name,
    last_name,
    role,
    position,
    department,
    active,
    created_at,
    updated_at
) VALUES (
    '34321098',
    '$2a$10$WpD2XYoCOJRS/4sMniLhGeEuAhvjmjQafgnP1kWHf537L/tBRD0fy', -- Contraseña: 1018
    'daniela.vargas@mpd.gov.ar',
    'Daniela',
    'Vargas',
    'SOLICITANTE',
    'Especialista en Compensaciones',
    'Recursos Humanos',
    TRUE,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Insertar permisos para Daniela Vargas
INSERT INTO user_permissions (user_id, permission)
SELECT id, 'READ_ACTIVITIES' FROM users WHERE username = '34321098';
INSERT INTO user_permissions (user_id, permission)
SELECT id, 'WRITE_ACTIVITIES' FROM users WHERE username = '34321098';

-- Legajo 1019 - Matias Silva - EJECUTOR
INSERT INTO users (
    username,
    password,
    email,
    first_name,
    last_name,
    role,
    position,
    department,
    active,
    created_at,
    updated_at
) VALUES (
    '28765432',
    '$2a$10$WpD2XYoCOJRS/4sMniLhGeEuAhvjmjQafgnP1kWHf537L/tBRD0fy', -- Contraseña: 1019
    'matias.silva@mpd.gov.ar',
    'Matias',
    'Silva',
    'EJECUTOR',
    'Auditor',
    'Finanzas',
    TRUE,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Insertar permisos para Matias Silva
INSERT INTO user_permissions (user_id, permission)
SELECT id, 'READ_ACTIVITIES' FROM users WHERE username = '28765432';
INSERT INTO user_permissions (user_id, permission)
SELECT id, 'WRITE_ACTIVITIES' FROM users WHERE username = '28765432';

-- Legajo 1020 - Carolina Mendoza - SOLICITANTE
INSERT INTO users (
    username,
    password,
    email,
    first_name,
    last_name,
    role,
    position,
    department,
    active,
    created_at,
    updated_at
) VALUES (
    '31098765',
    '$2a$10$WpD2XYoCOJRS/4sMniLhGeEuAhvjmjQafgnP1kWHf537L/tBRD0fy', -- Contraseña: 1020
    'carolina.mendoza@mpd.gov.ar',
    'Carolina',
    'Mendoza',
    'SOLICITANTE',
    'Ejecutiva de Ventas Senior',
    'Ventas',
    TRUE,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Insertar permisos para Carolina Mendoza
INSERT INTO user_permissions (user_id, permission)
SELECT id, 'READ_ACTIVITIES' FROM users WHERE username = '31098765';
INSERT INTO user_permissions (user_id, permission)
SELECT id, 'WRITE_ACTIVITIES' FROM users WHERE username = '31098765';
