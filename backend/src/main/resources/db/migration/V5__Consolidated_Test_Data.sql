-- V5__Consolidated_Test_Data.sql
-- Migración para consolidar todos los datos de prueba en un solo lugar

-- Insertar usuarios de prueba
-- Contraseñas:
-- admin: Admin@123
-- usuario: Usuario@123
-- testuser: test123

-- Comentado porque los usuarios ya existen en la base de datos
-- -- Verificar si el usuario admin ya existe
-- INSERT INTO users (username, password, email, first_name, last_name, role, position, department, active, created_at, updated_at)
-- SELECT 'admin', '$2a$10$bieh3BVExvsBBABMSR.oduEksKK2jQhTd.r0lJQ/.HEqjPsVhH4fe', 'admin@bitacora.com', 'Administrador', 'Sistema', 'ADMIN', 'Administrador de Sistema', 'Sistemas', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
-- WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'admin');
--
-- -- Verificar si el usuario común ya existe
-- INSERT INTO users (username, password, email, first_name, last_name, role, position, department, active, created_at, updated_at)
-- SELECT 'usuario', '$2a$10$pDx3WDEE4Lt7gM4QOIQNkeb9T082kw3MRo8WngXupNCdkUIITLTcu', 'usuario@bitacora.com', 'Usuario', 'Común', 'USUARIO', 'Operador', 'Operaciones', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
-- WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'usuario');
--
-- -- Verificar si el usuario de prueba ya existe
-- INSERT INTO users (username, password, email, first_name, last_name, role, position, department, active, created_at, updated_at)
-- SELECT 'testuser', '$2a$10$ITnemZSRcxdvrM1nRHEhU.tfqocBP1ELIIq3ZLpjGUZ8i6AGQEY3y', 'test@bitacora.com', 'Test', 'User', 'ADMIN', 'Tester', 'QA', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
-- WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'testuser');

-- Insertar permisos para el administrador (solo si no existen)
INSERT INTO user_permissions (user_id, permission)
SELECT u.id, 'READ_ACTIVITIES'
FROM users u
WHERE u.username = 'admin'
AND NOT EXISTS (SELECT 1 FROM user_permissions WHERE user_id = u.id AND permission = 'READ_ACTIVITIES');

INSERT INTO user_permissions (user_id, permission)
SELECT u.id, 'WRITE_ACTIVITIES'
FROM users u
WHERE u.username = 'admin'
AND NOT EXISTS (SELECT 1 FROM user_permissions WHERE user_id = u.id AND permission = 'WRITE_ACTIVITIES');

INSERT INTO user_permissions (user_id, permission)
SELECT u.id, 'DELETE_ACTIVITIES'
FROM users u
WHERE u.username = 'admin'
AND NOT EXISTS (SELECT 1 FROM user_permissions WHERE user_id = u.id AND permission = 'DELETE_ACTIVITIES');

INSERT INTO user_permissions (user_id, permission)
SELECT u.id, 'READ_USERS'
FROM users u
WHERE u.username = 'admin'
AND NOT EXISTS (SELECT 1 FROM user_permissions WHERE user_id = u.id AND permission = 'READ_USERS');

INSERT INTO user_permissions (user_id, permission)
SELECT u.id, 'WRITE_USERS'
FROM users u
WHERE u.username = 'admin'
AND NOT EXISTS (SELECT 1 FROM user_permissions WHERE user_id = u.id AND permission = 'WRITE_USERS');

INSERT INTO user_permissions (user_id, permission)
SELECT u.id, 'DELETE_USERS'
FROM users u
WHERE u.username = 'admin'
AND NOT EXISTS (SELECT 1 FROM user_permissions WHERE user_id = u.id AND permission = 'DELETE_USERS');

INSERT INTO user_permissions (user_id, permission)
SELECT u.id, 'GENERATE_REPORTS'
FROM users u
WHERE u.username = 'admin'
AND NOT EXISTS (SELECT 1 FROM user_permissions WHERE user_id = u.id AND permission = 'GENERATE_REPORTS');

-- Insertar permisos para el usuario común (solo si no existen)
INSERT INTO user_permissions (user_id, permission)
SELECT u.id, 'READ_ACTIVITIES'
FROM users u
WHERE u.username = 'usuario'
AND NOT EXISTS (SELECT 1 FROM user_permissions WHERE user_id = u.id AND permission = 'READ_ACTIVITIES');

INSERT INTO user_permissions (user_id, permission)
SELECT u.id, 'WRITE_ACTIVITIES'
FROM users u
WHERE u.username = 'usuario'
AND NOT EXISTS (SELECT 1 FROM user_permissions WHERE user_id = u.id AND permission = 'WRITE_ACTIVITIES');

