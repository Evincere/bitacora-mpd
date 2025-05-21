import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  FiSearch, 
  FiPlus, 
  FiX, 
  FiChevronDown, 
  FiChevronUp,
  FiDatabase,
  FiCalendar,
  FiHash,
  FiType,
  FiToggleRight,
  FiList
} from 'react-icons/fi';
import { ReportField } from '../types/customReportTypes';

// Estilos
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: ${({ theme }) => theme.backgroundInput};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  padding: 0 12px;
`;

const SearchInput = styled.input`
  background: none;
  border: none;
  padding: 10px 0;
  color: ${({ theme }) => theme.text};
  font-size: 14px;
  width: 100%;
  
  &:focus {
    outline: none;
  }
`;

const FieldsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 300px;
  overflow-y: auto;
  padding-right: 8px;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.backgroundSecondary};
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.border};
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.textTertiary};
  }
`;

const CategoryContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const CategoryHeader = styled.div<{ $expanded: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background-color: ${({ theme, $expanded }) => 
    $expanded ? theme.backgroundSecondary : theme.cardBackground};
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: ${({ theme }) => theme.backgroundSecondary};
  }
`;

const CategoryTitle = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CategoryFields = styled.div<{ $expanded: boolean }>`
  display: ${({ $expanded }) => ($expanded ? 'flex' : 'none')};
  flex-direction: column;
  gap: 4px;
  padding-left: 16px;
`;

const FieldItem = styled.div<{ $selected: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background-color: ${({ theme, $selected }) => 
    $selected ? theme.primary + '10' : theme.cardBackground};
  border: 1px solid ${({ theme, $selected }) => 
    $selected ? theme.primary : theme.border};
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${({ theme, $selected }) => 
      $selected ? theme.primary + '20' : theme.hoverBackground};
  }
`;

const FieldInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const FieldName = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.text};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const FieldType = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.textSecondary};
`;

const FieldAction = styled.button<{ $selected: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  background-color: ${({ theme, $selected }) => 
    $selected ? theme.error + '20' : theme.primary + '20'};
  color: ${({ theme, $selected }) => 
    $selected ? theme.error : theme.primary};
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${({ theme, $selected }) => 
      $selected ? theme.error + '30' : theme.primary + '30'};
  }
`;

const SelectedFieldsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SelectedFieldsHeader = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SelectedFieldsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const SelectedField = styled.div`
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
`;

interface FieldSelectorProps {
  availableFields: ReportField[];
  selectedFields: string[];
  onFieldsChange: (fields: string[]) => void;
}

/**
 * Componente para seleccionar campos para un reporte
 */
const FieldSelector: React.FC<FieldSelectorProps> = ({
  availableFields,
  selectedFields,
  onFieldsChange
}) => {
  // Estado para la búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estado para las categorías expandidas
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    task: true,
    user: false,
    metrics: false
  });
  
  // Función para alternar una categoría
  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };
  
  // Función para agregar un campo
  const addField = (fieldId: string) => {
    if (!selectedFields.includes(fieldId)) {
      onFieldsChange([...selectedFields, fieldId]);
    }
  };
  
  // Función para eliminar un campo
  const removeField = (fieldId: string) => {
    onFieldsChange(selectedFields.filter(id => id !== fieldId));
  };
  
  // Función para obtener el icono de un tipo de campo
  const getFieldTypeIcon = (type: string) => {
    switch (type) {
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
        return <FiDatabase size={14} />;
    }
  };
  
  // Filtrar campos por término de búsqueda
  const filteredFields = searchTerm
    ? availableFields.filter(field => 
        field.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        field.id.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : availableFields;
  
  // Agrupar campos por entidad
  const fieldsByEntity: Record<string, ReportField[]> = {};
  
  filteredFields.forEach(field => {
    if (!fieldsByEntity[field.entity]) {
      fieldsByEntity[field.entity] = [];
    }
    fieldsByEntity[field.entity].push(field);
  });
  
  // Obtener campo por ID
  const getFieldById = (fieldId: string) => {
    return availableFields.find(field => field.id === fieldId);
  };
  
  return (
    <Container>
      <SearchContainer>
        <FiSearch size={16} style={{ color: '#888', marginRight: '8px' }} />
        <SearchInput 
          placeholder="Buscar campos..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </SearchContainer>
      
      <SelectedFieldsContainer>
        <SelectedFieldsHeader>
          <FiDatabase size={16} />
          Campos seleccionados
        </SelectedFieldsHeader>
        
        <SelectedFieldsList>
          {selectedFields.length === 0 ? (
            <EmptyState>
              No hay campos seleccionados. Selecciona campos de la lista para incluirlos en el reporte.
            </EmptyState>
          ) : (
            selectedFields.map(fieldId => {
              const field = getFieldById(fieldId);
              
              return (
                <SelectedField key={fieldId}>
                  {field ? field.name : fieldId}
                  <RemoveButton onClick={() => removeField(fieldId)}>
                    <FiX size={10} />
                  </RemoveButton>
                </SelectedField>
              );
            })
          )}
        </SelectedFieldsList>
      </SelectedFieldsContainer>
      
      <FieldsContainer>
        {Object.entries(fieldsByEntity).map(([entity, fields]) => (
          <CategoryContainer key={entity}>
            <CategoryHeader 
              $expanded={expandedCategories[entity] || false}
              onClick={() => toggleCategory(entity)}
            >
              <CategoryTitle>
                <FiDatabase size={16} />
                {entity.charAt(0).toUpperCase() + entity.slice(1)}
              </CategoryTitle>
              {expandedCategories[entity] ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
            </CategoryHeader>
            
            <CategoryFields $expanded={expandedCategories[entity] || false}>
              {fields.map(field => {
                const isSelected = selectedFields.includes(field.id);
                
                return (
                  <FieldItem 
                    key={field.id} 
                    $selected={isSelected}
                    onClick={() => isSelected ? removeField(field.id) : addField(field.id)}
                  >
                    <FieldInfo>
                      <FieldName>
                        {getFieldTypeIcon(field.type)}
                        {field.name}
                      </FieldName>
                      <FieldType>{field.type}</FieldType>
                    </FieldInfo>
                    
                    <FieldAction $selected={isSelected}>
                      {isSelected ? <FiX size={14} /> : <FiPlus size={14} />}
                    </FieldAction>
                  </FieldItem>
                );
              })}
            </CategoryFields>
          </CategoryContainer>
        ))}
        
        {Object.keys(fieldsByEntity).length === 0 && (
          <EmptyState>
            No se encontraron campos que coincidan con la búsqueda.
          </EmptyState>
        )}
      </FieldsContainer>
    </Container>
  );
};

export default FieldSelector;
