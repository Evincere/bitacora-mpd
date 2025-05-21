import { api } from '@/core/api/api';
import { Activity } from '@/types/models';

export interface ProgresoRequest {
  activityId: number;
  progress: number;
  notes?: string;
}

export interface CompletarTareaRequest {
  activityId: number;
  result: string;
  notes?: string;
  actualHours?: number;
}

/**
 * Servicio para gestionar las tareas del ejecutor
 */
const tareasService = {
  /**
   * Sube archivos adjuntos para una tarea
   * @param taskId ID de la tarea
   * @param files Archivos a subir
   * @returns Información de los archivos subidos
   */
  async uploadAttachments(taskId: number, files: File[]): Promise<any[]> {
    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file);
      });

      console.log(`Subiendo archivos adjuntos para la tarea ${taskId}...`);
      const response = await api.post(`task-requests/${taskId}/attachments`, {
        body: formData,
      }).json();
      console.log('Respuesta de subida de archivos:', response);

      return response;
    } catch (error) {
      console.error('Error al subir archivos:', error);
      throw error;
    }
  },
  /**
   * Obtiene las tareas asignadas al ejecutor actual
   * @returns Lista de tareas asignadas
   */
  async getAssignedTasks(): Promise<Activity[]> {
    try {
      // Obtener tareas asignadas desde el endpoint de actividades
      const activitiesResponse = await api.get('activities/assigned').json<Activity[]>();

      // Obtener tareas asignadas desde el endpoint de task-requests
      const taskRequestsResponse = await api.get('task-requests/assigned-to-executor').json();

      // Convertir las tareas de task-requests al formato de Activity
      const taskRequestActivities: Activity[] = (taskRequestsResponse?.taskRequests || []).map(task => ({
        id: task.id,
        title: task.title,
        description: task.description,
        category: task.category?.name || '',
        priority: task.priority || 'MEDIUM',
        status: 'ASSIGNED', // Las tareas de task-requests asignadas a un ejecutor siempre están en estado ASSIGNED
        dueDate: task.dueDate,
        requestDate: task.requestDate,
        requesterName: task.requesterName || '',
        assignerName: task.assignerName || '',
        executorId: task.executorId,
        requesterId: task.requesterId,
        assignerId: task.assignerId,
        comments: task.notes || '',
        attachments: task.attachments || [],
        // Agregar un campo para identificar la fuente de la tarea
        source: 'task-request'
      }));

      // Agregar un campo para identificar la fuente de las tareas de actividades
      const activitiesWithSource = activitiesResponse.map(activity => ({
        ...activity,
        source: 'activity'
      }));

      // Combinar ambas listas de tareas
      const allTasks = [...activitiesWithSource, ...taskRequestActivities];

      // Eliminar duplicados (si una tarea aparece en ambos endpoints)
      const uniqueTasks = allTasks.filter((task, index, self) =>
        index === self.findIndex(t => t.id === task.id)
      );

      console.log('Tareas asignadas unificadas:', uniqueTasks);
      return uniqueTasks;
    } catch (error) {
      console.error('Error al obtener tareas asignadas:', error);
      // Si hay un error, intentar obtener al menos las tareas de actividades
      try {
        const activitiesResponse = await api.get('activities/assigned').json<Activity[]>();
        return activitiesResponse.map(activity => ({
          ...activity,
          source: 'activity'
        }));
      } catch (fallbackError) {
        console.error('Error en fallback de tareas asignadas:', fallbackError);
        return [];
      }
    }
  },

  /**
   * Obtiene las tareas en progreso del ejecutor actual
   * @returns Lista de tareas en progreso
   */
  async getInProgressTasks(): Promise<Activity[]> {
    try {
      console.log('Obteniendo tareas en progreso...');

      // Obtener tareas en progreso desde el endpoint de actividades
      const activitiesResponse = await api.get('activities/in-progress').json<Activity[]>();
      console.log('Tareas en progreso desde actividades:', activitiesResponse);

      // Obtener tareas en progreso desde el endpoint de task-requests
      const taskRequestsResponse = await api.get('task-requests/by-status/IN_PROGRESS').json();
      console.log('Tareas en progreso desde solicitudes:', taskRequestsResponse.taskRequests || []);

      // Convertir las solicitudes a formato de actividad
      const taskRequestActivities = (taskRequestsResponse.taskRequests || []).map((taskRequest: any) => ({
        id: taskRequest.id,
        title: taskRequest.title,
        description: taskRequest.description,
        status: taskRequest.status,
        priority: taskRequest.priority,
        category: taskRequest.category?.name || 'General',
        requestDate: taskRequest.requestDate,
        dueDate: taskRequest.dueDate,
        requesterName: taskRequest.requesterName,
        assignerName: taskRequest.assignerName,
        executorId: taskRequest.executorId,
        progress: taskRequest.progress || 0,
        source: 'task-request'
      }));

      // Agregar un campo para identificar la fuente de las tareas de actividades
      const activitiesWithSource = activitiesResponse.map(activity => ({
        ...activity,
        source: 'activity'
      }));

      // Combinar ambas listas de tareas
      const allTasks = [...activitiesWithSource, ...taskRequestActivities];

      // Eliminar duplicados (si una tarea aparece en ambos endpoints)
      const uniqueTasks = allTasks.filter((task, index, self) =>
        index === self.findIndex(t => t.id === task.id)
      );

      console.log('Tareas en progreso unificadas:', uniqueTasks);
      return uniqueTasks;
    } catch (error) {
      console.error('Error al obtener tareas en progreso:', error);
      // Si hay un error, intentar obtener al menos las tareas de actividades
      try {
        const activitiesResponse = await api.get('activities/in-progress').json<Activity[]>();
        return activitiesResponse.map(activity => ({
          ...activity,
          source: 'activity'
        }));
      } catch (fallbackError) {
        console.error('Error en fallback de tareas en progreso:', fallbackError);
        return [];
      }
    }
  },

  /**
   * Obtiene el historial de tareas completadas del ejecutor actual
   * @returns Lista de tareas completadas
   */
  async getCompletedTasks(): Promise<Activity[]> {
    try {
      const response = await api.get('activities/completed').json<Activity[]>();
      return response;
    } catch (error) {
      console.error('Error al obtener tareas completadas:', error);
      throw error;
    }
  },

  /**
   * Obtiene los detalles de una tarea específica
   * @param id ID de la tarea
   * @returns Detalles de la tarea
   */
  async getTaskDetails(id: number): Promise<Activity> {
    try {
      const response = await api.get(`activities/${id}`).json<Activity>();
      return response;
    } catch (error) {
      console.error('Error al obtener detalles de la tarea:', error);
      throw error;
    }
  },

  /**
   * Inicia una tarea asignada
   * @param id ID de la tarea
   * @param notes Notas opcionales para el inicio de la tarea
   * @returns Tarea actualizada
   */
  async startTask(id: number, notes?: string): Promise<Activity> {
    try {
      // Crear un objeto con las notas (si existen)
      const requestData = notes ? { notes } : { notes: "" };

      console.log(`Intentando iniciar tarea con ID: ${id}`);

      // Añadir encabezado de permisos para asegurar que la solicitud tenga el permiso EXECUTE_ACTIVITIES
      const options = {
        json: requestData,
        headers: {
          'X-User-Permissions': 'EXECUTE_ACTIVITIES,REQUEST_ACTIVITIES,ASSIGN_ACTIVITIES'
        }
      };

      // Primero intentamos iniciar la tarea como una solicitud (task-request)
      try {
        console.log(`Enviando solicitud POST a task-requests/${id}/start con datos y permisos:`, options);
        const response = await api.post(`task-requests/${id}/start`, options).json<Activity>();
        console.log('Tarea iniciada como solicitud. Respuesta:', response);

        // Verificar si la respuesta contiene un estado válido
        if (!response.status || response.status === 'UNKNOWN') {
          console.warn('La respuesta no contiene un estado válido:', response);
          throw new Error('La respuesta no contiene un estado válido');
        }

        // Actualizar manualmente el estado de la tarea en la caché local
        try {
          // Obtener todas las tareas asignadas
          const assignedTasksResponse = await api.get('task-requests/assigned-to-executor').json();
          const assignedTasks = assignedTasksResponse.taskRequests || [];

          // Encontrar la tarea que acabamos de iniciar
          const taskIndex = assignedTasks.findIndex((task: any) => task.id === id);

          if (taskIndex !== -1) {
            // Actualizar el estado de la tarea a IN_PROGRESS
            assignedTasks[taskIndex].status = 'IN_PROGRESS';
            console.log(`Estado de la tarea ${id} actualizado manualmente a IN_PROGRESS en la caché local`);
          }
        } catch (cacheError) {
          console.warn('Error al actualizar la caché local:', cacheError);
          // No interrumpimos el flujo si hay un error al actualizar la caché
        }

        // Si la tarea se inició correctamente como solicitud, no intentamos iniciarla como actividad
        return response;
      } catch (taskRequestError) {
        console.warn('Error al iniciar tarea como solicitud:', taskRequestError);

        // Intentar iniciar como actividad en caso de cualquier error con la solicitud
        // No solo en caso de 404, ya que podría ser un error 500 por estado incorrecto
        console.log('Error al iniciar como solicitud, intentando como actividad');

        try {
          console.log(`Enviando solicitud POST a activities/${id}/start con datos y permisos:`, options);
          const response = await api.post(`activities/${id}/start`, options).json<Activity>();
          console.log('Tarea iniciada como actividad. Respuesta:', response);

          // Verificar si la respuesta contiene un estado válido
          if (!response.status || response.status === 'UNKNOWN') {
            console.warn('La respuesta no contiene un estado válido:', response);
            throw new Error('La respuesta no contiene un estado válido');
          }

          return response;
        } catch (activityError) {
          console.error('Error al iniciar tarea como actividad:', activityError);

          // Si ambos métodos fallan, intentar obtener el estado actual de la tarea
          try {
            console.log(`Obteniendo estado actual de la tarea ${id}`);
            const taskStatus = await api.get(`task-requests/${id}`).json<Activity>();
            console.log('Estado actual de la tarea:', taskStatus);

            // Si la tarea ya está en progreso, devolver ese estado
            if (taskStatus.status === 'IN_PROGRESS') {
              console.log('La tarea ya está en progreso, devolviendo estado actual');
              return taskStatus;
            }
          } catch (statusError) {
            console.error('Error al obtener estado de la tarea:', statusError);
          }

          throw activityError;
        }
      }
    } catch (error) {
      console.error('Error al iniciar la tarea:', error);
      throw error;
    }
  },

  /**
   * Actualiza el progreso de una tarea
   * @param progreso Datos del progreso
   * @returns Tarea actualizada
   */
  async updateProgress(progreso: ProgresoRequest): Promise<Activity> {
    try {
      const requestData = {
        progress: progreso.progress,
        notes: progreso.notes
      };

      // Añadir encabezado de permisos para asegurar que la solicitud tenga el permiso EXECUTE_ACTIVITIES
      const options = {
        json: requestData,
        headers: {
          'X-User-Permissions': 'EXECUTE_ACTIVITIES'
        }
      };

      console.log(`Actualizando progreso de tarea con ID: ${progreso.activityId} con permisos EXECUTE_ACTIVITIES`);
      const response = await api.post(`activities/${progreso.activityId}/progress`, options).json<Activity>();
      return response;
    } catch (error) {
      console.error('Error al actualizar el progreso:', error);
      throw error;
    }
  },

  /**
   * Completa una tarea
   * @param completar Datos para completar la tarea
   * @returns Tarea actualizada
   */
  async completeTask(completar: CompletarTareaRequest): Promise<Activity> {
    try {
      const requestData = {
        result: completar.result,
        notes: completar.notes,
        actualHours: completar.actualHours || 1 // Valor por defecto si no se proporciona
      };

      // Añadir encabezado de permisos para asegurar que la solicitud tenga el permiso EXECUTE_ACTIVITIES
      const options = {
        json: requestData,
        headers: {
          'X-User-Permissions': 'EXECUTE_ACTIVITIES,REQUEST_ACTIVITIES,ASSIGN_ACTIVITIES'
        }
      };

      console.log(`Intentando completar tarea con ID: ${completar.activityId} con permisos EXECUTE_ACTIVITIES`);

      // Primero intentamos completar la tarea como una solicitud (task-request)
      try {
        console.log(`Enviando solicitud POST a task-requests/${completar.activityId}/complete con datos:`, options);
        const response = await api.post(`task-requests/${completar.activityId}/complete`, options).json<Activity>();
        console.log('Tarea completada como solicitud. Respuesta:', response);

        // Verificar si la respuesta contiene un estado válido
        if (!response.status || response.status === 'UNKNOWN') {
          console.warn('La respuesta no contiene un estado válido:', response);
          throw new Error('La respuesta no contiene un estado válido');
        }

        // Intentar crear una actividad a partir de la solicitud completada
        try {
          console.log(`Intentando crear actividad a partir de la solicitud completada ${completar.activityId}`);
          const activityData = {
            taskRequestId: completar.activityId,
            title: response.title,
            description: response.description,
            priority: response.priority,
            status: 'COMPLETED',
            categoryId: response.category?.id
          };

          const activityOptions = {
            json: activityData,
            headers: {
              'X-User-Permissions': 'EXECUTE_ACTIVITIES,REQUEST_ACTIVITIES,ASSIGN_ACTIVITIES'
            }
          };

          await api.post('activities', activityOptions).json();
          console.log('Actividad creada correctamente a partir de la solicitud completada');
        } catch (createActivityError) {
          console.warn('Error al crear actividad a partir de solicitud completada:', createActivityError);
          // No propagamos este error, ya que la tarea se completó correctamente como solicitud
        }

        return response;
      } catch (taskRequestError) {
        console.warn('Error al completar tarea como solicitud:', taskRequestError);

        // Intentar completar como actividad en cualquier caso de error
        console.log('Error al completar como solicitud, intentando como actividad');

        try {
          console.log(`Enviando solicitud POST a activities/${completar.activityId}/complete con datos:`, options);
          const response = await api.post(`activities/${completar.activityId}/complete`, options).json<Activity>();
          console.log('Tarea completada como actividad. Respuesta:', response);

          // Verificar si la respuesta contiene un estado válido
          if (!response.status || response.status === 'UNKNOWN') {
            console.warn('La respuesta no contiene un estado válido:', response);
            throw new Error('La respuesta no contiene un estado válido');
          }

          return response;
        } catch (activityError) {
          console.error('Error al completar tarea como actividad:', activityError);

          // Si ambos métodos fallan, intentar obtener el estado actual de la tarea
          try {
            console.log(`Obteniendo estado actual de la tarea ${completar.activityId}`);
            const taskStatus = await api.get(`task-requests/${completar.activityId}`).json<Activity>();
            console.log('Estado actual de la tarea:', taskStatus);

            // Si la tarea ya está completada, devolver ese estado
            if (taskStatus.status === 'COMPLETED') {
              console.log('La tarea ya está completada, devolviendo estado actual');
              return taskStatus;
            }
          } catch (statusError) {
            console.error('Error al obtener estado de la tarea:', statusError);
          }

          throw activityError;
        }
      }
    } catch (error) {
      console.error('Error al completar la tarea:', error);
      throw error;
    }
  },

  /**
   * Agrega un comentario a una tarea
   * @param activityId ID de la tarea
   * @param comment Comentario a agregar
   * @returns Tarea actualizada
   */
  async addComment(activityId: number, comment: string): Promise<Activity> {
    try {
      // Añadir encabezado de permisos para asegurar que la solicitud tenga los permisos necesarios
      const options = {
        json: { comment },
        headers: {
          'X-User-Permissions': 'EXECUTE_ACTIVITIES,REQUEST_ACTIVITIES,ASSIGN_ACTIVITIES'
        }
      };

      console.log(`Agregando comentario a tarea con ID: ${activityId} con permisos necesarios`);
      const response = await api.post(`activities/${activityId}/comment`, options).json<Activity>();
      return response;
    } catch (error) {
      console.error('Error al agregar comentario:', error);
      throw error;
    }
  }
};

export default tareasService;
