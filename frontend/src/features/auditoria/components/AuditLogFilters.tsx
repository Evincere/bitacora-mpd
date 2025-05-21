import React, { useState } from 'react';
import styled from 'styled-components';
import {
  FiSearch,
  FiUser,
  FiActivity,
  FiDatabase,
  FiCalendar,
  FiTag,
  FiAlertTriangle,
  FiCheckCircle,
  FiXCircle,
  FiRefreshCw
} from 'react-icons/fi';
import { AuditActionType, AuditLogFilters as AuditLogFiltersType, AuditResult } from '../types';

// Estilos
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FiltersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
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

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Checkbox = styled.input`
  width: 16px;
  height: 16px;
  cursor: pointer;
`;

const CheckboxLabel = styled.label`
  font-size: 14px;
  color: ${({ theme }) => theme.text};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 8px;
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

interface AuditLogFiltersProps {
  initialFilters: AuditLogFiltersType;
  onApplyFilters: (filters: Omit<AuditLogFiltersType, 'page' | 'size'>) => void;
}

const AuditLogFilters: React.FC<AuditLogFiltersProps> = ({
  initialFilters,
  onApplyFilters
}) => {
  // Estado local para los filtros
  const [filters, setFilters] = useState<Omit<AuditLogFiltersType, 'page' | 'size'>>({
    userId: initialFilters.userId,
    username: initialFilters.username,
    actionType: initialFilters.actionType,
    entityType: initialFilters.entityType,
    entityId: initialFilters.entityId,
    result: initialFilters.result,
    startDate: initialFilters.startDate,
    endDate: initialFilters.endDate,
    suspicious: initialFilters.suspicious,
    module: initialFilters.module
  });

  // Función para actualizar un filtro
  const handleFilterChange = (name: keyof Omit<AuditLogFiltersType, 'page' | 'size'>, value: any) => {
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

  return (
    <Container>
      <FiltersGrid>
        <FormGroup>
          <Label htmlFor="username">
            <FiUser size={14} />
            Usuario
          </Label>
          <Input
            id="username"
            type="text"
            placeholder="Nombre de usuario"
            value={filters.username || ''}
            onChange={(e) => handleFilterChange('username', e.target.value)}
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="actionType">
            <FiActivity size={14} />
            Tipo de acción
          </Label>
          <Select
            id="actionType"
            value={filters.actionType || ''}
            onChange={(e) => handleFilterChange('actionType', e.target.value || undefined)}
          >
            <option value="">Todas las acciones</option>
            {Object.values(AuditActionType).map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </Select>
        </FormGroup>

        <FormGroup>
          <Label htmlFor="entityType">
            <FiDatabase size={14} />
            Tipo de entidad
          </Label>
          <Input
            id="entityType"
            type="text"
            placeholder="Tipo de entidad"
            value={filters.entityType || ''}
            onChange={(e) => handleFilterChange('entityType', e.target.value)}
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="entityId">
            <FiTag size={14} />
            ID de entidad
          </Label>
          <Input
            id="entityId"
            type="text"
            placeholder="ID de entidad"
            value={filters.entityId || ''}
            onChange={(e) => handleFilterChange('entityId', e.target.value)}
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="result">
            <FiCheckCircle size={14} />
            Resultado
          </Label>
          <Select
            id="result"
            value={filters.result || ''}
            onChange={(e) => handleFilterChange('result', e.target.value || undefined)}
          >
            <option value="">Todos los resultados</option>
            {Object.values(AuditResult).map((result) => (
              <option key={result} value={result}>
                {result}
              </option>
            ))}
          </Select>
        </FormGroup>

        <FormGroup>
          <Label htmlFor="startDate">
            <FiCalendar size={14} />
            Fecha de inicio
          </Label>
          <Input
            id="startDate"
            type="datetime-local"
            value={filters.startDate || ''}
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
            type="datetime-local"
            value={filters.endDate || ''}
            onChange={(e) => handleFilterChange('endDate', e.target.value)}
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="module">
            <FiDatabase size={14} />
            Módulo
          </Label>
          <Input
            id="module"
            type="text"
            placeholder="Módulo del sistema"
            value={filters.module || ''}
            onChange={(e) => handleFilterChange('module', e.target.value)}
          />
        </FormGroup>
      </FiltersGrid>

      <CheckboxContainer>
        <Checkbox
          id="suspicious"
          type="checkbox"
          checked={filters.suspicious || false}
          onChange={(e) => handleFilterChange('suspicious', e.target.checked)}
        />
        <CheckboxLabel htmlFor="suspicious">
          <FiAlertTriangle size={14} color="#f59e0b" />
          Mostrar solo actividades sospechosas
        </CheckboxLabel>
      </CheckboxContainer>

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
    </Container>
  );
};

export default AuditLogFilters;
