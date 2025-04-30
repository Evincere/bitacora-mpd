/**
 * Utilidades para el manejo de fechas
 */

/**
 * Formatea una fecha para enviarla al backend en el formato esperado (yyyy-MM-dd'T'HH:mm:ss)
 * @param date Fecha a formatear (puede ser Date, string ISO o null/undefined)
 * @returns Fecha formateada o null si la entrada es null/undefined
 */
export const formatDateForBackend = (date: Date | string | null | undefined): string | null => {
  if (!date) return null;
  
  // Si es string, convertir a Date
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Formatear como ISO y truncar a los primeros 19 caracteres (yyyy-MM-dd'T'HH:mm:ss)
  return dateObj.toISOString().substring(0, 19);
};

/**
 * Formatea una fecha para mostrarla en la interfaz de usuario
 * @param dateString Fecha en formato ISO
 * @returns Fecha formateada como dd/MM/yyyy HH:mm
 */
export const formatDateForDisplay = (dateString?: string): string => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  
  // Formatear como dd/MM/yyyy HH:mm
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

/**
 * Formatea una fecha para un campo de tipo date de HTML
 * @param dateString Fecha en formato ISO
 * @returns Fecha formateada como yyyy-MM-dd
 */
export const formatDateForInput = (dateString?: string): string => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  
  // Formatear como yyyy-MM-dd
  return date.toISOString().split('T')[0];
};

/**
 * Formatea una hora para un campo de tipo time de HTML
 * @param dateString Fecha en formato ISO
 * @returns Hora formateada como HH:mm
 */
export const formatTimeForInput = (dateString?: string): string => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  
  // Formatear como HH:mm
  return date.toTimeString().slice(0, 5);
};
