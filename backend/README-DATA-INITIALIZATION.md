# Inicialización de Datos en Bitácora

Este documento explica cómo se inicializan los datos de prueba en la aplicación Bitácora.

## Enfoque de Inicialización

La aplicación utiliza **Flyway** como herramienta principal para la gestión de migraciones de base de datos y la inicialización de datos de prueba.

### Migraciones de Flyway

Las migraciones se encuentran en el directorio `src/main/resources/db/migration` y siguen la convención de nomenclatura `V{número}__{descripción}.sql`.

Actualmente, existen las siguientes migraciones:

1. **V1__Initial_Schema.sql**: Crea las tablas y estructuras de la base de datos.
2. **V2__Initial_Data.sql**: Contiene datos iniciales básicos.
3. **V3__Consolidated_Test_Data.sql**: Contiene todos los datos de prueba consolidados.

La migración V3 está diseñada para ser idempotente, lo que significa que puede ejecutarse múltiples veces sin crear duplicados. Utiliza consultas condicionales para verificar si los datos ya existen antes de insertarlos.

## Configuración

La configuración de Flyway se encuentra en `application.yml`:

```yaml
spring:
  flyway:
    enabled: true
    baseline-on-migrate: true
    locations: classpath:db/migration
    out-of-order: true
```

### Notas importantes

1. **Inicialización de SQL nativa deshabilitada**: La inicialización mediante `data.sql` ha sido deshabilitada para evitar conflictos con las migraciones de Flyway:

```yaml
spring:
  sql:
    init:
      mode: never # Deshabilitado para usar solo migraciones Flyway
```

2. **DataInitializer**: La clase `DataInitializer.java` sigue existiendo como mecanismo de respaldo, pero está deshabilitada por defecto. Solo se activa cuando se ejecuta la aplicación con el perfil `data-init`:

```bash
# Activar DataInitializer (no recomendado para uso normal)
java -jar bitacora.jar --spring.profiles.active=dev,data-init
```

Se recomienda usar las migraciones de Flyway como método principal para inicializar datos.

## Añadir Nuevos Datos de Prueba

Para añadir nuevos datos de prueba, se recomienda:

1. Crear una nueva migración de Flyway con un número de versión superior (por ejemplo, `V4__Additional_Test_Data.sql`).
2. Utilizar consultas condicionales para evitar duplicados, siguiendo el patrón de `V3__Consolidated_Test_Data.sql`.

## Entornos

- **Desarrollo**: En el entorno de desarrollo (perfil `dev`), se utiliza H2 como base de datos en memoria y se ejecutan todas las migraciones.
- **Producción**: En el entorno de producción (perfil `prod`), se utiliza PostgreSQL y también se ejecutan las migraciones, pero se recomienda tener migraciones específicas para datos de producción.

## Solución de Problemas

Si los datos de prueba no se cargan correctamente:

1. Verificar los logs de la aplicación para errores relacionados con Flyway.
2. Comprobar que la configuración de Flyway esté correcta en `application.yml`.
3. Verificar que las migraciones estén en el directorio correcto y sigan la convención de nomenclatura.
4. Acceder a la consola H2 (http://localhost:8080/api/h2-console) para verificar directamente el estado de la base de datos.
