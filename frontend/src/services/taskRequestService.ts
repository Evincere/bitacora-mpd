import axios from 'axios';
import { config } from '../config';
import {
  TaskRequest,
  TaskRequestPage,
  CreateTaskRequestDto,
  UpdateTaskRequestDto,
  TaskRequestCommentCreateDto,
  TaskRequestStats
} from '../types/TaskRequest';

const API_URL = `${config.apiUrl}/task-requests`;

/**
 * Servicio para interactuar con la API de solicitudes de tareas
 */
export const taskRequestService = {
  /**
   * Obtiene todas las solicitudes de tareas (solo para administradores)
   * @param page Número de página (0-indexed)
   * @param size Tamaño de la página
   * @returns Página de solicitudes de tareas
   */
  getAllTaskRequests: async (page = 0, size = 10): Promise<TaskRequestPage> => {
    const response = await axios.get(`${API_URL}?page=${page}&size=${size}`);
    return response.data;
  },

  /**
   * Obtiene las solicitudes de tareas del usuario actual
   * @param page Número de página (0-indexed)
   * @param size Tamaño de la página
   * @returns Página de solicitudes de tareas
   */
  getMyTaskRequests: async (page = 0, size = 10): Promise<TaskRequestPage> => {
    const response = await axios.get(`${API_URL}/my-requests?page=${page}&size=${size}`);
    return response.data;
  },

  /**
   * Obtiene las solicitudes de tareas asignadas al usuario actual
   * @param page Número de página (0-indexed)
   * @param size Tamaño de la página
   * @returns Página de solicitudes de tareas
   */
  getAssignedTaskRequests: async (page = 0, size = 10): Promise<TaskRequestPage> => {
    const response = await axios.get(`${API_URL}/assigned-to-me?page=${page}&size=${size}`);
    return response.data;
  },

  /**
   * Obtiene las solicitudes de tareas por estado
   * @param status Estado de las solicitudes
   * @param page Número de página (0-indexed)
   * @param size Tamaño de la página
   * @returns Página de solicitudes de tareas
   */
  getTaskRequestsByStatus: async (status: string, page = 0, size = 10): Promise<TaskRequestPage> => {
    const response = await axios.get(`${API_URL}/by-status/${status}?page=${page}&size=${size}`);
    return response.data;
  },

  /**
   * Obtiene una solicitud de tarea por su ID
   * @param id ID de la solicitud
   * @returns La solicitud de tarea
   */
  getTaskRequestById: async (id: number): Promise<TaskRequest> => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },

  /**
   * Crea una nueva solicitud de tarea
   * @param taskRequest Datos de la solicitud a crear
   * @returns La solicitud creada
   */
  createTaskRequest: async (taskRequest: CreateTaskRequestDto): Promise<TaskRequest> => {
    const response = await axios.post(API_URL, taskRequest);
    return response.data;
  },

  /**
   * Actualiza una solicitud de tarea existente
   * @param id ID de la solicitud a actualizar
   * @param taskRequest Datos actualizados de la solicitud
   * @returns La solicitud actualizada
   */
  updateTaskRequest: async (id: number, taskRequest: UpdateTaskRequestDto): Promise<TaskRequest> => {
    const response = await axios.put(`${API_URL}/${id}`, taskRequest);
    return response.data;
  },

  /**
   * Envía una solicitud de tarea (cambia su estado de DRAFT a SUBMITTED)
   * @param id ID de la solicitud
   * @returns La solicitud actualizada
   */
  submitTaskRequest: async (id: number): Promise<TaskRequest> => {
    const response = await axios.post(`${API_URL}/${id}/submit`);
    return response.data;
  },

  /**
   * Asigna una solicitud de tarea (cambia su estado de SUBMITTED a ASSIGNED)
   * @param id ID de la solicitud
   * @returns La solicitud actualizada
   */
  assignTaskRequest: async (id: number): Promise<TaskRequest> => {
    const response = await axios.post(`${API_URL}/${id}/assign`);
    return response.data;
  },

  /**
   * Completa una solicitud de tarea (cambia su estado de ASSIGNED a COMPLETED)
   * @param id ID de la solicitud
   * @returns La solicitud actualizada
   */
  completeTaskRequest: async (id: number): Promise<TaskRequest> => {
    const response = await axios.post(`${API_URL}/${id}/complete`);
    return response.data;
  },

  /**
   * Cancela una solicitud de tarea (cambia su estado a CANCELLED)
   * @param id ID de la solicitud
   * @returns La solicitud actualizada
   */
  cancelTaskRequest: async (id: number): Promise<TaskRequest> => {
    const response = await axios.post(`${API_URL}/${id}/cancel`);
    return response.data;
  },

  /**
   * Añade un comentario a una solicitud de tarea
   * @param comment Datos del comentario a añadir
   * @returns La solicitud actualizada
   */
  addComment: async (comment: TaskRequestCommentCreateDto): Promise<TaskRequest> => {
    const response = await axios.post(`${API_URL}/comments`, comment);
    return response.data;
  },

  /**
   * Elimina una solicitud de tarea (solo para administradores)
   * @param id ID de la solicitud a eliminar
   */
  deleteTaskRequest: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
  },

  /**
   * Obtiene estadísticas de solicitudes por estado
   * @returns Mapa con el número de solicitudes por estado
   */
  getStatsByStatus: async (): Promise<TaskRequestStats> => {
    const response = await axios.get(`${API_URL}/stats/by-status`);
    return response.data;
  },

  /**
   * Obtiene las solicitudes de tareas donde el usuario actual es el ejecutor
   * @param page Número de página (0-indexed)
   * @param size Tamaño de la página
   * @returns Página de solicitudes de tareas
   */
  getTasksAssignedToExecutor: async (page = 0, size = 10): Promise<TaskRequestPage> => {
    try {
      // Convertir los parámetros a números para asegurar que se envíen correctamente
      const pageNum = Number(page);
      const sizeNum = Number(size);

      // Usar URLSearchParams para construir la URL correctamente
      const params = new URLSearchParams();
      params.append('page', pageNum.toString());
      params.append('size', sizeNum.toString());

      const url = `${API_URL}/assigned-to-executor?${params.toString()}`;

      // Obtener el token de autenticación
      const token = localStorage.getItem('bitacora_token');

      // Configurar los headers con el token
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      const response = await axios.get(url, config);

      // Verificar la estructura de la respuesta
      if (response.data && Array.isArray(response.data.taskRequests)) {
        return response.data;
      } else if (response.data && typeof response.data === 'object') {
        // Intentar adaptar la respuesta si es posible
        let adaptedResponse: TaskRequestPage = {
          taskRequests: [],
          totalItems: 0,
          totalPages: 0,
          currentPage: 0
        };

        // Si la respuesta es un array, asumimos que son las tareas
        if (Array.isArray(response.data)) {
          adaptedResponse.taskRequests = response.data;
          adaptedResponse.totalItems = response.data.length;
          adaptedResponse.totalPages = 1;
        }
        // Si la respuesta tiene una propiedad content que es un array, asumimos que es una página
        else if (response.data.content && Array.isArray(response.data.content)) {
          adaptedResponse.taskRequests = response.data.content;
          adaptedResponse.totalItems = response.data.totalElements || response.data.content.length;
          adaptedResponse.totalPages = response.data.totalPages || 1;
          adaptedResponse.currentPage = response.data.number || 0;
        }

        return adaptedResponse;
      } else {
        // Devolver un objeto vacío con la estructura esperada
        return {
          taskRequests: [],
          totalItems: 0,
          totalPages: 0,
          currentPage: 0
        };
      }
    } catch (error) {
      // Devolver un objeto vacío con la estructura esperada para evitar errores
      return {
        taskRequests: [],
        totalItems: 0,
        totalPages: 0,
        currentPage: 0
      };
    }
  }
};
