import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import {
  FiHome,
  FiList,
  FiClipboard,
  FiCalendar,
  FiUsers,
  FiBarChart2,
  FiSend,
  FiInbox,
  FiCheckSquare,
  FiClock,
  FiFileText,
  FiUser,
  FiChevronLeft,
  FiChevronRight,
  FiMessageSquare,
  FiFile,
  FiSettings,
  FiLink,
  FiPieChart
} from 'react-icons/fi';
import { toggleSidebar } from '@/core/store/uiSlice';
import { useAppSelector, useAppDispatch } from '@/core/store';

interface SidebarProps {
  $isOpen: boolean;
}

const SidebarContainer = styled.aside<SidebarProps>`
  width: ${({ $isOpen }) => ($isOpen ? '240px' : '70px')};
  height: 100vh;
  background-color: ${({ theme }) => theme.backgroundSecondary};
  border-right: 1px solid ${({ theme }) => theme.border};
  transition: width 0.3s ease;
  overflow-x: hidden;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  position: relative;

  @media (max-width: 768px) {
    position: fixed;
    z-index: 1000;
    width: ${({ $isOpen }) => ($isOpen ? '240px' : '0')};
    left: 0;
    top: 0;
  }
`;

const Logo = styled.div<SidebarProps>`
  display: flex;
  align-items: center;
  padding: 20px;
  height: 70px;
  border-bottom: 1px solid ${({ theme }) => theme.border};

  img {
    width: 30px;
    height: 30px;
  }

  h1 {
    margin-left: 10px;
    font-size: 18px;
    font-weight: 600;
    color: ${({ theme }) => theme.primary};
    opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
    transition: opacity 0.3s ease;
    white-space: nowrap;
  }
`;

const UserProfile = styled.div<SidebarProps>`
  display: flex;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid ${({ theme }) => theme.border};

  .avatar {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background-color: ${({ theme }) => `${theme.primary}20`};
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${({ theme }) => theme.primary};
  }

  .user-info {
    margin-left: 10px;
    opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
    transition: opacity 0.3s ease;
    white-space: nowrap;
    overflow: hidden;

    h3 {
      font-size: 14px;
      font-weight: 600;
      margin: 0;
      color: ${({ theme }) => theme.text};
    }

    p {
      font-size: 12px;
      margin: 0;
      color: ${({ theme }) => theme.textSecondary};
    }
  }
`;

const NavMenu = styled.nav`
  display: flex;
  flex-direction: column;
  padding: 15px 0;
  flex: 1;
`;

const NavSection = styled.div`
  margin-bottom: 15px;
`;

const SectionTitle = styled.h3<SidebarProps>`
  font-size: 12px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.textSecondary};
  margin: 0;
  padding: 10px 20px;
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  transition: opacity 0.3s ease;
  white-space: nowrap;
`;

const ToggleButton = styled.button<SidebarProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 15px 0;
  background-color: ${({ theme }) => theme.backgroundSecondary};
  border-top: 1px solid ${({ theme }) => theme.border};
  color: ${({ theme }) => theme.textSecondary};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => `${theme.primary}10`};
    color: ${({ theme }) => theme.primary};
  }

  .toggle-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    transform: ${({ $isOpen }) => ($isOpen ? 'rotate(0deg)' : 'rotate(180deg)')};
    transition: transform 0.3s ease;
  }
`;

interface NavItemProps extends SidebarProps {
  to: string;
}

const NavItem = styled(NavLink)<NavItemProps>`
  display: flex;
  align-items: center;
  padding: 12px 20px;
  color: ${({ theme }) => theme.textSecondary};
  transition: all 0.3s ease;
  border-left: 3px solid transparent;
  text-decoration: none;

  &:hover {
    background-color: rgba(108, 92, 231, 0.1);
    color: ${({ theme }) => theme.text};
  }

  &.active {
    background-color: rgba(108, 92, 231, 0.2);
    color: ${({ theme }) => theme.primary};
    border-left: 3px solid ${({ theme }) => theme.primary};
  }

  .icon {
    min-width: 24px;
    display: flex;
    align-items: center;
    justify-content: ${({ $isOpen }) => ($isOpen ? 'flex-start' : 'center')};
    transition: justify-content 0.3s ease;
    margin-left: ${({ $isOpen }) => ($isOpen ? '0' : 'auto')};
    margin-right: ${({ $isOpen }) => ($isOpen ? '0' : 'auto')};
  }

  span {
    margin-left: 10px;
    opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
    transition: opacity 0.3s ease;
    white-space: nowrap;
  }
