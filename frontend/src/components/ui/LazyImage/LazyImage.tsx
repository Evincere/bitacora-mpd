import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

// Propiedades para el componente LazyImage
export interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  placeholderSrc?: string;
  width?: string | number;
  height?: string | number;
  aspectRatio?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  threshold?: number;
  effect?: 'blur' | 'opacity' | 'none';
  backgroundColor?: string;
  onLoad?: () => void;
  onError?: () => void;
}

// Animación de desvanecimiento
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

// Contenedor para la imagen
const ImageContainer = styled.div<{
  $width?: string | number;
  $height?: string | number;
  $aspectRatio?: string;
  $backgroundColor?: string;
}>`
  position: relative;
  width: ${({ $width }) => (typeof $width === 'number' ? `${$width}px` : $width || 'auto')};
  height: ${({ $height }) => (typeof $height === 'number' ? `${$height}px` : $height || 'auto')};
  aspect-ratio: ${({ $aspectRatio }) => $aspectRatio || 'auto'};
  background-color: ${({ $backgroundColor, theme }) => $backgroundColor || theme.skeletonBackground || '#f0f0f0'};
  overflow: hidden;
`;

// Imagen con efectos
const StyledImage = styled.img<{
  $loaded: boolean;
  $effect: 'blur' | 'opacity' | 'none';
  $objectFit: string;
}>`
  width: 100%;
  height: 100%;
  object-fit: ${({ $objectFit }) => $objectFit};
  display: block;
  
  ${({ $loaded, $effect }) => {
    if (!$loaded) {
      return `
        opacity: 0;
      `;
    }
    
    switch ($effect) {
      case 'blur':
        return `
          animation: ${fadeIn} 0.5s ease-in-out;
          filter: blur(0);
          transition: filter 0.5s ease-in-out;
        `;
      case 'opacity':
        return `
          animation: ${fadeIn} 0.5s ease-in-out;
        `;
      default:
        return '';
    }
  }}
`;

// Imagen de placeholder con efecto de blur
const PlaceholderImage = styled.img<{
  $visible: boolean;
  $objectFit: string;
}>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: ${({ $objectFit }) => $objectFit};
  filter: blur(10px);
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transition: opacity 0.5s ease-in-out;
`;

/**
 * Componente LazyImage para cargar imágenes de forma diferida
 */
const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  placeholderSrc,
  width,
  height,
  aspectRatio,
  objectFit = 'cover',
  threshold = 0.1,
  effect = 'opacity',
  backgroundColor,
  onLoad,
  onError,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  
  // Usar IntersectionObserver para detectar cuando la imagen está en el viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    
    if (imgRef.current) {
      observer.observe(imgRef.current);
    }
    
    return () => {
      observer.disconnect();
    };
  }, [threshold]);
  
  // Manejar la carga de la imagen
  const handleImageLoad = () => {
    setIsLoaded(true);
    if (onLoad) onLoad();
  };
  
  // Manejar errores de carga
  const handleImageError = () => {
    if (onError) onError();
  };
  
  return (
    <ImageContainer
      $width={width}
      $height={height}
      $aspectRatio={aspectRatio}
      $backgroundColor={backgroundColor}
    >
      {placeholderSrc && (
        <PlaceholderImage
          src={placeholderSrc}
          alt=""
          $visible={!isLoaded}
          $objectFit={objectFit}
          aria-hidden="true"
        />
      )}
      
      <StyledImage
        ref={imgRef}
        src={isVisible ? src : ''}
        alt={alt}
        $loaded={isLoaded}
        $effect={effect}
        $objectFit={objectFit}
        loading="lazy"
        onLoad={handleImageLoad}
        onError={handleImageError}
        {...props}
      />
    </ImageContainer>
  );
};

export default LazyImage;
