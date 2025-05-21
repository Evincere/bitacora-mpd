import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  FiFilter, 
  FiPlus, 
  FiTrash2, 
  FiCalendar,
  FiType,
  FiHash,
  FiToggleRight,
  FiList
} from 'react-icons/fi';
import { ReportField, ReportFilter, FilterOperator } from '../types/customReportTypes';

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

const FiltersContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const FilterItem = styled.div`
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

const Input = styled.input`
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

const MultiSelectContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 6px;
  background-color: ${({ theme }) => theme.backgroundInput};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 6px;
  min-height: 38px;
  max-width: 300px;
`;

const MultiSelectItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background-color: ${({ theme }) => theme.primary + '10'};
  color: ${({ theme }) => theme.text};
  border: 1px solid ${({ theme }) => theme.primary};
  border-radius: 4px;
  font-size: 12px;
`;

const MultiSelectInput = styled.input`
  flex: 1;
  min-width: 100px;
  border: none;
  background: none;
  padding: 4px;
  color: ${({ theme }) => theme.text};
  font-size: 14px;
  
  &:focus {
    outline: none;
  }
`;

const RemoveButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  background: none;
  color: ${({ theme }) => theme.textSecondary};
  border: none;
  cursor: pointer;
  padding: 0;
  
  &:hover {
    color: ${({ theme }) => theme.error};
  }
