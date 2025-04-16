import { getActivities as getMockActivities, getActivityById as getMockActivityById, createActivity as createMockActivity, updateActivity as updateMockActivity, deleteActivity as deleteMockActivity } from './mockData'

// Simulación de delay para emular llamadas a API
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// Obtener actividades con filtros y paginación
const getActivities = async (params) => {
  // Simular delay de red
  await delay(500)

  const { page = 1, limit = 10, ...filters } = params || {}
  return getMockActivities(page, limit, filters)
}

// Obtener una actividad por ID
const getActivityById = async (id) => {
  // Simular delay de red
  await delay(300)

  const activity = getMockActivityById(Number(id))
  if (!activity) {
    throw new Error('Actividad no encontrada')
  }
  return activity
}

// Crear una nueva actividad
const createActivity = async (activityData) => {
  // Simular delay de red
  await delay(800)

  return createMockActivity(activityData)
}

// Actualizar una actividad
const updateActivity = async (id, activityData) => {
  // Simular delay de red
  await delay(800)

  const updatedActivity = updateMockActivity(Number(id), activityData)
  if (!updatedActivity) {
    throw new Error('Actividad no encontrada')
  }
  return updatedActivity
}

// Eliminar una actividad
const deleteActivity = async (id) => {
  // Simular delay de red
  await delay(600)

  const success = deleteMockActivity(Number(id))
  if (!success) {
    throw new Error('Actividad no encontrada')
  }
  return { success: true }
}

const activitiesService = {
  getActivities,
  getActivityById,
  createActivity,
  updateActivity,
  deleteActivity
}

export default activitiesService
