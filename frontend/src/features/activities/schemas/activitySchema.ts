import { z } from 'zod';
import { ActivityType, ActivityStatus } from '@/core/types/models';

/**
 * Esquema de validación para la creación de actividades
 */
export const activityCreateSchema = z.object({
  date: z.string()
    .min(1, 'La fecha es obligatoria')
    .refine(val => {
      try {
        const date = new Date(val);
        return !isNaN(date.getTime());
      } catch {
        return false;
      }
    }, { message: 'La fecha no tiene un formato válido' }),

  time: z.string()
    .min(1, 'La hora es obligatoria')
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'El formato de hora debe ser HH:MM'),

  type: z.nativeEnum(ActivityType, {
    errorMap: () => ({ message: 'Seleccione un tipo válido de actividad' })
  }),

  description: z.string()
    .min(5, 'La descripción debe tener al menos 5 caracteres')
    .max(1000, 'La descripción no puede exceder los 1000 caracteres')
    .refine(val => val.trim().length > 0, { message: 'La descripción no puede estar vacía' }),

  person: z.string()
    .optional()
    .transform(val => val || ''),

  role: z.string()
    .optional()
    .transform(val => val || ''),

  dependency: z.string()
    .optional()
    .transform(val => val || ''),

  situation: z.string()
    .optional()
    .transform(val => val || ''),

  result: z.string()
    .optional()
    .transform(val => val || ''),

  status: z.nativeEnum(ActivityStatus, {
    errorMap: () => ({ message: 'Seleccione un estado válido para la actividad' })
  }),

  comments: z.string()
    .optional()
    .transform(val => val || ''),

  agent: z.string()
    .optional()
    .transform(val => val || ''),
});

/**
 * Esquema de validación para la actualización de actividades
 */
export const activityUpdateSchema = activityCreateSchema.partial();

/**
 * Tipo para los datos del formulario de creación
 */
export type ActivityFormData = z.infer<typeof activityCreateSchema>;

/**
 * Tipo para los datos del formulario de actualización
 */
export type ActivityUpdateFormData = z.infer<typeof activityUpdateSchema>;
