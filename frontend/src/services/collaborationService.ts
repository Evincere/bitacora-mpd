import { websocketService } from './websocketService';

/**
 * Servicio para manejar la colaboración en tiempo real.
 */
class CollaborationService {
  private activityViewers: Map<number, Set<number>> = new Map();
  private activityEditors: Map<number, number> = new Map();
  private currentUser: number | null = null;
  private isInitialized: boolean = false;
  private connectedUsers: Map<number, { userName: string, lastActivity: number }> = new Map();
  private userActivityTimeout: number = 5 * 60 * 1000; // 5 minutos de inactividad antes de considerar desconectado

  /**
   * Inicializa el servicio de colaboración.
   *
   * @param userId El ID del usuario actual
   */
  public init(userId: number): void {
    if (this.isInitialized) {
      return;
    }

    this.currentUser = userId;
    this.isInitialized = true;
    console.log('Servicio de colaboración inicializado para el usuario:', userId);
  }

  /**
   * Registra que el usuario actual está viendo una actividad.
   *
   * @param activityId El ID de la actividad
   */
  public registerViewer(activityId: number): void {
    if (!this.isInitialized || !this.currentUser) {
      console.warn('El servicio de colaboración no está inicializado');
      return;
    }

    console.log(`Registrando usuario ${this.currentUser} como visor de la actividad ${activityId}`);

    // Enviar evento al servidor
    websocketService.send('collaboration_view', {
      activityId,
      userId: this.currentUser
    });

    // Actualizar estado local
    if (!this.activityViewers.has(activityId)) {
      this.activityViewers.set(activityId, new Set());
    }
    this.activityViewers.get(activityId)?.add(this.currentUser);
  }

  /**
   * Registra que el usuario actual está editando una actividad.
   *
   * @param activityId El ID de la actividad
   */
  public registerEditor(activityId: number): void {
    if (!this.isInitialized || !this.currentUser) {
      console.warn('El servicio de colaboración no está inicializado');
      return;
    }

    console.log(`Registrando usuario ${this.currentUser} como editor de la actividad ${activityId}`);

    // Enviar evento al servidor
    websocketService.send('collaboration_edit', {
      activityId,
      userId: this.currentUser
    });

    // Actualizar estado local
    this.activityEditors.set(activityId, this.currentUser);
    this.registerViewer(activityId); // También registrar como visor
  }

  /**
   * Registra que el usuario actual ha comentado en una actividad.
   *
   * @param activityId El ID de la actividad
   * @param comment El comentario
   */
  public registerComment(activityId: number, comment: string): void {
    if (!this.isInitialized || !this.currentUser) {
      console.warn('El servicio de colaboración no está inicializado');
      return;
    }

    console.log(`Registrando comentario del usuario ${this.currentUser} en la actividad ${activityId}`);

    // Enviar evento al servidor
    websocketService.send('collaboration_comment', {
      activityId,
      userId: this.currentUser,
      comment
    });
  }

  /**
   * Registra que el usuario actual ha dejado de ver/editar una actividad.
   *
   * @param activityId El ID de la actividad
   */
  public unregisterUser(activityId: number): void {
    if (!this.isInitialized || !this.currentUser) {
      console.warn('El servicio de colaboración no está inicializado');
      return;
    }

    console.log(`Eliminando usuario ${this.currentUser} como visor/editor de la actividad ${activityId}`);

    // Enviar evento al servidor
    websocketService.send('collaboration_leave', {
      activityId,
      userId: this.currentUser
    });

    // Actualizar estado local
    const viewers = this.activityViewers.get(activityId);
    if (viewers) {
      viewers.delete(this.currentUser);
      if (viewers.size === 0) {
        this.activityViewers.delete(activityId);
      }
    }

    if (this.activityEditors.get(activityId) === this.currentUser) {
      this.activityEditors.delete(activityId);
    }
  }

  /**
   * Actualiza la lista de usuarios que están viendo una actividad.
   *
   * @param activityId El ID de la actividad
   * @param userIds Los IDs de los usuarios
   */
  public updateViewers(activityId: number, userIds: number[]): void {
    const viewers = new Set(userIds);
    this.activityViewers.set(activityId, viewers);
  }

  /**
   * Actualiza el usuario que está editando una actividad.
   *
   * @param activityId El ID de la actividad
   * @param userId El ID del usuario
   */
  public updateEditor(activityId: number, userId: number | null): void {
    if (userId) {
      this.activityEditors.set(activityId, userId);
    } else {
      this.activityEditors.delete(activityId);
    }
  }

  /**
   * Obtiene los usuarios que están viendo una actividad.
   *
   * @param activityId El ID de la actividad
   * @returns Los IDs de los usuarios
   */
  public getViewers(activityId: number): number[] {
    return Array.from(this.activityViewers.get(activityId) || []);
  }

  /**
   * Obtiene el usuario que está editando una actividad.
   *
   * @param activityId El ID de la actividad
   * @returns El ID del usuario, o null si nadie está editando la actividad
   */
  public getEditor(activityId: number): number | null {
    return this.activityEditors.get(activityId) || null;
  }

  /**
   * Verifica si el usuario actual está viendo una actividad.
   *
   * @param activityId El ID de la actividad
   * @returns true si el usuario está viendo la actividad, false en caso contrario
   */
  public isViewing(activityId: number): boolean {
    if (!this.currentUser) return false;
    return this.activityViewers.get(activityId)?.has(this.currentUser) || false;
  }

