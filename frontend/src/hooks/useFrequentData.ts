import { useState, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Activity } from '@/types/models';

interface FrequentDataStore {
  persons: string[];
  roles: string[];
  dependencies: string[];
  agents: string[];
  // Mapa para relaciones contextuales
  personToRole: Record<string, string[]>;
  personToDependency: Record<string, string[]>;
}

const INITIAL_DATA: FrequentDataStore = {
  persons: [],
  roles: [],
  dependencies: [],
  agents: [],
  personToRole: {},
  personToDependency: {}
};

// Número máximo de elementos a almacenar por categoría
const MAX_ITEMS = 20;

/**
 * Hook para gestionar datos frecuentes utilizados en formularios
 */
export function useFrequentData() {
  const [frequentData, setFrequentData] = useLocalStorage<FrequentDataStore>(
    'frequent-data',
    INITIAL_DATA
  );

  /**
   * Añade un valor a una categoría específica
   */
  const addValue = (category: keyof FrequentDataStore, value: string) => {
    if (!value.trim()) return;

    setFrequentData(prev => {
      // Si es una categoría de array
      if (Array.isArray(prev[category])) {
        const array = prev[category] as string[];
        
        // Si el valor ya existe, no hacer nada
        if (array.includes(value)) return prev;
        
        // Añadir el valor al principio y limitar el tamaño
        const newArray = [value, ...array.filter(v => v !== value)].slice(0, MAX_ITEMS);
        
        return {
          ...prev,
          [category]: newArray
        };
      }
      
      return prev;
    });
  };

  /**
   * Añade una relación contextual entre persona y rol
   */
  const addPersonRoleRelation = (person: string, role: string) => {
    if (!person.trim() || !role.trim()) return;

    setFrequentData(prev => {
      const personRoles = prev.personToRole[person] || [];
      
      // Si la relación ya existe, no hacer nada
      if (personRoles.includes(role)) return prev;
      
      // Añadir el rol al principio y limitar el tamaño
      const newRoles = [role, ...personRoles.filter(r => r !== role)].slice(0, MAX_ITEMS);
      
      return {
        ...prev,
        personToRole: {
          ...prev.personToRole,
          [person]: newRoles
        }
      };
    });
  };

  /**
   * Añade una relación contextual entre persona y dependencia
   */
  const addPersonDependencyRelation = (person: string, dependency: string) => {
    if (!person.trim() || !dependency.trim()) return;

    setFrequentData(prev => {
      const personDependencies = prev.personToDependency[person] || [];
      
      // Si la relación ya existe, no hacer nada
      if (personDependencies.includes(dependency)) return prev;
      
      // Añadir la dependencia al principio y limitar el tamaño
      const newDependencies = [dependency, ...personDependencies.filter(d => d !== dependency)].slice(0, MAX_ITEMS);
      
      return {
        ...prev,
        personToDependency: {
          ...prev.personToDependency,
          [person]: newDependencies
        }
      };
    });
  };

  /**
   * Obtiene roles sugeridos para una persona específica
   */
  const getRolesForPerson = (person: string): string[] => {
    if (!person.trim()) return frequentData.roles;
    
    const personRoles = frequentData.personToRole[person] || [];
    
    // Combinar roles específicos de la persona con roles generales
    // Priorizando los específicos y eliminando duplicados
    return [
      ...personRoles,
      ...frequentData.roles.filter(role => !personRoles.includes(role))
    ];
  };

  /**
   * Obtiene dependencias sugeridas para una persona específica
   */
  const getDependenciesForPerson = (person: string): string[] => {
    if (!person.trim()) return frequentData.dependencies;
    
    const personDependencies = frequentData.personToDependency[person] || [];
    
    // Combinar dependencias específicas de la persona con dependencias generales
    // Priorizando las específicas y eliminando duplicados
    return [
      ...personDependencies,
      ...frequentData.dependencies.filter(dep => !personDependencies.includes(dep))
    ];
  };

  /**
   * Procesa una actividad para extraer y almacenar datos frecuentes
   */
  const processActivity = (activity: Activity) => {
    if (activity.person) {
      addValue('persons', activity.person);
    }
    
    if (activity.role) {
      addValue('roles', activity.role);
      
      if (activity.person) {
        addPersonRoleRelation(activity.person, activity.role);
      }
    }
    
    if (activity.dependency) {
      addValue('dependencies', activity.dependency);
      
      if (activity.person) {
        addPersonDependencyRelation(activity.person, activity.dependency);
      }
    }
    
    if (activity.agent) {
      addValue('agents', activity.agent);
    }
  };

  /**
   * Procesa un conjunto de actividades para extraer datos frecuentes
   */
  const processActivities = (activities: Activity[]) => {
    activities.forEach(processActivity);
  };

  /**
   * Limpia todos los datos frecuentes
   */
  const clearAllData = () => {
    setFrequentData(INITIAL_DATA);
  };

  return {
    frequentData,
    addValue,
    addPersonRoleRelation,
    addPersonDependencyRelation,
    getRolesForPerson,
    getDependenciesForPerson,
    processActivity,
    processActivities,
    clearAllData
  };
}

export default useFrequentData;
