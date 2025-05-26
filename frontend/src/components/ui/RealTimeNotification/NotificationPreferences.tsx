import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiBell, FiSave, FiX, FiCheck, FiAlertCircle, FiInfo, FiClock, FiUser, FiMessageSquare, FiUsers } from 'react-icons/fi';
import { NotificationType } from '@/core/types/notifications';

// Interfaz para las preferencias de notificaciones
interface NotificationPreference {
  type: NotificationType | string;
  enabled: boolean;
  email: boolean;
  push: boolean;
  sound: boolean;
}

// Propiedades del componente
interface NotificationPreferencesProps {
  onClose: () => void;
  onSave: (preferences: NotificationPreference[]) => void;
  initialPreferences?: NotificationPreference[];
}

// Componente principal
const NotificationPreferences: React.FC<NotificationPreferencesProps> = ({
  onClose,
  onSave,
  initialPreferences
}) => {
  // Estado para las preferencias
  const [preferences, setPreferences] = useState<NotificationPreference[]>(
    initialPreferences || [
      {
        type: NotificationType.TASK_ASSIGNMENT,
        enabled: true,
        email: true,
        push: true,
        sound: true
      },
      {
        type: NotificationType.TASK_STATUS_CHANGE,
        enabled: true,
        email: false,
        push: true,
        sound: true
      },
      {
        type: NotificationType.DEADLINE_REMINDER,
        enabled: true,
        email: true,
        push: true,
        sound: true
      },
      {
        type: NotificationType.ANNOUNCEMENT,
        enabled: true,
        email: true,
        push: true,
        sound: true
      },
      {
        type: NotificationType.COLLABORATION,
        enabled: true,
        email: false,
        push: true,
        sound: false
      },
      {
        type: NotificationType.SUCCESS,
        enabled: true,
        email: false,
        push: true,
        sound: false
      },
      {
        type: NotificationType.ERROR,
        enabled: true,
        email: false,
        push: true,
        sound: true
      },
      {
        type: NotificationType.WARNING,
        enabled: true,
        email: false,
        push: true,
        sound: true
      },
      {
        type: NotificationType.INFO,
        enabled: true,
        email: false,
        push: true,
        sound: false
      }
    ]
  );

  // Estado para el mensaje de guardado
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // Obtener el nombre del tipo de notificación
  const getTypeName = (type: NotificationType | string): string => {
    switch (type) {
      case NotificationType.TASK_ASSIGNMENT:
        return 'Asignación de tareas';
      case NotificationType.TASK_STATUS_CHANGE:
        return 'Cambio de estado de tareas';
      case NotificationType.DEADLINE_REMINDER:
        return 'Recordatorios de fechas límite';
      case NotificationType.ANNOUNCEMENT:
        return 'Anuncios y comunicados';
      case NotificationType.COLLABORATION:
        return 'Colaboración en tiempo real';
      case NotificationType.SUCCESS:
        return 'Éxito';
      case NotificationType.ERROR:
        return 'Error';
      case NotificationType.WARNING:
        return 'Advertencia';
      case NotificationType.INFO:
        return 'Información';
      default:
        return 'Desconocido';
    }
  };

  // Obtener el icono del tipo de notificación
  const getTypeIcon = (type: NotificationType | string): React.ReactNode => {
    switch (type) {
      case NotificationType.TASK_ASSIGNMENT:
        return <FiUser />;
      case NotificationType.TASK_STATUS_CHANGE:
        return <FiCheck />;
      case NotificationType.DEADLINE_REMINDER:
        return <FiClock />;
      case NotificationType.ANNOUNCEMENT:
        return <FiMessageSquare />;
      case NotificationType.COLLABORATION:
        return <FiUsers />;
      case NotificationType.SUCCESS:
        return <FiCheck />;
      case NotificationType.ERROR:
        return <FiAlertCircle />;
      case NotificationType.WARNING:
        return <FiAlertCircle />;
      case NotificationType.INFO:
        return <FiInfo />;
      default:
        return <FiBell />;
    }
  };

  // Manejar cambios en las preferencias
  const handleToggle = (index: number, field: keyof NotificationPreference) => {
    const newPreferences = [...preferences];
    newPreferences[index] = {
      ...newPreferences[index],
      [field]: !newPreferences[index][field]
    };
    setPreferences(newPreferences);
  };

  // Guardar las preferencias
  const handleSave = () => {
    onSave(preferences);
    setSaveMessage('Preferencias guardadas correctamente');
    setTimeout(() => {
      setSaveMessage(null);
    }, 3000);
  };

  return (
    <PreferencesContainer>
      <PreferencesHeader>
        <PreferencesTitle>Preferencias de notificaciones</PreferencesTitle>
        <CloseButton onClick={onClose} aria-label="Cerrar">
          <FiX />
        </CloseButton>
      </PreferencesHeader>

      <PreferencesContent>
        <PreferencesTable>
          <thead>
            <tr>
              <TableHeader>Tipo de notificación</TableHeader>
              <TableHeader>Activado</TableHeader>
              <TableHeader>Email</TableHeader>
              <TableHeader>Push</TableHeader>
              <TableHeader>Sonido</TableHeader>
            </tr>
          </thead>
          <tbody>
            {preferences.map((pref, index) => (
              <TableRow key={pref.type}>
                <TableCell>
                  <TypeInfo>
                    <TypeIcon $type={pref.type}>{getTypeIcon(pref.type)}</TypeIcon>
                    <span>{getTypeName(pref.type)}</span>
                  </TypeInfo>
                </TableCell>
                <TableCell>
                  <ToggleSwitch
                    $checked={pref.enabled}
                    onClick={() => handleToggle(index, 'enabled')}
                    role="switch"
                    aria-checked={pref.enabled}
                    tabIndex={0}
                  >
                    <ToggleSlider $checked={pref.enabled} />
                  </ToggleSwitch>
                </TableCell>
                <TableCell>
                  <Checkbox
                    $checked={pref.email}
                    onClick={() => handleToggle(index, 'email')}
                    disabled={!pref.enabled}
                    role="checkbox"
                    aria-checked={pref.email && pref.enabled}
                    tabIndex={0}
                  >
                    {pref.email && pref.enabled && <FiCheck />}
                  </Checkbox>
                </TableCell>
                <TableCell>
                  <Checkbox
                    $checked={pref.push}
                    onClick={() => handleToggle(index, 'push')}
                    disabled={!pref.enabled}
                    role="checkbox"
                    aria-checked={pref.push && pref.enabled}
                    tabIndex={0}
                  >
                    {pref.push && pref.enabled && <FiCheck />}
                  </Checkbox>
                </TableCell>
                <TableCell>
                  <Checkbox
                    $checked={pref.sound}
                    onClick={() => handleToggle(index, 'sound')}
                    disabled={!pref.enabled}
                    role="checkbox"
                    aria-checked={pref.sound && pref.enabled}
                    tabIndex={0}
                  >
                    {pref.sound && pref.enabled && <FiCheck />}
                  </Checkbox>
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </PreferencesTable>
      </PreferencesContent>

      <PreferencesFooter>
        {saveMessage && (
          <SaveMessage>
            <FiCheck />
            {saveMessage}
          </SaveMessage>
        )}
        <SaveButton onClick={handleSave}>
          <FiSave />
          Guardar preferencias
        </SaveButton>
      </PreferencesFooter>
    </PreferencesContainer>
  );
};

// Estilos
const PreferencesContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  overflow: hidden;
`;

const PreferencesHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const PreferencesTitle = styled.h2`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: 4px;

  &:hover {
    background-color: ${({ theme }) => theme.colors.backgroundHover};
    color: ${({ theme }) => theme.colors.textPrimary};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primaryLight};
  }
`;

const PreferencesContent = styled.div`
  padding: 24px;
  max-height: 500px;
  overflow-y: auto;

  /* Estilizar la barra de desplazamiento */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.background};
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => theme.colors.border};
    border-radius: 3px;
  }
