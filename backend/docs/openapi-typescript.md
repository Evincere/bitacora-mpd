# Generación de OpenAPI y Tipos TypeScript

Este documento explica cómo generar la especificación OpenAPI y los tipos TypeScript para el frontend.

## Problema común

Al ejecutar el comando `mvn package` o `mvn install`, es posible que encuentres un error como este:

```
[ERROR] Failed to execute goal org.openapitools:openapi-generator-maven-plugin:6.6.0:generate (generate-typescript-client) on project bitacora-backend: Code generation failed. See above for the full exception.
```

Este error ocurre porque el plugin `openapi-generator-maven-plugin` no puede encontrar el archivo `openapi.json` en la ruta `target/openapi.json`.

## Solución

Hemos creado scripts específicos para generar el archivo OpenAPI y los tipos TypeScript:

### En Windows

```bash
# Desde el directorio backend
generate-openapi-typescript.bat
```

### En Linux/Mac

```bash
# Desde el directorio backend
./generate-openapi-typescript.sh
```

## Cómo funciona

El script realiza las siguientes acciones:

1. **Genera el archivo OpenAPI**:
   - Intenta generar el archivo usando la clase `OpenApiGenerator`
   - Si falla, crea un archivo OpenAPI básico manualmente

2. **Genera los tipos TypeScript**:
   - Utiliza el plugin `openapi-generator-maven-plugin` para generar los tipos TypeScript
   - Los tipos se generan en `../frontend/src/api/generated`

## Generación manual

Si los scripts no funcionan, puedes generar el archivo OpenAPI manualmente:

1. Crea un directorio `target` en el directorio `backend` si no existe
2. Crea un archivo `openapi.json` en el directorio `target` con el contenido mínimo necesario
3. Ejecuta el comando para generar los tipos TypeScript:

```bash
mvn org.openapitools:openapi-generator-maven-plugin:generate@generate-typescript-client -DskipValidateSpec=true
```

## Verificación

Para verificar que los tipos se han generado correctamente:

1. Comprueba que existe el directorio `frontend/src/api/generated`
2. Verifica que contiene archivos `.ts` con los tipos generados

## Solución de problemas

### El archivo OpenAPI no se genera

- Verifica que la clase `OpenApiGenerator` existe en el paquete `com.bitacora.tools`
- Asegúrate de que el directorio `target` existe y tiene permisos de escritura
- Ejecuta el comando `mvn exec:java -Dexec.mainClass="com.bitacora.tools.OpenApiGenerator"` para ver si hay errores

### Los tipos TypeScript no se generan

- Verifica que el archivo `openapi.json` existe en el directorio `target`
- Asegúrate de que el archivo `openapi.json` es un archivo JSON válido
- Ejecuta el comando con la opción `-X` para ver más detalles:

```bash
mvn -X org.openapitools:openapi-generator-maven-plugin:generate@generate-typescript-client -DskipValidateSpec=true
```

## Referencias

- [OpenAPI Generator Maven Plugin](https://github.com/OpenAPITools/openapi-generator/tree/master/modules/openapi-generator-maven-plugin)
- [TypeScript Fetch Generator](https://github.com/OpenAPITools/openapi-generator/blob/master/docs/generators/typescript-fetch.md)
