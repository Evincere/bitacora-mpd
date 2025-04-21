-- Tabla de usuarios
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL,
    position VARCHAR(100),
    department VARCHAR(100),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de permisos de usuario
CREATE TABLE user_permissions (
    user_id BIGINT NOT NULL,
    permission VARCHAR(50) NOT NULL,
    PRIMARY KEY (user_id, permission),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabla de actividades
CREATE TABLE activities (
    id BIGSERIAL PRIMARY KEY,
    date TIMESTAMP NOT NULL,
    type VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    person VARCHAR(255),
    role VARCHAR(100),
    dependency VARCHAR(255),
    situation TEXT,
    result TEXT,
    status VARCHAR(20) NOT NULL,
    last_status_change_date TIMESTAMP,
    comments TEXT,
    agent VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    user_id BIGINT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Índices para mejorar el rendimiento de las consultas
CREATE INDEX idx_activities_user_id ON activities(user_id);
CREATE INDEX idx_activities_type ON activities(type);
CREATE INDEX idx_activities_status ON activities(status);
CREATE INDEX idx_activities_date ON activities(date);
CREATE INDEX idx_activities_person ON activities(person);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_department ON users(department);
