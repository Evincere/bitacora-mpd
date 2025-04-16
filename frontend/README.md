# Frontend de Bitácora

Este es el frontend de la aplicación Bitácora, desarrollado con React y Vite.

## Requisitos previos

- Node.js 18+ instalado
- npm 9+ instalado

## Instalación

1. Instalar las dependencias:

```bash
npm install
```

## Ejecución en desarrollo

Para ejecutar la aplicación en modo desarrollo:

```bash
npm run dev
```

Esto iniciará el servidor de desarrollo en `http://localhost:3000`.

## Construcción para producción

Para construir la aplicación para producción:

```bash
npm run build
```

Los archivos generados se encontrarán en el directorio `dist`.

## Estructura del proyecto

```
frontend/
├── public/              # Archivos estáticos
├── src/
│   ├── assets/          # Imágenes, fuentes, etc.
│   ├── components/      # Componentes reutilizables
│   ├── features/        # Módulos por funcionalidad
│   │   ├── activities/  # Gestión de actividades
│   │   ├── auth/        # Autenticación
│   │   └── dashboard/   # Dashboard principal
│   ├── hooks/           # Custom hooks
│   ├── services/        # Servicios de API
│   ├── store/           # Estado global (Redux)
│   ├── styles/          # Estilos globales
│   ├── utils/           # Utilidades
│   ├── App.jsx          # Componente principal
│   └── main.jsx         # Punto de entrada
├── index.html           # Plantilla HTML
└── vite.config.js       # Configuración de Vite
```

## Características implementadas

- **Tema oscuro**: Interfaz moderna con tema oscuro
- **Diseño responsive**: Adaptable a diferentes tamaños de pantalla
- **Gestión de estado**: Utilizando Redux Toolkit
- **Navegación**: Enrutamiento con React Router
- **Componentes estilizados**: Usando Styled Components
- **Datos de ejemplo**: Implementados para desarrollo

## Notas

- La aplicación actualmente utiliza datos de ejemplo (mock data) para simular la interacción con el backend
- Las llamadas a la API están simuladas con retrasos para emular el comportamiento real
- Para conectar con un backend real, modificar los servicios en `src/features/*/services.js`
