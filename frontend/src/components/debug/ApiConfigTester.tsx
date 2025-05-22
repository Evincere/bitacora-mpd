import React, { useState } from 'react';
import styled from 'styled-components';
import { FiSend, FiRefreshCw, FiCheck, FiX } from 'react-icons/fi';
import { testEndpointWithMultipleConfigs, ApiResponse } from '@/utils/apiTestService';

const Container = styled.div`
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 20px;
  margin: 20px 0;
  max-width: 800px;
`;

const Title = styled.h3`
  margin-top: 0;
  color: #343a40;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-weight: 600;
  color: #495057;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #80bdff;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  }
`;

const Button = styled.button<{ $primary?: boolean }>`
  padding: 10px 16px;
  background-color: ${props => props.$primary ? '#007bff' : '#6c757d'};
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    background-color: ${props => props.$primary ? '#0069d9' : '#5a6268'};
  }
  
  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
`;

const ResultsContainer = styled.div`
  margin-top: 20px;
`;

const ResultItem = styled.div`
  margin-bottom: 16px;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  overflow: hidden;
`;

const ResultHeader = styled.div<{ $success: boolean }>`
  background-color: ${props => props.$success ? '#d4edda' : '#f8d7da'};
  color: ${props => props.$success ? '#155724' : '#721c24'};
  padding: 8px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ResultTitle = styled.h4`
  margin: 0;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ResultBody = styled.div`
  padding: 16px;
`;

const ResponseBody = styled.pre`
  background-color: #f1f3f5;
  padding: 16px;
  border-radius: 4px;
  overflow: auto;
  max-height: 200px;
  font-family: monospace;
  font-size: 12px;
  line-height: 1.5;
`;

const ApiConfigTester: React.FC = () => {
  const [url, setUrl] = useState<string>('/api/users');
  const [loading, setLoading] = useState<boolean>(false);
  const [results, setResults] = useState<ApiResponse[]>([]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const testResults = await testEndpointWithMultipleConfigs(url);
      setResults(testResults);
    } catch (error) {
      console.error('Error al realizar las pruebas:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleReset = () => {
    setUrl('/api/users');
    setResults([]);
  };
  
  const getConfigDescription = (index: number): string => {
    switch (index) {
      case 0:
        return 'Configuración estándar con Bearer token';
      case 1:
        return 'Sin Bearer, solo token en header personalizado';
      case 2:
        return 'Con Bearer y permisos explícitos';
      case 3:
        return 'Con Bearer, header personalizado y permisos explícitos';
      default:
        return `Configuración ${index + 1}`;
    }
  };
  
  return (
    <Container>
      <Title>Probador de Configuraciones de API</Title>
      <p>Esta herramienta prueba diferentes configuraciones de autenticación para un endpoint.</p>
      
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="url">URL</Label>
          <Input
            id="url"
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Ejemplo: /api/users"
          />
        </FormGroup>
        
        <ButtonGroup>
          <Button type="submit" $primary disabled={loading}>
            {loading ? <FiRefreshCw /> : <FiSend />}
            {loading ? 'Probando...' : 'Probar Configuraciones'}
          </Button>
          <Button type="button" onClick={handleReset} disabled={loading}>
            Reiniciar
          </Button>
        </ButtonGroup>
      </Form>
      
      {results.length > 0 && (
        <ResultsContainer>
          <h4>Resultados de las Pruebas</h4>
          
          {results.map((result, index) => (
            <ResultItem key={index}>
              <ResultHeader $success={result.success}>
                <ResultTitle>
                  {result.success ? <FiCheck /> : <FiX />}
                  Prueba {index + 1}: {getConfigDescription(index)}
                </ResultTitle>
                <span>{result.status} {result.statusText}</span>
              </ResultHeader>
              
              <ResultBody>
                <ResponseBody>
                  {JSON.stringify(result.body, null, 2)}
                </ResponseBody>
              </ResultBody>
            </ResultItem>
          ))}
        </ResultsContainer>
      )}
    </Container>
  );
};

export default ApiConfigTester;
