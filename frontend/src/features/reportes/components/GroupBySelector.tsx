import React from 'react';
import styled from 'styled-components';
import { 
  FiLayers, 
  FiPlus, 
  FiX, 
  FiCalendar,
  FiType,
  FiHash,
  FiToggleRight,
  FiList
} from 'react-icons/fi';
import { ReportField } from '../types/customReportTypes';

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

const FieldsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const AvailableFields = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const AvailableFieldsTitle = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.textSecondary};
`;

const FieldsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const FieldItem = styled.div<{ $selected: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  background-color: ${({ theme, $selected }) => 
    $selected ? theme.primary + '10' : theme.backgroundSecondary};
  border: 1px solid ${({ theme, $selected }) => 
    $selected ? theme.primary : theme.border};
  border-radius: 6px;
  font-size: 13px;
  color: ${({ theme }) => theme.text};
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${({ theme, $selected }) => 
      $selected ? theme.primary + '20' : theme.hoverBackground};
  }
`;

const SelectedFields = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SelectedFieldsTitle = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.textSecondary};
`;

const SelectedFieldsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const SelectedFieldItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  background-color: ${({ theme }) => theme.primary + '10'};
  border: 1px solid ${({ theme }) => theme.primary};
  border-radius: 6px;
  font-size: 13px;
  color: ${({ theme }) => theme.text};
`;

const RemoveButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.error + '20'};
  color: ${({ theme }) => theme.error};
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${({ theme }) => theme.error + '30'};
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px;
  text-align: center;
  color: ${({ theme }) => theme.textSecondary};
  font-size: 14px;
  background-color: ${({ theme }) => theme.backgroundSecondary};
  border: 1px dashed ${({ theme }) => theme.border};
  border-radius: 8px;
`;

interface GroupBySelectorProps {
  availableFields: ReportField[];
  selectedFields: string[];
  groupBy: string[];
  onGroupByChange: (groupBy: string[]) => void;
}

/**
 * Componente para seleccionar campos de agrupación para un reporte
 */
const GroupBySelector: React.FC<GroupBySelectorProps> = ({
  availableFields,
  selectedFields,
  groupBy,
  onGroupByChange
}) => {
  // Función para agregar un campo a la agrupación
  const addGroupBy = (fieldId: string) => {
    if (!groupBy.includes(fieldId)) {
      onGroupByChange([...groupBy, fieldId]);
    }
  };
  
  // Función para eliminar un campo de la agrupación
  const removeGroupBy = (fieldId: string) => {
    onGroupByChange(groupBy.filter(id => id !== fieldId));
  };
  
  // Función para obtener el icono de un tipo de campo
  const getFieldTypeIcon = (fieldType: string) => {
    switch (fieldType) {
      case 'string':
        return <FiType size={14} />;
      case 'number':
        return <FiHash size={14} />;
      case 'date':
        return <FiCalendar size={14} />;
      case 'boolean':
        return <FiToggleRight size={14} />;
      case 'enum':
        return <FiList size={14} />;
      default:
        return <FiType size={14} />;
    }
  };
  
  // Filtrar campos agrupables que estén seleccionados en el reporte
  const groupableFields = availableFields
    .filter(field => field.groupable && selectedFields.includes(field.id));
  
  // Obtener campo por ID
  const getFieldById = (fieldId: string) => {
    return availableFields.find(field => field.id === fieldId);
  };
  
  return (
    <Container>
      <Header>
        <Title>
          <FiLayers size={16} />
          Agrupar por
        </Title>
      </Header>
      
      <FieldsContainer>
        <SelectedFields>
          <SelectedFieldsTitle>Campos de agrupación seleccionados</SelectedFieldsTitle>
          
          <SelectedFieldsList>
            {groupBy.length === 0 ? (
              <EmptyState>
                No hay campos de agrupación seleccionados. Selecciona campos de la lista para agrupar el reporte.
              </EmptyState>
            ) : (
              groupBy.map(fieldId => {
                const field = getFieldById(fieldId);
                
                return (
                  <SelectedFieldItem key={fieldId}>
                    {field ? (
                      <>
                        {getFieldTypeIcon(field.type)}
                        {field.name}
                      </>
                    ) : (
                      fieldId
                    )}
                    <RemoveButton onClick={() => removeGroupBy(fieldId)}>
                      <FiX size={10} />
                    </RemoveButton>
                  </SelectedFieldItem>
                );
              })
            )}
          </SelectedFieldsList>
        </SelectedFields>
        
        <AvailableFields>
          <AvailableFieldsTitle>Campos disponibles para agrupar</AvailableFieldsTitle>
          
          <FieldsList>
            {groupableFields.length === 0 ? (
              <EmptyState>
                No hay campos disponibles para agrupar. Selecciona campos agrupables en la sección de campos.
              </EmptyState>
            ) : (
              groupableFields.map(field => {
                const isSelected = groupBy.includes(field.id);
                
                return (
                  <FieldItem 
                    key={field.id} 
                    $selected={isSelected}
                    onClick={() => isSelected ? removeGroupBy(field.id) : addGroupBy(field.id)}
                  >
                    {getFieldTypeIcon(field.type)}
                    {field.name}
                    {isSelected ? (
                      <FiX size={14} />
                    ) : (
                      <FiPlus size={14} />
                    )}
                  </FieldItem>
                );
              })
            )}
          </FieldsList>
        </AvailableFields>
      </FieldsContainer>
    </Container>
  );
};

export default GroupBySelector;
