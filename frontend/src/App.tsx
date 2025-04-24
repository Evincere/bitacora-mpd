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
// Ya no necesitamos estas importaciones porque verificamos directamente en localStorage

// Componentes de carga
import { Loader } from './shared/components/common';

// Layouts
const MainLayout = lazy(() => import('@/shared/components/layout/Layout'));
const AuthLayout = lazy(() => import('./features/auth/components/AuthLayout'));

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

  useEffect(() => {
    console.log('ProtectedRoute: Verificando autenticación en ruta:', location.pathname);

    // Verificar si hay token y usuario en localStorage
    const token = localStorage.getItem('bitacora_token');
    const user = localStorage.getItem('bitacora_user');

    console.log('ProtectedRoute: Verificación detallada:');
    console.log('- Token en localStorage:', !!token);
    console.log('- Usuario en localStorage:', !!user);

    // Verificar autenticación después de un breve retraso
    const timer = setTimeout(() => {
      setIsChecking(false);

      // Si no hay token o usuario, redirigir a login
      if (!token || !user) {
        console.log('ProtectedRoute: Usuario no autenticado, redirigiendo a /login');
        window.location.href = '/login';
      } else {
        console.log('ProtectedRoute: Usuario autenticado, mostrando contenido protegido');
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [location.pathname]);

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

      console.log('App: Verificando autenticación al iniciar');
      console.log('App: Token presente:', !!token);
      console.log('App: Usuario presente:', !!user);
      console.log('App: Ruta actual:', window.location.pathname);

      if (user && token) {
        console.log('App: Usuario encontrado en localStorage, inicializando estado de autenticación');
        console.log('App: Datos del usuario:', user);
        console.log('App: Token (primeros 20 caracteres):', token.substring(0, 20) + '...');

        // Actualizar el estado de Redux con el usuario
        dispatch(setUser(user));
        console.log('App: Estado de autenticación actualizado con usuario:', user.username);

        // Si estamos en la página de login o raíz, redirigir a /app
        // Solo redirigir si estamos en la raíz, no en /login (para evitar conflictos con el proceso de login)
        if (window.location.pathname === '/') {
          console.log('App: Usuario autenticado en página raíz, redirigiendo a /app');
          navigate('/app', { replace: true });

          // Como respaldo, intentar también con window.location después de un breve retraso
          setTimeout(() => {
            if (window.location.pathname === '/') {
              console.log('Redirección con navigate no funcionó, intentando con window.location');
              window.location.href = '/app';
            }
          }, 100);
        } else if (window.location.pathname === '/login') {
          console.log('App: Usuario autenticado en página de login, no redirigiendo (lo hará el proceso de login)');
        }
      } else {
        console.log('App: No hay usuario o token válido en localStorage');
        if (!user) console.log('App: Usuario no encontrado en localStorage');
        if (!token) console.log('App: Token no encontrado en localStorage');

        // Asegurarse de que el estado de autenticación sea falso
        dispatch(setUser(null));

        // Si estamos en una ruta protegida, redirigir a /login
        if (window.location.pathname.startsWith('/app')) {
          console.log('App: Usuario no autenticado en ruta protegida, redirigiendo a /login');
          setTimeout(() => {
            console.log('App: Ejecutando redirección a /login');
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

  // Efecto para depuración
  useEffect(() => {
    console.log('App: Estado de autenticación cambió a:', isAuthenticated);

    // Si el usuario está autenticado, verificar la ruta actual
    if (isAuthenticated) {
      const currentPath = window.location.pathname;
      console.log('App: Ruta actual con usuario autenticado:', currentPath);

      // Si está en la página de login o raíz, mostrar mensaje de depuración
      if (currentPath === '/' || currentPath === '/login') {
        console.log('App: Usuario autenticado en página pública, debería redirigir a /app');
      }
    }
  }, [isAuthenticated]);


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

          {/* Rutas protegidas */}
          <Route path="/app" element={
            <ProtectedRoute>
              <RealTimeNotificationProvider>
                <MainLayout />
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
