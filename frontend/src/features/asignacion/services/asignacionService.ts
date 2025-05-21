import { api } from '@/core/api/api';
import { Activity, User } from '@/types/models';
import solicitudesService, { TaskRequest, TaskRequestPageDto } from '@/features/solicitudes/services/solicitudesService';

export interface AsignacionRequest {
  taskRequestId: number;
  executorId: number;
  notes?: string;
}

export interface RechazoRequest {
  reason: string;
  notes?: string;
}

export interface AsignacionResponse {
  id: number;
  status: string;
  executorId: number;
  executorName: string;
  assignerId: number;
  assignerName: string;
  assignmentDate: string;
  dueDate?: string;
  notes?: string;
}

export interface Ejecutor {
  id: number;
  username: string;
  fullName: string;
  email: string;
  role: string;
  department?: string;
  cargaActual?: number;
  especialidad?: string;
}

export interface TareaAsignada {
  id: number;
  titulo: string;
  prioridad: string;
  fechaLimite?: string;
  estado: string;
  descripcion?: string;
  categoria?: string;
}

export interface EjecutorConTareas {
  id: number;
  nombre: string;
  username: string;
  email: string;
  cargaActual: number;
  especialidad: string;
  tareas: TareaAsignada[];
}

/**
 * Servicio para gestionar las asignaciones
 */
