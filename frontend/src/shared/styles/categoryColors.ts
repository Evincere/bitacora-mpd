/**
 * @file categoryColors.ts
 * @description Definición de colores para categorías de solicitudes
 * @version 1.0.0
 */

/**
 * Esquema de colores para categorías
 */
export interface CategoryColorScheme {
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
 * Mapa de colores para categorías
 */
export type CategoryColorMap = {
  [key: string]: CategoryColorScheme;
} & {
  default: CategoryColorScheme;
};

// Colores para las categorías
export const categoryColors: CategoryColorMap = {
  // Categoría: General (Gris azulado)
  GENERAL: {
    background: "rgba(108, 117, 125, 0.2)",
    border: "rgba(108, 117, 125, 0.6)",
    text: "#4a5561",
    hover: "rgba(108, 117, 125, 0.3)",
    shadow: "rgba(108, 117, 125, 0.4)",
  },
  // Categoría: Administrativa (Azul)
  ADMINISTRATIVA: {
    background: "rgba(59, 130, 246, 0.2)",
    border: "rgba(59, 130, 246, 0.6)",
    text: "#1e40af",
    hover: "rgba(59, 130, 246, 0.3)",
    shadow: "rgba(59, 130, 246, 0.4)",
  },
  // Categoría: Legal (Púrpura)
  LEGAL: {
    background: "rgba(139, 92, 246, 0.2)",
    border: "rgba(139, 92, 246, 0.6)",
    text: "#5b21b6",
    hover: "rgba(139, 92, 246, 0.3)",
    shadow: "rgba(139, 92, 246, 0.4)",
  },
  // Categoría: Técnica (Verde)
  TECNICA: {
    background: "rgba(16, 185, 129, 0.2)",
    border: "rgba(16, 185, 129, 0.6)",
    text: "#065f46",
    hover: "rgba(16, 185, 129, 0.3)",
    shadow: "rgba(16, 185, 129, 0.4)",
  },
  // Categoría: Financiera (Ámbar)
  FINANCIERA: {
    background: "rgba(245, 158, 11, 0.2)",
    border: "rgba(245, 158, 11, 0.6)",
    text: "#92400e",
    hover: "rgba(245, 158, 11, 0.3)",
    shadow: "rgba(245, 158, 11, 0.4)",
  },
  // Categoría: Recursos Humanos (Rosa)
  RECURSOS_HUMANOS: {
    background: "rgba(236, 72, 153, 0.2)",
    border: "rgba(236, 72, 153, 0.6)",
    text: "#9d174d",
    hover: "rgba(236, 72, 153, 0.3)",
    shadow: "rgba(236, 72, 153, 0.4)",
  },
  // Categoría: Urgente (Rojo)
  URGENTE: {
    background: "rgba(239, 68, 68, 0.2)",
    border: "rgba(239, 68, 68, 0.6)",
    text: "#991b1b",
    hover: "rgba(239, 68, 68, 0.3)",
    shadow: "rgba(239, 68, 68, 0.4)",
  },
  // Categoría: Mantenimiento (Naranja)
  MANTENIMIENTO: {
    background: "rgba(249, 115, 22, 0.2)",
    border: "rgba(249, 115, 22, 0.6)",
    text: "#9a3412",
    hover: "rgba(249, 115, 22, 0.3)",
    shadow: "rgba(249, 115, 22, 0.4)",
  },
  // Categoría: Desarrollo (Azul)
  DESARROLLO: {
    background: "rgba(37, 99, 235, 0.2)",
    border: "rgba(37, 99, 235, 0.6)",
    text: "#1e3a8a",
    hover: "rgba(37, 99, 235, 0.3)",
    shadow: "rgba(37, 99, 235, 0.4)",
  },
  // Categoría: Default (Gris)
  default: {
    background: "rgba(156, 163, 175, 0.2)",
    border: "rgba(156, 163, 175, 0.6)",
    text: "#4b5563",
    hover: "rgba(156, 163, 175, 0.3)",
    shadow: "rgba(156, 163, 175, 0.4)",
  },
};

// Función para normalizar el nombre de la categoría
export const normalizeCategory = (category: string | undefined): string => {
  if (!category) return 'default';
  
  // Convertir a mayúsculas y eliminar espacios
  const normalizedCategory = category.toUpperCase().replace(/\s+/g, '_');
  
  // Verificar si existe en el mapa de colores
  if (categoryColors[normalizedCategory]) {
    return normalizedCategory;
  }
  
  return 'default';
};
