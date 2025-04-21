# 5. Despliegue basado en Docker

Fecha: 2023-03-10

## Estado

Aceptado

## Contexto

Necesitamos definir una estrategia de despliegue para la aplicación que:

1. Sea consistente entre diferentes entornos (desarrollo, pruebas, producción)
2. Facilite la escalabilidad horizontal
3. Permita una gestión eficiente de dependencias
4. Soporte integración continua y despliegue continuo (CI/CD)
5. Minimice los problemas de "funciona en mi máquina"

Estamos considerando varias opciones:
- Despliegue tradicional en servidores físicos o virtuales
- Despliegue basado en contenedores (Docker)
- Despliegue en plataformas PaaS (Platform as a Service)
- Despliegue en Kubernetes

## Decisión

Implementaremos un despliegue basado en Docker con Docker Compose para orquestar los servicios.

La arquitectura de despliegue incluirá:

1. **Contenedores**:
   - Backend: Imagen basada en Eclipse Temurin (OpenJDK)
   - Frontend: Imagen basada en Nginx
   - Base de datos: PostgreSQL
   - Servicios de observabilidad: Prometheus, Grafana, Zipkin

2. **Configuración**:
   - Variables de entorno para configuración específica del entorno
   - Volúmenes para persistencia de datos
   - Red interna para comunicación entre servicios

3. **Proceso de construcción**:
   - Construcción de imágenes en el pipeline de CI/CD
   - Etiquetado de imágenes con hash de commit y versión semántica
   - Publicación de imágenes en Docker Hub

4. **Proceso de despliegue**:
   - Despliegue automatizado mediante GitHub Actions
   - Actualización de servicios sin tiempo de inactividad
   - Rollback automatizado en caso de fallos

## Consecuencias

### Positivas

- **Consistencia**: Mismo entorno en desarrollo y producción
- **Aislamiento**: Cada servicio se ejecuta en su propio contenedor
- **Portabilidad**: Funciona en cualquier entorno que soporte Docker
- **Escalabilidad**: Facilita la implementación de múltiples instancias
- **Reproducibilidad**: Entornos idénticos y reproducibles
- **CI/CD**: Integración sencilla con pipelines de CI/CD

### Negativas

- **Complejidad**: Añade complejidad operativa para equipos no familiarizados con Docker
- **Overhead**: Los contenedores añaden cierta sobrecarga en comparación con la ejecución nativa
- **Seguridad**: Requiere atención a las mejores prácticas de seguridad para contenedores
- **Persistencia**: Gestión de datos persistentes requiere configuración adicional

## Mitigación de Riesgos

1. **Documentación**: Documentación detallada del proceso de despliegue
2. **Imágenes seguras**: Uso de imágenes base oficiales y actualizadas
3. **Escaneo de vulnerabilidades**: Implementación de escaneo de imágenes en el pipeline
4. **Monitoreo**: Configuración de monitoreo y alertas para los contenedores
5. **Backups**: Estrategia de respaldo para datos persistentes

## Referencias

- [Documentación oficial de Docker](https://docs.docker.com/)
- [Documentación de Docker Compose](https://docs.docker.com/compose/)
- [Mejores prácticas para Dockerfiles](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)
- [Seguridad en contenedores Docker](https://docs.docker.com/engine/security/)
