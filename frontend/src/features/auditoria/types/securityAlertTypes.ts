/**
 * Tipos de alertas de seguridad
 */
export enum SecurityAlertType {
  FAILED_LOGIN = 'FAILED_LOGIN',
  UNUSUAL_ACCESS_TIME = 'UNUSUAL_ACCESS_TIME',
  UNUSUAL_LOCATION = 'UNUSUAL_LOCATION',
  PERMISSION_CHANGE = 'PERMISSION_CHANGE',
  MASS_DELETION = 'MASS_DELETION',
  SUSPICIOUS_ACTIVITY = 'SUSPICIOUS_ACTIVITY',
  BRUTE_FORCE_ATTACK = 'BRUTE_FORCE_ATTACK',
  ACCOUNT_LOCKOUT = 'ACCOUNT_LOCKOUT',
  PASSWORD_CHANGE = 'PASSWORD_CHANGE',
  ADMIN_ACTION = 'ADMIN_ACTION'
}

/**
 * Severidad de las alertas de seguridad
 */
export enum SecurityAlertSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

/**
 * Estado de las alertas de seguridad
 */
export enum SecurityAlertStatus {
  NEW = 'NEW',
  ACKNOWLEDGED = 'ACKNOWLEDGED',
  RESOLVED = 'RESOLVED',
  FALSE_POSITIVE = 'FALSE_POSITIVE'
}

/**
 * Información sobre quién realizó una acción
 */
export interface PerformedBy {
  userId: number;
  userName: string;
}

/**
 * Información sobre la resolución de una alerta
 */
export interface AlertResolution {
  resolvedBy: string;
  resolvedAt: string;
  resolutionNote?: string;
}

/**
 * Alerta de seguridad
 */
export interface SecurityAlert {
  id: string;
  type: SecurityAlertType;
  message: string;
  details: string;
  severity: SecurityAlertSeverity;
  status: SecurityAlertStatus;
  timestamp: string;
  userId: number;
  userName: string;
  ipAddress?: string;
  userAgent?: string;
  relatedAuditLogIds?: string[];
  performedBy?: PerformedBy;
  resolution?: AlertResolution;
}

/**
 * Filtros para las alertas de seguridad
 */
export interface SecurityAlertFilter {
  status?: SecurityAlertStatus;
  severity?: SecurityAlertSeverity;
  type?: SecurityAlertType;
  userId?: number;
  startDate?: string;
  endDate?: string;
}

/**
 * Tipos de reglas de alertas de seguridad
 */
export enum SecurityAlertRuleType {
  FAILED_LOGIN_DETECTION = 'FAILED_LOGIN_DETECTION',
  UNUSUAL_ACCESS_TIME_DETECTION = 'UNUSUAL_ACCESS_TIME_DETECTION',
  UNUSUAL_LOCATION_DETECTION = 'UNUSUAL_LOCATION_DETECTION',
  PERMISSION_CHANGE_DETECTION = 'PERMISSION_CHANGE_DETECTION',
  MASS_DELETION_DETECTION = 'MASS_DELETION_DETECTION',
  SUSPICIOUS_ACTIVITY_DETECTION = 'SUSPICIOUS_ACTIVITY_DETECTION',
  BRUTE_FORCE_DETECTION = 'BRUTE_FORCE_DETECTION',
  CUSTOM = 'CUSTOM'
}

/**
 * Acciones para las reglas de alertas de seguridad
 */
export enum SecurityAlertRuleAction {
  CREATE_ALERT = 'CREATE_ALERT',
  SEND_EMAIL = 'SEND_EMAIL',
  BLOCK_USER = 'BLOCK_USER',
  LOCK_ACCOUNT = 'LOCK_ACCOUNT',
  REQUIRE_PASSWORD_CHANGE = 'REQUIRE_PASSWORD_CHANGE',
  CUSTOM_ACTION = 'CUSTOM_ACTION'
}

/**
 * Unidades de tiempo para las condiciones de las reglas
 */
export type TimeUnit = 'seconds' | 'minutes' | 'hours' | 'days';

