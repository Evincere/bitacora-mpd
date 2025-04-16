// Datos de ejemplo para actividades
export const mockActivities = [
  {
    id: 1,
    date: '2025-04-15T10:30:00.000Z',
    type: 'Atención Personal',
    description: 'Atención a Juan Pérez por consulta sobre expediente 123/2025',
    person: 'Juan Pérez',
    role: 'Abogado',
    dependency: 'Estudio Jurídico ABC',
    situation: 'El solicitante requiere información sobre el estado actual del expediente 123/2025 relacionado con un trámite administrativo.',
    result: 'Se proporcionó la información solicitada y se indicó que el expediente se encuentra en revisión por el departamento legal.',
    status: 'Completado',
    lastStatusChangeDate: '2025-04-15T11:45:00.000Z',
    comments: 'El solicitante quedó conforme con la información proporcionada.',
    agent: 'María González',
    createdAt: '2025-04-15T10:30:00.000Z',
    updatedAt: '2025-04-15T11:45:00.000Z',
    userId: 1
  },
  {
    id: 2,
    date: '2025-04-15T14:00:00.000Z',
    type: 'Atención Telefónica',
    description: 'Llamada de Carlos Rodríguez sobre documentación pendiente',
    person: 'Carlos Rodríguez',
    role: 'Contador',
    dependency: 'Consultora XYZ',
    situation: 'El solicitante llama para consultar sobre documentación pendiente para completar un trámite.',
    result: 'Se informó sobre los documentos faltantes y se acordó que los enviará por correo electrónico.',
    status: 'En progreso',
    lastStatusChangeDate: '2025-04-15T14:30:00.000Z',
    comments: 'Pendiente recepción de documentos por correo.',
    agent: 'Luis Sánchez',
    createdAt: '2025-04-15T14:00:00.000Z',
    updatedAt: '2025-04-15T14:30:00.000Z',
    userId: 2
  },
  {
    id: 3,
    date: '2025-04-16T09:15:00.000Z',
    type: 'Concursos',
    description: 'Evaluación de candidatos para puesto de desarrollador',
    person: 'Comité de Selección',
    role: 'RRHH',
    dependency: 'Departamento de Recursos Humanos',
    situation: 'Se requiere evaluar a 5 candidatos preseleccionados para el puesto de desarrollador senior.',
    result: 'Se realizaron entrevistas técnicas y se seleccionaron 2 finalistas para la siguiente etapa.',
    status: 'En progreso',
    lastStatusChangeDate: '2025-04-16T12:30:00.000Z',
    comments: 'Los finalistas serán entrevistados por el director del área la próxima semana.',
    agent: 'Ana Martínez',
    createdAt: '2025-04-16T09:15:00.000Z',
    updatedAt: '2025-04-16T12:30:00.000Z',
    userId: 1
  },
  {
    id: 4,
    date: '2025-04-16T11:00:00.000Z',
    type: 'Solicitud de info',
    description: 'Solicitud de información sobre requisitos para licitación',
    person: 'Laura Gómez',
    role: 'Gerente de Proyectos',
    dependency: 'Empresa Constructora ABC',
    situation: 'La solicitante requiere información detallada sobre los requisitos para participar en la licitación pública N° 45/2025.',
    result: 'Se proporcionó la documentación completa con los requisitos y plazos.',
    status: 'Completado',
    lastStatusChangeDate: '2025-04-16T11:45:00.000Z',
    comments: 'La solicitante agradeció la rapidez en la respuesta.',
    agent: 'Roberto Fernández',
    createdAt: '2025-04-16T11:00:00.000Z',
    updatedAt: '2025-04-16T11:45:00.000Z',
    userId: 3
  },
  {
    id: 5,
    date: '2025-04-17T10:00:00.000Z',
    type: 'Mails',
    description: 'Respuesta a consultas sobre procedimiento administrativo',
    person: 'Varios destinatarios',
    role: 'Diversos',
    dependency: 'Varias dependencias',
    situation: 'Se recibieron múltiples consultas por correo sobre el nuevo procedimiento administrativo implementado.',
    result: 'Se elaboró un documento con respuestas a preguntas frecuentes y se envió a todos los interesados.',
    status: 'Completado',
    lastStatusChangeDate: '2025-04-17T12:15:00.000Z',
    comments: 'Se recibieron respuestas positivas agradeciendo la clarificación.',
    agent: 'María González',
    createdAt: '2025-04-17T10:00:00.000Z',
    updatedAt: '2025-04-17T12:15:00.000Z',
    userId: 1
  },
  {
    id: 6,
    date: '2025-04-17T15:30:00.000Z',
    type: 'Atención Personal',
    description: 'Reunión con representantes del sindicato',
    person: 'Jorge Méndez y equipo',
    role: 'Representantes sindicales',
    dependency: 'Sindicato de Trabajadores',
    situation: 'Reunión solicitada para discutir mejoras en las condiciones laborales.',
    result: 'Se acordó elaborar una propuesta conjunta para presentar a la dirección.',
    status: 'Pendiente',
    lastStatusChangeDate: '2025-04-17T15:30:00.000Z',
    comments: 'Pendiente elaboración de propuesta para próxima reunión.',
    agent: 'Luis Sánchez',
    createdAt: '2025-04-17T15:30:00.000Z',
    updatedAt: '2025-04-17T15:30:00.000Z',
    userId: 2
  },
  {
    id: 7,
    date: '2025-04-18T09:00:00.000Z',
    type: 'Multitareas',
    description: 'Organización de documentación y archivo',
    person: 'Interno',
    role: 'Administrativo',
    dependency: 'Departamento Administrativo',
    situation: 'Se requiere organizar y digitalizar documentación acumulada del último trimestre.',
    result: 'Se clasificaron y digitalizaron 150 documentos, quedando pendientes aproximadamente 50.',
    status: 'En progreso',
    lastStatusChangeDate: '2025-04-18T13:00:00.000Z',
    comments: 'Se continuará con la tarea la próxima semana.',
    agent: 'Ana Martínez',
    createdAt: '2025-04-18T09:00:00.000Z',
    updatedAt: '2025-04-18T13:00:00.000Z',
    userId: 1
  },
  {
    id: 8,
    date: '2025-04-18T14:30:00.000Z',
    type: 'Atención Telefónica',
    description: 'Consulta sobre estado de trámite de Pedro Díaz',
    person: 'Pedro Díaz',
    role: 'Ciudadano',
    dependency: 'N/A',
    situation: 'El solicitante consulta sobre el estado de su trámite iniciado hace 2 semanas.',
    result: 'Se verificó en el sistema y se informó que el trámite está en proceso de evaluación.',
    status: 'Completado',
    lastStatusChangeDate: '2025-04-18T14:45:00.000Z',
    comments: 'Se le indicó que recibirá notificación por correo cuando haya novedades.',
    agent: 'Roberto Fernández',
    createdAt: '2025-04-18T14:30:00.000Z',
    updatedAt: '2025-04-18T14:45:00.000Z',
    userId: 3
  }
];