-- Insertar permisos para el usuario de prueba (solo si no existen)
INSERT INTO user_permissions (user_id, permission)
SELECT u.id, 'READ_ACTIVITIES'
FROM users u
WHERE u.username = 'testuser'
AND NOT EXISTS (SELECT 1 FROM user_permissions WHERE user_id = u.id AND permission = 'READ_ACTIVITIES');

INSERT INTO user_permissions (user_id, permission)
SELECT u.id, 'WRITE_ACTIVITIES'
FROM users u
WHERE u.username = 'testuser'
AND NOT EXISTS (SELECT 1 FROM user_permissions WHERE user_id = u.id AND permission = 'WRITE_ACTIVITIES');

INSERT INTO user_permissions (user_id, permission)
SELECT u.id, 'DELETE_ACTIVITIES'
FROM users u
WHERE u.username = 'testuser'
AND NOT EXISTS (SELECT 1 FROM user_permissions WHERE user_id = u.id AND permission = 'DELETE_ACTIVITIES');

INSERT INTO user_permissions (user_id, permission)
SELECT u.id, 'READ_USERS'
FROM users u
WHERE u.username = 'testuser'
AND NOT EXISTS (SELECT 1 FROM user_permissions WHERE user_id = u.id AND permission = 'READ_USERS');

INSERT INTO user_permissions (user_id, permission)
SELECT u.id, 'WRITE_USERS'
FROM users u
WHERE u.username = 'testuser'
AND NOT EXISTS (SELECT 1 FROM user_permissions WHERE user_id = u.id AND permission = 'WRITE_USERS');

INSERT INTO user_permissions (user_id, permission)
SELECT u.id, 'DELETE_USERS'
FROM users u
WHERE u.username = 'testuser'
AND NOT EXISTS (SELECT 1 FROM user_permissions WHERE user_id = u.id AND permission = 'DELETE_USERS');

INSERT INTO user_permissions (user_id, permission)
SELECT u.id, 'GENERATE_REPORTS'
FROM users u
WHERE u.username = 'testuser'
AND NOT EXISTS (SELECT 1 FROM user_permissions WHERE user_id = u.id AND permission = 'GENERATE_REPORTS');

-- Insertar datos de ejemplo para actividades (solo si no existen)
-- Actividad 1
INSERT INTO activities (date, type, description, person, role, dependency, situation, result, status, last_status_change_date, comments, agent, created_at, updated_at, user_id)
SELECT '2025-04-15 10:30:00', 'OTRO', 'Atención a Juan Pérez por consulta sobre expediente 123/2025', 'Juan Pérez', 'Abogado', 'Estudio Jurídico ABC', 'El solicitante requiere información sobre el estado actual del expediente 123/2025 relacionado con un trámite administrativo.', 'Se proporcionó la información solicitada y se indicó que el expediente se encuentra en revisión por el departamento legal.', 'COMPLETADA', '2025-04-15 11:45:00', 'El solicitante quedó conforme con la información proporcionada.', 'Administrador Sistema', '2025-04-15 10:30:00', '2025-04-15 11:45:00', u.id
FROM users u
WHERE u.username = 'admin'
AND NOT EXISTS (
    SELECT 1 FROM activities
    WHERE description = 'Atención a Juan Pérez por consulta sobre expediente 123/2025'
);

-- Actividad 2
INSERT INTO activities (date, type, description, person, role, dependency, situation, result, status, last_status_change_date, comments, agent, created_at, updated_at, user_id)
SELECT '2025-04-15 14:00:00', 'OTRO', 'Llamada de Carlos Rodríguez sobre documentación pendiente', 'Carlos Rodríguez', 'Contador', 'Consultora XYZ', 'El solicitante llama para consultar sobre documentación pendiente para completar un trámite.', 'Se informó sobre los documentos faltantes y se acordó que los enviará por correo electrónico.', 'EN_PROGRESO', '2025-04-15 14:30:00', 'Pendiente recepción de documentos por correo.', 'Usuario Común', '2025-04-15 14:00:00', '2025-04-15 14:30:00', u.id
FROM users u
WHERE u.username = 'usuario'
AND NOT EXISTS (
    SELECT 1 FROM activities
    WHERE description = 'Llamada de Carlos Rodríguez sobre documentación pendiente'
);

