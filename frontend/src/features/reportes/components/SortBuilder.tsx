import React from 'react';
import styled from 'styled-components';
import {
  FiArrowUp,
  FiArrowDown,
  FiPlus,
  FiTrash2,
  FiList
} from 'react-icons/fi';
import { ReportField, ReportSort } from '../types/customReportTypes';

// Estilos
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background-color: ${({ theme }) => theme.primary + '10'};
  color: ${({ theme }) => theme.primary};
  border: 1px solid ${({ theme }) => theme.primary};
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.primary + '20'};
  }
`;

const SortsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SortItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background-color: ${({ theme }) => theme.backgroundSecondary};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
`;

const Select = styled.select`
  padding: 8px 12px;
  background-color: ${({ theme }) => theme.backgroundInput};
  color: ${({ theme }) => theme.text};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 6px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
  }
`;

const DirectionButton = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background-color: ${({ theme, $active }) =>
    $active ? theme.primary : theme.backgroundInput};
  color: ${({ theme, $active }) =>
    $active ? '#fff' : theme.text};
  border: 1px solid ${({ theme, $active }) =>
    $active ? theme.primary : theme.border};
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: ${({ theme, $active }) =>
      $active ? theme.primaryDark : theme.hoverBackground};
  }
`;

const DeleteButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background-color: ${({ theme }) => theme.error + '10'};
  color: ${({ theme }) => theme.error};
  border: 1px solid ${({ theme }) => theme.error};
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.error + '20'};
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  text-align: center;
  color: ${({ theme }) => theme.textSecondary};
  font-size: 14px;
  background-color: ${({ theme }) => theme.backgroundSecondary};
  border: 1px dashed ${({ theme }) => theme.border};
  border-radius: 8px;
`;

interface SortBuilderProps {
  availableFields: ReportField[];
  sortBy: ReportSort[];
  onSortChange: (sortBy: ReportSort[]) => void;
}

/**
 * Componente para configurar el ordenamiento de un reporte
 */
const SortBuilder: React.FC<SortBuilderProps> = ({
  availableFields,
  sortBy,
  onSortChange
}) => {
  // Función para agregar un nuevo ordenamiento
  const addSort = () => {
    // Filtrar campos ordenables
    const sortableFields = availableFields.filter(field => field.sortable);

    // Si no hay campos ordenables, no hacer nada
    if (sortableFields.length === 0) return;

    // Buscar el primer campo ordenable que no esté ya en la lista
    const usedFields = sortBy.map(sort => sort.field);
    const availableField = sortableFields.find(field => !usedFields.includes(field.id));

    // Si no hay campos disponibles, usar el primero
    const fieldId = availableField ? availableField.id : sortableFields[0].id;

    const newSort: ReportSort = {
      field: fieldId,
      direction: 'asc'
    };

    onSortChange([...sortBy, newSort]);
  };

  // Función para eliminar un ordenamiento
  const removeSort = (index: number) => {
    const newSortBy = [...sortBy];
    newSortBy.splice(index, 1);
    onSortChange(newSortBy);
  };

  // Función para actualizar un ordenamiento
  const updateSort = (index: number, updatedSort: Partial<ReportSort>) => {
    const newSortBy = [...sortBy];
    newSortBy[index] = {
      ...newSortBy[index],
      ...updatedSort
    };
    onSortChange(newSortBy);
  };

  // Filtrar campos ordenables
  const sortableFields = availableFields.filter(field => field.sortable);

  return (
    <Container>
      <Header>
        <Title>
          <FiList size={16} />
          Ordenamiento
        </Title>
        <AddButton onClick={addSort}>
          <FiPlus size={14} />
          Agregar ordenamiento
        </AddButton>
      </Header>

      <SortsContainer>
        {sortBy.length === 0 ? (
          <EmptyState>
            No hay ordenamientos definidos. Haz clic en "Agregar ordenamiento" para comenzar.
          </EmptyState>
        ) : (
          sortBy.map((sort, index) => (
            <SortItem key={index}>
              <Select
                value={sort.field}
                onChange={(e) => updateSort(index, { field: e.target.value })}
              >
                {sortableFields.map((field) => (
                  <option key={field.id} value={field.id}>
                    {field.name}
                  </option>
                ))}
              </Select>

              <DirectionButton
                $active={sort.direction === 'asc'}
                onClick={() => updateSort(index, { direction: 'asc' })}
                title="Ascendente"
              >
                <FiArrowUp size={16} />
              </DirectionButton>

              <DirectionButton
                $active={sort.direction === 'desc'}
                onClick={() => updateSort(index, { direction: 'desc' })}
                title="Descendente"
              >
                <FiArrowDown size={16} />
              </DirectionButton>

              <DeleteButton onClick={() => removeSort(index)}>
                <FiTrash2 size={16} />
              </DeleteButton>
            </SortItem>
          ))
        )}
      </SortsContainer>
    </Container>
  );
};

export default SortBuilder;
