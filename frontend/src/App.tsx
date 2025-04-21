import { useEffect, lazy, Suspense } from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './store';
import { setTheme } from './store/uiSlice';
import { ToastProvider } from './components/ui/Toast';
import AnimatedRoutes from './components/ui/AnimatedRoutes';
import { RealTimeNotificationProvider } from './contexts/RealTimeNotificationContext';

// Componentes de carga
import LoadingSpinner from './components/ui/LoadingSpinner';

// Layouts
const MainLayout = lazy(() => import('./components/layout/Layout'));
const AuthLayout = lazy(() => import('./components/layouts/AuthLayout'));

// Páginas - Carga diferida
const Login = lazy(() => import('./features/auth/Login'));
const Dashboard = lazy(() => import('./features/dashboard/Dashboard'));
const Activities = lazy(() => import('./features/activities/Activities'));
const ActivityDetailPage = lazy(() => import('./features/activities/pages/ActivityDetailPage'));
const ActivityFormPage = lazy(() => import('./features/activities/pages/ActivityFormPage'));
const ActivityCalendarPage = lazy(() => import('./features/activities/pages/ActivityCalendarPage'));
const Profile = lazy(() => import('./features/profile/Profile'));
const NotFound = lazy(() => import('./components/ui/NotFound'));

// Componente de carga para Suspense
const LoadingFallback = () => (
  <div className="loading-container">
    <LoadingSpinner size={50} />
  </div>
);

// Componente de ruta protegida
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated } = useAppSelector(state => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

function App() {
  const dispatch = useAppDispatch();
  const { theme } = useAppSelector(state => state.ui);

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


  return (
    <ToastProvider position="top-right" defaultDuration={5000}>
      <RealTimeNotificationProvider>
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
                <MainLayout />
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

            {/* Ruta 404 */}
            <Route path="*" element={<NotFound />} />
          </AnimatedRoutes>
        </Suspense>
      </RealTimeNotificationProvider>
    </ToastProvider>
  );
}

export default App;
