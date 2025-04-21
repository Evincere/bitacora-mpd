# Documentación - Bitácora MPD

## Introducción

Bienvenido a la documentación del proyecto Bitácora MPD. Este directorio contiene toda la documentación técnica y de usuario para el sistema de gestión de actividades del Ministerio Público de la Defensa.

## Índice de Documentación

### Arquitectura

- [Visión General de la Arquitectura](architecture/overview.md): Descripción general de la arquitectura del sistema
- [Arquitectura del Backend](architecture/backend.md): Detalles sobre la arquitectura hexagonal del backend
- [Arquitectura del Frontend](architecture/frontend.md): Detalles sobre la arquitectura del frontend

### Decisiones de Arquitectura (ADRs)

- [ADR-0001: Registro de Decisiones de Arquitectura](adrs/0001-record-architecture-decisions.md): Decisión de utilizar ADRs
- [ADR-0002: Arquitectura Hexagonal](adrs/0002-hexagonal-architecture.md): Decisión de utilizar arquitectura hexagonal
- [ADR-0003: React con TypeScript](adrs/0003-react-typescript-frontend.md): Decisión de utilizar React con TypeScript
- [ADR-0004: Autenticación JWT](adrs/0004-jwt-authentication.md): Decisión de utilizar JWT para autenticación
- [ADR-0005: Despliegue con Docker](adrs/0005-docker-deployment.md): Decisión de utilizar Docker para despliegue
- [Plantilla de ADR](adrs/template.md): Plantilla para nuevos ADRs

### Guías de Desarrollo

- [Guía de Contribución](contributing.md): Cómo contribuir al proyecto
- [Guía de Estilo de Código](code-style.md): Estándares de codificación
- [Referencia de la API](api-reference.md): Documentación de la API REST

### CI/CD y DevOps

- [CI/CD y Monitoreo](ci-cd-monitoring.md): Configuración de CI/CD y herramientas de observabilidad

### Seguridad

- [Guía de Seguridad](security-guidelines.md): Directrices y mejores prácticas de seguridad

### Rendimiento

- [Pruebas de Rendimiento](performance-testing.md): Resultados y recomendaciones de pruebas de rendimiento

## Cómo Mantener la Documentación

### Principios

1. **Actualidad**: La documentación debe mantenerse actualizada con el código
2. **Claridad**: La documentación debe ser clara y comprensible
3. **Completitud**: La documentación debe cubrir todos los aspectos relevantes
4. **Consistencia**: La documentación debe ser consistente en estilo y formato

### Proceso de Actualización

1. Cuando se realice un cambio significativo en el código, actualizar la documentación correspondiente
2. Para cambios arquitectónicos, crear un nuevo ADR
3. Revisar la documentación como parte del proceso de revisión de código
4. Verificar regularmente la documentación para asegurar su actualidad

### Formato

Toda la documentación está escrita en Markdown para facilitar su lectura y mantenimiento. Se recomienda seguir las siguientes convenciones:

- Utilizar títulos y subtítulos adecuados (# para título principal, ## para secciones, etc.)
- Incluir ejemplos de código cuando sea relevante
- Utilizar listas para información secuencial o enumerativa
- Incluir diagramas cuando sea necesario (como texto ASCII o imágenes)
- Mantener un estilo consistente en toda la documentación

## Contribuciones a la Documentación

Se anima a todos los miembros del equipo a contribuir a la documentación. Para hacerlo:

1. Identificar áreas que necesiten documentación o actualización
2. Crear o actualizar los archivos Markdown correspondientes
3. Seguir las convenciones de formato establecidas
4. Solicitar revisión de la documentación como parte del proceso de pull request

## Herramientas Recomendadas

- **Editor Markdown**: Visual Studio Code con extensiones Markdown
- **Diagramas**: [PlantUML](https://plantuml.com/) o [Mermaid](https://mermaid-js.github.io/mermaid/)
- **Revisión**: Utilizar la funcionalidad de revisión de GitHub

## Contacto

Para preguntas o sugerencias sobre la documentación, contactar a:

- Equipo de Desarrollo: desarrollo@mpd.gov.ar
- Líder Técnico: lead-tech@mpd.gov.ar
