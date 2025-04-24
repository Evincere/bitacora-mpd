# Arquitectura de la Aplicación Bitácora

## Visión General

La aplicación Bitácora está construida siguiendo una arquitectura moderna y modular, diseñada para facilitar el mantenimiento, la escalabilidad y la colaboración entre desarrolladores. La arquitectura se basa en los siguientes principios:

1. **Separación de Responsabilidades**: Cada componente tiene una responsabilidad única y bien definida.
2. **Modularidad**: La aplicación está dividida en módulos independientes que pueden desarrollarse y probarse de forma aislada.
3. **Escalabilidad**: La estructura permite añadir nuevas funcionalidades sin afectar a las existentes.
4. **Mantenibilidad**: El código está organizado de manera que sea fácil de entender y mantener.

## Estructura de Carpetas

La aplicación sigue una estructura de carpetas basada en características (feature-based) combinada con una arquitectura de capas:

```
frontend/
├── public/              # Archivos estáticos
├── src/                 # Código fuente
│   ├── core/            # Núcleo de la aplicación
│   │   ├── api/         # Configuración y utilidades para API
│   │   ├── hooks/       # Hooks personalizados globales
│   │   ├── store/       # Estado global (Redux)
│   │   ├── types/       # Tipos y interfaces globales
│   │   └── utils/       # Utilidades y funciones auxiliares
│   ├── features/        # Características/módulos de la aplicación
│   │   ├── activities/  # Módulo de actividades
│   │   │   ├── components/  # Componentes específicos
│   │   │   ├── hooks/       # Hooks específicos
│   │   │   ├── pages/       # Páginas/vistas
│   │   │   ├── schemas/     # Esquemas de validación
│   │   │   └── services/    # Servicios específicos
│   │   ├── auth/        # Módulo de autenticación
│   │   ├── calendar/    # Módulo de calendario
│   │   └── notifications/ # Módulo de notificaciones
│   ├── shared/          # Componentes y utilidades compartidas
│   │   ├── components/  # Componentes reutilizables
│   │   │   ├── common/  # Componentes básicos
│   │   │   ├── layout/  # Componentes de layout
│   │   │   └── ui/      # Componentes de UI
│   │   └── styles/      # Estilos globales y temas
│   ├── App.tsx          # Componente principal
│   └── main.tsx         # Punto de entrada
└── tests/               # Pruebas
    ├── unit/            # Pruebas unitarias
    └── integration/     # Pruebas de integración
```

## Capas de la Aplicación

### 1. Core (Núcleo)

El núcleo de la aplicación contiene la lógica central y las configuraciones que son utilizadas por múltiples módulos:

- **api**: Configuración de clientes HTTP, interceptores y funciones para realizar peticiones.
- **hooks**: Hooks de React personalizados que pueden ser utilizados en toda la aplicación.
- **store**: Configuración de Redux para el estado global.
- **types**: Definiciones de tipos e interfaces globales.
- **utils**: Funciones utilitarias, helpers y lógica de negocio compartida.

### 2. Features (Características)

Cada característica o módulo de la aplicación está contenido en su propia carpeta, lo que permite un desarrollo aislado y enfocado:

- **components**: Componentes específicos de la característica.
- **hooks**: Hooks personalizados específicos de la característica.
- **pages**: Componentes de página/vista que representan rutas en la aplicación.
- **schemas**: Esquemas de validación para formularios y datos.
- **services**: Servicios específicos para interactuar con APIs o realizar operaciones complejas.

### 3. Shared (Compartido)

Contiene componentes y utilidades que son utilizados por múltiples características:

- **components/common**: Componentes básicos reutilizables (botones, inputs, etc.).
- **components/layout**: Componentes de estructura (header, sidebar, etc.).
- **components/ui**: Componentes de interfaz de usuario más complejos.
- **styles**: Estilos globales, temas y configuraciones de estilo.

## Gestión de Estado

La aplicación utiliza una combinación de estrategias para la gestión de estado:

1. **Redux**: Para estado global que necesita ser accesible desde múltiples componentes.
2. **React Query**: Para estado del servidor, caching y sincronización de datos.
3. **React Context**: Para estado compartido dentro de una característica específica.
4. **Estado local**: Para estado que solo es relevante para un componente específico.

## Flujo de Datos

El flujo de datos en la aplicación sigue un patrón unidireccional:

1. **Componentes de UI**: Renderizan datos y disparan acciones.
2. **Acciones**: Describen cambios en el estado o solicitudes de datos.
3. **Servicios/API**: Realizan operaciones asíncronas como peticiones HTTP.
4. **Store/Queries**: Actualizan el estado basado en los resultados.
5. **Componentes de UI**: Se re-renderizan con los nuevos datos.

## Convenciones de Código

### Nomenclatura

- **Archivos de componentes**: PascalCase (ej. `ActivityList.tsx`)
- **Archivos de hooks**: camelCase con prefijo "use" (ej. `useActivities.ts`)
- **Archivos de utilidades**: camelCase (ej. `dateUtils.ts`)
- **Archivos de tipos**: camelCase (ej. `models.ts`)

### Importaciones

Las importaciones se organizan en el siguiente orden:

1. Importaciones de React y bibliotecas externas
2. Importaciones de componentes y hooks propios
3. Importaciones de tipos y utilidades
4. Importaciones de estilos

### Componentes

- Preferir componentes funcionales con hooks
- Utilizar React.memo para optimizar rendimiento cuando sea necesario
- Extraer lógica compleja a hooks personalizados

### Estilos

- Utilizar styled-components para estilos
- Seguir el sistema de diseño definido en los temas
- Evitar estilos inline excepto para valores dinámicos

## Pruebas

La estrategia de pruebas incluye:

1. **Pruebas unitarias**: Para funciones, hooks y componentes aislados.
2. **Pruebas de integración**: Para flujos completos y interacción entre componentes.
3. **Pruebas end-to-end**: Para flujos críticos de usuario.

## Herramientas y Tecnologías

- **React**: Biblioteca principal para la interfaz de usuario
- **TypeScript**: Tipado estático para mejorar la calidad del código
- **Redux**: Gestión de estado global
- **React Query**: Gestión de estado del servidor
- **Styled Components**: Estilos con CSS-in-JS
- **React Hook Form**: Manejo de formularios
- **Zod**: Validación de esquemas
- **Vite**: Herramienta de construcción y desarrollo
- **Vitest**: Framework de pruebas
- **React Testing Library**: Utilidades para pruebas de componentes

## Flujo de Desarrollo

1. **Planificación**: Definir requisitos y diseñar la solución
2. **Implementación**: Desarrollar la funcionalidad siguiendo la arquitectura
3. **Pruebas**: Escribir y ejecutar pruebas para verificar la funcionalidad
4. **Revisión**: Revisar el código y realizar ajustes
5. **Integración**: Integrar los cambios en la rama principal
6. **Despliegue**: Desplegar la aplicación en el entorno correspondiente
