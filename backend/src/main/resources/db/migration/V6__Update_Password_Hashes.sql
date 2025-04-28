-- V6__Update_Password_Hashes.sql
-- Migración para actualizar los hashes de contraseñas de los usuarios

-- Actualizar contraseña del usuario admin (Admin@123)
UPDATE users 
SET password = '$2a$10$WpD2XYoCOJRS/4sMniLhGeEuAhvjmjQafgnP1kWHf537L/tBRD0fy' 
WHERE username = 'admin';

-- Actualizar contraseña del usuario regular (Usuario@123)
UPDATE users 
SET password = '$2a$10$JyAzLeXpy3mAv/sC1bJ6Kuf4kCst0jKEbeO8vTToHzveJbp7z80vG' 
WHERE username = 'usuario';

-- Actualizar contraseña del usuario de prueba (test123)
UPDATE users 
SET password = '$2a$10$sssEUdwJs884.Nsm7nN7SOkbIHlcyYG1VOGUs8n50FQUYK1S.ILSi' 
WHERE username = 'testuser';
