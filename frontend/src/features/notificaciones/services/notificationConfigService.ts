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
      throw error;
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
      throw error;
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
      throw error;
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
      throw error;
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
