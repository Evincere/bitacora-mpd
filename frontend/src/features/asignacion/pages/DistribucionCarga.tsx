import React, { useState } from 'react';
import styled from 'styled-components';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import asignacionService, { EjecutorConTareas } from '../services/asignacionService';
import { Loader } from '@/shared/components/common';
import {
  FiUsers,
  FiFilter,
  FiSearch,
  FiBarChart2,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
  FiUser,
  FiCalendar,
  FiList
} from 'react-icons/fi';

// Componente para mostrar la distribución de carga de trabajo entre ejecutores

const PageContainer = styled.div`
  padding: 0;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const PageTitle = styled.h1`
  font-size: 24px;
  margin: 0;
  color: ${({ theme }) => theme.text};
  display: flex;
  align-items: center;
  gap: 12px;
`;

const FiltersContainer = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

const SearchInput = styled.div`
  position: relative;
  flex: 1;
  min-width: 200px;

  input {
    width: 100%;
    padding: 10px 12px 10px 36px;
    border-radius: 4px;
    border: 1px solid ${({ theme }) => theme.border};
    background-color: ${({ theme }) => theme.background};
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

const FilterSelect = styled.select`
  padding: 10px 12px;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.border};
  background-color: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  font-size: 14px;
  transition: border-color 0.2s;
  min-width: 150px;

  &:focus {
    border-color: ${({ theme }) => theme.primary};
    outline: none;
  }
`;

const Button = styled.button`
  padding: 10px 16px;
  border-radius: 4px;
  font-weight: 500;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s;
  background-color: transparent;
  color: ${({ theme }) => theme.textSecondary};
  border: 1px solid ${({ theme }) => theme.border};

  &:hover {
    background-color: ${({ theme }) => theme.backgroundHover};
  }
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`;

const StatCard = styled.div`
  background-color: ${({ theme }) => theme.backgroundSecondary};
  border-radius: 8px;
  padding: 16px;
  box-shadow: ${({ theme }) => theme.shadow};
  display: flex;
  flex-direction: column;
`;

const StatTitle = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.textSecondary};
  margin-bottom: 8px;
`;

const StatValue = styled.div`
  font-size: 24px;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
`;

const StatFooter = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.textSecondary};
  margin-top: 8px;
`;

const DistribucionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
`;

const EjecutorCard = styled.div`
  background-color: ${({ theme }) => theme.backgroundSecondary};
  border-radius: 8px;
  box-shadow: ${({ theme }) => theme.shadow};
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: ${({ theme }) => theme.shadowHover};
  }
`;

const EjecutorHeader = styled.div`
  padding: 16px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  display: flex;
  align-items: center;
  gap: 12px;
`;

const EjecutorAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${({ theme }) => `${theme.primary}20`};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.primary};
`;

const EjecutorInfo = styled.div`
  flex: 1;
`;

const EjecutorName = styled.h3`
  margin: 0 0 4px;
  font-size: 16px;
  color: ${({ theme }) => theme.text};
`;

const EjecutorMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  color: ${({ theme }) => theme.textSecondary};
  font-size: 13px;
`;

const CargaIndicator = styled.div<{ $carga: number }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.2px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);

  ${({ $carga, theme }) => {
    if ($carga <= 2) {
      return `
        background-color: #E8F5E9;
        color: #1B5E20;
        border: 1px solid #4CAF50;
      `;
    } else if ($carga <= 4) {
      return `
        background-color: #FFF3E0;
        color: #E65100;
        border: 1px solid #FF9800;
      `;
    } else {
      return `
        background-color: #FFEBEE;
        color: #B71C1C;
        border: 1px solid #F44336;
      `;
    }
  }}
`;

const EjecutorContent = styled.div`
  padding: 16px;
`;

const TareasList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const TareaItem = styled.div`
  padding: 10px;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.backgroundAlt};
  border-left: 3px solid ${({ theme }) => theme.border};

  &:hover {
    background-color: ${({ theme }) => theme.backgroundHover};
  }
`;

const TareaHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
`;

const TareaTitulo = styled.div`
  font-weight: 500;
  color: ${({ theme }) => theme.text};
  font-size: 14px;
