-- Crear tabla para el registro de auditoría de usuarios
CREATE TABLE user_audit_log (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    username VARCHAR(255) NOT NULL,
    user_full_name VARCHAR(255),
    action_type VARCHAR(50) NOT NULL,
    entity_type VARCHAR(100),
    entity_id VARCHAR(100),
    description VARCHAR(1000),
    ip_address VARCHAR(50),
    user_agent VARCHAR(500),
    timestamp DATETIME NOT NULL,
    result VARCHAR(50),
    details VARCHAR(4000),
    old_values VARCHAR(4000),
    new_values VARCHAR(4000),
    suspicious BOOLEAN DEFAULT FALSE,
    suspicious_reason VARCHAR(500),
    module VARCHAR(100),
    session_id VARCHAR(100),
    created_at DATETIME NOT NULL
);

-- Crear índices individuales
CREATE INDEX idx_user_audit_user_id ON user_audit_log (user_id);
CREATE INDEX idx_user_audit_username ON user_audit_log (username);
CREATE INDEX idx_user_audit_action_type ON user_audit_log (action_type);
CREATE INDEX idx_user_audit_entity_type ON user_audit_log (entity_type);
CREATE INDEX idx_user_audit_timestamp ON user_audit_log (timestamp);
CREATE INDEX idx_user_audit_suspicious ON user_audit_log (suspicious);
CREATE INDEX idx_user_audit_module ON user_audit_log (module);

-- Crear índice compuesto para búsquedas comunes
CREATE INDEX idx_user_audit_user_action_date ON user_audit_log (user_id, action_type, timestamp);

-- Comentarios de la tabla y columnas
-- Estos comentarios se han convertido en comentarios SQL estándar ya que H2 no soporta la sintaxis COMMENT ON
-- Tabla: user_audit_log - Registro de auditoría de acciones de usuarios
-- Columna: id - Identificador único del registro de auditoría
-- Columna: user_id - Identificador del usuario que realizó la acción
-- Columna: username - Nombre de usuario que realizó la acción
-- Columna: user_full_name - Nombre completo del usuario que realizó la acción
-- Columna: action_type - Tipo de acción realizada (LOGIN, LOGOUT, CREATE, READ, UPDATE, DELETE, etc.)
-- Columna: entity_type - Tipo de entidad sobre la que se realizó la acción
-- Columna: entity_id - Identificador de la entidad sobre la que se realizó la acción
-- Columna: description - Descripción detallada de la acción realizada
-- Columna: ip_address - Dirección IP desde la que se realizó la acción
-- Columna: user_agent - Agente de usuario (navegador) desde el que se realizó la acción
-- Columna: timestamp - Fecha y hora en que se realizó la acción
-- Columna: result - Resultado de la acción (SUCCESS, ERROR, DENIED, etc.)
-- Columna: details - Detalles adicionales de la acción en formato JSON (almacenado como VARCHAR en H2)
-- Columna: old_values - Valores anteriores de los campos modificados en formato JSON (almacenado como VARCHAR en H2)
-- Columna: new_values - Nuevos valores de los campos modificados en formato JSON (almacenado como VARCHAR en H2)
-- Columna: suspicious - Indica si la acción fue marcada como sospechosa
-- Columna: suspicious_reason - Razón por la que la acción fue marcada como sospechosa
-- Columna: module - Módulo del sistema donde se realizó la acción
-- Columna: session_id - Identificador de la sesión del usuario
-- Columna: created_at - Fecha y hora en que se creó el registro de auditoría
