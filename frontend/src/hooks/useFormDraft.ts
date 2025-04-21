import { useState, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

interface DraftOptions {
  key: string;
  expirationHours?: number;
}

/**
 * Hook para manejar el autoguardado de borradores de formularios
 * @param initialData Datos iniciales del formulario
 * @param options Opciones de configuración
 * @returns Objeto con los datos del borrador y funciones para gestionarlo
 */
export function useFormDraft<T>(initialData: T, options: DraftOptions) {
  const { key, expirationHours = 24 } = options;
  
  // Estructura para almacenar el borrador con metadatos
  interface DraftData {
    data: T;
    timestamp: number;
    lastModified: number;
  }
  
  // Obtener todos los borradores almacenados
  const [allDrafts, setAllDrafts] = useLocalStorage<Record<string, DraftData>>('form-drafts', {});
  
  // Estado local para el borrador actual
  const [draftData, setDraftData] = useState<T>(initialData);
  const [hasDraft, setHasDraft] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  // Cargar borrador al iniciar
  useEffect(() => {
    const storedDraft = allDrafts[key];
    
    if (storedDraft) {
      const now = Date.now();
      const expirationTime = expirationHours * 60 * 60 * 1000;
      
      // Verificar si el borrador ha expirado
      if (now - storedDraft.timestamp < expirationTime) {
        setDraftData(storedDraft.data);
        setHasDraft(true);
        setLastSaved(new Date(storedDraft.lastModified));
      } else {
        // Eliminar borrador expirado
        const updatedDrafts = { ...allDrafts };
        delete updatedDrafts[key];
        setAllDrafts(updatedDrafts);
      }
    }
  }, [key, allDrafts, expirationHours, setAllDrafts]);
  
  // Función para guardar el borrador
  const saveDraft = (data: T) => {
    const now = Date.now();
    const draftEntry: DraftData = {
      data,
      timestamp: allDrafts[key]?.timestamp || now,
      lastModified: now
    };
    
    setAllDrafts(prev => ({
      ...prev,
      [key]: draftEntry
    }));
    
    setDraftData(data);
    setHasDraft(true);
    setLastSaved(new Date(now));
  };
  
  // Función para eliminar el borrador
  const discardDraft = () => {
    const updatedDrafts = { ...allDrafts };
    delete updatedDrafts[key];
    
    setAllDrafts(updatedDrafts);
    setDraftData(initialData);
    setHasDraft(false);
    setLastSaved(null);
  };
  
  // Función para obtener todos los borradores
  const getAllDrafts = () => {
    return Object.entries(allDrafts).map(([draftKey, draft]) => ({
      key: draftKey,
      data: draft.data,
      timestamp: new Date(draft.timestamp),
      lastModified: new Date(draft.lastModified)
    }));
  };
  
  // Limpiar borradores expirados
  useEffect(() => {
    const cleanupExpiredDrafts = () => {
      const now = Date.now();
      const expirationTime = expirationHours * 60 * 60 * 1000;
      let hasChanges = false;
      
      const updatedDrafts = { ...allDrafts };
      
      Object.entries(updatedDrafts).forEach(([draftKey, draft]) => {
        if (now - draft.timestamp > expirationTime) {
          delete updatedDrafts[draftKey];
          hasChanges = true;
        }
      });
      
      if (hasChanges) {
        setAllDrafts(updatedDrafts);
      }
    };
    
    cleanupExpiredDrafts();
    
    // Limpiar borradores expirados cada hora
    const interval = setInterval(cleanupExpiredDrafts, 60 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [allDrafts, expirationHours, setAllDrafts]);
  
  return {
    data: draftData,
    hasDraft,
    lastSaved,
    saveDraft,
    discardDraft,
    getAllDrafts
  };
}

export default useFormDraft;
