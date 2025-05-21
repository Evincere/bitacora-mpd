/**
 * @file DashboardFooter component
 * @description Footer component for the SmartDashboard
 */

import React from 'react';
import styled from 'styled-components';
import { FiInfo, FiHelpCircle } from 'react-icons/fi';

// Styled components
const FooterContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  margin-top: 24px;
  border-top: 1px solid ${({ theme }) => theme.border};
  color: ${({ theme }) => theme.textSecondary};
  font-size: 14px;
`;

const SystemStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  .status-indicator {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: #4CD964;
  }
`;

const HelpSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const HelpLink = styled.a`
  display: flex;
  align-items: center;
  gap: 6px;
  color: ${({ theme }) => theme.textSecondary};
  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.primary};
    text-decoration: underline;
  }
`;

/**
 * DashboardFooter component
 * @returns {JSX.Element} The DashboardFooter component
 */
const DashboardFooter: React.FC = () => {
  return (
    <FooterContainer>
      <SystemStatus>
        <div className="status-indicator"></div>
        <span>Sistema: Operativo</span>
      </SystemStatus>
      <HelpSection>
        <HelpLink href="#">
          <FiInfo size={16} />
          <span>Acerca de</span>
        </HelpLink>
        <HelpLink href="#">
          <FiHelpCircle size={16} />
          <span>Ayuda</span>
        </HelpLink>
      </HelpSection>
    </FooterContainer>
  );
};

export default DashboardFooter;
