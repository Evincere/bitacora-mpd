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
