import { useEffect, lazy, Suspense, useState } from 'react';
import { Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { useAppDispatch, useAppSelector } from './core/store';
import { setTheme } from './core/store/uiSlice';
import { setUser } from './features/auth/store/authSlice';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastProvider } from './components/ui/Toast';
import AnimatedRoutes from './shared/components/ui/AnimatedRoutes';
import { RealTimeNotificationProvider } from './features/notifications/contexts/RealTimeNotificationContext';
import { lightTheme, darkTheme } from '@/shared/styles';
import GlobalStyle from './styles/GlobalStyle';
import PlaceholderDashboard from '@/shared/components/ui/PlaceholderDashboard';
import RoleProtectedRoute from './routes/RoleProtectedRoute';
import { UserRole } from '@/core/types/models';
// Ya no necesitamos estas importaciones porque verificamos directamente en localStorage

// Componentes de carga
import { Loader } from './shared/components/common';

// Layouts
const MainLayout = lazy(() => import('@/shared/components/layout/Layout'));
const RoleBasedLayout = lazy(() => import('@/shared/components/layout/RoleBasedLayout'));
const AuthLayout = lazy(() => import('./features/auth/components/AuthLayout'));

// Rutas basadas en roles - Importación directa en lugar de lazy loading
import RoleBasedRoutes from './routes/RoleBasedRoutes';

// Componentes para SOLICITANTE
import DashboardSolicitante from '@/features/solicitudes/pages/DashboardSolicitante';
import SolicitudForm from '@/features/solicitudes/pages/SolicitudForm';
import MisSolicitudes from '@/features/solicitudes/pages/MisSolicitudes';
import SeguimientoSolicitud from '@/features/solicitudes/pages/SeguimientoSolicitud';
import SolicitudesRoute from './routes/SolicitudesRoute';

// Componentes para ASIGNADOR
import DashboardAsignador from '@/features/asignacion/pages/DashboardAsignador';
import AsignarTarea from '@/features/asignacion/pages/AsignarTarea';
import DetalleTarea from '@/features/asignacion/pages/DetalleTarea';
import BandejaEntrada from '@/features/asignacion/pages/BandejaEntrada';
import DistribucionCarga from '@/features/asignacion/pages/DistribucionCarga';
import MetricasAsignacion from '@/features/asignacion/pages/MetricasAsignacion';

// Componentes para EJECUTOR
import DashboardEjecutor from '@/features/tareas/pages/DashboardEjecutor';
import ActualizarProgreso from '@/features/tareas/pages/ActualizarProgreso';
import DetalleTareaEjecutor from '@/features/tareas/pages/DetalleTarea';
import MisTareas from '@/features/tareas/pages/MisTareas';
import ProgresoTareas from '@/features/tareas/pages/ProgresoTareas';
import HistorialTareas from '@/features/tareas/pages/HistorialTareas';

// Componentes de configuración
import ConfiguracionTareas from '@/features/configuracion/pages/ConfiguracionTareas';
import ConfiguracionNotificaciones from '@/features/notificaciones/pages/ConfiguracionNotificaciones';
import ConfiguracionIntegraciones from '@/features/integraciones/pages/ConfiguracionIntegraciones';
import DashboardReportes from '@/features/reportes/pages/DashboardReportes';

// Páginas - Carga diferida
const Login = lazy(() => import('./features/auth/Login.tsx'));
const Dashboard = lazy(() => import('./features/dashboard/Dashboard.jsx'));
const Activities = lazy(() => import('./features/activities/Activities'));
const ActivityDetailPage = lazy(() => import('./features/activities/pages/ActivityDetailPage'));
const ActivityFormPage = lazy(() => import('./features/activities/pages/ActivityFormPage'));
const ActivityCalendarPage = lazy(() => import('./features/activities/pages/ActivityCalendarPage'));
const Profile = lazy(() => import('./features/profile/Profile'));
const NotFound = lazy(() => import('./shared/components/ui/NotFound'));

// Componente de carga para Suspense
const LoadingFallback = () => (
  <div className="loading-container">
    <Loader size="large" fullHeight={true} />
  </div>
);

