import React, { createContext, useContext, useState, useCallback } from 'react';
import ToastContainer from './ToastContainer';
import {
  ToastNotification,
  ToastContextProps,
  ToastProviderProps
} from './Toast.types';

// Crear el contexto
const ToastContext = createContext<ToastContextProps | undefined>(undefined);

/**
 * Proveedor de notificaciones Toast
 * Proporciona un contexto para mostrar notificaciones en la aplicación
 */
export const ToastProvider: React.FC<ToastProviderProps> = ({
  children,
  position = 'top-right',
  defaultDuration = 5000
}) => {
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  // Añadir una notificación
  const addToast = useCallback((toast: Omit<ToastNotification, 'id'>) => {
    const id = `toast-${Date.now()}`;
    const newToast = { ...toast, id };

    setToasts(prev => [...prev, newToast]);
    return id;
  }, []);

  // Eliminar una notificación
  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  // Funciones de ayuda para diferentes tipos de notificaciones
  const success = useCallback((message: string, title?: string, duration = defaultDuration) => {
    return addToast({ type: 'success', title, message, duration });
  }, [addToast, defaultDuration]);

  const error = useCallback((message: string, title?: string, duration = defaultDuration) => {
    return addToast({ type: 'error', title, message, duration });
  }, [addToast, defaultDuration]);

  const warning = useCallback((message: string, title?: string, duration = defaultDuration) => {
    return addToast({ type: 'warning', title, message, duration });
  }, [addToast, defaultDuration]);

  const info = useCallback((message: string, title?: string, duration = defaultDuration) => {
    return addToast({ type: 'info', title, message, duration });
  }, [addToast, defaultDuration]);

  // Valor del contexto
  const contextValue = {
    addToast,
    removeToast,
    success,
    error,
    warning,
    info
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastContainer
        notifications={toasts}
        position={position}
        onClose={removeToast}
      />
    </ToastContext.Provider>
  );
};

/**
 * Hook personalizado para usar el contexto de Toast
 * Proporciona métodos para mostrar diferentes tipos de notificaciones
 */
export const useToast = () => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast debe ser usado dentro de un ToastProvider');
  }

  return context;
};

export default ToastProvider;
