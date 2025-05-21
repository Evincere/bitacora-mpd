import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import tokenService from '@/core/utils/tokenService';
import { getToken, getUser, isAuthenticated } from '@/core/utils/auth';

const Container = styled.div`
  position: fixed;
  bottom: 10px;
  right: 10px;
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 10px;
  border-radius: 5px;
  font-family: monospace;
  font-size: 12px;
  z-index: 9999;
  max-width: 500px;
  max-height: 300px;
  overflow: auto;
`;

const Title = styled.div`
  font-weight: bold;
  margin-bottom: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 16px;
`;

const Section = styled.div`
  margin-bottom: 10px;
`;

const SectionTitle = styled.div`
  font-weight: bold;
  margin-bottom: 3px;
  color: #00ff00;
`;

const InfoItem = styled.div`
  margin-bottom: 2px;
`;

const TokenDisplay = styled.div`
  word-break: break-all;
  margin-bottom: 5px;
  font-size: 10px;
`;

const AuthDebugger: React.FC = () => {
  const [visible, setVisible] = useState(true);
  const [authState, setAuthState] = useState({
    tokenServiceToken: tokenService.getToken(),
    authUtilToken: getToken(),
    user: getUser(),
    isAuthenticatedTokenService: tokenService.isAuthenticated(),
    isAuthenticatedAuthUtil: isAuthenticated(),
    tokenExpiration: 0,
    decodedToken: null as any
  });

  useEffect(() => {
    const updateAuthState = () => {
      const token = tokenService.getToken();
      let decoded = null;
      let expiration = 0;
      
      if (token) {
        decoded = tokenService.decodeToken(token);
        expiration = tokenService.getTokenExpirationTime();
      }
      
      setAuthState({
        tokenServiceToken: token,
        authUtilToken: getToken(),
        user: getUser(),
        isAuthenticatedTokenService: tokenService.isAuthenticated(),
        isAuthenticatedAuthUtil: isAuthenticated(),
        tokenExpiration: expiration,
        decodedToken: decoded
      });
    };

    updateAuthState();
    const interval = setInterval(updateAuthState, 5000);
    
    return () => clearInterval(interval);
  }, []);

  if (!visible) return null;

  return (
    <Container>
      <Title>
        Auth Debugger
        <CloseButton onClick={() => setVisible(false)}>×</CloseButton>
      </Title>
      
      <Section>
        <SectionTitle>Authentication Status</SectionTitle>
        <InfoItem>tokenService.isAuthenticated(): {authState.isAuthenticatedTokenService ? 'true' : 'false'}</InfoItem>
        <InfoItem>auth.isAuthenticated(): {authState.isAuthenticatedAuthUtil ? 'true' : 'false'}</InfoItem>
        <InfoItem>Token expiration: {authState.tokenExpiration} seconds</InfoItem>
      </Section>
      
      <Section>
        <SectionTitle>Token Info</SectionTitle>
        <InfoItem>tokenService token: {authState.tokenServiceToken ? 'present' : 'missing'}</InfoItem>
        <InfoItem>auth.ts token: {authState.authUtilToken ? 'present' : 'missing'}</InfoItem>
        {authState.tokenServiceToken && (
          <TokenDisplay>
            {authState.tokenServiceToken.substring(0, 20)}...
          </TokenDisplay>
        )}
      </Section>
      
      <Section>
        <SectionTitle>User Info</SectionTitle>
        {authState.user ? (
          <>
            <InfoItem>Username: {authState.user.username}</InfoItem>
            <InfoItem>Role: {authState.user.role}</InfoItem>
          </>
        ) : (
          <InfoItem>No user data found</InfoItem>
        )}
      </Section>
      
      {authState.decodedToken && (
        <Section>
          <SectionTitle>Decoded Token</SectionTitle>
          <InfoItem>Subject: {authState.decodedToken.sub}</InfoItem>
          <InfoItem>User ID: {authState.decodedToken.id}</InfoItem>
          <InfoItem>Authorities: {JSON.stringify(authState.decodedToken.authorities)}</InfoItem>
        </Section>
      )}
    </Container>
  );
};

export default AuthDebugger;
