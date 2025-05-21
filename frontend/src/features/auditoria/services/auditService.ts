import api from '@/utils/api-ky';
import { 
  AuditLogFilters, 
  UserAuditLog, 
  UserAuditLogResponse, 
  MarkAsSuspiciousRequest,
  AuditStats
} from '../types';

/**
 * Servicio para interactuar con la API de auditoría
 */
const auditService = {
  /**
   * Busca registros de auditoría con filtros
   * @param filters Filtros de búsqueda
   * @returns Respuesta paginada con registros de auditoría
   */
  async searchAuditLogs(filters: AuditLogFilters): Promise<UserAuditLogResponse> {
    // Construir parámetros de consulta
    const params = new URLSearchParams();
    
    if (filters.userId) params.append('userId', filters.userId.toString());
    if (filters.username) params.append('username', filters.username);
    if (filters.actionType) params.append('actionType', filters.actionType);
    if (filters.entityType) params.append('entityType', filters.entityType);
    if (filters.entityId) params.append('entityId', filters.entityId);
    if (filters.result) params.append('result', filters.result);
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    if (filters.suspicious !== undefined) params.append('suspicious', filters.suspicious.toString());
    if (filters.module) params.append('module', filters.module);
    
    params.append('page', filters.page.toString());
    params.append('size', filters.size.toString());
    
    try {
      const response = await api.get(`audit?${params.toString()}`).json<UserAuditLogResponse>();
      return response;
    } catch (error) {
      console.error('Error al buscar registros de auditoría:', error);
      throw error;
    }
  },
  
  /**
   * Obtiene un registro de auditoría por su ID
   * @param id ID del registro de auditoría
   * @returns Registro de auditoría
   */
  async getAuditLogById(id: number): Promise<UserAuditLog> {
    try {
      const response = await api.get(`audit/${id}`).json<UserAuditLog>();
      return response;
    } catch (error) {
      console.error(`Error al obtener registro de auditoría con ID ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Marca un registro de auditoría como sospechoso
   * @param id ID del registro de auditoría
   * @param reason Razón por la que se marca como sospechoso
   * @returns Registro de auditoría actualizado
   */
  async markAsSuspicious(id: number, reason: string): Promise<UserAuditLog> {
    try {
      const request: MarkAsSuspiciousRequest = { reason };
      const response = await api.post(`audit/${id}/mark-suspicious`, {
        json: request
      }).json<UserAuditLog>();
      return response;
    } catch (error) {
      console.error(`Error al marcar registro de auditoría con ID ${id} como sospechoso:`, error);
      throw error;
    }
  },
  
  /**
   * Obtiene estadísticas de auditoría
   * @param startDate Fecha de inicio
   * @param endDate Fecha de fin
   * @returns Estadísticas de auditoría
   */
  async getAuditStats(startDate: string, endDate: string): Promise<AuditStats> {
    try {
      const params = new URLSearchParams();
      params.append('startDate', startDate);
      params.append('endDate', endDate);
      
      const response = await api.get(`audit/stats?${params.toString()}`).json<AuditStats>();
      return response;
    } catch (error) {
      console.error('Error al obtener estadísticas de auditoría:', error);
      throw error;
    }
  },
  
  /**
   * Exporta registros de auditoría a CSV
   * @param filters Filtros de búsqueda
   * @returns Blob con el archivo CSV
   */
  async exportAuditLogs(filters: Omit<AuditLogFilters, 'page' | 'size'>): Promise<Blob> {
    // Construir parámetros de consulta
    const params = new URLSearchParams();
    
    if (filters.userId) params.append('userId', filters.userId.toString());
    if (filters.username) params.append('username', filters.username);
    if (filters.actionType) params.append('actionType', filters.actionType);
    if (filters.entityType) params.append('entityType', filters.entityType);
    if (filters.entityId) params.append('entityId', filters.entityId);
    if (filters.result) params.append('result', filters.result);
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    if (filters.suspicious !== undefined) params.append('suspicious', filters.suspicious.toString());
    if (filters.module) params.append('module', filters.module);
    
    try {
      const response = await api.get(`audit/export?${params.toString()}`).blob();
      return response;
    } catch (error) {
      console.error('Error al exportar registros de auditoría:', error);
      throw error;
    }
  }
};

export default auditService;
