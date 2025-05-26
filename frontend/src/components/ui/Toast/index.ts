/**
 * @file Archivo de redirección para el sistema de Toast
 * @description Este archivo exporta los componentes de Toast desde la implementación unificada
 */

// Exportar componentes desde la implementación unificada
export {
    ToastProvider,
    useToast,
    Toast,
    ToastContainer
} from '@/shared/components/ui/Toast';

// Exportar tipos usando export type para compatibilidad con isolatedModules
export type {
    ToastType,
    ToastNotification,
    ToastProps,
    ToastContainerProps,
    ToastPosition,
    ToastContextProps,
    ToastProviderProps
} from '@/shared/components/ui/Toast';
