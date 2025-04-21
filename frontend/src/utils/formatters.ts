/**
 * Formatea una fecha ISO a formato local
 * @param dateString Fecha en formato ISO
 * @param options Opciones de formato
 * @returns Fecha formateada
 */
export const formatDate = (
  dateString: string,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
): { date: string; time: string } => {
  if (!dateString) return { date: 'N/A', time: 'N/A' };

  try {
    // Verificar si la fecha es válida
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      console.warn('Fecha inválida:', dateString);
      return { date: 'Fecha inválida', time: '' };
    }

    // Formatear fecha
    const dateFormatter = new Intl.DateTimeFormat('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    // Formatear hora
    const timeFormatter = new Intl.DateTimeFormat('es-AR', {
      hour: '2-digit',
      minute: '2-digit',
    });

    return {
      date: dateFormatter.format(date),
      time: timeFormatter.format(date),
    };
  } catch (error) {
    console.error('Error al formatear fecha:', error);
    return { date: 'Error', time: '' };
  }
};

/**
 * Formatea una fecha ISO a formato de fecha y hora local
 * @param dateString Fecha en formato ISO
 * @returns Fecha y hora formateada
 */
export const formatDateTime = (dateString: string): string => {
  const { date, time } = formatDate(dateString);
  if (date === 'N/A' || date === 'Error' || date === 'Fecha inválida') {
    return date;
  }
  return `${date} ${time}`;
};

/**
 * Trunca un texto a una longitud máxima
 * @param text Texto a truncar
 * @param maxLength Longitud máxima
 * @returns Texto truncado
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

/**
 * Capitaliza la primera letra de un texto
 * @param text Texto a capitalizar
 * @returns Texto capitalizado
 */
export const capitalize = (text: string): string => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

/**
 * Formatea un nombre de enumeración para mostrar
 * @param enumValue Valor de enumeración
 * @returns Texto formateado
 */
export const formatEnumValue = (enumValue: string): string => {
  if (!enumValue) return '';
  return enumValue
    .replace(/_/g, ' ')
    .split(' ')
    .map(capitalize)
    .join(' ');
};
