import { useState, useCallback, useEffect } from 'react';
import { Activity } from '@/core/types/models';

interface FrequentData {
  persons: string[];
  roles: Record<string, string[]>;
  dependencies: Record<string, string[]>;
  agents: string[];
  descriptions: string[];
  situations: string[];
  results: string[];
}

interface UseFrequentDataReturn {
  frequentData: FrequentData;
  processActivities: (activities: Activity[]) => void;
  processActivity: (activity: Activity) => void;
  getRolesForPerson: (person: string) => string[];
  getDependenciesForPerson: (person: string) => string[];
  addPersonRoleRelation: (person: string, role: string) => void;
  addPersonDependencyRelation: (person: string, dependency: string) => void;
  addValue: (category: keyof FrequentData, value: string) => void;
}

// Clave para almacenar datos en localStorage
const STORAGE_KEY = 'bitacora_frequent_data';

// Función para cargar datos del localStorage
const loadFromStorage = (): FrequentData => {
  try {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (storedData) {
      return JSON.parse(storedData);
    }
  } catch (error) {
    console.error('Error loading frequent data from storage:', error);
  }
  
  // Valores por defecto si no hay datos o hay un error
  return {
    persons: [],
    roles: {},
    dependencies: {},
    agents: [],
    descriptions: [],
    situations: [],
    results: []
  };
};

// Función para guardar datos en localStorage
const saveToStorage = (data: FrequentData) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving frequent data to storage:', error);
  }
};

// Hook personalizado para gestionar datos frecuentes
const useFrequentData = (): UseFrequentDataReturn => {
  // Estado para almacenar datos frecuentes
  const [frequentData, setFrequentData] = useState<FrequentData>(loadFromStorage);
  
  // Guardar en localStorage cuando cambian los datos
  useEffect(() => {
    saveToStorage(frequentData);
  }, [frequentData]);
  
  // Función para añadir un valor único a un array
  const addUniqueValue = useCallback((array: string[], value: string): string[] => {
    if (!value || array.includes(value)) return array;
    return [value, ...array].slice(0, 50); // Limitar a 50 elementos
  }, []);
  
  // Procesar una actividad para extraer datos frecuentes
  const processActivity = useCallback((activity: Activity) => {
    setFrequentData(prev => {
      const newData = { ...prev };
      
      // Procesar persona
      if (activity.person) {
        newData.persons = addUniqueValue(newData.persons, activity.person);
        
        // Procesar rol para esta persona
        if (activity.role) {
          if (!newData.roles[activity.person]) {
            newData.roles[activity.person] = [];
          }
          newData.roles[activity.person] = addUniqueValue(
            newData.roles[activity.person],
            activity.role
          );
        }
        
        // Procesar dependencia para esta persona
        if (activity.dependency) {
          if (!newData.dependencies[activity.person]) {
            newData.dependencies[activity.person] = [];
          }
          newData.dependencies[activity.person] = addUniqueValue(
            newData.dependencies[activity.person],
            activity.dependency
          );
        }
      }
      
      // Procesar otros campos
      if (activity.agent) {
        newData.agents = addUniqueValue(newData.agents, activity.agent);
      }
      
      if (activity.description) {
        newData.descriptions = addUniqueValue(newData.descriptions, activity.description);
      }
      
      if (activity.situation) {
        newData.situations = addUniqueValue(newData.situations, activity.situation);
      }
      
      if (activity.result) {
        newData.results = addUniqueValue(newData.results, activity.result);
      }
      
      return newData;
    });
  }, [addUniqueValue]);
  
  // Procesar múltiples actividades
  const processActivities = useCallback((activities: Activity[]) => {
    activities.forEach(processActivity);
  }, [processActivity]);
  
  // Obtener roles para una persona específica
  const getRolesForPerson = useCallback((person: string): string[] => {
    if (!person || !frequentData.roles[person]) return [];
    return frequentData.roles[person];
  }, [frequentData.roles]);
  
  // Obtener dependencias para una persona específica
  const getDependenciesForPerson = useCallback((person: string): string[] => {
    if (!person || !frequentData.dependencies[person]) return [];
    return frequentData.dependencies[person];
  }, [frequentData.dependencies]);
  
  // Añadir relación persona-rol
  const addPersonRoleRelation = useCallback((person: string, role: string) => {
    if (!person || !role) return;
    
    setFrequentData(prev => {
      const newData = { ...prev };
      
      if (!newData.roles[person]) {
        newData.roles[person] = [];
      }
      
      newData.roles[person] = addUniqueValue(newData.roles[person], role);
      
      return newData;
    });
  }, [addUniqueValue]);
  
  // Añadir relación persona-dependencia
  const addPersonDependencyRelation = useCallback((person: string, dependency: string) => {
    if (!person || !dependency) return;
    
    setFrequentData(prev => {
      const newData = { ...prev };
      
      if (!newData.dependencies[person]) {
        newData.dependencies[person] = [];
      }
      
      newData.dependencies[person] = addUniqueValue(newData.dependencies[person], dependency);
      
      return newData;
    });
  }, [addUniqueValue]);
  
  // Añadir un valor a una categoría específica
  const addValue = useCallback((category: keyof FrequentData, value: string) => {
    if (!value) return;
    
    setFrequentData(prev => {
      const newData = { ...prev };
      
      if (Array.isArray(newData[category])) {
        (newData[category] as string[]) = addUniqueValue(newData[category] as string[], value);
      }
      
      return newData;
    });
  }, [addUniqueValue]);
  
  return {
    frequentData,
    processActivities,
    processActivity,
    getRolesForPerson,
    getDependenciesForPerson,
    addPersonRoleRelation,
    addPersonDependencyRelation,
    addValue
  };
};

export default useFrequentData;
