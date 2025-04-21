import React, { Component, ErrorInfo, ReactNode } from 'react';
import styled from 'styled-components';
import { FiAlertCircle } from 'react-icons/fi';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  margin: 1rem 0;
  background-color: ${({ theme }) => theme.errorBackground || '#fff1f0'};
  border-radius: 8px;
  color: ${({ theme }) => theme.errorText || '#cf1322'};
  text-align: center;
`;

const ErrorTitle = styled.h3`
  margin: 1rem 0;
  font-size: 1.2rem;
`;

const ErrorMessage = styled.p`
  margin-bottom: 1rem;
`;

const ResetButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: ${({ theme }) => theme.errorText || '#cf1322'};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  
  &:hover {
    opacity: 0.9;
  }
`;

const DefaultFallback = ({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) => (
  <ErrorContainer>
    <FiAlertCircle size={40} />
    <ErrorTitle>¡Algo salió mal!</ErrorTitle>
    <ErrorMessage>{error.message || 'Ha ocurrido un error inesperado.'}</ErrorMessage>
    <ResetButton onClick={resetErrorBoundary}>
      Reintentar
    </ResetButton>
  </ErrorContainer>
);

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  resetErrorBoundary = (): void => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      return (
        <DefaultFallback 
          error={this.state.error as Error} 
          resetErrorBoundary={this.resetErrorBoundary} 
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
