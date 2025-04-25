-- Actualizar tabla de usuarios para soportar nuevos roles
ALTER TABLE users
ADD CONSTRAINT check_role CHECK (role IN ('ADMIN', 'ASIGNADOR', 'SOLICITANTE', 'EJECUTOR', 'SUPERVISOR', 'USUARIO', 'CONSULTA'));

-- Actualizar tabla de actividades para soportar el flujo de trabajo
ALTER TABLE activities
ADD COLUMN requester_id BIGINT;

ALTER TABLE activities
ADD COLUMN assigner_id BIGINT;

ALTER TABLE activities
ADD COLUMN executor_id BIGINT;

ALTER TABLE activities
ADD COLUMN request_date TIMESTAMP;

ALTER TABLE activities
ADD COLUMN assignment_date TIMESTAMP;

ALTER TABLE activities
ADD COLUMN start_date TIMESTAMP;

ALTER TABLE activities
ADD COLUMN completion_date TIMESTAMP;

ALTER TABLE activities
ADD COLUMN approval_date TIMESTAMP;

ALTER TABLE activities
ADD COLUMN request_notes TEXT;

ALTER TABLE activities
ADD COLUMN assignment_notes TEXT;

ALTER TABLE activities
ADD COLUMN execution_notes TEXT;

ALTER TABLE activities
ADD COLUMN completion_notes TEXT;

ALTER TABLE activities
ADD COLUMN approval_notes TEXT;

ALTER TABLE activities
ADD COLUMN estimated_hours INTEGER;

ALTER TABLE activities
ADD COLUMN actual_hours INTEGER;

ALTER TABLE activities
ADD COLUMN priority VARCHAR(20);

ALTER TABLE activities
ADD COLUMN category_id BIGINT;

-- Actualizar constraint de status para incluir nuevos estados
ALTER TABLE activities
DROP CONSTRAINT IF EXISTS check_status;

ALTER TABLE activities
ADD CONSTRAINT check_status CHECK (status IN (
    'PENDIENTE', 'EN_PROGRESO', 'COMPLETADA', 'CANCELADA', 'ARCHIVADA',
    'REQUESTED', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'APPROVED', 'REJECTED', 'CANCELLED'
));

-- Crear tabla para categorías de actividades
CREATE TABLE activity_categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    color VARCHAR(20) NOT NULL,
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    creator_id BIGINT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Crear tabla para historial de actividades
CREATE TABLE activity_history (
    id BIGSERIAL PRIMARY KEY,
    activity_id BIGINT NOT NULL,
    user_id BIGINT,
    user_name VARCHAR(200),
    previous_status VARCHAR(20),
    new_status VARCHAR(20) NOT NULL,
    change_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    FOREIGN KEY (activity_id) REFERENCES activities(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Crear tabla para comentarios de actividades
CREATE TABLE activity_comments (
    id BIGSERIAL PRIMARY KEY,
    activity_id BIGINT NOT NULL,
    user_id BIGINT,
    user_name VARCHAR(200),
    content TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (activity_id) REFERENCES activities(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Crear tabla para adjuntos de actividades
CREATE TABLE activity_attachments (
    id BIGSERIAL PRIMARY KEY,
    activity_id BIGINT NOT NULL,
    user_id BIGINT,
    user_name VARCHAR(200),
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(100),
    file_url VARCHAR(1000) NOT NULL,
    file_size BIGINT,
    uploaded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (activity_id) REFERENCES activities(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX idx_activities_requester_id ON activities(requester_id);
CREATE INDEX idx_activities_assigner_id ON activities(assigner_id);
CREATE INDEX idx_activities_executor_id ON activities(executor_id);
CREATE INDEX idx_activities_category_id ON activities(category_id);
CREATE INDEX idx_activity_history_activity_id ON activity_history(activity_id);
CREATE INDEX idx_activity_comments_activity_id ON activity_comments(activity_id);
CREATE INDEX idx_activity_attachments_activity_id ON activity_attachments(activity_id);

-- Insertar categorías predeterminadas
INSERT INTO activity_categories (name, description, color, is_default, created_at, updated_at)
VALUES 
('Administrativa', 'Tareas administrativas y de gestión', '#4285F4', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Técnica', 'Tareas técnicas y de desarrollo', '#0F9D58', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Legal', 'Tareas relacionadas con aspectos legales', '#DB4437', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Financiera', 'Tareas relacionadas con finanzas y contabilidad', '#F4B400', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Recursos Humanos', 'Tareas relacionadas con personal y RRHH', '#9C27B0', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Marketing', 'Tareas relacionadas con marketing y comunicación', '#00ACC1', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Soporte', 'Tareas de soporte y atención al cliente', '#FF6D00', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Otra', 'Otras tareas no categorizadas', '#757575', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Añadir claves foráneas
ALTER TABLE activities
ADD CONSTRAINT fk_activities_requester FOREIGN KEY (requester_id) REFERENCES users(id) ON DELETE SET NULL;

ALTER TABLE activities
ADD CONSTRAINT fk_activities_assigner FOREIGN KEY (assigner_id) REFERENCES users(id) ON DELETE SET NULL;

ALTER TABLE activities
ADD CONSTRAINT fk_activities_executor FOREIGN KEY (executor_id) REFERENCES users(id) ON DELETE SET NULL;

ALTER TABLE activities
ADD CONSTRAINT fk_activities_category FOREIGN KEY (category_id) REFERENCES activity_categories(id) ON DELETE SET NULL;

-- Crear tabla para sesiones de usuario
CREATE TABLE user_sessions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    token TEXT,
    refresh_token TEXT,
    ip_address VARCHAR(45),
    user_agent VARCHAR(500),
    device VARCHAR(50),
    location VARCHAR(100),
    login_time TIMESTAMP NOT NULL,
    last_activity_time TIMESTAMP,
    expiry_time TIMESTAMP,
    status VARCHAR(20) NOT NULL,
    is_suspicious BOOLEAN DEFAULT FALSE,
    suspicious_reason VARCHAR(255),
    logout_time TIMESTAMP,
    CONSTRAINT fk_user_sessions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Índices para mejorar el rendimiento de las consultas
CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_token ON user_sessions(token);
CREATE INDEX idx_user_sessions_refresh_token ON user_sessions(refresh_token);
CREATE INDEX idx_user_sessions_status ON user_sessions(status);
CREATE INDEX idx_user_sessions_is_suspicious ON user_sessions(is_suspicious);
