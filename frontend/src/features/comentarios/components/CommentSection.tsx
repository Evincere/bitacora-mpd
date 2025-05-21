import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import {
  FiUser,
  FiSend,
  FiEye,
  FiEdit2,
  FiTrash2,
  FiX,
  FiCheck,
  FiMessageSquare,
  FiPaperclip,
  FiFile,
  FiDownload,
  FiLoader
} from 'react-icons/fi';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from 'react-toastify';

// Tipos
interface Attachment {
  id: number;
  fileName: string;
  fileType: string;
  fileSize: number;
  downloadUrl: string;
  uploadedAt: string;
}

interface Comment {
  id: number;
  userId: number;
  userName: string;
  userFullName?: string;
  content: string;
  createdAt: string;
  readBy?: number[];
  readByCurrentUser?: boolean;
  attachments?: Attachment[];
}

interface CommentSectionProps {
  comments: Comment[];
  isLoading: boolean;
  onAddComment: (content: string, files?: File[]) => Promise<void>;
  onEditComment?: (id: number, content: string) => Promise<void>;
  onDeleteComment?: (id: number) => Promise<void>;
  onMarkAsRead?: (id: number) => Promise<void>;
  onDownloadAttachment?: (attachmentId: number, fileName: string) => Promise<void>;
  currentUserId?: number;
  placeholder?: string;
  readOnly?: boolean;
  allowAttachments?: boolean;
}

// Componentes estilizados
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
`;

const Title = styled.h3`
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  color: ${({ theme }) => theme.text};
`;

const CommentsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-height: 400px;
  overflow-y: auto;
  padding: 0 8px 8px 8px;
  margin-bottom: 16px;

  /* Estilo para la barra de desplazamiento */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.background};
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.border};
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.textSecondary};
  }
`;

const CommentItem = styled.div<{ $isCurrentUser?: boolean }>`
  display: flex;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  background-color: ${({ theme, $isCurrentUser }) =>
    $isCurrentUser ? `${theme.primary}15` : theme.backgroundSecondary};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-left: ${({ $isCurrentUser }) => ($isCurrentUser ? 'auto' : '0')};
  margin-right: ${({ $isCurrentUser }) => ($isCurrentUser ? '0' : 'auto')};
  max-width: 85%;
  position: relative;
  border-left: ${({ theme, $isCurrentUser }) =>
    $isCurrentUser ? `3px solid ${theme.primary}` : 'none'};
  border-right: ${({ theme, $isCurrentUser }) =>
    !$isCurrentUser ? `3px solid ${theme.backgroundTertiary}` : 'none'};
`;

const CommentAvatar = styled.div<{ $userInitial?: string; $isCurrentUser?: boolean }>`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: ${({ theme, $isCurrentUser }) =>
    $isCurrentUser ? theme.primary : theme.backgroundTertiary};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
  flex-shrink: 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const CommentContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const CommentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CommentAuthor = styled.span<{ $isCurrentUser?: boolean }>`
  font-weight: 600;
  font-size: 14px;
  color: ${({ theme, $isCurrentUser }) =>
    $isCurrentUser ? theme.primary : theme.text};
`;

const CommentDate = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.textSecondary};
`;

const CommentText = styled.div<{ $isRead?: boolean }>`
  font-size: 14px;
  color: ${({ theme }) => theme.text};
  white-space: pre-wrap;
  word-break: break-word;
  opacity: ${({ $isRead }) => ($isRead ? 1 : 0.9)};
  position: relative;
  background-color: transparent;
  padding: 8px;
  border-radius: 6px;
`;

const CommentActions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;
  justify-content: flex-end;
`;

const CommentActionButton = styled.button`
  background: none;
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: ${({ theme }) => theme.textSecondary};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.backgroundHover};
    color: ${({ theme }) => theme.text};
  }
