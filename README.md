# Bitácora - Plataforma de Gestión de Actividades

## Descripción

Bitácora es una plataforma moderna para la gestión de actividades y tareas que reemplaza el sistema actual basado en CSV. Permite a los equipos registrar, dar seguimiento y analizar las actividades realizadas de manera eficiente y colaborativa.

## Características principales

- **Registro estructurado de actividades**: Formularios inteligentes adaptados a diferentes tipos de actividades
- **Dashboard personalizable**: Visualización de métricas y actividades relevantes
- **Colaboración entre equipos**: Espacios de trabajo compartidos con permisos granulares
- **Asistente IA integrado**: Inteligencia artificial que ayuda en la clasificación, priorización y análisis
- **Reportes y análisis**: Visualizaciones avanzadas y métricas personalizables
- **Interfaz moderna**: Diseño intuitivo con modo oscuro y experiencia de usuario optimizada

## Arquitectura

### Backend
- Java 21
- Arquitectura Hexagonal
- Spring Boot 3.x
- PostgreSQL
- API RESTful

### Frontend
- React con Next.js
- Arquitectura modular basada en features
- Styled Components / Tailwind CSS
- Redux Toolkit para gestión de estado

## Estructura del proyecto

```
bitacora/
├── backend/                # Aplicación Java (Spring Boot)
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/
│   │   │   │       └── bitacora/
│   │   │   │           ├── application/    # Casos de uso
│   │   │   │           ├── domain/         # Entidades y reglas de negocio
│   │   │   │           ├── infrastructure/ # Adaptadores (REST, DB, etc.)
│   │   │   │           └── BitacoraApplication.java
│   │   │   └── resources/
│   │   └── test/
│   └── pom.xml
│
└── frontend/              # Aplicación React
    ├── public/
    ├── src/
    │   ├── assets/
    │   ├── components/
    │   ├── features/      # Módulos por funcionalidad
    │   ├── hooks/
    │   ├── services/
    │   ├── store/
    │   ├── styles/
    │   ├── utils/
    │   ├── App.jsx
    │   └── main.jsx
    ├── package.json
    └── vite.config.js
```

## Requisitos

- Node.js 18+
- Java 21 JDK
- PostgreSQL 14+
- Maven 3.8+

## Instalación y ejecución

### Inicio rápido (Windows)

Para iniciar toda la aplicación con un solo comando:

```bash
.\start-app.bat
```

Esto iniciará tanto el backend como el frontend y abrirá la aplicación en el navegador.

### Instalación manual

#### Backend

```bash
cd backend
mvn clean install

# Ejecutar con H2 (base de datos en memoria)
.\run-h2.bat

# O ejecutar normalmente (requiere PostgreSQL)
# mvn spring-boot:run
```

##### Solución de problemas del backend

Si encuentras problemas al ejecutar el backend, consulta el archivo `backend/TROUBLESHOOTING.md` para ver soluciones a problemas comunes.

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Acceso a la aplicación

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080/api
- **Consola H2**: http://localhost:8080/api/h2-console

## Principios de desarrollo

- Arquitectura hexagonal en el backend
- Arquitectura modular basada en features en el frontend
- Principios SOLID y Clean Code
- Patrones de diseño apropiados para cada contexto
- Testing automatizado

## Equipo

- Desarrolladores backend
- Desarrolladores frontend
- Diseñadores UX/UI
- Especialistas en IA

## Licencia

Propiedad de la organización. Todos los derechos reservados.
