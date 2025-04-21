/**
 * Servicio simulado para actividades mientras el backend no está disponible
 */

// Tipos de actividades
const ACTIVITY_TYPES = [
  'AUDIENCIA',
  'REUNION',
  'ENTREVISTA',
  'INVESTIGACION',
  'DICTAMEN',
  'OTRO'
];

// Estados de actividades
const ACTIVITY_STATUS = [
  'PENDIENTE',
  'EN_PROGRESO',
  'COMPLETADA',
  'CANCELADA'
];

// Generar fechas aleatorias en los últimos 30 días
const getRandomDate = () => {
  const now = new Date();
  const daysAgo = Math.floor(Math.random() * 30);
  const date = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
  return date.toISOString().split('T')[0];
};

// Generar actividades de prueba
const generateMockActivities = (count) => {
  return Array.from({ length: count }).map((_, index) => {
    const createdAt = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString();
    const updatedAt = new Date(new Date(createdAt).getTime() + Math.random() * 24 * 60 * 60 * 1000).toISOString();
    
    return {
      id: index + 1,
      date: getRandomDate(),
      type: ACTIVITY_TYPES[Math.floor(Math.random() * ACTIVITY_TYPES.length)],
      description: `Actividad de prueba ${index + 1}`,
      person: `Persona ${index % 5 + 1}`,
      role: `Rol ${index % 3 + 1}`,
      dependency: `Dependencia ${index % 4 + 1}`,
      situation: `Situación de la actividad ${index + 1}. Esta es una descripción detallada de la situación que se presentó durante la actividad.`,
      result: `Resultado de la actividad ${index + 1}. Este es el resultado obtenido después de realizar la actividad.`,
      status: ACTIVITY_STATUS[Math.floor(Math.random() * ACTIVITY_STATUS.length)],
      lastStatusChangeDate: updatedAt,
      comments: `Comentarios sobre la actividad ${index + 1}`,
      agent: `Agente ${index % 3 + 1}`,
      createdAt,
      updatedAt,
      userId: 1
    };
  });
};

// Datos de prueba
const mockActivities = generateMockActivities(50);

/**
 * Obtiene actividades con filtros y paginación
 * @param {Object} params Parámetros de consulta
 * @returns {Promise<Object>} Lista de actividades y total
 */
const getActivities = async (params = {}) => {
  // Simular latencia de red
  await new Promise(resolve => setTimeout(resolve, 800));
  
  let filteredActivities = [...mockActivities];
  
  // Aplicar filtros
  if (params.type) {
    filteredActivities = filteredActivities.filter(activity => 
      activity.type.toLowerCase().includes(params.type.toLowerCase())
    );
  }
  
  if (params.status) {
    filteredActivities = filteredActivities.filter(activity => 
      activity.status.toLowerCase().includes(params.status.toLowerCase())
    );
  }
  
  if (params.startDate) {
    const startDate = new Date(params.startDate);
    filteredActivities = filteredActivities.filter(activity => 
      new Date(activity.date) >= startDate
    );
  }
  
  if (params.endDate) {
    const endDate = new Date(params.endDate);
    filteredActivities = filteredActivities.filter(activity => 
      new Date(activity.date) <= endDate
    );
  }
  
  if (params.search) {
    const searchLower = params.search.toLowerCase();
    filteredActivities = filteredActivities.filter(activity => 
      activity.description.toLowerCase().includes(searchLower) ||
      activity.person?.toLowerCase().includes(searchLower) ||
      activity.role?.toLowerCase().includes(searchLower) ||
      activity.dependency?.toLowerCase().includes(searchLower)
    );
  }
  
  // Ordenar por fecha de creación descendente (más reciente primero)
  if (params.sort === 'createdAt,desc') {
    filteredActivities.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } else if (params.sort === 'createdAt,asc') {
    filteredActivities.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  } else if (params.sort === 'date,desc') {
    filteredActivities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } else if (params.sort === 'date,asc') {
    filteredActivities.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }
  
  // Aplicar paginación
  const page = params.page || 0;
  const size = params.size || 10;
  const start = page * size;
  const end = start + size;
  const paginatedActivities = filteredActivities.slice(start, end);
  
  return {
    activities: paginatedActivities,
    totalCount: filteredActivities.length
  };
};

/**
 * Obtiene una actividad por su ID
 * @param {number} id ID de la actividad
 * @returns {Promise<Object>} Actividad
 */
const getActivityById = async (id) => {
  // Simular latencia de red
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const activity = mockActivities.find(activity => activity.id === id);
  
  if (!activity) {
    throw new Error(`No se encontró la actividad con ID ${id}`);
  }
  
  return activity;
};

/**
 * Crea una nueva actividad
 * @param {Object} activityData Datos de la actividad
 * @returns {Promise<Object>} Actividad creada
 */
const createActivity = async (activityData) => {
  // Simular latencia de red
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const newId = mockActivities.length > 0 ? Math.max(...mockActivities.map(a => a.id)) + 1 : 1;
  const now = new Date().toISOString();
  
  const newActivity = {
    id: newId,
    ...activityData,
    createdAt: now,
    updatedAt: now,
    userId: 1
  };
  
  mockActivities.unshift(newActivity);
  
  return newActivity;
};

/**
 * Actualiza una actividad existente
 * @param {number} id ID de la actividad
 * @param {Object} activityData Datos a actualizar
 * @returns {Promise<Object>} Actividad actualizada
 */
const updateActivity = async (id, activityData) => {
  // Simular latencia de red
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const index = mockActivities.findIndex(activity => activity.id === id);
  
  if (index === -1) {
    throw new Error(`No se encontró la actividad con ID ${id}`);
  }
  
  const updatedActivity = {
    ...mockActivities[index],
    ...activityData,
    updatedAt: new Date().toISOString()
  };
  
  mockActivities[index] = updatedActivity;
  
  return updatedActivity;
};

/**
 * Elimina una actividad
 * @param {number} id ID de la actividad
 * @returns {Promise<void>}
 */
const deleteActivity = async (id) => {
  // Simular latencia de red
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const index = mockActivities.findIndex(activity => activity.id === id);
  
  if (index === -1) {
    throw new Error(`No se encontró la actividad con ID ${id}`);
  }
  
  mockActivities.splice(index, 1);
};

export default {
  getActivities,
  getActivityById,
  createActivity,
  updateActivity,
  deleteActivity
};