`;

const TareaMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: ${({ theme }) => theme.textSecondary};
`;

const TareaFecha = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const PriorityBadge = styled.span<{ $priority: string }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.2px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  text-shadow: 0 0 1px rgba(0, 0, 0, 0.1);

  ${({ $priority, theme }) => {
    switch ($priority) {
      case 'CRITICAL':
        return `
          background-color: #FFEBEE;
          color: #B71C1C;
          border: 1px solid #F44336;
        `;
      case 'HIGH':
        return `
          background-color: #FFF3E0;
          color: #E65100;
          border: 1px solid #FF9800;
        `;
      case 'MEDIUM':
        return `
          background-color: #E3F2FD;
          color: #0D47A1;
          border: 1px solid #2196F3;
        `;
      case 'LOW':
        return `
          background-color: #E8F5E9;
          color: #1B5E20;
          border: 1px solid #4CAF50;
        `;
      case 'TRIVIAL':
        return `
          background-color: #ECEFF1;
          color: #263238;
          border: 1px solid #607D8B;
        `;
      default:
        return `
          background-color: #ECEFF1;
          color: #263238;
          border: 1px solid #607D8B;
        `;
    }
  }}
`;

const StatusBadge = styled.span<{ $status: string }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.2px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  text-shadow: 0 0 1px rgba(0, 0, 0, 0.1);

  ${({ $status, theme }) => {
    switch ($status) {
      case 'REQUESTED':
        return `
          background-color: #E3F2FD;
          color: #0D47A1;
          border: 1px solid #2196F3;
        `;
      case 'ASSIGNED':
        return `
          background-color: #FFF8E1;
          color: #E65100;
          border: 1px solid #FFC107;
        `;
      case 'IN_PROGRESS':
        return `
          background-color: #EDE7F6;
          color: #4527A0;
          border: 1px solid #673AB7;
        `;
      case 'COMPLETED':
        return `
          background-color: #E8F5E9;
          color: #1B5E20;
          border: 1px solid #4CAF50;
        `;
      case 'APPROVED':
        return `
          background-color: #E8F5E9;
          color: #1B5E20;
          border: 1px solid #4CAF50;
        `;
      case 'REJECTED':
        return `
          background-color: #FFEBEE;
          color: #B71C1C;
          border: 1px solid #F44336;
        `;
      default:
        return `
          background-color: #ECEFF1;
          color: #263238;
          border: 1px solid #607D8B;
        `;
    }
  }}
`;

const EmptyTareas = styled.div`
  padding: 20px;
  text-align: center;
  color: ${({ theme }) => theme.textSecondary};
  font-size: 14px;
`;

const ProgressBar = styled.div`
  height: 6px;
  background-color: ${({ theme }) => theme.backgroundAlt};
  border-radius: 3px;
  margin-top: 12px;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ $percentage: number; $color: string }>`
  height: 100%;
  width: ${({ $percentage }) => `${$percentage}%`};
  background-color: ${({ $color }) => $color};
  transition: width 0.3s ease;
