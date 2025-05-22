import React, { useState } from 'react';
import styled from 'styled-components';
import tokenService from '@/core/utils/tokenService';

const Container = styled.div`
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
  margin: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  margin-bottom: 20px;
  color: #333;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const Label = styled.label`
  font-weight: bold;
`;

const Input = styled.input`
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const Select = styled.select`
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const Button = styled.button`
  padding: 10px 16px;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  
  &:hover {
    background-color: #3a80d2;
  }
  
  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const ResultContainer = styled.div`
  margin-top: 20px;
  padding: 15px;
  background-color: #fff;
  border-radius: 4px;
  border: 1px solid #ddd;
`;

const ResultTitle = styled.h3`
  margin-bottom: 10px;
  color: #333;
`;

const ResultContent = styled.pre`
  white-space: pre-wrap;
  word-break: break-all;
  font-family: monospace;
  font-size: 12px;
  background-color: #f8f8f8;
  padding: 10px;
  border-radius: 4px;
  max-height: 300px;
  overflow: auto;
`;

const ErrorMessage = styled.div`
  color: #e53935;
  margin-top: 10px;
  padding: 10px;
  background-color: #ffebee;
  border-radius: 4px;
`;

const UserEndpointTester: React.FC = () => {
  const [url, setUrl] = useState<string>('/api/users');
  const [method, setMethod] = useState<string>('GET');
  const [headers, setHeaders] = useState<string>(JSON.stringify({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${tokenService.getToken()}`
  }, null, 2));
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError(null);
    
    try {
      // Parsear los headers
      const parsedHeaders = JSON.parse(headers);
      
      // Construir la URL completa
      const baseUrl = 'http://localhost:3000';
      const fullUrl = url.startsWith('http') ? url : `${baseUrl}${url.startsWith('/') ? url : `/${url}`}`;
      
      console.log(`Realizando petición ${method} a ${fullUrl}`);
      console.log('Headers:', parsedHeaders);
      
      // Realizar la petición
      const response = await fetch(fullUrl, {
        method,
        headers: parsedHeaders,
        credentials: 'include'
      });
      
      // Obtener el resultado
      const data = await response.json().catch(() => ({}));
      
      // Mostrar el resultado
      setResult({
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        data
      });
    } catch (err: any) {
      console.error('Error al realizar la petición:', err);
      setError(err.message || 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Title>Probador de Endpoint de Usuarios</Title>
      
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>URL</Label>
          <Input 
            type="text" 
            value={url} 
            onChange={(e) => setUrl(e.target.value)} 
            placeholder="Ejemplo: /api/users"
          />
        </FormGroup>
        
        <FormGroup>
          <Label>Método</Label>
          <Select value={method} onChange={(e) => setMethod(e.target.value)}>
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
          </Select>
        </FormGroup>
        
        <FormGroup>
          <Label>Headers (JSON)</Label>
          <textarea 
            rows={5} 
            value={headers} 
            onChange={(e) => setHeaders(e.target.value)} 
            style={{ 
              fontFamily: 'monospace', 
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}
          />
        </FormGroup>
        
        <Button type="submit" disabled={loading}>
          {loading ? 'Enviando...' : 'Enviar Petición'}
        </Button>
      </Form>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      {result && (
        <ResultContainer>
          <ResultTitle>Resultado</ResultTitle>
          <ResultContent>
            {JSON.stringify(result, null, 2)}
          </ResultContent>
        </ResultContainer>
      )}
    </Container>
  );
};

export default UserEndpointTester;
