import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    // Colores principales
    background: string;
    backgroundSecondary: string;
    text: string;
    textSecondary: string;
    textPrimary: string;

    // Colores de acento
    primary: string;
    secondary: string;
    accent: string;
    success: string;
    warning: string;
    warningLight: string;
    error: string;

    // Elementos de UI
    cardBackground: string;
    inputBackground: string;
    buttonBackground: string;
    buttonHover: string;

    // Bordes y sombras
    border: string;
    shadow: string;
    shadowHover: string;

    // Scrollbar
    scrollbarTrack: string;
    scrollbarThumb: string;
    scrollbarThumbHover: string;

    // Estados
    online: string;
    offline: string;

    // Gráficos
    chartColors: string[];

    // Skeleton
    skeletonBackground: string;
    skeletonHighlight: string;
  }
}