-- Actividad 3
INSERT INTO activities (date, type, description, person, role, dependency, situation, result, status, last_status_change_date, comments, agent, created_at, updated_at, user_id)
SELECT '2025-04-16 09:15:00', 'OTRO', 'Evaluación de candidatos para puesto de desarrollador', 'Comité de Selección', 'RRHH', 'Departamento de Recursos Humanos', 'Se requiere evaluar a 5 candidatos preseleccionados para el puesto de desarrollador senior.', 'Se realizaron entrevistas técnicas y se seleccionaron 2 finalistas para la siguiente etapa.', 'EN_PROGRESO', '2025-04-16 12:30:00', 'Los finalistas serán entrevistados por el director del área la próxima semana.', 'Administrador Sistema', '2025-04-16 09:15:00', '2025-04-16 12:30:00', u.id
FROM users u
WHERE u.username = 'admin'
AND NOT EXISTS (
    SELECT 1 FROM activities
    WHERE description = 'Evaluación de candidatos para puesto de desarrollador'
);

-- Actividad 4
INSERT INTO activities (date, type, description, person, role, dependency, situation, result, status, last_status_change_date, comments, agent, created_at, updated_at, user_id)
SELECT '2025-04-16 11:00:00', 'OTRO', 'Solicitud de información sobre requisitos para licitación', 'Laura Gómez', 'Gerente de Proyectos', 'Empresa Constructora ABC', 'La solicitante requiere información detallada sobre los requisitos para participar en la licitación pública N° 45/2025.', 'Se proporcionó la documentación completa con los requisitos y plazos.', 'COMPLETADA', '2025-04-16 11:45:00', 'La solicitante agradeció la rapidez en la respuesta.', 'Usuario Común', '2025-04-16 11:00:00', '2025-04-16 11:45:00', u.id
FROM users u
WHERE u.username = 'usuario'
AND NOT EXISTS (
    SELECT 1 FROM activities
    WHERE description = 'Solicitud de información sobre requisitos para licitación'
);

-- Actividad 5
INSERT INTO activities (date, type, description, person, role, dependency, situation, result, status, last_status_change_date, comments, agent, created_at, updated_at, user_id)
SELECT '2025-04-17 10:00:00', 'OTRO', 'Respuesta a consultas sobre procedimiento administrativo', 'Varios destinatarios', 'Diversos', 'Varias dependencias', 'Se recibieron múltiples consultas por correo sobre el nuevo procedimiento administrativo implementado.', 'Se elaboró un documento con respuestas a preguntas frecuentes y se envió a todos los interesados.', 'COMPLETADA', '2025-04-17 12:15:00', 'Se recibieron respuestas positivas agradeciendo la clarificación.', 'Administrador Sistema', '2025-04-17 10:00:00', '2025-04-17 12:15:00', u.id
FROM users u
WHERE u.username = 'admin'
AND NOT EXISTS (
    SELECT 1 FROM activities
    WHERE description = 'Respuesta a consultas sobre procedimiento administrativo'
);

-- Actividad 6
INSERT INTO activities (date, type, description, person, role, dependency, situation, result, status, last_status_change_date, comments, agent, created_at, updated_at, user_id)
SELECT '2025-04-17 15:30:00', 'REUNION', 'Reunión con representantes del sindicato', 'Jorge Méndez y equipo', 'Representantes sindicales', 'Sindicato de Trabajadores', 'Reunión solicitada para discutir mejoras en las condiciones laborales.', 'Se acordó elaborar una propuesta conjunta para presentar a la dirección.', 'PENDIENTE', '2025-04-17 15:30:00', 'Pendiente elaboración de propuesta para próxima reunión.', 'Usuario Común', '2025-04-17 15:30:00', '2025-04-17 15:30:00', u.id
FROM users u
WHERE u.username = 'usuario'
AND NOT EXISTS (
    SELECT 1 FROM activities
    WHERE description = 'Reunión con representantes del sindicato'
);

-- Actividad 7
INSERT INTO activities (date, type, description, person, role, dependency, situation, result, status, last_status_change_date, comments, agent, created_at, updated_at, user_id)
SELECT '2025-04-18 09:00:00', 'OTRO', 'Organización de documentación y archivo', 'Interno', 'Administrativo', 'Departamento Administrativo', 'Se requiere organizar y digitalizar documentación acumulada del último trimestre.', 'Se clasificaron y digitalizaron 150 documentos, quedando pendientes aproximadamente 50.', 'EN_PROGRESO', '2025-04-18 13:00:00', 'Se continuará con la tarea la próxima semana.', 'Administrador Sistema', '2025-04-18 09:00:00', '2025-04-18 13:00:00', u.id
FROM users u
WHERE u.username = 'admin'
AND NOT EXISTS (
    SELECT 1 FROM activities
    WHERE description = 'Organización de documentación y archivo'
);