`;

const RoleIndicator = styled.div<SidebarProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 12px;
  margin: 10px 20px;
  background-color: ${({ theme }) => `${theme.primary}10`};
  border-radius: 4px;
  color: ${({ theme }) => theme.primary};
  font-size: 12px;
  font-weight: 500;
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  transition: opacity 0.3s ease;
  white-space: nowrap;
`;

interface RoleBasedSidebarProps {
  user?: {
    username?: string;
    role?: string;
    email?: string;
  };
}

const RoleBasedSidebar: React.FC<RoleBasedSidebarProps> = ({ user }) => {
  const dispatch = useAppDispatch();
  const { sidebarOpen } = useAppSelector((state) => state.ui);

  const handleToggleSidebar = () => {
    dispatch(toggleSidebar());
  };

  // Determinar el rol del usuario (por defecto USUARIO si no está definido)
  const userRole = user?.role || 'USUARIO';

  return (
    <SidebarContainer $isOpen={sidebarOpen}>
      <Logo $isOpen={sidebarOpen}>
        <img src="/logo.svg" alt="Bitácora" width="30" height="30" />
        <h1>Bitácora</h1>
      </Logo>

      <UserProfile $isOpen={sidebarOpen}>
        <div className="avatar">
          <FiUser size={20} />
        </div>
        <div className="user-info">
          <h3>{user?.username || 'Usuario'}</h3>
          <p>{userRole}</p>
        </div>
      </UserProfile>

      <RoleIndicator $isOpen={sidebarOpen}>
        {userRole === 'ADMIN' && 'Administrador'}
        {userRole === 'ASIGNADOR' && 'Asignador'}
        {userRole === 'SOLICITANTE' && 'Solicitante'}
        {userRole === 'EJECUTOR' && 'Ejecutor'}
        {userRole === 'SUPERVISOR' && 'Supervisor'}
        {userRole === 'USUARIO' && 'Usuario'}
        {userRole === 'CONSULTA' && 'Consulta'}
      </RoleIndicator>

      <NavMenu>
        {/* Elementos comunes para todos los roles */}
        <NavItem to="/app" $isOpen={sidebarOpen}>
          <div className="icon"><FiHome size={20} /></div>
          <span>Dashboard</span>
        </NavItem>

        {/* Elementos específicos para SOLICITANTE - Siempre visibles para ADMIN */}
        {(userRole === 'ADMIN' || userRole === 'SOLICITANTE') && (
          <NavSection>
            <SectionTitle $isOpen={sidebarOpen}>SOLICITUDES</SectionTitle>
            <NavItem to="/app/solicitudes/dashboard" $isOpen={sidebarOpen}>
              <div className="icon"><FiBarChart2 size={20} /></div>
              <span>Dashboard</span>
            </NavItem>
            <NavItem to="/app/solicitudes/nueva" $isOpen={sidebarOpen}>
              <div className="icon"><FiSend size={20} /></div>
              <span>Nueva Solicitud</span>
            </NavItem>
            <NavItem to="/app/solicitudes" $isOpen={sidebarOpen}>
              <div className="icon"><FiClipboard size={20} /></div>
              <span>Mis Solicitudes</span>
            </NavItem>
            <NavItem to="/app/solicitudes/seguimiento" $isOpen={sidebarOpen}>
              <div className="icon"><FiClock size={20} /></div>
              <span>Seguimiento</span>
            </NavItem>
          </NavSection>
        )}

        {/* Elementos específicos para ASIGNADOR - Siempre visibles para ADMIN */}
        {(userRole === 'ADMIN' || userRole === 'ASIGNADOR') && (
          <NavSection>
            <SectionTitle $isOpen={sidebarOpen}>ASIGNACIÓN</SectionTitle>
            <NavItem to="/app/asignacion/dashboard" $isOpen={sidebarOpen}>
              <div className="icon"><FiBarChart2 size={20} /></div>
              <span>Dashboard</span>
            </NavItem>
            <NavItem to="/app/asignacion/bandeja" $isOpen={sidebarOpen}>
              <div className="icon"><FiInbox size={20} /></div>
              <span>Bandeja de Entrada</span>
            </NavItem>
            <NavItem to="/app/asignacion/distribucion" $isOpen={sidebarOpen}>
              <div className="icon"><FiUsers size={20} /></div>
              <span>Distribución</span>
            </NavItem>
            <NavItem to="/app/asignacion/metricas" $isOpen={sidebarOpen}>
              <div className="icon"><FiPieChart size={20} /></div>
              <span>Métricas</span>
            </NavItem>
          </NavSection>
        )}

        {/* Elementos específicos para EJECUTOR - Siempre visibles para ADMIN */}
        {(userRole === 'ADMIN' || userRole === 'EJECUTOR') && (
          <NavSection>
            <SectionTitle $isOpen={sidebarOpen}>TAREAS</SectionTitle>
            <NavItem to="/app/tareas/dashboard" $isOpen={sidebarOpen}>
              <div className="icon"><FiBarChart2 size={20} /></div>
              <span>Dashboard</span>
            </NavItem>
            <NavItem to="/app/tareas/asignadas" $isOpen={sidebarOpen}>
              <div className="icon"><FiCheckSquare size={20} /></div>
              <span>Mis Tareas</span>
            </NavItem>
            <NavItem to="/app/tareas/progreso" $isOpen={sidebarOpen}>
              <div className="icon"><FiClock size={20} /></div>
              <span>En Progreso</span>
            </NavItem>
            <NavItem to="/app/tareas/historial" $isOpen={sidebarOpen}>
              <div className="icon"><FiFileText size={20} /></div>
              <span>Historial</span>
            </NavItem>
          </NavSection>
        )}

        {/* Elementos comunes para todos los roles */}
        <NavItem to="/app/activities" $isOpen={sidebarOpen}>
          <div className="icon"><FiList size={20} /></div>
          <span>Actividades</span>
        </NavItem>
        <NavItem to="/app/activities/calendar" $isOpen={sidebarOpen}>
          <div className="icon"><FiCalendar size={20} /></div>
          <span>Calendario</span>
        </NavItem>

        {/* Elementos para administradores */}
        {(userRole === 'ADMIN' || userRole === 'ASIGNADOR') && (
          <>
            <NavSection>
              <SectionTitle $isOpen={sidebarOpen}>REPORTES</SectionTitle>
              <NavItem to="/app/reportes" $isOpen={sidebarOpen}>
                <div className="icon"><FiBarChart2 size={20} /></div>
                <span>Dashboard</span>
              </NavItem>
            </NavSection>

            <NavSection>
              <SectionTitle $isOpen={sidebarOpen}>CONFIGURACIÓN</SectionTitle>
              <NavItem to="/app/configuracion/tareas" $isOpen={sidebarOpen}>
                <div className="icon"><FiSettings size={20} /></div>
                <span>Configurar Tareas</span>
              </NavItem>
              <NavItem to="/app/configuracion/integraciones" $isOpen={sidebarOpen}>
                <div className="icon"><FiLink size={20} /></div>
                <span>Integraciones</span>
              </NavItem>
            </NavSection>
          </>
        )}

        <NavItem to="/app/profile" $isOpen={sidebarOpen}>
          <div className="icon"><FiUser size={20} /></div>
          <span>Perfil</span>
        </NavItem>
      </NavMenu>

      <ToggleButton onClick={handleToggleSidebar} $isOpen={sidebarOpen}>
        <div className="toggle-icon">
          {sidebarOpen ? <FiChevronLeft size={20} /> : <FiChevronRight size={20} />}
        </div>
      </ToggleButton>
    </SidebarContainer>
  );
};

export default RoleBasedSidebar;
