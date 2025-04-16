import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authService from './authService'
import { setLoading, addNotification } from '../../store/uiSlice'

// Obtener usuario del localStorage
const user = JSON.parse(localStorage.getItem('user'))

const initialState = {
  user: user || null,
  isAuthenticated: !!user,
  error: null
}

// Login
export const login = createAsyncThunk(
  'auth/login',
  async (userData, thunkAPI) => {
    try {
      thunkAPI.dispatch(setLoading(true))
      const response = await authService.login(userData)
      thunkAPI.dispatch(addNotification({
        type: 'success',
        title: 'Inicio de sesión exitoso',
        message: '¡Bienvenido de nuevo!'
      }))
      return response
    } catch (error) {
      thunkAPI.dispatch(addNotification({
        type: 'error',
        title: 'Error de inicio de sesión',
        message: error.response?.data?.message || 'Credenciales inválidas'
      }))
      return thunkAPI.rejectWithValue(error.response?.data || { message: error.message })
    } finally {
      thunkAPI.dispatch(setLoading(false))
    }
  }
)

// Logout
export const logout = createAsyncThunk(
  'auth/logout',
  async (_, thunkAPI) => {
    try {
      await authService.logout()
      thunkAPI.dispatch(addNotification({
        type: 'info',
        title: 'Sesión cerrada',
        message: 'Has cerrado sesión correctamente'
      }))
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(login.rejected, (state, action) => {
        state.user = null
        state.isAuthenticated = false
        state.error = action.payload
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null
        state.isAuthenticated = false
      })
  }
})

export const { reset } = authSlice.actions
export default authSlice.reducer
