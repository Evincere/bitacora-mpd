import React from 'react';
import styled from 'styled-components';
import AuthDebugger from '@/components/debug/AuthDebugger';
import AuthTester from '@/components/debug/AuthTester';

const Container = styled.div`
  padding: 20px;
`;

const Title = styled.h1`
  margin-bottom: 20px;
`;

const DebugPage: React.FC = () => {
  return (
    <Container>
      <Title>Debug Page</Title>
      <AuthTester />
      <AuthDebugger />
    </Container>
  );
};

export default DebugPage;
