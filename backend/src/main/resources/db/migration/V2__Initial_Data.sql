-- Insertar usuario administrador
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
    'admin',
    -- Contraseña: Admin@123 (hasheada con BCrypt)
    '$2a$10$rPiEAgQNIT1TCoKi3Eqq8eVaRaAhaDkVr2lR5DYtYEg3iJZ1L/Wn6',
    'admin@mpd.gov.ar',
    'Administrador',
    'Sistema',
    'ADMIN',
    'Administrador de Sistema',
    'Sistemas',
    TRUE,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Insertar permisos para el administrador
INSERT INTO user_permissions (user_id, permission) VALUES
(1, 'READ_ACTIVITIES'),
(1, 'WRITE_ACTIVITIES'),
(1, 'DELETE_ACTIVITIES'),
(1, 'READ_USERS'),
(1, 'WRITE_USERS'),
(1, 'DELETE_USERS'),
(1, 'GENERATE_REPORTS');

-- Insertar usuario de prueba
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
    'usuario',
    -- Contraseña: Usuario@123 (hasheada con BCrypt)
    '$2a$10$rPiEAgQNIT1TCoKi3Eqq8eVaRaAhaDkVr2lR5DYtYEg3iJZ1L/Wn6',
    'usuario@mpd.gov.ar',
    'Usuario',
    'Prueba',
    'USUARIO',
    'Defensor Público',
    'Defensoría',
    TRUE,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Insertar permisos para el usuario de prueba
INSERT INTO user_permissions (user_id, permission) VALUES
(2, 'READ_ACTIVITIES'),
(2, 'WRITE_ACTIVITIES');

-- Insertar actividades de ejemplo
INSERT INTO activities (
    date,
    type,
    description,
    person,
    role,
    dependency,
    situation,
    result,
    status,
    last_status_change_date,
    comments,
    agent,
    user_id
) VALUES (
    CURRENT_TIMESTAMP - INTERVAL '2 days',
    'REUNION',
    'Reunión con el equipo de desarrollo',
    'Juan Pérez',
    'Coordinador',
    'Dirección de Sistemas',
    'Planificación del sprint',
    'Se definieron las tareas para el próximo sprint',
    'COMPLETADA',
    CURRENT_TIMESTAMP - INTERVAL '1 day',
    'La reunión fue productiva',
    'María López',
    1
);

INSERT INTO activities (
    date,
    type,
    description,
    person,
    role,
    dependency,
    situation,
    result,
    status,
    last_status_change_date,
    comments,
    agent,
    user_id
) VALUES (
    CURRENT_TIMESTAMP - INTERVAL '1 day',
    'AUDIENCIA',
    'Audiencia de conciliación',
    'Pedro Gómez',
    'Defensor',
    'Defensoría Civil',
    'Conflicto vecinal',
    'Se llegó a un acuerdo entre las partes',
    'COMPLETADA',
    CURRENT_TIMESTAMP,
    'Se firmó acta de acuerdo',
    'Ana Rodríguez',
    2
);

INSERT INTO activities (
    date,
    type,
    description,
    person,
    role,
    dependency,
    situation,
    result,
    status,
    last_status_change_date,
    comments,
    agent,
    user_id
) VALUES (
    CURRENT_TIMESTAMP + INTERVAL '1 day',
    'ENTREVISTA',
    'Entrevista con el cliente',
    'Laura Martínez',
    'Asistente Social',
    'Defensoría Penal',
    'Evaluación de situación socioeconómica',
    NULL,
    'PENDIENTE',
    CURRENT_TIMESTAMP,
    'Preparar documentación necesaria',
    'Carlos Sánchez',
    2
);
