import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '@/core/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/core/store';
import { setUser } from '@/features/auth/store/authSlice';
import { UserRole } from '@/core/types/models';

// Estilos
const LoginContainer = styled.div`
  width: 100%;
  max-width: 400px;
  padding: 30px;
  background-color: ${({ theme }) => theme.backgroundSecondary};
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 30px;

  img {
    width: 50px;
    height: 50px;
  }

  h1 {
    margin-left: 10px;
    font-size: 24px;
    font-weight: 700;
    color: ${({ theme }) => theme.primary};
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
`;

const Input = styled.input`
  padding: 12px 16px;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.border};
  background-color: ${({ theme }) => theme.inputBackground};
  color: ${({ theme }) => theme.text};
  font-size: 16px;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.primaryLight};
  }
`;

const Button = styled.button`
  padding: 12px 16px;
  border-radius: 4px;
  border: none;
  background-color: ${({ theme }) => theme.primary};
  color: white;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.primaryDark};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.backgroundDisabled || theme.border};
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.error};
  font-size: 14px;
  margin-top: 10px;
  padding: 10px;
  background-color: rgba(255, 59, 48, 0.1);
  border-radius: 4px;
  text-align: center;
`;

/**
 * Componente de página de inicio de sesión
 *
 * @returns {JSX.Element} Componente Login
 */
const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isLoggingIn, error: authError } = useAuth();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector(state => state.auth);

  // Redireccionar si el usuario ya está autenticado
  useEffect(() => {
    // Verificar si el usuario está autenticado y si estamos en la página de login
    const token = localStorage.getItem('bitacora_token');
    const user = localStorage.getItem('bitacora_user');

    console.log('Login: Verificando estado de autenticación');
    console.log('- isAuthenticated (Redux):', isAuthenticated);
    console.log('- Token en localStorage:', !!token);
    console.log('- Usuario en localStorage:', !!user);

    // Considerar autenticado solo si hay token y usuario en localStorage
    const isReallyAuthenticated = !!token && !!user;

    if (isReallyAuthenticated) {
      console.log('Usuario ya autenticado en Login, redirigiendo a /app');
      // Verificar que no estemos ya en /app para evitar redirecciones innecesarias
      if (window.location.pathname.indexOf('/app') !== 0) {
        console.log('Login: Ejecutando redirección a /app');
        navigate('/app', { replace: true });

        // Como respaldo, intentar también con window.location después de un breve retraso
        setTimeout(() => {
          if (window.location.pathname === '/login') {
            console.log('Redirección con navigate no funcionó, intentando con window.location');
            window.location.href = '/app';
          }
        }, 100);
      }
    }
  }, [isAuthenticated, navigate]);

  // Actualizar el error local cuando cambia el error de autenticación
  useEffect(() => {
    if (authError) {
      console.log('Login: Error de autenticación recibido:', authError);
      setError(authError.message || 'Error al iniciar sesión. Verifique sus credenciales.');
    }
  }, [authError]);

  // Efecto para manejar la redirección cuando el usuario se autentica
  // Este efecto ya no es necesario porque la redirección la hace el hook useAuth
  // Lo dejamos comentado para referencia
  /*
  useEffect(() => {
    if (isAuthenticated) {
      console.log('Login: Usuario autenticado, preparando redirección a /app');
      const token = localStorage.getItem('bitacora_token');
      const user = localStorage.getItem('bitacora_user');

      if (token && user) {
        console.log('Login: Token y usuario presentes, redirigiendo a /app');
        window.location.replace('/app');
      }
    }
  }, [isAuthenticated, navigate]);
  */

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validación básica
    if (!username.trim() || !password.trim()) {
      setError('Por favor, ingrese usuario y contraseña');
      return;
    }

    console.log('Login: Enviando formulario de login con usuario:', username);
    console.log('Login: Estado de autenticación antes de login:', isAuthenticated);
    console.log('Login: Token presente antes de login:', !!localStorage.getItem('bitacora_token'));
    console.log('Login: Usuario presente antes de login:', !!localStorage.getItem('bitacora_user'));

    // Limpiar cualquier token o usuario anterior para evitar problemas
    localStorage.removeItem('bitacora_token');
    localStorage.removeItem('bitacora_user');
    localStorage.removeItem('bitacora_refresh_token');

    setError('');

    // Usar el hook useAuth para iniciar sesión
    login({ username, password });
  };

  return (
    <LoginContainer>
      <Logo>
        <img src="/logo.svg" alt="Bitácora" />
        <h1>Bitácora</h1>
      </Logo>

      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="username">Usuario</Label>
          <Input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Ingrese su usuario"
            autoComplete="username"
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="password">Contraseña</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Ingrese su contraseña"
            autoComplete="current-password"
          />
        </FormGroup>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <Button type="submit" disabled={isLoggingIn}>
          {isLoggingIn ? 'Iniciando sesión...' : 'Iniciar sesión'}
        </Button>
      </Form>
    </LoginContainer>
  );
};

export default Login;