`;

const PreferencesTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.th`
  text-align: left;
  padding: 12px 16px;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textSecondary};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const TableRow = styled.tr`
  &:hover {
    background-color: ${({ theme }) => theme.colors.backgroundHover};
  }
`;

const TableCell = styled.td`
  padding: 12px 16px;
  font-size: 14px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderLight};
`;

const TypeInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const TypeIcon = styled.div<{ $type: string }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ $type, theme }) => {
    switch ($type) {
      case NotificationType.SUCCESS:
        return theme.colors.successLight;
      case NotificationType.ERROR:
        return theme.colors.errorLight;
      case NotificationType.WARNING:
        return theme.colors.warningLight;
      case NotificationType.INFO:
        return theme.colors.infoLight;
      case NotificationType.TASK_ASSIGNMENT:
        return theme.colors.primaryLight;
      case NotificationType.TASK_STATUS_CHANGE:
        return theme.colors.secondaryLight;
      case NotificationType.DEADLINE_REMINDER:
        return theme.colors.warningLight;
      case NotificationType.ANNOUNCEMENT:
        return theme.colors.infoLight;
      case NotificationType.COLLABORATION:
        return theme.colors.tertiaryLight;
      default:
        return theme.colors.backgroundAlt;
    }
  }};
  color: ${({ $type, theme }) => {
    switch ($type) {
      case NotificationType.SUCCESS:
        return theme.colors.success;
      case NotificationType.ERROR:
        return theme.colors.error;
      case NotificationType.WARNING:
        return theme.colors.warning;
      case NotificationType.INFO:
        return theme.colors.info;
      case NotificationType.TASK_ASSIGNMENT:
        return theme.colors.primary;
      case NotificationType.TASK_STATUS_CHANGE:
        return theme.colors.secondary;
      case NotificationType.DEADLINE_REMINDER:
        return theme.colors.warning;
      case NotificationType.ANNOUNCEMENT:
        return theme.colors.info;
      case NotificationType.COLLABORATION:
        return theme.colors.tertiary;
      default:
        return theme.colors.text;
    }
  }};
  flex-shrink: 0;
`;

const ToggleSwitch = styled.div<{ $checked: boolean }>`
  position: relative;
  width: 40px;
  height: 20px;
  background-color: ${({ $checked, theme }) =>
    $checked ? theme.colors.primary : theme.colors.border};
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primaryLight};
  }
`;

const ToggleSlider = styled.div<{ $checked: boolean }>`
  position: absolute;
  top: 2px;
  left: ${({ $checked }) => ($checked ? '22px' : '2px')};
  width: 16px;
  height: 16px;
  background-color: white;
  border-radius: 50%;
  transition: left 0.2s;
`;

const Checkbox = styled.div<{ $checked: boolean; disabled?: boolean }>`
  width: 20px;
  height: 20px;
  border: 2px solid ${({ $checked, disabled, theme }) =>
    disabled ? theme.colors.borderLight :
    $checked ? theme.colors.primary : theme.colors.border};
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  background-color: ${({ $checked, disabled, theme }) =>
    disabled ? theme.colors.backgroundDisabled :
    $checked ? theme.colors.primaryLight : 'transparent'};
  color: ${({ theme }) => theme.colors.primary};
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  transition: all 0.2s;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primaryLight};
  }
`;

const PreferencesFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.background};
`;

const SaveButton = styled.button`
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryDark};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primaryLight};
  }
`;

const SaveMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${({ theme }) => theme.colors.success};
  font-size: 14px;
`;

export default NotificationPreferences;