`;

// Función para formatear fechas
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

// Función para obtener el texto de estado
const getStatusText = (status: string) => {
  switch (status) {
    case 'REQUESTED':
      return 'Solicitada';
    case 'ASSIGNED':
      return 'Asignada';
    case 'IN_PROGRESS':
      return 'En Progreso';
    case 'COMPLETED':
      return 'Completada';
    case 'APPROVED':
      return 'Aprobada';
    case 'REJECTED':
      return 'Rechazada';
    default:
      return status;
  }
};

// Función para obtener el icono de estado
const getStatusIcon = (status: string) => {
  switch (status) {
    case 'REQUESTED':
      return <FiClock size={12} />;
    case 'ASSIGNED':
      return <FiClock size={12} />;
    case 'IN_PROGRESS':
      return <FiClock size={12} />;
    case 'COMPLETED':
      return <FiCheckCircle size={12} />;
    case 'APPROVED':
      return <FiCheckCircle size={12} />;
    case 'REJECTED':
      return <FiAlertCircle size={12} />;
    default:
      return <FiAlertCircle size={12} />;
  }
};

// Función para obtener el texto de prioridad
const getPriorityText = (priority: string) => {
  switch (priority) {
    case 'CRITICAL':
      return 'Crítica';
    case 'HIGH':
      return 'Alta';
    case 'MEDIUM':
      return 'Media';
    case 'LOW':
      return 'Baja';
    case 'TRIVIAL':
      return 'Trivial';
    default:
      return priority;
  }
};

// Función para obtener el color de progreso según la carga
const getProgressColor = (carga: number) => {
  if (carga <= 2) return '#10b981'; // success
  if (carga <= 4) return '#f59e0b'; // warning
  return '#ef4444'; // error
};

const DistribucionCarga: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [especialidadFilter, setEspecialidadFilter] = useState('');

  const handleVerDetalleTarea = (id: number) => {
    console.log(`Navegando a detalle de tarea con ID: ${id}`);
    navigate(`/app/asignacion/detalle/${id}`);
  };

  // Usar React Query para obtener los datos
  const {
    data: ejecutores = [],
    isLoading,
    error: queryError,
    refetch
  } = useQuery({
    queryKey: ['assignedTasksByExecutor'],
    queryFn: asignacionService.getAssignedTasksByExecutor,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  // Convertir el error a un mensaje legible
  const errorMessage = queryError
    ? (queryError instanceof Error ? queryError.message : 'Error al cargar los datos')
    : null;

  // Calcular estadísticas
  const totalEjecutores = ejecutores.length;
  const totalTareas = ejecutores.reduce((acc, ejecutor) => acc + ejecutor.tareas.length, 0);
  const tareasEnProgreso = ejecutores.reduce(
    (acc, ejecutor) => acc + ejecutor.tareas.filter(t => t.estado === 'IN_PROGRESS').length,
    0
  );
  const tareasAsignadas = ejecutores.reduce(
    (acc, ejecutor) => acc + ejecutor.tareas.filter(t => t.estado === 'ASSIGNED').length,
    0
  );
  const cargaPromedio = totalEjecutores > 0 ? totalTareas / totalEjecutores : 0;

  // Filtrar ejecutores según los criterios
  const filteredEjecutores = ejecutores.filter(ejecutor => {
    const matchesSearch = searchTerm === '' ||
      ejecutor.nombre.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesEspecialidad = especialidadFilter === '' || ejecutor.especialidad === especialidadFilter;

    return matchesSearch && matchesEspecialidad;
  });

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>
          <FiUsers size={24} />
          Distribución de Carga de Trabajo
        </PageTitle>
      </PageHeader>

      {isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '50px 0' }}>
          <Loader size="large" />
        </div>
      ) : queryError ? (
        <div style={{
          padding: '20px',
          textAlign: 'center',
          color: '#ef4444',
          backgroundColor: '#fee2e2',
          borderRadius: '8px',
          margin: '20px 0'
        }}>
          <FiAlertCircle size={24} style={{ marginBottom: '10px' }} />
          <p>{errorMessage}</p>
          <button
            onClick={() => refetch()}
            style={{
              marginTop: '10px',
              padding: '8px 16px',
              backgroundColor: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Reintentar
          </button>
        </div>
      ) : (
        <>
          <StatsContainer>
            <StatCard>
              <StatTitle>Total de Ejecutores</StatTitle>
              <StatValue>{totalEjecutores}</StatValue>
            </StatCard>
            <StatCard>
              <StatTitle>Total de Tareas</StatTitle>
              <StatValue>{totalTareas}</StatValue>
              <StatFooter>
                {tareasEnProgreso} en progreso, {tareasAsignadas} asignadas
              </StatFooter>
            </StatCard>
            <StatCard>
              <StatTitle>Carga Promedio</StatTitle>
              <StatValue>{cargaPromedio.toFixed(1)}</StatValue>
              <StatFooter>tareas por ejecutor</StatFooter>
            </StatCard>
          </StatsContainer>

          <FiltersContainer>
            <SearchInput>
              <FiSearch size={16} />
              <input
                type="text"
                placeholder="Buscar ejecutores..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </SearchInput>
            <FilterSelect
              value={especialidadFilter}
              onChange={(e) => setEspecialidadFilter(e.target.value)}
            >
              <option value="">Todas las especialidades</option>
              <option value="ADMINISTRATIVA">Administrativa</option>
              <option value="LEGAL">Legal</option>
              <option value="TECNICA">Técnica</option>
              <option value="FINANCIERA">Financiera</option>
              <option value="RECURSOS_HUMANOS">Recursos Humanos</option>
              <option value="GENERAL">General</option>
            </FilterSelect>
            <Button>
              <FiFilter size={16} />
              Más filtros
            </Button>
          </FiltersContainer>

          {filteredEjecutores.length === 0 ? (
            <div style={{
              padding: '30px',
              textAlign: 'center',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              margin: '20px 0',
              color: '#6c757d'
            }}>
              <FiUsers size={40} style={{ marginBottom: '15px', opacity: 0.5 }} />
              <h3 style={{ marginBottom: '10px' }}>No se encontraron ejecutores</h3>
              <p>
                {searchTerm || especialidadFilter ?
                  'Intente con otros criterios de búsqueda' :
                  'No hay ejecutores con tareas asignadas en este momento'}
              </p>
            </div>
          ) : (
            <DistribucionGrid>
              {filteredEjecutores.map((ejecutor) => (
                <EjecutorCard key={ejecutor.id}>
                  <EjecutorHeader>
                    <EjecutorAvatar>
                      <FiUser size={20} />
                    </EjecutorAvatar>
                    <EjecutorInfo>
                      <EjecutorName>{ejecutor.nombre}</EjecutorName>
                      <EjecutorMeta>
                        <span>Especialidad: {ejecutor.especialidad}</span>
                        <CargaIndicator $carga={ejecutor.cargaActual}>
                          {ejecutor.cargaActual} tareas
                        </CargaIndicator>
                      </EjecutorMeta>
                    </EjecutorInfo>
                  </EjecutorHeader>
                  <EjecutorContent>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <div style={{ fontSize: '14px', fontWeight: 500 }}>
                        <FiList size={14} style={{ marginRight: '6px' }} />
                        Tareas asignadas
                      </div>
                      <div style={{ fontSize: '12px', color: '#666' }}>
                        {ejecutor.tareas.length} tareas
                      </div>
                    </div>

                    <ProgressBar>
                      <ProgressFill
                        $percentage={(ejecutor.cargaActual / 5) * 100}
                        $color={getProgressColor(ejecutor.cargaActual)}
                      />
                    </ProgressBar>

                    {ejecutor.tareas.length > 0 ? (
                      <TareasList>
                        {ejecutor.tareas.map((tarea) => (
                          <TareaItem
                            key={tarea.id}
                            onClick={() => handleVerDetalleTarea(tarea.id)}
                            style={{ cursor: 'pointer' }}
                          >
                            <TareaHeader>
                              <TareaTitulo>{tarea.titulo}</TareaTitulo>
                              <PriorityBadge $priority={tarea.prioridad}>
                                {getPriorityText(tarea.prioridad)}
                              </PriorityBadge>
                            </TareaHeader>
                            <TareaMeta>
                              <TareaFecha>
                                <FiCalendar size={12} />
                                {tarea.fechaLimite ? formatDate(tarea.fechaLimite) : 'Sin fecha límite'}
                              </TareaFecha>
                              <StatusBadge $status={tarea.estado}>
                                {getStatusIcon(tarea.estado)}
                                {getStatusText(tarea.estado)}
                              </StatusBadge>
                            </TareaMeta>
                          </TareaItem>
                        ))}
                      </TareasList>
                    ) : (
                      <EmptyTareas>
                        No hay tareas asignadas
                      </EmptyTareas>
                    )}
                  </EjecutorContent>
                </EjecutorCard>
              ))}
            </DistribucionGrid>
          )}
        </>
      )}
    </PageContainer>
  );
};

export default DistribucionCarga;
