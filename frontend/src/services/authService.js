import api, { apiRequest } from "../utils/api";

/**
 * Servicio para gestionar la autenticación
 */
const authService = {
  /**
   * Inicia sesión con nombre de usuario y contraseña
   * @param {Object} credentials - Credenciales de usuario
   * @param {string} credentials.username - Nombre de usuario
   * @param {string} credentials.password - Contraseña
   * @returns {Promise<Object>} - Datos del usuario y token
   */
  login: async (credentials) => {
    try {
      const response = await apiRequest({
        method: "POST",
        url: "/api/auth/login",
        data: credentials,
      });

      // Guardar token, refresh token y datos de usuario en localStorage
      if (response.token) {
        localStorage.setItem("bitacora_token", response.token);
        localStorage.setItem("bitacora_refresh_token", response.refreshToken);

        // Crear objeto de usuario con los datos relevantes
        const user = {
          id: response.userId,
          username: response.username,
          email: response.email,
          fullName: response.fullName,
          role: response.role,
          permissions: response.permissions,
        };
        localStorage.setItem("bitacora_user", JSON.stringify(user));

        // Calcular y guardar la fecha de expiración del token (24 horas)
        const expirationDate = new Date();
        expirationDate.setTime(expirationDate.getTime() + 24 * 60 * 60 * 1000);
        localStorage.setItem(
          "bitacora_token_expiration",
          expirationDate.toISOString()
        );
      }

      return response;
    } catch (error) {
      console.error("Error en login:", error);
      throw error;
    }
  },

  /**
   * Cierra la sesión del usuario
   * @returns {Promise<Object>} - Respuesta del servidor
   */
  logout: async () => {
    try {
      const token = localStorage.getItem("bitacora_token");

      // Limpiar datos de sesión del localStorage primero para garantizar el cierre de sesión local
      localStorage.removeItem("bitacora_token");
      localStorage.removeItem("bitacora_refresh_token");
      localStorage.removeItem("bitacora_user");
      localStorage.removeItem("bitacora_token_expiration");

      if (token) {
        try {
          // Intentar enviar solicitud al backend para invalidar el token
          // Usamos un timeout corto para no bloquear el cierre de sesión local
          await apiRequest({
            method: "POST",
            url: "/api/auth/logout",
            data: { token },
            timeout: 3000, // 3 segundos de timeout
          });
          console.log("Token invalidado en el servidor");
        } catch (serverError) {
          // Si hay error al comunicarse con el servidor, solo lo registramos
          // pero no interrumpimos el proceso de cierre de sesión
          console.warn(
            "No se pudo invalidar el token en el servidor:",
            serverError
          );
        }
      }

      return { success: true, message: "Sesión cerrada correctamente" };
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      // Garantizar que los datos locales se limpien incluso si hay errores
      localStorage.removeItem("bitacora_token");
      localStorage.removeItem("bitacora_refresh_token");
      localStorage.removeItem("bitacora_user");
      localStorage.removeItem("bitacora_token_expiration");

      return { success: true, message: "Sesión cerrada localmente" };
    }
  },

  /**
   * Verifica si el usuario está autenticado
   * @returns {boolean} - true si el usuario está autenticado
   */
  isAuthenticated: () => {
    const token = localStorage.getItem("bitacora_token");
    const expirationDate = localStorage.getItem("bitacora_token_expiration");

    if (!token || !expirationDate) {
      return false;
    }

    // Verificar si el token ha expirado
    return new Date(expirationDate) > new Date();
  },

  /**
   * Obtiene los datos del usuario actual
   * @returns {Object|null} - Datos del usuario o null si no hay usuario autenticado
   */
  getCurrentUser: () => {
    const userJson = localStorage.getItem("bitacora_user");
    return userJson ? JSON.parse(userJson) : null;
  },

  /**
   * Refresca el token de acceso usando el token de refresco
   * @returns {Promise<Object>} - Nuevo token de acceso
   */
  refreshToken: async () => {
    try {
      const refreshToken = localStorage.getItem("bitacora_refresh_token");

      if (!refreshToken) {
        throw new Error("No hay token de refresco disponible");
      }

      const response = await apiRequest({
        method: "POST",
        url: "/api/auth/refresh",
        data: { refreshToken },
      });

      if (response.accessToken) {
        // Actualizar el token en localStorage
        localStorage.setItem("bitacora_token", response.accessToken);

        // Actualizar la fecha de expiración
        const expiresInMs = response.expiresIn * 1000;
        const expirationDate = new Date(Date.now() + expiresInMs);
        localStorage.setItem(
          "bitacora_token_expiration",
          expirationDate.toISOString()
        );

        console.log("Token refrescado correctamente");
        return response;
      } else {
        throw new Error("No se recibió un nuevo token de acceso");
      }
    } catch (error) {
      console.error("Error al refrescar el token:", error);

      // Si hay un error al refrescar el token, limpiar la sesión
      if (error.status === 401 || error.status === 403) {
        localStorage.removeItem("bitacora_token");
        localStorage.removeItem("bitacora_refresh_token");
        localStorage.removeItem("bitacora_user");
        localStorage.removeItem("bitacora_token_expiration");
      }

      throw error;
    }
  },
};

export default authService;
