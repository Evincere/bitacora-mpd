# CI/CD y Monitoreo - Bitácora MPD

Este documento describe la configuración de CI/CD (Integración Continua/Entrega Continua) y monitoreo implementada en el proyecto Bitácora MPD.

## Integración Continua (CI)

### GitHub Actions

Se han configurado flujos de trabajo (workflows) en GitHub Actions para automatizar la compilación, pruebas y validación del código:

- **Backend CI**: Compila y prueba el código Java del backend.
- **Frontend CI**: Compila y prueba el código TypeScript del frontend.

Estos workflows se ejecutan automáticamente cuando:
- Se realiza un push a las ramas `main` o `develop`
- Se crea un pull request hacia estas ramas

### Análisis de Código

Se utiliza SonarCloud para analizar la calidad del código:

- **Cobertura de código**: Mide qué porcentaje del código está cubierto por pruebas.
- **Deuda técnica**: Identifica problemas de código que podrían causar dificultades de mantenimiento.
- **Vulnerabilidades**: Detecta posibles problemas de seguridad.

## Entrega Continua (CD)

### Pipeline de Despliegue

El proceso de despliegue está automatizado mediante GitHub Actions:

1. **Compilación**: Se compilan el backend y el frontend.
2. **Construcción de imágenes Docker**: Se crean imágenes Docker para ambos componentes.
3. **Publicación en Docker Hub**: Las imágenes se suben a Docker Hub.
4. **Despliegue en servidor**: Se actualiza la aplicación en el servidor de producción.

### Gestión de Secretos

Los secretos y credenciales se gestionan de forma segura:

- **GitHub Secrets**: Almacena credenciales de Docker Hub, SSH y otros secretos.
- **Variables de entorno**: Se configuran en el servidor mediante un archivo `.env`.

## Monitoreo y Observabilidad

### Prometheus

Prometheus recopila métricas de la aplicación:

- **JVM**: Uso de memoria, garbage collection, etc.
- **HTTP**: Tiempos de respuesta, códigos de estado, etc.
- **Aplicación**: Métricas personalizadas de negocio.

### Grafana

Grafana proporciona dashboards visuales para monitorear:

- **Rendimiento**: Tiempos de respuesta, uso de recursos, etc.
- **Disponibilidad**: Uptime, health checks, etc.
- **Negocio**: Métricas específicas de la aplicación.

### Tracing Distribuido

Zipkin permite seguir las solicitudes a través de los diferentes componentes:

- **Latencia**: Identifica cuellos de botella en el procesamiento.
- **Errores**: Localiza dónde se producen los fallos.
- **Dependencias**: Visualiza las relaciones entre servicios.

## Configuración Local

### Requisitos

- Docker y Docker Compose
- Java 21
- Node.js 20

### Pasos para Ejecutar

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/Evincere/bitacora-mpd.git
   cd bitacora-mpd
   ```

2. Crear archivo de variables de entorno:
   ```bash
   cp .env.example .env
   # Editar .env con los valores adecuados
   ```

3. Iniciar los servicios:
   ```bash
   docker-compose up -d
   ```

4. Acceder a las interfaces:
   - **Aplicación**: http://localhost
   - **Prometheus**: http://localhost:9090
   - **Grafana**: http://localhost:3000
   - **Zipkin**: http://localhost:9411

## Alertas

Se han configurado alertas para notificar problemas:

- **Disponibilidad**: Cuando la aplicación no responde.
- **Rendimiento**: Cuando los tiempos de respuesta superan los umbrales.
- **Recursos**: Cuando el uso de CPU o memoria es excesivo.

Las alertas se envían por correo electrónico y/o Slack según la configuración.
