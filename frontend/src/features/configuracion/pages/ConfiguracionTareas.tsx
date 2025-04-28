import React from 'react';
import styled from 'styled-components';
import { FiSettings, FiInfo } from 'react-icons/fi';
import CategoriasList from '@/features/categorias/components/CategoriasList';
import PrioridadesList from '@/features/prioridades/components/PrioridadesList';

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

const InfoBox = styled.div`
  background-color: ${({ theme }) => `${theme.info}10`};
  border-left: 3px solid ${({ theme }) => theme.info};
  padding: 16px;
  margin-bottom: 24px;
  border-radius: 4px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  
  .icon {
    color: ${({ theme }) => theme.info};
    margin-top: 2px;
  }
  
  .content {
    flex: 1;
    
    h4 {
      margin: 0 0 8px;
      font-size: 16px;
      color: ${({ theme }) => theme.text};
    }
    
    p {
      margin: 0;
      font-size: 14px;
      color: ${({ theme }) => theme.textSecondary};
    }
  }
`;

const ConfigGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const ConfiguracionTareas: React.FC = () => {
  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>
          <FiSettings size={24} />
          Configuración de Tareas
        </PageTitle>
      </PageHeader>

      <InfoBox>
        <div className="icon">
          <FiInfo size={20} />
        </div>
        <div className="content">
          <h4>Gestión de Categorías y Prioridades</h4>
          <p>
            En esta sección puede configurar las categorías y niveles de prioridad para las tareas del sistema.
            Las categorías permiten clasificar las tareas según su naturaleza, mientras que las prioridades
            determinan la urgencia con la que deben ser atendidas. Estos ajustes afectarán a todas las tareas
            creadas en el sistema.
          </p>
        </div>
      </InfoBox>

      <ConfigGrid>
        <CategoriasList />
        <PrioridadesList />
      </ConfigGrid>
    </PageContainer>
  );
};

export default ConfiguracionTareas;
