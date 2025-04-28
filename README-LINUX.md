# Instrucciones para entorno Linux

## Solución al problema de compilación con Java 21

Hemos detectado que el proyecto está configurado para usar Java 21, pero muchos sistemas Linux tienen instalado Java 17. Hemos realizado los siguientes cambios para solucionar este problema:

1. Modificado el archivo `pom.xml` para usar Java 17 en lugar de Java 21.
2. Configurado explícitamente el plugin de compilación de Maven para usar Java 17.

## Pasos para ejecutar el proyecto en Linux

1. **Hacer ejecutables los scripts**:
   ```bash
   chmod +x make-scripts-executable.sh
   ./make-scripts-executable.sh
   ```

2. **Instalar Java 17** (si no lo tienes instalado):
   ```bash
   sudo ./install-java17.sh
   ```

3. **Compilar el backend**:
   ```bash
   ./compile-backend.sh
   ```

4. **Iniciar el entorno de desarrollo**:
   ```bash
   ./start-dev-linux.sh
   ```

5. **Para detener el entorno cuando hayas terminado**:
   ```bash
   ./stop-dev-linux.sh
   ```

## Solución de problemas

Si sigues teniendo problemas con la compilación, puedes intentar lo siguiente:

1. **Compilar con opciones explícitas**:
   ```bash
   cd backend
   JAVA_HOME=$(dirname $(dirname $(readlink -f $(which java)))) mvn clean package -DskipTests -Dmaven.compiler.release=17
   cd ..
   ```

2. **Verificar la versión de Java**:
   ```bash
   java --version
   ```

3. **Verificar la configuración de Maven**:
   ```bash
   mvn -v
   ```

4. **Limpiar la caché de Maven**:
   ```bash
   rm -rf ~/.m2/repository/com/bitacora
   ```

5. **Ejecutar Maven en modo debug**:
   ```bash
   cd backend
   mvn clean package -DskipTests -X
   cd ..
   ```

## Notas adicionales

- El backend se ejecutará en el puerto 8080
- El frontend se ejecutará en el puerto 3000
- La base de datos H2 estará disponible en http://localhost:8080/api/h2-console
- Swagger UI estará disponible en http://localhost:8080/api/swagger-ui/index.html
