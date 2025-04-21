import axios from "axios";
import config from "../config";

// Crear instancia de axios con configuración base
const api = axios.create({
  // No usamos baseURL para que Vite maneje el proxy correctamente
  headers: {
    "Content-Type": "application/json",
  },
  // Añadir timeout para evitar esperas largas
  timeout: 10000,
  // Configuración para CORS
  withCredentials: true,
});

// Interceptor para agregar token de autenticación
api.interceptors.request.use(
  (reqConfig) => {
    const token = localStorage.getItem("bitacora_token");
    if (token) {
      reqConfig.headers.Authorization = `Bearer ${token}`;
    }
    return reqConfig;
  },
  (error) => Promise.reject(error)
);

// Variable para controlar si estamos en proceso de refrescar el token
let isRefreshing = false;
// Cola de solicitudes pendientes que esperan el token refrescado
let failedQueue = [];

// Función para procesar la cola de solicitudes pendientes
const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Interceptor para manejar errores y refrescar tokens
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si el error es 401 (Unauthorized) y no es una solicitud de refresco de token
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/login") &&
      !originalRequest.url.includes("/auth/refresh")
    ) {
      // Si ya estamos refrescando el token, agregar esta solicitud a la cola
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Importar dinámicamente el servicio de autenticación para evitar dependencias circulares
        const authServiceModule = await import("../services/authService");
        const authService = authServiceModule.default;

        // Intentar refrescar el token
        const response = await authService.refreshToken();
        const newToken = response.accessToken;

        if (newToken) {
          // Actualizar el token en la solicitud original
          originalRequest.headers["Authorization"] = `Bearer ${newToken}`;

          // Procesar la cola de solicitudes pendientes
          processQueue(null, newToken);

          // Reintentar la solicitud original
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Procesar la cola con error
        processQueue(refreshError, null);

        // Limpiar localStorage y redirigir a login
        localStorage.removeItem("bitacora_token");
        localStorage.removeItem("bitacora_refresh_token");
        localStorage.removeItem("bitacora_user");
        localStorage.removeItem("bitacora_token_expiration");

        // Redirigir solo si no estamos ya en la página de login
        if (!window.location.pathname.includes("/login")) {
          window.location.href = "/login";
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Para otros errores, simplemente rechazar la promesa
    return Promise.reject(error);
  }
);

// Función genérica para realizar peticiones
export const apiRequest = async (reqConfig) => {
  try {
    // Configurar timeout por defecto si no se especifica
    const timeout = reqConfig.timeout || 10000;

    console.log(`Enviando solicitud ${reqConfig.method} a: ${reqConfig.url}`);
    if (reqConfig.data) console.log("Datos:", reqConfig.data);

    // Asegurarse de que la configuración incluya withCredentials para CORS
    const config = {
      ...reqConfig,
      withCredentials: true,
      timeout,
      headers: {
        ...reqConfig.headers,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };

    // Usar la instancia de api que tiene configurado el interceptor para el token JWT
    const response = await api(config);
    console.log("Respuesta recibida:", response.data);
    return response.data;
  } catch (error) {
    // Determinar el tipo de error
    const isNetworkError =
      !error.response && error.message?.includes("Network Error");
    const isTimeoutError =
      error.code === "ECONNABORTED" || error.message?.includes("timeout");
    const isServerError = error.response?.status >= 500;
    const isNotFoundError = error.response?.status === 404;

    // Registrar el error con detalles
    console.error("Error en petición API:", error);
    console.error("URL:", reqConfig.url);
    console.error("Método:", reqConfig.method);
    if (reqConfig.data) console.error("Datos:", reqConfig.data);
    if (error.response?.data) console.error("Respuesta:", error.response.data);

    // Personalizar mensaje según el tipo de error
    let errorMessage =
      error.response?.data?.message || error.message || "Error en la petición";

    if (isNetworkError) {
      errorMessage =
        "No se pudo conectar con el servidor. Verifica tu conexión a internet.";
    } else if (isTimeoutError) {
      errorMessage =
        "La solicitud ha excedido el tiempo de espera. Por favor, intenta nuevamente.";
    } else if (isServerError) {
      errorMessage =
        "Error interno del servidor. Por favor, intenta nuevamente más tarde.";
    } else if (isNotFoundError) {
      errorMessage = "El recurso solicitado no existe en el servidor.";
    }

    throw {
      status: error.response?.status || 500,
      error:
        error.response?.data?.error ||
        (isNetworkError
          ? "Error de red"
          : isTimeoutError
          ? "Timeout"
          : "Error desconocido"),
      message: errorMessage,
      path: error.response?.data?.path || reqConfig.url || "",
      details: error.response?.data?.details || [],
      isNetworkError,
      isTimeoutError,
      isServerError,
      isNotFoundError,
    };
  }
};

export default api;
