# Sistema de Inicialización de Datos Configurable

Este documento describe el nuevo sistema de inicialización de datos configurable que reemplaza los datos hardcodeados en el código.

## 🎯 Objetivo

Permitir la configuración de datos iniciales (usuarios, roles, actividades) mediante archivos de configuración YAML, eliminando la necesidad de datos hardcodeados en el código fuente.

## 🏗️ Arquitectura

### Componentes Principales

1. **InitialDataConfig** - Clase de configuración que mapea los archivos YAML
2. **ConfigurableDataInitializer** - Servicio que carga los datos desde la configuración
3. **Archivos YAML por ambiente** - Configuraciones específicas para cada entorno

### Flujo de Inicialización

```
Aplicación inicia → Lee configuración YAML → Valida datos → Crea usuarios/roles → Log de resultados
```

## 📁 Estructura de Archivos

```
src/main/resources/
├── application-configurable-data.yml    # Configuración base
├── application-dev-data.yml            # Datos para desarrollo
├── application-test-data.yml           # Datos para testing
└── application-prod-data.yml           # Datos para producción
```

## 🚀 Uso

### Activación del Sistema

Para usar el sistema configurable, activar el perfil correspondiente:

```bash
# Desarrollo con datos configurables
java -jar bitacora.jar --spring.profiles.active=dev,configurable-data-init,dev-data

# Testing con datos de prueba
java -jar bitacora.jar --spring.profiles.active=test,configurable-data-init,test-data

# Producción con datos mínimos
java -jar bitacora.jar --spring.profiles.active=prod,configurable-data-init,prod-data
```

### Variables de Entorno Soportadas

| Variable | Descripción | Valor por Defecto | Requerido |
|----------|-------------|-------------------|-----------|
| `ADMIN_PASSWORD` | Contraseña del usuario admin | `Admin@123` | Prod: Sí |
| `SEMPER_PASSWORD` | Contraseña del usuario semper.evincere | `SemperPass@123` | No |
| `USER_PASSWORD` | Contraseña por defecto para usuarios | `Usuario@123` | No |
| `TEST_PASSWORD` | Contraseña para usuarios de prueba | `test123` | No |
| `ADMIN_EMAIL` | Email del administrador | `admin@empresa.com` | No |
| `INIT_DATA_ENABLED` | Habilitar inicialización | `true` | No |
| `INITIAL_DATA_PROFILE` | Perfil de datos a usar | `dev` | No |

## 📝 Configuración por Ambiente

### Desarrollo (`dev-data`)

**Características:**
- ✅ Usuarios completos de prueba
- ✅ Actividades de ejemplo
- ✅ Contraseñas simples para testing
- ✅ Logs detallados de credenciales

**Usuarios incluidos:**
- `admin` / `Admin@123` (ADMIN)
- `semper.evincere` / `SemperPass@123` (ADMIN)
- `testuser` / `test123` (ADMIN)
- `usuario.ejemplo` / `Usuario@123` (USUARIO)
- `adriana.sanchez` / `1008@pass` (ASIGNADOR)
- `25789012` / `1003@pass` (EJECUTOR)

### Testing (`test-data`)

**Características:**
- ✅ Usuarios específicos para tests automatizados
- ✅ Datos predecibles y consistentes
- ✅ Cobertura de todos los roles
- ✅ Actividades de prueba controladas

**Usuarios incluidos:**
- `test-admin` / `TestAdmin@123` (ADMIN)
- `test-user` / `TestUser@123` (USUARIO)
- `test-asignador` / `TestUser@123` (ASIGNADOR)
- `test-ejecutor` / `TestUser@123` (EJECUTOR)
- `test-solicitante` / `TestUser@123` (SOLICITANTE)
- `test-inactive` / `TestUser@123` (USUARIO - inactivo)

### Producción (`prod-data`)

