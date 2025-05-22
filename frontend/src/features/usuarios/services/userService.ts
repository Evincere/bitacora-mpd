import apiClient from '@/core/api/apiClient';
import { User, UserRole } from '@/core/types/models';
import tokenService from '@/core/utils/tokenService';
import tokenDebugger from '@/utils/tokenDebugger';

export interface UserCreateDto {
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  position?: string;
  department?: string;
  permissions?: string[];
}

export interface UserUpdateDto {
  password?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  position?: string;
  department?: string;
  active?: boolean;
  permissions?: string[];
}

export interface UserListResponse {
  users: User[];
  currentPage: number;
  totalItems: number;
  totalPages: number;
}

/**
 * Servicio para la gestión de usuarios
 */
const userService = {
  /**
   * Obtiene una lista paginada de usuarios
   * @param page Número de página (comenzando desde 0)
   * @param size Tamaño de la página
   * @param role Filtrar por rol (opcional)
   * @param active Filtrar por estado (opcional)
   * @param search Buscar por nombre, apellido o email (opcional)
   * @returns Lista paginada de usuarios
   */
  async getUsers(
    page: number = 0,
    size: number = 10,
    role?: string,
    active?: boolean,
    search?: string
  ): Promise<UserListResponse> {
    try {
      let url = `users?page=${page}&size=${size}`;

      if (role) {
        url += `&role=${encodeURIComponent(role)}`;
      }

      if (active !== undefined) {
        url += `&active=${active}`;
      }

      if (search) {
        url += `&search=${encodeURIComponent(search)}`;
      }

      // Obtener el token de autenticación usando el servicio de tokens
      const token = tokenService.getToken();
      console.log('Realizando petición a:', url);
      console.log('Token actual:', token ? token.substring(0, 20) + '...' : 'null');

      // Depurar el token para verificar permisos
      if (token) {
        console.log('Depurando token antes de la petición:');
        tokenDebugger.debugToken(token);
      } else {
        console.warn('No hay token disponible para la petición');
      }

      // Usar fetch directo con más control sobre los headers
      console.log('Intentando con fetch directo con headers explícitos');

      // Construir la URL completa
      const baseUrl = import.meta.env.VITE_API_URL || '/api';
      const fullUrl = `${baseUrl}/${url}`;
      console.log('URL completa:', fullUrl);

      // Construir headers con el token
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (token) {
        // Asegurarse de que el token no tenga espacios adicionales o caracteres extraños
        const cleanToken = token.trim();
        console.log('Token limpio:', cleanToken.substring(0, 20) + '...');
        headers['Authorization'] = `Bearer ${cleanToken}`;

        // Añadir header de permisos explícito para depuración
        headers['X-User-Permissions'] = 'READ_USERS';
      }

      console.log('Headers completos:', headers);

      // Realizar la petición
      const response = await fetch(fullUrl, {
        method: 'GET',
        headers,
        credentials: 'include'
      });

      console.log('Respuesta recibida:', response.status, response.statusText);

      // Intentar leer el cuerpo de la respuesta incluso si hay error
      let responseBody;
      try {
        const textResponse = await response.text();
        console.log('Cuerpo de la respuesta:', textResponse);
        responseBody = textResponse ? JSON.parse(textResponse) : null;
      } catch (parseError) {
        console.error('Error al parsear la respuesta:', parseError);
      }

      if (!response.ok) {
        throw new Error(`Error en petición: ${response.status} ${response.statusText}`);
      }

      return responseBody as UserListResponse;
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      throw error;
    }
  },

  /**
   * Obtiene un usuario por su ID
   * @param id ID del usuario
   * @returns Datos del usuario
   */
  async getUserById(id: number): Promise<User> {
    try {
      const response = await apiClient.get<User>(`users/${id}`);
      return response;
    } catch (error) {
      console.error(`Error al obtener usuario con ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Obtiene usuarios por rol
   * @param role Rol de los usuarios
   * @param page Número de página (comenzando desde 0)
   * @param size Tamaño de la página
   * @returns Lista de usuarios con el rol especificado
   */
  async getUsersByRole(role: UserRole, page: number = 0, size: number = 100): Promise<User[]> {
    try {
      const response = await apiClient.get<User[]>(`users/by-role/${role}?page=${page}&size=${size}`);
      return response;
    } catch (error) {
      console.error(`Error al obtener usuarios con rol ${role}:`, error);
      throw error;
    }
  },

  /**
   * Crea un nuevo usuario
   * @param userData Datos del usuario a crear
   * @returns Usuario creado
   */
  async createUser(userData: UserCreateDto): Promise<User> {
    try {
      const response = await apiClient.post<User>('users', userData);
      return response;
    } catch (error) {
      console.error('Error al crear usuario:', error);
      throw error;
    }
  },

  /**
   * Actualiza un usuario existente
   * @param id ID del usuario a actualizar
   * @param userData Datos del usuario a actualizar
   * @returns Usuario actualizado
   */
  async updateUser(id: number, userData: UserUpdateDto): Promise<User> {
    try {
      const response = await apiClient.put<User>(`users/${id}`, userData);
      return response;
    } catch (error) {
      console.error(`Error al actualizar usuario con ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Elimina un usuario
   * @param id ID del usuario a eliminar
   */
  async deleteUser(id: number): Promise<void> {
    try {
      await apiClient.delete(`users/${id}`);
    } catch (error) {
      console.error(`Error al eliminar usuario con ID ${id}:`, error);
      throw error;
    }
  }
};

export default userService;
