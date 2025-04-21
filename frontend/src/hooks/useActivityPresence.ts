import { useEffect, useState } from 'react';
import { useCollaboration } from '../services/collaborationService';
import { useSelector } from 'react-redux';
import { websocketService, WebSocketEventType } from '../services/websocketService';
import { CollaborationNotification, CollaborationAction } from '../types/notifications';

interface RootState {
  auth: {
    user: {
      id: number;
    };
  };
}

interface UserPresence {
  userId: number;
  userName: string;
  action: CollaborationAction;
  timestamp: number;
}

/**
 * Hook para manejar la presencia en las actividades.
 * 
 * @param activityId El ID de la actividad
 * @returns Información sobre la presencia en la actividad
 */
export const useActivityPresence = (activityId: number) => {
  const collaboration = useCollaboration();
  const user = useSelector((state: RootState) => state.auth.user);
  const [isInitialized, setIsInitialized] = useState(false);
  const [userPresences, setUserPresences] = useState<UserPresence[]>([]);
  const [userNames, setUserNames] = useState<{ [key: number]: string }>({});
  
  // Inicializar el servicio de colaboración
  useEffect(() => {
    if (user?.id && !isInitialized) {
      collaboration.init(user.id);
      setIsInitialized(true);
    }
  }, [user?.id, isInitialized, collaboration]);
  
  // Registrar al usuario como visor al montar el componente
  useEffect(() => {
    if (isInitialized && activityId) {
      collaboration.registerViewer(activityId);
      
      // Limpiar al desmontar
      return () => {
        collaboration.unregisterUser(activityId);
      };
    }
  }, [isInitialized, activityId, collaboration]);
  
  // Suscribirse a eventos de colaboración
  useEffect(() => {
    if (!isInitialized || !activityId) return;
    
    const handleCollaborationEvent = (notification: CollaborationNotification) => {
      if (notification.activityId !== activityId) return;
      
      // Actualizar nombres de usuarios
      setUserNames(prev => ({
        ...prev,
        [notification.userId]: notification.userName
      }));
      
      // Actualizar presencias
      setUserPresences(prev => {
        const existingIndex = prev.findIndex(p => p.userId === notification.userId);
        const newPresence: UserPresence = {
          userId: notification.userId,
          userName: notification.userName,
          action: notification.action,
          timestamp: notification.timestamp
        };
        
        if (existingIndex >= 0) {
          // Actualizar presencia existente
          const updated = [...prev];
          updated[existingIndex] = newPresence;
          return updated;
        } else {
          // Añadir nueva presencia
          return [...prev, newPresence];
        }
      });
      
      // Actualizar estado del servicio de colaboración
      if (notification.action === CollaborationAction.VIEWING) {
        const viewers = collaboration.getViewers(activityId);
        if (!viewers.includes(notification.userId)) {
          collaboration.updateViewers(activityId, [...viewers, notification.userId]);
        }
      } else if (notification.action === CollaborationAction.EDITING) {
        collaboration.updateEditor(activityId, notification.userId);
      } else if (notification.action === CollaborationAction.COMMENTED) {
        // No es necesario actualizar el estado para comentarios
      } else if (notification.action === 'LEFT') {
        // Eliminar usuario de las presencias
        setUserPresences(prev => prev.filter(p => p.userId !== notification.userId));
        
        // Actualizar estado del servicio de colaboración
        const viewers = collaboration.getViewers(activityId).filter(id => id !== notification.userId);
        collaboration.updateViewers(activityId, viewers);
        
        if (collaboration.getEditor(activityId) === notification.userId) {
          collaboration.updateEditor(activityId, null);
        }
      }
    };
    
    // Suscribirse a eventos de colaboración
    const unsubscribe = websocketService.subscribe(
      WebSocketEventType.COLLABORATION,
      handleCollaborationEvent
    );
    
    return () => {
      unsubscribe();
    };
  }, [isInitialized, activityId, collaboration]);
  
  // Registrar al usuario como editor
  const registerAsEditor = () => {
    if (isInitialized && activityId) {
      collaboration.registerEditor(activityId);
    }
  };
  
  // Registrar un comentario
  const registerComment = (comment: string) => {
    if (isInitialized && activityId) {
      collaboration.registerComment(activityId, comment);
    }
  };
  
  return {
    viewers: collaboration.getViewers(activityId),
    editor: collaboration.getEditor(activityId),
    viewerCount: collaboration.getViewerCount(activityId),
    isViewing: collaboration.isViewing(activityId),
    isEditing: collaboration.isEditing(activityId),
    isSomeoneElseEditing: collaboration.isSomeoneElseEditing(activityId),
    userNames,
    userPresences,
    registerAsEditor,
    registerComment
  };
};
