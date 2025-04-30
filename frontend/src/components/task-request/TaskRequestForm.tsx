import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Grid,
  CircularProgress,
  Alert,
  Checkbox,
  FormControlLabel,
  Divider
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { TaskRequest, TaskRequestPriority, CreateTaskRequestDto, UpdateTaskRequestDto, TaskRequestCategory } from '../../types/TaskRequest';
import { taskRequestService } from '../../services/taskRequestService';
import { taskRequestCategoryService } from '../../services/taskRequestCategoryService';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';

interface FormData {
  title: string;
  description: string;
  categoryId: number | '';
  priority: string;
  dueDate: Date | null;
  notes: string;
  submitImmediately: boolean;
}

const schema = yup.object().shape({
  title: yup.string().required('El título es obligatorio').max(255, 'El título no puede tener más de 255 caracteres'),
  description: yup.string().required('La descripción es obligatoria').max(2000, 'La descripción no puede tener más de 2000 caracteres'),
  categoryId: yup.mixed().transform((value) => (value === '' ? null : value)).nullable(),
  priority: yup.string().required('La prioridad es obligatoria'),
  dueDate: yup.date().nullable(),
  notes: yup.string().max(1000, 'Las notas no pueden tener más de 1000 caracteres').nullable(),
  submitImmediately: yup.boolean()
});

const TaskRequestForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditMode);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<TaskRequestCategory[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const { control, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      title: '',
      description: '',
      categoryId: '',
      priority: TaskRequestPriority.MEDIUM,
      dueDate: null,
      notes: '',
      submitImmediately: false
    }
  });

  const fetchCategories = async () => {
    setLoadingCategories(true);
    try {
      const response = await taskRequestCategoryService.getAllCategories();
      setCategories(response);
    } catch (err) {
      console.error('Error al cargar las categorías:', err);
      toast.error('Error al cargar las categorías');
    } finally {
      setLoadingCategories(false);
    }
  };

  const fetchTaskRequest = async () => {
    if (!id) return;
    
    setInitialLoading(true);
    setError(null);
    try {
      const response = await taskRequestService.getTaskRequestById(parseInt(id));
      
      // Verificar si el usuario tiene permiso para editar esta solicitud
      if (!currentUser?.roles.includes('ROLE_ADMIN') && 
          currentUser?.id !== response.requesterId) {
        setError('No tienes permiso para editar esta solicitud');
        return;
      }
      
      // Verificar si la solicitud está en estado DRAFT
      if (response.status !== 'DRAFT') {
        setError('Solo se pueden editar solicitudes en estado Borrador');
        return;
      }
      
      reset({
        title: response.title,
        description: response.description,
        categoryId: response.category?.id || '',
        priority: response.priority,
        dueDate: response.dueDate ? new Date(response.dueDate) : null,
        notes: response.notes || '',
        submitImmediately: false
      });
    } catch (err) {
      console.error('Error al cargar la solicitud:', err);
      setError('Error al cargar la solicitud. Por favor, inténtelo de nuevo más tarde.');
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    if (isEditMode) {
      fetchTaskRequest();
    }
  }, [id]);

  const onSubmit = async (data: FormData) => {
    if (!currentUser) {
      toast.error('Debes iniciar sesión para realizar esta acción');
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      if (isEditMode && id) {
        // Modo edición
        const updateData: UpdateTaskRequestDto = {
          title: data.title,
          description: data.description,
          categoryId: data.categoryId === '' ? undefined : Number(data.categoryId),
          priority: data.priority,
          dueDate: data.dueDate ? data.dueDate.toISOString() : undefined,
          notes: data.notes || undefined,
          submit: data.submitImmediately
        };
        
        await taskRequestService.updateTaskRequest(parseInt(id), updateData);
        toast.success('Solicitud actualizada correctamente');
        navigate(`/task-requests/${id}`);
      } else {
        // Modo creación
        const createData: CreateTaskRequestDto = {
          title: data.title,
          description: data.description,
          categoryId: data.categoryId === '' ? undefined : Number(data.categoryId),
          priority: data.priority,
          dueDate: data.dueDate ? data.dueDate.toISOString() : undefined,
          notes: data.notes || undefined,
          submitImmediately: data.submitImmediately
        };
        
        const response = await taskRequestService.createTaskRequest(createData);
        toast.success('Solicitud creada correctamente');
        navigate(`/task-requests/${response.id}`);
      }
    } catch (err) {
      console.error('Error al guardar la solicitud:', err);
      setError('Error al guardar la solicitud. Por favor, inténtelo de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  if (initialLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', p: 2 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          {isEditMode ? 'Editar Solicitud' : 'Nueva Solicitud'}
        </Typography>

        <Divider sx={{ my: 2 }} />

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Título"
                    fullWidth
                    required
                    error={!!errors.title}
                    helperText={errors.title?.message}
                    disabled={loading}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="categoryId"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.categoryId} disabled={loading || loadingCategories}>
                    <InputLabel id="category-label">Categoría</InputLabel>
                    <Select
                      {...field}
                      labelId="category-label"
                      label="Categoría"
                    >
                      {loadingCategories ? (
                        <MenuItem value="">
                          <CircularProgress size={20} />
                          Cargando categorías...
                        </MenuItem>
                      ) : (
                        <>
                          <MenuItem value="">
                            <em>Seleccione una categoría</em>
                          </MenuItem>
                          {categories.map((category) => (
                            <MenuItem key={category.id} value={category.id}>
                              <Box
                                component="span"
                                sx={{
                                  display: 'inline-block',
                                  width: 16,
                                  height: 16,
                                  borderRadius: '50%',
                                  backgroundColor: category.color,
                                  mr: 1,
                                  verticalAlign: 'middle'
                                }}
                              />
                              {category.name}
                              {category.isDefault && ' (Por defecto)'}
                            </MenuItem>
                          ))}
                        </>
                      )}
                    </Select>
                    {errors.categoryId && (
                      <FormHelperText>{errors.categoryId.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="priority"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.priority} disabled={loading}>
                    <InputLabel id="priority-label">Prioridad</InputLabel>
                    <Select
                      {...field}
                      labelId="priority-label"
                      label="Prioridad"
                    >
                      <MenuItem value={TaskRequestPriority.CRITICAL}>Crítica</MenuItem>
                      <MenuItem value={TaskRequestPriority.HIGH}>Alta</MenuItem>
                      <MenuItem value={TaskRequestPriority.MEDIUM}>Media</MenuItem>
                      <MenuItem value={TaskRequestPriority.LOW}>Baja</MenuItem>
                      <MenuItem value={TaskRequestPriority.TRIVIAL}>Trivial</MenuItem>
                    </Select>
                    {errors.priority && (
                      <FormHelperText>{errors.priority.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Descripción"
                    fullWidth
                    required
                    multiline
                    rows={4}
                    error={!!errors.description}
                    helperText={errors.description?.message}
                    disabled={loading}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                <Controller
                  name="dueDate"
                  control={control}
                  render={({ field }) => (
                    <DateTimePicker
                      label="Fecha límite"
                      value={field.value}
                      onChange={field.onChange}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!errors.dueDate,
                          helperText: errors.dueDate?.message,
                          disabled: loading
                        }
                      }}
                    />
                  )}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="notes"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Notas adicionales"
                    fullWidth
                    multiline
                    rows={3}
                    error={!!errors.notes}
                    helperText={errors.notes?.message}
                    disabled={loading}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="submitImmediately"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={field.value}
                        onChange={field.onChange}
                        disabled={loading}
                      />
                    }
                    label={isEditMode ? "Enviar al guardar" : "Enviar inmediatamente"}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={handleCancel}
                  disabled={loading}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <CircularProgress size={24} sx={{ mr: 1 }} />
                      Guardando...
                    </>
                  ) : (
                    isEditMode ? 'Actualizar Solicitud' : 'Crear Solicitud'
                  )}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
};

export default TaskRequestForm;
