import { useState, useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { FiSearch, FiSettings, FiBell, FiUser, FiMenu, FiLogOut, FiMail, FiShield, FiClock, FiSun, FiMoon, FiEye, FiLock, FiAlertCircle, FiActivity, FiChevronDown } from 'react-icons/fi'
import { toggleSidebar } from '../../store/uiSlice'
// Implementación temporal de toggleTheme hasta resolver problemas de importación
const toggleTheme = () => ({
  type: 'ui/toggleTheme'
})
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../hooks/useToast'
import { RealTimeNotificationCenter } from '../ui/RealTimeNotification'

const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  height: 64px;
  background-color: ${({ theme }) => theme.backgroundSecondary};
  border-bottom: 1px solid ${({ theme }) => theme.border};
  position: sticky;
  top: 0;
  z-index: 100;
`

const SearchContainer = styled.div`
  position: relative;
  width: 300px;
  margin-right: auto;
  margin-left: 16px;

  @media (max-width: 768px) {
    width: 100%;
    margin-left: 8px;
  }
`

const SearchInput = styled.input`
  width: 100%;
  height: 36px;
  padding: 0 16px 0 36px;
  border-radius: 18px;
  border: 1px solid ${({ theme }) => theme.border};
  background-color: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.primaryLight};
  }

  &::placeholder {
    color: ${({ theme }) => theme.textSecondary};
  }
`

const SearchIcon = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.textSecondary};
  pointer-events: none;
`

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const IconButton = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: ${({ theme }) => theme.text};
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.backgroundHover};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${({ theme }) => theme.primaryLight};
  }
`

const UserAvatar = styled(IconButton)`
  background-color: ${({ theme }) => theme.primary};
  color: white;

  &:hover {
    background-color: ${({ theme }) => theme.primaryDark};
  }
`

const UserMenu = styled.div`
  position: absolute;
  top: 60px;
  right: 16px;
  width: 280px;
  background-color: ${({ theme }) => theme.backgroundSecondary};
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  overflow: hidden;
  display: ${({ $isOpen }) => ($isOpen ? 'block' : 'none')};
  animation: fadeIn 0.2s ease-in-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`

const UserInfo = styled.div`
  padding: 16px;
  display: flex;
  gap: 16px;
  border-bottom: 1px solid ${({ theme }) => theme.border};

  .user-avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background-color: ${({ theme }) => theme.primary};
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    font-weight: 600;
  }

  .user-details {
    flex: 1;
  }

  h3 {
    font-size: 16px;
    font-weight: 600;
    margin: 0;
    color: ${({ theme }) => theme.text};
  }

  .role {
    font-size: 12px;
    color: ${({ theme }) => theme.primary};
    margin: 2px 0 0 0;
    font-weight: 500;
    display: flex;
    align-items: center;
  }

  .email {
    font-size: 12px;
    color: ${({ theme }) => theme.textSecondary};
    margin: 4px 0 0 0;
    display: flex;
    align-items: center;
  }

  .icon {
    margin-right: 4px;
    font-size: 12px;
  }

  .status {
    display: flex;
    align-items: center;
    margin-top: 6px;
    font-size: 11px;
  }

  .status-indicator {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: #4cd964;
    margin-right: 4px;
  }
`

const UserMenuItem = styled.div`
  padding: 10px 16px;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.2s;
  position: relative;
  color: ${({ theme }) => theme.text};

  &:hover {
    background-color: ${({ theme }) => theme.backgroundHover};
  }

  .icon {
    margin-right: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${({ theme }) => theme.textSecondary};
  }

  .submenu-indicator {
    margin-left: auto;
    transition: transform 0.2s;
    transform: ${({ $isOpen }) => $isOpen ? 'rotate(180deg)' : 'rotate(0)'};
  }
