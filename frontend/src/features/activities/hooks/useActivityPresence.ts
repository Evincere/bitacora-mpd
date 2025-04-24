import { useState, useEffect, useCallback } from 'react';
import { useSocket } from '@/features/notifications/hooks/useSocket';
import { useAuth } from '@/core/hooks';

interface ActivityPresence {
  userNames: string[];
  registerAsEditor: () => void;
  isSomeoneElseEditing: boolean;
}

export const useActivityPresence = (activityId: number): ActivityPresence => {
  const [userNames, setUserNames] = useState<string[]>([]);
  const { socket } = useSocket();
  const { user } = useAuth();

  // Determinar si alguien más está editando
  const isSomeoneElseEditing = userNames.length > 1 || (userNames.length === 1 && userNames[0] !== user?.username);

  // Registrar al usuario actual como editor
  const registerAsEditor = useCallback(() => {
    if (!socket || !activityId || !user) return;

    socket.emit('register-activity-editor', {
      activityId,
      username: user.username
    });

    // Limpiar al desmontar
    return () => {
      socket.emit('unregister-activity-editor', {
        activityId,
        username: user.username
      });
    };
  }, [socket, activityId, user]);

  // Escuchar eventos de presencia
  useEffect(() => {
    if (!socket || !activityId) return;

    // Manejar actualizaciones de editores
    const handleEditorsUpdate = (data: { activityId: number; editors: string[] }) => {
      if (data.activityId === activityId) {
        setUserNames(data.editors);
      }
    };

    // Suscribirse a eventos
    socket.on('activity-editors-updated', handleEditorsUpdate);

    // Solicitar lista actual de editores
    socket.emit('get-activity-editors', { activityId });

    // Limpiar al desmontar
    return () => {
      socket.off('activity-editors-updated', handleEditorsUpdate);
    };
  }, [socket, activityId]);

  return {
    userNames,
    registerAsEditor,
    isSomeoneElseEditing
  };
};
