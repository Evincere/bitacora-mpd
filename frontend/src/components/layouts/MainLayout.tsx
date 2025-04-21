import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../../store';
import { toggleSidebar } from '../../store/uiSlice';

const LayoutContainer = styled.div`
  display: flex;
  height: 100vh;
  overflow: hidden;
`;

const MainContent = styled.main`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  transition: all 0.3s ease;
`;

const ContentWrapper = styled.div`
  max-width: 1600px;
  margin: 0 auto;
`;

/**
 * Layout principal para la aplicación
 */
const MainLayout: React.FC = () => {
  const dispatch = useAppDispatch();
  const { sidebarOpen } = useAppSelector(state => state.ui);
  const navigate = useNavigate();

  const handleToggleSidebar = () => {
    dispatch(toggleSidebar());
  };

  return (
    <LayoutContainer>
      {/* Aquí iría el componente Sidebar */}
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
        {/* Aquí iría el componente Header */}
        <MainContent>
          <ContentWrapper>
            <Outlet />
          </ContentWrapper>
        </MainContent>
      </div>
    </LayoutContainer>
  );
};

export default MainLayout;
