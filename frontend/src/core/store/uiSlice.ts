import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Notification } from '@/core/types/models';
import { UiState } from '@/core/types/store';

const initialState: UiState = {
  sidebarOpen: true,
  isLoading: false,
  notifications: [],
  theme: localStorage.getItem('theme') as 'light' | 'dark' || 'dark',
  loading: false,
  error: null,
  success: null,
  modal: {
    isOpen: false,
    content: null,
    title: ''
  }
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
      const newTheme = state.theme === 'dark' ? 'light' : 'dark';
      state.theme = newTheme;
      localStorage.setItem('theme', newTheme);
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
      localStorage.setItem('theme', action.payload);
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setSuccess: (state, action: PayloadAction<string | null>) => {
      state.success = action.payload;
    },
    openModal: (state, action: PayloadAction<{ title: string; content: React.ReactNode }>) => {
      state.modal.isOpen = true;
      state.modal.title = action.payload.title;
      state.modal.content = action.payload.content;
    },
    closeModal: (state) => {
      state.modal.isOpen = false;
      state.modal.content = null;
      state.modal.title = '';
    }
  }
});

export const { 
  toggleSidebar, 
  setLoading, 
  addNotification, 
  removeNotification,
  toggleTheme,
  setTheme,
  setError,
  setSuccess,
  openModal,
  closeModal
} = uiSlice.actions;

export default uiSlice.reducer;
