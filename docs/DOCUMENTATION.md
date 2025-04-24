# Convenciones de Documentación

Este documento describe las convenciones de documentación utilizadas en el proyecto Bitácora.

## Comentarios JSDoc

Utilizamos JSDoc para documentar componentes, funciones, hooks y tipos en TypeScript/JavaScript. Esto proporciona información útil para los desarrolladores y mejora la experiencia de desarrollo con autocompletado e información contextual en el IDE.

### Componentes React

```typescript
/**
 * Componente que muestra un formulario para crear o editar una actividad.
 * 
 * @component
 * @example
 * ```tsx
 * <ActivityForm 
 *   activity={activityData} 
 *   onClose={() => setShowForm(false)} 
 * />
 * ```
 */
const ActivityForm: React.FC<ActivityFormProps> = ({ activity, onClose }) => {
  // Implementación...
};
```

### Funciones y Hooks

```typescript
/**
 * Hook personalizado para gestionar actividades.
 * 
 * @param {ActivityFilters} filters - Filtros para las actividades
 * @returns {UseActivitiesResult} Resultado con datos, estado de carga y funciones
 * 
 * @example
 * ```tsx
 * const { data, isLoading, error } = useActivities({ status: 'PENDIENTE' });
 * ```
 */
export function useActivities(filters: ActivityFilters): UseActivitiesResult {
  // Implementación...
}
```

### Interfaces y Tipos

```typescript
/**
 * Propiedades para el componente ActivityForm.
 * 
 * @interface ActivityFormProps
 * @property {Activity} [activity] - Actividad a editar (opcional, si no se proporciona se crea una nueva)
 * @property {() => void} onClose - Función para cerrar el formulario
 */
export interface ActivityFormProps {
  activity?: Activity;
  onClose: () => void;
}
```

### Enumeraciones

```typescript
/**
 * Estados posibles de una actividad.
 * 
 * @enum {string}
 */
export enum ActivityStatus {
  /** Actividad pendiente de iniciar */
  PENDIENTE = 'PENDIENTE',
  /** Actividad en curso */
  EN_PROGRESO = 'EN_PROGRESO',
  /** Actividad finalizada con éxito */
  COMPLETADA = 'COMPLETADA',
  /** Actividad cancelada */
  CANCELADA = 'CANCELADA',
  /** Actividad archivada */
  ARCHIVADA = 'ARCHIVADA'
}
```

## Documentación de Archivos

Cada archivo debe incluir un comentario al inicio que describa su propósito:

```typescript
/**
 * @file Componente de formulario para crear y editar actividades.
 * @module features/activities/components/ActivityForm
 */
```

## Documentación de Módulos

Los módulos (carpetas) deben incluir un archivo README.md que describa su propósito, componentes principales y cómo se utilizan:

```markdown
# Módulo de Actividades

Este módulo contiene los componentes, hooks y utilidades relacionados con la gestión de actividades.

## Componentes Principales

- `ActivityForm`: Formulario para crear y editar actividades
- `ActivityList`: Lista de actividades con filtros y paginación
- `ActivityDetail`: Visualización detallada de una actividad

## Hooks

- `useActivities`: Hook para obtener y filtrar actividades
- `useActivity`: Hook para obtener una actividad específica
- `useCreateActivity`: Hook para crear una nueva actividad
- `useUpdateActivity`: Hook para actualizar una actividad existente

## Uso

```tsx
import { ActivityList } from '@/features/activities/components';
import { useActivities } from '@/features/activities/hooks';

const MyComponent = () => {
  const { data, isLoading } = useActivities({ status: 'PENDIENTE' });
  
  return (
    <div>
      <h1>Actividades Pendientes</h1>
      {isLoading ? <Loader /> : <ActivityList activities={data} />}
    </div>
  );
};
```
```

## Convenciones Adicionales

### Documentación de Parámetros

- Utilizar `@param` para documentar los parámetros de funciones y métodos
- Incluir el tipo entre llaves `{}`
- Añadir una descripción clara del parámetro

### Documentación de Retorno

- Utilizar `@returns` para documentar el valor de retorno
- Incluir el tipo entre llaves `{}`
- Añadir una descripción clara del valor de retorno

### Ejemplos

- Incluir ejemplos de uso con `@example`
- Los ejemplos deben ser concisos pero ilustrativos
- Utilizar bloques de código con la sintaxis adecuada

### Deprecación

- Marcar funciones o componentes obsoletos con `@deprecated`
- Incluir información sobre alternativas o razones de la deprecación

```typescript
/**
 * @deprecated Usar useActivities en su lugar
 */
export function getActivities() {
  // Implementación...
}
```

## Herramientas

Para facilitar la documentación, se recomienda utilizar extensiones de VSCode como:

- "Document This" para generar automáticamente comentarios JSDoc
- "Better Comments" para resaltar comentarios importantes
- "ESLint" con reglas para validar la documentación

## Verificación

La documentación se verifica como parte del proceso de CI/CD:

- ESLint incluye reglas para validar la presencia y formato de los comentarios JSDoc
- Se generan advertencias para componentes, funciones y tipos sin documentación adecuada
