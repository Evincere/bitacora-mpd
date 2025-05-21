import api from '@/utils/api-ky';
import { googleAuthService } from './GoogleAuthService';
import { 
  CalendarIntegrationService, 
  CalendarEvent, 
  CalendarIntegrationConfig 
} from './CalendarIntegrationService';

/**
 * Implementación real del servicio de integración con Google Calendar
 */
export class RealCalendarIntegrationService implements CalendarIntegrationService {
  private config: CalendarIntegrationConfig = {
    calendarId: 'primary',
    syncEnabled: false,
    syncDirection: 'one-way',
    eventMapping: {
      title: '{title}',
      description: '{description}',
      location: '{location}'
    },
    notifyAttendees: false
  };

  /**
   * Inicializa el servicio de integración con Google Calendar
   * @returns Promise<void>
   */
  async initialize(): Promise<void> {
    try {
      // Inicializar el servicio de autenticación de Google
      await googleAuthService.initialize({
        clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID || '',
        apiKey: process.env.REACT_APP_GOOGLE_API_KEY || '',
        scopes: [
          'https://www.googleapis.com/auth/calendar',
          'https://www.googleapis.com/auth/calendar.events'
        ],
        discoveryDocs: [
          'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'
        ]
      });

      // Cargar la configuración desde el backend si el usuario está autenticado
      if (await this.isAuthenticated()) {
        await this.loadConfig();
      }
    } catch (error) {
      console.error('Error al inicializar el servicio de integración con Google Calendar:', error);
      throw error;
    }
  }

  /**
   * Verifica si el usuario está autenticado con Google Calendar
   * @returns Promise<boolean>
   */
  async isAuthenticated(): Promise<boolean> {
    try {
      // Verificar si el usuario está autenticado con Google
      const isGoogleAuthenticated = googleAuthService.isAuthenticated();
      
      if (!isGoogleAuthenticated) {
        return false;
      }
      
      // Verificar si el token está registrado en el backend
      const response = await api.get('integrations/google/calendar/status').json<{ authenticated: boolean }>();
      return response.authenticated;
    } catch (error) {
      console.error('Error al verificar la autenticación con Google Calendar:', error);
      return false;
    }
  }

  /**
   * Inicia el flujo de autenticación con Google Calendar
   * @returns Promise<void>
   */
  async authenticate(): Promise<void> {
    try {
      // Iniciar sesión con Google
      await googleAuthService.signIn();
      
      // Verificar si la autenticación fue exitosa
      if (!googleAuthService.isAuthenticated()) {
        throw new Error('La autenticación con Google falló');
      }
      
      // Cargar la configuración desde el backend
      await this.loadConfig();
    } catch (error) {
      console.error('Error al autenticar con Google Calendar:', error);
      throw error;
    }
  }

  /**
   * Cierra la sesión con Google Calendar
   * @returns Promise<void>
   */
  async logout(): Promise<void> {
    try {
      await googleAuthService.signOut();
    } catch (error) {
      console.error('Error al cerrar sesión con Google Calendar:', error);
      throw error;
    }
  }

  /**
   * Obtiene la lista de calendarios disponibles para el usuario
   * @returns Promise<Array<{id: string, name: string}>>
   */
  async getCalendars(): Promise<Array<{id: string, name: string}>> {
    if (!await this.isAuthenticated()) {
      throw new Error('Usuario no autenticado');
    }
    
    try {
      const response = await window.gapi.client.calendar.calendarList.list();
      
      return response.result.items.map((calendar: any) => ({
        id: calendar.id,
        name: calendar.summary
      }));
    } catch (error) {
      console.error('Error al obtener calendarios:', error);
      throw error;
    }
  }

  /**
   * Crea un evento en Google Calendar
   * @param event Datos del evento a crear
   * @returns Promise<string> ID del evento creado
   */
  async createEvent(event: CalendarEvent): Promise<string> {
    if (!await this.isAuthenticated()) {
      throw new Error('Usuario no autenticado');
    }
    
    try {
      const calendarEvent = this.mapToGoogleCalendarEvent(event);
      
      const response = await window.gapi.client.calendar.events.insert({
        calendarId: this.config.calendarId,
        resource: calendarEvent,
        sendUpdates: this.config.notifyAttendees ? 'all' : 'none'
      });
      
      return response.result.id;
    } catch (error) {
      console.error('Error al crear evento en Google Calendar:', error);
      throw error;
    }
  }

  /**
   * Actualiza un evento existente en Google Calendar
   * @param eventId ID del evento a actualizar
   * @param event Nuevos datos del evento
   * @returns Promise<void>
   */
  async updateEvent(eventId: string, event: CalendarEvent): Promise<void> {
    if (!await this.isAuthenticated()) {
      throw new Error('Usuario no autenticado');
    }
    
    try {
      const calendarEvent = this.mapToGoogleCalendarEvent(event);
      
      await window.gapi.client.calendar.events.update({
        calendarId: this.config.calendarId,
        eventId: eventId,
        resource: calendarEvent,
        sendUpdates: this.config.notifyAttendees ? 'all' : 'none'
      });
    } catch (error) {
      console.error('Error al actualizar evento en Google Calendar:', error);
      throw error;
    }
  }

