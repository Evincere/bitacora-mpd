# Generación de Tipos TypeScript desde OpenAPI

Este proyecto utiliza OpenAPI Generator para generar automáticamente tipos TypeScript a partir de la especificación OpenAPI del backend. Esto garantiza que el frontend y el backend estén sincronizados en términos de tipos de datos y endpoints.

## Requisitos

- Java 21 o superior
- Maven 3.8 o superior
- Node.js 18 o superior (para el frontend)

## Proceso de Generación

El proceso de generación consta de dos pasos:

1. Exportar la especificación OpenAPI desde Spring Boot a un archivo JSON
2. Utilizar OpenAPI Generator para generar los tipos TypeScript a partir del archivo JSON

## Instrucciones

### Método 1: Usando el Script Automatizado (Recomendado)

Ejecuta el script `generate-typescript.bat` desde la carpeta `backend`:

```bash
cd backend
./generate-typescript.bat
```

Este script:
1. Inicia la aplicación Spring Boot con el perfil `export-openapi` para generar el archivo `openapi.json`
2. Ejecuta el plugin OpenAPI Generator para generar los tipos TypeScript
3. Verifica que todo el proceso se haya completado correctamente

### Método 2: Paso a Paso

Si prefieres ejecutar los pasos manualmente:

1. Genera el archivo OpenAPI JSON:

```bash
cd backend
mvnw spring-boot:run -Dspring-boot.run.profiles=export-openapi -Dspring-boot.run.arguments="--openapi.export=true"
```

2. Verifica que el archivo `target/openapi.json` se haya generado correctamente

3. Genera los tipos TypeScript:

```bash
mvnw org.openapitools:openapi-generator-maven-plugin:generate@generate-typescript-client
```

4. Verifica que los tipos se hayan generado en `frontend/src/api/generated`

## Solución de Problemas

### El archivo openapi.json no se genera

- Verifica que la aplicación Spring Boot se inicie correctamente con el perfil `export-openapi`
- Asegúrate de que la clase `OpenApiExporter` esté configurada correctamente
- Verifica los logs de la aplicación para ver si hay errores durante la exportación

### Error en la generación de tipos TypeScript

- Verifica que el archivo `openapi.json` exista y sea válido
- Asegúrate de que la configuración del plugin OpenAPI Generator en el `pom.xml` sea correcta
- Verifica que las rutas de los directorios sean correctas

### Tipos generados incorrectamente

- Verifica la configuración de OpenAPI en el backend
- Asegúrate de que las anotaciones en los controladores y DTOs sean correctas
- Verifica que la especificación OpenAPI generada sea válida

## Configuración Avanzada

### Personalización de la Generación de Tipos

Puedes personalizar la generación de tipos TypeScript modificando la configuración del plugin OpenAPI Generator en el archivo `pom.xml`:

```xml
<plugin>
    <groupId>org.openapitools</groupId>
    <artifactId>openapi-generator-maven-plugin</artifactId>
    <version>6.6.0</version>
    <executions>
        <execution>
            <id>generate-typescript-client</id>
            <goals>
                <goal>generate</goal>
            </goals>
            <configuration>
                <inputSpec>${project.build.directory}/openapi.json</inputSpec>
                <generatorName>typescript-fetch</generatorName>
                <o>${project.basedir}/../frontend/src/api/generated</o>
                <configOptions>
                    <supportsES6>true</supportsES6>
                    <npmName>@bitacora/api-client</npmName>
                    <npmVersion>1.0.0</npmVersion>
                    <withInterfaces>true</withInterfaces>
                    <modelPropertyNaming>camelCase</modelPropertyNaming>
                    <enumPropertyNaming>UPPERCASE</enumPropertyNaming>
                    <typescriptThreePlus>true</typescriptThreePlus>
                </configOptions>
            </configuration>
        </execution>
    </executions>
</plugin>
```

### Personalización de la Exportación OpenAPI

Puedes personalizar la exportación de la especificación OpenAPI modificando la clase `OpenApiExporter` y las propiedades en `application.properties` o `application.yml`:

```properties
# Ruta de salida del archivo OpenAPI
openapi.output.file=target/openapi.json

# Habilitar exportación automática al iniciar la aplicación
openapi.export=false
```

## Integración con el Frontend

Los tipos generados se guardan en `frontend/src/api/generated` y pueden ser importados en el código TypeScript del frontend:

```typescript
import { ActivityDto, ActivityStatus } from '../api/generated';

// Usar los tipos generados
const activity: ActivityDto = {
  id: 1,
  title: 'Nueva actividad',
  status: ActivityStatus.PENDING
};
```

## Más Información

- [OpenAPI Generator](https://openapi-generator.tech/)
- [SpringDoc OpenAPI](https://springdoc.org/)
- [TypeScript](https://www.typescriptlang.org/)
