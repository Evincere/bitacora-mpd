/**
 * @file priorityColors.ts
 * @description Definición de colores para prioridades de solicitudes
 * @version 1.0.0
 */

/**
 * Esquema de colores para prioridades
 */
export interface PriorityColorScheme {
  /** Color de fondo */
  background: string;
  /** Color de borde */
  border: string;
  /** Color de texto */
  text: string;
  /** Color al pasar el cursor */
  hover: string;
  /** Color de sombra */
  shadow: string;
}

/**
 * Mapa de colores para prioridades
 */
export type PriorityColorMap = {
  [key: string]: PriorityColorScheme;
} & {
  default: PriorityColorScheme;
};

// Colores para las prioridades
export const priorityColors: PriorityColorMap = {
  // Prioridad: Crítica (Rojo)
  CRITICAL: {
    background: "rgba(239, 68, 68, 0.25)",
    border: "rgba(239, 68, 68, 0.7)",
    text: "#991b1b",
    hover: "rgba(239, 68, 68, 0.35)",
    shadow: "rgba(239, 68, 68, 0.5)",
  },
  // Prioridad: Alta (Naranja)
  HIGH: {
    background: "rgba(249, 115, 22, 0.25)",
    border: "rgba(249, 115, 22, 0.7)",
    text: "#9a3412",
    hover: "rgba(249, 115, 22, 0.35)",
    shadow: "rgba(249, 115, 22, 0.5)",
  },
  // Prioridad: Media (Azul)
  MEDIUM: {
    background: "rgba(59, 130, 246, 0.25)",
    border: "rgba(59, 130, 246, 0.7)",
    text: "#1e40af",
    hover: "rgba(59, 130, 246, 0.35)",
    shadow: "rgba(59, 130, 246, 0.5)",
  },
  // Prioridad: Baja (Verde - Ahora con colores de APPROVED)
  LOW: {
    background: "rgba(46, 213, 115, 0.2)",
    border: "rgba(46, 213, 115, 0.6)",
    text: "#0e8c3c",
    hover: "rgba(46, 213, 115, 0.3)",
    shadow: "rgba(46, 213, 115, 0.4)",
  },
  // Prioridad: Trivial (Gris)
  TRIVIAL: {
    background: "rgba(107, 114, 128, 0.25)",
    border: "rgba(107, 114, 128, 0.7)",
    text: "#374151",
    hover: "rgba(107, 114, 128, 0.35)",
    shadow: "rgba(107, 114, 128, 0.5)",
  },
  // Prioridad: Default (Gris)
  default: {
    background: "rgba(156, 163, 175, 0.25)",
    border: "rgba(156, 163, 175, 0.7)",
    text: "#4b5563",
    hover: "rgba(156, 163, 175, 0.35)",
    shadow: "rgba(156, 163, 175, 0.5)",
  },
};

// Función para normalizar el nombre de la prioridad
export const normalizePriority = (priority: string | undefined): string => {
  if (!priority) return 'default';

  // Convertir a mayúsculas
  const normalizedPriority = priority.toUpperCase();

  // Verificar si existe en el mapa de colores
  if (priorityColors[normalizedPriority]) {
    return normalizedPriority;
  }

  return 'default';
};
