import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Notification } from '@/types/models';
import { UiState } from '@/types/store';

const initialState: UiState = {
  sidebarOpen: true,
  isLoading: false,
  notifications: [],
  theme: 'dark'
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications.push(action.payload);
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        notification => notification.id !== action.payload
      );
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    }
  }
});

export const { 
  toggleSidebar, 
  setLoading, 
  addNotification, 
  removeNotification,
  toggleTheme,
  setTheme
} = uiSlice.actions;

export default uiSlice.reducer;
