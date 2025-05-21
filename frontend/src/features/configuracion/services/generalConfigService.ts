import api from '@/utils/api-ky';

/**
 * Interfaz para la configuración de rendimiento
 */
export interface PerformanceConfig {
  cacheEnabled: boolean;
  cacheTTL: number; // Tiempo de vida de la caché en segundos
  prefetchEnabled: boolean;
  compressionEnabled: boolean;
  maxConcurrentRequests: number;
  requestTimeout: number; // Tiempo de espera para solicitudes en milisegundos
}

/**
 * Interfaz para la configuración de seguridad
 */
export interface SecurityConfig {
  sessionTimeout: number; // Tiempo de inactividad antes de cerrar sesión en minutos
  maxLoginAttempts: number;
  passwordPolicy: {
    minLength: number;
    requireUppercase: boolean;
    requireLowercase: boolean;
    requireNumbers: boolean;
    requireSpecialChars: boolean;
    expirationDays: number; // 0 = nunca expira
  };
  twoFactorAuthEnabled: boolean;
  ipWhitelist: string[];
}

/**
 * Interfaz para la configuración de correo electrónico
 */
export interface EmailConfig {
  smtpServer: string;
  smtpPort: number;
  smtpUsername: string;
  smtpPassword: string;
  smtpSecure: boolean;
  defaultSender: string;
  defaultReplyTo: string;
  emailSignature: string;
  emailTemplatesEnabled: boolean;
}

/**
 * Interfaz para la configuración general del sistema
 */
export interface GeneralConfig {
  performance: PerformanceConfig;
  security: SecurityConfig;
  email: EmailConfig;
  maintenance: {
    enabled: boolean;
    message: string;
    plannedEndTime: string | null;
  };
  features: {
    [key: string]: boolean;
  };
}

/**
 * Servicio para la gestión de la configuración general del sistema
 */
const generalConfigService = {
  /**
   * Obtiene la configuración general del sistema
   * @returns Configuración general
   */
  async getGeneralConfig(): Promise<GeneralConfig> {
    try {
      const response = await api.get('system/config').json();
      return response as GeneralConfig;
    } catch (error) {
      console.error('Error al obtener la configuración general:', error);
      
      // Devolver configuración predeterminada como fallback
      return {
        performance: {
          cacheEnabled: true,
          cacheTTL: 3600,
          prefetchEnabled: true,
          compressionEnabled: true,
          maxConcurrentRequests: 6,
          requestTimeout: 30000
        },
        security: {
          sessionTimeout: 30,
          maxLoginAttempts: 5,
          passwordPolicy: {
            minLength: 8,
            requireUppercase: true,
            requireLowercase: true,
            requireNumbers: true,
            requireSpecialChars: true,
            expirationDays: 90
          },
          twoFactorAuthEnabled: false,
          ipWhitelist: []
        },
        email: {
          smtpServer: 'smtp.example.com',
          smtpPort: 587,
          smtpUsername: 'user@example.com',
          smtpPassword: '********',
          smtpSecure: true,
          defaultSender: 'noreply@example.com',
          defaultReplyTo: 'support@example.com',
          emailSignature: 'Equipo de Soporte',
          emailTemplatesEnabled: true
        },
        maintenance: {
          enabled: false,
          message: 'El sistema está en mantenimiento. Por favor, inténtelo más tarde.',
          plannedEndTime: null
        },
        features: {
          taskComments: true,
          fileAttachments: true,
          realTimeNotifications: true,
          taskHistory: true,
          userAudit: true
        }
      };
    }
  },

  /**
   * Actualiza la configuración de rendimiento
   * @param config Configuración de rendimiento
   * @returns Configuración actualizada
   */
  async updatePerformanceConfig(config: PerformanceConfig): Promise<PerformanceConfig> {
    try {
      const response = await api.put('system/config/performance', {
        json: config
      }).json();
      return response as PerformanceConfig;
    } catch (error) {
      console.error('Error al actualizar la configuración de rendimiento:', error);
      throw new Error('Error al actualizar la configuración de rendimiento');
    }
  },

  /**
   * Actualiza la configuración de seguridad
   * @param config Configuración de seguridad
   * @returns Configuración actualizada
   */
  async updateSecurityConfig(config: SecurityConfig): Promise<SecurityConfig> {
    try {
      const response = await api.put('system/config/security', {
        json: config
      }).json();
      return response as SecurityConfig;
    } catch (error) {
      console.error('Error al actualizar la configuración de seguridad:', error);
      throw new Error('Error al actualizar la configuración de seguridad');
    }
  },

  /**
   * Actualiza la configuración de correo electrónico
   * @param config Configuración de correo electrónico
   * @returns Configuración actualizada
   */
  async updateEmailConfig(config: EmailConfig): Promise<EmailConfig> {
    try {
      const response = await api.put('system/config/email', {
        json: config
      }).json();
      return response as EmailConfig;
    } catch (error) {
      console.error('Error al actualizar la configuración de correo electrónico:', error);
      throw new Error('Error al actualizar la configuración de correo electrónico');
    }
  },

  /**
   * Actualiza la configuración de mantenimiento
   * @param config Configuración de mantenimiento
   * @returns Configuración actualizada
   */
  async updateMaintenanceConfig(config: { enabled: boolean; message: string; plannedEndTime: string | null }): Promise<{ enabled: boolean; message: string; plannedEndTime: string | null }> {
    try {
      const response = await api.put('system/config/maintenance', {
        json: config
      }).json();
      return response as { enabled: boolean; message: string; plannedEndTime: string | null };
    } catch (error) {
      console.error('Error al actualizar la configuración de mantenimiento:', error);
      throw new Error('Error al actualizar la configuración de mantenimiento');
    }
  },

  /**
   * Actualiza la configuración de características
   * @param features Configuración de características
   * @returns Configuración actualizada
   */
  async updateFeaturesConfig(features: { [key: string]: boolean }): Promise<{ [key: string]: boolean }> {
    try {
      const response = await api.put('system/config/features', {
        json: features
      }).json();
      return response as { [key: string]: boolean };
    } catch (error) {
      console.error('Error al actualizar la configuración de características:', error);
      throw new Error('Error al actualizar la configuración de características');
    }
  },

  /**
   * Prueba la configuración de correo electrónico
   * @param email Correo electrónico de prueba
   * @returns Resultado de la prueba
   */
  async testEmailConfig(email: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.post('system/config/email/test', {
        json: { email }
      }).json();
      return response as { success: boolean; message: string };
    } catch (error) {
      console.error('Error al probar la configuración de correo electrónico:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  },

  /**
   * Limpia la caché del sistema
   * @returns Resultado de la operación
   */
  async clearCache(): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.post('system/cache/clear').json();
      return response as { success: boolean; message: string };
    } catch (error) {
      console.error('Error al limpiar la caché:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }
};

export default generalConfigService;
