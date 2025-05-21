import apiClient from '@/core/api/apiClient';
import { User, UserRole } from '@/core/types/models';

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

      console.log('Realizando petición a:', url);
      console.log('Token actual:', localStorage.getItem('bitacora_token'));

      const response = await apiClient.get<UserListResponse>(url);
      return response;
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
