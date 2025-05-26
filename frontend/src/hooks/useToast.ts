import { useToast as useToastFromProvider } from '@/components/ui';

/**
 * Hook para mostrar notificaciones toast
 *
 * Este hook es un wrapper alrededor del hook useToast del ToastProvider
 * para mantener la compatibilidad con el código existente.
 */
export const useToast = () => {
  return useToastFromProvider();
};
