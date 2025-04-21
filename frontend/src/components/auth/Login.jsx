import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { apiRequest } from '../../utils/api';
import config from '../../config';
import LoginHelp from './LoginHelp';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Alert,
  CircularProgress
} from '@mui/material';

/**
 * Componente de inicio de sesión
 */
const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  /**
   * Maneja el envío del formulario de inicio de sesión
   * @param {Event} e - Evento del formulario
   */
  // Manejar cambios en el campo de usuario
  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  // Manejar cambios en el campo de contraseña
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('Intentando iniciar sesión con:', { username, password });
      const response = await apiRequest({
        method: 'POST',
        url: '/api/auth/login',
        data: {
          username,
          password
        }
      });

      const { token, userId, username: userName, email, fullName, role, permissions } = response;

      // Guardar token y datos de usuario en localStorage
      localStorage.setItem(config.auth.tokenKey, token);
      localStorage.setItem(config.auth.userKey, JSON.stringify({
        id: userId,
        username: userName,
        email,
        fullName,
        role,
        permissions
      }));

      // Calcular y guardar la fecha de expiración del token (24 horas por defecto)
      const expirationDate = new Date();
      expirationDate.setHours(expirationDate.getHours() + 24);
      localStorage.setItem(config.auth.expirationKey, expirationDate.toISOString());

      // Configurar el token en los headers de Axios para futuras peticiones
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // Redirigir al dashboard
      navigate('/dashboard');
    } catch (err) {
      console.error('Error de inicio de sesión:', err);

      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Error al iniciar sesión. Por favor, inténtelo de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Typography component="h1" variant="h5">
            Bitácora MPD
          </Typography>
          <Typography variant="subtitle1" sx={{ mt: 1, mb: 3 }}>
            Iniciar sesión
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Nombre de usuario"
              name="username"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={handleUsernameChange}
              disabled={loading}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Contraseña"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={handlePasswordChange}
              disabled={loading}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Iniciar sesión'}
            </Button>
          </Box>
          <LoginHelp />
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;
