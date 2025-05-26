import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiInbox, FiClock, FiAlertCircle, FiMessageSquare, FiUsers, FiFilter } from 'react-icons/fi';
import { RealTimeNotification, NotificationType, isNotificationType } from '@/core/types/notifications';

// Categorías de notificaciones
enum NotificationCategory {
  ALL = 'all',
  TASKS = 'tasks',
  DEADLINES = 'deadlines',
  ANNOUNCEMENTS = 'announcements',
  COLLABORATION = 'collaboration',
  SYSTEM = 'system'
}

// Propiedades del componente
interface NotificationCategoriesProps {
  notifications: RealTimeNotification[];
  onCategoryChange: (filteredNotifications: RealTimeNotification[]) => void;
}

// Componente principal
const NotificationCategories: React.FC<NotificationCategoriesProps> = ({
  notifications,
  onCategoryChange
}) => {
  // Estado para la categoría seleccionada
  const [selectedCategory, setSelectedCategory] = useState<NotificationCategory>(NotificationCategory.ALL);
  // Estado para las notificaciones filtradas
  const [filteredNotifications, setFilteredNotifications] = useState<RealTimeNotification[]>(notifications);

  // Filtrar notificaciones cuando cambia la categoría o las notificaciones
  useEffect(() => {
    filterNotifications(selectedCategory);
  }, [selectedCategory, notifications]);

  // Función para filtrar notificaciones por categoría
  const filterNotifications = (category: NotificationCategory) => {
    let filtered: RealTimeNotification[];

    switch (category) {
      case NotificationCategory.TASKS:
        filtered = notifications.filter(
          notification =>
            notification.type === NotificationType.TASK_ASSIGNMENT ||
            notification.type === NotificationType.TASK_STATUS_CHANGE
        );
        break;
      case NotificationCategory.DEADLINES:
        filtered = notifications.filter(
          notification => notification.type === NotificationType.DEADLINE_REMINDER
        );
        break;
      case NotificationCategory.ANNOUNCEMENTS:
        filtered = notifications.filter(
          notification => notification.type === NotificationType.ANNOUNCEMENT
        );
        break;
      case NotificationCategory.COLLABORATION:
        filtered = notifications.filter(
          notification => notification.type === NotificationType.COLLABORATION
        );
        break;
      case NotificationCategory.SYSTEM:
        filtered = notifications.filter(
          notification =>
            notification.type === NotificationType.SUCCESS ||
            notification.type === NotificationType.ERROR ||
            notification.type === NotificationType.WARNING ||
            notification.type === NotificationType.INFO
        );
        break;
      default:
        filtered = notifications;
        break;
    }

    setFilteredNotifications(filtered);
    onCategoryChange(filtered);
  };

  // Cambiar la categoría seleccionada
  const handleCategoryChange = (category: NotificationCategory) => {
    setSelectedCategory(category);
  };

  // Contar notificaciones por categoría
  const getCategoryCount = (category: NotificationCategory): number => {
    switch (category) {
      case NotificationCategory.TASKS:
        return notifications.filter(
          notification =>
            notification.type === NotificationType.TASK_ASSIGNMENT ||
            notification.type === NotificationType.TASK_STATUS_CHANGE
        ).length;
      case NotificationCategory.DEADLINES:
        return notifications.filter(
          notification => notification.type === NotificationType.DEADLINE_REMINDER
        ).length;
      case NotificationCategory.ANNOUNCEMENTS:
        return notifications.filter(
          notification => notification.type === NotificationType.ANNOUNCEMENT
        ).length;
      case NotificationCategory.COLLABORATION:
        return notifications.filter(
          notification => notification.type === NotificationType.COLLABORATION
        ).length;
      case NotificationCategory.SYSTEM:
        return notifications.filter(
          notification =>
            notification.type === NotificationType.SUCCESS ||
            notification.type === NotificationType.ERROR ||
            notification.type === NotificationType.WARNING ||
            notification.type === NotificationType.INFO
        ).length;
      default:
        return notifications.length;
    }
  };

  return (
    <CategoriesContainer>
      <CategoryButton
        $selected={selectedCategory === NotificationCategory.ALL}
        onClick={() => handleCategoryChange(NotificationCategory.ALL)}
        aria-label="Todas las notificaciones"
        aria-pressed={selectedCategory === NotificationCategory.ALL}
      >
        <FiInbox />
        <span>Todas</span>
        <CategoryCount>{getCategoryCount(NotificationCategory.ALL)}</CategoryCount>
      </CategoryButton>

      <CategoryButton
        $selected={selectedCategory === NotificationCategory.TASKS}
        onClick={() => handleCategoryChange(NotificationCategory.TASKS)}
        aria-label="Notificaciones de tareas"
        aria-pressed={selectedCategory === NotificationCategory.TASKS}
      >
        <FiFilter />
        <span>Tareas</span>
        <CategoryCount>{getCategoryCount(NotificationCategory.TASKS)}</CategoryCount>
      </CategoryButton>

      <CategoryButton
        $selected={selectedCategory === NotificationCategory.DEADLINES}
        onClick={() => handleCategoryChange(NotificationCategory.DEADLINES)}
        aria-label="Recordatorios de fechas límite"
        aria-pressed={selectedCategory === NotificationCategory.DEADLINES}
      >
        <FiClock />
        <span>Fechas límite</span>
        <CategoryCount>{getCategoryCount(NotificationCategory.DEADLINES)}</CategoryCount>
      </CategoryButton>

      <CategoryButton
        $selected={selectedCategory === NotificationCategory.ANNOUNCEMENTS}
        onClick={() => handleCategoryChange(NotificationCategory.ANNOUNCEMENTS)}
        aria-label="Anuncios y comunicados"
        aria-pressed={selectedCategory === NotificationCategory.ANNOUNCEMENTS}
      >
        <FiMessageSquare />
        <span>Anuncios</span>
        <CategoryCount>{getCategoryCount(NotificationCategory.ANNOUNCEMENTS)}</CategoryCount>
      </CategoryButton>

      <CategoryButton
        $selected={selectedCategory === NotificationCategory.COLLABORATION}
        onClick={() => handleCategoryChange(NotificationCategory.COLLABORATION)}
        aria-label="Notificaciones de colaboración"
        aria-pressed={selectedCategory === NotificationCategory.COLLABORATION}
      >
        <FiUsers />
        <span>Colaboración</span>
        <CategoryCount>{getCategoryCount(NotificationCategory.COLLABORATION)}</CategoryCount>
      </CategoryButton>

      <CategoryButton
        $selected={selectedCategory === NotificationCategory.SYSTEM}
        onClick={() => handleCategoryChange(NotificationCategory.SYSTEM)}
        aria-label="Notificaciones del sistema"
        aria-pressed={selectedCategory === NotificationCategory.SYSTEM}
      >
        <FiAlertCircle />
        <span>Sistema</span>
        <CategoryCount>{getCategoryCount(NotificationCategory.SYSTEM)}</CategoryCount>
      </CategoryButton>
    </CategoriesContainer>
  );
};

