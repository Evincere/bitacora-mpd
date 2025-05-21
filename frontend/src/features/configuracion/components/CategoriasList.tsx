import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  FiPlus, 
  FiEdit2, 
  FiTrash2, 
  FiSearch, 
  FiX, 
  FiCheck, 
  FiAlertCircle,
  FiRefreshCw
} from 'react-icons/fi';
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from '../hooks/useCategories';
import { TaskCategory, CreateCategoryDto, UpdateCategoryDto } from '../services/categoryService';
import { ConfirmDialog } from '@/components/ui/Dialog';

// Estilos
const Container = styled.div`
  background-color: ${({ theme }) => theme.cardBackground};
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Title = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  margin: 0;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 10px;
`;

const Button = styled.button<{ $primary?: boolean, $danger?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: ${({ theme, $primary, $danger }) => 
    $primary ? theme.primary : 
    $danger ? theme.danger + '20' : 
    theme.cardBackground};
  color: ${({ theme, $primary, $danger }) => 
    $primary ? '#fff' : 
    $danger ? theme.danger : 
    theme.text};
  border: 1px solid ${({ theme, $primary, $danger }) => 
    $primary ? theme.primary : 
    $danger ? theme.danger : 
    theme.border};

  &:hover {
    background-color: ${({ theme, $primary, $danger }) => 
      $primary ? theme.primaryDark : 
      $danger ? theme.danger + '30' : 
      theme.hoverBackground};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 10px 16px 10px 40px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.border};
  background-color: ${({ theme }) => theme.inputBackground};
  color: ${({ theme }) => theme.text};
  font-size: 14px;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.primary}20;
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 16px;
  color: ${({ theme }) => theme.textSecondary};
`;

const SearchWrapper = styled.div`
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
`;

const CategoriesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 400px;
  overflow-y: auto;
`;

const CategoryItem = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.backgroundSecondary};
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.hoverBackground};
  }
`;

const ColorIndicator = styled.div<{ $color: string }>`
  width: 24px;
  height: 24px;
  border-radius: 6px;
  background-color: ${({ $color }) => $color};
  margin-right: 12px;
  border: 1px solid rgba(0, 0, 0, 0.1);
`;

const CategoryInfo = styled.div`
  flex: 1;
`;

const CategoryName = styled.div`
  font-weight: 500;
  color: ${({ theme }) => theme.text};
`;

const CategoryDescription = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.textSecondary};
  margin-top: 2px;
`;

const CategoryActions = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.textSecondary};
  transition: color 0.2s ease;
  padding: 4px;
  border-radius: 4px;

  &:hover {
    color: ${({ theme }) => theme.text};
    background-color: ${({ theme }) => theme.hoverBackground};
  }
`;

const DefaultBadge = styled.div`
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 500;
  background-color: ${({ theme }) => theme.primary + '20'};
  color: ${({ theme }) => theme.primary};
  margin-left: 8px;
`;

const FormContainer = styled.div`
  margin-top: 20px;
  padding: 16px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.backgroundSecondary};
  border: 1px solid ${({ theme }) => theme.border};
`;

const FormTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  margin: 0 0 16px 0;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.textSecondary};
`;

const Input = styled.input`
  padding: 10px 16px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.border};
  background-color: ${({ theme }) => theme.inputBackground};
  color: ${({ theme }) => theme.text};
  font-size: 14px;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.primary}20;
  }
`;

const TextArea = styled.textarea`
  padding: 10px 16px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.border};
  background-color: ${({ theme }) => theme.inputBackground};
  color: ${({ theme }) => theme.text};
  font-size: 14px;
  transition: all 0.2s ease;
  min-height: 80px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.primary}20;
  }
`;

const ColorInput = styled.input`
  padding: 10px 16px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.border};
  background-color: ${({ theme }) => theme.inputBackground};
  color: ${({ theme }) => theme.text};
  font-size: 14px;
  transition: all 0.2s ease;
  width: 100px;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.primary}20;
  }
`;

const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
  color: ${({ theme }) => theme.textSecondary};
`;

const EmptyStateIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
  color: ${({ theme }) => theme.textTertiary};
`;

const EmptyStateText = styled.div`
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 8px;
`;

const EmptyStateSubtext = styled.div`
  font-size: 14px;
  margin-bottom: 16px;
`;

