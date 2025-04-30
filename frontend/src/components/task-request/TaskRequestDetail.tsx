import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Button,
  Divider,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Send as SendIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  ArrowBack as ArrowBackIcon,
  Comment as CommentIcon,
  AttachFile as AttachFileIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { TaskRequest, TaskRequestStatus, TaskRequestCommentCreateDto } from '../../types/TaskRequest';
import { taskRequestService } from '../../services/taskRequestService';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';

const TaskRequestDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [taskRequest, setTaskRequest] = useState<TaskRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [commentContent, setCommentContent] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const fetchTaskRequest = async () => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await taskRequestService.getTaskRequestById(parseInt(id));
      setTaskRequest(response);
    } catch (err) {
      console.error('Error al cargar la solicitud:', err);
      setError('Error al cargar la solicitud. Por favor, inténtelo de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTaskRequest();
  }, [id]);

  const handleEditTaskRequest = () => {
    if (!id) return;
    navigate(`/task-requests/${id}/edit`);
  };

  const handleDeleteTaskRequest = async () => {
    if (!id) return;
    
    if (window.confirm('¿Está seguro de que desea eliminar esta solicitud?')) {
      try {
        await taskRequestService.deleteTaskRequest(parseInt(id));
        toast.success('Solicitud eliminada correctamente');
        navigate('/task-requests');
      } catch (err) {
        console.error('Error al eliminar la solicitud:', err);
        toast.error('Error al eliminar la solicitud');
      }
    }
  };

  const handleSubmitTaskRequest = async () => {
    if (!id || !taskRequest) return;
    
    try {
      const updatedTaskRequest = await taskRequestService.submitTaskRequest(parseInt(id));
      setTaskRequest(updatedTaskRequest);
      toast.success('Solicitud enviada correctamente');
    } catch (err) {
      console.error('Error al enviar la solicitud:', err);
      toast.error('Error al enviar la solicitud');
    }
  };

  const handleAssignTaskRequest = async () => {
    if (!id || !taskRequest) return;
    
    try {
      const updatedTaskRequest = await taskRequestService.assignTaskRequest(parseInt(id));
      setTaskRequest(updatedTaskRequest);
      toast.success('Solicitud asignada correctamente');
    } catch (err) {
      console.error('Error al asignar la solicitud:', err);
      toast.error('Error al asignar la solicitud');
    }
  };

  const handleCompleteTaskRequest = async () => {
    if (!id || !taskRequest) return;
    
    try {
      const updatedTaskRequest = await taskRequestService.completeTaskRequest(parseInt(id));
      setTaskRequest(updatedTaskRequest);
      toast.success('Solicitud completada correctamente');
    } catch (err) {
      console.error('Error al completar la solicitud:', err);
      toast.error('Error al completar la solicitud');
    }
  };

  const handleCancelTaskRequest = async () => {
    if (!id || !taskRequest) return;
    
    if (window.confirm('¿Está seguro de que desea cancelar esta solicitud?')) {
      try {
        const updatedTaskRequest = await taskRequestService.cancelTaskRequest(parseInt(id));
        setTaskRequest(updatedTaskRequest);
        toast.success('Solicitud cancelada correctamente');
      } catch (err) {
        console.error('Error al cancelar la solicitud:', err);
        toast.error('Error al cancelar la solicitud');
      }
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !taskRequest || !commentContent.trim()) return;
    
    setSubmittingComment(true);
    try {
      const comment: TaskRequestCommentCreateDto = {
        taskRequestId: parseInt(id),
        content: commentContent
      };
      
      const updatedTaskRequest = await taskRequestService.addComment(comment);
      setTaskRequest(updatedTaskRequest);
      setCommentContent('');
      toast.success('Comentario añadido correctamente');
    } catch (err) {
      console.error('Error al añadir el comentario:', err);
      toast.error('Error al añadir el comentario');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const getStatusChip = (status: string) => {
    let color: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' = 'default';
    let label = status;
    
    switch (status) {
      case TaskRequestStatus.DRAFT:
        color = 'default';
        label = 'Borrador';
        break;
      case TaskRequestStatus.SUBMITTED:
        color = 'info';
        label = 'Enviada';
        break;
      case TaskRequestStatus.ASSIGNED:
        color = 'warning';
        label = 'Asignada';
        break;
      case TaskRequestStatus.COMPLETED:
        color = 'success';
        label = 'Completada';
        break;
      case TaskRequestStatus.CANCELLED:
        color = 'error';
        label = 'Cancelada';
        break;
    }
    
    return <Chip label={label} color={color} />;
  };

  const getPriorityChip = (priority: string) => {
    let color: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' = 'default';
    let label = priority;
    
    switch (priority) {
      case 'CRITICAL':
        color = 'error';
        label = 'Crítica';
        break;
      case 'HIGH':
        color = 'warning';
        label = 'Alta';
        break;
      case 'MEDIUM':
        color = 'primary';
        label = 'Media';
        break;
      case 'LOW':
        color = 'info';
        label = 'Baja';
        break;
      case 'TRIVIAL':
        color = 'default';
        label = 'Trivial';
        break;
    }
    
    return <Chip label={label} color={color} />;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: es });
  };

  const canEdit = () => {
    if (!taskRequest) return false;
    return (
      (currentUser?.roles.includes('ROLE_ADMIN') || 
       (currentUser?.id === taskRequest.requesterId && taskRequest.status === TaskRequestStatus.DRAFT))
    );
  };

  const canSubmit = () => {
    if (!taskRequest) return false;
    return (
      (currentUser?.roles.includes('ROLE_ADMIN') || 
       (currentUser?.id === taskRequest.requesterId && taskRequest.status === TaskRequestStatus.DRAFT))
    );
  };

  const canAssign = () => {
    if (!taskRequest) return false;
    return (
      (currentUser?.roles.includes('ROLE_ADMIN') || currentUser?.roles.includes('ROLE_ASIGNADOR')) && 
      taskRequest.status === TaskRequestStatus.SUBMITTED
    );
  };

  const canComplete = () => {
    if (!taskRequest) return false;
    return (
      (currentUser?.roles.includes('ROLE_ADMIN') || currentUser?.roles.includes('ROLE_EJECUTOR')) && 
      taskRequest.status === TaskRequestStatus.ASSIGNED
    );
  };

  const canCancel = () => {
    if (!taskRequest) return false;
    return (
      (currentUser?.roles.includes('ROLE_ADMIN') || 
       (currentUser?.id === taskRequest.requesterId && 
        (taskRequest.status === TaskRequestStatus.DRAFT || 
         taskRequest.status === TaskRequestStatus.SUBMITTED || 
         taskRequest.status === TaskRequestStatus.ASSIGNED)))
    );
  };

  const canDelete = () => {
    return currentUser?.roles.includes('ROLE_ADMIN');
  };

  return (
    <Box sx={{ width: '100%', p: 2 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={handleGoBack}
        sx={{ mb: 2 }}
      >
        Volver
      </Button>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : taskRequest ? (
        <>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h5" component="h1">
                Solicitud #{taskRequest.id}: {taskRequest.title}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {canEdit() && (
                  <Tooltip title="Editar">
                    <Button
                      variant="outlined"
                      color="primary"
                      startIcon={<EditIcon />}
                      onClick={handleEditTaskRequest}
                    >
                      Editar
                    </Button>
                  </Tooltip>
                )}
                
                {canSubmit() && (
                  <Tooltip title="Enviar">
                    <Button
                      variant="outlined"
                      color="info"
                      startIcon={<SendIcon />}
                      onClick={handleSubmitTaskRequest}
                    >
                      Enviar
                    </Button>
                  </Tooltip>
                )}
                
                {canAssign() && (
                  <Tooltip title="Asignar">
                    <Button
                      variant="outlined"
                      color="warning"
                      startIcon={<AssignmentIcon />}
                      onClick={handleAssignTaskRequest}
                    >
                      Asignar
                    </Button>
                  </Tooltip>
                )}
                
                {canComplete() && (
                  <Tooltip title="Completar">
                    <Button
                      variant="outlined"
                      color="success"
                      startIcon={<CheckCircleIcon />}
                      onClick={handleCompleteTaskRequest}
                    >
                      Completar
                    </Button>
                  </Tooltip>
                )}
                
                {canCancel() && (
                  <Tooltip title="Cancelar">
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<CancelIcon />}
                      onClick={handleCancelTaskRequest}
                    >
                      Cancelar
                    </Button>
                  </Tooltip>
                )}
                
                {canDelete() && (
                  <Tooltip title="Eliminar">
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={handleDeleteTaskRequest}
                    >
                      Eliminar
                    </Button>
                  </Tooltip>
                )}
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" fontWeight="bold">Estado:</Typography>
                <Box sx={{ mt: 1 }}>{getStatusChip(taskRequest.status)}</Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" fontWeight="bold">Prioridad:</Typography>
                <Box sx={{ mt: 1 }}>{getPriorityChip(taskRequest.priority)}</Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" fontWeight="bold">Categoría:</Typography>
                <Box sx={{ mt: 1 }}>
                  <Chip
                    label={taskRequest.category.name}
                    style={{
                      backgroundColor: taskRequest.category.color,
                      color: '#fff'
                    }}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" fontWeight="bold">Fecha límite:</Typography>
                <Typography>{taskRequest.dueDate ? formatDate(taskRequest.dueDate) : 'No especificada'}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" fontWeight="bold">Solicitante:</Typography>
                <Typography>{taskRequest.requesterName || `Usuario ${taskRequest.requesterId}`}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" fontWeight="bold">Fecha de solicitud:</Typography>
                <Typography>{formatDate(taskRequest.requestDate)}</Typography>
              </Grid>
              {taskRequest.assignerId && (
                <>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" fontWeight="bold">Asignador:</Typography>
                    <Typography>{taskRequest.assignerName || `Usuario ${taskRequest.assignerId}`}</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" fontWeight="bold">Fecha de asignación:</Typography>
                    <Typography>{taskRequest.assignmentDate ? formatDate(taskRequest.assignmentDate) : '-'}</Typography>
                  </Grid>
                </>
              )}
              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight="bold">Descripción:</Typography>
                <Typography sx={{ whiteSpace: 'pre-line', mt: 1 }}>{taskRequest.description}</Typography>
              </Grid>
              {taskRequest.notes && (
                <Grid item xs={12}>
                  <Typography variant="subtitle1" fontWeight="bold">Notas adicionales:</Typography>
                  <Typography sx={{ whiteSpace: 'pre-line', mt: 1 }}>{taskRequest.notes}</Typography>
                </Grid>
              )}
            </Grid>
          </Paper>

          {/* Sección de archivos adjuntos */}
          {taskRequest.attachments && taskRequest.attachments.length > 0 && (
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                <AttachFileIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                Archivos adjuntos
              </Typography>
              <List>
                {taskRequest.attachments.map((attachment) => (
                  <ListItem key={attachment.id}>
                    <ListItemAvatar>
                      <Avatar>
                        <AttachFileIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={attachment.fileName}
                      secondary={`Subido por: ${attachment.userName || `Usuario ${attachment.userId}`} - ${formatDate(attachment.uploadedAt)}`}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          )}

          {/* Sección de comentarios */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              <CommentIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
              Comentarios
            </Typography>
            
            {taskRequest.comments && taskRequest.comments.length > 0 ? (
              <List>
                {taskRequest.comments.map((comment) => (
                  <ListItem key={comment.id} alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar>
                        <PersonIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={comment.userName || `Usuario ${comment.userId}`}
                      secondary={
                        <>
                          <Typography
                            component="span"
                            variant="body2"
                            color="text.primary"
                            sx={{ display: 'block', mb: 1 }}
                          >
                            {formatDate(comment.createdAt)}
                          </Typography>
                          {comment.content}
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No hay comentarios todavía.
              </Typography>
            )}
            
            <Divider sx={{ my: 2 }} />
            
            <Box component="form" onSubmit={handleAddComment}>
              <TextField
                fullWidth
                label="Añadir un comentario"
                multiline
                rows={3}
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                disabled={submittingComment}
                sx={{ mb: 2 }}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={!commentContent.trim() || submittingComment}
                startIcon={<CommentIcon />}
              >
                {submittingComment ? 'Enviando...' : 'Añadir comentario'}
              </Button>
            </Box>
          </Paper>
        </>
      ) : (
        <Alert severity="info">No se encontró la solicitud</Alert>
      )}
    </Box>
  );
};

export default TaskRequestDetail;
