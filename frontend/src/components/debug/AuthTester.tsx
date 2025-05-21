import React, { useState } from 'react';
import styled from 'styled-components';
import apiClient from '@/core/api/apiClient';
import { api } from '@/core/api/api';
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

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

const Button = styled.button`
  padding: 8px 16px;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background-color: #3a80d2;
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

const AuthTester: React.FC = () => {
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const testEndpoints = async (client: 'apiClient' | 'api', endpoint: string) => {
    setLoading(true);
    setResult(null);
    setError(null);
    
    try {
      let response;
      
      if (client === 'apiClient') {
        response = await apiClient.get(endpoint);
      } else {
        response = await api.get(endpoint).json();
      }
      
      setResult(response);
    } catch (err: any) {
      console.error(`Error testing ${client} with endpoint ${endpoint}:`, err);
      setError(err.message || 'Unknown error');
      setResult(err);
    } finally {
      setLoading(false);
    }
  };

  const testUsers = () => testEndpoints('apiClient', 'users?page=0&size=10');
  const testUsersWithApi = () => testEndpoints('api', 'users?page=0&size=10');
  const testMe = () => testEndpoints('apiClient', 'auth/me');
  const testMeWithApi = () => testEndpoints('api', 'auth/me');

  const showTokenInfo = () => {
    const token = tokenService.getToken();
    if (token) {
      const decoded = tokenService.decodeToken(token);
      setResult({
        token: token.substring(0, 20) + '...',
        decoded,
        expiration: tokenService.getTokenExpirationTime(),
        isExpired: tokenService.isTokenExpired(token)
      });
    } else {
      setError('No token found');
    }
  };

  return (
    <Container>
      <Title>Authentication Tester</Title>
      
      <ButtonGroup>
        <Button onClick={testUsers}>Test Users (apiClient)</Button>
        <Button onClick={testUsersWithApi}>Test Users (api)</Button>
        <Button onClick={testMe}>Test /auth/me (apiClient)</Button>
        <Button onClick={testMeWithApi}>Test /auth/me (api)</Button>
        <Button onClick={showTokenInfo}>Show Token Info</Button>
      </ButtonGroup>
      
      {loading && <div>Loading...</div>}
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      {result && (
        <ResultContainer>
          <ResultTitle>Result</ResultTitle>
          <ResultContent>
            {JSON.stringify(result, null, 2)}
          </ResultContent>
        </ResultContainer>
      )}
    </Container>
  );
};

export default AuthTester;
