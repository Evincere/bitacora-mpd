import { DefaultTheme } from 'styled-components';

/**
 * Tema claro para la aplicación
 */
export const lightTheme: DefaultTheme = {
  // Colores principales
  background: '#F5F5F7',
  backgroundSecondary: '#FFFFFF',
  backgroundTertiary: '#F0F0F5',
  backgroundHover: '#EAEAEE',
  backgroundAlt: '#E5E5EA',
  backgroundDisabled: '#F5F5F7',
  backgroundSuccess: '#4CD96420',
  backgroundError: '#FF3B3020',
  text: '#1E1E24',
  textSecondary: '#666666',
  textTertiary: '#999999',
  textPrimary: '#6C5CE7',
  textDisabled: '#AAAAAA',

  // Colores de acento
  primary: '#6C5CE7',
  primaryHover: '#8A7AFF',
  primaryLight: '#8A7AFF',
  primaryDark: '#5849C0',
  secondary: '#00B8D4',
  secondaryHover: '#00D8F4',
  accent: '#FF3366',
  accentHover: '#FF5386',
  accentLight: '#FF5386',
  success: '#4CD964',
  successHover: '#6CE984',
  successLight: '#6CE984',
  warning: '#FFCC00',
  warningHover: '#FFDC20',
  warningLight: '#FFDC20',
  error: '#FF3B30',
  errorHover: '#FF5B50',
  errorLight: '#FF5B50',
  errorDark: '#D01B10',
  danger: '#FF3B30',
  dangerLight: '#FF6B60',
  dangerHover: '#FF5B50',
  info: '#0A84FF',
  infoHover: '#2A94FF',
  infoLight: '#2A94FF',

  // Elementos de UI
  cardBackground: '#FFFFFF',
  inputBackground: '#FFFFFF',
  buttonBackground: '#6C5CE7',
  buttonHover: '#8A7AFF',

  // Bordes y sombras
  border: '#E5E5EA',
  borderColor: '#E5E5EA',
  shadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
  shadowHover: '0 6px 10px rgba(0, 0, 0, 0.075)',

  // Scrollbar
  scrollbarTrack: '#F5F5F7',
  scrollbarThumb: '#D1D1D6',
  scrollbarThumbHover: '#C7C7CC',

  // Estados
  online: '#4CD964',
  offline: '#AAAAAA',

  // Gráficos
  chartColors: ['#6C5CE7', '#00B8D4', '#FF3366', '#4CD964', '#FFCC00'],

  // Colores (para compatibilidad con componentes antiguos)
  colors: {
    background: '#F5F5F7',
    backgroundAlt: '#E5E5EA',
    backgroundHover: '#EAEAEE',
    backgroundSecondary: '#FFFFFF',
    backgroundTertiary: '#F0F0F5',
    backgroundDisabled: '#F5F5F7',
    text: '#1E1E24',
    textSecondary: '#666666',
    textTertiary: '#999999',
    textPrimary: '#6C5CE7',
    primary: '#6C5CE7',
    primaryLight: '#8A7AFF',
    primaryDark: '#5849C0',
    secondary: '#00B8D4',
    secondaryLight: '#00D8F4',
    tertiary: '#FF3366',
    tertiaryLight: '#FF5386',
    success: '#4CD964',
    successLight: '#6CE984',
    warning: '#FFCC00',
    warningLight: '#FFDC20',
    error: '#FF3B30',
    errorLight: '#FF5B50',
    info: '#0A84FF',
    infoLight: '#2A94FF',
    border: '#E5E5EA',
    borderLight: '#F0F0F5'
  },

  // Skeleton
  skeletonBackground: '#F0F0F5',
  skeletonHighlight: '#FFFFFF'
};

/**
 * Tema oscuro para la aplicación
 */
export const darkTheme: DefaultTheme = {
  // Colores principales
  background: '#1E1E24',
  backgroundSecondary: '#2A2A30',
  backgroundTertiary: '#3A3A40',
  backgroundHover: '#2F2F35',
  backgroundAlt: '#3A3A45',
  backgroundDisabled: '#2A2A30',
  backgroundSuccess: '#4CD96420',
  backgroundError: '#FF3B3020',
  text: '#FFFFFF',
  textSecondary: '#AAAAAA',
  textTertiary: '#888888',
  textPrimary: '#6C5CE7',
  textDisabled: '#666666',

  // Colores de acento
  primary: '#6C5CE7',
  primaryHover: '#8A7AFF',
  primaryLight: '#8A7AFF',
  primaryDark: '#5849C0',
  secondary: '#00B8D4',
  secondaryHover: '#00D8F4',
  accent: '#FF3366',
  accentHover: '#FF5386',
  accentLight: '#FF5386',
  success: '#4CD964',
  successHover: '#6CE984',
  successLight: '#6CE984',
  warning: '#FFCC00',
  warningHover: '#FFDC20',
  warningLight: '#FFDC20',
  error: '#FF3B30',
  errorHover: '#FF5B50',
  errorLight: '#FF5B50',
  errorDark: '#D01B10',
  danger: '#FF3B30',
  dangerLight: '#FF6B60',
  dangerHover: '#FF5B50',
  info: '#0A84FF',
  infoHover: '#2A94FF',
  infoLight: '#2A94FF',

  // Elementos de UI
  cardBackground: '#2A2A30',
  inputBackground: '#3A3A40',
  buttonBackground: '#6C5CE7',
  buttonHover: '#8A7AFF',

  // Bordes y sombras
  border: '#3A3A40',
  borderColor: '#3A3A40',
  shadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  shadowHover: '0 6px 10px rgba(0, 0, 0, 0.15)',

  // Scrollbar
  scrollbarTrack: '#2A2A30',
  scrollbarThumb: '#3A3A40',
  scrollbarThumbHover: '#4A4A50',

  // Estados
  online: '#4CD964',
  offline: '#AAAAAA',

  // Gráficos
  chartColors: ['#6C5CE7', '#00B8D4', '#FF3366', '#4CD964', '#FFCC00'],

  // Colores (para compatibilidad con componentes antiguos)
  colors: {
    background: '#1E1E24',
    backgroundAlt: '#3A3A45',
    backgroundHover: '#2F2F35',
    backgroundSecondary: '#2A2A30',
    backgroundTertiary: '#3A3A40',
    backgroundDisabled: '#2A2A30',
    text: '#FFFFFF',
    textSecondary: '#AAAAAA',
    textTertiary: '#888888',
    textPrimary: '#6C5CE7',
    primary: '#6C5CE7',
    primaryLight: '#8A7AFF',
    primaryDark: '#5849C0',
    secondary: '#00B8D4',
    secondaryLight: '#00D8F4',
    tertiary: '#FF3366',
    tertiaryLight: '#FF5386',
    success: '#4CD964',
    successLight: '#6CE984',
    warning: '#FFCC00',
    warningLight: '#FFDC20',
    error: '#FF3B30',
    errorLight: '#FF5B50',
    info: '#0A84FF',
    infoLight: '#2A94FF',
    border: '#3A3A40',
    borderLight: '#4A4A50'
  },

  // Skeleton
  skeletonBackground: '#2A2A30',
  skeletonHighlight: '#3A3A40'
};

/**
 * Obtiene el tema basado en el modo
 * @param mode Modo del tema ('light' o 'dark')
 * @returns El tema correspondiente
 */
export const getTheme = (mode: 'light' | 'dark'): DefaultTheme => {
  return mode === 'dark' ? darkTheme : lightTheme;
};

/**
 * Tema por defecto (claro)
 */
export default lightTheme;
