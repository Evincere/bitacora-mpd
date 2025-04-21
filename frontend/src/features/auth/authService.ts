import { AuthResponse, LoginCredentials } from '@/types/api';
import { apiRequest } from '@/utils/api';

// Obtener la URL base de la API desde las variables de entorno
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
// Asegurarse de que la ruta sea correcta
const API_URL = `${API_BASE_URL}/auth`;

console.log('API_BASE_URL:', API_BASE_URL);
console.log('API_URL:', API_URL);

/**
 * Inicia sesión con las credenciales proporcionadas
 * @param credentials Credenciales de inicio de sesión
 * @returns Datos del usuario autenticado
 */
const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  console.log('Intentando iniciar sesión con:', credentials);
  console.log('URL de login:', `${API_URL}/login`);

  try {
    const response = await apiRequest<AuthResponse>({
      url: `${API_URL}/login`,
      method: 'POST',
      data: credentials,
    });

    console.log('Respuesta de login:', response);

    if (response) {
      localStorage.setItem('user', JSON.stringify(response));
    }

    return response;
  } catch (error) {
    console.error('Error en login:', error);
    throw error;
  }
};

/**
 * Cierra la sesión del usuario actual
 */
const logout = (): void => {
  localStorage.removeItem('user');
};

const authService = {
  login,
  logout,
};

export default authService;
