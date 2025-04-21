import { websocketService } from './websocketService';

/**
 * Servicio para manejar la colaboración en tiempo real.
 */
class CollaborationService {
  private activityViewers: Map<number, Set<number>> = new Map();
  private activityEditors: Map<number, number> = new Map();
  private currentUser: number | null = null;
  private isInitialized: boolean = false;

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
    clear: collaborationService.clear.bind(collaborationService)
  };
};