/**
 * Unidades de tiempo para las acciones de las reglas
 */
export type DurationUnit = 'minutes' | 'hours' | 'days';

/**
 * Días de la semana
 */
export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

/**
 * Condición de umbral para las reglas
 */
export interface ThresholdCondition {
  type: 'threshold';
  value: number;
  timeWindow: number;
  timeUnit: TimeUnit;
}

/**
 * Condición de rango de tiempo para las reglas
 */
export interface TimeRangeCondition {
  type: 'timeRange';
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  days?: DayOfWeek[];
}

/**
 * Condición de ubicación para las reglas
 */
export interface LocationCondition {
  type: 'location';
  countries: string[]; // ISO country codes, can be prefixed with 'exclude:' to exclude countries
  ipRanges?: string[]; // CIDR notation
}

/**
 * Condición de tipo de permiso para las reglas
 */
export interface PermissionTypeCondition {
  type: 'permissionType';
  permissions: string[];
}

/**
 * Condición personalizada para las reglas
 */
export interface CustomCondition {
  type: 'custom';
  expression: string;
}

/**
 * Condición para las reglas de alertas de seguridad
 */
export type SecurityAlertRuleCondition = 
  | ThresholdCondition 
  | TimeRangeCondition 
  | LocationCondition 
  | PermissionTypeCondition 
  | CustomCondition;

/**
 * Acción de crear alerta
 */
export interface CreateAlertAction {
  type: SecurityAlertRuleAction.CREATE_ALERT;
  severity: SecurityAlertSeverity;
}

/**
 * Acción de enviar email
 */
export interface SendEmailAction {
  type: SecurityAlertRuleAction.SEND_EMAIL;
  recipients: string[];
  template?: string;
}

/**
 * Acción de bloquear usuario
 */
export interface BlockUserAction {
  type: SecurityAlertRuleAction.BLOCK_USER;
  duration: number;
  durationUnit: DurationUnit;
}

/**
 * Acción de bloquear cuenta
 */
export interface LockAccountAction {
  type: SecurityAlertRuleAction.LOCK_ACCOUNT;
  duration?: number;
  durationUnit?: DurationUnit;
  requireAdminUnlock?: boolean;
}

/**
 * Acción de requerir cambio de contraseña
 */
export interface RequirePasswordChangeAction {
  type: SecurityAlertRuleAction.REQUIRE_PASSWORD_CHANGE;
  message?: string;
}

/**
 * Acción personalizada
 */
export interface CustomAction {
  type: SecurityAlertRuleAction.CUSTOM_ACTION;
  actionId: string;
  parameters?: Record<string, any>;
}

/**
 * Acción para las reglas de alertas de seguridad
 */
export type SecurityAlertRuleActionConfig = 
  | CreateAlertAction 
  | SendEmailAction 
  | BlockUserAction 
  | LockAccountAction 
  | RequirePasswordChangeAction 
  | CustomAction;

/**
 * Regla de alerta de seguridad
 */
export interface SecurityAlertRule {
  id: string;
  name: string;
  description: string;
  type: SecurityAlertRuleType;
  enabled: boolean;
  conditions: SecurityAlertRuleCondition[];
  actions: SecurityAlertRuleActionConfig[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Estadísticas de alertas de seguridad
 */
export interface SecurityAlertStatistics {
  totalAlerts: number;
  bySeverity: Record<SecurityAlertSeverity, number>;
  byType: Record<SecurityAlertType, number>;
  byStatus: Record<SecurityAlertStatus, number>;
  timeline: Array<{ date: string; count: number }>;
}

/**
 * Notificación de alerta de seguridad
 */
export interface SecurityAlertNotification {
  id: string;
  alertId: string;
  alertType: SecurityAlertType;
  alertSeverity: SecurityAlertSeverity;
  message: string;
  timestamp: string;
  read: boolean;
}

/**
 * Preferencias de notificación de alertas de seguridad
 */
export interface SecurityAlertNotificationPreferences {
  email: boolean;
  inApp: boolean;
  severityThreshold: SecurityAlertSeverity;
  emailRecipients?: string[];
}
