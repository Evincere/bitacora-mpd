/**
 * Archivo de constantes y utilidades para manejar la traducción entre
 * valores de enumeración del backend (en inglés) y valores de visualización (en español)
 */

// Constantes para estados de actividades
export const ACTIVITY_STATUS = {
  // Valores del backend (en inglés)
  PENDING: 'PENDING',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELED: 'CANCELED',
  ARCHIVED: 'ARCHIVED',
  
  // Alias para compatibilidad con el backend actual
  PENDIENTE: 'PENDIENTE',
  EN_PROGRESO: 'EN_PROGRESO',
  COMPLETADA: 'COMPLETADA',
  CANCELADA: 'CANCELADA',
  ARCHIVADA: 'ARCHIVADA',
};

// Constantes para tipos de actividades
export const ACTIVITY_TYPE = {
  // Valores del backend (en inglés)
  MEETING: 'MEETING',
  HEARING: 'HEARING',
  INTERVIEW: 'INTERVIEW',
  RESEARCH: 'RESEARCH',
  REPORT: 'REPORT',
  OPINION: 'OPINION',
  OTHER: 'OTHER',
  
  // Alias para compatibilidad con el backend actual
  REUNION: 'REUNION',
  AUDIENCIA: 'AUDIENCIA',
  ENTREVISTA: 'ENTREVISTA',
  INVESTIGACION: 'INVESTIGACION',
  INFORME: 'INFORME',
  DICTAMEN: 'DICTAMEN',
  OTRO: 'OTRO',
};

// Mapeo de valores del backend a textos de visualización en español
export const STATUS_DISPLAY_MAP = {
  // Valores en inglés
  [ACTIVITY_STATUS.PENDING]: 'Pendiente',
  [ACTIVITY_STATUS.IN_PROGRESS]: 'En progreso',
  [ACTIVITY_STATUS.COMPLETED]: 'Completado',
  [ACTIVITY_STATUS.CANCELED]: 'Cancelado',
  [ACTIVITY_STATUS.ARCHIVED]: 'Archivado',
  
  // Valores actuales del backend (en español)
  [ACTIVITY_STATUS.PENDIENTE]: 'Pendiente',
  [ACTIVITY_STATUS.EN_PROGRESO]: 'En progreso',
  [ACTIVITY_STATUS.COMPLETADA]: 'Completado',
  [ACTIVITY_STATUS.CANCELADA]: 'Cancelado',
  [ACTIVITY_STATUS.ARCHIVADA]: 'Archivado',
};

export const TYPE_DISPLAY_MAP = {
  // Valores en inglés
  [ACTIVITY_TYPE.MEETING]: 'Reunión',
  [ACTIVITY_TYPE.HEARING]: 'Audiencia',
  [ACTIVITY_TYPE.INTERVIEW]: 'Entrevista',
  [ACTIVITY_TYPE.RESEARCH]: 'Investigación',
  [ACTIVITY_TYPE.REPORT]: 'Informe',
  [ACTIVITY_TYPE.OPINION]: 'Dictamen',
  [ACTIVITY_TYPE.OTHER]: 'Otro',
  
  // Valores actuales del backend (en español)
  [ACTIVITY_TYPE.REUNION]: 'Reunión',
  [ACTIVITY_TYPE.AUDIENCIA]: 'Audiencia',
  [ACTIVITY_TYPE.ENTREVISTA]: 'Entrevista',
  [ACTIVITY_TYPE.INVESTIGACION]: 'Investigación',
  [ACTIVITY_TYPE.INFORME]: 'Informe',
  [ACTIVITY_TYPE.DICTAMEN]: 'Dictamen',
  [ACTIVITY_TYPE.OTRO]: 'Otro',
};

// Mapeo inverso (de visualización a valores del backend)
export const STATUS_VALUE_MAP = Object.entries(STATUS_DISPLAY_MAP).reduce((acc, [key, value]) => {
  acc[value] = key;
  return acc;
}, {});

