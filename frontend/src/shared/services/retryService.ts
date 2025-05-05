import { toast } from 'react-toastify';

/**
 * Opciones para el servicio de reintentos.
 */
export interface RetryOptions {
  /** Número máximo de reintentos */
  maxRetries?: number;
  /** Tiempo de espera inicial entre reintentos (en ms) */
  initialDelay?: number;
  /** Factor de retroceso exponencial */
  backoffFactor?: number;
  /** Función para mostrar mensajes de error */
  onError?: (error: Error, attempt: number) => void;
  /** Función para mostrar mensajes de éxito */
  onSuccess?: () => void;
}

/**
 * Servicio para reintentar operaciones fallidas.
 */
export const retryService = {
  /**
   * Intenta ejecutar una operación con reintentos automáticos.
   * 
   * @param operation Función que realiza la operación
   * @param options Opciones de reintento
   * @returns Resultado de la operación
   */
  async retry<T>(operation: () => Promise<T>, options: RetryOptions = {}): Promise<T> {
    const {
      maxRetries = 3,
      initialDelay = 1000,
      backoffFactor = 2,
      onError = (error, attempt) => {
        if (attempt < maxRetries) {
          toast.warning(`Error: ${error.message}. Reintentando (${attempt}/${maxRetries})...`);
        } else {
          toast.error(`Error: ${error.message}. Se alcanzó el número máximo de reintentos.`);
        }
      },
      onSuccess = () => {}
    } = options;

    let lastError: Error | null = null;
    let delay = initialDelay;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const result = await operation();
        onSuccess();
        return result;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        onError(lastError, attempt);

        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, delay));
          delay *= backoffFactor;
        }
      }
    }

    throw lastError || new Error('La operación falló después de varios reintentos');
  },

  /**
   * Guarda datos en el almacenamiento local para reintentar más tarde.
   * 
   * @param key Clave para identificar los datos
   * @param data Datos a guardar
   */
  saveForRetry(key: string, data: any): void {
    try {
      const pendingOperations = this.getPendingOperations();
      pendingOperations[key] = {
        data,
        timestamp: Date.now()
      };
      localStorage.setItem('pendingOperations', JSON.stringify(pendingOperations));
    } catch (error) {
      console.error('Error al guardar operación pendiente:', error);
    }
  },

  /**
   * Obtiene las operaciones pendientes del almacenamiento local.
   */
  getPendingOperations(): Record<string, { data: any, timestamp: number }> {
    try {
      const pendingOperations = localStorage.getItem('pendingOperations');
      return pendingOperations ? JSON.parse(pendingOperations) : {};
    } catch (error) {
      console.error('Error al obtener operaciones pendientes:', error);
      return {};
    }
  },

  /**
   * Elimina una operación pendiente del almacenamiento local.
   * 
   * @param key Clave de la operación a eliminar
   */
  removePendingOperation(key: string): void {
    try {
      const pendingOperations = this.getPendingOperations();
      delete pendingOperations[key];
      localStorage.setItem('pendingOperations', JSON.stringify(pendingOperations));
    } catch (error) {
      console.error('Error al eliminar operación pendiente:', error);
    }
  },

  /**
   * Procesa todas las operaciones pendientes.
   * 
   * @param processor Función para procesar cada operación
   */
  async processPendingOperations(
    processor: (key: string, data: any) => Promise<void>
  ): Promise<void> {
    const pendingOperations = this.getPendingOperations();
    
    for (const [key, { data }] of Object.entries(pendingOperations)) {
      try {
        await processor(key, data);
        this.removePendingOperation(key);
        toast.success('Operación pendiente completada con éxito');
      } catch (error) {
        console.error(`Error al procesar operación pendiente ${key}:`, error);
        // No eliminamos la operación para que se pueda reintentar más tarde
      }
    }
  }
};
