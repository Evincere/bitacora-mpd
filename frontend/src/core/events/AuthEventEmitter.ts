/**
 * @file AuthEventEmitter.ts
 * @description Implementación del patrón Observer para eventos de autenticación
 */

import { 
  AuthEventType, 
  AuthEventListener, 
  TypedAuthEventListener,
  AuthEventDataType,
  LoginEventData,
  LogoutEventData,
  TokenExpiredEventData,
  TokenRefreshedEventData,
  AuthErrorEventData,
  SessionExpiredEventData,
  PermissionsChangedEventData,
  UserUpdatedEventData
} from '../types/auth-events';

/**
 * Clase que implementa el patrón Observer para eventos de autenticación
 */
class AuthEventEmitter {
  private static instance: AuthEventEmitter;
  private listeners: Map<AuthEventType, Set<AuthEventListener>>;
  private typedListeners: Map<AuthEventType, Set<Function>>;
  private eventHistory: Array<{type: AuthEventType, data: AuthEventDataType, timestamp: number}>;
  private maxHistorySize: number;
  private debug: boolean;

  /**
   * Constructor privado para implementar Singleton
   */
  private constructor() {
    this.listeners = new Map();
    this.typedListeners = new Map();
    this.eventHistory = [];
    this.maxHistorySize = 50; // Almacenar los últimos 50 eventos
    this.debug = process.env.NODE_ENV === 'development';
  }

  /**
   * Obtiene la instancia única de AuthEventEmitter (Singleton)
   * @returns Instancia de AuthEventEmitter
   */
  public static getInstance(): AuthEventEmitter {
    if (!AuthEventEmitter.instance) {
      AuthEventEmitter.instance = new AuthEventEmitter();
    }
    return AuthEventEmitter.instance;
  }

  /**
   * Suscribe un listener a todos los eventos de autenticación
   * @param listener Función que se ejecutará cuando ocurra cualquier evento
   * @returns Función para cancelar la suscripción
   */
  public subscribe(listener: AuthEventListener): () => void {
    // Para cada tipo de evento, agregar el listener
    Object.values(AuthEventType).forEach(eventType => {
      if (!this.listeners.has(eventType)) {
        this.listeners.set(eventType, new Set());
      }
      this.listeners.get(eventType)?.add(listener);
    });

    // Devolver función para cancelar la suscripción
    return () => {
      Object.values(AuthEventType).forEach(eventType => {
        this.listeners.get(eventType)?.delete(listener);
      });
    };
  }

  /**
   * Suscribe un listener a un tipo específico de evento de autenticación
   * @param eventType Tipo de evento al que suscribirse
   * @param listener Función que se ejecutará cuando ocurra el evento
   * @returns Función para cancelar la suscripción
   */
  public on(eventType: AuthEventType, listener: AuthEventListener): () => void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    this.listeners.get(eventType)?.add(listener);

    // Devolver función para cancelar la suscripción
    return () => {
      this.listeners.get(eventType)?.delete(listener);
    };
  }

  /**
   * Suscribe un listener tipado a un evento específico
   * @param eventType Tipo de evento
   * @param listener Listener tipado para el evento específico
   * @returns Función para cancelar la suscripción
   */
  public onLogin(listener: TypedAuthEventListener<LoginEventData>): () => void {
    return this.onTyped(AuthEventType.LOGIN, listener);
  }

  public onLogout(listener: TypedAuthEventListener<LogoutEventData>): () => void {
    return this.onTyped(AuthEventType.LOGOUT, listener);
  }

  public onTokenExpired(listener: TypedAuthEventListener<TokenExpiredEventData>): () => void {
    return this.onTyped(AuthEventType.TOKEN_EXPIRED, listener);
  }

  public onTokenRefreshed(listener: TypedAuthEventListener<TokenRefreshedEventData>): () => void {
    return this.onTyped(AuthEventType.TOKEN_REFRESHED, listener);
  }

  public onAuthError(listener: TypedAuthEventListener<AuthErrorEventData>): () => void {
    return this.onTyped(AuthEventType.AUTH_ERROR, listener);
  }

  public onSessionExpired(listener: TypedAuthEventListener<SessionExpiredEventData>): () => void {
    return this.onTyped(AuthEventType.SESSION_EXPIRED, listener);
  }

  public onPermissionsChanged(listener: TypedAuthEventListener<PermissionsChangedEventData>): () => void {
    return this.onTyped(AuthEventType.PERMISSIONS_CHANGED, listener);
  }

  public onUserUpdated(listener: TypedAuthEventListener<UserUpdatedEventData>): () => void {
    return this.onTyped(AuthEventType.USER_UPDATED, listener);
  }

  /**
   * Método privado para suscribir listeners tipados
   */
  private onTyped<T extends AuthEventDataType>(eventType: AuthEventType, listener: TypedAuthEventListener<T>): () => void {
    if (!this.typedListeners.has(eventType)) {
      this.typedListeners.set(eventType, new Set());
    }
    this.typedListeners.get(eventType)?.add(listener);

    // Devolver función para cancelar la suscripción
    return () => {
      this.typedListeners.get(eventType)?.delete(listener);
    };
  }

  /**
   * Emite un evento de autenticación
   * @param eventType Tipo de evento a emitir
   * @param data Datos asociados al evento
   */
  public emit(eventType: AuthEventType, data: AuthEventDataType): void {
    // Asegurar que los datos tengan timestamp
    if (!data.timestamp) {
      data.timestamp = Date.now();
    }

    // Registrar el evento en el historial
    this.addToHistory(eventType, data);

    // Registrar en consola en modo desarrollo
    if (this.debug) {
      console.log(`[AuthEvent] ${eventType}:`, data);
    }

    // Notificar a los listeners generales
    this.listeners.get(eventType)?.forEach(listener => {
      try {
        listener(eventType, data);
      } catch (error) {
        console.error(`Error en listener de evento ${eventType}:`, error);
      }
    });

    // Notificar a los listeners tipados
    this.typedListeners.get(eventType)?.forEach(listener => {
      try {
        listener(data);
      } catch (error) {
        console.error(`Error en listener tipado de evento ${eventType}:`, error);
      }
    });
  }

  /**
   * Agrega un evento al historial
   */
  private addToHistory(type: AuthEventType, data: AuthEventDataType): void {
    this.eventHistory.push({
      type,
      data,
      timestamp: Date.now()
    });

    // Limitar el tamaño del historial
    if (this.eventHistory.length > this.maxHistorySize) {
      this.eventHistory.shift();
    }
  }

  /**
   * Obtiene el historial de eventos
   * @returns Historial de eventos
   */
  public getHistory(): Array<{type: AuthEventType, data: AuthEventDataType, timestamp: number}> {
    return [...this.eventHistory];
  }

  /**
   * Limpia todos los listeners
   */
  public clearListeners(): void {
    this.listeners.clear();
    this.typedListeners.clear();
  }
}

// Exportar la instancia única
export const authEvents = AuthEventEmitter.getInstance();

// Exportar la clase para pruebas o casos especiales
export default AuthEventEmitter;
