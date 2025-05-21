import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  FiBarChart2, 
  FiPieChart, 
  FiTrendingUp, 
  FiCalendar,
  FiRefreshCw,
  FiAlertTriangle,
  FiCheckCircle,
  FiEye,
  FiX
} from 'react-icons/fi';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { 
  SecurityAlertType, 
  SecurityAlertSeverity, 
  SecurityAlertStatus 
} from '../types/securityAlertTypes';
import { useSecurityAlertStatistics } from '../hooks/useSecurityAlerts';

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

const DateRangeSelector = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
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

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
`;

const StatCard = styled.div`
  background-color: ${({ theme }) => theme.cardBackground};
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.border};
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const StatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StatTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StatValue = styled.div`
  font-size: 32px;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
`;

const ChartContainer = styled.div`
  background-color: ${({ theme }) => theme.cardBackground};
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.border};
  padding: 20px;
  height: 300px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ChartTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ChartContent = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const BarChartContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`;

const BarChartContent = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  height: 200px;
`;

const BarGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  width: 60px;
`;

const Bar = styled.div<{ $height: number; $color: string }>`
  width: 40px;
  height: ${({ $height }) => `${$height}%`};
  background-color: ${({ $color }) => $color};
  border-radius: 4px 4px 0 0;
  transition: height 0.3s ease;
  
  &:hover {
    opacity: 0.8;
  }
`;

const BarLabel = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.textSecondary};
  text-align: center;
`;

const PieChartContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const PieChart = styled.div`
  position: relative;
  width: 200px;
  height: 200px;
`;

const PieSlice = styled.div<{ $color: string; $percentage: number; $rotation: number }>`
  position: absolute;
  width: 100%;
  height: 100%;
  clip-path: polygon(50% 50%, 50% 0%, ${({ $percentage }) => 50 + 50 * Math.sin($percentage * Math.PI / 50)}% ${({ $percentage }) => 50 - 50 * Math.cos($percentage * Math.PI / 50)}%, 50% 50%);
  background-color: ${({ $color }) => $color};
  transform: rotate(${({ $rotation }) => $rotation}deg);
`;

const PieLegend = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-left: 20px;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: ${({ theme }) => theme.text};
`;

const LegendColor = styled.div<{ $color: string }>`
  width: 12px;
  height: 12px;
  background-color: ${({ $color }) => $color};
  border-radius: 2px;
`;

const LineChartContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`;

const LineChartContent = styled.div`
  position: relative;
  height: 200px;
  width: 100%;
`;

const LineChartSvg = styled.svg`
  width: 100%;
  height: 100%;
`;

const LineChartAxis = styled.div`
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 1px;
  background-color: ${({ theme }) => theme.border};
`;

const LineChartLabels = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
`;

const LineChartLabel = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.textSecondary};
  text-align: center;
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

/**
 * Componente para mostrar estadísticas de alertas de seguridad
 */
