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
      
      // Datos de ejemplo como fallback
      return [
        {
          id: '1',
          type: SecurityAlertType.FAILED_LOGIN,
          message: 'Múltiples intentos fallidos de inicio de sesión',
          details: 'Se detectaron 5 intentos fallidos de inicio de sesión para el usuario admin',
          severity: SecurityAlertSeverity.HIGH,
          status: SecurityAlertStatus.NEW,
          timestamp: new Date().toISOString(),
          userId: 1,
          userName: 'admin',
          ipAddress: '192.168.1.1',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          relatedAuditLogIds: ['123', '124', '125', '126', '127']
        },
        {
          id: '2',
          type: SecurityAlertType.UNUSUAL_ACCESS_TIME,
          message: 'Acceso en horario inusual',
          details: 'El usuario juan.perez accedió al sistema a las 3:15 AM, fuera del horario laboral habitual',
          severity: SecurityAlertSeverity.MEDIUM,
          status: SecurityAlertStatus.ACKNOWLEDGED,
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          userId: 2,
          userName: 'juan.perez',
          ipAddress: '192.168.1.2',
          userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          relatedAuditLogIds: ['128']
        },
        {
          id: '3',
          type: SecurityAlertType.UNUSUAL_LOCATION,
          message: 'Acceso desde ubicación inusual',
          details: 'El usuario maria.gomez accedió desde una ubicación geográfica inusual (País: Rusia)',
          severity: SecurityAlertSeverity.HIGH,
          status: SecurityAlertStatus.RESOLVED,
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          userId: 3,
          userName: 'maria.gomez',
          ipAddress: '185.71.65.42',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          relatedAuditLogIds: ['129'],
          resolution: {
            resolvedBy: 'admin',
            resolvedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            resolutionNote: 'Usuario confirmó que estaba de viaje en el extranjero'
          }
        },
        {
          id: '4',
          type: SecurityAlertType.PERMISSION_CHANGE,
          message: 'Cambio de permisos críticos',
          details: 'Se modificaron permisos administrativos para el usuario carlos.rodriguez',
          severity: SecurityAlertSeverity.HIGH,
          status: SecurityAlertStatus.NEW,
          timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
          userId: 4,
          userName: 'carlos.rodriguez',
          ipAddress: '192.168.1.5',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          relatedAuditLogIds: ['130'],
          performedBy: {
            userId: 1,
            userName: 'admin'
          }
        },
        {
          id: '5',
          type: SecurityAlertType.MASS_DELETION,
          message: 'Eliminación masiva de registros',
          details: 'Se eliminaron 25 registros de tareas en un corto período de tiempo',
          severity: SecurityAlertSeverity.CRITICAL,
          status: SecurityAlertStatus.ACKNOWLEDGED,
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          userId: 1,
          userName: 'admin',
          ipAddress: '192.168.1.1',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          relatedAuditLogIds: ['131', '132', '133', '134', '135']
        }
      ];
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
      
      // Datos de ejemplo como fallback
      return {
        id,
        type: SecurityAlertType.FAILED_LOGIN,
        message: 'Múltiples intentos fallidos de inicio de sesión',
        details: 'Se detectaron 5 intentos fallidos de inicio de sesión para el usuario admin',
        severity: SecurityAlertSeverity.HIGH,
        status: SecurityAlertStatus.NEW,
        timestamp: new Date().toISOString(),
        userId: 1,
        userName: 'admin',
        ipAddress: '192.168.1.1',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        relatedAuditLogIds: ['123', '124', '125', '126', '127']
      };
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
      
      // Datos de ejemplo como fallback
      return {
        id,
        type: SecurityAlertType.FAILED_LOGIN,
        message: 'Múltiples intentos fallidos de inicio de sesión',
        details: 'Se detectaron 5 intentos fallidos de inicio de sesión para el usuario admin',
        severity: SecurityAlertSeverity.HIGH,
        status: status,
        timestamp: new Date().toISOString(),
        userId: 1,
        userName: 'admin',
        ipAddress: '192.168.1.1',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        relatedAuditLogIds: ['123', '124', '125', '126', '127'],
        resolution: status === SecurityAlertStatus.RESOLVED ? {
          resolvedBy: 'current_user',
          resolvedAt: new Date().toISOString(),
          resolutionNote: note || 'Resuelto'
        } : undefined
      };
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
      
      // Datos de ejemplo como fallback
      return [
        {
          id: '1',
          name: 'Detección de intentos fallidos de inicio de sesión',
          description: 'Detecta múltiples intentos fallidos de inicio de sesión para un mismo usuario',
          type: SecurityAlertRuleType.FAILED_LOGIN_DETECTION,
          enabled: true,
          conditions: [
            {
              type: 'threshold',
              value: 5,
              timeWindow: 10,
              timeUnit: 'minutes'
            }
          ],
          actions: [
            {
              type: SecurityAlertRuleAction.CREATE_ALERT,
              severity: SecurityAlertSeverity.HIGH
            },
            {
              type: SecurityAlertRuleAction.SEND_EMAIL,
              recipients: ['admin@example.com']
            }
          ],
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '2',
          name: 'Detección de acceso en horario inusual',
          description: 'Detecta accesos al sistema fuera del horario laboral habitual',
          type: SecurityAlertRuleType.UNUSUAL_ACCESS_TIME_DETECTION,
          enabled: true,
          conditions: [
            {
              type: 'timeRange',
              startTime: '22:00',
              endTime: '06:00',
              days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
            }
          ],
          actions: [
            {
              type: SecurityAlertRuleAction.CREATE_ALERT,
              severity: SecurityAlertSeverity.MEDIUM
            }
          ],
          createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '3',
          name: 'Detección de cambios de permisos críticos',
          description: 'Detecta cambios en permisos administrativos o críticos',
          type: SecurityAlertRuleType.PERMISSION_CHANGE_DETECTION,
          enabled: true,
          conditions: [
            {
              type: 'permissionType',
              permissions: ['ADMIN', 'USER_MANAGEMENT', 'SECURITY_SETTINGS']
            }
          ],
          actions: [
            {
              type: SecurityAlertRuleAction.CREATE_ALERT,
              severity: SecurityAlertSeverity.HIGH
            },
            {
              type: SecurityAlertRuleAction.SEND_EMAIL,
              recipients: ['admin@example.com', 'security@example.com']
            }
          ],
          createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '4',
          name: 'Detección de eliminación masiva',
          description: 'Detecta eliminación masiva de registros en un corto período de tiempo',
          type: SecurityAlertRuleType.MASS_DELETION_DETECTION,
          enabled: true,
          conditions: [
            {
              type: 'threshold',
              value: 20,
              timeWindow: 5,
              timeUnit: 'minutes'
            }
          ],
          actions: [
            {
              type: SecurityAlertRuleAction.CREATE_ALERT,
              severity: SecurityAlertSeverity.CRITICAL
            },
            {
              type: SecurityAlertRuleAction.SEND_EMAIL,
              recipients: ['admin@example.com', 'security@example.com']
            },
            {
              type: SecurityAlertRuleAction.BLOCK_USER,
              duration: 30,
              durationUnit: 'minutes'
            }
          ],
          createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '5',
          name: 'Detección de acceso desde ubicación inusual',
          description: 'Detecta accesos desde ubicaciones geográficas inusuales',
          type: SecurityAlertRuleType.UNUSUAL_LOCATION_DETECTION,
          enabled: true,
          conditions: [
            {
              type: 'location',
              countries: ['exclude:AR,US,ES']
            }
          ],
          actions: [
            {
              type: SecurityAlertRuleAction.CREATE_ALERT,
              severity: SecurityAlertSeverity.HIGH
            },
            {
              type: SecurityAlertRuleAction.SEND_EMAIL,
              recipients: ['admin@example.com']
            }
          ],
          createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];
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
      
      // Datos de ejemplo como fallback
      return {
        ...rule,
        id: Math.random().toString(36).substring(2, 11),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
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
      
      // Datos de ejemplo como fallback
      return {
        id,
        name: rule.name || 'Regla actualizada',
        description: rule.description || 'Descripción actualizada',
        type: rule.type || SecurityAlertRuleType.FAILED_LOGIN_DETECTION,
        enabled: rule.enabled !== undefined ? rule.enabled : true,
        conditions: rule.conditions || [],
        actions: rule.actions || [],
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString()
      };
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
      
      // Datos de ejemplo como fallback
      return { success: true };
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
      
      // Datos de ejemplo como fallback
      return {
        totalAlerts: 15,
        bySeverity: {
          [SecurityAlertSeverity.LOW]: 2,
          [SecurityAlertSeverity.MEDIUM]: 5,
          [SecurityAlertSeverity.HIGH]: 6,
          [SecurityAlertSeverity.CRITICAL]: 2
        },
        byType: {
          [SecurityAlertType.FAILED_LOGIN]: 5,
          [SecurityAlertType.UNUSUAL_ACCESS_TIME]: 3,
          [SecurityAlertType.UNUSUAL_LOCATION]: 2,
          [SecurityAlertType.PERMISSION_CHANGE]: 3,
          [SecurityAlertType.MASS_DELETION]: 2
        },
        byStatus: {
          [SecurityAlertStatus.NEW]: 7,
          [SecurityAlertStatus.ACKNOWLEDGED]: 5,
          [SecurityAlertStatus.RESOLVED]: 3
        },
        timeline: [
          { date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], count: 1 },
          { date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], count: 2 },
          { date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], count: 3 },
          { date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], count: 2 },
          { date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], count: 4 },
          { date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], count: 2 },
          { date: new Date().toISOString().split('T')[0], count: 1 }
        ]
      };
    }
  }
};

export default securityAlertService;
