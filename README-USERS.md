# Usuarios del Sistema

Este documento describe los usuarios disponibles en el sistema, sus roles y credenciales.

## Roles de Usuario

El sistema tiene los siguientes roles:

- **ADMIN**: Administrador con acceso irrestricto a todas las funcionalidades del sistema.
- **ASIGNADOR**: Usuario encargado de asignar tareas a los ejecutores.
- **SOLICITANTE**: Usuario que puede crear solicitudes de tareas.
- **EJECUTOR**: Usuario que ejecuta las tareas asignadas.

## Credenciales de Acceso

### Usuario Administrador

- **Nombre**: Semper Evincere
- **Usuario**: admin
- **Contraseña**: Admin@123
- **Rol**: ADMIN

### Usuario Asignador

Solo existe un usuario con rol ASIGNADOR:

- **Nombre**: Adriana Sanchez
- **Usuario**: 32345678 (DNI)
- **Contraseña**: Test@1234
- **Rol**: ASIGNADOR

### Usuarios Solicitantes

Los siguientes usuarios tienen rol SOLICITANTE:

| Nombre            | Usuario (DNI) | Contraseña | Departamento      |
|-------------------|---------------|------------|-------------------|
| Juan Perez        | 28456789      | Test@1234  | Ventas            |
| Maria Gonzalez    | 30123456      | Test@1234  | Marketing         |
| Laura Martinez    | 33456123      | Test@1234  | Recursos Humanos  |
| Ana Lopez         | 31234567      | Test@1234  | Ventas            |
| Lucia Torres      | 34567890      | Test@1234  | Marketing         |
| Valeria Acosta    | 31456789      | Test@1234  | Recursos Humanos  |
| Natalia Herrera   | 33210987      | Test@1234  | Ventas            |
| Camila Ortiz      | 32109876      | Test@1234  | Marketing         |
| Daniela Vargas    | 34321098      | Test@1234  | Recursos Humanos  |
| Carolina Mendoza  | 31098765      | Test@1234  | Ventas            |

### Usuarios Ejecutores

Los siguientes usuarios tienen rol EJECUTOR:

| Nombre            | Usuario (DNI) | Contraseña | Departamento      |
|-------------------|---------------|------------|-------------------|
| Carlos Rodriguez  | 25789012      | Test@1234  | Sistemas          |
| Diego Fernandez   | 27890345      | Test@1234  | Finanzas          |
| Pablo Sanchez     | 29876543      | Test@1234  | Sistemas          |
| Roberto Diaz      | 26789012      | Test@1234  | Logistica         |
| Miguel Ramirez    | 28901234      | Test@1234  | Sistemas          |
| Federico Morales  | 27345678      | Test@1234  | Finanzas          |
| Javier Castro     | 29654321      | Test@1234  | Sistemas          |
| Alejandro Rios    | 26543210      | Test@1234  | Logistica         |
| Matias Silva      | 28765432      | Test@1234  | Finanzas          |

## Notas Importantes

1. Todos los usuarios utilizan su número de DNI como nombre de usuario y la contraseña "Test@1234".
2. El usuario administrador (admin) es el único que mantiene un nombre de usuario diferente al DNI y una contraseña diferente (Admin@123).
3. Solo existe un usuario con rol ASIGNADOR (Adriana Sanchez).
4. Los usuarios SOLICITANTES pertenecen principalmente a los departamentos de Ventas, Marketing y Recursos Humanos.
5. Los usuarios EJECUTORES pertenecen principalmente a los departamentos de Sistemas, Finanzas y Logística.
6. La contraseña "Test@1234" cumple con los requisitos de seguridad: al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.

## Permisos por Rol

### ADMIN
- READ_ACTIVITIES
- WRITE_ACTIVITIES
- DELETE_ACTIVITIES
- READ_USERS
- WRITE_USERS
- DELETE_USERS
- GENERATE_REPORTS

### ASIGNADOR
- READ_ACTIVITIES
- WRITE_ACTIVITIES
- READ_USERS
- GENERATE_REPORTS

### SOLICITANTE
- READ_ACTIVITIES
- WRITE_ACTIVITIES

### EJECUTOR
- READ_ACTIVITIES
- WRITE_ACTIVITIES
