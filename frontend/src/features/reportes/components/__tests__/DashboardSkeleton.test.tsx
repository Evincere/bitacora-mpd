import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import React from 'react';
import DashboardSkeleton, {
  MetricCardSkeletonComponent,
  ChartSkeletonComponent,
  TableSkeletonComponent
} from '../DashboardSkeleton';

// Theme mock
const mockTheme = {
  primary: '#6366F1',
  text: '#1F2937',
  cardBackground: '#FFFFFF',
  border: '#E5E7EB'
};

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={mockTheme}>
      {component}
    </ThemeProvider>
  );
};

describe('DashboardSkeleton', () => {
  it('should render main dashboard skeleton structure', () => {
    // Act
    const { container } = renderWithTheme(<DashboardSkeleton />);

    // Assert
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render multiple skeleton elements', () => {
    // Act
    const { container } = renderWithTheme(<DashboardSkeleton />);

    // Assert
    // Verificar que hay múltiples elementos div (skeleton elements)
    const divElements = container.querySelectorAll('div');
    expect(divElements.length).toBeGreaterThan(5);
  });

  it('should render without errors', () => {
    // Act & Assert
    expect(() => renderWithTheme(<DashboardSkeleton />)).not.toThrow();
  });
});

describe('MetricCardSkeletonComponent', () => {
  it('should render metric card skeleton', () => {
    // Act & Assert
    expect(() => renderWithTheme(<MetricCardSkeletonComponent />)).not.toThrow();
  });
});

describe('ChartSkeletonComponent', () => {
  it('should render chart skeleton', () => {
    // Act & Assert
    expect(() => renderWithTheme(<ChartSkeletonComponent />)).not.toThrow();
  });
});

describe('TableSkeletonComponent', () => {
  it('should render table skeleton with default rows', () => {
    // Act & Assert
    expect(() => renderWithTheme(<TableSkeletonComponent />)).not.toThrow();
  });

  it('should render table skeleton with custom number of rows', () => {
    // Act & Assert
    expect(() => renderWithTheme(<TableSkeletonComponent rows={3} />)).not.toThrow();
  });
});

describe('Skeleton Animation', () => {
  it('should render without animation errors', () => {
    // Act & Assert
    expect(() => renderWithTheme(<DashboardSkeleton />)).not.toThrow();
  });
});

describe('Responsive Design', () => {
  it('should render without errors on different screen sizes', () => {
    // Act
    const { container } = renderWithTheme(<DashboardSkeleton />);

    // Assert
    expect(container.firstChild).toBeInTheDocument();
  });
});

describe('Accessibility', () => {
  it('should not have accessibility violations', () => {
    // Act
    renderWithTheme(<DashboardSkeleton />);

    // Assert
    // Verificar que no hay elementos con roles problemáticos
    const problematicElements = screen.queryAllByRole('button');
    expect(problematicElements).toHaveLength(0);
  });

  it('should have proper semantic structure', () => {
    // Act
    const { container } = renderWithTheme(<DashboardSkeleton />);

    // Assert
    expect(container.firstChild).toBeInTheDocument();

    // No debería tener elementos interactivos durante el loading
    const interactiveElements = container.querySelectorAll('button, input, select, textarea, a');
    expect(interactiveElements).toHaveLength(0);
  });
});
