/**
 * Interfaz extendida de Error para incluir propiedades adicionales
 * utilizadas en las respuestas de error de la API
 */
export interface ApiError extends Error {
  /** Código de estado HTTP */
  status?: number;
  
  /** Mensaje de error */
  message: string;
  
  /** Datos adicionales del error */
  data?: any;
  
  /** Información de la respuesta */
  response?: {
    status: number;
    data: any;
  };
}
