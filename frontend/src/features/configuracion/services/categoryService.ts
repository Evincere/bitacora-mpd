import api from '@/utils/api-ky';

export interface TaskCategory {
  id: number;
  name: string;
  description: string;
  color: string;
  isDefault: boolean;
  createdAt?: string;
}

export interface CreateCategoryDto {
  name: string;
  description: string;
  color: string;
}

export interface UpdateCategoryDto {
  name?: string;
  description?: string;
  color?: string;
}

/**
 * Servicio para la gestión de categorías de tareas
 */
const categoryService = {
  /**
   * Obtiene todas las categorías de tareas
   * @returns Lista de categorías
   */
  async getAllCategories(): Promise<TaskCategory[]> {
    try {
      const response = await api.get('task-request-categories').json();
      return response as TaskCategory[];
    } catch (error) {
      console.error('Error al obtener categorías:', error);
      throw new Error('Error al obtener las categorías');
    }
  },

  /**
   * Obtiene una categoría por su ID
   * @param id ID de la categoría
   * @returns Datos de la categoría
   */
  async getCategoryById(id: number): Promise<TaskCategory> {
    try {
      const response = await api.get(`task-request-categories/${id}`).json();
      return response as TaskCategory;
    } catch (error) {
      console.error(`Error al obtener categoría con ID ${id}:`, error);
      throw new Error('Error al obtener la categoría');
    }
  },

  /**
   * Busca categorías por nombre
   * @param name Nombre a buscar
   * @returns Lista de categorías que coinciden con el nombre
   */
  async searchCategories(name: string): Promise<TaskCategory[]> {
    try {
      const response = await api.get(`task-request-categories/search?name=${encodeURIComponent(name)}`).json();
      return response as TaskCategory[];
    } catch (error) {
      console.error(`Error al buscar categorías con nombre ${name}:`, error);
      throw new Error('Error al buscar categorías');
    }
  },

  /**
   * Crea una nueva categoría
   * @param categoryData Datos de la categoría a crear
   * @returns Categoría creada
   */
  async createCategory(categoryData: CreateCategoryDto): Promise<TaskCategory> {
    try {
      const response = await api.post('task-request-categories', {
        json: categoryData
      }).json();
      return response as TaskCategory;
    } catch (error) {
      console.error('Error al crear categoría:', error);
      throw new Error('Error al crear la categoría');
    }
  },

  /**
   * Actualiza una categoría existente
   * @param id ID de la categoría a actualizar
   * @param categoryData Datos de la categoría a actualizar
   * @returns Categoría actualizada
   */
  async updateCategory(id: number, categoryData: UpdateCategoryDto): Promise<TaskCategory> {
    try {
      const response = await api.put(`task-request-categories/${id}`, {
        json: categoryData
      }).json();
      return response as TaskCategory;
    } catch (error) {
      console.error(`Error al actualizar categoría con ID ${id}:`, error);
      throw new Error('Error al actualizar la categoría');
    }
  },

  /**
   * Elimina una categoría
   * @param id ID de la categoría a eliminar
   */
  async deleteCategory(id: number): Promise<void> {
    try {
      await api.delete(`task-request-categories/${id}`);
    } catch (error) {
      console.error(`Error al eliminar categoría con ID ${id}:`, error);
      throw new Error('Error al eliminar la categoría');
    }
  }
};

export default categoryService;
