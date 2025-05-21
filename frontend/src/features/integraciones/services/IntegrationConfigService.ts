import api from '@/utils/api-ky';

/**
 * Interfaz para la configuración de una integración
 */
export interface IntegrationConfig {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  type: 'calendar' | 'drive' | 'email' | 'other';
  icon: string;
  lastSyncTime?: string;
  status: 'connected' | 'disconnected' | 'error';
  statusMessage?: string;
  config: Record<string, any>;
}

/**
 * Interfaz para la configuración de prueba de conexión
 */
export interface ConnectionTestResult {
  success: boolean;
  message: string;
  details?: string;
}

/**
 * Servicio para la gestión de configuración de integraciones
 */
const integrationConfigService = {
  /**
   * Obtiene todas las integraciones disponibles
   * @returns Lista de integraciones
   */
  async getAllIntegrations(): Promise<IntegrationConfig[]> {
    try {
      const response = await api.get('integrations').json();
      return response as IntegrationConfig[];
    } catch (error) {
      console.error('Error al obtener integraciones:', error);
      
      // Devolver integraciones predefinidas como fallback
      return [
        {
          id: 'google-calendar',
          name: 'Google Calendar',
          description: 'Sincroniza actividades con Google Calendar',
          enabled: false,
          type: 'calendar',
          icon: 'calendar',
          status: 'disconnected',
          config: {}
        },
        {
          id: 'google-drive',
          name: 'Google Drive',
          description: 'Almacena archivos adjuntos en Google Drive',
          enabled: false,
          type: 'drive',
          icon: 'hard-drive',
          status: 'disconnected',
          config: {}
        }
      ];
    }
  },

  /**
   * Obtiene una integración por su ID
   * @param id ID de la integración
   * @returns Datos de la integración
   */
  async getIntegrationById(id: string): Promise<IntegrationConfig> {
    try {
      const response = await api.get(`integrations/${id}`).json();
      return response as IntegrationConfig;
    } catch (error) {
      console.error(`Error al obtener integración con ID ${id}:`, error);
      throw new Error('Error al obtener la integración');
    }
  },

  /**
   * Actualiza la configuración de una integración
   * @param id ID de la integración
   * @param config Configuración actualizada
   * @returns Integración actualizada
   */
  async updateIntegration(id: string, config: Partial<IntegrationConfig>): Promise<IntegrationConfig> {
    try {
      const response = await api.put(`integrations/${id}`, {
        json: config
      }).json();
      return response as IntegrationConfig;
    } catch (error) {
      console.error(`Error al actualizar integración con ID ${id}:`, error);
      throw new Error('Error al actualizar la integración');
    }
  },

  /**
   * Habilita o deshabilita una integración
   * @param id ID de la integración
   * @param enabled Estado de habilitación
   * @returns Integración actualizada
   */
  async toggleIntegration(id: string, enabled: boolean): Promise<IntegrationConfig> {
    try {
      const response = await api.patch(`integrations/${id}/toggle`, {
        json: { enabled }
      }).json();
      return response as IntegrationConfig;
    } catch (error) {
      console.error(`Error al cambiar estado de integración con ID ${id}:`, error);
      throw new Error('Error al cambiar el estado de la integración');
    }
  },

  /**
   * Prueba la conexión de una integración
   * @param id ID de la integración
   * @returns Resultado de la prueba
   */
  async testConnection(id: string): Promise<ConnectionTestResult> {
    try {
      const response = await api.post(`integrations/${id}/test`).json();
      return response as ConnectionTestResult;
    } catch (error) {
      console.error(`Error al probar conexión de integración con ID ${id}:`, error);
      return {
        success: false,
        message: 'Error al probar la conexión',
        details: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  },

  /**
   * Sincroniza una integración
   * @param id ID de la integración
   * @returns Resultado de la sincronización
   */
  async syncIntegration(id: string): Promise<{success: boolean, message: string, stats?: Record<string, number>}> {
    try {
      const response = await api.post(`integrations/${id}/sync`).json();
      return response as {success: boolean, message: string, stats?: Record<string, number>};
    } catch (error) {
      console.error(`Error al sincronizar integración con ID ${id}:`, error);
      return {
        success: false,
        message: 'Error al sincronizar la integración'
      };
    }
  },

  /**
   * Obtiene el historial de sincronización de una integración
   * @param id ID de la integración
   * @returns Historial de sincronización
   */
  async getSyncHistory(id: string): Promise<Array<{
    id: string;
    timestamp: string;
    success: boolean;
    message: string;
    stats?: Record<string, number>;
  }>> {
    try {
      const response = await api.get(`integrations/${id}/sync-history`).json();
      return response as Array<{
        id: string;
        timestamp: string;
        success: boolean;
        message: string;
        stats?: Record<string, number>;
      }>;
    } catch (error) {
      console.error(`Error al obtener historial de sincronización para integración con ID ${id}:`, error);
      return [];
    }
  }
};

export default integrationConfigService;
