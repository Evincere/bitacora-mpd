import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  FiFilter, 
  FiCalendar, 
  FiTag, 
  FiFlag, 
  FiActivity,
  FiUser,
  FiRefreshCw,
  FiSearch
} from 'react-icons/fi';
import { DashboardFilters as FilterType } from '../types/dashboardTypes';

// Estilos
const FiltersContainer = styled.div<{ $visible: boolean }>`
  background-color: ${({ theme }) => theme.cardBackground};
  border-radius: 12px;
  padding: ${({ $visible }) => ($visible ? '20px' : '0')};
  margin-bottom: 20px;
  overflow: hidden;
  max-height: ${({ $visible }) => ($visible ? '1000px' : '0')};
  transition: all 0.3s ease;
  box-shadow: ${({ $visible }) => ($visible ? '0 4px 12px rgba(0, 0, 0, 0.05)' : 'none')};
`;

const FiltersHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const FiltersTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const FiltersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Input = styled.input`
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.border};
  background-color: ${({ theme }) => theme.backgroundInput};
  color: ${({ theme }) => theme.text};
  font-size: 14px;
  transition: border-color 0.2s;

  &:focus {
    border-color: ${({ theme }) => theme.primary};
    outline: none;
  }
`;

const Select = styled.select`
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.border};
  background-color: ${({ theme }) => theme.backgroundInput};
  color: ${({ theme }) => theme.text};
  font-size: 14px;
  transition: border-color 0.2s;

  &:focus {
    border-color: ${({ theme }) => theme.primary};
    outline: none;
  }
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 16px;
`;

const Button = styled.button<{ $primary?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: ${({ theme, $primary }) => 
    $primary ? theme.primary : theme.cardBackground};
  color: ${({ theme, $primary }) => 
    $primary ? '#fff' : theme.text};
  border: 1px solid ${({ theme, $primary }) => 
    $primary ? theme.primary : theme.border};

  &:hover {
    background-color: ${({ theme, $primary }) => 
      $primary ? theme.primaryDark : theme.hoverBackground};
  }
`;

const ToggleButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: ${({ theme }) => theme.cardBackground};
  color: ${({ theme }) => theme.text};
  border: 1px solid ${({ theme }) => theme.border};
  margin-bottom: 20px;

  &:hover {
    background-color: ${({ theme }) => theme.hoverBackground};
  }
`;

interface DashboardFiltersProps {
  categories: { name: string }[];
  priorities: { name: string }[];
  statuses: { status: string }[];
  users: { userId: number; username: string; fullName: string }[];
  initialFilters: FilterType;
  onApplyFilters: (filters: FilterType) => void;
}

/**
 * Componente para los filtros del dashboard
 */
const DashboardFilters: React.FC<DashboardFiltersProps> = ({
  categories,
  priorities,
  statuses,
  users,
  initialFilters,
  onApplyFilters
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterType>(initialFilters);
  
  // Función para actualizar un filtro
  const handleFilterChange = (name: keyof FilterType, value: any) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };
  
  // Función para limpiar todos los filtros
  const handleClearFilters = () => {
    setFilters({});
  };
  
  // Función para aplicar los filtros
  const handleApplyFilters = () => {
    onApplyFilters(filters);
  };
  
  // Obtener fecha actual en formato ISO
  const getCurrentDate = () => {
    const now = new Date();
    return now.toISOString().split('T')[0];
  };
  
  // Obtener fecha de hace 30 días en formato ISO
  const getLastMonthDate = () => {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return date.toISOString().split('T')[0];
  };
  
  return (
    <>
      <ToggleButton onClick={() => setShowFilters(!showFilters)}>
        <FiFilter size={16} />
        {showFilters ? 'Ocultar filtros' : 'Mostrar filtros'}
      </ToggleButton>
      
      <FiltersContainer $visible={showFilters}>
        <FiltersHeader>
          <FiltersTitle>
            <FiFilter size={18} />
            Filtros del Dashboard
          </FiltersTitle>
        </FiltersHeader>
        
        <FiltersGrid>
          <FormGroup>
            <Label htmlFor="startDate">
              <FiCalendar size={14} />
              Fecha de inicio
            </Label>
            <Input
              id="startDate"
              type="date"
              value={filters.startDate || getLastMonthDate()}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="endDate">
              <FiCalendar size={14} />
              Fecha de fin
            </Label>
            <Input
              id="endDate"
              type="date"
              value={filters.endDate || getCurrentDate()}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="category">
              <FiTag size={14} />
              Categoría
            </Label>
            <Select
              id="category"
              value={filters.category || ''}
              onChange={(e) => handleFilterChange('category', e.target.value)}
            >
              <option value="">Todas las categorías</option>
              {categories.map((category) => (
                <option key={category.name} value={category.name}>
                  {category.name}
                </option>
              ))}
            </Select>
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="priority">
              <FiFlag size={14} />
              Prioridad
            </Label>
            <Select
              id="priority"
              value={filters.priority || ''}
              onChange={(e) => handleFilterChange('priority', e.target.value)}
            >
              <option value="">Todas las prioridades</option>
              {priorities.map((priority) => (
                <option key={priority.name} value={priority.name}>
                  {priority.name}
                </option>
              ))}
            </Select>
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="status">
              <FiActivity size={14} />
              Estado
            </Label>
            <Select
              id="status"
              value={filters.status || ''}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="">Todos los estados</option>
              {statuses.map((status) => (
                <option key={status.status} value={status.status}>
                  {status.status}
                </option>
              ))}
            </Select>
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="userId">
              <FiUser size={14} />
              Usuario
            </Label>
            <Select
              id="userId"
              value={filters.userId || ''}
              onChange={(e) => handleFilterChange('userId', e.target.value ? Number(e.target.value) : undefined)}
            >
              <option value="">Todos los usuarios</option>
              {users.map((user) => (
                <option key={user.userId} value={user.userId}>
                  {user.fullName} ({user.username})
                </option>
              ))}
            </Select>
          </FormGroup>
        </FiltersGrid>
        
        <ButtonsContainer>
          <Button onClick={handleClearFilters}>
            <FiRefreshCw size={16} />
            Limpiar filtros
          </Button>
          <Button $primary onClick={handleApplyFilters}>
            <FiSearch size={16} />
            Aplicar filtros
          </Button>
        </ButtonsContainer>
      </FiltersContainer>
    </>
  );
};

export default DashboardFilters;
