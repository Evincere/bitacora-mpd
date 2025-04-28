import React from 'react';
import styled from 'styled-components';
import { Outlet } from 'react-router-dom';
import { useAppSelector } from '@/core/store';
import Header from './Header';
import RoleBasedSidebar from './RoleBasedSidebar';
import { ToastProvider } from '@/shared/components/ui';

const LayoutContainer = styled.div`
  display: flex;
  height: 100vh;
  overflow: hidden;
`;

const MainContent = styled.main`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background-color: ${({ theme }) => theme.background};
`;

const RoleBasedLayout: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const { sidebarOpen } = useAppSelector((state) => state.ui);

  return (
    <ToastProvider>
      <LayoutContainer>
        <RoleBasedSidebar user={user} />
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
          <Header />
          <MainContent>
            <Outlet />
          </MainContent>
        </div>
      </LayoutContainer>
    </ToastProvider>
  );
};

export default RoleBasedLayout;