// Función para obtener actividades paginadas y filtradas
export const getActivities = (page = 1, limit = 10, filters = {}) => {
  let filteredActivities = [...mockActivities];
  
  // Aplicar filtros
  if (filters.type) {
    filteredActivities = filteredActivities.filter(activity => 
      activity.type === filters.type
    );
  }
  
  if (filters.status) {
    filteredActivities = filteredActivities.filter(activity => 
      activity.status === filters.status
    );
  }
  
  if (filters.startDate) {
    const startDate = new Date(filters.startDate);
    filteredActivities = filteredActivities.filter(activity => 
      new Date(activity.date) >= startDate
    );
  }
  
  if (filters.endDate) {
    const endDate = new Date(filters.endDate);
    endDate.setHours(23, 59, 59, 999); // Final del día
    filteredActivities = filteredActivities.filter(activity => 
      new Date(activity.date) <= endDate
    );
  }
  
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filteredActivities = filteredActivities.filter(activity => 
      activity.description.toLowerCase().includes(searchLower) ||
      activity.person.toLowerCase().includes(searchLower) ||
      activity.role.toLowerCase().includes(searchLower) ||
      activity.dependency.toLowerCase().includes(searchLower)
    );
  }
  
  // Ordenar por fecha (más reciente primero)
  filteredActivities.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  // Calcular paginación
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedActivities = filteredActivities.slice(startIndex, endIndex);
  
  return {
    activities: paginatedActivities,
    totalCount: filteredActivities.length
  };
};

// Función para obtener una actividad por ID
export const getActivityById = (id) => {
  return mockActivities.find(activity => activity.id === id);
};

// Función para crear una nueva actividad
export const createActivity = (activityData) => {
  const newActivity = {
    id: mockActivities.length + 1,
    ...activityData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId: 1 // Usuario de ejemplo
  };
  
  mockActivities.unshift(newActivity);
  return newActivity;
};

// Función para actualizar una actividad
export const updateActivity = (id, activityData) => {
  const index = mockActivities.findIndex(activity => activity.id === id);
  
  if (index !== -1) {
    const updatedActivity = {
      ...mockActivities[index],
      ...activityData,
      updatedAt: new Date().toISOString()
    };
    
    mockActivities[index] = updatedActivity;
    return updatedActivity;
  }
  
  return null;
};

// Función para eliminar una actividad
export const deleteActivity = (id) => {
  const index = mockActivities.findIndex(activity => activity.id === id);
  
  if (index !== -1) {
    mockActivities.splice(index, 1);
    return true;
  }
  
  return false;
};
