// Configuración de la aplicación
export const config = {
  // URL base de la API
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',

  // URL para WebSockets
  websocketUrl: import.meta.env.VITE_WEBSOCKET_URL || 'ws://localhost:8080',

  // Tiempo de inactividad por defecto (30 minutos)
  defaultInactivityTimeout: 30 * 60 * 1000,

  // Tiempo de expiración del token (1 hora)
  tokenExpirationTime: 60 * 60 * 1000,

  // Tema por defecto
  defaultTheme: 'dark',

  // Versión de la aplicación
  version: '1.0.0',

  // Entorno de ejecución
  environment: import.meta.env.MODE || 'development',

  // Configuración de paginación
  pagination: {
    defaultPageSize: 10,
    pageSizeOptions: [5, 10, 20, 50, 100],
  },

  // Configuración de notificaciones
  notifications: {
    maxNotifications: 50,
    defaultDuration: 5000,
  },
};

export default config;
