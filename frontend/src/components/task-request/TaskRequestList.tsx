import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  Button,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Add as AddIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Send as SendIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { TaskRequest, TaskRequestPage, TaskRequestStatus } from '../../types/TaskRequest';
import { taskRequestService } from '../../services/taskRequestService';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';

interface TaskRequestListProps {
  listType: 'all' | 'my-requests' | 'assigned-to-me' | 'by-status';
  status?: string;
  title: string;
}

const TaskRequestList: React.FC<TaskRequestListProps> = ({ listType, status, title }) => {
  const [taskRequests, setTaskRequests] = useState<TaskRequestPage>({
    taskRequests: [],
    totalPages: 0,
    totalItems: 0,
    currentPage: 0
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const fetchTaskRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      let response: TaskRequestPage;
      
      switch (listType) {
        case 'all':
          response = await taskRequestService.getAllTaskRequests(page, rowsPerPage);
          break;
        case 'my-requests':
          response = await taskRequestService.getMyTaskRequests(page, rowsPerPage);
          break;
        case 'assigned-to-me':
          response = await taskRequestService.getAssignedTaskRequests(page, rowsPerPage);
          break;
        case 'by-status':
          if (!status) {
            throw new Error('Se requiere un estado para filtrar las solicitudes');
          }
          response = await taskRequestService.getTaskRequestsByStatus(status, page, rowsPerPage);
          break;
        default:
          throw new Error('Tipo de lista no válido');
      }
      
      setTaskRequests(response);
    } catch (err) {
      console.error('Error al cargar las solicitudes:', err);
      setError('Error al cargar las solicitudes. Por favor, inténtelo de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTaskRequests();
  }, [listType, status, page, rowsPerPage]);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewTaskRequest = (id: number) => {
    navigate(`/task-requests/${id}`);
  };

  const handleEditTaskRequest = (id: number) => {
    navigate(`/task-requests/${id}/edit`);
  };

  const handleCreateTaskRequest = () => {
    navigate('/task-requests/new');
  };

  const handleDeleteTaskRequest = async (id: number) => {
    if (window.confirm('¿Está seguro de que desea eliminar esta solicitud?')) {
      try {
        await taskRequestService.deleteTaskRequest(id);
        toast.success('Solicitud eliminada correctamente');
        fetchTaskRequests();
      } catch (err) {
        console.error('Error al eliminar la solicitud:', err);
        toast.error('Error al eliminar la solicitud');
      }
    }
  };

  const handleSubmitTaskRequest = async (id: number) => {
    try {
      await taskRequestService.submitTaskRequest(id);
      toast.success('Solicitud enviada correctamente');
      fetchTaskRequests();
    } catch (err) {
      console.error('Error al enviar la solicitud:', err);
      toast.error('Error al enviar la solicitud');
    }
  };

  const handleAssignTaskRequest = async (id: number) => {
    try {
      await taskRequestService.assignTaskRequest(id);
      toast.success('Solicitud asignada correctamente');
      fetchTaskRequests();
    } catch (err) {
      console.error('Error al asignar la solicitud:', err);
      toast.error('Error al asignar la solicitud');
    }
  };

  const handleCompleteTaskRequest = async (id: number) => {
    try {
      await taskRequestService.completeTaskRequest(id);
      toast.success('Solicitud completada correctamente');
      fetchTaskRequests();
    } catch (err) {
      console.error('Error al completar la solicitud:', err);
      toast.error('Error al completar la solicitud');
    }
  };

  const handleCancelTaskRequest = async (id: number) => {
    if (window.confirm('¿Está seguro de que desea cancelar esta solicitud?')) {
      try {
        await taskRequestService.cancelTaskRequest(id);
        toast.success('Solicitud cancelada correctamente');
        fetchTaskRequests();
      } catch (err) {
        console.error('Error al cancelar la solicitud:', err);
        toast.error('Error al cancelar la solicitud');
      }
    }
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
    
    return <Chip label={label} color={color} size="small" />;
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
    
    return <Chip label={label} color={color} size="small" />;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: es });
  };

  const canEdit = (taskRequest: TaskRequest) => {
    return (
      (currentUser?.roles.includes('ROLE_ADMIN') || 
       (currentUser?.id === taskRequest.requesterId && taskRequest.status === TaskRequestStatus.DRAFT))
    );
  };

  const canSubmit = (taskRequest: TaskRequest) => {
    return (
      (currentUser?.roles.includes('ROLE_ADMIN') || 
       (currentUser?.id === taskRequest.requesterId && taskRequest.status === TaskRequestStatus.DRAFT))
    );
  };

  const canAssign = (taskRequest: TaskRequest) => {
    return (
      (currentUser?.roles.includes('ROLE_ADMIN') || currentUser?.roles.includes('ROLE_ASIGNADOR')) && 
      taskRequest.status === TaskRequestStatus.SUBMITTED
    );
  };

  const canComplete = (taskRequest: TaskRequest) => {
    return (
      (currentUser?.roles.includes('ROLE_ADMIN') || currentUser?.roles.includes('ROLE_EJECUTOR')) && 
      taskRequest.status === TaskRequestStatus.ASSIGNED
    );
  };

  const canCancel = (taskRequest: TaskRequest) => {
    return (
      (currentUser?.roles.includes('ROLE_ADMIN') || 
       (currentUser?.id === taskRequest.requesterId && 
        (taskRequest.status === TaskRequestStatus.DRAFT || 
         taskRequest.status === TaskRequestStatus.SUBMITTED || 
         taskRequest.status === TaskRequestStatus.ASSIGNED)))
    );
  };

  const canDelete = (taskRequest: TaskRequest) => {
    return currentUser?.roles.includes('ROLE_ADMIN');
  };

  const canCreate = () => {
    return currentUser?.roles.includes('ROLE_ADMIN') || currentUser?.roles.includes('ROLE_SOLICITANTE');
  };

  return (
    <Box sx={{ width: '100%', p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          {title}
        </Typography>
        {canCreate() && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleCreateTaskRequest}
          >
            Nueva Solicitud
          </Button>
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {taskRequests.taskRequests.length === 0 ? (
            <Alert severity="info">No hay solicitudes para mostrar</Alert>
          ) : (
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
              <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Título</TableCell>
                      <TableCell>Categoría</TableCell>
                      <TableCell>Prioridad</TableCell>
                      <TableCell>Estado</TableCell>
                      <TableCell>Solicitante</TableCell>
                      <TableCell>Fecha de Solicitud</TableCell>
                      <TableCell>Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {taskRequests.taskRequests.map((taskRequest) => (
                      <TableRow hover key={taskRequest.id}>
                        <TableCell>{taskRequest.id}</TableCell>
                        <TableCell>{taskRequest.title}</TableCell>
                        <TableCell>
                          <Chip
                            label={taskRequest.category.name}
                            style={{
                              backgroundColor: taskRequest.category.color,
                              color: '#fff'
                            }}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{getPriorityChip(taskRequest.priority)}</TableCell>
                        <TableCell>{getStatusChip(taskRequest.status)}</TableCell>
                        <TableCell>{taskRequest.requesterName || `Usuario ${taskRequest.requesterId}`}</TableCell>
                        <TableCell>{formatDate(taskRequest.requestDate)}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Tooltip title="Ver detalles">
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={() => handleViewTaskRequest(taskRequest.id)}
                              >
                                <VisibilityIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            
                            {canEdit(taskRequest) && (
                              <Tooltip title="Editar">
                                <IconButton
                                  size="small"
                                  color="primary"
                                  onClick={() => handleEditTaskRequest(taskRequest.id)}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                            
                            {canSubmit(taskRequest) && (
                              <Tooltip title="Enviar">
                                <IconButton
                                  size="small"
                                  color="info"
                                  onClick={() => handleSubmitTaskRequest(taskRequest.id)}
                                >
                                  <SendIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                            
                            {canAssign(taskRequest) && (
                              <Tooltip title="Asignar">
                                <IconButton
                                  size="small"
                                  color="warning"
                                  onClick={() => handleAssignTaskRequest(taskRequest.id)}
                                >
                                  <AssignmentIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                            
                            {canComplete(taskRequest) && (
                              <Tooltip title="Completar">
                                <IconButton
                                  size="small"
                                  color="success"
                                  onClick={() => handleCompleteTaskRequest(taskRequest.id)}
                                >
                                  <CheckCircleIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                            
                            {canCancel(taskRequest) && (
                              <Tooltip title="Cancelar">
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => handleCancelTaskRequest(taskRequest.id)}
                                >
                                  <CancelIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                            
                            {canDelete(taskRequest) && (
                              <Tooltip title="Eliminar">
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => handleDeleteTaskRequest(taskRequest.id)}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={taskRequests.totalItems}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage="Filas por página:"
                labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
              />
            </Paper>
          )}
        </>
      )}
    </Box>
  );
};

export default TaskRequestList;
