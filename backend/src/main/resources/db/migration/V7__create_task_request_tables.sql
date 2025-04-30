-- Crear tabla de categorías de solicitudes de tareas
CREATE TABLE task_request_categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(500),
    color VARCHAR(7) NOT NULL,
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL,
    creator_id BIGINT
);

-- Crear tabla de solicitudes de tareas
CREATE TABLE task_requests (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(2000) NOT NULL,
    category_id BIGINT,
    priority VARCHAR(20) NOT NULL,
    due_date TIMESTAMP NULL,
    status VARCHAR(20) NOT NULL,
    requester_id BIGINT NOT NULL,
    assigner_id BIGINT NULL,
    request_date TIMESTAMP NOT NULL,
    assignment_date TIMESTAMP NULL,
    notes VARCHAR(1000),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (category_id) REFERENCES task_request_categories(id),
    FOREIGN KEY (requester_id) REFERENCES users(id),
    FOREIGN KEY (assigner_id) REFERENCES users(id)
);

-- Crear tabla de comentarios de solicitudes de tareas
CREATE TABLE task_request_comments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    task_request_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    content VARCHAR(1000) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (task_request_id) REFERENCES task_requests(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Crear tabla de archivos adjuntos de solicitudes de tareas
CREATE TABLE task_request_attachments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    task_request_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(100),
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT,
    uploaded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (task_request_id) REFERENCES task_requests(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Crear índices para mejorar el rendimiento de las consultas
CREATE INDEX idx_task_requests_requester ON task_requests(requester_id);
CREATE INDEX idx_task_requests_assigner ON task_requests(assigner_id);
CREATE INDEX idx_task_requests_status ON task_requests(status);
CREATE INDEX idx_task_requests_category ON task_requests(category_id);
CREATE INDEX idx_task_request_comments_request ON task_request_comments(task_request_id);
CREATE INDEX idx_task_request_attachments_request ON task_request_attachments(task_request_id);

-- Insertar categorías por defecto
INSERT INTO task_request_categories (name, description, color, is_default, created_at)
VALUES
('General', 'Categoría general para solicitudes de tareas', '#808080', TRUE, CURRENT_TIMESTAMP),
('Urgente', 'Solicitudes que requieren atención inmediata', '#FF0000', FALSE, CURRENT_TIMESTAMP),
('Mantenimiento', 'Solicitudes relacionadas con tareas de mantenimiento', '#FFA500', FALSE, CURRENT_TIMESTAMP),
('Desarrollo', 'Solicitudes relacionadas con tareas de desarrollo', '#0000FF', FALSE, CURRENT_TIMESTAMP),
('Administrativo', 'Solicitudes relacionadas con tareas administrativas', '#008000', FALSE, CURRENT_TIMESTAMP);

-- Insertar datos de ejemplo para solicitudes de tareas
-- Usamos IDs fijos para los usuarios en lugar de buscarlos por nombre de usuario
-- Sabemos que el usuario admin tiene ID 1 según la migración V2__Initial_Data.sql
INSERT INTO task_requests (title, description, category_id, priority, due_date, status, requester_id, assigner_id, request_date, assignment_date, notes, created_at)
VALUES
('Actualización de software', 'Se requiere actualizar el software de gestión a la última versión',
 (SELECT id FROM task_request_categories WHERE name = 'Mantenimiento'),
 'MEDIUM', DATEADD('DAY', 7, CURRENT_TIMESTAMP), 'SUBMITTED',
 1, NULL, -- Usamos el ID 1 (admin) como requester
 CURRENT_TIMESTAMP, NULL, 'Coordinar con el equipo de TI', CURRENT_TIMESTAMP),

('Revisión de documentación', 'Revisar la documentación del proyecto antes de la reunión con el cliente',
 (SELECT id FROM task_request_categories WHERE name = 'Administrativo'),
 'HIGH', DATEADD('DAY', 3, CURRENT_TIMESTAMP), 'DRAFT',
 1, NULL, -- Usamos el ID 1 (admin) como requester
 CURRENT_TIMESTAMP, NULL, 'Enfocarse en la sección de requisitos', CURRENT_TIMESTAMP),

('Implementación de nueva funcionalidad', 'Desarrollar la funcionalidad de exportación a PDF',
 (SELECT id FROM task_request_categories WHERE name = 'Desarrollo'),
 'CRITICAL', DATEADD('DAY', 5, CURRENT_TIMESTAMP), 'ASSIGNED',
 1, 1, -- Usamos el ID 1 (admin) como requester y assigner
 DATEADD('DAY', -2, CURRENT_TIMESTAMP), CURRENT_TIMESTAMP,
 'Utilizar la biblioteca PDFBox', CURRENT_TIMESTAMP);

-- Insertar comentarios de ejemplo
INSERT INTO task_request_comments (task_request_id, user_id, content, created_at)
VALUES
((SELECT id FROM task_requests WHERE title = 'Implementación de nueva funcionalidad'),
 1, -- Usamos el ID 1 (admin) como usuario
 'Por favor, asegúrese de que la funcionalidad sea compatible con todos los navegadores',
 DATEADD('DAY', -1, CURRENT_TIMESTAMP)),

((SELECT id FROM task_requests WHERE title = 'Implementación de nueva funcionalidad'),
 1, -- Usamos el ID 1 (admin) como usuario
 'Asignado al equipo de desarrollo. Comenzaremos a trabajar en ello inmediatamente',
 CURRENT_TIMESTAMP);
