$migrationFile = "src\main\resources\db\migration\V8__Add_Employees_From_CSV.sql"
$content = Get-Content $migrationFile -Raw

# Agregar la tabla temporal para el ID máximo
$content = $content -replace "-- Eliminar usuarios que no sean admin\r?\nDELETE FROM users WHERE username != 'admin';", @"
-- Eliminar usuarios que no sean admin
DELETE FROM users WHERE username != 'admin';

-- Obtener el ID máximo actual para evitar conflictos
CREATE TEMPORARY TABLE IF NOT EXISTS temp_max_id AS SELECT COALESCE(MAX(id), 0) + 1 AS next_id FROM users;
"@

# Modificar todos los INSERT de usuarios
$userInsertPattern = "(?ms)-- Legajo \d+ - .+?\r?\nINSERT INTO users \(\r?\n\s+username,\r?\n\s+password,\r?\n\s+email,\r?\n\s+first_name,\r?\n\s+last_name,\r?\n\s+role,\r?\n\s+position,\r?\n\s+department,\r?\n\s+active,\r?\n\s+created_at,\r?\n\s+updated_at\r?\n\) VALUES \(\r?\n\s+'(\d+)',\r?\n\s+'[^']+',\s+--[^\r\n]*\r?\n\s+'[^']+',\r?\n\s+'[^']+',\r?\n\s+'[^']+',\r?\n\s+'[^']+',\r?\n\s+'[^']+',\r?\n\s+'[^']+',\r?\n\s+TRUE,\r?\n\s+CURRENT_TIMESTAMP,\r?\n\s+CURRENT_TIMESTAMP\r?\n\);"

$userInsertReplacement = @"
-- Legajo $1 - $2 - $3
INSERT INTO users (
    id,
    username,
    password,
    email,
    first_name,
    last_name,
    role,
    position,
    department,
    active,
    created_at,
    updated_at
) 
SELECT 
    (SELECT next_id FROM temp_max_id),
    '$4',
    '$5', -- $6
    '$7',
    '$8',
    '$9',
    '$10',
    '$11',
    '$12',
    TRUE,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = '$4');

-- Actualizar el valor de next_id para el siguiente usuario
UPDATE temp_max_id SET next_id = next_id + 1;
"@

# Modificar todos los INSERT de permisos
$permissionInsertPattern = "(?ms)-- Insertar permisos para .+?\r?\nINSERT INTO user_permissions \(user_id, permission\)\r?\nSELECT id, '([^']+)' FROM users WHERE username = '(\d+)';\r?\nINSERT INTO user_permissions \(user_id, permission\)\r?\nSELECT id, '([^']+)' FROM users WHERE username = '(\d+)';"

$permissionInsertReplacement = @"
-- Insertar permisos para $1
INSERT INTO user_permissions (user_id, permission)
SELECT id, '$2' FROM users WHERE username = '$3'
AND NOT EXISTS (SELECT 1 FROM user_permissions up JOIN users u ON up.user_id = u.id 
                WHERE u.username = '$3' AND up.permission = '$2');
                
INSERT INTO user_permissions (user_id, permission)
SELECT id, '$4' FROM users WHERE username = '$3'
AND NOT EXISTS (SELECT 1 FROM user_permissions up JOIN users u ON up.user_id = u.id 
                WHERE u.username = '$3' AND up.permission = '$4');
"@

# Aplicar las modificaciones
$content = $content -replace $userInsertPattern, $userInsertReplacement
$content = $content -replace $permissionInsertPattern, $permissionInsertReplacement

# Agregar la eliminación de la tabla temporal al final del archivo
$content += @"

-- Eliminar la tabla temporal
DROP TABLE IF EXISTS temp_max_id;
"@

# Guardar el archivo modificado
Set-Content -Path $migrationFile -Value $content

Write-Host "El archivo de migración ha sido modificado correctamente."
