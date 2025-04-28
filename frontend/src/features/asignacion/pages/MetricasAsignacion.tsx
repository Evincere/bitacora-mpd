import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  FiBarChart2, 
  FiFilter, 
  FiDownload, 
  FiCalendar,
  FiPieChart,
  FiTrendingUp,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle
} from 'react-icons/fi';

// Datos de ejemplo para las métricas
const MOCK_METRICAS = {
  totalSolicitudes: 120,
  solicitudesAsignadas: 95,
  solicitudesPendientes: 25,
  tiempoPromedioAsignacion: 1.2, // días
  tiempoPromedioCompletado: 4.5, // días
  tasaCompletado: 85, // porcentaje
  
  // Distribución por categoría
  distribucionCategoria: [
    { categoria: 'LEGAL', cantidad: 45, porcentaje: 37.5 },
    { categoria: 'ADMINISTRATIVA', cantidad: 30, porcentaje: 25 },
    { categoria: 'TECNICA', cantidad: 25, porcentaje: 20.8 },
    { categoria: 'FINANCIERA', cantidad: 15, porcentaje: 12.5 },
    { categoria: 'RECURSOS_HUMANOS', cantidad: 5, porcentaje: 4.2 }
  ],
  
  // Distribución por prioridad
  distribucionPrioridad: [
    { prioridad: 'CRITICAL', cantidad: 10, porcentaje: 8.3 },
    { prioridad: 'HIGH', cantidad: 35, porcentaje: 29.2 },
    { prioridad: 'MEDIUM', cantidad: 50, porcentaje: 41.7 },
    { prioridad: 'LOW', cantidad: 20, porcentaje: 16.7 },
    { prioridad: 'TRIVIAL', cantidad: 5, porcentaje: 4.1 }
  ],
  
  // Distribución por estado
  distribucionEstado: [
    { estado: 'REQUESTED', cantidad: 25, porcentaje: 20.8 },
    { estado: 'ASSIGNED', cantidad: 30, porcentaje: 25 },
    { estado: 'IN_PROGRESS', cantidad: 40, porcentaje: 33.3 },
    { estado: 'COMPLETED', cantidad: 15, porcentaje: 12.5 },
    { estado: 'APPROVED', cantidad: 5, porcentaje: 4.2 },
    { estado: 'REJECTED', cantidad: 5, porcentaje: 4.2 }
  ],
  
  // Rendimiento por ejecutor
  rendimientoEjecutores: [
    { nombre: 'Ana Martínez', tareasAsignadas: 25, tareasCompletadas: 20, tiempoPromedio: 3.8 },
    { nombre: 'Luis Sánchez', tareasAsignadas: 22, tareasCompletadas: 18, tiempoPromedio: 4.2 },
    { nombre: 'María López', tareasAsignadas: 15, tareasCompletadas: 15, tiempoPromedio: 3.5 },
    { nombre: 'Pedro Gómez', tareasAsignadas: 30, tareasCompletadas: 25, tiempoPromedio: 5.1 },
    { nombre: 'Sofía Rodríguez', tareasAsignadas: 18, tareasCompletadas: 15, tiempoPromedio: 4.0 }
  ]
};

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

const HeaderActions = styled.div`
  display: flex;
  gap: 12px;
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

const FiltersContainer = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

const FilterSelect = styled.select`
  padding: 10px 12px;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.border};
  background-color: ${({ theme }) => theme.backgroundInput};
  color: ${({ theme }) => theme.text};
  font-size: 14px;
  transition: border-color 0.2s;
  min-width: 150px;

  &:focus {
    border-color: ${({ theme }) => theme.primary};
    outline: none;
  }
`;

const DateRangePicker = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.border};
  background-color: ${({ theme }) => theme.backgroundInput};
  color: ${({ theme }) => theme.text};
  font-size: 14px;
  cursor: pointer;

  &:hover {
    border-color: ${({ theme }) => theme.primary};
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`;

