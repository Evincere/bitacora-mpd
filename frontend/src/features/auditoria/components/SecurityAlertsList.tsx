import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  FiAlertTriangle, 
  FiFilter, 
  FiSearch, 
  FiRefreshCw,
  FiCalendar,
  FiChevronDown,
  FiX,
  FiCheck,
  FiInfo
} from 'react-icons/fi';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { 
  SecurityAlert, 
  SecurityAlertFilter, 
  SecurityAlertType, 
  SecurityAlertSeverity, 
  SecurityAlertStatus 
} from '../types/securityAlertTypes';
import { useSecurityAlerts } from '../hooks/useSecurityAlerts';
import SecurityAlertCard from './SecurityAlertCard';

// Estilos
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
`;

const Button = styled.button<{ $primary?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background-color: ${({ theme, $primary }) => 
    $primary ? theme.primary : theme.cardBackground};
  color: ${({ theme, $primary }) => 
    $primary ? '#fff' : theme.text};
  border: 1px solid ${({ theme, $primary }) => 
    $primary ? theme.primary : theme.border};
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${({ theme, $primary }) => 
      $primary ? theme.primaryDark : theme.hoverBackground};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const FiltersContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  padding: 16px;
  background-color: ${({ theme }) => theme.backgroundSecondary};
  border-radius: 8px;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const FilterLabel = styled.label`
  font-size: 12px;
  color: ${({ theme }) => theme.textSecondary};
  font-weight: 500;
`;

const Select = styled.select`
  padding: 8px 12px;
  background-color: ${({ theme }) => theme.backgroundInput};
  color: ${({ theme }) => theme.text};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 6px;
  font-size: 14px;
  min-width: 150px;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
  }
`;

const DateInput = styled.input`
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

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: ${({ theme }) => theme.backgroundInput};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 6px;
  padding: 0 12px;
  flex: 1;
  min-width: 200px;
`;

const SearchInput = styled.input`
  background: none;
  border: none;
  padding: 8px 0;
  color: ${({ theme }) => theme.text};
  font-size: 14px;
  width: 100%;
  
  &:focus {
    outline: none;
  }
`;

const ClearFiltersButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background-color: transparent;
  color: ${({ theme }) => theme.textSecondary};
  border: none;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    color: ${({ theme }) => theme.text};
  }
`;

const AlertsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  text-align: center;
  color: ${({ theme }) => theme.textSecondary};
  font-size: 14px;
  background-color: ${({ theme }) => theme.backgroundSecondary};
  border-radius: 8px;
`;

const LoadingSpinner = styled(FiRefreshCw)`
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const FilterDropdown = styled.div`
  position: relative;
  display: inline-block;
`;

const FilterButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background-color: ${({ theme }) => theme.cardBackground};
  color: ${({ theme }) => theme.text};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${({ theme }) => theme.hoverBackground};
  }
`;

const DropdownContent = styled.div<{ $show: boolean }>`
  display: ${({ $show }) => ($show ? 'block' : 'none')};
  position: absolute;
  right: 0;
  top: 100%;
  margin-top: 4px;
  background-color: ${({ theme }) => theme.cardBackground};
  min-width: 300px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 16px;
  z-index: 10;
`;

const FilterActions = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
`;

interface SecurityAlertsListProps {
  onViewAuditLog?: (logId: string) => void;
}

/**
 * Componente para mostrar la lista de alertas de seguridad
 */
