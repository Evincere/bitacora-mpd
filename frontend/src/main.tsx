import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ErrorBoundary } from 'react-error-boundary';
import App from './App';
import { store } from './store';
import './index.css';

// Configuración de React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos
      gcTime: 1000 * 60 * 30, // 30 minutos
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Componente de fallback para errores
const ErrorFallback = ({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) => {
  return (
    <div role="alert" style={{
      padding: '20px',
      margin: '20px',
      backgroundColor: '#f8d7da',
      color: '#721c24',
      borderRadius: '5px',
      textAlign: 'center'
    }}>
      <h2>¡Algo salió mal!</h2>
      <p>{error.message}</p>
      <button
        onClick={resetErrorBoundary}
        style={{
          padding: '10px 20px',
          backgroundColor: '#721c24',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Intentar de nuevo
      </button>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
          {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
        </QueryClientProvider>
      </Provider>
    </ErrorBoundary>
  </React.StrictMode>,
);