  /**
   * Elimina un evento de Google Calendar
   * @param eventId ID del evento a eliminar
   * @returns Promise<void>
   */
  async deleteEvent(eventId: string): Promise<void> {
    if (!await this.isAuthenticated()) {
      throw new Error('Usuario no autenticado');
    }
    
    try {
      await window.gapi.client.calendar.events.delete({
        calendarId: this.config.calendarId,
        eventId: eventId,
        sendUpdates: this.config.notifyAttendees ? 'all' : 'none'
      });
    } catch (error) {
      console.error('Error al eliminar evento de Google Calendar:', error);
      throw error;
    }
  }

  /**
   * Obtiene eventos de Google Calendar en un rango de fechas
   * @param start Fecha de inicio
   * @param end Fecha de fin
   * @returns Promise<CalendarEvent[]>
   */
  async getEvents(start: Date, end: Date): Promise<CalendarEvent[]> {
    if (!await this.isAuthenticated()) {
      throw new Error('Usuario no autenticado');
    }
    
    try {
      const response = await window.gapi.client.calendar.events.list({
        calendarId: this.config.calendarId,
        timeMin: start.toISOString(),
        timeMax: end.toISOString(),
        singleEvents: true,
        orderBy: 'startTime'
      });
      
      return response.result.items.map(this.mapFromGoogleCalendarEvent);
    } catch (error) {
      console.error('Error al obtener eventos de Google Calendar:', error);
      throw error;
    }
  }

  /**
   * Sincroniza eventos entre la aplicación y Google Calendar
   * @param activityIds IDs de las actividades a sincronizar (opcional)
   * @returns Promise<{created: number, updated: number, deleted: number}>
   */
  async syncEvents(activityIds?: number[]): Promise<{created: number, updated: number, deleted: number}> {
    if (!await this.isAuthenticated()) {
      throw new Error('Usuario no autenticado');
    }
    
    try {
      const response = await api.post('integrations/google/calendar/sync', {
        json: { activityIds }
      }).json<{created: number, updated: number, deleted: number}>();
      
      return response;
    } catch (error) {
      console.error('Error al sincronizar eventos con Google Calendar:', error);
      throw error;
    }
  }

  /**
   * Obtiene la configuración actual de la integración
   * @returns Promise<CalendarIntegrationConfig>
   */
  async getConfig(): Promise<CalendarIntegrationConfig> {
    return this.config;
  }

  /**
   * Actualiza la configuración de la integración
   * @param config Nueva configuración
   * @returns Promise<void>
   */
  async updateConfig(config: CalendarIntegrationConfig): Promise<void> {
    try {
      await api.put('integrations/google/calendar/config', {
        json: config
      });
      
      this.config = config;
    } catch (error) {
      console.error('Error al actualizar la configuración de Google Calendar:', error);
      throw error;
    }
  }

  /**
   * Carga la configuración desde el backend
   * @returns Promise<void>
   */
  private async loadConfig(): Promise<void> {
    try {
      const config = await api.get('integrations/google/calendar/config').json<CalendarIntegrationConfig>();
      this.config = config;
    } catch (error) {
      console.error('Error al cargar la configuración de Google Calendar:', error);
      // Usar la configuración por defecto
    }
  }

  /**
   * Mapea un evento de la aplicación a un evento de Google Calendar
   * @param event Evento de la aplicación
   * @returns Evento de Google Calendar
   */
  private mapToGoogleCalendarEvent(event: CalendarEvent): any {
    const attendees = event.attendees ? event.attendees.map(email => ({ email })) : undefined;
    
    return {
      summary: this.applyEventMapping(this.config.eventMapping.title, event),
      description: this.applyEventMapping(this.config.eventMapping.description, event),
      location: this.applyEventMapping(this.config.eventMapping.location, event),
      start: {
        dateTime: event.start.toISOString()
      },
      end: {
        dateTime: event.end.toISOString()
      },
      attendees,
      colorId: event.color,
      extendedProperties: {
        private: {
          activityId: event.activityId?.toString()
        }
      }
    };
  }

  /**
   * Mapea un evento de Google Calendar a un evento de la aplicación
   * @param googleEvent Evento de Google Calendar
   * @returns Evento de la aplicación
   */
  private mapFromGoogleCalendarEvent(googleEvent: any): CalendarEvent {
    const activityId = googleEvent.extendedProperties?.private?.activityId;
    
    return {
      id: googleEvent.id,
      title: googleEvent.summary,
      description: googleEvent.description,
      start: new Date(googleEvent.start.dateTime || googleEvent.start.date),
      end: new Date(googleEvent.end.dateTime || googleEvent.end.date),
      location: googleEvent.location,
      attendees: googleEvent.attendees?.map((attendee: any) => attendee.email),
      color: googleEvent.colorId,
      activityId: activityId ? parseInt(activityId) : undefined
    };
  }

  /**
   * Aplica el mapeo de eventos a un campo
   * @param template Plantilla de mapeo
   * @param event Evento
   * @returns Texto con el mapeo aplicado
   */
  private applyEventMapping(template: string, event: CalendarEvent): string {
    return template
      .replace('{title}', event.title)
      .replace('{description}', event.description || '')
      .replace('{location}', event.location || '');
  }
}

// Exportar una instancia del servicio
export const realCalendarIntegrationService = new RealCalendarIntegrationService();
