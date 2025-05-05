import api from '@/utils/api-ky';

export interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  email: string;
}

/**
 * Servicio para buscar usuarios para menciones
 */
const userSearchService = {
  /**
   * Busca usuarios por nombre o username
   * @param query Texto para buscar
   * @param limit Límite de resultados a devolver
   * @param taskRequestId ID de la solicitud (opcional)
   * @returns Lista de usuarios que coinciden con la búsqueda
   */
  async searchUsers(query: string, limit: number = 5, taskRequestId?: number): Promise<User[]> {
    try {
      let url = `users/search?query=${encodeURIComponent(query)}&limit=${limit}`;

      // Añadir el ID de la solicitud si se proporciona
      if (taskRequestId) {
        url += `&taskRequestId=${taskRequestId}`;
      }

      const response = await api.get(url).json<User[]>();

      // Mapear la respuesta para asegurar que tenga el formato correcto
      return response.map(user => ({
        ...user,
        fullName: user.fullName || `${user.firstName} ${user.lastName}`.trim()
      }));
    } catch (error) {
      console.error('Error al buscar usuarios:', error);

      // En caso de error, devolver una lista vacía
      return [];
    }
  }
};

export default userSearchService;
