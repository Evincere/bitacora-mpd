import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@/core/types/models';
import { AuthState } from '@/core/types/store';

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      console.log('authSlice: Estableciendo usuario en el estado global:', action.payload);
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      state.error = null;
    },
    setError: (state, action: PayloadAction<any>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    }
  }
});

export const { setUser, setError, clearError, logout } = authSlice.actions;

export default authSlice.reducer;
