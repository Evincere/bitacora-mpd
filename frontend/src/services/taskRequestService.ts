import axios from 'axios';
import { API_BASE_URL } from '../config';
import {
  TaskRequest,
  TaskRequestPage,
  CreateTaskRequestDto,
  UpdateTaskRequestDto,
  TaskRequestCommentCreateDto,
  TaskRequestStats
} from '../types/TaskRequest';

const API_URL = `${API_BASE_URL}/task-requests`;

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
  }
};