`

const Submenu = styled.div`
  background-color: ${({ theme }) => theme.backgroundTertiary || theme.backgroundSecondary};
  border-radius: 4px;
  margin: 0 8px 8px 8px;
  overflow: hidden;
  max-height: ${({ $isOpen }) => $isOpen ? '500px' : '0'};
  opacity: ${({ $isOpen }) => $isOpen ? '1' : '0'};
  transition: max-height 0.3s ease, opacity 0.2s ease;
`

const SubmenuItem = styled.div`
  padding: 8px 16px 8px 40px;
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 13px;

  &:hover {
    background-color: ${({ theme }) => theme.backgroundHover};
  }

  .icon {
    margin-right: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${({ theme }) => theme.textSecondary};
    font-size: 14px;
  }

  &.active {
    background-color: ${({ theme }) => theme.backgroundAlt};
    color: ${({ theme }) => theme.primary};

    .icon {
      color: ${({ theme }) => theme.primary};
    }
  }
`

const MobileMenuButton = styled(IconButton)`
  @media (min-width: 769px) {
    display: none;
  }
`

const Header = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { logout } = useAuth()
  const toast = useToast()
  const [searchQuery, setSearchQuery] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [submenuOpen, setSubmenuOpen] = useState('')
  const menuRef = useRef(null)

  // Obtener el tema actual
  const theme = useSelector(state => state.ui.theme)

  // Obtener datos del usuario del localStorage
  const userString = localStorage.getItem('bitacora_user')
  const user = userString ? JSON.parse(userString) : null

  const handleToggleSidebar = () => {
    dispatch(toggleSidebar())
  }

  const handleToggleMenu = () => {
    setMenuOpen(!menuOpen)
  }

  const handleLogout = async () => {
    try {
      setMenuOpen(false)
      toast.info('Cerrando sesión...', 'Sesión')
      await logout()
    } catch (error) {
      console.error('Error en handleLogout:', error)
      // El error ya se maneja en el hook useAuth
    }
  }

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setMenuOpen(false)
      setSubmenuOpen('')
    }
  }

  // Manejar cambio de tema
  const handleToggleTheme = () => {
    dispatch(toggleTheme())
    toast.info(`Tema ${theme === 'dark' ? 'claro' : 'oscuro'} activado`, 'Apariencia')
  }

  // Manejar apertura de submenús
  const handleSubmenuToggle = (submenu) => {
    setSubmenuOpen(submenuOpen === submenu ? '' : submenu)
  }

  // Manejar cambio de tiempo de inactividad
  const handleSetInactivityTime = (minutes) => {
    // Guardar en localStorage
    localStorage.setItem('inactivity_timeout', minutes * 60 * 1000)
    toast.success(`Tiempo de inactividad establecido a ${minutes} minutos`, 'Configuración')
    setSubmenuOpen('')
  }

  // Agregar event listener para cerrar el menú al hacer clic fuera de él
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <HeaderContainer>
      <MobileMenuButton onClick={handleToggleSidebar}>
        <FiMenu size={20} />
      </MobileMenuButton>

      <SearchContainer>
        <SearchIcon>
          <FiSearch size={16} />
        </SearchIcon>
        <SearchInput
          placeholder="Buscar actividades..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </SearchContainer>

      <HeaderActions>
        <IconButton>
          <FiSettings size={20} />
        </IconButton>
        <RealTimeNotificationCenter />
        <UserAvatar onClick={handleToggleMenu}>
          <FiUser size={20} />
        </UserAvatar>

        <UserMenu $isOpen={menuOpen} ref={menuRef}>
          {user && (
            <UserInfo>
              <div className="user-avatar">
                {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="user-details">
                <h3>{user.username || 'Usuario'}</h3>
                <div className="role">
                  <FiShield className="icon" />
                  {user.role || 'Usuario'}
                </div>
                <div className="email">
                  <FiMail className="icon" />
                  {user.email || 'usuario@ejemplo.com'}
                </div>
                <div className="status">
                  <div className="status-indicator"></div>
                  <span>Activo</span>
                  <FiClock style={{ marginLeft: '8px', marginRight: '2px', fontSize: '10px' }} />
                  <span>Sesión activa</span>
                </div>
              </div>
            </UserInfo>
          )}
          <UserMenuItem onClick={() => {
            setMenuOpen(false)
            navigate('/profile')
          }}>
            <div className="icon"><FiUser size={16} /></div>
            <span>Mi Perfil</span>
          </UserMenuItem>

          <UserMenuItem
            $isOpen={submenuOpen === 'appearance'}
            onClick={() => handleSubmenuToggle('appearance')}
          >
            <div className="icon">
              {theme === 'dark' ? <FiMoon size={16} /> : <FiSun size={16} />}
            </div>
            <span>Apariencia</span>
            <FiChevronDown className="submenu-indicator" size={16} />
          </UserMenuItem>

          <Submenu $isOpen={submenuOpen === 'appearance'}>
            <SubmenuItem
              className={theme === 'light' ? 'active' : ''}
              onClick={handleToggleTheme}
            >
              <div className="icon"><FiSun size={14} /></div>
              <span>Tema Claro</span>
            </SubmenuItem>
            <SubmenuItem
              className={theme === 'dark' ? 'active' : ''}
              onClick={handleToggleTheme}
            >
              <div className="icon"><FiMoon size={14} /></div>
              <span>Tema Oscuro</span>
            </SubmenuItem>
          </Submenu>

          <UserMenuItem
            $isOpen={submenuOpen === 'security'}
            onClick={() => handleSubmenuToggle('security')}
          >
            <div className="icon"><FiLock size={16} /></div>
            <span>Seguridad</span>
            <FiChevronDown className="submenu-indicator" size={16} />
          </UserMenuItem>

          <Submenu $isOpen={submenuOpen === 'security'}>
            <SubmenuItem onClick={() => navigate('/app/security/password')}>
              <div className="icon"><FiLock size={14} /></div>
              <span>Cambiar Contraseña</span>
            </SubmenuItem>
            <SubmenuItem onClick={() => navigate('/app/security/sessions')}>
              <div className="icon"><FiEye size={14} /></div>
              <span>Sesiones Activas</span>
            </SubmenuItem>
            <SubmenuItem onClick={() => navigate('/app/security/activity')}>
              <div className="icon"><FiActivity size={14} /></div>
              <span>Historial de Actividad</span>
            </SubmenuItem>
          </Submenu>

          <UserMenuItem
            $isOpen={submenuOpen === 'inactivity'}
            onClick={() => handleSubmenuToggle('inactivity')}
          >
            <div className="icon"><FiClock size={16} /></div>
            <span>Tiempo de Inactividad</span>
            <FiChevronDown className="submenu-indicator" size={16} />
          </UserMenuItem>

          <Submenu $isOpen={submenuOpen === 'inactivity'}>
            <SubmenuItem onClick={() => handleSetInactivityTime(5)}>
              <div className="icon"><FiClock size={14} /></div>
              <span>5 minutos</span>
            </SubmenuItem>
            <SubmenuItem onClick={() => handleSetInactivityTime(15)}>
              <div className="icon"><FiClock size={14} /></div>
              <span>15 minutos</span>
            </SubmenuItem>
            <SubmenuItem onClick={() => handleSetInactivityTime(30)}>
              <div className="icon"><FiClock size={14} /></div>
              <span>30 minutos</span>
            </SubmenuItem>
            <SubmenuItem onClick={() => handleSetInactivityTime(60)}>
              <div className="icon"><FiClock size={14} /></div>
              <span>1 hora</span>
            </SubmenuItem>
          </Submenu>

          <UserMenuItem onClick={() => {
            setMenuOpen(false)
            navigate('/settings')
          }}>
            <div className="icon"><FiSettings size={16} /></div>
            <span>Configuración</span>
          </UserMenuItem>

          <UserMenuItem onClick={handleLogout}>
            <div className="icon"><FiLogOut size={16} /></div>
            <span>Cerrar Sesión</span>
          </UserMenuItem>
        </UserMenu>
      </HeaderActions>
    </HeaderContainer>
  )
}

export default Header
