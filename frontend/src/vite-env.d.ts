/// <reference types="vite/client" />

// Declaración para archivos CSS
declare module '*.css' {
  const css: { [key: string]: string };
  export default css;
}

// Declaración para archivos de imágenes
declare module '*.svg' {
  import React = require('react');
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.jpeg' {
  const src: string;
  export default src;
}

declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.webp' {
  const src: string;
  export default src;
}

// Declaración para archivos JSON
declare module '*.json' {
  const value: any;
  export default value;
}

// Extender Window para variables globales
interface Window {
  // Agregar propiedades globales aquí si es necesario
}