// Estilos
const CategoriesContainer = styled.div`
  display: flex;
  overflow-x: auto;
  padding: 8px 16px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  background-color: ${({ theme }) => theme.background};

  /* Estilizar la barra de desplazamiento */
  &::-webkit-scrollbar {
    height: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => theme.border};
    border-radius: 2px;
  }

  @media (max-width: 768px) {
    padding: 8px;
  }
`;

const CategoryButton = styled.button<{ $selected: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  background-color: ${({ $selected, theme }) =>
    $selected ? theme.primaryLight : 'transparent'};
  color: ${({ $selected, theme }) =>
    $selected ? theme.primary : theme.textSecondary};
  font-size: 13px;
  font-weight: ${({ $selected }) => ($selected ? 600 : 400)};
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;

  &:hover {
    background-color: ${({ $selected, theme }) =>
      $selected ? theme.primaryLight : theme.backgroundHover};
    color: ${({ $selected, theme }) =>
      $selected ? theme.primary : theme.textPrimary};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${({ theme }) => theme.primaryLight};
  }

  @media (max-width: 768px) {
    padding: 6px 10px;
    font-size: 12px;
  }
`;

const CategoryCount = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.backgroundAlt};
  color: ${({ theme }) => theme.textSecondary};
  font-size: 11px;
  font-weight: 600;
`;

export default NotificationCategories;