const StatCard = styled.div`
  background-color: ${({ theme }) => theme.backgroundSecondary};
  border-radius: 8px;
  padding: 20px;
  box-shadow: ${({ theme }) => theme.shadow};
  display: flex;
  flex-direction: column;
`;

const StatTitle = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.textSecondary};
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StatValue = styled.div`
  font-size: 28px;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
`;

const StatFooter = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.textSecondary};
  margin-top: 8px;
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ChartCard = styled.div`
  background-color: ${({ theme }) => theme.backgroundSecondary};
  border-radius: 8px;
  padding: 20px;
  box-shadow: ${({ theme }) => theme.shadow};
`;

const ChartTitle = styled.h3`
  margin: 0 0 20px;
  font-size: 16px;
  color: ${({ theme }) => theme.text};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ChartContent = styled.div`
  height: 300px;
  display: flex;
  flex-direction: column;
`;

const BarChartContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: flex-end;
  gap: 16px;
  padding-bottom: 24px;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 1px;
    background-color: ${({ theme }) => theme.border};
  }
`;

const BarGroup = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

const Bar = styled.div<{ $height: number; $color: string }>`
  width: 40px;
  height: ${({ $height }) => `${$height}%`};
  background-color: ${({ $color }) => $color};
  border-radius: 4px 4px 0 0;
  transition: height 0.3s ease;
  min-height: 4px;
`;

const BarLabel = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.textSecondary};
  text-align: center;
`;

const BarValue = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
`;

const PieChartContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const PieChart = styled.div`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: conic-gradient(
    #ef4444 0% 8.3%,
    #f59e0b 8.3% 37.5%,
    #3b82f6 37.5% 79.2%,
    #10b981 79.2% 95.9%,
    #6b7280 95.9% 100%
  );
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 120px;
    height: 120px;
    background-color: ${({ theme }) => theme.backgroundSecondary};
    border-radius: 50%;
  }
`;

const PieLegend = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-left: 24px;
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
  border-radius: 2px;
  background-color: ${({ $color }) => $color};
`;

const LegendLabel = styled.span`
  flex: 1;
`;

const LegendValue = styled.span`
  font-weight: 500;
`;

const TableContainer = styled.div`
  background-color: ${({ theme }) => theme.backgroundSecondary};
  border-radius: 8px;
  padding: 20px;
  box-shadow: ${({ theme }) => theme.shadow};
  margin-bottom: 24px;
`;

const TableTitle = styled.h3`
  margin: 0 0 20px;
  font-size: 16px;
  color: ${({ theme }) => theme.text};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHead = styled.thead`
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

const TableHeadCell = styled.th`
  padding: 12px 16px;
  text-align: left;
  font-weight: 500;
  color: ${({ theme }) => theme.textSecondary};
  font-size: 14px;
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr`
  border-bottom: 1px solid ${({ theme }) => theme.borderLight};

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: ${({ theme }) => theme.backgroundHover};
  }
`;

const TableCell = styled.td`
  padding: 12px 16px;
  font-size: 14px;
  color: ${({ theme }) => theme.text};
`;

const ProgressBar = styled.div`
  height: 6px;
  background-color: ${({ theme }) => theme.backgroundAlt};
  border-radius: 3px;
  overflow: hidden;
  width: 100%;
`;

const ProgressFill = styled.div<{ $percentage: number; $color: string }>`
  height: 100%;
  width: ${({ $percentage }) => `${$percentage}%`};
  background-color: ${({ $color }) => $color};
  transition: width 0.3s ease;
`;

// Función para obtener el color según la prioridad
const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'CRITICAL':
      return '#ef4444'; // error
    case 'HIGH':
      return '#f59e0b'; // warning
    case 'MEDIUM':
      return '#3b82f6'; // primary
    case 'LOW':
      return '#10b981'; // success
    case 'TRIVIAL':
      return '#6b7280'; // gray
    default:
      return '#6b7280'; // gray
  }
};

