/**
 * Tipos compartidos para el sistema de Toast
 */

// Definir tipos directamente para evitar dependencias circulares
export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastNotification {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
}

// Propiedades del componente Toast
export interface ToastProps {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
  onClose: (id: string) => void;
}

// Propiedades del contenedor
export interface ToastContainerProps {
  notifications: ToastNotification[];
  position?: ToastPosition;
  onClose: (id: string) => void;
}

// Posiciones disponibles para el contenedor
export type ToastPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

// Interfaz para el contexto
export interface ToastContextProps {
  // Métodos básicos
  addToast: (toast: Omit<ToastNotification, 'id'>) => string;
  removeToast: (id: string) => void;

  // Métodos de conveniencia
  success: (message: string, title?: string, duration?: number) => string;
  error: (message: string, title?: string, duration?: number) => string;
  warning: (message: string, title?: string, duration?: number) => string;
  info: (message: string, title?: string, duration?: number) => string;
}

// Propiedades del proveedor
export interface ToastProviderProps {
  children: React.ReactNode;
  position?: ToastPosition;
  defaultDuration?: number;
}
