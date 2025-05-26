import api from '@/utils/api-ky';
import {
  SecurityAlert,
  SecurityAlertType,
  SecurityAlertSeverity,
  SecurityAlertStatus,
  SecurityAlertFilter,
  SecurityAlertRule,
  SecurityAlertRuleType,
  SecurityAlertRuleCondition,
  SecurityAlertRuleAction
} from '../types/securityAlertTypes';

/**
 * Servicio para interactuar con la API de alertas de seguridad
 */
const securityAlertService = {
  /**
   * Obtiene todas las alertas de seguridad
   * @param filter Filtros para las alertas
   * @returns Lista de alertas de seguridad
   */
  async getAlerts(filter?: SecurityAlertFilter): Promise<SecurityAlert[]> {
    try {
      const searchParams = new URLSearchParams();

      if (filter) {
        if (filter.status) searchParams.append('status', filter.status);
        if (filter.severity) searchParams.append('severity', filter.severity);
        if (filter.type) searchParams.append('type', filter.type);
        if (filter.userId) searchParams.append('userId', filter.userId.toString());
        if (filter.startDate) searchParams.append('startDate', filter.startDate);
        if (filter.endDate) searchParams.append('endDate', filter.endDate);
      }

      const response = await api.get('security-alerts', {
        searchParams
      }).json<SecurityAlert[]>();

      return response;
    } catch (error) {
      console.error('Error al obtener alertas de seguridad:', error);
      throw error;
    }
  },

  /**
   * Obtiene una alerta de seguridad por su ID
   * @param id ID de la alerta
   * @returns Alerta de seguridad
   */
  async getAlertById(id: string): Promise<SecurityAlert> {
    try {
      const response = await api.get(`security-alerts/${id}`).json<SecurityAlert>();
      return response;
    } catch (error) {
      console.error(`Error al obtener alerta de seguridad con ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Actualiza el estado de una alerta de seguridad
   * @param id ID de la alerta
   * @param status Nuevo estado
   * @param note Nota opcional
   * @returns Alerta actualizada
   */
  async updateAlertStatus(id: string, status: SecurityAlertStatus, note?: string): Promise<SecurityAlert> {
    try {
      const response = await api.patch(`security-alerts/${id}/status`, {
        json: {
          status,
          note
        }
      }).json<SecurityAlert>();

      return response;
    } catch (error) {
      console.error(`Error al actualizar estado de alerta de seguridad con ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Obtiene las reglas de alertas de seguridad
   * @returns Lista de reglas de alertas
   */
  async getAlertRules(): Promise<SecurityAlertRule[]> {
    try {
      const response = await api.get('security-alert-rules').json<SecurityAlertRule[]>();
      return response;
    } catch (error) {
      console.error('Error al obtener reglas de alertas de seguridad:', error);
      throw error;
    }
  },

  /**
   * Crea una nueva regla de alerta de seguridad
   * @param rule Regla a crear
   * @returns Regla creada
   */
  async createAlertRule(rule: Omit<SecurityAlertRule, 'id' | 'createdAt' | 'updatedAt'>): Promise<SecurityAlertRule> {
    try {
      const response = await api.post('security-alert-rules', {
        json: rule
      }).json<SecurityAlertRule>();

      return response;
    } catch (error) {
      console.error('Error al crear regla de alerta de seguridad:', error);
      throw error;
    }
  },

  /**
   * Actualiza una regla de alerta de seguridad
   * @param id ID de la regla
   * @param rule Datos actualizados
   * @returns Regla actualizada
   */
  async updateAlertRule(id: string, rule: Partial<SecurityAlertRule>): Promise<SecurityAlertRule> {
    try {
      const response = await api.put(`security-alert-rules/${id}`, {
        json: rule
      }).json<SecurityAlertRule>();

      return response;
    } catch (error) {
      console.error(`Error al actualizar regla de alerta de seguridad con ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Elimina una regla de alerta de seguridad
   * @param id ID de la regla
   * @returns Resultado de la operación
   */
  async deleteAlertRule(id: string): Promise<{ success: boolean }> {
    try {
      const response = await api.delete(`security-alert-rules/${id}`).json<{ success: boolean }>();
      return response;
    } catch (error) {
      console.error(`Error al eliminar regla de alerta de seguridad con ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Obtiene estadísticas de alertas de seguridad
   * @param startDate Fecha de inicio
   * @param endDate Fecha de fin
   * @returns Estadísticas de alertas
   */
  async getAlertStatistics(startDate?: string, endDate?: string): Promise<{
    totalAlerts: number;
    bySeverity: Record<SecurityAlertSeverity, number>;
    byType: Record<SecurityAlertType, number>;
    byStatus: Record<SecurityAlertStatus, number>;
    timeline: Array<{ date: string; count: number }>;
  }> {
    try {
      const searchParams = new URLSearchParams();

      if (startDate) searchParams.append('startDate', startDate);
      if (endDate) searchParams.append('endDate', endDate);

      const response = await api.get('security-alerts/statistics', {
        searchParams
      }).json<{
        totalAlerts: number;
        bySeverity: Record<SecurityAlertSeverity, number>;
        byType: Record<SecurityAlertType, number>;
        byStatus: Record<SecurityAlertStatus, number>;
        timeline: Array<{ date: string; count: number }>;
      }>();

      return response;
    } catch (error) {
      console.error('Error al obtener estadísticas de alertas de seguridad:', error);
      throw error;
    }
  }
};

export default securityAlertService;
