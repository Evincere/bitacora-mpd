# Arquitectura del Sistema - Bitácora MPD

## Visión General

Bitácora MPD es una aplicación web moderna diseñada para la gestión de actividades del Ministerio Público de la Defensa. La arquitectura del sistema sigue principios de diseño modernos, incluyendo:

- **Arquitectura Hexagonal** en el backend para separar las preocupaciones y facilitar el testing
- **Arquitectura basada en componentes** en el frontend para mejorar la reutilización y mantenibilidad
- **Arquitectura de microservicios** para el despliegue y escalabilidad
- **Observabilidad integrada** para monitoreo y diagnóstico en producción

## Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           Cliente (Navegador)                           │
└───────────────────────────────────┬─────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                              Nginx (Proxy)                              │
└───────────────────────────────────┬─────────────────────────────────────┘
                                    │
                 ┌─────────────────┐│┌────────────────┐
                 │                 ▼▼▼                │
┌────────────────▼─────────────┐  ┌─▼─────────────────▼────────────────┐
│      Frontend (React/TS)     │  │      Backend (Spring Boot)         │
│                              │  │                                    │
│  ┌──────────────────────┐    │  │  ┌──────────────────────────────┐  │
│  │ Componentes de UI    │    │  │  │ Capa de Aplicación          │  │
│  └──────────────────────┘    │  │  │  (Casos de Uso)             │  │
│  ┌──────────────────────┐    │  │  └──────────────────────────────┘  │
│  │ Gestión de Estado    │    │  │  ┌──────────────────────────────┐  │
│  │ (Redux + React Query)│    │  │  │ Capa de Dominio             │  │
│  └──────────────────────┘    │  │  │  (Entidades, Reglas)        │  │
│  ┌──────────────────────┐    │  │  └──────────────────────────────┘  │
│  │ Servicios API        │◄───┼──┼─►┌──────────────────────────────┐  │
│  └──────────────────────┘    │  │  │ Capa de Infraestructura     │  │
└──────────────────────────────┘  │  │  (Adaptadores)              │  │
                                  │  └──────────────────────────────┘  │
                                  └────────────────┬─────────────────┬─┘
                                                   │                 │
                                  ┌────────────────▼─────┐ ┌─────────▼────────┐
                                  │ Base de Datos        │ │ Servicios        │
                                  │ (PostgreSQL)         │ │ Externos         │
                                  └──────────────────────┘ └──────────────────┘
                                  
┌─────────────────────────────────────────────────────────────────────────┐
│                      Infraestructura de Observabilidad                  │
│                                                                         │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐              │
│  │  Prometheus  │    │   Grafana    │    │    Zipkin    │              │
│  │  (Métricas)  │    │ (Dashboards) │    │  (Tracing)   │              │
│  └──────────────┘    └──────────────┘    └──────────────┘              │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                      Infraestructura de CI/CD                           │
│                                                                         │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐              │
│  │GitHub Actions│    │  SonarCloud  │    │  Docker Hub  │              │
│  │   (CI/CD)    │    │  (Calidad)   │    │  (Imágenes)  │              │
│  └──────────────┘    └──────────────┘    └──────────────┘              │
└─────────────────────────────────────────────────────────────────────────┘
```

## Componentes Principales

### Frontend

El frontend está construido con React y TypeScript, siguiendo una arquitectura modular basada en características:

- **Componentes de UI**: Elementos reutilizables de la interfaz de usuario
- **Gestión de Estado**: Combinación de Redux para estado global y React Query para datos remotos
- **Servicios API**: Capa de abstracción para comunicación con el backend
- **Hooks personalizados**: Lógica reutilizable para componentes
- **Lazy Loading**: Carga diferida de componentes para optimizar el rendimiento

### Backend

El backend sigue una arquitectura hexagonal (también conocida como puertos y adaptadores):

- **Capa de Aplicación**: Contiene los casos de uso de la aplicación
- **Capa de Dominio**: Contiene las entidades, reglas de negocio y puertos (interfaces)
- **Capa de Infraestructura**: Contiene los adaptadores para bases de datos, API REST, etc.

Esta arquitectura permite:
- Aislar la lógica de negocio de los detalles técnicos
- Facilitar las pruebas unitarias
- Permitir cambios en la infraestructura sin afectar la lógica de negocio

### Base de Datos

PostgreSQL se utiliza como sistema de gestión de base de datos relacional:

- **Migraciones**: Gestionadas con Flyway para control de versiones del esquema
- **Transacciones**: Garantizan la integridad de los datos
- **Índices**: Optimizados para consultas frecuentes

### Infraestructura de Observabilidad

La plataforma incluye herramientas para monitoreo y diagnóstico:

- **Prometheus**: Recopilación y almacenamiento de métricas
- **Grafana**: Visualización de métricas y alertas
- **Zipkin**: Tracing distribuido para seguimiento de solicitudes

### Infraestructura de CI/CD

La integración y entrega continuas se gestionan mediante:

- **GitHub Actions**: Automatización de pruebas, compilación y despliegue
- **SonarCloud**: Análisis de calidad de código
- **Docker Hub**: Almacenamiento de imágenes de contenedores

## Flujos de Datos

### Flujo de Autenticación

1. El usuario ingresa credenciales en el frontend
2. El frontend envía las credenciales al backend
3. El backend valida las credenciales y genera un token JWT
4. El token se devuelve al frontend y se almacena
5. Las solicitudes posteriores incluyen el token para autenticación

### Flujo de Gestión de Actividades

1. El usuario crea/edita una actividad en el frontend
2. El frontend envía los datos al backend a través de la API REST
3. El backend valida los datos según las reglas de negocio
4. Si es válido, se persiste en la base de datos
5. Se devuelve la respuesta al frontend
6. El frontend actualiza la interfaz de usuario

## Consideraciones de Seguridad

- **Autenticación**: Basada en tokens JWT con expiración
- **Autorización**: Control de acceso basado en roles y permisos
- **Validación de Datos**: Implementada tanto en frontend como en backend
- **Protección contra ataques comunes**: XSS, CSRF, inyección SQL, etc.
- **Comunicación segura**: HTTPS para todas las comunicaciones

## Escalabilidad

La arquitectura está diseñada para escalar horizontalmente:

- **Contenedores**: Facilitan la implementación de múltiples instancias
- **Stateless**: El backend no mantiene estado entre solicitudes
- **Caché**: Implementada para reducir la carga en la base de datos
- **Optimización de consultas**: Índices y consultas eficientes

## Decisiones Arquitectónicas Clave

Para más detalles sobre las decisiones arquitectónicas importantes, consulte los [Architecture Decision Records (ADRs)](../adrs/).
