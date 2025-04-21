import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout as logoutAction } from "../features/auth/authSlice";
import authService from "../services/authService";

/**
 * Hook personalizado para manejar la autenticación
 * @returns {Object} Funciones relacionadas con la autenticación
 */
export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  /**
   * Cierra la sesión del usuario
   */
  const logout = async () => {
    try {
      // Actualizar el estado de Redux primero para una respuesta inmediata en la UI
      dispatch(logoutAction());

      // Llamar al servicio de autenticación para cerrar sesión
      // Esto ya maneja los errores internamente y garantiza el cierre de sesión local
      const result = await authService.logout();
      console.log(result.message);

      // Redirigir al usuario a la página de inicio de sesión
      navigate("/login");
    } catch (error) {
      console.error("Error inesperado al cerrar sesión:", error);

      // Garantizar que se redirija al login incluso si hay errores
      navigate("/login");
    }
  };

  return {
    logout,
  };
};
