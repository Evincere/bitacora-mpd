-- V12__Fix_Employee_Passwords.sql
-- Migración para corregir las contraseñas de los empleados usando el mismo hash que funciona para admin

-- Actualizar contraseña del usuario admin (Admin@123) - Sabemos que este hash funciona
UPDATE users 
SET password = '$2a$10$WpD2XYoCOJRS/4sMniLhGeEuAhvjmjQafgnP1kWHf537L/tBRD0fy' 
WHERE username = 'admin';

-- Actualizar contraseñas de todos los usuarios con un hash conocido para Test@1234
-- Este hash se ha verificado que funciona en el sistema
UPDATE users 
SET password = '$2a$10$OwYFEBAPRIl4Pf9Q0VHV7.LbL9Ym0KeHuONF1R.4A.28v8Bq/mEOi' 
WHERE username != 'admin';

-- Actualizar contraseñas específicas para usuarios de prueba
-- Legajo 1003 - Carlos Rodriguez (Test@1234)
UPDATE users 
SET password = '$2a$10$OwYFEBAPRIl4Pf9Q0VHV7.LbL9Ym0KeHuONF1R.4A.28v8Bq/mEOi' 
WHERE username = '25789012';

-- Legajo 1008 - Adriana Sanchez (Test@1234)
UPDATE users 
SET password = '$2a$10$OwYFEBAPRIl4Pf9Q0VHV7.LbL9Ym0KeHuONF1R.4A.28v8Bq/mEOi' 
WHERE username = '32345678';
