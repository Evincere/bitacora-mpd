import React, { useState, useEffect } from 'react';
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
  Button,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Checkbox,
  Grid
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon
} from '@mui/icons-material';
import { ChromePicker } from 'react-color';
import { TaskRequestCategory } from '../../types/TaskRequest';
import { taskRequestCategoryService } from '../../services/taskRequestCategoryService';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';

const TaskRequestCategoryList: React.FC = () => {
  const [categories, setCategories] = useState<TaskRequestCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState<TaskRequestCategory | null>(null);
  const [formData, setFormData] = useState<Partial<TaskRequestCategory>>({
    name: '',
    description: '',
    color: '#808080',
    isDefault: false
  });
  const [showColorPicker, setShowColorPicker] = useState(false);
  
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.roles.includes('ROLE_ADMIN');

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await taskRequestCategoryService.getAllCategories();
      setCategories(response);
    } catch (err) {
      console.error('Error al cargar las categorías:', err);
      setError('Error al cargar las categorías. Por favor, inténtelo de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenDialog = (category?: TaskRequestCategory) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        description: category.description || '',
        color: category.color,
        isDefault: category.isDefault
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: '',
        description: '',
        color: '#808080',
        isDefault: false
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setShowColorPicker(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleColorChange = (color: any) => {
    setFormData({
      ...formData,
      color: color.hex
    });
  };

  const handleSubmit = async () => {
    if (!formData.name) {
      toast.error('El nombre de la categoría es obligatorio');
      return;
    }
    
    try {
      if (editingCategory) {
        // Modo edición
        const updatedCategory = await taskRequestCategoryService.updateCategory(
          editingCategory.id,
          {
            ...editingCategory,
            name: formData.name || '',
            description: formData.description,
            color: formData.color || '#808080',
            isDefault: formData.isDefault || false
          }
        );
        
        setCategories(categories.map(cat => 
          cat.id === updatedCategory.id ? updatedCategory : cat
        ));
        
        toast.success('Categoría actualizada correctamente');
      } else {
        // Modo creación
        const newCategory = await taskRequestCategoryService.createCategory({
          id: 0, // El backend ignorará este valor
          name: formData.name || '',
          description: formData.description,
          color: formData.color || '#808080',
          isDefault: formData.isDefault || false
        });
        
        setCategories([...categories, newCategory]);
        
        toast.success('Categoría creada correctamente');
      }
      
      handleCloseDialog();
    } catch (err) {
      console.error('Error al guardar la categoría:', err);
      toast.error('Error al guardar la categoría');
    }
  };

  const handleSetDefault = async (id: number) => {
    try {
      const updatedCategory = await taskRequestCategoryService.setDefaultCategory(id);
      
      // Actualizar la lista de categorías
      setCategories(categories.map(cat => ({
        ...cat,
        isDefault: cat.id === updatedCategory.id
      })));
      
      toast.success('Categoría establecida como predeterminada');
    } catch (err) {
      console.error('Error al establecer la categoría como predeterminada:', err);
      toast.error('Error al establecer la categoría como predeterminada');
    }
  };

  const handleDelete = async (id: number) => {
    // Verificar si la categoría es la predeterminada
    const category = categories.find(cat => cat.id === id);
    if (category?.isDefault) {
      toast.error('No se puede eliminar la categoría predeterminada');
      return;
    }
    
    if (window.confirm('¿Está seguro de que desea eliminar esta categoría?')) {
      try {
        await taskRequestCategoryService.deleteCategory(id);
        
        // Actualizar la lista de categorías
        setCategories(categories.filter(cat => cat.id !== id));
        
        toast.success('Categoría eliminada correctamente');
      } catch (err) {
        console.error('Error al eliminar la categoría:', err);
        toast.error('Error al eliminar la categoría');
      }
    }
  };

  return (
    <Box sx={{ width: '100%', p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Categorías de Solicitudes
        </Typography>
        {isAdmin && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Nueva Categoría
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
          {categories.length === 0 ? (
            <Alert severity="info">No hay categorías para mostrar</Alert>
          ) : (
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Nombre</TableCell>
                      <TableCell>Descripción</TableCell>
                      <TableCell>Color</TableCell>
                      <TableCell>Predeterminada</TableCell>
                      {isAdmin && <TableCell>Acciones</TableCell>}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {categories.map((category) => (
                      <TableRow hover key={category.id}>
                        <TableCell>{category.name}</TableCell>
                        <TableCell>{category.description || '-'}</TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              width: 24,
                              height: 24,
                              borderRadius: '50%',
                              backgroundColor: category.color,
                              border: '1px solid #ccc'
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          {category.isDefault ? (
                            <StarIcon color="warning" />
                          ) : (
                            <StarBorderIcon color="disabled" />
                          )}
                        </TableCell>
                        {isAdmin && (
                          <TableCell>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Tooltip title="Editar">
                                <IconButton
                                  size="small"
                                  color="primary"
                                  onClick={() => handleOpenDialog(category)}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              
                              {!category.isDefault && (
                                <Tooltip title="Establecer como predeterminada">
                                  <IconButton
                                    size="small"
                                    color="warning"
                                    onClick={() => handleSetDefault(category.id)}
                                  >
                                    <StarBorderIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              )}
                              
                              {!category.isDefault && (
                                <Tooltip title="Eliminar">
                                  <IconButton
                                    size="small"
                                    color="error"
                                    onClick={() => handleDelete(category.id)}
                                  >
                                    <DeleteIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              )}
                            </Box>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          )}
        </>
      )}

      {/* Diálogo para crear/editar categorías */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                name="name"
                label="Nombre"
                fullWidth
                required
                value={formData.name || ''}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="description"
                label="Descripción"
                fullWidth
                multiline
                rows={2}
                value={formData.description || ''}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Color
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    backgroundColor: formData.color || '#808080',
                    border: '1px solid #ccc',
                    cursor: 'pointer'
                  }}
                  onClick={() => setShowColorPicker(!showColorPicker)}
                />
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setShowColorPicker(!showColorPicker)}
                >
                  {showColorPicker ? 'Cerrar selector' : 'Cambiar color'}
                </Button>
              </Box>
              {showColorPicker && (
                <Box sx={{ mt: 2 }}>
                  <ChromePicker
                    color={formData.color || '#808080'}
                    onChange={handleColorChange}
                    disableAlpha
                  />
                </Box>
              )}
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="isDefault"
                    checked={formData.isDefault || false}
                    onChange={handleInputChange}
                    disabled={editingCategory?.isDefault}
                  />
                }
                label="Establecer como categoría predeterminada"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {editingCategory ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TaskRequestCategoryList;
