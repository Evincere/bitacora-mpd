import { Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import { darkTheme } from './styles/theme'
import GlobalStyle from './styles/GlobalStyle'
import { NotificationProvider } from './components/common/NotificationProvider'
import { ToastProvider } from './components/ui/Toast'
import { RealTimeNotificationProvider } from './contexts/RealTimeNotificationContext'
import Layout from './components/layout/Layout'
import Dashboard from './features/dashboard/Dashboard'
import Activities from './features/activities/Activities'
import ActivitiesWithQuery from './features/activities/ActivitiesWithQuery'
import Calendar from './features/calendar/Calendar'
import Login from './features/auth/Login'
import NotFound from './components/common/NotFound'
import SessionsPage from './features/security/SessionsPage'
import authService from './services/authService'
import { useSessionTimeout } from './hooks/useSessionTimeout'

// Componente para rutas protegidas
const ProtectedRoute = ({ children }) => {
  // Verificamos si el usuario está autenticado
  const isAuthenticated = authService.isAuthenticated();

  // Configurar el timeout de sesión (30 minutos por defecto)
  useSessionTimeout(30);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children;
};

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <GlobalStyle />
      <NotificationProvider>
        <ToastProvider>
          <RealTimeNotificationProvider>
        <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="activities" element={<ActivitiesWithQuery />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="security/sessions" element={<SessionsPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
          </RealTimeNotificationProvider>
        </ToastProvider>
      </NotificationProvider>
    </ThemeProvider>
  )
}

export default App
