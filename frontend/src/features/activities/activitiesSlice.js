import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import activitiesService from "./activitiesService";
import { setLoading, addNotification } from "../../store/uiSlice";

const initialState = {
  activities: [],
  activity: null,
  totalCount: 0,
  page: 1,
  limit: 10,
  filters: {
    type: "",
    status: "",
    startDate: "",
    endDate: "",
    search: "",
  },
  error: null,
};

// Obtener actividades
export const getActivities = createAsyncThunk(
  "activities/getAll",
  async (params, thunkAPI) => {
    try {
      thunkAPI.dispatch(setLoading(true));
      const response = await activitiesService.getActivities(params);
      return response;
    } catch (error) {
      thunkAPI.dispatch(
        addNotification({
          type: "error",
          title: "Error",
          message:
            error.response?.data?.message || "Error al cargar las actividades",
        })
      );
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: error.message }
      );
    } finally {
      thunkAPI.dispatch(setLoading(false));
    }
  }
);

// Obtener una actividad por ID
export const getActivityById = createAsyncThunk(
  "activities/getById",
  async (id, thunkAPI) => {
    try {
      thunkAPI.dispatch(setLoading(true));
      const response = await activitiesService.getActivityById(id);
      return response;
    } catch (error) {
      thunkAPI.dispatch(
        addNotification({
          type: "error",
          title: "Error",
          message:
            error.response?.data?.message || "Error al cargar la actividad",
        })
      );
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: error.message }
      );
    } finally {
      thunkAPI.dispatch(setLoading(false));
    }
  }
);

// Crear una nueva actividad
export const createActivity = createAsyncThunk(
  "activities/create",
  async (activityData, thunkAPI) => {
    try {
      thunkAPI.dispatch(setLoading(true));
      const response = await activitiesService.createActivity(activityData);
      thunkAPI.dispatch(
        addNotification({
          type: "success",
          title: "Actividad creada",
          message: "La actividad ha sido creada exitosamente",
        })
      );
      return response;
    } catch (error) {
      thunkAPI.dispatch(
        addNotification({
          type: "error",
          title: "Error",
          message:
            error.response?.data?.message || "Error al crear la actividad",
        })
      );
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: error.message }
      );
    } finally {
      thunkAPI.dispatch(setLoading(false));
    }
  }
);

// Actualizar una actividad
export const updateActivity = createAsyncThunk(
  "activities/update",
  async ({ id, activityData }, thunkAPI) => {
    try {
      thunkAPI.dispatch(setLoading(true));
      const response = await activitiesService.updateActivity(id, activityData);
      thunkAPI.dispatch(
        addNotification({
          type: "success",
          title: "Actividad actualizada",
          message: "La actividad ha sido actualizada exitosamente",
        })
      );
      return response;
    } catch (error) {
      thunkAPI.dispatch(
        addNotification({
          type: "error",
          title: "Error",
          message:
            error.response?.data?.message || "Error al actualizar la actividad",
        })
      );
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: error.message }
      );
    } finally {
      thunkAPI.dispatch(setLoading(false));
    }
  }
);

// Eliminar una actividad
export const deleteActivity = createAsyncThunk(
  "activities/delete",
  async (id, thunkAPI) => {
    try {
      thunkAPI.dispatch(setLoading(true));
      await activitiesService.deleteActivity(id);
      thunkAPI.dispatch(
        addNotification({
          type: "success",
          title: "Actividad eliminada",
          message: "La actividad ha sido eliminada exitosamente",
        })
      );
      return id;
    } catch (error) {
      thunkAPI.dispatch(
        addNotification({
          type: "error",
          title: "Error",
          message:
            error.response?.data?.message || "Error al eliminar la actividad",
        })
      );
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: error.message }
      );
    } finally {
      thunkAPI.dispatch(setLoading(false));
    }
  }
);

const activitiesSlice = createSlice({
  name: "activities",
  initialState,
  reducers: {
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setLimit: (state, action) => {
      state.limit = action.payload;
      state.page = 1; // Reset to first page when changing limit
    },
    setFilters: (state, action) => {
      state.filters = {
        ...state.filters,
        ...action.payload,
      };
      state.page = 1; // Reset to first page when applying filters
    },
    clearFilters: (state) => {
      state.filters = {
        type: "",
        status: "",
        startDate: "",
        endDate: "",
        search: "",
      };
      state.page = 1;
    },
    clearActivity: (state) => {
      state.activity = null;
    },
    reset: (state) => {
      state.activities = [];
      state.activity = null;
      state.totalCount = 0;
      state.page = 1;
      state.limit = 10;
      state.filters = {
        type: "",
        status: "",
        startDate: "",
        endDate: "",
        search: "",
      };
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getActivities.fulfilled, (state, action) => {
        // El servicio ya normaliza la respuesta a un formato estándar
        state.activities = action.payload.activities || [];
        state.totalCount = action.payload.totalCount || 0;
        state.error = null;
      })
      .addCase(getActivities.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(getActivityById.fulfilled, (state, action) => {
        state.activity = action.payload;
        state.error = null;
      })
      .addCase(getActivityById.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(createActivity.fulfilled, (state, action) => {
        state.activities.unshift(action.payload);
        state.totalCount += 1;
        state.error = null;
      })
      .addCase(createActivity.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(updateActivity.fulfilled, (state, action) => {
        state.activities = state.activities.map((activity) =>
          activity.id === action.payload.id ? action.payload : activity
        );
        state.activity = action.payload;
        state.error = null;
      })
      .addCase(updateActivity.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(deleteActivity.fulfilled, (state, action) => {
        state.activities = state.activities.filter(
          (activity) => activity.id !== action.payload
        );
        state.totalCount -= 1;
        state.error = null;
      })
      .addCase(deleteActivity.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const {
  setPage,
  setLimit,
  setFilters,
  clearFilters,
  clearActivity,
  reset,
} = activitiesSlice.actions;
export default activitiesSlice.reducer;
