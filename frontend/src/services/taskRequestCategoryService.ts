import axios from 'axios';
import { API_BASE_URL } from '../config';
import { TaskRequestCategory } from '../types/TaskRequest';

const API_URL = `${API_BASE_URL}/task-request-categories`;

/**
 * Servicio para interactuar con la API de categorías de solicitudes de tareas
 */
export const taskRequestCategoryService = {
  /**
   * Obtiene todas las categorías de solicitudes de tareas
   * @returns Lista de categorías
   */
  getAllCategories: async (): Promise<TaskRequestCategory[]> => {
    const response = await axios.get(API_URL);
    return response.data;
  },

  /**
   * Obtiene una categoría de solicitud por su ID
   * @param id ID de la categoría
   * @returns La categoría
   */
  getCategoryById: async (id: number): Promise<TaskRequestCategory> => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },

  /**
   * Obtiene la categoría de solicitud por defecto
   * @returns La categoría por defecto
   */
  getDefaultCategory: async (): Promise<TaskRequestCategory> => {
    const response = await axios.get(`${API_URL}/default`);
    return response.data;
  },

  /**
   * Busca categorías de solicitud por nombre
   * @param name Parte del nombre a buscar
   * @returns Lista de categorías que coinciden con el nombre
   */
  searchCategories: async (name: string): Promise<TaskRequestCategory[]> => {
    const response = await axios.get(`${API_URL}/search?name=${encodeURIComponent(name)}`);
    return response.data;
  },

  /**
   * Crea una nueva categoría de solicitud (solo para administradores)
   * @param category Datos de la categoría a crear
   * @returns La categoría creada
   */
  createCategory: async (category: TaskRequestCategory): Promise<TaskRequestCategory> => {
    const response = await axios.post(API_URL, category);
    return response.data;
  },

  /**
   * Actualiza una categoría de solicitud existente (solo para administradores)
   * @param id ID de la categoría a actualizar
   * @param category Datos actualizados de la categoría
   * @returns La categoría actualizada
   */
  updateCategory: async (id: number, category: TaskRequestCategory): Promise<TaskRequestCategory> => {
    const response = await axios.put(`${API_URL}/${id}`, category);
    return response.data;
  },

  /**
   * Establece una categoría de solicitud como la categoría por defecto (solo para administradores)
   * @param id ID de la categoría
   * @returns La categoría actualizada
   */
  setDefaultCategory: async (id: number): Promise<TaskRequestCategory> => {
    const response = await axios.post(`${API_URL}/${id}/set-default`);
    return response.data;
  },

  /**
   * Elimina una categoría de solicitud (solo para administradores)
   * @param id ID de la categoría a eliminar
   */
  deleteCategory: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
  }
};
