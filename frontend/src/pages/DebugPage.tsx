import React from 'react';
import styled from 'styled-components';
import AuthDebugger from '@/components/debug/AuthDebugger';
import AuthTester from '@/components/debug/AuthTester';
import UserPermissionsDebugger from '@/components/debug/UserPermissionsDebugger';
import UserEndpointTester from '@/components/debug/UserEndpointTester';

const Container = styled.div`
  padding: 20px;
`;

const Title = styled.h1`
  margin-bottom: 20px;
`;

const Section = styled.div`
  margin-bottom: 30px;
`;

const SectionTitle = styled.h2`
  margin-bottom: 15px;
  padding-bottom: 5px;
  border-bottom: 1px solid #ddd;
`;

const DebugPage: React.FC = () => {
  return (
    <Container>
      <Title>Página de Depuración</Title>

      <Section>
        <SectionTitle>Prueba de Endpoints</SectionTitle>
        <AuthTester />
      </Section>

      <Section>
        <SectionTitle>Permisos de Usuario</SectionTitle>
        <UserPermissionsDebugger />
      </Section>

      <Section>
        <SectionTitle>Probador de Endpoint de Usuarios</SectionTitle>
        <UserEndpointTester />
      </Section>

      <AuthDebugger />
    </Container>
  );
};

export default DebugPage;
