import { AuthResponse, LoginCredentials } from '@/types/api';

// Obtener la URL base de la API desde las variables de entorno
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
// Asegurarse de que la ruta sea correcta
const API_URL = `${API_BASE_URL}/auth`;

// URL completa del backend para uso directo
const BACKEND_URL = 'http://localhost:8080';

console.log('API_BASE_URL:', API_BASE_URL);
console.log('API_URL:', API_URL);
console.log('BACKEND_URL:', BACKEND_URL);

/**
 * Inicia sesión con las credenciales proporcionadas
 * @param credentials Credenciales de inicio de sesión
 * @returns Datos del usuario autenticado
 */
const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  console.log('Intentando iniciar sesión con:', credentials);
  console.log('URL de login:', '/api/auth/login');

  try {
    // Usar una URL relativa para que sea manejada por el proxy de Vite
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    }).then(res => {
      if (!res.ok) {
        throw new Error(`Error en login: ${res.status} ${res.statusText}`);
      }
      return res.json();
    });

    console.log('Respuesta de login:', response);

    if (response) {
      // Guardar datos de autenticación en localStorage
      localStorage.setItem('bitacora_token', response.token);

      // Si hay refreshToken en la respuesta, guardarlo
      if (response.refreshToken) {
        localStorage.setItem('bitacora_refresh_token', response.refreshToken);
      }

      // Guardar datos del usuario
      const userData = {
        id: response.userId,
        username: response.username,
        name: response.fullName,
        email: response.email,
        role: response.role, // Guardar el rol como un valor único
        permissions: response.permissions || [] // Guardar los permisos
      };

      // Depuración
      console.log('authService: Datos del usuario a guardar en localStorage:', userData);

      localStorage.setItem('bitacora_user', JSON.stringify(userData));

      // Verificar que los datos se hayan guardado correctamente
      const savedToken = localStorage.getItem('bitacora_token');
      const savedUser = localStorage.getItem('bitacora_user');

      console.log('Datos guardados en localStorage:');
      console.log('- Token guardado:', !!savedToken);
      console.log('- Usuario guardado:', !!savedUser);

      // Si no se guardaron los datos correctamente, lanzar un error
      if (!savedToken || !savedUser) {
        throw new Error('No se pudieron guardar los datos de autenticación');
      }
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
  // Eliminar todos los datos de autenticación
  localStorage.removeItem('bitacora_token');
  // localStorage.removeItem('bitacora_refresh_token');
  localStorage.removeItem('bitacora_user');
};

const authService = {
  login,
  logout,
};

export default authService;
