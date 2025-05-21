/**
 * @file errorHandlingService.ts
 * @description Servicio para el manejo centralizado de errores
 */

import { toast } from 'react-toastify';

// Tipos de errores
export enum ErrorType {
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization',
  VALIDATION = 'validation',
  SERVER = 'server',
  NETWORK = 'network',
  UNKNOWN = 'unknown'
}

// Interfaz para errores de API
export interface ApiError {
  status: number;
  message: string;
  error?: string;
  path?: string;
  timestamp?: string;
  details?: string[];
  type?: ErrorType;
}

/**
 * Determina el tipo de error basado en el código de estado HTTP
 * @param status Código de estado HTTP
 * @returns Tipo de error
 */
const getErrorTypeFromStatus = (status: number): ErrorType => {
  if (status === 401) return ErrorType.AUTHENTICATION;
  if (status === 403) return ErrorType.AUTHORIZATION;
  if (status === 400 || status === 422) return ErrorType.VALIDATION;
  if (status >= 500) return ErrorType.SERVER;
  return ErrorType.UNKNOWN;
};

/**
 * Maneja errores de autenticación
 * @param error Error de autenticación
 * @returns Error procesado
 */
const handleAuthenticationError = (error: ApiError): ApiError => {
  // Mostrar notificación de error
  toast.error('Error de autenticación: Sesión expirada o credenciales inválidas');
  
  // Redirigir al login si es necesario
  if (window.location.pathname !== '/login') {
    // Dar tiempo para que se muestre la notificación
    setTimeout(() => {
      window.location.href = '/login';
    }, 2000);
  }
  
  return {
    ...error,
    type: ErrorType.AUTHENTICATION,
    message: error.message || 'Sesión expirada o credenciales inválidas'
  };
};

/**
 * Maneja errores de autorización
 * @param error Error de autorización
 * @returns Error procesado
 */
const handleAuthorizationError = (error: ApiError): ApiError => {
  toast.error('Error de autorización: No tienes permisos para realizar esta acción');
  
  return {
    ...error,
    type: ErrorType.AUTHORIZATION,
    message: error.message || 'No tienes permisos para realizar esta acción'
  };
};

/**
 * Maneja errores de validación
 * @param error Error de validación
 * @returns Error procesado
 */
const handleValidationError = (error: ApiError): ApiError => {
  const message = error.message || 'Error de validación en los datos enviados';
  toast.error(message);
  
  return {
    ...error,
    type: ErrorType.VALIDATION,
    message
  };
};

/**
 * Maneja errores de servidor
 * @param error Error de servidor
 * @returns Error procesado
 */
const handleServerError = (error: ApiError): ApiError => {
  toast.error('Error del servidor: Por favor, inténtalo más tarde');
  
  return {
    ...error,
    type: ErrorType.SERVER,
    message: error.message || 'Error interno del servidor'
  };
};

/**
 * Maneja errores de red
 * @param error Error de red
 * @returns Error procesado
 */
const handleNetworkError = (error: Error): ApiError => {
  toast.error('Error de conexión: Verifica tu conexión a internet');
  
  return {
    status: 0,
    type: ErrorType.NETWORK,
    message: 'Error de conexión a internet'
  };
};

/**
 * Maneja errores desconocidos
 * @param error Error desconocido
 * @returns Error procesado
 */
const handleUnknownError = (error: any): ApiError => {
  toast.error('Error desconocido: Por favor, inténtalo más tarde');
  
  return {
    status: 0,
    type: ErrorType.UNKNOWN,
    message: error?.message || 'Error desconocido'
  };
};

/**
 * Procesa un error de API
 * @param error Error a procesar
 * @returns Error procesado
 */
const processApiError = (error: any): ApiError => {
  // Si es un error de red (fetch fallido)
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return handleNetworkError(error);
  }
  
  // Si es un error de API con status
  if (error.status) {
    const errorType = getErrorTypeFromStatus(error.status);
    
    switch (errorType) {
      case ErrorType.AUTHENTICATION:
        return handleAuthenticationError(error);
      case ErrorType.AUTHORIZATION:
        return handleAuthorizationError(error);
      case ErrorType.VALIDATION:
        return handleValidationError(error);
      case ErrorType.SERVER:
        return handleServerError(error);
      default:
        return handleUnknownError(error);
    }
  }
  
  // Error desconocido
  return handleUnknownError(error);
};

// Exportar el servicio
const errorHandlingService = {
  processApiError,
  handleAuthenticationError,
  handleAuthorizationError,
  handleValidationError,
  handleServerError,
  handleNetworkError,
  handleUnknownError
};

export default errorHandlingService;
