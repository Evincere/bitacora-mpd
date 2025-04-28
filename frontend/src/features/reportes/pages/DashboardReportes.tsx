import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  FiBarChart2, 
  FiPieChart, 
  FiCalendar, 
  FiDownload,
  FiFilter,
  FiRefreshCw
} from 'react-icons/fi';
import ResumenTareas from '../components/ResumenTareas';
import DistribucionEstados from '../components/DistribucionEstados';
import DistribucionCategorias from '../components/DistribucionCategorias';
import TendenciaTiempos from '../components/TendenciaTiempos';
import RendimientoUsuarios from '../components/RendimientoUsuarios';

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

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 20px;
  margin-bottom: 24px;
`;

const DashboardItem = styled.div<{ $colSpan: number; $rowSpan?: number }>`
  grid-column: span ${({ $colSpan }) => $colSpan};
  grid-row: span ${({ $rowSpan }) => $rowSpan || 1};
  background-color: ${({ theme }) => theme.backgroundSecondary};
  border-radius: 8px;
  box-shadow: ${({ theme }) => theme.shadow};
  overflow: hidden;
  
  @media (max-width: 1200px) {
    grid-column: span ${({ $colSpan }) => Math.min($colSpan * 2, 12)};
  }
  
  @media (max-width: 768px) {
    grid-column: span 12;
  }
`;

const DashboardReportes: React.FC = () => {
  const [periodoFilter, setPeriodoFilter] = useState('30');
  const [categoriaFilter, setCategoriaFilter] = useState('');
  const [usuarioFilter, setUsuarioFilter] = useState('');
  
  const handleExportarReporte = () => {
    // Aquí iría la lógica para exportar el reporte
    console.log('Exportando reporte...');
  };
  
  const handleActualizarDatos = () => {
    // Aquí iría la lógica para actualizar los datos
    console.log('Actualizando datos...');
  };
  
  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>
          <FiBarChart2 size={24} />
          Dashboard de Reportes
        </PageTitle>
        <HeaderActions>
          <Button onClick={handleActualizarDatos}>
            <FiRefreshCw size={16} />
            Actualizar
          </Button>
          <Button onClick={handleExportarReporte}>
            <FiDownload size={16} />
            Exportar Reporte
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
        <FilterSelect
          value={usuarioFilter}
          onChange={(e) => setUsuarioFilter(e.target.value)}
        >
          <option value="">Todos los usuarios</option>
          <option value="1">Ana Martínez</option>
          <option value="2">Luis Sánchez</option>
          <option value="3">María López</option>
          <option value="4">Pedro Gómez</option>
          <option value="5">Sofía Rodríguez</option>
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
      
      <DashboardGrid>
        {/* Resumen de tareas - 4 columnas */}
        <DashboardItem $colSpan={4}>
          <ResumenTareas periodo={periodoFilter} />
        </DashboardItem>
        
        {/* Distribución por estados - 4 columnas */}
        <DashboardItem $colSpan={4}>
          <DistribucionEstados periodo={periodoFilter} categoria={categoriaFilter} />
        </DashboardItem>
        
        {/* Distribución por categorías - 4 columnas */}
        <DashboardItem $colSpan={4}>
          <DistribucionCategorias periodo={periodoFilter} />
        </DashboardItem>
        
        {/* Tendencia de tiempos - 8 columnas */}
        <DashboardItem $colSpan={8}>
          <TendenciaTiempos periodo={periodoFilter} categoria={categoriaFilter} />
        </DashboardItem>
        
        {/* Rendimiento de usuarios - 4 columnas */}
        <DashboardItem $colSpan={4}>
          <RendimientoUsuarios 
            periodo={periodoFilter} 
            categoria={categoriaFilter} 
            usuario={usuarioFilter} 
          />
        </DashboardItem>
      </DashboardGrid>
    </PageContainer>
  );
};

export default DashboardReportes;
