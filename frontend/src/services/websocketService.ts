// Importación de socket.io-client temporalmente comentada hasta resolver problemas de dependencias
// import { io, Socket } from 'socket.io-client';

// Interfaz temporal para Socket hasta que se pueda usar socket.io-client
interface Socket {
  on: (event: string, callback: Function) => void;
  emit: (event: string, data: any) => void;
  disconnect: () => void;
}
import { useToast } from '../components/ui/Toast';
import {
  RealTimeNotification
} from '../types/notifications';

// Tipos de eventos que podemos recibir del servidor
export enum WebSocketEventType {
  NOTIFICATION = 'notification',
  USER_STATUS = 'user_status',
  SESSION_EXPIRED = 'session_expired',
  SESSION_ACTIVITY = 'session_activity',
  SYSTEM_ALERT = 'system_alert',
  TASK_ASSIGNMENT = 'task_assignment',
  TASK_STATUS_CHANGE = 'task_status_change',
  DEADLINE_REMINDER = 'deadline_reminder',
  ANNOUNCEMENT = 'announcement',
  COLLABORATION = 'collaboration',
}

// Interfaz para los eventos de estado de usuario
export interface UserStatusEvent {
  userId: number;
  status: 'online' | 'offline' | 'away';
  lastActivity: number;
}

// Interfaz para los eventos de actividad de sesión
export interface SessionActivityEvent {
  sessionId: string;
  ipAddress: string;
  userAgent: string;
  location?: string;
  timestamp: number;
  action: 'login' | 'logout' | 'token_refresh' | 'suspicious_activity';
}

// Interfaz para las alertas del sistema
export interface SystemAlertEvent {
  id: string;
  level: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: number;
  requiresAction: boolean;
}

// Interfaz para los mensajes en cola
export interface QueuedMessage {
  id: string;
  event: string;
  data: any;
  timestamp: number;
  priority: 'high' | 'medium' | 'low';
  retries: number;
  maxRetries: number;
  sent: boolean;
  compressed?: boolean;
}

// Configuración de compresión
export interface CompressionConfig {
  enabled: boolean;
  threshold: number; // Tamaño mínimo en bytes para comprimir
  level?: number; // Nivel de compresión (1-9, donde 9 es máxima compresión)
}

