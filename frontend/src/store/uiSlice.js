import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  sidebarOpen: true,
  loading: false,
  notifications: []
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    addNotification: (state, action) => {
      state.notifications.push({
        id: Date.now(),
        ...action.payload
      })
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        notification => notification.id !== action.payload
      )
    }
  }
})

export const { toggleSidebar, setLoading, addNotification, removeNotification } = uiSlice.actions

export default uiSlice.reducer
