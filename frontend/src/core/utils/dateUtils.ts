import { format, parseISO, isValid, formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

/**
 * Formatea una fecha en formato ISO a un formato legible
 * @param dateString Fecha en formato ISO
 * @param formatStr Formato de salida (por defecto: 'dd/MM/yyyy HH:mm')
 * @returns Fecha formateada
 */
export const formatDate = (
  dateString?: string,
  formatStr = 'dd/MM/yyyy HH:mm'
): string => {
  if (!dateString) return 'Fecha no disponible';

  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : new Date(dateString);

    if (!isValid(date)) {
      return 'Fecha inválida';
    }

    return format(date, formatStr, { locale: es });
  } catch (error) {
    console.error('Error al formatear fecha:', error);
    return 'Error al formatear fecha';
  }
};

/**
 * Formatea una fecha en formato relativo (hace X tiempo)
 * @param dateString Fecha en formato ISO
 * @returns Texto con tiempo relativo
 */
export const formatRelativeTime = (dateString?: string): string => {
  if (!dateString) return 'Fecha no disponible';

  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : new Date(dateString);

    if (!isValid(date)) {
      return 'Fecha inválida';
    }

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSecs < 60) {
      return 'hace un momento';
    } else if (diffMins < 60) {
      return `hace ${diffMins} ${diffMins === 1 ? 'minuto' : 'minutos'}`;
    } else if (diffHours < 24) {
      return `hace ${diffHours} ${diffHours === 1 ? 'hora' : 'horas'}`;
    } else if (diffDays < 7) {
      return `hace ${diffDays} ${diffDays === 1 ? 'día' : 'días'}`;
    } else {
      return format(date, 'dd/MM/yyyy', { locale: es });
    }
  } catch (error) {
    console.error('Error al formatear fecha relativa:', error);
    return 'Error al formatear fecha';
  }
};

/**
 * Formatea una fecha en formato relativo usando date-fns formatDistanceToNow
 * @param dateValue Fecha como string, Date o timestamp
 * @param options Opciones adicionales
 * @returns Texto con tiempo relativo (ej: "hace 5 minutos")
 */
export const formatDistanceToNowSafe = (
  dateValue?: string | Date | number,
  options: { addSuffix?: boolean; locale?: Locale } = { addSuffix: true, locale: es }
): string => {
  if (!dateValue) return 'Fecha no disponible';

  try {
    // Convertir a objeto Date si es necesario
    const date = typeof dateValue === 'string' ? new Date(dateValue) :
      typeof dateValue === 'number' ? new Date(dateValue) : dateValue;

    // Verificar si la fecha es válida
    if (!date || isNaN(date.getTime())) {
      return 'Fecha inválida';
    }

    return formatDistanceToNow(date, options);
  } catch (error) {
    console.error('Error al formatear distancia a ahora:', error);
    return 'Fecha no disponible';
  }
};

/**
 * Convierte una fecha y hora en formato ISO
 * @param date Fecha en formato YYYY-MM-DD
 * @param time Hora en formato HH:MM
 * @returns Fecha en formato ISO
 */
export const toISODateTime = (date: string, time: string): string => {
  try {
    const dateTime = new Date(`${date}T${time}:00`);
    return dateTime.toISOString();
  } catch (error) {
    console.error('Error al convertir a ISO:', error);
    return new Date().toISOString();
  }
};

/**
 * Extrae la fecha de una fecha ISO
 * @param dateString Fecha en formato ISO
 * @returns Fecha en formato YYYY-MM-DD
 */
export const extractDate = (dateString?: string): string => {
  if (!dateString) return '';

  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : new Date(dateString);

    if (!isValid(date)) {
      return '';
    }

    return format(date, 'yyyy-MM-dd');
  } catch (error) {
    console.error('Error al extraer fecha:', error);
    return '';
  }
};

/**
 * Extrae la hora de una fecha ISO
 * @param dateString Fecha en formato ISO
 * @returns Hora en formato HH:MM
 */
export const extractTime = (dateString?: string): string => {
  if (!dateString) return '';

  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : new Date(dateString);

    if (!isValid(date)) {
      return '';
    }

    return format(date, 'HH:mm');
  } catch (error) {
    console.error('Error al extraer hora:', error);
    return '';
  }
};
