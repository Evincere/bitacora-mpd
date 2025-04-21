# Frontend de Bitácora

> **Nota**: La documentación completa del proyecto se encuentra en el [README principal](../README.md).

Este directorio contiene el código fuente del frontend de la aplicación Bitácora, desarrollado con React y TypeScript.

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
│   ├── App.tsx          # Componente principal
│   └── main.tsx         # Punto de entrada
├── index.html           # Plantilla HTML
└── vite.config.js       # Configuración de Vite
```

## Comandos principales

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Construir para producción
npm run build
```

Para más detalles sobre la arquitectura, características y uso del frontend, consulte el [README principal](../README.md).
