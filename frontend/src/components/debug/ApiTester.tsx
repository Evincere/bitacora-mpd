import React, { useState } from 'react';
import styled from 'styled-components';
import { FiSend, FiRefreshCw, FiCheck, FiX } from 'react-icons/fi';
import tokenService from '@/core/utils/tokenService';

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

const Select = styled.select`
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

const ResponseContainer = styled.div`
  margin-top: 20px;
`;

const ResponseHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const StatusBadge = styled.span<{ $success: boolean }>`
  padding: 4px 8px;
  background-color: ${props => props.$success ? '#d4edda' : '#f8d7da'};
  color: ${props => props.$success ? '#155724' : '#721c24'};
  border-radius: 4px;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const ResponseBody = styled.pre`
  background-color: #f1f3f5;
  padding: 16px;
  border-radius: 4px;
  overflow: auto;
  max-height: 300px;
  font-family: monospace;
  font-size: 12px;
  line-height: 1.5;
`;

interface ApiResponse {
  status: number;
  statusText: string;
  body: any;
  headers: Record<string, string>;
  success: boolean;
}

const ApiTester: React.FC = () => {
  const [url, setUrl] = useState<string>('/api/users');
  const [method, setMethod] = useState<string>('GET');
  const [loading, setLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<ApiResponse | null>(null);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Obtener el token
      const token = tokenService.getToken();
      
      // Construir headers
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      // Realizar la petición
      const fetchResponse = await fetch(url, {
        method,
        headers,
        credentials: 'include'
      });
      
      // Convertir headers a objeto
      const responseHeaders: Record<string, string> = {};
      fetchResponse.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });
      
      // Intentar parsear el cuerpo de la respuesta
      let responseBody;
      try {
        const text = await fetchResponse.text();
        responseBody = text ? JSON.parse(text) : null;
      } catch (error) {
        responseBody = 'Error al parsear la respuesta como JSON';
      }
      
      // Guardar la respuesta
      setResponse({
        status: fetchResponse.status,
        statusText: fetchResponse.statusText,
        body: responseBody,
        headers: responseHeaders,
        success: fetchResponse.ok
      });
    } catch (error) {
      console.error('Error al realizar la petición:', error);
      setResponse({
        status: 0,
        statusText: 'Error de red',
        body: error instanceof Error ? error.message : 'Error desconocido',
        headers: {},
        success: false
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleReset = () => {
    setUrl('/api/users');
    setMethod('GET');
    setResponse(null);
  };
  
  return (
    <Container>
      <Title>Probador de API</Title>
      
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
        
        <FormGroup>
          <Label htmlFor="method">Método</Label>
          <Select
            id="method"
            value={method}
            onChange={(e) => setMethod(e.target.value)}
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
          </Select>
        </FormGroup>
        
        <ButtonGroup>
          <Button type="submit" $primary disabled={loading}>
            {loading ? <FiRefreshCw /> : <FiSend />}
            {loading ? 'Enviando...' : 'Enviar Petición'}
          </Button>
          <Button type="button" onClick={handleReset} disabled={loading}>
            Reiniciar
          </Button>
        </ButtonGroup>
      </Form>
      
      {response && (
        <ResponseContainer>
          <ResponseHeader>
            <h4>Respuesta</h4>
            <StatusBadge $success={response.success}>
              {response.success ? <FiCheck /> : <FiX />}
              {response.status} {response.statusText}
            </StatusBadge>
          </ResponseHeader>
          
          <ResponseBody>
            {JSON.stringify(response.body, null, 2)}
          </ResponseBody>
        </ResponseContainer>
      )}
    </Container>
  );
};

export default ApiTester;
