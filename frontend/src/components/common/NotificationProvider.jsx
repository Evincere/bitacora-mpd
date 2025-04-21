import React, { createContext, useState, useContext, useCallback } from 'react';
import Notification from './Notification';
import styled from 'styled-components';

const NotificationContext = createContext();

const NotificationContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 350px;
`;

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  
  const addNotification = useCallback((notification) => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, ...notification }]);
    return id;
  }, []);
  
  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);
  
  const success = useCallback((message, title = 'Éxito') => {
    return addNotification({ type: 'success', title, message });
  }, [addNotification]);
  
  const error = useCallback((message, title = 'Error') => {
    return addNotification({ type: 'error', title, message });
  }, [addNotification]);
  
  const warning = useCallback((message, title = 'Advertencia') => {
    return addNotification({ type: 'warning', title, message });
  }, [addNotification]);
  
  const info = useCallback((message, title = 'Información') => {
    return addNotification({ type: 'info', title, message });
  }, [addNotification]);
  
  const value = {
    addNotification,
    removeNotification,
    success,
    error,
    warning,
    info
  };
  
  return (
    <NotificationContext.Provider value={value}>
      {children}
      <NotificationContainer>
        {notifications.map(notification => (
          <Notification
            key={notification.id}
            id={notification.id}
            type={notification.type}
            title={notification.title}
            message={notification.message}
            duration={notification.duration}
            onClose={removeNotification}
          />
        ))}
      </NotificationContainer>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
