import React from 'react';
import { Box, Typography, Paper, Alert, AlertTitle, Button } from '@mui/material';

/**
 * Componente de ayuda para el inicio de sesión
 */
const LoginHelp = () => {
  const handleAutoFill = () => {
    // Buscar los campos de usuario y contraseña
    const usernameField = document.getElementById('username');
    const passwordField = document.getElementById('password');

    // Rellenar los campos
    if (usernameField) usernameField.value = 'admin';
    if (passwordField) passwordField.value = 'Test@1234';

    // Disparar eventos de cambio para que React actualice el estado
    if (usernameField) {
      const event = new Event('input', { bubbles: true });
      usernameField.dispatchEvent(event);
    }

    if (passwordField) {
      const event = new Event('input', { bubbles: true });
      passwordField.dispatchEvent(event);
    }
  };

  return (
    <Box sx={{ mt: 2, width: '100%' }}>
      <Paper elevation={1} sx={{ p: 2 }}>
        <Alert severity="info">
          <AlertTitle>Credenciales de prueba</AlertTitle>
          <Typography variant="body2">
            Para probar la aplicación, puede usar las siguientes credenciales:
          </Typography>
          <Box component="ul" sx={{ pl: 2, mt: 1 }}>
            <li>
              <Typography variant="body2">
                <strong>Usuario:</strong> admin
              </Typography>
            </li>
            <li>
              <Typography variant="body2">
                <strong>Contraseña:</strong> Test@1234
              </Typography>
            </li>
          </Box>
          <Button
            variant="outlined"
            size="small"
            onClick={handleAutoFill}
            sx={{ mt: 1 }}
          >
            Rellenar automáticamente
          </Button>
        </Alert>
      </Paper>
    </Box>
  );
};

export default LoginHelp;
