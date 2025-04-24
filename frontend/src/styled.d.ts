import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    // Colores principales
    background: string;
    backgroundSecondary: string;
    backgroundTertiary: string;
    backgroundHover: string;
    backgroundDisabled: string;
    backgroundAlt: string;
    backgroundSuccess: string;
    backgroundError: string;
    text: string;
    textSecondary: string;
    textTertiary: string;
    textPrimary: string;
    textDisabled: string;

    // Colores de acento
    primary: string;
    primaryHover: string;
    primaryLight: string;
    primaryDark: string;
    secondary: string;
    secondaryHover: string;
    accent: string;
    accentHover: string;
    accentLight: string;
    success: string;
    successHover: string;
    successLight: string;
    warning: string;
    warningLight: string;
    warningHover: string;
    error: string;
    errorHover: string;
    errorLight: string;
    errorDark: string;
    danger: string;
    dangerLight: string;
    dangerHover: string;
    info: string;
    infoHover: string;
    infoLight: string;

    // Elementos de UI
    cardBackground: string;
    inputBackground: string;
    buttonBackground: string;
    buttonHover: string;

    // Bordes y sombras
    border: string;
    borderColor: string;
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

    // Colores (para compatibilidad con componentes antiguos)
    colors: {
      background: string;
      backgroundAlt: string;
      backgroundHover: string;
      backgroundSecondary: string;
      backgroundTertiary: string;
      backgroundDisabled: string;
      text: string;
      textSecondary: string;
      textTertiary: string;
      textPrimary: string;
      primary: string;
      primaryLight: string;
      primaryDark: string;
      secondary: string;
      secondaryLight: string;
      tertiary: string;
      tertiaryLight: string;
      success: string;
      successLight: string;
      warning: string;
      warningLight: string;
      error: string;
      errorLight: string;
      info: string;
      infoLight: string;
      border: string;
      borderLight: string;
    };

    // Skeleton
    skeletonBackground: string;
    skeletonHighlight: string;
  }
}