const CategoriasList: React.FC = () => {
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<TaskCategory | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<TaskCategory | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#4285F4');
  
  const { data: categories, isLoading, isError, refetch } = useCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const filteredCategories = categories?.filter(category => 
    category.name.toLowerCase().includes(search.toLowerCase()) ||
    category.description?.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddCategory = () => {
    setEditingCategory(null);
    setName('');
    setDescription('');
    setColor('#4285F4');
    setShowForm(true);
  };

  const handleEditCategory = (category: TaskCategory) => {
    setEditingCategory(category);
    setName(category.name);
    setDescription(category.description || '');
    setColor(category.color);
    setShowForm(true);
  };

  const handleDeleteCategory = (category: TaskCategory) => {
    setCategoryToDelete(category);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;
    
    try {
      await deleteCategory.mutateAsync(categoryToDelete.id);
      setShowDeleteConfirm(false);
      setCategoryToDelete(null);
    } catch (error) {
      console.error('Error al eliminar categoría:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingCategory) {
        // Actualizar categoría existente
        const updateData: UpdateCategoryDto = {
          name,
          description,
          color
        };
        
        await updateCategory.mutateAsync({ id: editingCategory.id, categoryData: updateData });
      } else {
        // Crear nueva categoría
        const createData: CreateCategoryDto = {
          name,
          description,
          color
        };
        
        await createCategory.mutateAsync(createData);
      }
      
      // Resetear formulario
      setShowForm(false);
      setEditingCategory(null);
      setName('');
      setDescription('');
      setColor('#4285F4');
    } catch (error) {
      console.error('Error al guardar categoría:', error);
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingCategory(null);
  };

  return (
    <Container>
      <Header>
        <Title>Categorías de Tareas</Title>
        <ActionButtons>
          <Button onClick={() => refetch()}>
            <FiRefreshCw size={16} />
            Actualizar
          </Button>
          <Button $primary onClick={handleAddCategory}>
            <FiPlus size={16} />
            Nueva Categoría
          </Button>
        </ActionButtons>
      </Header>

      <SearchContainer>
        <SearchWrapper>
          <SearchIcon>
            <FiSearch size={16} />
          </SearchIcon>
          <SearchInput
            placeholder="Buscar categorías..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </SearchWrapper>
      </SearchContainer>

      {isLoading ? (
        <div>Cargando categorías...</div>
      ) : isError ? (
        <div>Error al cargar categorías</div>
      ) : filteredCategories && filteredCategories.length > 0 ? (
        <CategoriesList>
          {filteredCategories.map(category => (
            <CategoryItem key={category.id}>
              <ColorIndicator $color={category.color} />
              <CategoryInfo>
                <CategoryName>
                  {category.name}
                  {category.isDefault && <DefaultBadge>Predeterminada</DefaultBadge>}
                </CategoryName>
                <CategoryDescription>{category.description}</CategoryDescription>
              </CategoryInfo>
              <CategoryActions>
                <ActionButton onClick={() => handleEditCategory(category)}>
                  <FiEdit2 size={16} />
                </ActionButton>
                {!category.isDefault && (
                  <ActionButton onClick={() => handleDeleteCategory(category)}>
                    <FiTrash2 size={16} />
                  </ActionButton>
                )}
              </CategoryActions>
            </CategoryItem>
          ))}
        </CategoriesList>
      ) : (
        <EmptyState>
          <EmptyStateIcon>
            <FiAlertCircle />
          </EmptyStateIcon>
          <EmptyStateText>No se encontraron categorías</EmptyStateText>
          <EmptyStateSubtext>
            {search ? 'Intenta con otra búsqueda o crea una nueva categoría' : 'Crea una nueva categoría para empezar'}
          </EmptyStateSubtext>
          <Button $primary onClick={handleAddCategory}>
            <FiPlus size={16} />
            Nueva Categoría
          </Button>
        </EmptyState>
      )}

      {showForm && (
        <FormContainer>
          <FormTitle>{editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}</FormTitle>
          <form onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="description">Descripción</Label>
              <TextArea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="color">Color</Label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ColorInput
                  id="color"
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  required
                />
                <div style={{ 
                  width: '24px', 
                  height: '24px', 
                  borderRadius: '6px', 
                  backgroundColor: color,
                  border: '1px solid rgba(0, 0, 0, 0.1)'
                }} />
              </div>
            </FormGroup>
            <FormActions>
              <Button type="button" onClick={handleCancelForm}>
                <FiX size={16} />
                Cancelar
              </Button>
              <Button type="submit" $primary>
                <FiCheck size={16} />
                {editingCategory ? 'Actualizar' : 'Crear'}
              </Button>
            </FormActions>
          </form>
        </FormContainer>
      )}

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Eliminar Categoría"
        message={`¿Estás seguro de que deseas eliminar la categoría "${categoryToDelete?.name}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        onConfirm={confirmDelete}
        onCancel={() => {
          setShowDeleteConfirm(false);
          setCategoryToDelete(null);
        }}
        isDanger
      />
    </Container>
  );
};

export default CategoriasList;