// Función para obtener el color según el estado
const getStatusColor = (status: string) => {
  switch (status) {
    case 'REQUESTED':
      return '#3b82f6'; // primary
    case 'ASSIGNED':
      return '#f59e0b'; // warning
    case 'IN_PROGRESS':
      return '#8b5cf6'; // purple
    case 'COMPLETED':
      return '#10b981'; // success
    case 'APPROVED':
      return '#059669'; // dark green
    case 'REJECTED':
      return '#ef4444'; // error
    default:
      return '#6b7280'; // gray
  }
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

// Función para obtener el texto de categoría
const getCategoryText = (category: string) => {
  switch (category) {
    case 'ADMINISTRATIVA':
      return 'Administrativa';
    case 'LEGAL':
      return 'Legal';
    case 'TECNICA':
      return 'Técnica';
    case 'FINANCIERA':
      return 'Financiera';
    case 'RECURSOS_HUMANOS':
      return 'Recursos Humanos';
    default:
      return category;
  }
};

// Función para obtener el color según la eficiencia
const getEfficiencyColor = (ratio: number) => {
  if (ratio >= 0.9) return '#10b981'; // success
  if (ratio >= 0.7) return '#f59e0b'; // warning
  return '#ef4444'; // error
};

const MetricasAsignacion: React.FC = () => {
  const [periodoFilter, setPeriodoFilter] = useState('30');
  const [categoriaFilter, setCategoriaFilter] = useState('');

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>
          <FiBarChart2 size={24} />
          Métricas de Asignación
        </PageTitle>
        <HeaderActions>
          <Button>
            <FiDownload size={16} />
            Exportar Informe
          </Button>
        </HeaderActions>
      </PageHeader>

      <FiltersContainer>
        <FilterSelect
          value={periodoFilter}
          onChange={(e) => setPeriodoFilter(e.target.value)}
        >
          <option value="7">Últimos 7 días</option>
          <option value="30">Últimos 30 días</option>
          <option value="90">Últimos 90 días</option>
          <option value="365">Último año</option>
        </FilterSelect>
        <FilterSelect
          value={categoriaFilter}
          onChange={(e) => setCategoriaFilter(e.target.value)}
        >
          <option value="">Todas las categorías</option>
          <option value="ADMINISTRATIVA">Administrativa</option>
          <option value="LEGAL">Legal</option>
          <option value="TECNICA">Técnica</option>
          <option value="FINANCIERA">Financiera</option>
          <option value="RECURSOS_HUMANOS">Recursos Humanos</option>
        </FilterSelect>
        <DateRangePicker>
          <FiCalendar size={16} />
          <span>Rango personalizado</span>
        </DateRangePicker>
        <Button>
          <FiFilter size={16} />
          Más filtros
        </Button>
      </FiltersContainer>

      <StatsGrid>
        <StatCard>
          <StatTitle>
            <FiBarChart2 size={16} />
            Total de Solicitudes
          </StatTitle>
          <StatValue>{MOCK_METRICAS.totalSolicitudes}</StatValue>
          <StatFooter>
            {MOCK_METRICAS.solicitudesAsignadas} asignadas, {MOCK_METRICAS.solicitudesPendientes} pendientes
          </StatFooter>
        </StatCard>
        <StatCard>
          <StatTitle>
            <FiClock size={16} />
            Tiempo Promedio de Asignación
          </StatTitle>
          <StatValue>{MOCK_METRICAS.tiempoPromedioAsignacion.toFixed(1)}</StatValue>
          <StatFooter>días</StatFooter>
        </StatCard>
        <StatCard>
          <StatTitle>
            <FiClock size={16} />
            Tiempo Promedio de Completado
          </StatTitle>
          <StatValue>{MOCK_METRICAS.tiempoPromedioCompletado.toFixed(1)}</StatValue>
          <StatFooter>días</StatFooter>
        </StatCard>
        <StatCard>
          <StatTitle>
            <FiCheckCircle size={16} />
            Tasa de Completado
          </StatTitle>
          <StatValue>{MOCK_METRICAS.tasaCompletado}%</StatValue>
          <StatFooter>de solicitudes completadas</StatFooter>
        </StatCard>
      </StatsGrid>

      <ChartsGrid>
        <ChartCard>
          <ChartTitle>
            <FiPieChart size={18} />
            Distribución por Categoría
          </ChartTitle>
          <ChartContent>
            <BarChartContainer>
              {MOCK_METRICAS.distribucionCategoria.map((item) => (
                <BarGroup key={item.categoria}>
                  <BarValue>{item.cantidad}</BarValue>
                  <Bar 
                    $height={item.porcentaje * 2} 
                    $color="#3b82f6"
                  />
                  <BarLabel>{getCategoryText(item.categoria)}</BarLabel>
                </BarGroup>
              ))}
            </BarChartContainer>
          </ChartContent>
        </ChartCard>

        <ChartCard>
          <ChartTitle>
            <FiPieChart size={18} />
            Distribución por Prioridad
          </ChartTitle>
          <ChartContent style={{ display: 'flex', flexDirection: 'row' }}>
            <PieChartContainer>
              <PieChart />
            </PieChartContainer>
            <PieLegend>
              {MOCK_METRICAS.distribucionPrioridad.map((item) => (
                <LegendItem key={item.prioridad}>
                  <LegendColor $color={getPriorityColor(item.prioridad)} />
                  <LegendLabel>{getPriorityText(item.prioridad)}</LegendLabel>
                  <LegendValue>{item.cantidad} ({item.porcentaje}%)</LegendValue>
                </LegendItem>
              ))}
            </PieLegend>
          </ChartContent>
        </ChartCard>

        <ChartCard>
          <ChartTitle>
            <FiPieChart size={18} />
            Distribución por Estado
          </ChartTitle>
          <ChartContent>
            <BarChartContainer>
              {MOCK_METRICAS.distribucionEstado.map((item) => (
                <BarGroup key={item.estado}>
                  <BarValue>{item.cantidad}</BarValue>
                  <Bar 
                    $height={item.porcentaje * 2} 
                    $color={getStatusColor(item.estado)}
                  />
                  <BarLabel>{getStatusText(item.estado)}</BarLabel>
                </BarGroup>
              ))}
            </BarChartContainer>
          </ChartContent>
        </ChartCard>
      </ChartsGrid>

      <TableContainer>
        <TableTitle>
          <FiTrendingUp size={18} />
          Rendimiento por Ejecutor
        </TableTitle>
        <Table>
          <TableHead>
            <tr>
              <TableHeadCell>Ejecutor</TableHeadCell>
              <TableHeadCell>Tareas Asignadas</TableHeadCell>
              <TableHeadCell>Tareas Completadas</TableHeadCell>
              <TableHeadCell>Eficiencia</TableHeadCell>
              <TableHeadCell>Tiempo Promedio</TableHeadCell>
            </tr>
          </TableHead>
          <TableBody>
            {MOCK_METRICAS.rendimientoEjecutores.map((ejecutor) => {
              const eficiencia = ejecutor.tareasCompletadas / ejecutor.tareasAsignadas;
              return (
                <TableRow key={ejecutor.nombre}>
                  <TableCell>{ejecutor.nombre}</TableCell>
                  <TableCell>{ejecutor.tareasAsignadas}</TableCell>
                  <TableCell>{ejecutor.tareasCompletadas}</TableCell>
                  <TableCell>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div>{(eficiencia * 100).toFixed(0)}%</div>
                      <ProgressBar>
                        <ProgressFill 
                          $percentage={eficiencia * 100} 
                          $color={getEfficiencyColor(eficiencia)} 
                        />
                      </ProgressBar>
                    </div>
                  </TableCell>
                  <TableCell>{ejecutor.tiempoPromedio.toFixed(1)} días</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </PageContainer>
  );
};

export default MetricasAsignacion;