// Clase para gestionar la conexión WebSocket
class WebSocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 10;
  private reconnectDelay = 2000; // 2 segundos
  private reconnectTimer: any = null;
  private heartbeatInterval: any = null;
  private heartbeatTimeout: any = null;
  private lastHeartbeatResponse = 0;
  private heartbeatMissed = 0;
  private maxHeartbeatMissed = 3;
  private listeners: Map<string, Set<Function>> = new Map();
  private connected = false;
  private connecting = false;
  private userId: number | null = null;
  private authToken: string | null = null;

  // Cola de mensajes pendientes
  private messageQueue: QueuedMessage[] = [];
  private processingQueue = false;
  private queueProcessInterval: any = null;
  private queueStorageKey = 'websocket_message_queue';

  // Configuración de compresión
  private compressionConfig: CompressionConfig = {
    enabled: true,
    threshold: 1024, // 1KB
    level: 6 // Nivel medio de compresión
  };

  // Estadísticas de compresión
  private compressionStats = {
    totalCompressed: 0,
    totalSaved: 0,
    averageRatio: 0
  };

  // Inicializar la conexión WebSocket
  public init(userId: number, authToken: string): void {
    if (this.connecting || this.connected) {
      return;
    }

    this.userId = userId;
    this.authToken = authToken;
    this.connecting = true;

    // Limpiar cualquier temporizador de reconexión pendiente
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    // Cargar mensajes en cola desde localStorage
    this.loadQueueFromStorage();

    // Iniciar el procesamiento de la cola
    this.startQueueProcessing();

    try {
      // Implementación temporal de WebSocket nativo en lugar de socket.io-client
      // hasta resolver problemas de dependencias
      try {
        // Simulamos la creación de un socket
        // En una implementación real, usaríamos:
        // const wsUrl = `${config.websocketUrl || config.apiUrl.replace('http', 'ws')}/socket?token=${authToken}&userId=${userId}`;
        // const ws = new WebSocket(wsUrl);

        // Simulación de socket para desarrollo
        this.socket = {
          on: (event: string, _callback: Function) => {
            console.log(`Registrando listener para evento: ${event}`);
            // No hacemos nada realmente, solo simulamos
          },
          emit: (event: string, data: any) => {
            console.log(`Emitiendo evento: ${event}`, data);
            // No hacemos nada realmente, solo simulamos
          },
          disconnect: () => {
            console.log('Desconectando socket');
            // No hacemos nada realmente, solo simulamos
          }
        };

        // Simular conexión exitosa después de un breve retraso
        setTimeout(() => {
          this.connected = true;
          this.connecting = false;
          this.reconnectAttempts = 0;
          this.emitEvent('connection_status', { connected: true });
          console.log('WebSocket conectado (simulado)');

          // Iniciar heartbeat para detectar conexiones zombies
          this.startHeartbeat();
        }, 1000);
      } catch (error) {
        console.error('Error al inicializar la conexión WebSocket:', error);
        this.connecting = false;
        this.reconnectAttempts++;
        this.scheduleReconnect();
      }

      this.setupEventListeners();
    } catch (error) {
      console.error('Error initializing WebSocket connection:', error);
      this.connecting = false;
      this.reconnectAttempts++;
      this.scheduleReconnect();
    }
  }

  // Configurar los listeners de eventos básicos
  private setupEventListeners(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('WebSocket connected');
      this.connected = true;
      this.connecting = false;
      this.reconnectAttempts = 0;
      this.emitEvent('connection_status', { connected: true });

      // Iniciar heartbeat
      this.startHeartbeat();
    });

    this.socket.on('disconnect', (reason: string) => {
      console.log(`WebSocket disconnected: ${reason}`);
      this.connected = false;
      this.connecting = false;
      this.emitEvent('connection_status', { connected: false, reason });

      // Detener heartbeat
      this.stopHeartbeat();

      // Programar reconexión automática si la desconexión no fue manual
      if (reason !== 'io client disconnect') {
        this.reconnectAttempts++;
        this.scheduleReconnect();
      }
    });

    this.socket.on('connect_error', (error: Error) => {
      console.error('WebSocket connection error:', error);
      this.connected = false;
      this.connecting = false;
      this.reconnectAttempts++;

      // Detener heartbeat
      this.stopHeartbeat();

      // Notificar a los listeners
      this.emitEvent('connection_status', {
        connected: false,
        error: 'connection_error',
        details: error
      });

      // Programar reconexión automática
      this.scheduleReconnect();
    });

    // Configurar listeners para los diferentes tipos de eventos
    this.socket.on(WebSocketEventType.NOTIFICATION, (data: RealTimeNotification) => {
      this.emitEvent(WebSocketEventType.NOTIFICATION, data);
    });

    this.socket.on(WebSocketEventType.USER_STATUS, (data: UserStatusEvent) => {
      this.emitEvent(WebSocketEventType.USER_STATUS, data);
    });

    this.socket.on(WebSocketEventType.SESSION_EXPIRED, (data: any) => {
      this.emitEvent(WebSocketEventType.SESSION_EXPIRED, data);
    });

    this.socket.on(WebSocketEventType.SESSION_ACTIVITY, (data: SessionActivityEvent) => {
      this.emitEvent(WebSocketEventType.SESSION_ACTIVITY, data);
    });

    this.socket.on(WebSocketEventType.SYSTEM_ALERT, (data: SystemAlertEvent) => {
      this.emitEvent(WebSocketEventType.SYSTEM_ALERT, data);
    });
  }

  // Suscribirse a un evento
  public subscribe(event: string, callback: Function): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }

    this.listeners.get(event)?.add(callback);

    // Devolver una función para cancelar la suscripción
    return () => {
      const callbacks = this.listeners.get(event);
      if (callbacks) {
        callbacks.delete(callback);
        if (callbacks.size === 0) {
          this.listeners.delete(event);
        }
      }
    };
  }

  // Emitir un evento a todos los listeners suscritos
  private emitEvent(event: string, data: any): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in ${event} event listener:`, error);
        }
      });
    }
  }

  // Enviar un evento al servidor
  public async send(event: string, data: any, options: { priority?: 'high' | 'medium' | 'low', maxRetries?: number, compress?: boolean } = {}): Promise<string> {
    const messageId = this.generateMessageId();
    const { priority = 'medium', maxRetries = 3, compress = this.compressionConfig.enabled } = options;

    // Crear mensaje para la cola
    const message: QueuedMessage = {
      id: messageId,
      event,
      data,
      timestamp: Date.now(),
      priority,
      retries: 0,
      maxRetries,
      sent: false,
      compressed: false
    };

    // Comprimir datos si es necesario
    let dataToSend = data;
    if (compress && this.shouldCompressMessage(data)) {
      try {
        const compressResult = await this.compressData(data);
        if (compressResult.compressed) {
          dataToSend = compressResult.data;
          message.compressed = true;
          message.data = dataToSend; // Guardar datos comprimidos en la cola

          // Actualizar estadísticas
          this.updateCompressionStats(compressResult.originalSize, compressResult.compressedSize);
        }
      } catch (error) {
        console.warn('Error al comprimir mensaje:', error);
        // Si falla la compresión, usar datos originales
      }
    }

    // Si estamos conectados, intentar enviar inmediatamente
    if (this.socket && this.connected) {
      try {
        // Añadir metadatos de compresión si es necesario
        const payload = message.compressed ?
          { _compressed: true, data: dataToSend } :
          dataToSend;

        this.socket.emit(event, payload);
        message.sent = true;
        console.log(`Mensaje enviado directamente: ${event}`,
          message.compressed ? '[Datos comprimidos]' : data);

        // Para mensajes de alta prioridad o heartbeat, no los guardamos en la cola
        if (event === 'ping' || event === 'pong' || event.startsWith('heartbeat')) {
          return messageId;
        }
      } catch (error) {
        console.error(`Error al enviar mensaje ${event}:`, error);
        // Si falla, lo añadimos a la cola
      }
    } else {
      console.warn(`Socket no conectado, añadiendo mensaje a la cola: ${event}`);
    }

    // Si el mensaje no se envió o queremos asegurarnos de que se procese, lo añadimos a la cola
    if (!message.sent) {
      this.addToQueue(message);
    }

    return messageId;
  }

  // Desconectar el WebSocket
  public disconnect(): void {
    // Detener heartbeat
    this.stopHeartbeat();

    // Detener procesamiento de cola
    this.stopQueueProcessing();

    // Guardar la cola actual en localStorage antes de desconectar
    this.saveQueueToStorage();

    // Limpiar temporizador de reconexión
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }

    this.connected = false;
    this.connecting = false;
    this.userId = null;
    this.authToken = null;
    this.reconnectAttempts = 0;

    // No limpiamos los listeners para mantener las suscripciones
    // this.listeners.clear();

    // Notificar a los listeners
    this.emitEvent('connection_status', {
      connected: false,
      reason: 'manual_disconnect',
      queueSize: this.messageQueue.length
    });
  }

  // Verificar si el WebSocket está conectado
  public isConnected(): boolean {
    return this.connected;
  }

  // Reconectar manualmente
  public reconnect(): void {
    if (this.userId && this.authToken) {
      this.disconnect();
      this.init(this.userId, this.authToken);
    } else {
      console.warn('Cannot reconnect, missing userId or authToken');
    }
  }

  // Reconectar automáticamente con backoff exponencial
  private scheduleReconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }

    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnect attempts reached, giving up');
      this.emitEvent('connection_status', {
        connected: false,
        error: 'Max reconnect attempts reached'
      });
      return;
    }

    // Calcular retraso con backoff exponencial
    const delay = Math.min(
      30000, // Máximo 30 segundos
      this.reconnectDelay * Math.pow(1.5, this.reconnectAttempts)
    );

    console.log(`Scheduling reconnect attempt ${this.reconnectAttempts + 1} in ${delay}ms`);

    this.reconnectTimer = setTimeout(() => {
      if (!this.connected && !this.connecting && this.userId && this.authToken) {
        console.log(`Attempting to reconnect (${this.reconnectAttempts + 1}/${this.maxReconnectAttempts})`);
        this.init(this.userId, this.authToken);
      }
    }, delay);
  }

  // Iniciar heartbeat para detectar conexiones zombies
  private startHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }

    if (this.heartbeatTimeout) {
      clearTimeout(this.heartbeatTimeout);
    }

    this.lastHeartbeatResponse = Date.now();
    this.heartbeatMissed = 0;

    // Enviar ping cada 30 segundos
    this.heartbeatInterval = setInterval(() => {
      if (this.connected && this.socket) {
        console.log('Sending heartbeat ping');
        this.socket.emit('ping', { timestamp: Date.now() });

        // Verificar si recibimos respuesta al ping anterior
        const timeSinceLastResponse = Date.now() - this.lastHeartbeatResponse;
        if (timeSinceLastResponse > 35000) { // 35 segundos
          this.heartbeatMissed++;
          console.warn(`Heartbeat response missed (${this.heartbeatMissed}/${this.maxHeartbeatMissed})`);

          if (this.heartbeatMissed >= this.maxHeartbeatMissed) {
            console.error('Connection appears to be dead, reconnecting...');
            this.connected = false;
            this.emitEvent('connection_status', {
              connected: false,
              reason: 'heartbeat_timeout'
            });
            this.reconnect();
          }
        }
      }
    }, 30000);

    // Configurar listener para pong
    if (this.socket) {
      this.socket.on('pong', (_data: any) => {
        console.log('Received heartbeat pong');
        this.lastHeartbeatResponse = Date.now();
        this.heartbeatMissed = 0;
      });
    }
  }

  // Detener heartbeat
  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }

    if (this.heartbeatTimeout) {
      clearTimeout(this.heartbeatTimeout);
      this.heartbeatTimeout = null;
    }
  }

  // Generar un ID único para los mensajes
  private generateMessageId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }

  // Añadir un mensaje a la cola
  private addToQueue(message: QueuedMessage): void {
    // Añadir el mensaje a la cola
    this.messageQueue.push(message);

    // Ordenar la cola por prioridad y timestamp
    this.sortQueue();

    // Guardar la cola en localStorage
    this.saveQueueToStorage();

    // Notificar a los listeners
    this.emitEvent('queue_updated', {
      queueSize: this.messageQueue.length,
      message: `Mensaje añadido a la cola: ${message.event}`
    });

    console.log(`Mensaje añadido a la cola: ${message.event}`, message);
  }

  // Ordenar la cola por prioridad y timestamp
  private sortQueue(): void {
    const priorityValues = {
      'high': 0,
      'medium': 1,
      'low': 2
    };

    this.messageQueue.sort((a, b) => {
      // Primero ordenar por prioridad
      const priorityDiff = priorityValues[a.priority] - priorityValues[b.priority];
      if (priorityDiff !== 0) return priorityDiff;

      // Luego por timestamp (más antiguos primero)
      return a.timestamp - b.timestamp;
    });
  }

  // Guardar la cola en localStorage
  private saveQueueToStorage(): void {
    try {
      // Limitar el tamaño de la cola para localStorage (máximo 100 mensajes)
      const queueToSave = this.messageQueue.slice(0, 100);
      localStorage.setItem(this.queueStorageKey, JSON.stringify(queueToSave));
    } catch (error) {
      console.error('Error al guardar la cola en localStorage:', error);
    }
  }

  // Cargar la cola desde localStorage
  private loadQueueFromStorage(): void {
    try {
      const storedQueue = localStorage.getItem(this.queueStorageKey);
      if (storedQueue) {
        const parsedQueue = JSON.parse(storedQueue) as QueuedMessage[];
        // Filtrar mensajes muy antiguos (más de 24 horas)
        const now = Date.now();
        const validMessages = parsedQueue.filter(msg => {
          const age = now - msg.timestamp;
          return age < 24 * 60 * 60 * 1000; // 24 horas en milisegundos
        });

        this.messageQueue = validMessages;
        this.sortQueue();

        console.log(`Cargados ${this.messageQueue.length} mensajes desde localStorage`);
      }
    } catch (error) {
      console.error('Error al cargar la cola desde localStorage:', error);
      // Si hay error, limpiar la cola
      this.messageQueue = [];
      localStorage.removeItem(this.queueStorageKey);
    }
  }

  // Iniciar el procesamiento de la cola
  private startQueueProcessing(): void {
    // Detener cualquier procesamiento anterior
    this.stopQueueProcessing();

    // Procesar la cola cada 5 segundos
    this.queueProcessInterval = setInterval(() => {
      this.processQueue();
    }, 5000);

    // Procesar la cola inmediatamente
    this.processQueue();
  }

  // Detener el procesamiento de la cola
  private stopQueueProcessing(): void {
    if (this.queueProcessInterval) {
      clearInterval(this.queueProcessInterval);
      this.queueProcessInterval = null;
    }
  }

  // Procesar la cola de mensajes
  private async processQueue(): Promise<void> {
    // Si ya estamos procesando o no hay conexión, salir
    if (this.processingQueue || !this.connected || !this.socket) {
      return;
    }

    // Si la cola está vacía, salir
    if (this.messageQueue.length === 0) {
      return;
    }

    this.processingQueue = true;

    try {
      console.log(`Procesando cola de mensajes (${this.messageQueue.length} mensajes)`);

      // Procesar hasta 10 mensajes a la vez
      const messagesToProcess = this.messageQueue.slice(0, 10);
      const processedIds: string[] = [];

      for (const message of messagesToProcess) {
        // Si el mensaje ya fue enviado, marcarlo como procesado
        if (message.sent) {
          processedIds.push(message.id);
          continue;
        }

        // Si se superó el número máximo de reintentos, marcarlo como procesado
        if (message.retries >= message.maxRetries) {
          console.warn(`Mensaje ${message.id} descartado después de ${message.retries} intentos`);
          processedIds.push(message.id);

          // Notificar a los listeners
          this.emitEvent('message_failed', {
            messageId: message.id,
            event: message.event,
            reason: 'max_retries_exceeded'
          });

          continue;
        }

        // Intentar enviar el mensaje
        try {
          if (this.socket && this.connected) {
            // Preparar los datos para enviar, teniendo en cuenta la compresión
            let dataToSend = message.data;

            // Si el mensaje está comprimido, añadir metadatos
            if (message.compressed) {
              dataToSend = { _compressed: true, data: message.data };
            }

            // Enviar el mensaje
            this.socket.emit(message.event, dataToSend);
            message.sent = true;
            processedIds.push(message.id);

            console.log(`Mensaje ${message.id} enviado desde la cola ${message.compressed ? '(comprimido)' : ''}`);

            // Notificar a los listeners
            this.emitEvent('message_sent', {
              messageId: message.id,
              event: message.event,
              compressed: message.compressed
            });
          } else {
            // Incrementar el contador de reintentos
            message.retries++;
            console.warn(`No se pudo enviar el mensaje ${message.id}, reintento ${message.retries}/${message.maxRetries}`);
          }
        } catch (error) {
          // Incrementar el contador de reintentos
          message.retries++;
          console.error(`Error al enviar mensaje ${message.id}:`, error);
        }
      }

      // Eliminar los mensajes procesados de la cola
      if (processedIds.length > 0) {
        this.messageQueue = this.messageQueue.filter(msg => !processedIds.includes(msg.id));

        // Guardar la cola actualizada
        this.saveQueueToStorage();

        // Notificar a los listeners
        this.emitEvent('queue_updated', {
          queueSize: this.messageQueue.length,
          processed: processedIds.length
        });
      }
    } catch (error) {
      console.error('Error al procesar la cola de mensajes:', error);
    } finally {
      this.processingQueue = false;
    }
  }

  // Obtener el estado actual de la cola
  public getQueueStatus(): { size: number, messages: QueuedMessage[] } {
    return {
      size: this.messageQueue.length,
      messages: [...this.messageQueue]
    };
  }

  // Limpiar la cola de mensajes
  public clearQueue(): void {
    this.messageQueue = [];
    this.saveQueueToStorage();

    // Notificar a los listeners
    this.emitEvent('queue_updated', {
      queueSize: 0,
      message: 'Cola limpiada manualmente'
    });
  }

  // Verificar si un mensaje debe ser comprimido
  private shouldCompressMessage(data: any): boolean {
    // No comprimir si la compresión está desactivada
    if (!this.compressionConfig.enabled) {
      return false;
    }

    // No comprimir datos pequeños
    const jsonString = JSON.stringify(data);
    return jsonString.length >= this.compressionConfig.threshold;
  }

  // Comprimir datos
  private async compressData(data: any): Promise<{ compressed: boolean; data: any; originalSize: number; compressedSize: number }> {
    try {
      // Convertir a JSON
      const jsonString = JSON.stringify(data);
      const originalSize = jsonString.length;

      // No comprimir datos pequeños
      if (originalSize < this.compressionConfig.threshold) {
        return { compressed: false, data, originalSize, compressedSize: originalSize };
      }

      // Convertir a Uint8Array
      const encoder = new TextEncoder();
      const uint8Array = encoder.encode(jsonString);

      // Comprimir usando CompressionStream si está disponible
      if ('CompressionStream' in window) {
        // Usar la API de compresión nativa
        const cs = new CompressionStream('gzip');
        const writer = cs.writable.getWriter();
        writer.write(uint8Array);
        writer.close();

        // Leer el resultado comprimido
        const reader = cs.readable.getReader();
        let compressedChunks = [];
        let compressedSize = 0;

        while (true) {
          const result = await reader.read();
          if (result.done) break;
          compressedChunks.push(result.value);
          compressedSize += result.value.length;
        }

        // Combinar los chunks en un solo array
        const compressedArray = new Uint8Array(compressedSize);
        let offset = 0;
        for (const chunk of compressedChunks) {
          compressedArray.set(chunk, offset);
          offset += chunk.length;
        }

        // Convertir a base64 para transmisión
        const base64 = this.arrayBufferToBase64(compressedArray.buffer);

        console.log(`Compresión: ${originalSize} -> ${compressedSize} bytes (${Math.round((compressedSize / originalSize) * 100)}%)`);

        return {
          compressed: true,
          data: base64,
          originalSize,
          compressedSize
        };
      } else if ('pako' in window) {
        // Usar pako como fallback si está disponible
        // @ts-ignore
        const compressed = window.pako.gzip(jsonString);
        const compressedSize = compressed.length;

        // Convertir a base64 para transmisión
        const base64 = this.arrayBufferToBase64(compressed.buffer);

        console.log(`Compresión (pako): ${originalSize} -> ${compressedSize} bytes (${Math.round((compressedSize / originalSize) * 100)}%)`);

        return {
          compressed: true,
          data: base64,
          originalSize,
          compressedSize
        };
      } else {
        // No hay método de compresión disponible
        console.warn('No hay método de compresión disponible');
        return { compressed: false, data, originalSize, compressedSize: originalSize };
      }
    } catch (error) {
      console.error('Error al comprimir datos:', error);
      return { compressed: false, data, originalSize: 0, compressedSize: 0 };
    }
  }

  // Descomprimir datos
  // Método para descomprimir datos (no utilizado actualmente pero preparado para futuro uso)
  // @ts-ignore: Unused method - will be used in future
  private async decompressData(compressedData: string): Promise<any> {
    try {
      // Convertir de base64 a ArrayBuffer
      const arrayBuffer = this.base64ToArrayBuffer(compressedData);

      // Descomprimir usando DecompressionStream si está disponible
      if ('DecompressionStream' in window) {
        // Usar la API de descompresión nativa
        const ds = new DecompressionStream('gzip');
        const writer = ds.writable.getWriter();
        writer.write(new Uint8Array(arrayBuffer));
        writer.close();

        // Leer el resultado descomprimido
        const reader = ds.readable.getReader();
        let decompressedChunks = [];
        let decompressedSize = 0;

        while (true) {
          const result = await reader.read();
          if (result.done) break;
          decompressedChunks.push(result.value);
          decompressedSize += result.value.length;
        }

        // Combinar los chunks en un solo array
        const decompressedArray = new Uint8Array(decompressedSize);
        let offset = 0;
        for (const chunk of decompressedChunks) {
          decompressedArray.set(chunk, offset);
          offset += chunk.length;
        }

        // Convertir a string y luego a JSON
        const decoder = new TextDecoder();
        const jsonString = decoder.decode(decompressedArray);
        return JSON.parse(jsonString);
      } else if ('pako' in window) {
        // Usar pako como fallback si está disponible
        // @ts-ignore
        const decompressed = window.pako.ungzip(new Uint8Array(arrayBuffer));

        // Convertir a string y luego a JSON
        const decoder = new TextDecoder();
        const jsonString = decoder.decode(decompressed);
        return JSON.parse(jsonString);
      } else {
        // No hay método de descompresión disponible
        throw new Error('No hay método de descompresión disponible');
      }
    } catch (error) {
      console.error('Error al descomprimir datos:', error);
      throw error;
    }
  }

  // Convertir ArrayBuffer a base64
  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  // Convertir base64 a ArrayBuffer
  private base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }

  // Actualizar estadísticas de compresión
  private updateCompressionStats(originalSize: number, compressedSize: number): void {
    if (originalSize <= 0 || compressedSize <= 0) return;

    this.compressionStats.totalCompressed++;
    this.compressionStats.totalSaved += (originalSize - compressedSize);

    // Calcular ratio promedio
    const ratio = compressedSize / originalSize;
    const oldAvg = this.compressionStats.averageRatio;
    const newAvg = oldAvg === 0 ?
      ratio :
      oldAvg + (ratio - oldAvg) / this.compressionStats.totalCompressed;

    this.compressionStats.averageRatio = newAvg;
  }

  // Obtener estadísticas de compresión
  public getCompressionStats(): typeof this.compressionStats & { enabled: boolean } {
    return {
      ...this.compressionStats,
      enabled: this.compressionConfig.enabled
    };
  }

  // Configurar opciones de compresión
  public setCompressionConfig(config: Partial<CompressionConfig>): void {
    this.compressionConfig = {
      ...this.compressionConfig,
      ...config
    };
  }
}

// Exportar una instancia única del servicio
export const websocketService = new WebSocketService();

// Hook para usar el servicio de WebSocket
export const useWebSocket = () => {
  const toast = useToast();

  // Suscribirse a notificaciones en tiempo real
  const subscribeToNotifications = (callback: (notification: RealTimeNotification) => void) => {
    return websocketService.subscribe(WebSocketEventType.NOTIFICATION, callback);
  };

  // Suscribirse a eventos de estado de usuario
  const subscribeToUserStatus = (callback: (status: UserStatusEvent) => void) => {
    return websocketService.subscribe(WebSocketEventType.USER_STATUS, callback);
  };

  // Suscribirse a eventos de expiración de sesión
  const subscribeToSessionExpired = (callback: (data: any) => void) => {
    return websocketService.subscribe(WebSocketEventType.SESSION_EXPIRED, callback);
  };

  // Suscribirse a eventos de actividad de sesión
  const subscribeToSessionActivity = (callback: (activity: SessionActivityEvent) => void) => {
    return websocketService.subscribe(WebSocketEventType.SESSION_ACTIVITY, callback);
  };

  // Suscribirse a alertas del sistema
  const subscribeToSystemAlerts = (callback: (alert: SystemAlertEvent) => void) => {
    return websocketService.subscribe(WebSocketEventType.SYSTEM_ALERT, callback);
  };

  // Suscribirse al estado de la conexión
  const subscribeToConnectionStatus = (callback: (status: { connected: boolean, reason?: string, error?: string, queueSize?: number }) => void) => {
    return websocketService.subscribe('connection_status', callback);
  };

  // Suscribirse a actualizaciones de la cola
  const subscribeToQueueUpdates = (callback: (data: { queueSize: number, processed?: number, message?: string }) => void) => {
    return websocketService.subscribe('queue_updated', callback);
  };

  // Suscribirse a eventos de mensajes enviados
  const subscribeToMessageSent = (callback: (data: { messageId: string, event: string }) => void) => {
    return websocketService.subscribe('message_sent', callback);
  };

  // Suscribirse a eventos de mensajes fallidos
  const subscribeToMessageFailed = (callback: (data: { messageId: string, event: string, reason: string }) => void) => {
    return websocketService.subscribe('message_failed', callback);
  };

  // Mostrar notificaciones automáticamente
  const setupAutoNotifications = () => {
    return subscribeToNotifications((notification) => {
      const toastType = notification.type as 'success' | 'error' | 'warning' | 'info';
      if (['success', 'error', 'warning', 'info'].includes(toastType)) {
        toast[toastType](notification.message, notification.title);
      } else {
        toast.info(notification.message, notification.title);
      }
    });
  };

  // Mostrar notificaciones de estado de la cola
  const setupQueueNotifications = () => {
    // Notificar cuando se procesen mensajes de la cola
    const unsubscribe1 = subscribeToQueueUpdates((data) => {
      if (data.processed && data.processed > 0) {
        toast.success(`${data.processed} mensajes procesados de la cola`, 'Cola de mensajes');
      }
    });

    // Notificar cuando fallen mensajes
    const unsubscribe2 = subscribeToMessageFailed((data) => {
      toast.error(`No se pudo enviar el mensaje: ${data.event}`, 'Error de envío');
    });

    // Devolver función para cancelar todas las suscripciones
    return () => {
      unsubscribe1();
      unsubscribe2();
    };
  };

  return {
    init: websocketService.init.bind(websocketService),
    disconnect: websocketService.disconnect.bind(websocketService),
    isConnected: websocketService.isConnected.bind(websocketService),
    reconnect: websocketService.reconnect.bind(websocketService),
    send: websocketService.send.bind(websocketService),
    getQueueStatus: websocketService.getQueueStatus.bind(websocketService),
    clearQueue: websocketService.clearQueue.bind(websocketService),
    getCompressionStats: websocketService.getCompressionStats.bind(websocketService),
    setCompressionConfig: websocketService.setCompressionConfig.bind(websocketService),
    subscribeToNotifications,
    subscribeToUserStatus,
    subscribeToSessionExpired,
    subscribeToSessionActivity,
    subscribeToSystemAlerts,
    subscribeToConnectionStatus,
    subscribeToQueueUpdates,
    subscribeToMessageSent,
    subscribeToMessageFailed,
    setupAutoNotifications,
    setupQueueNotifications
  };
};
