import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import commentService, { Comment, CommentCreateDto } from '../services/commentService';

interface UseCommentsOptions {
  taskId?: number;
  taskRequestId?: number;
  onAddSuccess?: () => void;
  onEditSuccess?: () => void;
  onDeleteSuccess?: () => void;
  onMarkAsReadSuccess?: () => void;
}

/**
 * Hook personalizado para gestionar comentarios
 */
export const useComments = ({
  taskId,
  taskRequestId,
  onAddSuccess,
  onEditSuccess,
  onDeleteSuccess,
  onMarkAsReadSuccess
}: UseCommentsOptions) => {
  const queryClient = useQueryClient();

  // Determinar la clave de consulta y la función de obtención
  const queryKey = taskId
    ? ['taskComments', taskId]
    : ['taskRequestComments', taskRequestId];

  const fetchComments = async () => {
    if (taskId) {
      try {
        console.log(`Intentando obtener comentarios de solicitud para ID: ${taskId}`);
        // Primero intentamos obtener comentarios de solicitud
        const solicitudesService = await import('@/features/solicitudes/services/solicitudesService').then(m => m.default);
        const comments = await solicitudesService.getCommentsWithReadStatus(taskId);
        console.log('Comentarios de solicitud obtenidos:', comments);

        if (comments && comments.length > 0) {
          return comments;
        }

        // Si no hay comentarios de solicitud, intentamos con el servicio estándar
        return await commentService.getTaskRequestCommentsWithReadStatus(taskId);
      } catch (taskRequestError) {
        console.warn('Error al obtener comentarios de solicitud, intentando como actividad:', taskRequestError);

        // Si falla, intentamos obtener comentarios de actividad usando el mismo ID
        try {
          return await commentService.getTaskComments(taskId);
        } catch (activityError) {
          console.error('Error al obtener comentarios de actividad:', activityError);
          // Devolver array vacío en lugar de lanzar error para evitar problemas en la UI
          return [];
        }
      }
    } else if (taskRequestId) {
      try {
        return await commentService.getTaskRequestCommentsWithReadStatus(taskRequestId);
      } catch (error) {
        console.error('Error al obtener comentarios de solicitud:', error);
        return [];
      }
    } else {
      return [];
    }
  };

  // Consulta para obtener comentarios
  const {
    data: comments = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey,
    queryFn: fetchComments,
    enabled: !!(taskId || taskRequestId),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  // Mutación para agregar comentario
  const addCommentMutation = useMutation({
    mutationFn: async (comment: CommentCreateDto) => {
      if (taskId) {
        try {
          console.log(`Intentando agregar comentario a solicitud con ID: ${taskId}`);
          // Primero intentamos agregar como comentario de solicitud
          const solicitudesService = await import('@/features/solicitudes/services/solicitudesService').then(m => m.default);

          // Usar el método directo de solicitudesService para agregar comentario
          const result = await solicitudesService.addComment(taskId, comment.content);
          console.log('Comentario agregado a solicitud directamente:', result);
          return result;
        } catch (directError) {
          console.warn('Error al agregar comentario directamente a solicitud, intentando con API estándar:', directError);

          // Si falla, intentamos con el método estándar para solicitudes
          try {
            return await commentService.addTaskRequestComment(taskId, comment);
          } catch (taskRequestError) {
            console.warn('Error al agregar comentario a solicitud, intentando como actividad:', taskRequestError);

            // Si ambos métodos para solicitudes fallan, intentamos como actividad
            try {
              return await commentService.addTaskComment(taskId, comment);
            } catch (activityError) {
              console.error('Error al agregar comentario a actividad:', activityError);
              throw activityError;
            }
          }
        }
      } else if (taskRequestId) {
        return await commentService.addTaskRequestComment(taskRequestId, comment);
      }
      throw new Error('Se requiere taskId o taskRequestId');
    },
    onSuccess: (data) => {
      console.log('Comentario agregado exitosamente:', data);
      queryClient.invalidateQueries({ queryKey });

      // Forzar una recarga de los comentarios después de agregar uno nuevo
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey });
      }, 500);

      if (onAddSuccess) onAddSuccess();
    },
    onError: (error: any) => {
      console.error('Error al agregar comentario:', error);
      toast.error('Error al agregar el comentario');
    }
  });

  // Mutación para editar comentario
  const editCommentMutation = useMutation({
    mutationFn: ({ commentId, content }: { commentId: number; content: string }) =>
      commentService.editComment(commentId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      if (onEditSuccess) onEditSuccess();
    },
    onError: (error: any) => {
      console.error('Error al editar comentario:', error);
      toast.error('Error al editar el comentario');
    }
  });

  // Mutación para eliminar comentario
  const deleteCommentMutation = useMutation({
    mutationFn: (commentId: number) => commentService.deleteComment(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      if (onDeleteSuccess) onDeleteSuccess();
    },
    onError: (error: any) => {
      console.error('Error al eliminar comentario:', error);
      toast.error('Error al eliminar el comentario');
    }
  });

  // Mutación para marcar como leído
  const markAsReadMutation = useMutation({
    mutationFn: async (commentId: number) => {
      try {
        // Intentar marcar como leído usando el servicio estándar
        return await commentService.markAsRead(commentId);
      } catch (error) {
        console.warn('Error al marcar como leído con el método estándar, intentando método alternativo:', error);

        // Si falla, intentar con el método específico para solicitudes
        try {
          // Usar el servicio de solicitudes para marcar como leído
          const solicitudesService = await import('@/features/solicitudes/services/solicitudesService').then(m => m.default);
          return await solicitudesService.markCommentAsRead(commentId);
        } catch (altError) {
          console.error('Error al marcar como leído con método alternativo:', altError);
          throw altError;
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      if (onMarkAsReadSuccess) onMarkAsReadSuccess();
    },
    onError: (error: any) => {
      console.error('Error al marcar como leído:', error);
      // No mostrar toast para no molestar al usuario
    }
  });

  // Función para agregar un comentario
  const addComment = async (content: string) => {
    await addCommentMutation.mutateAsync({ content });
  };

  // Función para editar un comentario
  const editComment = async (commentId: number, content: string) => {
    await editCommentMutation.mutateAsync({ commentId, content });
  };

  // Función para eliminar un comentario
  const deleteComment = async (commentId: number) => {
    await deleteCommentMutation.mutateAsync(commentId);
  };

  // Función para marcar como leído
  const markAsRead = async (commentId: number) => {
    await markAsReadMutation.mutateAsync(commentId);
  };

  return {
    comments,
    isLoading,
    error,
    isAdding: addCommentMutation.isPending,
    isEditing: editCommentMutation.isPending,
    isDeleting: deleteCommentMutation.isPending,
    isMarkingAsRead: markAsReadMutation.isPending,
    addComment,
    editComment,
    deleteComment,
    markAsRead,
    refetch
  };
};

export default useComments;
