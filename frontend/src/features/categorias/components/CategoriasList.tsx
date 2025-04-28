import React, { useState } from 'react';
import styled from 'styled-components';
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiTag
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import CategoriaForm from './CategoriaForm';

// Datos de ejemplo para mostrar en la interfaz
const MOCK_CATEGORIAS = [
  { id: 1, nombre: 'Administrativa', descripcion: 'Tareas relacionadas con procesos administrativos', color: '#3b82f6' },
  { id: 2, nombre: 'Legal', descripcion: 'Tareas relacionadas con aspectos legales y jurídicos', color: '#ef4444' },
  { id: 3, nombre: 'Técnica', descripcion: 'Tareas que requieren conocimientos técnicos específicos', color: '#10b981' },
  { id: 4, nombre: 'Financiera', descripcion: 'Tareas relacionadas con aspectos financieros y contables', color: '#f59e0b' },
  { id: 5, nombre: 'Recursos Humanos', descripcion: 'Tareas relacionadas con la gestión de personal', color: '#8b5cf6' }
];

const Container = styled.div`
  background-color: ${({ theme }) => theme.backgroundSecondary};
  border-radius: 8px;
  box-shadow: ${({ theme }) => theme.shadow};
  overflow: hidden;
`;

const Header = styled.div`
  padding: 16px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 18px;
  color: ${({ theme }) => theme.text};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SearchContainer = styled.div`
  position: relative;
  width: 250px;

  input {
    width: 100%;
    padding: 8px 12px 8px 36px;
    border-radius: 4px;
    border: 1px solid ${({ theme }) => theme.border};
    background-color: ${({ theme }) => theme.backgroundInput};
    color: ${({ theme }) => theme.text};
    font-size: 14px;
    transition: border-color 0.2s;

    &:focus {
      border-color: ${({ theme }) => theme.primary};
      outline: none;
    }
  }

  svg {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: ${({ theme }) => theme.textSecondary};
  }
`;

const Content = styled.div`
  padding: 16px;
`;

const CategoriasListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const CategoriaItem = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-radius: 6px;
  background-color: ${({ theme }) => theme.backgroundAlt};
  transition: all 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.backgroundHover};
  }
`;

const ColorIndicator = styled.div<{ $color: string }>`
  width: 16px;
  height: 16px;
  border-radius: 4px;
  background-color: ${({ $color }) => $color};
  margin-right: 12px;
`;

const CategoriaInfo = styled.div`
  flex: 1;
`;

const CategoriaNombre = styled.div`
  font-weight: 500;
  color: ${({ theme }) => theme.text};
  margin-bottom: 4px;
`;

const CategoriaDescripcion = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.textSecondary};
`;

const CategoriaActions = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.textSecondary};
  cursor: pointer;
  padding: 6px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.backgroundHover};
    color: ${({ theme }) => theme.text};
  }
`;

const AddButton = styled.button`
  padding: 8px 16px;
  border-radius: 4px;
  font-weight: 500;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  background-color: ${({ theme }) => theme.primary};
  color: white;
  border: none;
  transition: all 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.primaryDark};
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 24px;
  color: ${({ theme }) => theme.textSecondary};
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: ${({ theme }) => theme.backgroundSecondary};
  border-radius: 8px;
  box-shadow: ${({ theme }) => theme.shadowHover};
  width: 500px;
  max-width: 90%;
  max-height: 90vh;
  overflow-y: auto;
`;

const ConfirmDialog = styled.div`
  padding: 24px;
`;

const ConfirmTitle = styled.h3`
  margin: 0 0 16px;
  color: ${({ theme }) => theme.text};
`;

const ConfirmMessage = styled.p`
  margin: 0 0 24px;
  color: ${({ theme }) => theme.textSecondary};
`;

const ConfirmButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`;

const ConfirmButton = styled.button<{ $danger?: boolean }>`
  padding: 8px 16px;
  border-radius: 4px;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;

  ${({ $danger, theme }) =>
    $danger
      ? `
        background-color: ${theme.error};
        color: white;
        border: none;

        &:hover {
          background-color: ${theme.errorDark};
        }
      `
      : `
        background-color: transparent;
        color: ${theme.textSecondary};
        border: 1px solid ${theme.border};

        &:hover {
          background-color: ${theme.backgroundHover};
        }
      `
  }
