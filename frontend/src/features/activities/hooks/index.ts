/**
 * @file Archivo de exportación para hooks de actividades
 * @description Este archivo exporta todos los hooks relacionados con actividades
 */

// Re-export hooks
export { default as useActivityTemplates } from './useActivityTemplates';
export { default as useFrequentData } from './useFrequentDataHook';
export { useActivityPresence } from './useActivityPresence';
export {
    useActivityStatsByType,
    useActivityStatsByStatus,
    useActivitySummaries
} from './useActivityStats';

// Re-export types
export type { ActivityTemplate } from './useActivityTemplates';

// Re-export activity hooks
export {
    useActivities,
    useActivity,
    useCreateActivity,
    useUpdateActivity,
    useDeleteActivity
} from './useActivitiesHooks';
