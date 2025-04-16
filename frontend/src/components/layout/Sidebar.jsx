import { NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import {
  FiHome,
  FiList,
  FiMessageSquare,
  FiCalendar,
  FiFile,
  FiGrid,
  FiUser
} from 'react-icons/fi'

const SidebarContainer = styled.aside`
  width: ${({ $isOpen }) => ($isOpen ? '240px' : '70px')};
  height: 100vh;
  background-color: ${({ theme }) => theme.backgroundSecondary};
  border-right: 1px solid ${({ theme }) => theme.border};
  transition: width 0.3s ease;
  overflow-x: hidden;
  overflow-y: auto;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    position: fixed;
    z-index: 1000;
    width: ${({ $isOpen }) => ($isOpen ? '240px' : '0')};
  }
`

const Logo = styled.div`
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
    transition: opacity 0.3s ease;
    white-space: nowrap;
  }
`

const UserProfile = styled.div`
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
  }

  .user-info {
    margin-left: 10px;
    opacity: ${({ $isOpen }) => ($isOpen ? '1' : '0')};
    transition: opacity 0.3s ease;
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
`

const NavMenu = styled.nav`
  padding: 20px 0;
  flex: 1;
`

const NavItem = styled(NavLink)`
  display: flex;
  align-items: center;
  padding: 12px 20px;
  color: ${({ theme }) => theme.textSecondary};
  transition: all 0.2s ease;

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
  }

  span {
    margin-left: ${({ $isOpen }) => ($isOpen ? '10px' : '0')};
    opacity: ${({ $isOpen }) => ($isOpen ? '1' : '0')};
    transition: opacity 0.3s ease;
    white-space: nowrap;
  }
`

const Sidebar = () => {
  const { sidebarOpen } = useSelector(state => state.ui)

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
        <NavItem to="/" $isOpen={sidebarOpen}>
          <div className="icon"><FiHome size={20} /></div>
          <span>Dashboard</span>
        </NavItem>
        <NavItem to="/activities" $isOpen={sidebarOpen}>
          <div className="icon"><FiList size={20} /></div>
          <span>Actividades</span>
        </NavItem>
        <NavItem to="/messages" $isOpen={sidebarOpen}>
          <div className="icon"><FiMessageSquare size={20} /></div>
          <span>Mensajes</span>
        </NavItem>
        <NavItem to="/calendar" $isOpen={sidebarOpen}>
          <div className="icon"><FiCalendar size={20} /></div>
          <span>Calendario</span>
        </NavItem>
        <NavItem to="/documents" $isOpen={sidebarOpen}>
          <div className="icon"><FiFile size={20} /></div>
          <span>Documentos</span>
        </NavItem>
        <NavItem to="/apps" $isOpen={sidebarOpen}>
          <div className="icon"><FiGrid size={20} /></div>
          <span>Aplicaciones</span>
        </NavItem>
      </NavMenu>
    </SidebarContainer>
  )
}

export default Sidebar