  /**
   * Verifica si el usuario actual está editando una actividad.
   *
   * @param activityId El ID de la actividad
   * @returns true si el usuario está editando la actividad, false en caso contrario
   */
  public isEditing(activityId: number): boolean {
    if (!this.currentUser) return false;
    return this.activityEditors.get(activityId) === this.currentUser;
  }

  /**
   * Verifica si alguien más está editando una actividad.
   *
   * @param activityId El ID de la actividad
   * @returns true si alguien más está editando la actividad, false en caso contrario
   */
  public isSomeoneElseEditing(activityId: number): boolean {
    const editor = this.activityEditors.get(activityId);
    return !!editor && editor !== this.currentUser;
  }

  /**
   * Obtiene el número de usuarios que están viendo una actividad.
   *
   * @param activityId El ID de la actividad
   * @returns El número de usuarios
   */
  public getViewerCount(activityId: number): number {
    return this.activityViewers.get(activityId)?.size || 0;
  }

  /**
   * Limpia el estado del servicio.
   */
  public clear(): void {
    this.activityViewers.clear();
    this.activityEditors.clear();
    this.currentUser = null;
    this.isInitialized = false;
    this.connectedUsers.clear();
  }

  /**
   * Registra un usuario como conectado.
   *
   * @param userId El ID del usuario
   * @param userName El nombre del usuario
   */
  public registerConnectedUser(userId: number, userName: string): void {
    this.connectedUsers.set(userId, {
      userName,
      lastActivity: Date.now()
    });

    // Enviar evento al servidor
    websocketService.send('user_connected', {
      userId,
      userName,
      connectionTime: Date.now()
    });

    console.log(`Usuario ${userName} (${userId}) registrado como conectado`);
  }

  /**
   * Actualiza la actividad de un usuario.
   *
   * @param userId El ID del usuario
   */
  public updateUserActivity(userId: number): void {
    const user = this.connectedUsers.get(userId);
    if (user) {
      this.connectedUsers.set(userId, {
        ...user,
        lastActivity: Date.now()
      });
    }
  }

  /**
   * Registra un usuario como desconectado.
   *
   * @param userId El ID del usuario
   */
  public registerDisconnectedUser(userId: number): void {
    const user = this.connectedUsers.get(userId);
    if (user) {
      // Enviar evento al servidor
      websocketService.send('user_disconnected', {
        userId,
        userName: user.userName,
        disconnectionTime: Date.now(),
        sessionDuration: Math.floor((Date.now() - user.lastActivity) / 1000)
      });

      console.log(`Usuario ${user.userName} (${userId}) registrado como desconectado`);
      this.connectedUsers.delete(userId);
    }
  }

  /**
   * Obtiene la lista de usuarios conectados.
   *
   * @returns Lista de usuarios conectados
   */
  public getConnectedUsers(): { userId: number, userName: string, lastActivity: number }[] {
    const now = Date.now();
    const activeUsers: { userId: number, userName: string, lastActivity: number }[] = [];

    // Filtrar usuarios inactivos
    this.connectedUsers.forEach((user, userId) => {
      if (now - user.lastActivity < this.userActivityTimeout) {
        activeUsers.push({
          userId,
          userName: user.userName,
          lastActivity: user.lastActivity
        });
      } else {
        // Registrar como desconectado si ha pasado el tiempo de inactividad
        this.registerDisconnectedUser(userId);
      }
    });

    return activeUsers;
  }

  /**
   * Verifica si un usuario está conectado.
   *
   * @param userId El ID del usuario
   * @returns true si el usuario está conectado
   */
  public isUserConnected(userId: number): boolean {
    const user = this.connectedUsers.get(userId);
    if (!user) return false;

    const now = Date.now();
    if (now - user.lastActivity >= this.userActivityTimeout) {
      // Registrar como desconectado si ha pasado el tiempo de inactividad
      this.registerDisconnectedUser(userId);
      return false;
    }

    return true;
  }
}

// Exportar una instancia única del servicio
export const collaborationService = new CollaborationService();

/**
 * Hook para usar el servicio de colaboración.
 */
export const useCollaboration = () => {
  return {
    init: collaborationService.init.bind(collaborationService),
    registerViewer: collaborationService.registerViewer.bind(collaborationService),
    registerEditor: collaborationService.registerEditor.bind(collaborationService),
    registerComment: collaborationService.registerComment.bind(collaborationService),
    unregisterUser: collaborationService.unregisterUser.bind(collaborationService),
    getViewers: collaborationService.getViewers.bind(collaborationService),
    getEditor: collaborationService.getEditor.bind(collaborationService),
    isViewing: collaborationService.isViewing.bind(collaborationService),
    isEditing: collaborationService.isEditing.bind(collaborationService),
    isSomeoneElseEditing: collaborationService.isSomeoneElseEditing.bind(collaborationService),
    getViewerCount: collaborationService.getViewerCount.bind(collaborationService),
    updateViewers: collaborationService.updateViewers.bind(collaborationService),
    updateEditor: collaborationService.updateEditor.bind(collaborationService),
    clear: collaborationService.clear.bind(collaborationService),
    // Nuevos métodos para gestionar usuarios conectados
    registerConnectedUser: collaborationService.registerConnectedUser.bind(collaborationService),
    updateUserActivity: collaborationService.updateUserActivity.bind(collaborationService),
    registerDisconnectedUser: collaborationService.registerDisconnectedUser.bind(collaborationService),
    getConnectedUsers: collaborationService.getConnectedUsers.bind(collaborationService),
    isUserConnected: collaborationService.isUserConnected.bind(collaborationService)
  };
};
