import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import Loader from '@/shared/components/common/Loader';
import { lightTheme } from '@/shared/styles';

// Componente wrapper para proporcionar el tema
const renderWithTheme = (ui: React.ReactElement) => {
  return render(
    <ThemeProvider theme={lightTheme}>
      {ui}
    </ThemeProvider>
  );
};

describe('Loader component', () => {
  test('renders with default props', () => {
    renderWithTheme(<Loader />);

    // Verificar que el componente se renderiza
    const loaderElement = document.querySelector('div[class^="Loader"]');
    expect(loaderElement).toBeInTheDocument();
  });

  test('renders with small size', () => {
    renderWithTheme(<Loader size="small" />);

    // Verificar que el componente se renderiza con el tamaño correcto
    const spinnerWrapper = document.querySelector('div[class^="SpinnerWrapper"]');
    expect(spinnerWrapper).toHaveStyle('width: 30px');
    expect(spinnerWrapper).toHaveStyle('height: 30px');
  });

  test('renders with large size', () => {
    renderWithTheme(<Loader size="large" />);

    // Verificar que el componente se renderiza con el tamaño correcto
    const spinnerWrapper = document.querySelector('div[class^="SpinnerWrapper"]');
    expect(spinnerWrapper).toHaveStyle('width: 70px');
    expect(spinnerWrapper).toHaveStyle('height: 70px');
  });

  test('renders with fullHeight=false', () => {
    renderWithTheme(<Loader fullHeight={false} />);

    // Verificar que el componente se renderiza sin altura completa
    const loaderContainer = document.querySelector('div[class^="LoaderContainer"]');
    expect(loaderContainer).not.toHaveStyle('height: 100%');
    expect(loaderContainer).toHaveStyle('height: auto');
  });

  test('applies custom className and style', () => {
    const customClassName = 'custom-loader';
    const customStyle = { margin: '20px' };

    renderWithTheme(
      <Loader
        className={customClassName}
        style={customStyle}
      />
    );

    // Verificar que se aplican la clase y el estilo personalizados
    const loaderContainer = document.querySelector('div[class^="LoaderContainer"]');
    expect(loaderContainer).toHaveClass(customClassName);
    expect(loaderContainer).toHaveStyle('margin: 20px');
  });
});
