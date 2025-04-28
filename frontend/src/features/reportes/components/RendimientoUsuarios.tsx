import React from 'react';
import styled from 'styled-components';
import { FiUser, FiClock, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

// Datos de ejemplo para mostrar en la interfaz
const MOCK_RENDIMIENTO_USUARIOS = {
  '7': [
    { id: 1, nombre: 'Ana Martínez', tareasCompletadas: 8, tiempoPromedio: 2.5, tasaCompletado: 90 },
    { id: 2, nombre: 'Luis Sánchez', tareasCompletadas: 6, tiempoPromedio: 3.2, tasaCompletado: 85 },
    { id: 3, nombre: 'María López', tareasCompletadas: 7, tiempoPromedio: 2.8, tasaCompletado: 88 },
    { id: 4, nombre: 'Pedro Gómez', tareasCompletadas: 5, tiempoPromedio: 3.5, tasaCompletado: 80 },
    { id: 5, nombre: 'Sofía Rodríguez', tareasCompletadas: 9, tiempoPromedio: 2.2, tasaCompletado: 95 }
  ],
  '30': [
    { id: 1, nombre: 'Ana Martínez', tareasCompletadas: 25, tiempoPromedio: 2.8, tasaCompletado: 92 },
    { id: 2, nombre: 'Luis Sánchez', tareasCompletadas: 20, tiempoPromedio: 3.5, tasaCompletado: 88 },
    { id: 3, nombre: 'María López', tareasCompletadas: 22, tiempoPromedio: 3.0, tasaCompletado: 90 },
    { id: 4, nombre: 'Pedro Gómez', tareasCompletadas: 18, tiempoPromedio: 3.8, tasaCompletado: 85 },
    { id: 5, nombre: 'Sofía Rodríguez', tareasCompletadas: 28, tiempoPromedio: 2.5, tasaCompletado: 95 }
  ],
  '90': [
    { id: 1, nombre: 'Ana Martínez', tareasCompletadas: 70, tiempoPromedio: 3.0, tasaCompletado: 90 },
    { id: 2, nombre: 'Luis Sánchez', tareasCompletadas: 65, tiempoPromedio: 3.8, tasaCompletado: 85 },
    { id: 3, nombre: 'María López', tareasCompletadas: 68, tiempoPromedio: 3.2, tasaCompletado: 88 },
    { id: 4, nombre: 'Pedro Gómez', tareasCompletadas: 60, tiempoPromedio: 4.0, tasaCompletado: 82 },
    { id: 5, nombre: 'Sofía Rodríguez', tareasCompletadas: 75, tiempoPromedio: 2.8, tasaCompletado: 93 }
  ],
  '365': [
    { id: 1, nombre: 'Ana Martínez', tareasCompletadas: 220, tiempoPromedio: 3.2, tasaCompletado: 91 },
    { id: 2, nombre: 'Luis Sánchez', tareasCompletadas: 200, tiempoPromedio: 4.0, tasaCompletado: 86 },
    { id: 3, nombre: 'María López', tareasCompletadas: 210, tiempoPromedio: 3.5, tasaCompletado: 89 },
    { id: 4, nombre: 'Pedro Gómez', tareasCompletadas: 190, tiempoPromedio: 4.2, tasaCompletado: 84 },
    { id: 5, nombre: 'Sofía Rodríguez', tareasCompletadas: 230, tiempoPromedio: 3.0, tasaCompletado: 94 }
  ]
};

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  padding: 16px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

const Title = styled.h2`
  margin: 0;
  font-size: 18px;
  color: ${({ theme }) => theme.text};
`;

const Content = styled.div`
  padding: 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.backgroundAlt};
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => theme.border};
    border-radius: 4px;
  }
`;

const UserCard = styled.div`
  background-color: ${({ theme }) => theme.backgroundAlt};
  border-radius: 8px;
  padding: 16px;
`;

const UserHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.primary};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 16px;
`;

const UserInfo = styled.div`
  flex: 1;
`;

const UserName = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
`;

const UserStats = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-top: 12px;
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const StatIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.backgroundHover};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  color: ${({ theme }) => theme.textSecondary};
`;

const StatValue = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
`;

const StatLabel = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.textSecondary};
  margin-top: 4px;
`;

const ProgressBar = styled.div`
  height: 6px;
  background-color: ${({ theme }) => theme.backgroundHover};
  border-radius: 3px;
  overflow: hidden;
  margin-top: 8px;
`;

const ProgressFill = styled.div<{ $percentage: number; $color: string }>`
  height: 100%;
  width: ${({ $percentage }) => `${$percentage}%`};
  background-color: ${({ $color }) => $color};
  border-radius: 3px;
  transition: width 0.3s ease;
`;

interface RendimientoUsuariosProps {
  periodo: string;
  categoria?: string;
  usuario?: string;
}

const RendimientoUsuarios: React.FC<RendimientoUsuariosProps> = ({ periodo, categoria, usuario }) => {
  // Obtener datos según el periodo seleccionado
  const datos = MOCK_RENDIMIENTO_USUARIOS[periodo as keyof typeof MOCK_RENDIMIENTO_USUARIOS] || MOCK_RENDIMIENTO_USUARIOS['30'];
  
  // Filtrar por usuario si se proporciona
  const usuariosFiltrados = usuario 
    ? datos.filter(u => u.id.toString() === usuario)
    : datos;
  
  // Ordenar por tareas completadas (de mayor a menor)
  const usuariosOrdenados = [...usuariosFiltrados].sort((a, b) => b.tareasCompletadas - a.tareasCompletadas);
  
  // Obtener iniciales del nombre
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  };
  
  // Obtener color según la tasa de completado
  const getCompletionColor = (rate: number) => {
    if (rate >= 90) return '#10b981'; // green
    if (rate >= 80) return '#f59e0b'; // amber
    return '#ef4444'; // red
  };
  
  return (
    <Container>
      <Header>
        <Title>Rendimiento de Usuarios</Title>
      </Header>
      <Content>
        {usuariosOrdenados.map(usuario => (
          <UserCard key={usuario.id}>
            <UserHeader>
              <UserAvatar>{getInitials(usuario.nombre)}</UserAvatar>
              <UserInfo>
                <UserName>{usuario.nombre}</UserName>
                <ProgressBar>
                  <ProgressFill 
                    $percentage={usuario.tasaCompletado} 
                    $color={getCompletionColor(usuario.tasaCompletado)} 
                  />
                </ProgressBar>
              </UserInfo>
            </UserHeader>
            
            <UserStats>
              <StatItem>
                <StatIcon>
                  <FiCheckCircle size={16} />
                </StatIcon>
                <StatValue>{usuario.tareasCompletadas}</StatValue>
                <StatLabel>Tareas completadas</StatLabel>
              </StatItem>
              
              <StatItem>
                <StatIcon>
                  <FiClock size={16} />
                </StatIcon>
                <StatValue>{usuario.tiempoPromedio.toFixed(1)}</StatValue>
                <StatLabel>Tiempo promedio (días)</StatLabel>
              </StatItem>
              
              <StatItem>
                <StatIcon>
                  <FiAlertCircle size={16} />
                </StatIcon>
                <StatValue>{usuario.tasaCompletado}%</StatValue>
                <StatLabel>Tasa de completado</StatLabel>
              </StatItem>
            </UserStats>
          </UserCard>
        ))}
      </Content>
    </Container>
  );
};

export default RendimientoUsuarios;