`;

const CommentForm = styled.form`
  display: flex;
  gap: 12px;
  margin-top: 8px;
  background-color: ${({ theme }) => theme.backgroundSecondary};
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const CommentInput = styled.textarea`
  flex: 1;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.border};
  background-color: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  font-size: 14px;
  resize: vertical;
  min-height: 80px;
  transition: all 0.2s;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) inset;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => `${theme.primary}30`};
  }

  &::placeholder {
    color: ${({ theme }) => theme.textSecondary};
    opacity: 0.8;
  }
`;

const SendButton = styled.button`
  padding: 8px 16px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.primary};
  color: white;
  font-weight: 600;
  font-size: 14px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  align-self: flex-end;
  transition: all 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.primaryDark};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.border};
    cursor: not-allowed;
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px 16px;
  text-align: center;
  color: ${({ theme }) => theme.textSecondary};
  gap: 12px;
`;

const LoadingState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px 16px;
  text-align: center;
  color: ${({ theme }) => theme.textSecondary};
  gap: 12px;
`;

const SpinningLoader = styled.div`
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top: 3px solid ${({ theme }) => theme.primary};
  width: 24px;
  height: 24px;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const ReadIndicator = styled.div<{ $isRead?: boolean }>`
  position: absolute;
  bottom: 4px;
  right: 4px;
  color: ${({ $isRead, theme }) => ($isRead ? theme.success : theme.textSecondary)};
  font-size: 12px;
  cursor: help;
  opacity: 0.7;

  &:hover {
    opacity: 1;
  }
`;

const CommentEditForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 4px;
`;

const CommentEditInput = styled.textarea`
  padding: 8px;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.border};
  background-color: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  font-size: 14px;
  resize: vertical;
  min-height: 60px;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => `${theme.primary}30`};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
`;

// Componentes para archivos adjuntos
const AttachmentsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 8px;
  padding: 8px;
  border-radius: 6px;
  background-color: ${({ theme }) => `${theme.backgroundTertiary}50`};
`;

const AttachmentItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.backgroundSecondary};
  border: 1px solid ${({ theme }) => theme.border};
  font-size: 12px;

  &:hover {
    background-color: ${({ theme }) => theme.backgroundHover};
  }
`;

const AttachmentName = styled.span`
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const AttachmentSize = styled.span`
  color: ${({ theme }) => theme.textSecondary};
  font-size: 11px;
`;

const AttachmentAction = styled.button`
  background: none;
  border: none;
  padding: 4px;
  border-radius: 4px;
  color: ${({ theme }) => theme.textSecondary};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: ${({ theme }) => theme.primary};
    background-color: ${({ theme }) => `${theme.primary}15`};
  }
`;

const FileInputContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
`;

const FileInput = styled.div`
  position: relative;
  overflow: hidden;
  display: inline-block;

  button {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    border-radius: 4px;
    background-color: ${({ theme }) => theme.backgroundSecondary};
    border: 1px solid ${({ theme }) => theme.border};
    color: ${({ theme }) => theme.text};
    font-size: 12px;
    cursor: pointer;

    &:hover {
      background-color: ${({ theme }) => theme.backgroundHover};
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }
`;

const HiddenInput = styled.input`
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
  }
`;

const SelectedFilesList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
`;

const SelectedFileItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  border-radius: 4px;
  background-color: ${({ theme }) => `${theme.primary}15`};
  font-size: 12px;
  max-width: 200px;
`;

const SelectedFileName = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const RemoveFileButton = styled.button`
  background: none;
  border: none;
  padding: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.textSecondary};
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.error};
  }
`;

// Animación para el spinner
const spinAnimation = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const LoadingSpinner = styled(FiLoader)`
  animation: ${spinAnimation} 1s linear infinite;
