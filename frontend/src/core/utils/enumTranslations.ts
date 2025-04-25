import { ActivityStatus, ActivityType } from '@/core/types/models';

/**
 * Traducciones para los valores de enumeración ActivityStatus
 */
export const activityStatusTranslations: Record<ActivityStatus, string> = {
  [ActivityStatus.PENDIENTE]: 'Pendiente',
  [ActivityStatus.EN_PROGRESO]: 'En progreso',
  [ActivityStatus.COMPLETADA]: 'Completada',
  [ActivityStatus.CANCELADA]: 'Cancelada',
  [ActivityStatus.ARCHIVADA]: 'Archivada',
};

/**
 * Traducciones para los valores de enumeración ActivityType
 */
export const activityTypeTranslations: Record<ActivityType, string> = {
  [ActivityType.REUNION]: 'Reunión',
  [ActivityType.AUDIENCIA]: 'Audiencia',
  [ActivityType.ENTREVISTA]: 'Entrevista',
  [ActivityType.INVESTIGACION]: 'Investigación',
  [ActivityType.DICTAMEN]: 'Dictamen',
  [ActivityType.INFORME]: 'Informe',
  [ActivityType.OTRO]: 'Otro',
};

/**
 * Obtiene la traducción para un valor de ActivityStatus
 * @param status El valor de ActivityStatus
 * @returns La traducción correspondiente
 */
export const getActivityStatusTranslation = (status: ActivityStatus): string => {
  return activityStatusTranslations[status] || status;
};

/**
 * Obtiene la traducción para un valor de ActivityType
 * @param type El valor de ActivityType
 * @returns La traducción correspondiente
 */
export const getActivityTypeTranslation = (type: ActivityType): string => {
  return activityTypeTranslations[type] || type;
};

/**
 * Obtiene el color asociado a un estado de actividad
 * @param status El valor de ActivityStatus
 * @returns El nombre de la variable de color en el tema
 */
export const getActivityStatusColor = (status: ActivityStatus): string => {
  switch (status) {
    case ActivityStatus.PENDIENTE:
      return 'info';
    case ActivityStatus.EN_PROGRESO:
      return 'warning';
    case ActivityStatus.COMPLETADA:
      return 'success';
    case ActivityStatus.CANCELADA:
      return 'error';
    case ActivityStatus.ARCHIVADA:
      return 'textTertiary';
    default:
      return 'textSecondary';
  }
};

/**
 * Obtiene el color asociado a un tipo de actividad
 * @param type El valor de ActivityType
 * @returns El nombre de la variable de color en el tema
 */
export const getActivityTypeColor = (type: ActivityType): string => {
  switch (type) {
    case ActivityType.REUNION:
      return 'primary';
    case ActivityType.AUDIENCIA:
      return 'secondary';
    case ActivityType.ENTREVISTA:
      return 'info';
    case ActivityType.INVESTIGACION:
      return 'warning';
    case ActivityType.DICTAMEN:
      return 'success';
    case ActivityType.INFORME:
      return 'primary';
    case ActivityType.OTRO:
    default:
      return 'textSecondary';
  }
};

/**
 * Obtiene el texto de visualización para un estado de actividad
 * @param status El valor del estado
 * @returns El texto de visualización en español
 */
export const getStatusDisplay = (status: string | ActivityStatus | undefined): string => {
  if (!status) return 'Pendiente'; // Valor por defecto

  // Convertir a string por si acaso
  const statusStr = String(status).toUpperCase();

  // Buscar en las traducciones
  if (statusStr in activityStatusTranslations) {
    return activityStatusTranslations[statusStr as ActivityStatus];
  }

  // Si no se encuentra, devolver el valor original
  return String(status);
};

/**
 * Obtiene el texto de visualización para un tipo de actividad
 * @param type El valor del tipo
 * @returns El texto de visualización en español
 */
export const getTypeDisplay = (type: string | ActivityType | undefined): string => {
  if (!type) return 'Otro'; // Valor por defecto

  // Convertir a string por si acaso
  const typeStr = String(type).toUpperCase();

  // Buscar en las traducciones
  if (typeStr in activityTypeTranslations) {
    return activityTypeTranslations[typeStr as ActivityType];
  }

  // Si no se encuentra, devolver el valor original
  return String(type);
};
