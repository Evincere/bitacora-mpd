-- V9__Fix_User_Passwords.sql
-- Migración para corregir las contraseñas de los usuarios

-- Actualizar contraseña del usuario admin (Admin@123)
UPDATE users
SET password = '$2a$10$WpD2XYoCOJRS/4sMniLhGeEuAhvjmjQafgnP1kWHf537L/tBRD0fy'
WHERE username = 'admin';

-- Actualizar contraseñas de los usuarios con sus números de legajo + "@Pass"
-- Legajo 1001 - Juan Perez (1001@Pass)
UPDATE users
SET password = '$2a$10$Nt/Ov0Ek1QGLQCnzTnXoUeRwX1WvUVxJgXJQA4U1aMeR4x3KcLcHO'
WHERE username = '28456789';

-- Legajo 1002 - Maria Gonzalez (1002@Pass)
UPDATE users
SET password = '$2a$10$Nt/Ov0Ek1QGLQCnzTnXoUeRwX1WvUVxJgXJQA4U1aMeR4x3KcLcHO'
WHERE username = '30123456';

-- Legajo 1003 - Carlos Rodriguez
UPDATE users
SET password = '$2a$10$Nt/Ov0Ek1QGLQCnzTnXoUeRwX1WvUVxJgXJQA4U1aMeR4x3KcLcHO'
WHERE username = '25789012';

-- Legajo 1004 - Laura Martinez
UPDATE users
SET password = '$2a$10$Nt/Ov0Ek1QGLQCnzTnXoUeRwX1WvUVxJgXJQA4U1aMeR4x3KcLcHO'
WHERE username = '33456123';

-- Legajo 1005 - Diego Fernandez
UPDATE users
SET password = '$2a$10$Nt/Ov0Ek1QGLQCnzTnXoUeRwX1WvUVxJgXJQA4U1aMeR4x3KcLcHO'
WHERE username = '27890345';

-- Legajo 1006 - Ana Lopez
UPDATE users
SET password = '$2a$10$Nt/Ov0Ek1QGLQCnzTnXoUeRwX1WvUVxJgXJQA4U1aMeR4x3KcLcHO'
WHERE username = '31234567';

-- Legajo 1007 - Pablo Sanchez
UPDATE users
SET password = '$2a$10$Nt/Ov0Ek1QGLQCnzTnXoUeRwX1WvUVxJgXJQA4U1aMeR4x3KcLcHO'
WHERE username = '29876543';

-- Legajo 1008 - Adriana Sanchez
UPDATE users
SET password = '$2a$10$Nt/Ov0Ek1QGLQCnzTnXoUeRwX1WvUVxJgXJQA4U1aMeR4x3KcLcHO'
WHERE username = '32345678';

-- Legajo 1009 - Roberto Diaz
UPDATE users
SET password = '$2a$10$Nt/Ov0Ek1QGLQCnzTnXoUeRwX1WvUVxJgXJQA4U1aMeR4x3KcLcHO'
WHERE username = '26789012';

-- Legajo 1010 - Lucia Torres
UPDATE users
SET password = '$2a$10$Nt/Ov0Ek1QGLQCnzTnXoUeRwX1WvUVxJgXJQA4U1aMeR4x3KcLcHO'
WHERE username = '34567890';

-- Legajo 1011 - Miguel Ramirez
UPDATE users
SET password = '$2a$10$Nt/Ov0Ek1QGLQCnzTnXoUeRwX1WvUVxJgXJQA4U1aMeR4x3KcLcHO'
WHERE username = '28901234';

-- Legajo 1012 - Valeria Acosta
UPDATE users
SET password = '$2a$10$Nt/Ov0Ek1QGLQCnzTnXoUeRwX1WvUVxJgXJQA4U1aMeR4x3KcLcHO'
WHERE username = '31456789';

-- Legajo 1013 - Federico Morales
UPDATE users
SET password = '$2a$10$Nt/Ov0Ek1QGLQCnzTnXoUeRwX1WvUVxJgXJQA4U1aMeR4x3KcLcHO'
WHERE username = '27345678';

-- Legajo 1014 - Natalia Herrera
UPDATE users
SET password = '$2a$10$Nt/Ov0Ek1QGLQCnzTnXoUeRwX1WvUVxJgXJQA4U1aMeR4x3KcLcHO'
WHERE username = '33210987';

-- Legajo 1015 - Javier Castro
UPDATE users
SET password = '$2a$10$Nt/Ov0Ek1QGLQCnzTnXoUeRwX1WvUVxJgXJQA4U1aMeR4x3KcLcHO'
WHERE username = '29654321';

-- Legajo 1016 - Camila Ortiz
UPDATE users
SET password = '$2a$10$Nt/Ov0Ek1QGLQCnzTnXoUeRwX1WvUVxJgXJQA4U1aMeR4x3KcLcHO'
WHERE username = '32109876';

-- Legajo 1017 - Alejandro Rios
UPDATE users
SET password = '$2a$10$Nt/Ov0Ek1QGLQCnzTnXoUeRwX1WvUVxJgXJQA4U1aMeR4x3KcLcHO'
WHERE username = '26543210';

-- Legajo 1018 - Daniela Vargas
UPDATE users
SET password = '$2a$10$Nt/Ov0Ek1QGLQCnzTnXoUeRwX1WvUVxJgXJQA4U1aMeR4x3KcLcHO'
WHERE username = '34321098';

-- Legajo 1019 - Matias Silva
UPDATE users
SET password = '$2a$10$Nt/Ov0Ek1QGLQCnzTnXoUeRwX1WvUVxJgXJQA4U1aMeR4x3KcLcHO'
WHERE username = '28765432';

-- Legajo 1020 - Carolina Mendoza
UPDATE users
SET password = '$2a$10$Nt/Ov0Ek1QGLQCnzTnXoUeRwX1WvUVxJgXJQA4U1aMeR4x3KcLcHO'
WHERE username = '31098765';
