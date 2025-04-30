import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import authService from './authService';
import { setLoading, addNotification } from '../../store/uiSlice';
import { AuthState } from '@/types/store';
import { ApiError, AuthResponse, LoginCredentials } from '@/types/api';
import { User, UserRole } from '@/types/models';

/**
 * Convierte una respuesta de autenticación a un objeto de usuario
 * @param authResponse Respuesta de autenticación del servidor
 * @returns Objeto de usuario compatible con el estado de la aplicación
 */
const mapAuthResponseToUser = (authResponse: AuthResponse): User => {
  // Asegurarse de que el usuario tenga los permisos necesarios según su rol
  let permissions = authResponse.permissions || [];

  // Asegurarse de que el usuario tenga los permisos necesarios según su rol
  if (authResponse.role === 'SOLICITANTE' && !permissions.includes('REQUEST_ACTIVITIES')) {
    console.log('authSlice: Añadiendo permiso REQUEST_ACTIVITIES al usuario SOLICITANTE');
    permissions = [...permissions, 'REQUEST_ACTIVITIES'];
  }

  return {
    id: authResponse.userId,
    username: authResponse.username,
    email: authResponse.email,
    firstName: authResponse.fullName?.split(' ')[0] || '',
    lastName: authResponse.fullName?.split(' ').slice(1).join(' ') || '',
    fullName: authResponse.fullName || '',
    role: authResponse.role as UserRole,
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    permissions: permissions,
    token: authResponse.token,
    tokenType: authResponse.tokenType
  };
};

// Obtener usuario del localStorage
const userFromStorage = localStorage.getItem('user');
const user: User | null = userFromStorage ? JSON.parse(userFromStorage) : null;

const initialState: AuthState = {
  user: user,
  isAuthenticated: !!user,
  error: null
};

/**
 * Thunk para iniciar sesión
 */
export const login = createAsyncThunk<
  AuthResponse,
  LoginCredentials,
  { rejectValue: ApiError }
>(
  'auth/login',
  async (credentials, thunkAPI) => {
    try {
      thunkAPI.dispatch(setLoading(true));
      const response = await authService.login(credentials);
      thunkAPI.dispatch(addNotification({
        id: Date.now().toString(),
        type: 'success',
        title: 'Inicio de sesión exitoso',
        message: '¡Bienvenido de nuevo!',
        createdAt: Date.now()
      }));
      return response;
    } catch (error) {
      const apiError = error as ApiError;
      thunkAPI.dispatch(addNotification({
        id: Date.now().toString(),
        type: 'error',
        title: 'Error de inicio de sesión',
        message: apiError.message || 'Credenciales inválidas',
        createdAt: Date.now()
      }));
      return thunkAPI.rejectWithValue(apiError);
    } finally {
      thunkAPI.dispatch(setLoading(false));
    }
  }
);

/**
 * Thunk para cerrar sesión
 */
export const logout = createAsyncThunk(
  'auth/logout',
  async (_, thunkAPI) => {
    try {
      authService.logout();
      thunkAPI.dispatch(addNotification({
        id: Date.now().toString(),
        type: 'info',
        title: 'Sesión cerrada',
        message: 'Has cerrado sesión correctamente',
        createdAt: Date.now()
      }));
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        // Convertir AuthResponse a User usando la función de mapeo
        state.user = mapAuthResponseToUser(action.payload);
        state.isAuthenticated = true;
        state.error = null;

        // Guardar usuario en localStorage para persistencia
        localStorage.setItem('user', JSON.stringify(state.user));
      })
      .addCase(login.rejected, (state, action) => {
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload || {
          status: 500,
          error: 'Error',
          message: 'Error desconocido',
          path: '/api/auth/login'
        };
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      });
  }
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
