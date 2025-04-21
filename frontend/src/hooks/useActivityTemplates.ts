import { useState, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { ActivityFormData } from '@/features/activities/schemas/activitySchema';

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
    setIsLoading(false);
  }, []);

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
