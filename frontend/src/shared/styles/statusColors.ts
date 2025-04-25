import { ActivityStatus, ActivityType } from '@/core/types/models';

/**
 * @file statusColors.ts
 * @description Definición de colores para estados y tipos de actividades
 * @version 1.0.0
 */

/**
 * Esquema de colores para estados y tipos de actividades
 */
export interface ColorScheme {
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
 * Mapa de colores para estados de actividades
 * Incluye tanto los valores de la enumeración ActivityStatus como strings para compatibilidad
 */
export type StatusColorMap = {
  [key in ActivityStatus | string]: ColorScheme;
} & {
  default: ColorScheme;
};

/**
 * Mapa de colores para tipos de actividades
 * Incluye tanto los valores de la enumeración ActivityType como strings para compatibilidad
 */
export type TypeColorMap = {
  [key in ActivityType | string]: ColorScheme;
};

// Colores para los estados de actividades
export const statusColors: StatusColorMap = {
  // Estado: Completado (Verde)
  Completado: {
    background: "rgba(46, 213, 115, 0.15)",
    border: "rgba(46, 213, 115, 0.4)",
    text: "#2ed573",
    hover: "rgba(46, 213, 115, 0.25)",
    shadow: "rgba(46, 213, 115, 0.3)",
  },
  // Estado: En progreso (Azul/Violeta)
  "En progreso": {
    background: "rgba(85, 85, 255, 0.15)",
    border: "rgba(85, 85, 255, 0.4)",
    text: "#5555ff",
    hover: "rgba(85, 85, 255, 0.25)",
    shadow: "rgba(85, 85, 255, 0.3)",
  },
  // Estado: Pendiente (Amarillo/Naranja)
  Pendiente: {
    background: "rgba(255, 165, 2, 0.15)",
    border: "rgba(255, 165, 2, 0.4)",
    text: "#ffa502",
    hover: "rgba(255, 165, 2, 0.25)",
    shadow: "rgba(255, 165, 2, 0.3)",
  },
  // Estado: Cancelado (Rojo)
  Cancelado: {
    background: "rgba(255, 71, 87, 0.15)",
    border: "rgba(255, 71, 87, 0.4)",
    text: "#ff4757",
    hover: "rgba(255, 71, 87, 0.25)",
    shadow: "rgba(255, 71, 87, 0.3)",
  },
  // Estado: Archivado (Gris)
  Archivado: {
    background: "rgba(108, 117, 125, 0.15)",
    border: "rgba(108, 117, 125, 0.4)",
    text: "#6c757d",
    hover: "rgba(108, 117, 125, 0.25)",
    shadow: "rgba(108, 117, 125, 0.3)",
  },
  // Estado: Default
  default: {
    background: "rgba(170, 170, 170, 0.15)",
    border: "rgba(170, 170, 170, 0.4)",
    text: "#aaaaaa",
    hover: "rgba(170, 170, 170, 0.25)",
    shadow: "rgba(170, 170, 170, 0.3)",
  },
  // Alias para compatibilidad
  completado: {
    background: "rgba(46, 213, 115, 0.15)",
    border: "rgba(46, 213, 115, 0.4)",
    text: "#2ed573",
    hover: "rgba(46, 213, 115, 0.25)",
    shadow: "rgba(46, 213, 115, 0.3)",
  },
  enProgreso: {
    background: "rgba(85, 85, 255, 0.15)",
    border: "rgba(85, 85, 255, 0.4)",
    text: "#5555ff",
    hover: "rgba(85, 85, 255, 0.25)",
    shadow: "rgba(85, 85, 255, 0.3)",
  },
  pendiente: {
    background: "rgba(255, 165, 2, 0.15)",
    border: "rgba(255, 165, 2, 0.4)",
    text: "#ffa502",
    hover: "rgba(255, 165, 2, 0.25)",
    shadow: "rgba(255, 165, 2, 0.3)",
  },
  cancelado: {
    background: "rgba(255, 71, 87, 0.15)",
    border: "rgba(255, 71, 87, 0.4)",
    text: "#ff4757",
    hover: "rgba(255, 71, 87, 0.25)",
    shadow: "rgba(255, 71, 87, 0.3)",
  },
  archivado: {
    background: "rgba(108, 117, 125, 0.15)",
    border: "rgba(108, 117, 125, 0.4)",
    text: "#6c757d",
    hover: "rgba(108, 117, 125, 0.25)",
    shadow: "rgba(108, 117, 125, 0.3)",
  },
  // Valores del backend (enumeraciones)
  COMPLETADA: {
    background: "rgba(46, 213, 115, 0.15)",
    border: "rgba(46, 213, 115, 0.4)",
    text: "#2ed573",
    hover: "rgba(46, 213, 115, 0.25)",
    shadow: "rgba(46, 213, 115, 0.3)",
  },
  EN_PROGRESO: {
    background: "rgba(85, 85, 255, 0.15)",
    border: "rgba(85, 85, 255, 0.4)",
    text: "#5555ff",
    hover: "rgba(85, 85, 255, 0.25)",
    shadow: "rgba(85, 85, 255, 0.3)",
  },
  PENDIENTE: {
    background: "rgba(255, 165, 2, 0.15)",
    border: "rgba(255, 165, 2, 0.4)",
    text: "#ffa502",
    hover: "rgba(255, 165, 2, 0.25)",
    shadow: "rgba(255, 165, 2, 0.3)",
  },
  CANCELADA: {
    background: "rgba(255, 71, 87, 0.15)",
    border: "rgba(255, 71, 87, 0.4)",
    text: "#ff4757",
    hover: "rgba(255, 71, 87, 0.25)",
    shadow: "rgba(255, 71, 87, 0.3)",
  },
  ARCHIVADA: {
    background: "rgba(108, 117, 125, 0.15)",
    border: "rgba(108, 117, 125, 0.4)",
    text: "#6c757d",
    hover: "rgba(108, 117, 125, 0.25)",
    shadow: "rgba(108, 117, 125, 0.3)",
  },
};

// Colores para los tipos de actividades
export const typeColors: TypeColorMap = {
  // Tipo: Atención Personal (Violeta)
  "Atención Personal": {
    background: "rgba(108, 92, 231, 0.15)",
    border: "rgba(108, 92, 231, 0.4)",
    text: "#6c5ce7",
    hover: "rgba(108, 92, 231, 0.25)",
    shadow: "rgba(108, 92, 231, 0.3)",
  },
  // Tipo: Atención Telefónica (Azul claro)
  "Atención Telefónica": {
    background: "rgba(0, 184, 212, 0.15)",
    border: "rgba(0, 184, 212, 0.4)",
    text: "#00b8d4",
    hover: "rgba(0, 184, 212, 0.25)",
    shadow: "rgba(0, 184, 212, 0.3)",
  },
  // Tipo: Concursos (Rosa)
  Concursos: {
    background: "rgba(255, 51, 102, 0.15)",
    border: "rgba(255, 51, 102, 0.4)",
    text: "#ff3366",
    hover: "rgba(255, 51, 102, 0.25)",
    shadow: "rgba(255, 51, 102, 0.3)",
  },
  // Tipo: Solicitud de info (Verde)
  "Solicitud de info": {
    background: "rgba(46, 213, 115, 0.15)",
    border: "rgba(46, 213, 115, 0.4)",
    text: "#2ed573",
    hover: "rgba(46, 213, 115, 0.25)",
    shadow: "rgba(46, 213, 115, 0.3)",
  },
  // Tipo: Mails (Naranja)
  Mails: {
    background: "rgba(255, 153, 0, 0.15)",
    border: "rgba(255, 153, 0, 0.4)",
    text: "#ff9900",
    hover: "rgba(255, 153, 0, 0.25)",
    shadow: "rgba(255, 153, 0, 0.3)",
  },
  // Tipo: Multitareas (Púrpura)
  Multitareas: {
    background: "rgba(156, 39, 176, 0.15)",
    border: "rgba(156, 39, 176, 0.4)",
    text: "#9c27b0",
    hover: "rgba(156, 39, 176, 0.25)",
    shadow: "rgba(156, 39, 176, 0.3)",
  },
  // Tipo: Tomo Nota (Azul)
  "Tomo Nota": {
    background: "rgba(3, 169, 244, 0.15)",
    border: "rgba(3, 169, 244, 0.4)",
    text: "#03a9f4",
    hover: "rgba(3, 169, 244, 0.25)",
    shadow: "rgba(3, 169, 244, 0.3)",
  },
  // Tipo: Reunión (Azul turquesa)
  Reunión: {
    background: "rgba(0, 206, 201, 0.15)",
    border: "rgba(0, 206, 201, 0.4)",
    text: "#00cec9",
    hover: "rgba(0, 206, 201, 0.25)",
    shadow: "rgba(0, 206, 201, 0.3)",
  },
  // Tipo: Otro (Azul grisáceo)
  "OTRO_UI": {
    background: "rgba(116, 125, 140, 0.15)",
    border: "rgba(116, 125, 140, 0.4)",
    text: "#747d8c",
    hover: "rgba(116, 125, 140, 0.25)",
    shadow: "rgba(116, 125, 140, 0.3)",
  },
  // Alias para compatibilidad
  atencionPersonal: {
    background: "rgba(108, 92, 231, 0.15)",
    border: "rgba(108, 92, 231, 0.4)",
    text: "#6c5ce7",
    hover: "rgba(108, 92, 231, 0.25)",
    shadow: "rgba(108, 92, 231, 0.3)",
  },
  atencionTelefonica: {
    background: "rgba(0, 184, 212, 0.15)",
    border: "rgba(0, 184, 212, 0.4)",
    text: "#00b8d4",
    hover: "rgba(0, 184, 212, 0.25)",
    shadow: "rgba(0, 184, 212, 0.3)",
  },
  concursos: {
    background: "rgba(255, 51, 102, 0.15)",
    border: "rgba(255, 51, 102, 0.4)",
    text: "#ff3366",
    hover: "rgba(255, 51, 102, 0.25)",
    shadow: "rgba(255, 51, 102, 0.3)",
  },
  solicitudInfo: {
    background: "rgba(46, 213, 115, 0.15)",
    border: "rgba(46, 213, 115, 0.4)",
    text: "#2ed573",
    hover: "rgba(46, 213, 115, 0.25)",
    shadow: "rgba(46, 213, 115, 0.3)",
  },
  mails: {
    background: "rgba(255, 153, 0, 0.15)",
    border: "rgba(255, 153, 0, 0.4)",
    text: "#ff9900",
    hover: "rgba(255, 153, 0, 0.25)",
    shadow: "rgba(255, 153, 0, 0.3)",
  },
  multitareas: {
    background: "rgba(156, 39, 176, 0.15)",
    border: "rgba(156, 39, 176, 0.4)",
    text: "#9c27b0",
    hover: "rgba(156, 39, 176, 0.25)",
    shadow: "rgba(156, 39, 176, 0.3)",
  },
  tomoNota: {
    background: "rgba(3, 169, 244, 0.15)",
    border: "rgba(3, 169, 244, 0.4)",
    text: "#03a9f4",
    hover: "rgba(3, 169, 244, 0.25)",
    shadow: "rgba(3, 169, 244, 0.3)",
  },
  otro: {
    background: "rgba(52, 58, 64, 0.15)",
    border: "rgba(52, 58, 64, 0.4)",
    text: "#343a40",
    hover: "rgba(52, 58, 64, 0.25)",
    shadow: "rgba(52, 58, 64, 0.3)",
  },
  // Valores del backend (enumeraciones)
  AUDIENCIA: {
    background: "rgba(108, 92, 231, 0.15)",
    border: "rgba(108, 92, 231, 0.4)",
    text: "#6c5ce7",
    hover: "rgba(108, 92, 231, 0.25)",
    shadow: "rgba(108, 92, 231, 0.3)",
  },
  REUNION: {
    background: "rgba(0, 206, 201, 0.15)",
    border: "rgba(0, 206, 201, 0.4)",
    text: "#00cec9",
    hover: "rgba(0, 206, 201, 0.25)",
    shadow: "rgba(0, 206, 201, 0.3)",
  },
  ENTREVISTA: {
    background: "rgba(108, 92, 231, 0.15)",
    border: "rgba(108, 92, 231, 0.4)",
    text: "#6c5ce7",
    hover: "rgba(108, 92, 231, 0.25)",
    shadow: "rgba(108, 92, 231, 0.3)",
  },
  INVESTIGACION: {
    background: "rgba(156, 39, 176, 0.15)",
    border: "rgba(156, 39, 176, 0.4)",
    text: "#9c27b0",
    hover: "rgba(156, 39, 176, 0.25)",
    shadow: "rgba(156, 39, 176, 0.3)",
  },
  DICTAMEN: {
    background: "rgba(46, 213, 115, 0.15)",
    border: "rgba(46, 213, 115, 0.4)",
    text: "#2ed573",
    hover: "rgba(46, 213, 115, 0.25)",
    shadow: "rgba(46, 213, 115, 0.3)",
  },
  INFORME: {
    background: "rgba(3, 169, 244, 0.15)",
    border: "rgba(3, 169, 244, 0.4)",
    text: "#03a9f4",
    hover: "rgba(3, 169, 244, 0.25)",
    shadow: "rgba(3, 169, 244, 0.3)",
  },
  OTRO: {
    background: "rgba(116, 125, 140, 0.15)",
    border: "rgba(116, 125, 140, 0.4)",
    text: "#747d8c",
    hover: "rgba(116, 125, 140, 0.25)",
    shadow: "rgba(116, 125, 140, 0.3)",
  },
};
