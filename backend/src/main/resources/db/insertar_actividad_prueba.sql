-- Insertar una actividad de prueba asignada al ejecutor con ID 20 (Matías Silva)
INSERT INTO activities (
    date, 
    type, 
    description, 
    status, 
    user_id, 
    executor_id, 
    created_at, 
    updated_at, 
    last_status_change_date
) VALUES (
    NOW(), 
    'REUNION', 
    'Actividad de prueba asignada a Matías Silva', 
    'ASSIGNED', 
    1, 
    20, 
    NOW(), 
    NOW(), 
    NOW()
);