// Componente de ruta protegida
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [isChecking, setIsChecking] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector(state => state.auth);

  useEffect(() => {
    // Verificar si hay token y usuario en localStorage
    const token = localStorage.getItem('bitacora_token');
    const userStr = localStorage.getItem('bitacora_user');
    const userObj = userStr ? JSON.parse(userStr) : null;

    // Verificar autenticación
    const timer = setTimeout(() => {
      setIsChecking(false);

      // Si no hay token o usuario en localStorage, o no está autenticado en Redux
      if (!token || !userObj || !isAuthenticated) {
        // Limpiar el estado de autenticación en Redux si es necesario
        if (isAuthenticated || user) {
          dispatch(setUser(null));
        }

        // Usar navigate para redireccionar
        navigate('/login', { replace: true });
      } else {
        // Si hay usuario en localStorage pero no en Redux, actualizarlo
        if (!user && userObj) {
          dispatch(setUser(userObj));
        }
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [location.pathname, isAuthenticated, user, dispatch, navigate]);

  // Mientras se verifica, mostrar un loader
  if (isChecking) {
    return <LoadingFallback />;
  }

  // Si llegamos aquí, es porque el usuario está autenticado
  return <>{children}</>;
};

function App() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { theme } = useAppSelector(state => state.ui);
  const { isAuthenticated } = useAppSelector(state => state.auth);

  // Inicializar el estado de autenticación al cargar la aplicación
  useEffect(() => {
    const initAuth = () => {
      // Verificar si hay un usuario y token en localStorage
      const userStr = localStorage.getItem('bitacora_user');
      const user = userStr ? JSON.parse(userStr) : null;
      const token = localStorage.getItem('bitacora_token');

      if (user && token) {
        // Actualizar el estado de Redux con el usuario
        dispatch(setUser(user));

        // Si estamos en la página de login o raíz, redirigir a /app
        // Solo redirigir si estamos en la raíz, no en /login (para evitar conflictos con el proceso de login)
        if (window.location.pathname === '/') {
          navigate('/app', { replace: true });

          // Como respaldo, intentar también con window.location después de un breve retraso
          setTimeout(() => {
            if (window.location.pathname === '/') {
              window.location.href = '/app';
            }
          }, 100);
        }
      } else {
        // Asegurarse de que el estado de autenticación sea falso
        dispatch(setUser(null));

        // Si estamos en una ruta protegida, redirigir a /login
        if (window.location.pathname.startsWith('/app')) {
          setTimeout(() => {
            window.location.href = '/login';
          }, 300);
        }
      }
    };

    // Inicializar autenticación
    initAuth();

    // Este efecto solo debe ejecutarse una vez al montar el componente
  }, [dispatch]);

  // Aplicar tema al cargar la aplicación
  useEffect(() => {
    // Verificar si hay un tema guardado en localStorage
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      dispatch(setTheme(savedTheme));
    } else {
      // Usar preferencia del sistema
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      dispatch(setTheme(prefersDark ? 'dark' : 'light'));
    }
  }, [dispatch]);

  // Actualizar el atributo data-theme en el elemento html
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // No se necesita depuración en producción


  return (
    <ThemeProvider theme={theme === 'dark' ? darkTheme : lightTheme}>
      <GlobalStyle />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={theme}
      />
      <ToastProvider position="top-right" defaultDuration={5000}>
        <Suspense fallback={<LoadingFallback />}>
          <AnimatedRoutes transitionType="fade" duration={300}>
          {/* Rutas públicas */}
          <Route path="/" element={<AuthLayout />}>
            <Route index element={<Navigate to="/login" replace />} />
            <Route path="login" element={<Login />} />
          </Route>

          {/* Rutas protegidas - Actividades */}
          <Route path="/app" element={
            <ProtectedRoute>
              <RealTimeNotificationProvider>
                <RoleBasedLayout />
              </RealTimeNotificationProvider>
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="activities" element={<Activities />} />
            <Route path="activities/calendar" element={<ActivityCalendarPage />} />
            <Route path="activities/new" element={<ActivityFormPage />} />
            <Route path="activities/:id" element={<ActivityDetailPage />} />
            <Route path="activities/:id/edit" element={<ActivityFormPage />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* Rutas basadas en roles - Con protección específica por rol */}
          <Route element={
            <ProtectedRoute>
              <RealTimeNotificationProvider>
                <RoleBasedLayout />
              </RealTimeNotificationProvider>
            </ProtectedRoute>
          }>
            {/* Rutas para SOLICITANTE */}
            <Route path="/app/solicitudes/*" element={<RoleProtectedRoute allowedRoles={[UserRole.SOLICITANTE, UserRole.ADMIN]} redirectTo="/app" />}>
              {/* Usar SolicitudesRoute para recargar datos cuando se navega a la página de solicitudes */}
              <Route element={<SolicitudesRoute />}>
                <Route path="dashboard" element={<DashboardSolicitante />} />
                <Route path="nueva" element={<SolicitudForm />} />
                <Route path="" element={<MisSolicitudes />} />
                <Route path="seguimiento/:id" element={<SeguimientoSolicitud />} />
              </Route>
            </Route>

            {/* Rutas para ASIGNADOR */}
            <Route path="/app/asignacion/*" element={<RoleProtectedRoute allowedRoles={[UserRole.ASIGNADOR, UserRole.ADMIN]} redirectTo="/app" />}>
              <Route path="dashboard" element={<DashboardAsignador />} />
              <Route path="asignar/:id" element={<AsignarTarea />} />
              <Route path="detalle/:id" element={<DetalleTarea />} />
              <Route path="bandeja" element={<BandejaEntrada />} />
              <Route path="distribucion" element={<DistribucionCarga />} />
              <Route path="metricas" element={<MetricasAsignacion />} />
            </Route>

            {/* Rutas para EJECUTOR */}
            <Route path="/app/tareas/*" element={<RoleProtectedRoute allowedRoles={[UserRole.EJECUTOR, UserRole.ADMIN]} redirectTo="/app" />}>
              <Route path="dashboard" element={<DashboardEjecutor />} />
              <Route path="progreso/:id" element={<ActualizarProgreso />} />
              <Route path="detalle/:id" element={<DetalleTareaEjecutor />} />
              <Route path="asignadas" element={<MisTareas />} />
              <Route path="progreso" element={<ProgresoTareas />} />
              <Route path="historial" element={<HistorialTareas />} />
            </Route>
          </Route>

          {/* Rutas para ADMIN - Configuración */}
          <Route path="/app/configuracion/*" element={
            <ProtectedRoute>
              <RealTimeNotificationProvider>
                <RoleBasedLayout />
              </RealTimeNotificationProvider>
            </ProtectedRoute>
          }>
            <Route element={<RoleProtectedRoute allowedRoles={[UserRole.ADMIN]} redirectTo="/app" />}>
              <Route path="tareas" element={<ConfiguracionTareas />} />
              <Route path="notificaciones" element={<ConfiguracionNotificaciones />} />
              <Route path="integraciones" element={<ConfiguracionIntegraciones />} />
            </Route>
          </Route>

          {/* Rutas para ADMIN - Reportes */}
          <Route path="/app/reportes" element={
            <ProtectedRoute>
              <RealTimeNotificationProvider>
                <RoleBasedLayout />
              </RealTimeNotificationProvider>
            </ProtectedRoute>
          }>
            <Route element={<RoleProtectedRoute allowedRoles={[UserRole.ADMIN]} redirectTo="/app" />}>
              <Route index element={<DashboardReportes />} />
            </Route>
          </Route>

          {/* Redirección para rutas de dashboard antiguas */}
          <Route path="/dashboard" element={<Navigate to="/app" replace />} />
          <Route path="/dashboard/*" element={<Navigate to="/app" replace />} />

          {/* Ruta 404 */}
          <Route path="*" element={<NotFound />} />
        </AnimatedRoutes>
      </Suspense>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