`;

interface CategoriaListProps {
  onCategoriaSelect?: (categoria: any) => void;
}

const CategoriasList: React.FC<CategoriaListProps> = ({ onCategoriaSelect }) => {
  const [categorias, setCategorias] = useState(MOCK_CATEGORIAS);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [currentCategoria, setCurrentCategoria] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const filteredCategorias = categorias.filter(categoria =>
    categoria.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    categoria.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddClick = () => {
    setCurrentCategoria(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (categoria: any) => {
    setCurrentCategoria(categoria);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setDeleteId(id);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteId) {
      setCategorias(categorias.filter(c => c.id !== deleteId));
      toast.success('Categoría eliminada correctamente');
    }
    setIsConfirmOpen(false);
    setDeleteId(null);
  };

  const handleCancelDelete = () => {
    setIsConfirmOpen(false);
    setDeleteId(null);
  };

  const handleSaveCategoria = (categoria: any) => {
    if (currentCategoria) {
      // Editar categoría existente
      setCategorias(categorias.map(c =>
        c.id === currentCategoria.id ? { ...categoria, id: currentCategoria.id } : c
      ));
      toast.success('Categoría actualizada correctamente');
    } else {
      // Añadir nueva categoría
      const newId = Math.max(...categorias.map(c => c.id), 0) + 1;
      setCategorias([...categorias, { ...categoria, id: newId }]);
      toast.success('Categoría creada correctamente');
    }
    setIsModalOpen(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentCategoria(null);
  };

  return (
    <Container>
      <Header>
        <Title>
          <FiTag size={18} />
          Categorías
        </Title>
        <SearchContainer>
          <FiSearch size={16} />
          <input
            type="text"
            placeholder="Buscar categorías..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchContainer>
      </Header>
      <Content>
        <div style={{ marginBottom: '16px' }}>
          <AddButton onClick={handleAddClick}>
            <FiPlus size={16} />
            Nueva Categoría
          </AddButton>
        </div>

        {filteredCategorias.length > 0 ? (
          <CategoriasListContainer>
            {filteredCategorias.map((categoria) => (
              <CategoriaItem key={categoria.id}>
                <ColorIndicator $color={categoria.color} />
                <CategoriaInfo>
                  <CategoriaNombre>{categoria.nombre}</CategoriaNombre>
                  <CategoriaDescripcion>{categoria.descripcion}</CategoriaDescripcion>
                </CategoriaInfo>
                <CategoriaActions>
                  <ActionButton onClick={() => handleEditClick(categoria)}>
                    <FiEdit2 size={16} />
                  </ActionButton>
                  <ActionButton onClick={() => handleDeleteClick(categoria.id)}>
                    <FiTrash2 size={16} />
                  </ActionButton>
                </CategoriaActions>
              </CategoriaItem>
            ))}
          </CategoriasListContainer>
        ) : (
          <EmptyState>
            No se encontraron categorías
          </EmptyState>
        )}
      </Content>

      {isModalOpen && (
        <Modal onClick={handleCloseModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <CategoriaForm
              categoria={currentCategoria}
              onSave={handleSaveCategoria}
              onCancel={handleCloseModal}
            />
          </ModalContent>
        </Modal>
      )}

      {isConfirmOpen && (
        <Modal onClick={handleCancelDelete}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ConfirmDialog>
              <ConfirmTitle>Eliminar Categoría</ConfirmTitle>
              <ConfirmMessage>
                ¿Está seguro de que desea eliminar esta categoría? Esta acción no se puede deshacer.
              </ConfirmMessage>
              <ConfirmButtons>
                <ConfirmButton onClick={handleCancelDelete}>
                  Cancelar
                </ConfirmButton>
                <ConfirmButton $danger onClick={handleConfirmDelete}>
                  Eliminar
                </ConfirmButton>
              </ConfirmButtons>
            </ConfirmDialog>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

export default CategoriasList;
