import { useState, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { ActivityFormData } from '@/features/activities/schemas/activitySchema';
import { ActivityType, ActivityStatus } from '@/core/types/models';

export interface ActivityTemplate {
  id: string;
  name: string;
  description: string;
  data: Omit<ActivityFormData, 'date' | 'time'>;
  createdAt: number;
  updatedAt: number;
}

/**
 * Hook para gestionar plantillas de actividades
 */
export function useActivityTemplates() {
  const [templates, setTemplates] = useLocalStorage<ActivityTemplate[]>('activity-templates', []);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar plantillas al iniciar
  useEffect(() => {
    // Asegurarse de que templates sea siempre un array
    if (!Array.isArray(templates)) {
      console.warn('Templates no es un array, inicializando como array vacío');
      setTemplates([]);
    }

    // Crear una plantilla de ejemplo si no hay ninguna
    if (Array.isArray(templates) && templates.length === 0) {
      console.log('Creando plantilla de ejemplo');
      const exampleTemplate: ActivityTemplate = {
        id: 'example-template',
        name: 'Plantilla de ejemplo',
        description: 'Esta es una plantilla de ejemplo para mostrar la funcionalidad',
        data: {
          type: ActivityType.REUNION,
          description: 'Reunión de seguimiento de proyecto',
          person: 'Juan Pérez',
          role: 'Coordinador',
          dependency: 'Dirección General',
          situation: 'Seguimiento de avances del proyecto',
          result: 'Se definieron próximos pasos',
          status: ActivityStatus.COMPLETADA,
          comments: 'Reunión productiva con buenos resultados',
          agent: 'María Gómez'
        },
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      setTemplates([exampleTemplate]);
    }

    setIsLoading(false);
  }, [templates, setTemplates]);

  /**
   * Guardar una nueva plantilla
   */
  const saveTemplate = (name: string, description: string, data: ActivityFormData) => {
    const now = Date.now();

    // Omitir fecha y hora de la plantilla
    const { date, time, ...templateData } = data;

    const newTemplate: ActivityTemplate = {
      id: `template-${now}`,
      name,
      description,
      data: templateData,
      createdAt: now,
      updatedAt: now
    };

    setTemplates(prev => [...prev, newTemplate]);
    return newTemplate;
  };

  /**
   * Actualizar una plantilla existente
   */
  const updateTemplate = (id: string, updates: Partial<ActivityTemplate>) => {
    setTemplates(prev =>
      prev.map(template =>
        template.id === id
          ? {
            ...template,
            ...updates,
            updatedAt: Date.now()
          }
          : template
      )
    );
  };

  /**
   * Eliminar una plantilla
   */
  const deleteTemplate = (id: string) => {
    setTemplates(prev => prev.filter(template => template.id !== id));
  };

  /**
   * Obtener una plantilla por ID
   */
  const getTemplate = (id: string) => {
    return templates.find(template => template.id === id);
  };

  return {
    templates,
    isLoading,
    saveTemplate,
    updateTemplate,
    deleteTemplate,
    getTemplate
  };
}

export default useActivityTemplates;
