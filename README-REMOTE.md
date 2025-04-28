# Instrucciones para ejecutar la aplicación en un servidor remoto

## Configuración de puertos

Hemos detectado un conflicto de puertos entre Grafana y el frontend, ya que ambos estaban intentando usar el puerto 3000. Hemos realizado los siguientes cambios para solucionar este problema:

1. Modificado la configuración para que Grafana use el puerto 3100 en lugar de 3000, dejando el puerto 3000 para el frontend.
2. Creado un archivo `.env` para configurar los puertos de los servicios.
3. Actualizado los scripts para usar los puertos correctos.

## Pasos para ejecutar la aplicación en modo producción

1. **Hacer ejecutables los scripts**:
   ```bash
   chmod +x make-scripts-executable.sh
   ./make-scripts-executable.sh
   ```

2. **Instalar Java 17** (si no lo tienes instalado):
   ```bash
   sudo ./install-java17.sh
   ```

3. **Instalar las dependencias faltantes del frontend**:
   ```bash
   ./install-frontend-dependencies.sh
   ```

4. **Iniciar la aplicación en modo producción**:

   **Opción 1: Usando Docker para todo**
   ```bash
   ./start-app-prod.sh
   ```

   **Opción 2: Usando Docker solo para el backend y la base de datos**
   ```bash
   ./start-app-prod-no-docker-frontend.sh
   ```

5. **Para detener la aplicación**:
   ```bash
   docker-compose down
   ```

## URLs de acceso

- **Frontend**: http://tu-ip:3000
- **Backend API**: http://tu-ip:8080/api
- **Grafana**: http://tu-ip:3100
- **Prometheus**: http://tu-ip:9090
- **Zipkin**: http://tu-ip:9411

## Solución de problemas

Si tienes problemas para acceder a la aplicación, verifica lo siguiente:

1. **Verifica que los puertos estén abiertos en el firewall**:
   ```bash
   sudo ufw status
   ```

2. **Si los puertos no están abiertos, ábrelos**:
   ```bash
   sudo ufw allow 3000/tcp
   sudo ufw allow 8080/tcp
   sudo ufw allow 3100/tcp
   sudo ufw allow 9090/tcp
   sudo ufw allow 9411/tcp
   ```

3. **Verifica que los servicios estén en ejecución**:
   ```bash
   docker-compose ps
   ```

4. **Si algún servicio no está en ejecución, verifica los logs**:
   ```bash
   docker-compose logs <nombre-del-servicio>
   ```

5. **Si necesitas reiniciar un servicio específico**:
   ```bash
   docker-compose restart <nombre-del-servicio>
   ```

## Notas adicionales

- El frontend se ejecutará en el puerto 3000
- El backend se ejecutará en el puerto 8080
- Grafana se ejecutará en el puerto 3100
- Prometheus se ejecutará en el puerto 9090
- Zipkin se ejecutará en el puerto 9411

Si necesitas cambiar algún puerto, puedes modificar el archivo `.env` y reiniciar la aplicación.
