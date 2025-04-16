# Solución de problemas comunes

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