export const TYPE_VALUE_MAP = Object.entries(TYPE_DISPLAY_MAP).reduce((acc, [key, value]) => {
  acc[value] = key;
  return acc;
}, {});

/**
 * Obtiene el texto de visualización para un estado de actividad
 * @param {string} status - El valor del estado desde el backend
 * @returns {string} - El texto de visualización en español
 */
export const getStatusDisplay = (status) => {
  if (!status) return 'Pendiente'; // Valor por defecto
  
  // Convertir a string por si acaso
  const statusStr = String(status).toUpperCase();
  
  // Buscar en el mapa de visualización
  if (STATUS_DISPLAY_MAP[statusStr]) {
    return STATUS_DISPLAY_MAP[statusStr];
  }
  
  // Si no se encuentra, intentar buscar por valor en minúsculas
  const lowerKey = statusStr.toLowerCase();
  for (const key in STATUS_DISPLAY_MAP) {
    if (key.toLowerCase() === lowerKey) {
      return STATUS_DISPLAY_MAP[key];
    }
  }
  
  // Si no se encuentra, devolver el valor original
  return status;
};

/**
 * Obtiene el texto de visualización para un tipo de actividad
 * @param {string} type - El valor del tipo desde el backend
 * @returns {string} - El texto de visualización en español
 */
export const getTypeDisplay = (type) => {
  if (!type) return 'Otro'; // Valor por defecto
  
  // Convertir a string por si acaso
  const typeStr = String(type).toUpperCase();
  
  // Buscar en el mapa de visualización
  if (TYPE_DISPLAY_MAP[typeStr]) {
    return TYPE_DISPLAY_MAP[typeStr];
  }
  
  // Si no se encuentra, intentar buscar por valor en minúsculas
  const lowerKey = typeStr.toLowerCase();
  for (const key in TYPE_DISPLAY_MAP) {
    if (key.toLowerCase() === lowerKey) {
      return TYPE_DISPLAY_MAP[key];
    }
  }
  
  // Si no se encuentra, devolver el valor original
  return type;
};

/**
 * Obtiene el valor del backend para un texto de visualización de estado
 * @param {string} displayText - El texto de visualización en español
 * @returns {string} - El valor del estado para el backend
 */
export const getStatusValue = (displayText) => {
  if (!displayText) return ACTIVITY_STATUS.PENDING; // Valor por defecto
  
  // Buscar en el mapa de valores
  if (STATUS_VALUE_MAP[displayText]) {
    return STATUS_VALUE_MAP[displayText];
  }
  
  // Si no se encuentra, intentar buscar por valor en minúsculas
  const lowerText = displayText.toLowerCase();
  for (const key in STATUS_VALUE_MAP) {
    if (key.toLowerCase() === lowerText) {
      return STATUS_VALUE_MAP[key];
    }
  }
  
  // Si no se encuentra, devolver el valor por defecto
  return ACTIVITY_STATUS.PENDING;
};

/**
 * Obtiene el valor del backend para un texto de visualización de tipo
 * @param {string} displayText - El texto de visualización en español
 * @returns {string} - El valor del tipo para el backend
 */
export const getTypeValue = (displayText) => {
  if (!displayText) return ACTIVITY_TYPE.OTHER; // Valor por defecto
  
  // Buscar en el mapa de valores
  if (TYPE_VALUE_MAP[displayText]) {
    return TYPE_VALUE_MAP[displayText];
  }
  
  // Si no se encuentra, intentar buscar por valor en minúsculas
  const lowerText = displayText.toLowerCase();
  for (const key in TYPE_VALUE_MAP) {
    if (key.toLowerCase() === lowerText) {
      return TYPE_VALUE_MAP[key];
    }
  }
  
  // Si no se encuentra, devolver el valor por defecto
  return ACTIVITY_TYPE.OTHER;
};
