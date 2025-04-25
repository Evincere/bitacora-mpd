import { Activity, Notification, User } from './models';
import { store } from '@/core/store';

/**
 * Tipo para el estado de Redux
 */
export type RootState = ReturnType<typeof store.getState>;

/**
 * Tipo para el dispatch de Redux
 */
export type AppDispatch = typeof store.dispatch;

/**
 * Interfaz para el estado de autenticación
 */
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  error: any | null;
}

/**
 * Interfaz para el estado de la UI
 */
export interface UiState {
  isLoading: boolean;
  notifications: Notification[];
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  loading: boolean;
  error: string | null;
  success: string | null;
  modal: {
    isOpen: boolean;
    content: React.ReactNode | null;
    title: string;
  };
}

/**
 * Interfaz para el estado global
 */
export interface AppState {
  auth: AuthState;
  ui: UiState;
}
