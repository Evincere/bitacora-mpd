import api from '@/utils/api-ky';

export interface NotificationChannel {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

export interface NotificationType {
  id: string;
  name: string;
  description: string;
  channels: Record<string, boolean>;
}

export interface NotificationTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  type: string;
  channel: string;
}

export interface NotificationPreferences {
  types: Record<string, {
    app: boolean;
    email: boolean;
    push: boolean;
    [key: string]: boolean;
  }>;
}

export interface UpdateTemplateDto {
  subject?: string;
  content?: string;
}

/**
 * Servicio para la gestión de configuración de notificaciones
 */
const notificationConfigService = {
  /**
   * Obtiene todos los canales de notificación disponibles
   * @returns Lista de canales de notificación
   */
  async getNotificationChannels(): Promise<NotificationChannel[]> {
    try {
      const response = await api.get('notification-channels').json();
      return response as NotificationChannel[];
    } catch (error) {
      console.error('Error al obtener canales de notificación:', error);
      
      // Devolver canales predefinidos como fallback
      return [
        { id: 'app', name: 'Aplicación', description: 'Notificaciones dentro de la aplicación', enabled: true },
        { id: 'email', name: 'Correo electrónico', description: 'Notificaciones por correo electrónico', enabled: true },
        { id: 'push', name: 'Push', description: 'Notificaciones push en dispositivos móviles', enabled: true }
      ];
    }
  },

  /**
   * Obtiene todos los tipos de notificación disponibles
   * @returns Lista de tipos de notificación
   */
  async getNotificationTypes(): Promise<NotificationType[]> {
    try {
      const response = await api.get('notification-types').json();
      return response as NotificationType[];
    } catch (error) {
      console.error('Error al obtener tipos de notificación:', error);
      
      // Devolver tipos predefinidos como fallback
      return [
        { 
          id: 'asignacion', 
          name: 'Asignación de Tareas', 
          description: 'Notificaciones cuando se te asigne una nueva tarea o cuando seas designado como responsable de una actividad.',
          channels: { app: true, email: true, push: true }
        },
        { 
          id: 'cambioEstado', 
          name: 'Cambios de Estado', 
          description: 'Notificaciones cuando cambie el estado de una tarea en la que estés involucrado (asignada, en progreso, completada, etc.).',
          channels: { app: true, email: false, push: true }
        },
        { 
          id: 'fechaLimite', 
          name: 'Fechas Límite', 
          description: 'Recordatorios cuando se acerque la fecha límite de tus tareas (1 día, 4 horas, 1 hora antes).',
          channels: { app: true, email: true, push: true }
        },
        { 
          id: 'comentario', 
          name: 'Comentarios', 
          description: 'Notificaciones cuando alguien comente en una tarea en la que estés involucrado o cuando te mencionen en un comentario.',
          channels: { app: true, email: false, push: false }
        },
        { 
          id: 'sistema', 
          name: 'Sistema', 
          description: 'Notificaciones sobre eventos del sistema, como inicios de sesión en nuevos dispositivos, actualizaciones de la aplicación, etc.',
          channels: { app: true, email: true, push: false }
        }
      ];
    }
  },

  /**
   * Obtiene las preferencias de notificación del usuario actual
   * @returns Preferencias de notificación
   */
  async getUserNotificationPreferences(): Promise<NotificationPreferences> {
    try {
      const response = await api.get('users/me/notification-preferences').json();
      return response as NotificationPreferences;
    } catch (error) {
      console.error('Error al obtener preferencias de notificación:', error);
      
      // Devolver preferencias predefinidas como fallback
      return {
        types: {
          asignacion: { app: true, email: true, push: true },
          cambioEstado: { app: true, email: false, push: true },
          fechaLimite: { app: true, email: true, push: true },
          comentario: { app: true, email: false, push: false },
          sistema: { app: true, email: true, push: false }
        }
      };
    }
  },

  /**
   * Actualiza las preferencias de notificación del usuario actual
   * @param preferences Preferencias de notificación
   */
  async updateUserNotificationPreferences(preferences: NotificationPreferences): Promise<void> {
    try {
      await api.put('users/me/notification-preferences', {
        json: preferences
      });
    } catch (error) {
      console.error('Error al actualizar preferencias de notificación:', error);
      throw new Error('Error al guardar las preferencias de notificación');
    }
  },

  /**
   * Obtiene todas las plantillas de notificación
   * @returns Lista de plantillas de notificación
   */
  async getNotificationTemplates(): Promise<NotificationTemplate[]> {
    try {
      const response = await api.get('notification-templates').json();
      return response as NotificationTemplate[];
    } catch (error) {
      console.error('Error al obtener plantillas de notificación:', error);
      
      // Devolver plantillas predefinidas como fallback
      return [
        { 
          id: 'asignacion_email', 
          name: 'Asignación de tarea (Email)', 
          subject: 'Nueva tarea asignada: {{taskTitle}}',
          content: 'Hola {{userName}},\n\nSe te ha asignado una nueva tarea: {{taskTitle}}.\n\nFecha límite: {{dueDate}}\nPrioridad: {{priority}}\n\nPuedes ver los detalles de la tarea en el siguiente enlace: {{taskLink}}',
          type: 'asignacion',
          channel: 'email'
        },
        { 
          id: 'asignacion_app', 
          name: 'Asignación de tarea (App)', 
          subject: '',
          content: 'Se te ha asignado la tarea "{{taskTitle}}"',
          type: 'asignacion',
          channel: 'app'
        },
        { 
          id: 'cambioEstado_app', 
          name: 'Cambio de estado (App)', 
          subject: '',
          content: 'La tarea "{{taskTitle}}" ha cambiado a estado {{newStatus}}',
          type: 'cambioEstado',
          channel: 'app'
        }
      ];
    }
  },

  /**
   * Obtiene una plantilla de notificación por su ID
   * @param id ID de la plantilla
   * @returns Plantilla de notificación
   */
  async getNotificationTemplateById(id: string): Promise<NotificationTemplate> {
    try {
      const response = await api.get(`notification-templates/${id}`).json();
      return response as NotificationTemplate;
    } catch (error) {
      console.error(`Error al obtener plantilla de notificación con ID ${id}:`, error);
      throw new Error('Error al obtener la plantilla de notificación');
    }
  },

  /**
   * Actualiza una plantilla de notificación
   * @param id ID de la plantilla
   * @param templateData Datos de la plantilla
   * @returns Plantilla actualizada
   */
  async updateNotificationTemplate(id: string, templateData: UpdateTemplateDto): Promise<NotificationTemplate> {
    try {
      const response = await api.put(`notification-templates/${id}`, {
        json: templateData
      }).json();
      return response as NotificationTemplate;
    } catch (error) {
      console.error(`Error al actualizar plantilla de notificación con ID ${id}:`, error);
      throw new Error('Error al actualizar la plantilla de notificación');
    }
  }
};

export default notificationConfigService;
