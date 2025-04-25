# Solución de problemas comunes

## Problema: Dependencia circular entre Flyway y JPA

Si ves un error como este:

```
Circular depends-on relationship between 'flyway' and 'entityManagerFactory'
```

### Solución:

1. Este problema ha sido resuelto con una configuración personalizada. Consulta el archivo `docs/flyway-jpa-circular-dependency.md` para más detalles.

2. Si el problema persiste, asegúrate de que el perfil `flyway` está activado:
   ```
   mvn spring-boot:run -Dspring-boot.run.profiles=dev,flyway
   ```

3. Verifica que las clases `FlywayConfig.java` y `JpaConfig.java` existen en el paquete `com.bitacora.infrastructure.config`.

## Problema: Migraciones de Flyway con la misma versión

Si ves un error como este:

```
Found more than one migration with version X
Offenders:
-> path/to/V2__file1.sql
-> path/to/V2__file2.sql
```

### Solución:

1. Renumera uno de los archivos de migración para asignarle un número de versión único:
   ```
   # Renombrar V2__file2.sql a V3__file2.sql
   ```

2. Asegúrate de que cada archivo de migración tenga un número de versión único.

3. Para más detalles sobre las migraciones de Flyway, consulta el archivo `docs/flyway-migrations.md`.

## Problema: Error de sintaxis SQL en migraciones de Flyway

Si ves un error como este:

```
Migration V2__Initial_Data.sql failed
SQL State  : 22007
Error Code : 22007
Message    : Imposible interpretar la constante "INTERVAL" "2 days"
```

### Solución:

1. Utiliza funciones compatibles con H2 en lugar de la sintaxis de PostgreSQL:
   ```sql
   -- En lugar de:
   CURRENT_TIMESTAMP - INTERVAL '2 days'

   -- Usa:
   DATEADD('DAY', -2, CURRENT_TIMESTAMP)
   ```

2. Consulta el archivo `docs/database-compatibility.md` para ver las diferencias de sintaxis entre H2 y PostgreSQL.

## Problema: Error con índices específicos de PostgreSQL en H2

Si ves un error como este:

```
Migration V3__Add_Indexes_For_PostgreSQL.sql failed
SQL State  : 42001
Error Code : 42001
Message    : Error de Sintaxis en sentencia SQL "CREATE INDEX ... USING gin(to_tsvector('spanish', description))"
```

### Solución:

1. El proyecto ahora utiliza directorios específicos para migraciones de cada base de datos:
   - `src/main/resources/db/migration/dev`: Para migraciones específicas de H2 (desarrollo)
   - `src/main/resources/db/migration/prod`: Para migraciones específicas de PostgreSQL (producción)

2. Asegúrate de que estás utilizando el perfil correcto:
   - Para desarrollo con H2: `dev,flyway`
   - Para producción con PostgreSQL: `prod,flyway`

3. Utiliza los scripts de inicio para ejecutar la aplicación con la configuración correcta:
   ```
   # Para desarrollo con H2
   .\run-dev.ps1

   # Para producción con PostgreSQL
   .\run-prod.ps1

   # Para limpiar la base de datos y reiniciar las migraciones
   .\clean-db.ps1
   ```

4. Consulta el archivo `docs/flyway-migrations.md` para más detalles sobre las migraciones específicas de cada base de datos.

## Problema: Migraciones con la misma versión en diferentes directorios

Si ves un error como este:

```
Found more than one migration with version 3
Offenders:
-> .../migration/postgresql/V3__Add_Indexes_For_PostgreSQL.sql (SQL)
-> .../migration/h2/V3__Add_Indexes_For_H2.sql (SQL)
```

### Solución:

1. Las migraciones específicas para cada base de datos deben tener números de versión diferentes, incluso si están en directorios separados:
   ```
   # Usar versiones diferentes para cada base de datos
   V3.1__Add_Indexes_For_H2.sql
   V3.2__Add_Indexes_For_PostgreSQL.sql
   ```

2. Flyway considera todas las migraciones en todas las ubicaciones configuradas, por lo que no puede haber duplicados de versión.

3. Consulta el archivo `docs/flyway-migrations.md` para más detalles sobre las convenciones de nomenclatura de migraciones.

## Problema: Error de conexión a PostgreSQL

Si ves un error como este:

```
org.postgresql.util.PSQLException: FATAL: no existe la base de datos "bitacora"
```

### Solución:

1. Verifica que estás usando la configuración de H2 en lugar de PostgreSQL:
   - Asegúrate de que el archivo `application.yml` existe y contiene la configuración de H2
   - Asegúrate de que no hay un archivo `application.properties` que pueda estar sobrescribiendo la configuración

2. Limpia y reconstruye el proyecto:
   ```
   mvn clean package -DskipTests
   ```

3. Ejecuta el proyecto con:
   ```
   mvn spring-boot:run
   ```

4. Si el problema persiste, intenta eliminar la carpeta `target` y vuelve a compilar:
   ```
   rmdir /s /q target
   mvn clean package -DskipTests
   mvn spring-boot:run
   ```

## Problema: No se puede acceder a la consola H2

Si no puedes acceder a la consola H2 en http://localhost:8080/api/h2-console

### Solución:

1. Verifica que el servidor está en ejecución
2. Verifica que la configuración de seguridad permite el acceso a la consola H2
3. Usa estos datos de conexión en la consola H2:
   - JDBC URL: `jdbc:h2:mem:bitacoradb`
   - Usuario: `sa`
   - Contraseña: (dejar en blanco)

## Problema: No se cargan los datos de ejemplo

Si los datos de ejemplo no se cargan automáticamente:

### Solución:

1. Verifica que el archivo `data.sql` existe en `src/main/resources`
2. Verifica que la configuración incluye:
   ```yaml
   spring:
     jpa:
       defer-datasource-initialization: true
     sql:
       init:
         mode: always
   ```

3. Asegúrate de que la configuración de JPA es `ddl-auto: create-drop`

## Problema: Error al generar tipos TypeScript

Si ves un error como este:

```
[ERROR] Failed to execute goal org.openapitools:openapi-generator-maven-plugin:6.6.0:generate (generate-typescript-client) on project bitacora-backend: Code generation failed.
```

### Solución:

1. Utiliza los scripts específicos para generar el archivo OpenAPI y los tipos TypeScript:
   - En Windows: `generate-openapi-typescript.bat`
   - En Linux/Mac: `./generate-openapi-typescript.sh`

2. Si los scripts no funcionan, genera el archivo OpenAPI manualmente:
   ```
   mkdir -p target
   # Crear un archivo openapi.json básico en target/
   mvn org.openapitools:openapi-generator-maven-plugin:generate@generate-typescript-client -DskipValidateSpec=true
   ```

3. Para más detalles, consulta la documentación en `docs/openapi-typescript.md`

## Problema: Errores de compilación

Si hay errores de compilación relacionados con Java 21:

### Solución:

1. Verifica que tienes instalado Java 21:
   ```
   java -version
   ```

2. Asegúrate de que Maven está usando Java 21:
   ```
   mvn -v
   ```

3. Verifica que el archivo `pom.xml` tiene la configuración correcta:
   ```xml
   <properties>
       <java.version>21</java.version>
       <maven.compiler.source>21</maven.compiler.source>
       <maven.compiler.target>21</maven.compiler.target>
   </properties>
   ```
