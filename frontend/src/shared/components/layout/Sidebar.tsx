import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import {
  FiHome,
  FiList,
  FiMessageSquare,
  FiCalendar,
  FiFile,
  FiGrid,
  FiUser,
  FiChevronLeft,
  FiChevronRight
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
  height: 60px;
  border-bottom: 1px solid ${({ theme }) => theme.border};

  h1 {
    font-size: 20px;
    font-weight: 700;
    margin-left: ${({ $isOpen }) => ($isOpen ? '10px' : '0')};
    opacity: ${({ $isOpen }) => ($isOpen ? '1' : '0')};
    transition: opacity 0.3s ease, margin-left 0.3s ease;
    white-space: nowrap;
    overflow: hidden;
  }

  img {
    transition: margin 0.3s ease;
    margin-left: ${({ $isOpen }) => ($isOpen ? '0' : 'auto')};
    margin-right: ${({ $isOpen }) => ($isOpen ? '0' : 'auto')};
  }
`;

const UserProfile = styled.div<SidebarProps>`
  display: flex;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid ${({ theme }) => theme.border};

  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: ${({ theme }) => theme.primary};
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: bold;
    transition: margin 0.3s ease;
    margin-left: ${({ $isOpen }) => ($isOpen ? '0' : 'auto')};
    margin-right: ${({ $isOpen }) => ($isOpen ? '0' : 'auto')};
  }

  .user-info {
    margin-left: 10px;
    opacity: ${({ $isOpen }) => ($isOpen ? '1' : '0')};
    visibility: ${({ $isOpen }) => ($isOpen ? 'visible' : 'hidden')};
    transition: opacity 0.3s ease, visibility 0.3s ease;
    width: ${({ $isOpen }) => ($isOpen ? 'auto' : '0')};
    overflow: hidden;
    white-space: nowrap;

    h3 {
      font-size: 14px;
      font-weight: 600;
    }

    p {
      font-size: 12px;
      color: ${({ theme }) => theme.textSecondary};
    }
  }
`;

const NavMenu = styled.nav`
  padding: 20px 0;
  flex: 1;
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
    margin-left: ${({ $isOpen }) => ($isOpen ? '10px' : '0')};
    opacity: ${({ $isOpen }) => ($isOpen ? '1' : '0')};
    visibility: ${({ $isOpen }) => ($isOpen ? 'visible' : 'hidden')};
    transition: opacity 0.3s ease, visibility 0.3s ease, margin-left 0.3s ease;
    white-space: nowrap;
    overflow: hidden;
    width: ${({ $isOpen }) => ($isOpen ? 'auto' : '0')};
  }
`;

const Sidebar: React.FC = () => {
  const dispatch = useAppDispatch();
  const { sidebarOpen } = useAppSelector((state) => state.ui);

  const handleToggleSidebar = () => {
    dispatch(toggleSidebar());
  };

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
          <h3>Usuario Demo</h3>
          <p>Administrador</p>
        </div>
      </UserProfile>

      <NavMenu>
        <NavItem to="/app" $isOpen={sidebarOpen}>
          <div className="icon"><FiHome size={20} /></div>
          <span>Dashboard</span>
        </NavItem>
        <NavItem to="/app/activities" $isOpen={sidebarOpen}>
          <div className="icon"><FiList size={20} /></div>
          <span>Actividades</span>
        </NavItem>
        <NavItem to="/app/messages" $isOpen={sidebarOpen}>
          <div className="icon"><FiMessageSquare size={20} /></div>
          <span>Mensajes</span>
        </NavItem>
        <NavItem to="/app/activities/calendar" $isOpen={sidebarOpen}>
          <div className="icon"><FiCalendar size={20} /></div>
          <span>Calendario</span>
        </NavItem>
        <NavItem to="/app/documents" $isOpen={sidebarOpen}>
          <div className="icon"><FiFile size={20} /></div>
          <span>Documentos</span>
        </NavItem>
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

export default Sidebar;