`;

interface FilterBuilderProps {
  availableFields: ReportField[];
  filters: ReportFilter[];
  onFiltersChange: (filters: ReportFilter[]) => void;
}

/**
 * Componente para construir filtros para un reporte
 */
const FilterBuilder: React.FC<FilterBuilderProps> = ({
  availableFields,
  filters,
  onFiltersChange
}) => {
  // Estado para el valor de entrada en el selector múltiple
  const [inputValue, setInputValue] = useState('');
  
  // Función para agregar un nuevo filtro
  const addFilter = () => {
    // Buscar el primer campo disponible
    const firstField = availableFields.length > 0 ? availableFields[0].id : '';
    const fieldType = getFieldType(firstField);
    
    const newFilter: ReportFilter = {
      field: firstField,
      operator: getDefaultOperator(fieldType),
      value: getDefaultValue(fieldType)
    };
    
    onFiltersChange([...filters, newFilter]);
  };
  
  // Función para eliminar un filtro
  const removeFilter = (index: number) => {
    const newFilters = [...filters];
    newFilters.splice(index, 1);
    onFiltersChange(newFilters);
  };
  
  // Función para actualizar un filtro
  const updateFilter = (index: number, updatedFilter: Partial<ReportFilter>) => {
    const newFilters = [...filters];
    
    // Si el campo cambia, actualizar también el operador y el valor
    if (updatedFilter.field && updatedFilter.field !== newFilters[index].field) {
      const fieldType = getFieldType(updatedFilter.field);
      newFilters[index] = {
        ...newFilters[index],
        ...updatedFilter,
        operator: getDefaultOperator(fieldType),
        value: getDefaultValue(fieldType)
      };
    } else {
      newFilters[index] = {
        ...newFilters[index],
        ...updatedFilter
      };
    }
    
    onFiltersChange(newFilters);
  };
  
  // Función para obtener el tipo de un campo
  const getFieldType = (fieldId: string): string => {
    const field = availableFields.find(f => f.id === fieldId);
    return field ? field.type : 'string';
  };
  
  // Función para obtener el operador predeterminado según el tipo de campo
  const getDefaultOperator = (fieldType: string): FilterOperator => {
    switch (fieldType) {
      case 'string':
        return 'contains';
      case 'number':
      case 'date':
        return 'equals';
      case 'boolean':
        return 'equals';
      case 'enum':
        return 'equals';
      default:
        return 'equals';
    }
  };
  
  // Función para obtener el valor predeterminado según el tipo de campo
  const getDefaultValue = (fieldType: string): any => {
    switch (fieldType) {
      case 'string':
        return '';
      case 'number':
        return 0;
      case 'date':
        return new Date().toISOString().split('T')[0];
      case 'boolean':
        return true;
      case 'enum':
        return '';
      default:
        return '';
    }
  };
  
  // Función para obtener las opciones de operador según el tipo de campo
  const getOperatorOptions = (fieldType: string): { value: FilterOperator; label: string }[] => {
    const commonOptions = [
      { value: 'equals' as FilterOperator, label: 'Es igual a' },
      { value: 'notEquals' as FilterOperator, label: 'No es igual a' }
    ];
    
    switch (fieldType) {
      case 'string':
        return [
          ...commonOptions,
          { value: 'contains' as FilterOperator, label: 'Contiene' },
          { value: 'startsWith' as FilterOperator, label: 'Comienza con' },
          { value: 'endsWith' as FilterOperator, label: 'Termina con' },
          { value: 'isNull' as FilterOperator, label: 'Es nulo' },
          { value: 'isNotNull' as FilterOperator, label: 'No es nulo' }
        ];
      case 'number':
        return [
          ...commonOptions,
          { value: 'greaterThan' as FilterOperator, label: 'Mayor que' },
          { value: 'lessThan' as FilterOperator, label: 'Menor que' },
          { value: 'greaterThanOrEqual' as FilterOperator, label: 'Mayor o igual que' },
          { value: 'lessThanOrEqual' as FilterOperator, label: 'Menor o igual que' },
          { value: 'between' as FilterOperator, label: 'Entre' },
          { value: 'isNull' as FilterOperator, label: 'Es nulo' },
          { value: 'isNotNull' as FilterOperator, label: 'No es nulo' }
        ];
      case 'date':
        return [
          ...commonOptions,
          { value: 'greaterThan' as FilterOperator, label: 'Después de' },
          { value: 'lessThan' as FilterOperator, label: 'Antes de' },
          { value: 'greaterThanOrEqual' as FilterOperator, label: 'En o después de' },
          { value: 'lessThanOrEqual' as FilterOperator, label: 'En o antes de' },
          { value: 'between' as FilterOperator, label: 'Entre' },
          { value: 'isNull' as FilterOperator, label: 'Es nulo' },
          { value: 'isNotNull' as FilterOperator, label: 'No es nulo' }
        ];
      case 'boolean':
        return commonOptions;
      case 'enum':
        return [
          ...commonOptions,
          { value: 'in' as FilterOperator, label: 'Está en' },
          { value: 'notIn' as FilterOperator, label: 'No está en' },
          { value: 'isNull' as FilterOperator, label: 'Es nulo' },
          { value: 'isNotNull' as FilterOperator, label: 'No es nulo' }
        ];
      default:
        return commonOptions;
    }
  };
  
  // Función para renderizar el campo de valor según el tipo de campo y operador
  const renderValueInput = (filter: ReportFilter, index: number) => {
    const fieldType = getFieldType(filter.field);
    const field = availableFields.find(f => f.id === filter.field);
    
    // No mostrar campo de valor para operadores isNull e isNotNull
    if (filter.operator === 'isNull' || filter.operator === 'isNotNull') {
      return null;
    }
    
    // Renderizar campo de valor según el tipo
    switch (fieldType) {
      case 'string':
        return (
          <Input
            type="text"
            value={filter.value || ''}
            onChange={(e) => updateFilter(index, { value: e.target.value })}
            placeholder="Valor"
          />
        );
      case 'number':
        if (filter.operator === 'between') {
          return (
            <>
              <Input
                type="number"
                value={filter.value || 0}
                onChange={(e) => updateFilter(index, { value: parseFloat(e.target.value) })}
                placeholder="Valor mínimo"
              />
              <Input
                type="number"
                value={filter.valueEnd || 0}
                onChange={(e) => updateFilter(index, { valueEnd: parseFloat(e.target.value) })}
                placeholder="Valor máximo"
              />
            </>
          );
        }
        return (
          <Input
            type="number"
            value={filter.value || 0}
            onChange={(e) => updateFilter(index, { value: parseFloat(e.target.value) })}
            placeholder="Valor"
          />
        );
      case 'date':
        if (filter.operator === 'between') {
          return (
            <>
              <Input
                type="date"
                value={filter.value || ''}
                onChange={(e) => updateFilter(index, { value: e.target.value })}
              />
              <Input
                type="date"
                value={filter.valueEnd || ''}
                onChange={(e) => updateFilter(index, { valueEnd: e.target.value })}
              />
            </>
          );
        }
        return (
          <Input
            type="date"
            value={filter.value || ''}
            onChange={(e) => updateFilter(index, { value: e.target.value })}
          />
        );
      case 'boolean':
        return (
          <Select
            value={filter.value === true ? 'true' : 'false'}
            onChange={(e) => updateFilter(index, { value: e.target.value === 'true' })}
          >
            <option value="true">Verdadero</option>
            <option value="false">Falso</option>
          </Select>
        );
      case 'enum':
        if (filter.operator === 'in' || filter.operator === 'notIn') {
          // Renderizar selector múltiple para operadores in y notIn
          const values = Array.isArray(filter.value) ? filter.value : [];
          
          const addValue = (value: string) => {
            if (value && !values.includes(value)) {
              updateFilter(index, { value: [...values, value] });
            }
            setInputValue('');
          };
          
          const removeValue = (value: string) => {
            updateFilter(index, { value: values.filter(v => v !== value) });
          };
          
          return (
            <MultiSelectContainer>
              {values.map((value, i) => (
                <MultiSelectItem key={i}>
                  {value}
                  <RemoveButton onClick={() => removeValue(value)}>
                    <FiTrash2 size={12} />
                  </RemoveButton>
                </MultiSelectItem>
              ))}
              <MultiSelectInput
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ',') {
                    e.preventDefault();
                    addValue(inputValue);
                  }
                }}
                placeholder={values.length === 0 ? "Ingrese valores..." : ""}
              />
            </MultiSelectContainer>
          );
        }
        
        // Renderizar selector simple para otros operadores
        return (
          <Select
            value={filter.value || ''}
            onChange={(e) => updateFilter(index, { value: e.target.value })}
          >
            <option value="">Seleccione un valor</option>
            {field?.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
        );
      default:
        return (
          <Input
            type="text"
            value={filter.value || ''}
            onChange={(e) => updateFilter(index, { value: e.target.value })}
            placeholder="Valor"
          />
        );
    }
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
  
  return (
    <Container>
      <Header>
        <Title>
          <FiFilter size={16} />
          Filtros
        </Title>
        <AddButton onClick={addFilter}>
          <FiPlus size={14} />
          Agregar filtro
        </AddButton>
      </Header>
      
      <FiltersContainer>
        {filters.length === 0 ? (
          <EmptyState>
            No hay filtros definidos. Haz clic en "Agregar filtro" para comenzar.
          </EmptyState>
        ) : (
          filters.map((filter, index) => {
            const fieldType = getFieldType(filter.field);
            
            return (
              <FilterItem key={index}>
                <Select
                  value={filter.field}
                  onChange={(e) => updateFilter(index, { field: e.target.value })}
                >
                  {availableFields.map((field) => (
                    <option key={field.id} value={field.id}>
                      {field.name}
                    </option>
                  ))}
                </Select>
                
                <Select
                  value={filter.operator}
                  onChange={(e) => updateFilter(index, { operator: e.target.value as FilterOperator })}
                >
                  {getOperatorOptions(fieldType).map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
                
                {renderValueInput(filter, index)}
                
                <DeleteButton onClick={() => removeFilter(index)}>
                  <FiTrash2 size={16} />
                </DeleteButton>
              </FilterItem>
            );
          })
        )}
      </FiltersContainer>
    </Container>
  );
};

export default FilterBuilder;
