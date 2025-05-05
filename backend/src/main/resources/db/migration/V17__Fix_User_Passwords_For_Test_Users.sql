-- V17__Fix_User_Passwords_For_Test_Users.sql
-- Migración para corregir las contraseñas de los usuarios de prueba

-- Actualizar contraseña del usuario admin (Admin@123) - Sabemos que este hash funciona
UPDATE users 
SET password = '$2a$10$WpD2XYoCOJRS/4sMniLhGeEuAhvjmjQafgnP1kWHf537L/tBRD0fy' 
WHERE username = 'admin';

-- Actualizar contraseñas de todos los usuarios con el hash generado por el sistema para Test@1234
-- Este hash fue generado por el sistema durante el inicio y se verificó que funciona
UPDATE users 
SET password = '$2a$10$mAzGMRp1DEnHt4VMF4HeUujvEKhHK0SHXzgk0rqPUvNx7hs/0oB6.' 
WHERE username != 'admin';

-- Actualizar contraseñas específicas para usuarios de prueba
-- Juan Perez (Test@1234)
UPDATE users 
SET password = '$2a$10$mAzGMRp1DEnHt4VMF4HeUujvEKhHK0SHXzgk0rqPUvNx7hs/0oB6.' 
WHERE username = '28456789';

-- Carlos Rodriguez (Test@1234)
UPDATE users 
SET password = '$2a$10$mAzGMRp1DEnHt4VMF4HeUujvEKhHK0SHXzgk0rqPUvNx7hs/0oB6.' 
WHERE username = '25789012';

-- Adriana Sanchez (Test@1234)
UPDATE users 
SET password = '$2a$10$mAzGMRp1DEnHt4VMF4HeUujvEKhHK0SHXzgk0rqPUvNx7hs/0oB6.' 
WHERE username = '32345678';