`;

// Componente principal
const CommentSection: React.FC<CommentSectionProps> = ({
  comments,
  isLoading,
  onAddComment,
  onEditComment,
  onDeleteComment,
  onMarkAsRead,
  onDownloadAttachment,
  currentUserId,
  placeholder = 'Escribe un comentario...',
  readOnly = false,
  allowAttachments = true
}) => {
  const [commentContent, setCommentContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [showAttachmentInput, setShowAttachmentInput] = useState(false);
  const commentInputRef = useRef<HTMLTextAreaElement>(null);

  // Formatear fecha
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "d 'de' MMMM 'de' yyyy, HH:mm", { locale: es });
    } catch (error) {
      return dateString;
    }
  };

  // Manejar selección de archivos
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB en bytes
      const MAX_TOTAL_FILES = 5; // Máximo 5 archivos por comentario

      // Convertir FileList a array
      const newFiles = Array.from(e.target.files);

      // Validar el número total de archivos
      if (selectedFiles.length + newFiles.length > MAX_TOTAL_FILES) {
        toast.error(`No puedes adjuntar más de ${MAX_TOTAL_FILES} archivos por comentario`);
        e.target.value = '';
        return;
      }

      // Validar el tamaño de los archivos
      const oversizedFiles = newFiles.filter(file => file.size > MAX_FILE_SIZE);
      if (oversizedFiles.length > 0) {
        const fileNames = oversizedFiles.map(file => file.name).join(', ');
        toast.error(`Los siguientes archivos exceden el tamaño máximo permitido (15MB): ${fileNames}`);

        // Filtrar solo los archivos válidos
        const validFiles = newFiles.filter(file => file.size <= MAX_FILE_SIZE);
        setSelectedFiles(prev => [...prev, ...validFiles]);
      } else {
        // Todos los archivos son válidos
        setSelectedFiles(prev => [...prev, ...newFiles]);
      }

      // Limpiar el input para permitir seleccionar el mismo archivo nuevamente
      e.target.value = '';
    }
  };

  // Eliminar un archivo seleccionado
  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Limpiar todos los archivos seleccionados
  const clearSelectedFiles = () => {
    setSelectedFiles([]);
  };

  // Manejar descarga de archivo adjunto
  const handleDownloadAttachment = async (attachmentId: number, fileName: string) => {
    if (!onDownloadAttachment) return;

    try {
      await onDownloadAttachment(attachmentId, fileName);
    } catch (error) {
      console.error('Error al descargar archivo:', error);
      toast.error('Error al descargar el archivo');
    }
  };

  // Manejar envío de comentario
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!commentContent.trim() && selectedFiles.length === 0) || submitting) return;

    // Validar el tamaño de los archivos antes de enviar
    const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB en bytes
    const oversizedFiles = selectedFiles.filter(file => file.size > MAX_FILE_SIZE);

    if (oversizedFiles.length > 0) {
      const fileNames = oversizedFiles.map(file => file.name).join(', ');
      toast.error(`Los siguientes archivos exceden el tamaño máximo permitido (15MB): ${fileNames}`);
      return;
    }

    setSubmitting(true);
    try {
      // Enviar comentario con archivos adjuntos si hay alguno
      await onAddComment(commentContent, selectedFiles.length > 0 ? selectedFiles : undefined);

      // Limpiar formulario
      setCommentContent('');
      clearSelectedFiles();
      setShowAttachmentInput(false);

      toast.success('Comentario enviado correctamente');
    } catch (error: any) {
      console.error('Error al enviar comentario:', error);

      // Mostrar mensaje de error específico si está disponible
      if (error.message && typeof error.message === 'string') {
        if (error.message.includes('tamaño') || error.message.includes('excede')) {
          toast.error(`Error: ${error.message}`);
        } else {
          toast.error('Error al enviar el comentario. Por favor, intente nuevamente.');
        }
      } else {
        toast.error('Error al enviar el comentario. Por favor, intente nuevamente.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Manejar edición de comentario
  const handleEditComment = (comment: Comment) => {
    if (!onEditComment) return;
    setEditingCommentId(comment.id);
    setEditContent(comment.content);
  };

  // Manejar eliminación de comentario
  const handleDeleteComment = async (id: number) => {
    if (!onDeleteComment) return;
    if (!window.confirm('¿Estás seguro de que deseas eliminar este comentario?')) return;

    try {
      await onDeleteComment(id);
      toast.success('Comentario eliminado correctamente');
    } catch (error) {
      console.error('Error al eliminar comentario:', error);
      toast.error('Error al eliminar el comentario');
    }
  };

  // Manejar guardado de edición
  const handleSaveEdit = async (id: number) => {
    if (!onEditComment || !editContent.trim()) return;

    try {
      await onEditComment(id, editContent);
      setEditingCommentId(null);
      toast.success('Comentario actualizado correctamente');
    } catch (error) {
      console.error('Error al actualizar comentario:', error);
      toast.error('Error al actualizar el comentario');
    }
  };

  // Cancelar edición
  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditContent('');
  };

  // Marcar como leído
  const handleMarkAsRead = async (id: number) => {
    if (!onMarkAsRead) return;

    try {
      await onMarkAsRead(id);
    } catch (error) {
      console.error('Error al marcar como leído:', error);
    }
  };

  // Verificar si un comentario es del usuario actual
  const isCurrentUserComment = (userId: number) => {
    return currentUserId === userId;
  };

  // Obtener inicial del usuario
  const getUserInitial = (userName: string) => {
    return userName ? userName.charAt(0).toUpperCase() : '';
  };

  return (
    <Container>
      <Header>
        <FiMessageSquare size={18} />
        <Title>Comentarios</Title>
      </Header>

      {isLoading ? (
        <LoadingState>
          <SpinningLoader />
          <p>Cargando comentarios...</p>
          <p style={{ fontSize: '12px', opacity: 0.7, marginTop: '4px' }}>
            Obteniendo datos desde el servidor
          </p>
        </LoadingState>
      ) : comments && comments.length > 0 ? (
        <CommentsList>
          {comments.map((comment) => {
            const userInitial = getUserInitial(comment.userName);
            const isEditing = editingCommentId === comment.id;
            const isOwnComment = isCurrentUserComment(comment.userId);

            // Asegurarse de que el comentario tenga todos los campos necesarios
            const safeComment = {
              ...comment,
              userName: comment.userFullName || comment.userName || 'Usuario',
              content: comment.content || '',
              createdAt: comment.createdAt || new Date().toISOString(),
              readByCurrentUser: comment.readByCurrentUser !== undefined ? comment.readByCurrentUser : false,
              readBy: comment.readBy || []
            };

            return (
              <CommentItem key={safeComment.id} $isCurrentUser={isOwnComment}>
                <CommentAvatar $userInitial={userInitial} $isCurrentUser={isOwnComment}>
                  {userInitial || <FiUser size={18} />}
                </CommentAvatar>
                <CommentContent>
                  <CommentHeader>
                    <CommentAuthor $isCurrentUser={isOwnComment}>
                      {isOwnComment ? 'Tú' : safeComment.userName}
                    </CommentAuthor>
                    <CommentDate>{formatDate(safeComment.createdAt)}</CommentDate>
                  </CommentHeader>

                  {isEditing ? (
                    <CommentEditForm onSubmit={(e) => {
                      e.preventDefault();
                      handleSaveEdit(safeComment.id);
                    }}>
                      <CommentEditInput
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        autoFocus
                      />
                      <ButtonGroup>
                        <CommentActionButton type="button" onClick={handleCancelEdit}>
                          <FiX size={14} />
                          Cancelar
                        </CommentActionButton>
                        <CommentActionButton
                          type="submit"
                          style={{ color: '#10b981' }}
                        >
                          <FiCheck size={14} />
                          Guardar
                        </CommentActionButton>
                      </ButtonGroup>
                    </CommentEditForm>
                  ) : (
                    <>
                      <CommentText $isRead={safeComment.readByCurrentUser}>
                        {safeComment.content}
                        <ReadIndicator $isRead={safeComment.readByCurrentUser}>
                          <FiEye size={14} title={safeComment.readByCurrentUser ? "Leído" : "No leído"} />
                        </ReadIndicator>
                      </CommentText>

                      {/* Mostrar archivos adjuntos si existen */}
                      {safeComment.attachments && safeComment.attachments.length > 0 && (
                        <AttachmentsList>
                          {safeComment.attachments.map((attachment) => (
                            <AttachmentItem key={attachment.id}>
                              <FiFile size={14} />
                              <AttachmentName>{attachment.fileName}</AttachmentName>
                              <AttachmentSize>
                                {(attachment.fileSize / 1024).toFixed(1)} KB
                              </AttachmentSize>
                              <AttachmentAction
                                onClick={() => handleDownloadAttachment(attachment.id, attachment.fileName)}
                                title="Descargar archivo"
                              >
                                <FiDownload size={14} />
                              </AttachmentAction>
                            </AttachmentItem>
                          ))}
                        </AttachmentsList>
                      )}
                    </>
                  )}

                  {!isEditing && (
                    <CommentActions>
                      {isOwnComment && onEditComment && (
                        <CommentActionButton onClick={() => handleEditComment(safeComment)}>
                          <FiEdit2 size={14} />
                          Editar
                        </CommentActionButton>
                      )}
                      {isOwnComment && onDeleteComment && (
                        <CommentActionButton onClick={() => handleDeleteComment(safeComment.id)}>
                          <FiTrash2 size={14} />
                          Eliminar
                        </CommentActionButton>
                      )}
                      {!safeComment.readByCurrentUser && onMarkAsRead && (
                        <CommentActionButton onClick={() => handleMarkAsRead(safeComment.id)}>
                          <FiEye size={14} />
                          Marcar como leído
                        </CommentActionButton>
                      )}
                      {safeComment.readBy && safeComment.readBy.length > 0 && (
                        <CommentActionButton title={`Leído por ${safeComment.readBy.length} usuario(s)`}>
                          <FiEye size={14} />
                          <span>{safeComment.readBy.length}</span>
                        </CommentActionButton>
                      )}
                    </CommentActions>
                  )}
                </CommentContent>
              </CommentItem>
            );
          })}
        </CommentsList>
      ) : (
        <EmptyState>
          <FiMessageSquare size={24} />
          <p>No hay comentarios todavía</p>
          <p style={{ fontSize: '14px', opacity: 0.7, marginTop: '8px' }}>
            Sé el primero en comentar en esta solicitud
          </p>
        </EmptyState>
      )}

      {!readOnly && (
        <CommentForm onSubmit={handleSubmitComment}>
          <CommentInput
            ref={commentInputRef}
            placeholder={placeholder}
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            disabled={submitting}
          />

          {/* Botones de acción */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {/* Botón para adjuntar archivos */}
            {allowAttachments && (
              <FileInput>
                <button
                  type="button"
                  onClick={() => setShowAttachmentInput(!showAttachmentInput)}
                  disabled={submitting}
                >
                  <FiPaperclip size={16} />
                  {selectedFiles.length > 0 ? `${selectedFiles.length} archivo(s)` : 'Adjuntar'}
                </button>
                <HiddenInput
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  disabled={submitting}
                />
              </FileInput>
            )}

            {/* Botón de enviar */}
            <SendButton
              type="submit"
              disabled={((!commentContent.trim() && selectedFiles.length === 0) || submitting)}
            >
              <FiSend size={16} />
              Enviar
            </SendButton>
          </div>
        </CommentForm>
      )}

      {/* Lista de archivos seleccionados */}
      {selectedFiles.length > 0 && (
        <SelectedFilesList>
          {selectedFiles.map((file, index) => (
            <SelectedFileItem key={index}>
              <FiFile size={14} />
              <SelectedFileName>{file.name}</SelectedFileName>
              <AttachmentSize>({(file.size / 1024).toFixed(1)} KB)</AttachmentSize>
              <RemoveFileButton
                type="button"
                onClick={() => handleRemoveFile(index)}
                disabled={submitting}
                title="Eliminar archivo"
              >
                <FiX size={14} />
              </RemoveFileButton>
            </SelectedFileItem>
          ))}
        </SelectedFilesList>
      )}
    </Container>
  );
};

export default CommentSection;
