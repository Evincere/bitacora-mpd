-- V11__Fix_User_Passwords_For_Testing.sql
-- Migración para actualizar las contraseñas de los usuarios para pruebas

-- Actualizar contraseña del usuario admin (Admin@123)
UPDATE users 
SET password = '$2a$10$WpD2XYoCOJRS/4sMniLhGeEuAhvjmjQafgnP1kWHf537L/tBRD0fy' 
WHERE username = 'admin';

-- Actualizar contraseña para el usuario de prueba Carlos Rodriguez (1003@Pass)
UPDATE users 
SET password = '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG' 
WHERE username = '25789012';

-- Actualizar contraseña para el usuario de prueba Adriana Sanchez (1008@Pass)
UPDATE users 
SET password = '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG' 
WHERE username = '32345678';

-- Actualizar contraseña para todos los usuarios con un hash conocido para Test@1234
UPDATE users 
SET password = '$2a$10$OwYFEBAPRIl4Pf9Q0VHV7.LbL9Ym0KeHuONF1R.4A.28v8Bq/mEOi' 
WHERE username != 'admin';

-- Actualizar contraseña para todos los usuarios con un hash conocido para 1234@Pass
UPDATE users 
SET password = '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG' 
WHERE username != 'admin';