const SecurityAlertsList: React.FC<SecurityAlertsListProps> = ({
  onViewAuditLog
}) => {
  // Estado para los filtros
  const [filter, setFilter] = useState<SecurityAlertFilter>({});
  
  // Estado para el dropdown de filtros
  const [showFilters, setShowFilters] = useState(false);
  
  // Estado para la búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  
  // Consulta de alertas
  const { data: alerts, isLoading, isError, refetch } = useSecurityAlerts(filter);
  
  // Efecto para filtrar por término de búsqueda
  useEffect(() => {
    const delaySearch = setTimeout(() => {
      // Aquí se implementaría la búsqueda en el backend
      // Por ahora, solo refrescamos los datos
      refetch();
    }, 500);
    
    return () => clearTimeout(delaySearch);
  }, [searchTerm, refetch]);
  
  // Función para actualizar un filtro
  const updateFilter = (key: keyof SecurityAlertFilter, value: any) => {
    setFilter(prev => ({
      ...prev,
      [key]: value === '' ? undefined : value
    }));
  };
  
  // Función para limpiar los filtros
  const clearFilters = () => {
    setFilter({});
    setSearchTerm('');
  };
  
  // Función para aplicar los filtros
  const applyFilters = () => {
    setShowFilters(false);
    refetch();
  };
  
  // Función para formatear fecha
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'yyyy-MM-dd', { locale: es });
    } catch (error) {
      return '';
    }
  };
  
  // Función para obtener el nombre del tipo de alerta
  const getAlertTypeName = (type: SecurityAlertType) => {
    switch (type) {
      case SecurityAlertType.FAILED_LOGIN:
        return 'Inicio de sesión fallido';
      case SecurityAlertType.UNUSUAL_ACCESS_TIME:
        return 'Acceso en horario inusual';
      case SecurityAlertType.UNUSUAL_LOCATION:
        return 'Acceso desde ubicación inusual';
      case SecurityAlertType.PERMISSION_CHANGE:
        return 'Cambio de permisos';
      case SecurityAlertType.MASS_DELETION:
        return 'Eliminación masiva';
      case SecurityAlertType.SUSPICIOUS_ACTIVITY:
        return 'Actividad sospechosa';
      case SecurityAlertType.BRUTE_FORCE_ATTACK:
        return 'Ataque de fuerza bruta';
      case SecurityAlertType.ACCOUNT_LOCKOUT:
        return 'Bloqueo de cuenta';
      case SecurityAlertType.PASSWORD_CHANGE:
        return 'Cambio de contraseña';
      case SecurityAlertType.ADMIN_ACTION:
        return 'Acción administrativa';
      default:
        return type;
    }
  };
  
  // Función para obtener el nombre de la severidad
  const getSeverityName = (severity: SecurityAlertSeverity) => {
    switch (severity) {
      case SecurityAlertSeverity.CRITICAL:
        return 'Crítica';
      case SecurityAlertSeverity.HIGH:
        return 'Alta';
      case SecurityAlertSeverity.MEDIUM:
        return 'Media';
      case SecurityAlertSeverity.LOW:
        return 'Baja';
      default:
        return severity;
    }
  };
  
  // Función para obtener el nombre del estado
  const getStatusName = (status: SecurityAlertStatus) => {
    switch (status) {
      case SecurityAlertStatus.NEW:
        return 'Nueva';
      case SecurityAlertStatus.ACKNOWLEDGED:
        return 'Reconocida';
      case SecurityAlertStatus.RESOLVED:
        return 'Resuelta';
      case SecurityAlertStatus.FALSE_POSITIVE:
        return 'Falso positivo';
      default:
        return status;
    }
  };
  
  // Filtrar alertas por término de búsqueda (cliente)
  const filteredAlerts = alerts
    ? alerts.filter(alert => 
        searchTerm === '' || 
        alert.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.userName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];
  
  return (
    <Container>
      <Header>
        <Title>
          <FiAlertTriangle size={24} />
          Alertas de Seguridad
        </Title>
        
        <ActionButtons>
          <SearchContainer>
            <FiSearch size={16} style={{ color: '#888', marginRight: '8px' }} />
            <SearchInput 
              placeholder="Buscar alertas..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchContainer>
          
          <FilterDropdown>
            <FilterButton onClick={() => setShowFilters(!showFilters)}>
              <FiFilter size={16} />
              Filtros
              <FiChevronDown size={16} />
            </FilterButton>
            
            <DropdownContent $show={showFilters}>
              <FilterGroup>
                <FilterLabel htmlFor="statusFilter">Estado</FilterLabel>
                <Select 
                  id="statusFilter"
                  value={filter.status || ''}
                  onChange={(e) => updateFilter('status', e.target.value as SecurityAlertStatus)}
                >
                  <option value="">Todos</option>
                  <option value={SecurityAlertStatus.NEW}>{getStatusName(SecurityAlertStatus.NEW)}</option>
                  <option value={SecurityAlertStatus.ACKNOWLEDGED}>{getStatusName(SecurityAlertStatus.ACKNOWLEDGED)}</option>
                  <option value={SecurityAlertStatus.RESOLVED}>{getStatusName(SecurityAlertStatus.RESOLVED)}</option>
                  <option value={SecurityAlertStatus.FALSE_POSITIVE}>{getStatusName(SecurityAlertStatus.FALSE_POSITIVE)}</option>
                </Select>
              </FilterGroup>
              
              <FilterGroup style={{ marginTop: '12px' }}>
                <FilterLabel htmlFor="severityFilter">Severidad</FilterLabel>
                <Select 
                  id="severityFilter"
                  value={filter.severity || ''}
                  onChange={(e) => updateFilter('severity', e.target.value as SecurityAlertSeverity)}
                >
                  <option value="">Todas</option>
                  <option value={SecurityAlertSeverity.CRITICAL}>{getSeverityName(SecurityAlertSeverity.CRITICAL)}</option>
                  <option value={SecurityAlertSeverity.HIGH}>{getSeverityName(SecurityAlertSeverity.HIGH)}</option>
                  <option value={SecurityAlertSeverity.MEDIUM}>{getSeverityName(SecurityAlertSeverity.MEDIUM)}</option>
                  <option value={SecurityAlertSeverity.LOW}>{getSeverityName(SecurityAlertSeverity.LOW)}</option>
                </Select>
              </FilterGroup>
              
              <FilterGroup style={{ marginTop: '12px' }}>
                <FilterLabel htmlFor="typeFilter">Tipo</FilterLabel>
                <Select 
                  id="typeFilter"
                  value={filter.type || ''}
                  onChange={(e) => updateFilter('type', e.target.value as SecurityAlertType)}
                >
                  <option value="">Todos</option>
                  <option value={SecurityAlertType.FAILED_LOGIN}>{getAlertTypeName(SecurityAlertType.FAILED_LOGIN)}</option>
                  <option value={SecurityAlertType.UNUSUAL_ACCESS_TIME}>{getAlertTypeName(SecurityAlertType.UNUSUAL_ACCESS_TIME)}</option>
                  <option value={SecurityAlertType.UNUSUAL_LOCATION}>{getAlertTypeName(SecurityAlertType.UNUSUAL_LOCATION)}</option>
                  <option value={SecurityAlertType.PERMISSION_CHANGE}>{getAlertTypeName(SecurityAlertType.PERMISSION_CHANGE)}</option>
                  <option value={SecurityAlertType.MASS_DELETION}>{getAlertTypeName(SecurityAlertType.MASS_DELETION)}</option>
                  <option value={SecurityAlertType.SUSPICIOUS_ACTIVITY}>{getAlertTypeName(SecurityAlertType.SUSPICIOUS_ACTIVITY)}</option>
                </Select>
              </FilterGroup>
              
              <FilterGroup style={{ marginTop: '12px' }}>
                <FilterLabel htmlFor="startDateFilter">Fecha Inicio</FilterLabel>
                <DateInput 
                  id="startDateFilter"
                  type="date"
                  value={filter.startDate || ''}
                  onChange={(e) => updateFilter('startDate', e.target.value)}
                />
              </FilterGroup>
              
              <FilterGroup style={{ marginTop: '12px' }}>
                <FilterLabel htmlFor="endDateFilter">Fecha Fin</FilterLabel>
                <DateInput 
                  id="endDateFilter"
                  type="date"
                  value={filter.endDate || ''}
                  onChange={(e) => updateFilter('endDate', e.target.value)}
                />
              </FilterGroup>
              
              <FilterActions>
                <ClearFiltersButton onClick={clearFilters}>
                  <FiX size={14} />
                  Limpiar
                </ClearFiltersButton>
                
                <Button $primary onClick={applyFilters}>
                  <FiCheck size={14} />
                  Aplicar
                </Button>
              </FilterActions>
            </DropdownContent>
          </FilterDropdown>
          
          <Button onClick={() => refetch()} disabled={isLoading}>
            {isLoading ? (
              <LoadingSpinner size={16} />
            ) : (
              <FiRefreshCw size={16} />
            )}
            Actualizar
          </Button>
        </ActionButtons>
      </Header>
      
      {Object.keys(filter).length > 0 && (
        <FiltersContainer>
          <div style={{ flex: 1 }}>
            <strong>Filtros aplicados:</strong>{' '}
            {filter.status && <span>Estado: {getStatusName(filter.status)}</span>}{' '}
            {filter.severity && <span>Severidad: {getSeverityName(filter.severity)}</span>}{' '}
            {filter.type && <span>Tipo: {getAlertTypeName(filter.type)}</span>}{' '}
            {filter.startDate && <span>Desde: {filter.startDate}</span>}{' '}
            {filter.endDate && <span>Hasta: {filter.endDate}</span>}
          </div>
          
          <ClearFiltersButton onClick={clearFilters}>
            <FiX size={14} />
            Limpiar filtros
          </ClearFiltersButton>
        </FiltersContainer>
      )}
      
      {isLoading ? (
        <EmptyState>
          <LoadingSpinner size={48} style={{ marginBottom: '16px' }} />
          <div>Cargando alertas de seguridad...</div>
        </EmptyState>
      ) : isError ? (
        <EmptyState>
          <FiAlertTriangle size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
          <div>Error al cargar las alertas de seguridad.</div>
          <div style={{ marginTop: '8px', fontSize: '13px' }}>
            Por favor, intenta recargar la página.
          </div>
        </EmptyState>
      ) : filteredAlerts.length === 0 ? (
        <EmptyState>
          <FiInfo size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
          <div>No hay alertas de seguridad que coincidan con los criterios de búsqueda.</div>
          <div style={{ marginTop: '8px', fontSize: '13px' }}>
            Intenta cambiar los filtros o realizar una búsqueda diferente.
          </div>
        </EmptyState>
      ) : (
        <AlertsGrid>
          {filteredAlerts.map((alert) => (
            <SecurityAlertCard 
              key={alert.id} 
              alert={alert}
              onViewAuditLog={onViewAuditLog}
            />
          ))}
        </AlertsGrid>
      )}
    </Container>
  );
};

export default SecurityAlertsList;
