/**
 * Configuración global de la aplicación
 */
const config = {
  // URL base de la API
  apiUrl:
    (typeof process !== "undefined" &&
      process.env &&
      process.env.REACT_APP_API_URL) ||
    "http://localhost:8080",

  // Configuración de autenticación
  auth: {
    tokenKey: "bitacora_token",
    userKey: "bitacora_user",
    expirationKey: "bitacora_token_expiration",
    expirationTime: 24 * 60 * 60 * 1000, // 24 horas en milisegundos
  },

  // Configuración de paginación
  pagination: {
    defaultPageSize: 10,
    pageSizeOptions: [5, 10, 20, 50, 100],
  },

  // Configuración de notificaciones
  notifications: {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  },

  // Configuración de fechas
  dateFormat: "DD/MM/YYYY",
  dateTimeFormat: "DD/MM/YYYY HH:mm",

  // Configuración de temas
  theme: {
    primary: "#1976d2",
    secondary: "#dc004e",
    error: "#f44336",
    warning: "#ff9800",
    info: "#2196f3",
    success: "#4caf50",
  },
};

export default config;