**Características:**
- ✅ Solo usuarios esenciales
- ✅ Contraseñas desde variables de entorno
- ✅ Sin datos de ejemplo
- ✅ Configuración segura

**Usuarios incluidos:**
- `admin` / `${ADMIN_PASSWORD}` (ADMIN) - **Requerido**
- `semper.evincere` / `${SEMPER_PASSWORD}` (ADMIN) - Opcional

## 🔧 Configuración Personalizada

### Ejemplo de Usuario Personalizado

```yaml
bitacora:
  initial-data:
    users:
      list:
        - username: mi.usuario
          password: ${MI_PASSWORD:MiPass@123}
          email: mi.usuario@empresa.com
          firstName: Mi
          lastName: Usuario
          role: ASIGNADOR
          position: Coordinador Regional
          department: Región Norte
          active: true
          permissions:
            - READ_ACTIVITIES
            - WRITE_ACTIVITIES
            - READ_USERS
```

### Ejemplo de Actividad Personalizada

```yaml
bitacora:
  initial-data:
    activities:
      enabled: true
      list:
        - type: CONSULTA
          description: Consulta sobre derechos civiles
          person: Juan Pérez
          role: Ciudadano
          dependency: Defensoría Civil
          situation: Consulta sobre procedimientos
          result: Información proporcionada
          status: COMPLETADA
          comments: Cliente satisfecho con la información
          agent: María González
          assignedUsername: mi.usuario
          daysOffset: -1  # Ayer
```

## 🔒 Seguridad

### Buenas Prácticas

1. **Variables de Entorno**: Usar siempre variables de entorno para contraseñas en producción
2. **Contraseñas Fuertes**: Configurar contraseñas robustas
3. **Usuarios Mínimos**: En producción, crear solo usuarios esenciales
4. **Logs Seguros**: No logear contraseñas en producción

### Ejemplo de Configuración Segura

```bash
# Variables de entorno para producción
export ADMIN_PASSWORD="SuperSecureAdminPass@2024!"
export SEMPER_PASSWORD="AnotherSecurePass@2024!"
export ADMIN_EMAIL="admin@miempresa.com"
export INIT_DATA_ENABLED="true"
```

## 🔄 Migración desde Sistema Anterior

### Pasos para Migrar

1. **Identificar datos actuales** en DataInitializer o migraciones
2. **Crear configuración YAML** correspondiente
3. **Configurar variables de entorno** necesarias
4. **Activar perfil configurable** en lugar del legacy
5. **Verificar funcionamiento** en ambiente de prueba

### Comparación de Sistemas

| Aspecto | Sistema Anterior | Sistema Configurable |
|---------|------------------|---------------------|
| Datos | Hardcodeados | Configurables |
| Contraseñas | En código | Variables de entorno |
| Ambientes | Mismo código | Configuración específica |
| Mantenimiento | Recompilación | Edición de archivos |
| Seguridad | Baja | Alta |
| Flexibilidad | Limitada | Total |

## 🐛 Troubleshooting

### Problemas Comunes

**Error: "Usuario admin ya existe"**
```
Solución: El usuario ya fue creado por otro mecanismo (Flyway, DataInitializer legacy)
```

**Error: "Variable de entorno no encontrada"**
```
Solución: Configurar la variable de entorno requerida o proporcionar valor por defecto
```

**Error: "Permiso desconocido"**
```
Solución: Verificar que el permiso existe en el enum Permission
```

### Logs de Diagnóstico

```bash
# Habilitar logs detallados
--logging.level.com.bitacora.infrastructure.config=DEBUG
```

## 📚 Referencias

- [README-DATA-INITIALIZATION.md](README-DATA-INITIALIZATION.md) - Sistema anterior
- [InitialDataConfig.java](src/main/java/com/bitacora/infrastructure/config/InitialDataConfig.java) - Configuración
- [ConfigurableDataInitializer.java](src/main/java/com/bitacora/infrastructure/config/ConfigurableDataInitializer.java) - Implementación
