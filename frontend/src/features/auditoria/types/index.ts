/**
 * Tipos de acciones de auditoría
 */
export enum AuditActionType {
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  CREATE = 'CREATE',
  READ = 'READ',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  STATUS_CHANGE = 'STATUS_CHANGE',
  ASSIGN = 'ASSIGN',
  REASSIGN = 'REASSIGN',
  APPROVE = 'APPROVE',
  REJECT = 'REJECT',
  DOWNLOAD = 'DOWNLOAD',
  UPLOAD = 'UPLOAD',
  EXPORT = 'EXPORT',
  IMPORT = 'IMPORT',
  PERMISSION_CHANGE = 'PERMISSION_CHANGE',
  CONFIGURATION = 'CONFIGURATION',
  EXECUTE = 'EXECUTE',
  NOTIFICATION = 'NOTIFICATION',
  COMMENT = 'COMMENT',
  SEARCH = 'SEARCH',
  REPORT_VIEW = 'REPORT_VIEW',
  REPORT_GENERATE = 'REPORT_GENERATE',
  OTHER = 'OTHER'
}

/**
 * Resultados de acciones de auditoría
 */
export enum AuditResult {
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  DENIED = 'DENIED',
  CANCELLED = 'CANCELLED',
  IN_PROGRESS = 'IN_PROGRESS',
  TIMEOUT = 'TIMEOUT',
  PARTIAL = 'PARTIAL',
  UNKNOWN = 'UNKNOWN'
}

/**
 * Interfaz para un registro de auditoría
 */
export interface UserAuditLog {
  id: number;
  userId: number;
  username: string;
  userFullName: string;
  actionType: AuditActionType;
  actionTypeDisplay: string;
  entityType: string;
  entityId: string;
  description: string;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
  result: AuditResult;
  resultDisplay: string;
  details: Record<string, string>;
  oldValues: Record<string, string>;
  newValues: Record<string, string>;
  suspicious: boolean;
  suspiciousReason: string;
  module: string;
  sessionId: string;
}

/**
 * Interfaz para la respuesta paginada de registros de auditoría
 */
export interface UserAuditLogResponse {
  content: UserAuditLog[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

/**
 * Interfaz para los filtros de búsqueda de registros de auditoría
 */
export interface AuditLogFilters {
  userId?: number;
  username?: string;
  actionType?: AuditActionType;
  entityType?: string;
  entityId?: string;
  result?: AuditResult;
  startDate?: string;
  endDate?: string;
  suspicious?: boolean;
  module?: string;
  page: number;
  size: number;
}

/**
 * Interfaz para marcar un registro como sospechoso
 */
export interface MarkAsSuspiciousRequest {
  reason: string;
}

/**
 * Interfaz para las estadísticas de auditoría
 */
export interface AuditStats {
  totalLogs: number;
  suspiciousLogs: number;
  byActionType: Record<string, number>;
  byResult?: Record<string, number>;
  byModule?: Record<string, number>;
  byUser?: Record<string, number>;
  byDate?: Record<string, number>;
}
