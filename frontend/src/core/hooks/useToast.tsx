import React from 'react';
import { toast, ToastOptions } from 'react-toastify';
import { ToastType } from '@/shared/components/ui/Toast/Toast.types';

interface ToastHook {
  success: (message: string, title?: string, options?: ToastOptions) => void;
  error: (message: string, title?: string, options?: ToastOptions) => void;
  warning: (message: string, title?: string, options?: ToastOptions) => void;
  info: (message: string, title?: string, options?: ToastOptions) => void;
}

export const useToast = (): ToastHook => {
  const defaultOptions: ToastOptions = {
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  };

  const showToast = (type: ToastType, message: string, title?: string, options?: ToastOptions) => {
    // Registrar en consola para depuración en desarrollo
    if (import.meta.env.DEV) {
      const formattedMessage = title ? `${title}: ${message}` : message;

      switch (type) {
        case 'success':
          console.log('%c✓ SUCCESS', 'color: #4CD964; font-weight: bold;', formattedMessage);
          break;
        case 'error':
          console.log('%c✗ ERROR', 'color: #FF3B30; font-weight: bold;', formattedMessage);
          break;
        case 'warning':
          console.log('%c⚠ WARNING', 'color: #FFCC00; font-weight: bold;', formattedMessage);
          break;
        case 'info':
          console.log('%cℹ INFO', 'color: #0A84FF; font-weight: bold;', formattedMessage);
          break;
        default:
          console.log(formattedMessage);
      }
    }

    const content = title ? (
      <div>
        <strong>{title}</strong>
        <div>{message}</div>
      </div>
    ) : message;

    const toastOptions = { ...defaultOptions, ...options };

    switch (type) {
      case 'success':
        toast.success(content, toastOptions);
        break;
      case 'error':
        toast.error(content, toastOptions);
        break;
      case 'warning':
        toast.warning(content, toastOptions);
        break;
      case 'info':
        toast.info(content, toastOptions);
        break;
      default:
        toast(content, toastOptions);
    }
  };

  return {
    success: (message: string, title?: string, options?: ToastOptions) =>
      showToast('success', message, title, options),
    error: (message: string, title?: string, options?: ToastOptions) =>
      showToast('error', message, title, options),
    warning: (message: string, title?: string, options?: ToastOptions) =>
      showToast('warning', message, title, options),
    info: (message: string, title?: string, options?: ToastOptions) =>
      showToast('info', message, title, options),
  };
};