const SecurityAlertStatistics: React.FC = () => {
  // Estado para el rango de fechas
  const [startDate, setStartDate] = useState<string>(() => {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return format(date, 'yyyy-MM-dd');
  });
  
  const [endDate, setEndDate] = useState<string>(() => {
    return format(new Date(), 'yyyy-MM-dd');
  });
  
  // Consulta de estadísticas
  const { data: stats, isLoading, isError, refetch } = useSecurityAlertStatistics(startDate, endDate);
  
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
  
  // Función para obtener el color de la severidad
  const getSeverityColor = (severity: SecurityAlertSeverity) => {
    switch (severity) {
      case SecurityAlertSeverity.CRITICAL:
        return '#ef4444';
      case SecurityAlertSeverity.HIGH:
        return '#f97316';
      case SecurityAlertSeverity.MEDIUM:
        return '#f59e0b';
      case SecurityAlertSeverity.LOW:
        return '#10b981';
      default:
        return '#94a3b8';
    }
  };
  
  // Función para obtener el color del estado
  const getStatusColor = (status: SecurityAlertStatus) => {
    switch (status) {
      case SecurityAlertStatus.NEW:
        return '#3b82f6';
      case SecurityAlertStatus.ACKNOWLEDGED:
        return '#8b5cf6';
      case SecurityAlertStatus.RESOLVED:
        return '#10b981';
      case SecurityAlertStatus.FALSE_POSITIVE:
        return '#94a3b8';
      default:
        return '#94a3b8';
    }
  };
  
  // Función para obtener el color del tipo
  const getTypeColor = (type: SecurityAlertType) => {
    switch (type) {
      case SecurityAlertType.FAILED_LOGIN:
        return '#ef4444';
      case SecurityAlertType.UNUSUAL_ACCESS_TIME:
        return '#f97316';
      case SecurityAlertType.UNUSUAL_LOCATION:
        return '#f59e0b';
      case SecurityAlertType.PERMISSION_CHANGE:
        return '#8b5cf6';
      case SecurityAlertType.MASS_DELETION:
        return '#ec4899';
      default:
        return '#94a3b8';
    }
  };
  
  // Función para obtener el icono del estado
  const getStatusIcon = (status: SecurityAlertStatus) => {
    switch (status) {
      case SecurityAlertStatus.NEW:
        return <FiAlertTriangle size={16} />;
      case SecurityAlertStatus.ACKNOWLEDGED:
        return <FiEye size={16} />;
      case SecurityAlertStatus.RESOLVED:
        return <FiCheckCircle size={16} />;
      case SecurityAlertStatus.FALSE_POSITIVE:
        return <FiX size={16} />;
      default:
        return null;
    }
  };
  
  // Renderizar gráfico de barras para severidad
  const renderSeverityBarChart = () => {
    if (!stats) return null;
    
    const severities = Object.keys(stats.bySeverity) as SecurityAlertSeverity[];
    const maxValue = Math.max(...Object.values(stats.bySeverity));
    
    return (
      <BarChartContainer>
        <BarChartContent>
          {severities.map((severity) => (
            <BarGroup key={severity}>
              <Bar 
                $height={(stats.bySeverity[severity] / maxValue) * 100}
                $color={getSeverityColor(severity)}
              />
              <BarLabel>{getSeverityName(severity)}</BarLabel>
            </BarGroup>
          ))}
        </BarChartContent>
      </BarChartContainer>
    );
  };
  
  // Renderizar gráfico circular para estado
  const renderStatusPieChart = () => {
    if (!stats) return null;
    
    const statuses = Object.keys(stats.byStatus) as SecurityAlertStatus[];
    const total = Object.values(stats.byStatus).reduce((sum, value) => sum + value, 0);
    
    let rotation = 0;
    
    return (
      <PieChartContainer>
        <PieChart>
          {statuses.map((status) => {
            const percentage = (stats.byStatus[status] / total) * 100;
            const currentRotation = rotation;
            rotation += percentage * 3.6; // 3.6 degrees per percentage point (360 / 100)
            
            return (
              <PieSlice 
                key={status}
                $color={getStatusColor(status)}
                $percentage={percentage}
                $rotation={currentRotation}
              />
            );
          })}
        </PieChart>
        
        <PieLegend>
          {statuses.map((status) => (
            <LegendItem key={status}>
              <LegendColor $color={getStatusColor(status)} />
              {getStatusName(status)} ({stats.byStatus[status]})
            </LegendItem>
          ))}
        </PieLegend>
      </PieChartContainer>
    );
  };
  
  // Renderizar gráfico de líneas para timeline
  const renderTimelineChart = () => {
    if (!stats || !stats.timeline || stats.timeline.length === 0) return null;
    
    const maxValue = Math.max(...stats.timeline.map(item => item.count));
    const points = stats.timeline.map((item, index) => {
      const x = (index / (stats.timeline.length - 1)) * 100;
      const y = 100 - (item.count / maxValue) * 100;
      return { x, y, date: item.date, count: item.count };
    });
    
    // Crear path para la línea
    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      path += ` L ${points[i].x} ${points[i].y}`;
    }
    
    return (
      <LineChartContainer>
        <LineChartContent>
          <LineChartSvg viewBox="0 0 100 100" preserveAspectRatio="none">
            <path 
              d={path}
              stroke="#3b82f6"
              strokeWidth="2"
              fill="none"
            />
            {points.map((point, index) => (
              <circle 
                key={index}
                cx={point.x}
                cy={point.y}
                r="2"
                fill="#3b82f6"
              />
            ))}
          </LineChartSvg>
          <LineChartAxis />
        </LineChartContent>
        
        <LineChartLabels>
          {stats.timeline.map((item, index) => (
            <LineChartLabel key={index}>
              {format(new Date(item.date), 'dd/MM', { locale: es })}
            </LineChartLabel>
          ))}
        </LineChartLabels>
      </LineChartContainer>
    );
  };
  
  return (
    <Container>
      <Header>
        <Title>
          <FiBarChart2 size={24} />
          Estadísticas de Alertas
        </Title>
        
        <DateRangeSelector>
          <FiCalendar size={16} />
          <DateInput 
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <span>a</span>
          <DateInput 
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <Button onClick={() => refetch()} disabled={isLoading}>
            {isLoading ? (
              <LoadingSpinner size={16} />
            ) : (
              <FiRefreshCw size={16} />
            )}
            Actualizar
          </Button>
        </DateRangeSelector>
      </Header>
      
      {isLoading ? (
        <EmptyState>
          <LoadingSpinner size={48} style={{ marginBottom: '16px' }} />
          <div>Cargando estadísticas...</div>
        </EmptyState>
      ) : isError ? (
        <EmptyState>
          <FiAlertTriangle size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
          <div>Error al cargar las estadísticas.</div>
          <div style={{ marginTop: '8px', fontSize: '13px' }}>
            Por favor, intenta recargar la página.
          </div>
        </EmptyState>
      ) : !stats ? (
        <EmptyState>
          <FiAlertTriangle size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
          <div>No hay datos disponibles.</div>
        </EmptyState>
      ) : (
        <>
          <StatsGrid>
            <StatCard>
              <StatHeader>
                <StatTitle>
                  <FiAlertTriangle size={16} />
                  Total de Alertas
                </StatTitle>
              </StatHeader>
              <StatValue>{stats.totalAlerts}</StatValue>
            </StatCard>
            
            <StatCard>
              <StatHeader>
                <StatTitle>
                  <FiAlertTriangle size={16} />
                  Alertas Nuevas
                </StatTitle>
              </StatHeader>
              <StatValue>{stats.byStatus[SecurityAlertStatus.NEW] || 0}</StatValue>
            </StatCard>
            
            <StatCard>
              <StatHeader>
                <StatTitle>
                  <FiEye size={16} />
                  Alertas Reconocidas
                </StatTitle>
              </StatHeader>
              <StatValue>{stats.byStatus[SecurityAlertStatus.ACKNOWLEDGED] || 0}</StatValue>
            </StatCard>
            
            <StatCard>
              <StatHeader>
                <StatTitle>
                  <FiCheckCircle size={16} />
                  Alertas Resueltas
                </StatTitle>
              </StatHeader>
              <StatValue>{stats.byStatus[SecurityAlertStatus.RESOLVED] || 0}</StatValue>
            </StatCard>
          </StatsGrid>
          
          <StatsGrid>
            <ChartContainer>
              <ChartHeader>
                <ChartTitle>
                  <FiBarChart2 size={16} />
                  Alertas por Severidad
                </ChartTitle>
              </ChartHeader>
              <ChartContent>
                {renderSeverityBarChart()}
              </ChartContent>
            </ChartContainer>
            
            <ChartContainer>
              <ChartHeader>
                <ChartTitle>
                  <FiPieChart size={16} />
                  Alertas por Estado
                </ChartTitle>
              </ChartHeader>
              <ChartContent>
                {renderStatusPieChart()}
              </ChartContent>
            </ChartContainer>
          </StatsGrid>
          
          <ChartContainer>
            <ChartHeader>
              <ChartTitle>
                <FiTrendingUp size={16} />
                Tendencia de Alertas
              </ChartTitle>
            </ChartHeader>
            <ChartContent>
              {renderTimelineChart()}
            </ChartContent>
          </ChartContainer>
        </>
      )}
    </Container>
  );
};

export default SecurityAlertStatistics;
