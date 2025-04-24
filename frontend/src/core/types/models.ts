/**
 * Enumeración de tipos de actividad.
 * Define los diferentes tipos de actividades que pueden ser registradas en el sistema.
 *
 * @enum {string}
 */
export enum ActivityType {
  /** Reunión con una o más personas */
  REUNION = 'REUNION',
  /** Audiencia formal, generalmente en un contexto legal */
  AUDIENCIA = 'AUDIENCIA',
  /** Entrevista con una persona */
  ENTREVISTA = 'ENTREVISTA',
  /** Actividad de investigación o análisis */
  INVESTIGACION = 'INVESTIGACION',
  /** Elaboración de un dictamen */
  DICTAMEN = 'DICTAMEN',
  /** Elaboración de un informe */
  INFORME = 'INFORME',
  /** Otro tipo de actividad no categorizada */
  OTRO = 'OTRO'
}

/**
 * Enumeración de estados de actividad.
 * Define los diferentes estados en los que puede encontrarse una actividad.
 *
 * @enum {string}
 */
export enum ActivityStatus {
  /** Actividad pendiente de iniciar */
  PENDIENTE = 'PENDIENTE',
  /** Actividad en curso o desarrollo */
  EN_PROGRESO = 'EN_PROGRESO',
  /** Actividad finalizada con éxito */
  COMPLETADA = 'COMPLETADA',
  /** Actividad cancelada antes de su finalización */
  CANCELADA = 'CANCELADA',
  /** Actividad archivada (completada y guardada para referencia) */
  ARCHIVADA = 'ARCHIVADA'
}

/**
 * Enumeración de roles de usuario.
 * Define los diferentes roles que puede tener un usuario en el sistema,
 * cada uno con diferentes niveles de permisos y acceso.
 *
 * @enum {string}
 */
export enum UserRole {
  /** Administrador con acceso completo al sistema */
  ADMIN = 'ADMIN',
  /** Supervisor con capacidad de gestión y supervisión */
  SUPERVISOR = 'SUPERVISOR',
  /** Usuario estándar con acceso básico */
  USUARIO = 'USUARIO',
  /** Usuario con permisos de solo lectura */
  CONSULTA = 'CONSULTA'
}

/**
 * Interfaz para el modelo de Usuario.
 * Define la estructura de datos de un usuario en el sistema.
 *
 * @interface User
 * @property {number} id - Identificador único del usuario
 * @property {string} username - Nombre de usuario para login
 * @property {string} email - Correo electrónico del usuario
 * @property {string} firstName - Nombre del usuario
 * @property {string} lastName - Apellido del usuario
 * @property {string} fullName - Nombre completo (generalmente firstName + lastName)
 * @property {UserRole} role - Rol del usuario en el sistema
 * @property {string} [position] - Cargo o posición del usuario (opcional)
 * @property {string} [department] - Departamento al que pertenece (opcional)
 * @property {boolean} active - Indica si el usuario está activo
 * @property {string} createdAt - Fecha de creación en formato ISO
 * @property {string} updatedAt - Fecha de última actualización en formato ISO
 * @property {string[]} permissions - Lista de permisos específicos
 * @property {string} [token] - Token JWT de autenticación (opcional)
 * @property {string} [tokenType] - Tipo de token (ej: 'Bearer') (opcional)
 */
export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  role: UserRole;
  position?: string;
  department?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  permissions: string[];
  token?: string;
  tokenType?: string;
}

/**
 * Interfaz para el modelo de Actividad.
 * Define la estructura de datos de una actividad en el sistema.
 *
 * @interface Activity
 * @property {number} id - Identificador único de la actividad
 * @property {string} date - Fecha de la actividad en formato ISO
 * @property {ActivityType} type - Tipo de actividad
 * @property {string} description - Descripción detallada de la actividad
 * @property {string} [person] - Persona relacionada con la actividad (opcional)
 * @property {string} [role] - Rol de la persona relacionada (opcional)
 * @property {string} [dependency] - Dependencia o entidad relacionada (opcional)
 * @property {string} [situation] - Situación o contexto de la actividad (opcional)
 * @property {string} [result] - Resultado o conclusión de la actividad (opcional)
 * @property {ActivityStatus} status - Estado actual de la actividad
 * @property {string} [lastStatusChangeDate] - Fecha del último cambio de estado (opcional)
 * @property {string} [comments] - Comentarios adicionales (opcional)
 * @property {string} [agent] - Agente o responsable de la actividad (opcional)
 * @property {string} createdAt - Fecha de creación en formato ISO
 * @property {string} updatedAt - Fecha de última actualización en formato ISO
 * @property {number} userId - ID del usuario que creó la actividad
 */
export interface Activity {
  id: number;
  date: string;
  type: ActivityType;
  description: string;
  person?: string;
  role?: string;
  dependency?: string;
  situation?: string;
  result?: string;
  status: ActivityStatus;
  lastStatusChangeDate?: string;
  comments?: string;
  agent?: string;
  createdAt: string;
  updatedAt: string;
  userId: number;
}

/**
 * Interfaz para la paginación
 */
export interface Pagination {
  page: number;
  size: number;
  totalCount: number;
  totalPages: number;
}

/**
 * Interfaz para las notificaciones
 */
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  duration?: number;
  createdAt: number;
}

/**
 * Tipo para las notificaciones toast
 */
export type ToastType = 'success' | 'error' | 'warning' | 'info';

/**
 * Interfaz para las notificaciones en tiempo real
 */
export interface RealTimeNotification {
  id: string;
  userId: number;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
  link?: string;
  actionType?: string;
  entityId?: number;
  entityType?: string;
}

/**
 * Interfaz para las sesiones activas
 */
export interface Session {
  id: string;
  userId: number;
  deviceInfo: string;
  ipAddress: string;
  lastActive: string;
  createdAt: string;
  current: boolean;
}

/**
 * Interfaz para las plantillas de actividades
 */
export interface ActivityTemplate {
  id: number;
  name: string;
  description: string;
  type: ActivityType;
  fields: TemplateField[];
  createdAt: string;
  updatedAt: string;
  userId: number;
}

/**
 * Interfaz para los campos de plantillas
 */
export interface TemplateField {
  id: number;
  name: string;
  type: string;
  required: boolean;
  defaultValue?: string;
  options?: string[];
  templateId: number;
}

/**
 * Interfaz para los filtros de actividades
 */
export interface ActivityFilters {
  status?: ActivityStatus[];
  type?: ActivityType[];
  startDate?: string;
  endDate?: string;
  search?: string;
  person?: string;
  dependency?: string;
  agent?: string;
  page?: number;
  size?: number;
  sort?: string;
}

/**
 * Interfaz para los filtros guardados
 */
export interface SavedFilter {
  id: number;
  name: string;
  filters: ActivityFilters;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Interfaz para las preferencias de usuario
 */
export interface UserPreferences {
  id: number;
  userId: number;
  theme: 'light' | 'dark';
  language: string;
  notificationsEnabled: boolean;
  emailNotificationsEnabled: boolean;
  defaultView: 'list' | 'grid' | 'calendar';
  defaultActivitySort: string;
  defaultActivityFilter: ActivityFilters;
  createdAt: string;
  updatedAt: string;
}