-- Actividad 8
INSERT INTO activities (date, type, description, person, role, dependency, situation, result, status, last_status_change_date, comments, agent, created_at, updated_at, user_id)
SELECT '2025-04-18 14:30:00', 'OTRO', 'Consulta sobre estado de trámite de Pedro Díaz', 'Pedro Díaz', 'Ciudadano', 'N/A', 'El solicitante consulta sobre el estado de su trámite iniciado hace 2 semanas.', 'Se verificó en el sistema y se informó que el trámite está en proceso de evaluación.', 'COMPLETADA', '2025-04-18 14:45:00', 'Se le indicó que recibirá notificación por correo cuando haya novedades.', 'Usuario Común', '2025-04-18 14:30:00', '2025-04-18 14:45:00', u.id
FROM users u
WHERE u.username = 'usuario'
AND NOT EXISTS (
    SELECT 1 FROM activities
    WHERE description = 'Consulta sobre estado de trámite de Pedro Díaz'
);

-- Actividad 9 (de V2__Initial_Data.sql)
INSERT INTO activities (date, type, description, person, role, dependency, situation, result, status, last_status_change_date, comments, agent, created_at, updated_at, user_id)
SELECT DATEADD('DAY', -2, CURRENT_TIMESTAMP), 'REUNION', 'Reunión con el equipo de desarrollo', 'Juan Pérez', 'Coordinador', 'Dirección de Sistemas', 'Planificación del sprint', 'Se definieron las tareas para el próximo sprint', 'COMPLETADA', DATEADD('DAY', -1, CURRENT_TIMESTAMP), 'La reunión fue productiva', 'María López', DATEADD('DAY', -2, CURRENT_TIMESTAMP), DATEADD('DAY', -1, CURRENT_TIMESTAMP), u.id
FROM users u
WHERE u.username = 'admin'
AND NOT EXISTS (
    SELECT 1 FROM activities
    WHERE description = 'Reunión con el equipo de desarrollo'
);

-- Actividad 10 (de V2__Initial_Data.sql)
INSERT INTO activities (date, type, description, person, role, dependency, situation, result, status, last_status_change_date, comments, agent, created_at, updated_at, user_id)
SELECT DATEADD('DAY', -1, CURRENT_TIMESTAMP), 'AUDIENCIA', 'Audiencia de conciliación', 'Pedro Gómez', 'Defensor', 'Defensoría Civil', 'Conflicto vecinal', 'Se llegó a un acuerdo entre las partes', 'COMPLETADA', CURRENT_TIMESTAMP, 'Se firmó acta de acuerdo', 'Ana Rodríguez', DATEADD('DAY', -1, CURRENT_TIMESTAMP), CURRENT_TIMESTAMP, u.id
FROM users u
WHERE u.username = 'usuario'
AND NOT EXISTS (
    SELECT 1 FROM activities
    WHERE description = 'Audiencia de conciliación'
);

-- Actividad 11 (de V2__Initial_Data.sql)
INSERT INTO activities (date, type, description, person, role, dependency, situation, result, status, last_status_change_date, comments, agent, created_at, updated_at, user_id)
SELECT DATEADD('DAY', 1, CURRENT_TIMESTAMP), 'ENTREVISTA', 'Entrevista con el cliente', 'Laura Martínez', 'Asistente Social', 'Defensoría Penal', 'Evaluación de situación socioeconómica', NULL, 'PENDIENTE', CURRENT_TIMESTAMP, 'Preparar documentación necesaria', 'Carlos Sánchez', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, u.id
FROM users u
WHERE u.username = 'usuario'
AND NOT EXISTS (
    SELECT 1 FROM activities
    WHERE description = 'Entrevista con el cliente'
);

-- Actividad 12 (adicional para testuser)
INSERT INTO activities (date, type, description, person, role, dependency, situation, result, status, last_status_change_date, comments, agent, created_at, updated_at, user_id)
SELECT CURRENT_TIMESTAMP, 'INVESTIGACION', 'Investigación sobre nuevas tecnologías', 'Equipo de Desarrollo', 'Desarrolladores', 'Departamento de IT', 'Se requiere evaluar nuevas tecnologías para el próximo proyecto', 'Se identificaron 3 tecnologías prometedoras para implementar', 'EN_PROGRESO', CURRENT_TIMESTAMP, 'Se realizará una presentación al equipo la próxima semana', 'Test User', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, u.id
FROM users u
WHERE u.username = 'testuser'
AND NOT EXISTS (
    SELECT 1 FROM activities
    WHERE description = 'Investigación sobre nuevas tecnologías'
);
