import React, { useState } from 'react';
import styled from 'styled-components';
import { FiSend, FiRefreshCw, FiCheck, FiX, FiAlertTriangle } from 'react-icons/fi';
import { testMultipleEndpoints, analyzeResults, commonEndpoints, EndpointTestResult } from '@/utils/apiEndpointTester';

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

const TextArea = styled.textarea`
  padding: 10px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 14px;
  min-height: 100px;
  
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

const AnalysisContainer = styled.div`
  margin-top: 20px;
  padding: 16px;
  background-color: #fff3cd;
  border: 1px solid #ffeeba;
  border-radius: 4px;
  color: #856404;
`;

const AnalysisTitle = styled.h4`
  margin-top: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const AnalysisContent = styled.pre`
  background-color: #fff;
  padding: 16px;
  border-radius: 4px;
  overflow: auto;
  max-height: 300px;
  font-family: monospace;
  font-size: 12px;
  line-height: 1.5;
  white-space: pre-wrap;
`;

const MultiEndpointTester: React.FC = () => {
  const [endpoints, setEndpoints] = useState<string>(commonEndpoints.join('\n'));
  const [loading, setLoading] = useState<boolean>(false);
  const [results, setResults] = useState<EndpointTestResult[]>([]);
  const [analysis, setAnalysis] = useState<string>('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Convertir el texto a un array de endpoints
      const endpointList = endpoints
        .split('\n')
        .map(endpoint => endpoint.trim())
        .filter(endpoint => endpoint.length > 0);
      
      // Probar los endpoints
      const testResults = await testMultipleEndpoints(endpointList);
      setResults(testResults);
      
      // Analizar los resultados
      const analysisResult = analyzeResults(testResults);
      setAnalysis(analysisResult);
    } catch (error) {
      console.error('Error al probar los endpoints:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleReset = () => {
    setEndpoints(commonEndpoints.join('\n'));
    setResults([]);
    setAnalysis('');
  };
  
  return (
    <Container>
      <Title>Probador de Múltiples Endpoints</Title>
      <p>Esta herramienta prueba múltiples endpoints de la API y analiza los resultados para identificar patrones.</p>
      
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="endpoints">Endpoints (uno por línea)</Label>
          <TextArea
            id="endpoints"
            value={endpoints}
            onChange={(e) => setEndpoints(e.target.value)}
            placeholder="Ejemplo: /api/users"
          />
        </FormGroup>
        
        <ButtonGroup>
          <Button type="submit" $primary disabled={loading}>
            {loading ? <FiRefreshCw /> : <FiSend />}
            {loading ? 'Probando...' : 'Probar Endpoints'}
          </Button>
          <Button type="button" onClick={handleReset} disabled={loading}>
            Reiniciar
          </Button>
        </ButtonGroup>
      </Form>
      
      {analysis && (
        <AnalysisContainer>
          <AnalysisTitle>
            <FiAlertTriangle />
            Análisis de Resultados
          </AnalysisTitle>
          <AnalysisContent>
            {analysis}
          </AnalysisContent>
        </AnalysisContainer>
      )}
      
      {results.length > 0 && (
        <ResultsContainer>
          <h4>Resultados de las Pruebas</h4>
          
          {results.map((result, index) => (
            <ResultItem key={index}>
              <ResultHeader $success={result.response.success}>
                <ResultTitle>
                  {result.response.success ? <FiCheck /> : <FiX />}
                  {result.url}
                </ResultTitle>
                <span>{result.response.status} {result.response.statusText}</span>
              </ResultHeader>
              
              <ResultBody>
                <ResponseBody>
                  {JSON.stringify(result.response.body, null, 2)}
                </ResponseBody>
              </ResultBody>
            </ResultItem>
          ))}
        </ResultsContainer>
      )}
    </Container>
  );
};

export default MultiEndpointTester;
