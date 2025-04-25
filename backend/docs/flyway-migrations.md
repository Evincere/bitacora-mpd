# Migraciones de Base de Datos con Flyway

Este documento explica cómo manejar las migraciones de base de datos utilizando Flyway en el proyecto Bitácora.

## Estructura de las migraciones

Las migraciones de Flyway se encuentran en el directorio `src/main/resources/db/migration` y siguen una convención de nomenclatura específica:

```
V{version}__{descripción}.sql
```

Donde:
- `{version}` es un número de versión único (puede incluir puntos, como 1.0, 1.1, etc.)
- `{descripción}` es una descripción breve de la migración, usando guiones bajos en lugar de espacios

## Orden de las migraciones

Las migraciones se ejecutan en orden ascendente según su número de versión. El orden actual es:

1. `V1__Initial_Schema.sql` - Crea las tablas principales del esquema
2. `V2__Initial_Data.sql` - Inserta datos iniciales (usuarios, permisos, etc.)
3. `V3.1__Add_Indexes_For_H2.sql` - Agrega índices específicos para H2 (desarrollo)
4. `V3.2__Add_Indexes_For_PostgreSQL.sql` - Agrega índices específicos para PostgreSQL (producción)
5. `V4__create_user_sessions_table.sql` - Crea la tabla de sesiones de usuario

## Reglas importantes

1. **Nunca modifiques una migración existente** que ya ha sido ejecutada en cualquier entorno
2. **Nunca reutilices un número de versión**, incluso si has eliminado una migración anterior
3. **Cada versión debe ser única** para evitar conflictos como el error "Found more than one migration with version X"
4. **Las migraciones deben ser idempotentes** cuando sea posible (usar `IF NOT EXISTS`, `IF EXISTS`, etc.)

## Migraciones específicas para cada base de datos

El proyecto utiliza diferentes directorios para migraciones específicas de cada base de datos:

- `src/main/resources/db/migration`: Migraciones comunes para todas las bases de datos
- `src/main/resources/db/migration/dev`: Migraciones específicas para H2 (desarrollo)
- `src/main/resources/db/migration/prod`: Migraciones específicas para PostgreSQL (producción)

La configuración de Flyway en `application-dev.yml` incluye las ubicaciones para desarrollo y excluye las migraciones de PostgreSQL:

```yaml
flyway:
  locations: classpath:db/migration,classpath:db/migration/dev
  ignore-migration-patterns: V*__*PostgreSQL*
  out-of-order: true
  baseline-on-migrate: true
```

Para PostgreSQL, se utiliza un perfil específico en `application-prod.yml` que excluye las migraciones de H2:

```yaml
flyway:
  locations: classpath:db/migration,classpath:db/migration/prod
  ignore-migration-patterns: V*__*H2*
  out-of-order: true
  baseline-on-migrate: true
```

Además, los scripts de inicio (`run-dev.ps1` y `run-prod.ps1`) eliminan automáticamente los archivos de migración compilados que no corresponden al entorno actual, para evitar conflictos.

## Cómo agregar una nueva migración

Para agregar una nueva migración:

1. Si la migración es común para todas las bases de datos:
   - Crea un nuevo archivo SQL en el directorio `src/main/resources/db/migration`

2. Si la migración es específica para una base de datos:
   - Para H2 (desarrollo): Crea un archivo en `src/main/resources/db/migration/dev`
   - Para PostgreSQL (producción): Crea un archivo en `src/main/resources/db/migration/prod`

3. Nombra el archivo siguiendo la convención `V{siguiente_versión}__{descripción}.sql`

4. Escribe las sentencias SQL necesarias

5. Si necesitas crear versiones específicas para cada base de datos, asegúrate de que tengan números de versión diferentes (por ejemplo, V3.1 para H2 y V3.2 para PostgreSQL)

Ejemplo:
```sql
-- V5__add_activity_attachments.sql
CREATE TABLE activity_attachments (
    id BIGSERIAL PRIMARY KEY,
    activity_id BIGINT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT NOT NULL,
    content_type VARCHAR(100) NOT NULL,
    uploaded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    uploaded_by BIGINT NOT NULL,
    CONSTRAINT fk_activity_attachments_activity FOREIGN KEY (activity_id) REFERENCES activities(id) ON DELETE CASCADE,
    CONSTRAINT fk_activity_attachments_user FOREIGN KEY (uploaded_by) REFERENCES users(id)
);

CREATE INDEX idx_activity_attachments_activity_id ON activity_attachments(activity_id);
```

## Solución de problemas comunes

### Error: Found more than one migration with version X

Este error ocurre cuando hay dos o más archivos de migración con el mismo número de versión.

**Solución**: Renumera uno de los archivos para asignarle un número de versión único.

### Error: Migration checksum mismatch

Este error ocurre cuando se modifica una migración que ya ha sido aplicada.

**Solución**: Nunca modifiques una migración existente. En su lugar, crea una nueva migración con los cambios necesarios.

### Error: Migration script contains a non-transactional statement

Algunos comandos DDL no pueden ejecutarse dentro de una transacción en ciertas bases de datos.

**Solución**: Configura Flyway para ejecutar estas migraciones fuera de una transacción o divide la migración en múltiples archivos.

## Referencias

- [Documentación oficial de Flyway](https://flywaydb.org/documentation/)
- [Convenciones de nomenclatura de Flyway](https://flywaydb.org/documentation/concepts/migrations#naming)
- [Migraciones repetibles vs. versionadas](https://flywaydb.org/documentation/concepts/migrations#repeatable-migrations)
