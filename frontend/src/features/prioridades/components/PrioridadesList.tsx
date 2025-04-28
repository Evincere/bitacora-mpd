import React, { useState } from 'react';
import styled from 'styled-components';
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiFlag,
  FiArrowUp,
  FiArrowDown
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import PrioridadForm from './PrioridadForm';

// Datos de ejemplo para mostrar en la interfaz
const MOCK_PRIORIDADES = [
  { id: 1, nombre: 'Crítica', descripcion: 'Requiere atención inmediata', color: '#ef4444', nivel: 1 },
  { id: 2, nombre: 'Alta', descripcion: 'Requiere atención prioritaria', color: '#f59e0b', nivel: 2 },
  { id: 3, nombre: 'Media', descripcion: 'Requiere atención normal', color: '#3b82f6', nivel: 3 },
  { id: 4, nombre: 'Baja', descripcion: 'Puede esperar', color: '#10b981', nivel: 4 },
  { id: 5, nombre: 'Trivial', descripcion: 'Sin urgencia', color: '#6b7280', nivel: 5 }
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

const PrioridadesListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const PrioridadItem = styled.div`
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

const PrioridadInfo = styled.div`
  flex: 1;
`;

const PrioridadNombre = styled.div`
  font-weight: 500;
  color: ${({ theme }) => theme.text};
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const PrioridadDescripcion = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.textSecondary};
`;

const PrioridadNivel = styled.div`
  font-size: 12px;
  font-weight: 500;
  padding: 2px 6px;
  border-radius: 4px;
  background-color: ${({ theme }) => `${theme.primary}10`};
  color: ${({ theme }) => theme.primary};
  margin-left: 8px;
`;

const PrioridadActions = styled.div`
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

interface PrioridadesListProps {
  onPrioridadSelect?: (prioridad: any) => void;
}

const PrioridadesList: React.FC<PrioridadesListProps> = ({ onPrioridadSelect }) => {
  const [prioridades, setPrioridades] = useState(MOCK_PRIORIDADES);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [currentPrioridad, setCurrentPrioridad] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const filteredPrioridades = prioridades
    .filter(prioridad =>
      prioridad.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prioridad.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => a.nivel - b.nivel);

  const handleAddClick = () => {
    setCurrentPrioridad(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (prioridad: any) => {
    setCurrentPrioridad(prioridad);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setDeleteId(id);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteId) {
      setPrioridades(prioridades.filter(p => p.id !== deleteId));
      toast.success('Prioridad eliminada correctamente');
    }
    setIsConfirmOpen(false);
    setDeleteId(null);
  };

  const handleCancelDelete = () => {
    setIsConfirmOpen(false);
    setDeleteId(null);
  };

  const handleSavePrioridad = (prioridad: any) => {
    if (currentPrioridad) {
      // Editar prioridad existente
      setPrioridades(prioridades.map(p =>
        p.id === currentPrioridad.id ? { ...prioridad, id: currentPrioridad.id } : p
      ));
      toast.success('Prioridad actualizada correctamente');
    } else {
      // Añadir nueva prioridad
      const newId = Math.max(...prioridades.map(p => p.id), 0) + 1;
      setPrioridades([...prioridades, { ...prioridad, id: newId }]);
      toast.success('Prioridad creada correctamente');
    }
    setIsModalOpen(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentPrioridad(null);
  };

  const handleMoveUp = (id: number) => {
    const index = prioridades.findIndex(p => p.id === id);
    if (index <= 0) return; // Ya está en la posición más alta

    const updatedPrioridades = [...prioridades];
    const currentNivel = updatedPrioridades[index].nivel;
    const prevNivel = updatedPrioridades[index - 1].nivel;

    // Intercambiar niveles
    updatedPrioridades[index].nivel = prevNivel;
    updatedPrioridades[index - 1].nivel = currentNivel;

    setPrioridades(updatedPrioridades);
    toast.success('Prioridad movida hacia arriba');
  };

  const handleMoveDown = (id: number) => {
    const index = prioridades.findIndex(p => p.id === id);
    if (index >= prioridades.length - 1) return; // Ya está en la posición más baja

    const updatedPrioridades = [...prioridades];
    const currentNivel = updatedPrioridades[index].nivel;
    const nextNivel = updatedPrioridades[index + 1].nivel;

    // Intercambiar niveles
    updatedPrioridades[index].nivel = nextNivel;
    updatedPrioridades[index + 1].nivel = currentNivel;

    setPrioridades(updatedPrioridades);
    toast.success('Prioridad movida hacia abajo');
  };

  return (
    <Container>
      <Header>
        <Title>
          <FiFlag size={18} />
          Prioridades
        </Title>
        <SearchContainer>
          <FiSearch size={16} />
          <input
            type="text"
            placeholder="Buscar prioridades..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchContainer>
      </Header>
      <Content>
        <div style={{ marginBottom: '16px' }}>
          <AddButton onClick={handleAddClick}>
            <FiPlus size={16} />
            Nueva Prioridad
          </AddButton>
        </div>

        {filteredPrioridades.length > 0 ? (
          <PrioridadesListContainer>
            {filteredPrioridades.map((prioridad) => (
              <PrioridadItem key={prioridad.id}>
                <ColorIndicator $color={prioridad.color} />
                <PrioridadInfo>
                  <PrioridadNombre>
                    {prioridad.nombre}
                    <PrioridadNivel>Nivel {prioridad.nivel}</PrioridadNivel>
                  </PrioridadNombre>
                  <PrioridadDescripcion>{prioridad.descripcion}</PrioridadDescripcion>
                </PrioridadInfo>
                <PrioridadActions>
                  <ActionButton onClick={() => handleMoveUp(prioridad.id)}>
                    <FiArrowUp size={16} />
                  </ActionButton>
                  <ActionButton onClick={() => handleMoveDown(prioridad.id)}>
                    <FiArrowDown size={16} />
                  </ActionButton>
                  <ActionButton onClick={() => handleEditClick(prioridad)}>
                    <FiEdit2 size={16} />
                  </ActionButton>
                  <ActionButton onClick={() => handleDeleteClick(prioridad.id)}>
                    <FiTrash2 size={16} />
                  </ActionButton>
                </PrioridadActions>
              </PrioridadItem>
            ))}
          </PrioridadesListContainer>
        ) : (
          <EmptyState>
            No se encontraron prioridades
          </EmptyState>
        )}
      </Content>

      {isModalOpen && (
        <Modal onClick={handleCloseModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <PrioridadForm
              prioridad={currentPrioridad}
              onSave={handleSavePrioridad}
              onCancel={handleCloseModal}
            />
          </ModalContent>
        </Modal>
      )}

      {isConfirmOpen && (
        <Modal onClick={handleCancelDelete}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ConfirmDialog>
              <ConfirmTitle>Eliminar Prioridad</ConfirmTitle>
              <ConfirmMessage>
                ¿Está seguro de que desea eliminar esta prioridad? Esta acción no se puede deshacer.
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

export default PrioridadesList;