const asignacionService = {
  /**
   * Obtiene las solicitudes pendientes de asignación (estado SUBMITTED)
   * @param page Número de página
   * @param size Tamaño de página
   * @returns Lista paginada de solicitudes pendientes
   */
  async getPendingRequests(page = 0, size = 10): Promise<TaskRequestPageDto> {
    try {
      console.log('Solicitando solicitudes pendientes a la API...');
      const response = await api.get(`task-requests/by-status/SUBMITTED?page=${page}&size=${size}`).json();
      console.log('Respuesta de solicitudes pendientes:', response);

      // Asegurarse de que cada solicitud tenga un nombre de solicitante
      if (response && response.taskRequests) {
        response.taskRequests = response.taskRequests.map(task => {
          if (!task.requesterName || task.requesterName === 'Desconocido') {
            // Si no hay nombre de solicitante, intentar construirlo a partir del ID
            if (task.requesterId) {
              return {
                ...task,
                requesterName: `Usuario #${task.requesterId}`
              };
            }
          }
          return task;
        });
      }

      return response;
    } catch (error) {
      console.error('Error al obtener solicitudes pendientes:', error);
      // Devolver un objeto vacío en caso de error
      return {
        taskRequests: [],
        totalItems: 0,
        totalPages: 0,
        currentPage: 0
      };
    }
  },

  /**
   * Obtiene las tareas asignadas agrupadas por ejecutor
   * @returns Lista de ejecutores con sus tareas asignadas
   */
  async getAssignedTasksByExecutor(): Promise<EjecutorConTareas[]> {
    try {
      console.log('Obteniendo tareas asignadas por ejecutor...');

      // Obtener todos los ejecutores - Usamos una función independiente para evitar problemas con 'this'
      let ejecutores: Ejecutor[] = [];
      try {
        // Intentar obtener usuarios con rol EJECUTOR
        const response = await api.get('users/by-role/EJECUTOR').json<User[]>();
        console.log('Respuesta de ejecutores disponibles:', response);

        // Mapear a nuestro formato de Ejecutor
        ejecutores = response.map(user => ({
          id: user.id,
          username: user.username,
          fullName: user.fullName || `${user.firstName} ${user.lastName}`,
          email: user.email,
          role: user.role,
          department: user.department,
          cargaActual: 0, // Se calculará con datos reales
          especialidad: user.department || 'GENERAL' // Usar el departamento como especialidad
        }));
      } catch (apiError) {
        console.warn('Error al obtener ejecutores por rol, intentando obtener todos los usuarios:', apiError);

        try {
          // Si falla, intentar obtener todos los usuarios y filtrar por rol
          const allUsers = await api.get('users').json<{ users: User[], totalCount: number }>();
          console.log('Respuesta de todos los usuarios:', allUsers);

          // Filtrar usuarios con rol EJECUTOR
          const ejecutoresFiltered = allUsers.users.filter(user => user.role === 'EJECUTOR');

          // Mapear a nuestro formato de Ejecutor
          ejecutores = ejecutoresFiltered.map(user => ({
            id: user.id,
            username: user.username,
            fullName: user.fullName || `${user.firstName} ${user.lastName}`,
            email: user.email,
            role: user.role,
            department: user.department,
            cargaActual: 0, // Se calculará con datos reales
            especialidad: user.department || 'GENERAL' // Usar el departamento como especialidad
          }));
        } catch (allUsersError) {
          console.error('Error al obtener todos los usuarios:', allUsersError);

          // Si ambos métodos fallan, devolver un array vacío
          ejecutores = [];
        }
      }

      // Obtener todas las solicitudes con estado ASSIGNED
      let assignedTasksResponse: TaskRequestPageDto = { taskRequests: [], totalItems: 0, totalPages: 0, currentPage: 0 };
      try {
        assignedTasksResponse = await api.get('task-requests/by-status/ASSIGNED?size=100').json<TaskRequestPageDto>();
        console.log('Solicitudes asignadas:', assignedTasksResponse);
      } catch (tasksError) {
        console.error('Error al obtener solicitudes asignadas:', tasksError);
        // Usar un objeto vacío en caso de error
      }

      // Crear un mapa de ejecutores con sus tareas
      const ejecutoresMap = new Map<number, EjecutorConTareas>();

      // Inicializar el mapa con todos los ejecutores
      for (const ejecutor of ejecutores) {
        ejecutoresMap.set(ejecutor.id, {
          id: ejecutor.id,
          nombre: ejecutor.fullName,
          username: ejecutor.username,
          email: ejecutor.email,
          cargaActual: 0,
          especialidad: ejecutor.especialidad || 'GENERAL',
          tareas: []
        });
      }

      // Asignar las tareas a los ejecutores correspondientes
      for (const task of assignedTasksResponse.taskRequests || []) {
        if (task.executorId && ejecutoresMap.has(task.executorId)) {
          const ejecutor = ejecutoresMap.get(task.executorId)!;

          // Añadir la tarea al ejecutor
          ejecutor.tareas.push({
            id: task.id,
            titulo: task.title,
            prioridad: task.priority || 'MEDIUM',
            fechaLimite: task.dueDate,
            estado: task.status,
            descripcion: task.description,
            categoria: task.category?.name
          });

          // Actualizar la carga actual
          ejecutor.cargaActual = ejecutor.tareas.length;
        }
      }

      // Convertir el mapa a un array
      return Array.from(ejecutoresMap.values());
    } catch (error) {
      console.error('Error al obtener tareas asignadas por ejecutor:', error);

      // Devolver datos de ejemplo en caso de error
      return [];
    }
  },

  /**
   * Obtiene las estadísticas de distribución de carga
   * @returns Estadísticas de distribución de carga
   */
  async getWorkloadDistribution(): Promise<any> {
    try {
      console.log('Obteniendo distribución de carga de trabajo...');

      // Intentar obtener datos reales de la API
      try {
        const response = await api.get('activities/stats/workload').json();
        console.log('Respuesta de distribución de carga:', response);

        if (response && Array.isArray(response) && response.length > 0) {
          return response;
        }
      } catch (apiError) {
        console.warn('Error al obtener distribución de carga desde la API:', apiError);
      }

      // Si no se pudieron obtener datos de la API, calcular a partir de las tareas asignadas
      console.log('Calculando distribución de carga a partir de tareas asignadas...');
      const ejecutoresConTareas = await this.getAssignedTasksByExecutor();

      // Mapear a formato de distribución de carga
      const workloadDistribution = ejecutoresConTareas.map(ejecutor => ({
        executorId: ejecutor.id,
        executorName: ejecutor.fullName,
        assignedTasks: ejecutor.tareas.length,
        pendingTasks: ejecutor.tareas.filter(t =>
          t.estado === 'ASSIGNED' || t.estado === 'IN_PROGRESS'
        ).length,
        completedTasks: ejecutor.tareas.filter(t =>
          t.estado === 'COMPLETED' || t.estado === 'APPROVED'
        ).length
      }));

      console.log('Distribución de carga calculada:', workloadDistribution);
      return workloadDistribution;
    } catch (error) {
      console.error('Error al obtener distribución de carga:', error);

      // En caso de error, devolver un array vacío
      return [];
    }
  },

  /**
   * Obtiene los ejecutores disponibles
   * @returns Lista de ejecutores disponibles
   */
  async getAvailableExecutors(): Promise<Ejecutor[]> {
    try {
      console.log('Solicitando ejecutores disponibles a la API...');

      // Intentar obtener usuarios con rol EJECUTOR
      try {
        const response = await api.get('users/by-role/EJECUTOR').json<User[]>();
        console.log('Respuesta de ejecutores disponibles:', response);

        // Mapear a nuestro formato de Ejecutor
        return response.map(user => ({
          id: user.id,
          username: user.username,
          fullName: user.fullName || `${user.firstName} ${user.lastName}`,
          email: user.email,
          role: user.role,
          department: user.department,
          cargaActual: 0, // Se calculará con datos reales
          especialidad: user.department || 'GENERAL' // Usar el departamento como especialidad
        }));
      } catch (apiError) {
        console.warn('Error al obtener ejecutores por rol, intentando obtener todos los usuarios:', apiError);

        // Si falla, intentar obtener todos los usuarios y filtrar por rol
        const allUsers = await api.get('users').json<{ users: User[], totalCount: number }>();
        console.log('Respuesta de todos los usuarios:', allUsers);

        // Filtrar usuarios con rol EJECUTOR
        const ejecutores = allUsers.users.filter(user => user.role === 'EJECUTOR');

        // Mapear a nuestro formato de Ejecutor
        return ejecutores.map(user => ({
          id: user.id,
          username: user.username,
          fullName: user.fullName || `${user.firstName} ${user.lastName}`,
          email: user.email,
          role: user.role,
          department: user.department,
          cargaActual: 0, // Se calculará con datos reales
          especialidad: user.department || 'GENERAL' // Usar el departamento como especialidad
        }));
      }
    } catch (error) {
      console.error('Error al obtener ejecutores disponibles:', error);
      // Devolver un array vacío en caso de error
      return [];
    }
  },

  /**
   * Asigna una solicitud de tarea a un ejecutor
   * @param asignacion Datos de la asignación
   * @returns La solicitud actualizada
   */
  async assignTaskRequest(asignacion: AsignacionRequest): Promise<TaskRequest> {
    try {
      console.log('Asignando solicitud de tarea:', asignacion);

      // Primero asignamos la solicitud (cambia a estado ASSIGNED)
      const assignResponse = await api.post(`task-requests/${asignacion.taskRequestId}/assign`, {}).json();
      console.log('Respuesta de asignación:', assignResponse);

      // Luego asignamos el ejecutor
      const assignExecutorData = {
        executorId: asignacion.executorId,
        notes: asignacion.notes || ''
      };

      const response = await api.post(`task-requests/${asignacion.taskRequestId}/assign-executor`, {
        json: assignExecutorData
      }).json();

      console.log('Respuesta de asignación de ejecutor:', response);
      return response;
    } catch (error) {
      console.error('Error al asignar solicitud de tarea:', error);
      throw error;
    }
  },

  /**
   * Rechaza una solicitud de tarea
   * @param taskRequestId ID de la solicitud
   * @param rechazo Datos del rechazo
   * @returns La solicitud actualizada
   */
  async rejectTaskRequest(taskRequestId: number, rechazo: RechazoRequest): Promise<TaskRequest> {
    try {
      console.log('Rechazando solicitud de tarea:', taskRequestId, rechazo);

      // Verificar que los datos sean válidos
      if (!rechazo.reason || rechazo.reason.trim() === '') {
        throw new Error('El motivo de rechazo no puede estar vacío');
      }

      // Asegurarse de que los datos enviados coincidan con lo que espera el backend
      const dataToSend = {
        reason: rechazo.reason.trim(),
        notes: rechazo.notes ? rechazo.notes.trim() : ''
      };

      // Primero verificar el estado actual de la solicitud
      const taskRequest = await solicitudesService.getTaskRequestById(taskRequestId);

      // Verificar si la solicitud está en estado SUBMITTED
      if (taskRequest && taskRequest.status !== 'SUBMITTED') {
        throw new Error(`Solo se pueden rechazar solicitudes en estado SUBMITTED. Estado actual: ${taskRequest.status}`);
      }

      console.log('Enviando solicitud de rechazo al backend:', {
        url: `task-requests/${taskRequestId}/reject`,
        data: dataToSend
      });

      // Usar fetch directamente para tener más control sobre la solicitud
      const token = localStorage.getItem('bitacora_token');
      if (!token) {
        throw new Error('No se encontró token de autenticación');
      }

      const response = await fetch(`/api/task-requests/${taskRequestId}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dataToSend)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Error ${response.status} al rechazar solicitud:`, errorText);

        let errorMessage = `Error ${response.status}`;
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.message || errorJson.error || errorText;
        } catch (e) {
          errorMessage = errorText || `Error ${response.status} al rechazar la solicitud`;
        }

        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('Respuesta de rechazo de solicitud:', data);
      return data;
    } catch (error) {
      console.error('Error al rechazar solicitud de tarea:', error);
      throw error;
    }
  },

  /**
   * Reasigna una tarea a otro ejecutor
   * @param taskId ID de la tarea
   * @param executorId ID del nuevo ejecutor
   * @param notes Notas opcionales para la reasignación
   * @returns La tarea actualizada
   */
  async reassignTask(taskId: number, executorId: number, notes?: string): Promise<TaskRequest> {
    try {
      console.log('Reasignando tarea:', taskId, 'al ejecutor:', executorId);

      const reassignData = {
        executorId,
        notes: notes || ''
      };

      const response = await api.post(`task-requests/${taskId}/reassign`, {
        json: reassignData
      }).json();

      console.log('Respuesta de reasignación de tarea:', response);
      return response;
    } catch (error) {
      console.error('Error al reasignar tarea:', error);
      throw error;
    }
  }
};

export default asignacionService;
