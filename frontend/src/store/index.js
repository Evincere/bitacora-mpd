import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import activitiesReducer from '../features/activities/activitiesSlice'
import uiReducer from './uiSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    activities: activitiesReducer,
    ui: uiReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})
