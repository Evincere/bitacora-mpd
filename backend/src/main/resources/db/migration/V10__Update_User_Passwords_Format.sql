-- V10__Update_User_Passwords_Format.sql
-- Migración para actualizar las contraseñas de los usuarios al formato legajo@Pass

-- Actualizar contraseña del usuario admin (Admin@123)
UPDATE users
SET password = '$2a$10$WpD2XYoCOJRS/4sMniLhGeEuAhvjmjQafgnP1kWHf537L/tBRD0fy'
WHERE username = 'admin';

-- Actualizar contraseñas de los usuarios con el formato legajo@Pass
-- Legajo 1001 - Juan Perez (1001@Pass)
UPDATE users
SET password = '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG'
WHERE username = '28456789';

-- Legajo 1002 - Maria Gonzalez (1002@Pass)
UPDATE users
SET password = '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG'
WHERE username = '30123456';

-- Legajo 1003 - Carlos Rodriguez (1003@Pass)
UPDATE users
SET password = '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG'
WHERE username = '25789012';

-- Legajo 1004 - Laura Martinez (1004@Pass)
UPDATE users
SET password = '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG'
WHERE username = '33456123';

-- Legajo 1005 - Diego Fernandez (1005@Pass)
UPDATE users
SET password = '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG'
WHERE username = '27890345';

-- Legajo 1006 - Ana Lopez (1006@Pass)
UPDATE users
SET password = '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG'
WHERE username = '31234567';

-- Legajo 1007 - Pablo Sanchez (1007@Pass)
UPDATE users
SET password = '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG'
WHERE username = '29876543';

-- Legajo 1008 - Adriana Sanchez (1008@Pass)
UPDATE users
SET password = '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG'
WHERE username = '32345678';

-- Legajo 1009 - Roberto Diaz (1009@Pass)
UPDATE users
SET password = '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG'
WHERE username = '26789012';

-- Legajo 1010 - Lucia Torres (1010@Pass)
UPDATE users
SET password = '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG'
WHERE username = '34567890';

-- Legajo 1011 - Miguel Ramirez (1011@Pass)
UPDATE users
SET password = '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG'
WHERE username = '28901234';

-- Legajo 1012 - Valeria Acosta (1012@Pass)
UPDATE users
SET password = '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG'
WHERE username = '31456789';

-- Legajo 1013 - Federico Morales (1013@Pass)
UPDATE users
SET password = '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG'
WHERE username = '27345678';

-- Legajo 1014 - Natalia Herrera (1014@Pass)
UPDATE users
SET password = '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG'
WHERE username = '33210987';

-- Legajo 1015 - Javier Castro (1015@Pass)
UPDATE users
SET password = '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG'
WHERE username = '29654321';

-- Legajo 1016 - Camila Ortiz (1016@Pass)
UPDATE users
SET password = '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG'
WHERE username = '32109876';

-- Legajo 1017 - Alejandro Rios (1017@Pass)
UPDATE users
SET password = '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG'
WHERE username = '26543210';

-- Legajo 1018 - Daniela Vargas (1018@Pass)
UPDATE users
SET password = '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG'
WHERE username = '34321098';

-- Legajo 1019 - Matias Silva (1019@Pass)
UPDATE users
SET password = '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG'
WHERE username = '28765432';

-- Legajo 1020 - Carolina Mendoza (1020@Pass)
UPDATE users
SET password = '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG'
WHERE username = '31098765';
