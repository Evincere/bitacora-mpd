import api, { apiRequest } from "../../utils/api";

// Usamos la URL completa del backend
// Utilizamos la ruta /api/auth para que coincida con la configuración del backend
const API_URL = "/api/auth";

// Login
const login = async (userData) => {
  try {
    console.log("Enviando solicitud a:", `${API_URL}/login`);
    console.log("Datos:", userData);

    const response = await apiRequest({
      method: "POST",
      url: `${API_URL}/login`,
      data: userData,
    });
    console.log("Respuesta recibida:", response);

    if (response) {
      // Guardar token y datos de usuario
      localStorage.setItem("bitacora_token", response.token);
      localStorage.setItem("bitacora_user", JSON.stringify(response));

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
    console.error("Detalles del error:", error.response?.data || error.message);
    throw error;
  }
};

// Logout
const logout = () => {
  localStorage.removeItem("bitacora_token");
  localStorage.removeItem("bitacora_user");
  localStorage.removeItem("bitacora_token_expiration");
};

const authService = {
  login,
  logout,
};

export default authService;
