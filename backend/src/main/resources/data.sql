-- Insertar usuarios de prueba
-- Contraseñas:
-- admin: Admin@123
-- usuario: Usuario@123
-- testuser: test123
INSERT INTO users (username, password, email, first_name, last_name, role, position, department, active, created_at, updated_at)
VALUES
    ('admin', '$2a$10$bieh3BVExvsBBABMSR.oduEksKK2jQhTd.r0lJQ/.HEqjPsVhH4fe', 'admin@bitacora.com', 'Administrador', 'Sistema', 'ADMIN', 'Administrador de Sistema', 'Sistemas', true, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP()),
    ('usuario', '$2a$10$pDx3WDEE4Lt7gM4QOIQNkeb9T082kw3MRo8WngXupNCdkUIITLTcu', 'usuario@bitacora.com', 'Usuario', 'Común', 'USUARIO', 'Operador', 'Operaciones', true, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP()),
    ('testuser', '$2a$10$ITnemZSRcxdvrM1nRHEhU.tfqocBP1ELIIq3ZLpjGUZ8i6AGQEY3y', 'test@bitacora.com', 'Test', 'User', 'ADMIN', 'Tester', 'QA', true, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());

-- Insertar permisos para el administrador
INSERT INTO user_permissions (user_id, permission)
VALUES
    (1, 'READ_ACTIVITIES'),
    (1, 'WRITE_ACTIVITIES'),
    (1, 'DELETE_ACTIVITIES'),
    (1, 'READ_USERS'),
    (1, 'WRITE_USERS'),
    (1, 'DELETE_USERS'),
    (1, 'GENERATE_REPORTS');

-- Insertar permisos para el usuario común
INSERT INTO user_permissions (user_id, permission)
VALUES
    (2, 'READ_ACTIVITIES'),
    (2, 'WRITE_ACTIVITIES');

-- Insertar permisos para el usuario de prueba
INSERT INTO user_permissions (user_id, permission)
VALUES
    (3, 'READ_ACTIVITIES'),
    (3, 'WRITE_ACTIVITIES'),
    (3, 'DELETE_ACTIVITIES'),
    (3, 'READ_USERS'),
    (3, 'WRITE_USERS'),
    (3, 'DELETE_USERS'),
    (3, 'GENERATE_REPORTS');

-- Insertar datos de ejemplo para actividades
INSERT INTO activities (date, type, description, person, role, dependency, situation, result, status, last_status_change_date, comments, agent, created_at, updated_at, user_id)
VALUES
    ('2025-04-15 10:30:00', 'OTRO', 'Atención a Juan Pérez por consulta sobre expediente 123/2025', 'Juan Pérez', 'Abogado', 'Estudio Jurídico ABC', 'El solicitante requiere información sobre el estado actual del expediente 123/2025 relacionado con un trámite administrativo.', 'Se proporcionó la información solicitada y se indicó que el expediente se encuentra en revisión por el departamento legal.', 'COMPLETADA', '2025-04-15 11:45:00', 'El solicitante quedó conforme con la información proporcionada.', 'Administrador Sistema', '2025-04-15 10:30:00', '2025-04-15 11:45:00', 1),

    ('2025-04-15 14:00:00', 'OTRO', 'Llamada de Carlos Rodríguez sobre documentación pendiente', 'Carlos Rodríguez', 'Contador', 'Consultora XYZ', 'El solicitante llama para consultar sobre documentación pendiente para completar un trámite.', 'Se informó sobre los documentos faltantes y se acordó que los enviará por correo electrónico.', 'EN_PROGRESO', '2025-04-15 14:30:00', 'Pendiente recepción de documentos por correo.', 'Usuario Común', '2025-04-15 14:00:00', '2025-04-15 14:30:00', 2),

    ('2025-04-16 09:15:00', 'OTRO', 'Evaluación de candidatos para puesto de desarrollador', 'Comité de Selección', 'RRHH', 'Departamento de Recursos Humanos', 'Se requiere evaluar a 5 candidatos preseleccionados para el puesto de desarrollador senior.', 'Se realizaron entrevistas técnicas y se seleccionaron 2 finalistas para la siguiente etapa.', 'EN_PROGRESO', '2025-04-16 12:30:00', 'Los finalistas serán entrevistados por el director del área la próxima semana.', 'Administrador Sistema', '2025-04-16 09:15:00', '2025-04-16 12:30:00', 1),

    ('2025-04-16 11:00:00', 'OTRO', 'Solicitud de información sobre requisitos para licitación', 'Laura Gómez', 'Gerente de Proyectos', 'Empresa Constructora ABC', 'La solicitante requiere información detallada sobre los requisitos para participar en la licitación pública N° 45/2025.', 'Se proporcionó la documentación completa con los requisitos y plazos.', 'COMPLETADA', '2025-04-16 11:45:00', 'La solicitante agradeció la rapidez en la respuesta.', 'Usuario Común', '2025-04-16 11:00:00', '2025-04-16 11:45:00', 2),

    ('2025-04-17 10:00:00', 'OTRO', 'Respuesta a consultas sobre procedimiento administrativo', 'Varios destinatarios', 'Diversos', 'Varias dependencias', 'Se recibieron múltiples consultas por correo sobre el nuevo procedimiento administrativo implementado.', 'Se elaboró un documento con respuestas a preguntas frecuentes y se envió a todos los interesados.', 'COMPLETADA', '2025-04-17 12:15:00', 'Se recibieron respuestas positivas agradeciendo la clarificación.', 'Administrador Sistema', '2025-04-17 10:00:00', '2025-04-17 12:15:00', 1),

    ('2025-04-17 15:30:00', 'REUNION', 'Reunión con representantes del sindicato', 'Jorge Méndez y equipo', 'Representantes sindicales', 'Sindicato de Trabajadores', 'Reunión solicitada para discutir mejoras en las condiciones laborales.', 'Se acordó elaborar una propuesta conjunta para presentar a la dirección.', 'PENDIENTE', '2025-04-17 15:30:00', 'Pendiente elaboración de propuesta para próxima reunión.', 'Usuario Común', '2025-04-17 15:30:00', '2025-04-17 15:30:00', 2),

    ('2025-04-18 09:00:00', 'OTRO', 'Organización de documentación y archivo', 'Interno', 'Administrativo', 'Departamento Administrativo', 'Se requiere organizar y digitalizar documentación acumulada del último trimestre.', 'Se clasificaron y digitalizaron 150 documentos, quedando pendientes aproximadamente 50.', 'EN_PROGRESO', '2025-04-18 13:00:00', 'Se continuará con la tarea la próxima semana.', 'Administrador Sistema', '2025-04-18 09:00:00', '2025-04-18 13:00:00', 1),

    ('2025-04-18 14:30:00', 'OTRO', 'Consulta sobre estado de trámite de Pedro Díaz', 'Pedro Díaz', 'Ciudadano', 'N/A', 'El solicitante consulta sobre el estado de su trámite iniciado hace 2 semanas.', 'Se verificó en el sistema y se informó que el trámite está en proceso de evaluación.', 'COMPLETADA', '2025-04-18 14:45:00', 'Se le indicó que recibirá notificación por correo cuando haya novedades.', 'Usuario Común', '2025-04-18 14:30:00', '2025-04-18 14:45:00', 2);
