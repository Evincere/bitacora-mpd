import React, { useState } from 'react';
import styled from 'styled-components';
import {
  FiX,
  FiSettings,
  FiBell,
  FiMail,
  FiVolume2,
  FiSmartphone,
  FiClock,
  FiAlertTriangle,
  FiMessageSquare,
  FiUsers,
  FiInfo,
  FiCheck,
  FiZap
} from 'react-icons/fi';
import CompressionStats from '../WebSocket/CompressionStats';
import MessageQueueStatus from '../WebSocket/MessageQueueStatus';
import { UrgencyLevel } from '../../../types/notifications';

interface NotificationPreferencesProps {
  onClose: () => void;
}

interface NotificationPreference {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  enabled: boolean;
  methods: {
    email: boolean;
    push: boolean;
    sound: boolean;
  };
  urgencyLevel: UrgencyLevel;
}

const NotificationPreferences: React.FC<NotificationPreferencesProps> = ({ onClose }) => {
  const [preferences, setPreferences] = useState<NotificationPreference[]>([
    {
      id: 'task_assignment',
      label: 'Asignación de tareas',
      description: 'Recibir notificaciones cuando se te asigne una nueva tarea',
      icon: <FiCheck />,
      enabled: true,
      methods: {
        email: true,
        push: true,
        sound: true
      },
      urgencyLevel: UrgencyLevel.MEDIUM
    },
    {
      id: 'task_status',
      label: 'Cambios de estado',
      description: 'Recibir notificaciones cuando cambie el estado de una tarea',
      icon: <FiClock />,
      enabled: true,
      methods: {
        email: false,
        push: true,
        sound: false
      },
      urgencyLevel: UrgencyLevel.LOW
    },
    {
      id: 'deadline',
      label: 'Fechas límite',
      description: 'Recibir recordatorios de fechas límite próximas',
      icon: <FiAlertTriangle />,
      enabled: true,
      methods: {
        email: true,
        push: true,
        sound: true
      },
      urgencyLevel: UrgencyLevel.HIGH
    },
    {
      id: 'announcement',
      label: 'Anuncios',
      description: 'Recibir anuncios y comunicados importantes',
      icon: <FiMessageSquare />,
      enabled: true,
      methods: {
        email: true,
        push: true,
        sound: true
      },
      urgencyLevel: UrgencyLevel.MEDIUM
    },
    {
      id: 'collaboration',
      label: 'Colaboración',
      description: 'Recibir notificaciones sobre actividad colaborativa',
      icon: <FiUsers />,
      enabled: true,
      methods: {
        email: false,
        push: true,
        sound: false
      },
      urgencyLevel: UrgencyLevel.LOW
    },
    {
      id: 'system',
      label: 'Sistema',
      description: 'Recibir notificaciones sobre eventos del sistema',
      icon: <FiInfo />,
      enabled: true,
      methods: {
        email: false,
        push: true,
        sound: false
      },
      urgencyLevel: UrgencyLevel.LOW
    }
  ]);

  const [activeTab, setActiveTab] = useState<'notifications' | 'advanced'>('notifications');

  // Manejar cambios en las preferencias
  const handleToggleEnabled = (id: string) => {
    setPreferences(prev => prev.map(pref =>
      pref.id === id ? { ...pref, enabled: !pref.enabled } : pref
    ));
  };

  const handleToggleMethod = (id: string, method: 'email' | 'push' | 'sound') => {
    setPreferences(prev => prev.map(pref =>
      pref.id === id ? {
        ...pref,
        methods: {
          ...pref.methods,
          [method]: !pref.methods[method]
        }
      } : pref
    ));
  };

  const handleUrgencyChange = (id: string, urgencyLevel: UrgencyLevel) => {
    setPreferences(prev => prev.map(pref =>
      pref.id === id ? { ...pref, urgencyLevel } : pref
    ));
  };

  // Obtener el texto para el nivel de urgencia
  const getUrgencyText = (urgencyLevel: UrgencyLevel): string => {
    switch (urgencyLevel) {
      case UrgencyLevel.LOW:
        return 'Baja';
      case UrgencyLevel.MEDIUM:
        return 'Media';
      case UrgencyLevel.HIGH:
        return 'Alta';
      case UrgencyLevel.CRITICAL:
        return 'Crítica';
      default:
        return 'Media';
    }
  };

  // Obtener el color para el nivel de urgencia
  const getUrgencyColor = (urgencyLevel: UrgencyLevel): string => {
    switch (urgencyLevel) {
      case UrgencyLevel.LOW:
        return 'info';
      case UrgencyLevel.MEDIUM:
        return 'primary';
      case UrgencyLevel.HIGH:
        return 'warning';
      case UrgencyLevel.CRITICAL:
        return 'error';
      default:
        return 'primary';
    }
  };

  return (
    <Container>
      <Header>
        <Title>
          <FiSettings size={18} />
          <span>Preferencias de notificaciones</span>
        </Title>
        <CloseButton onClick={onClose}>
          <FiX size={20} />
        </CloseButton>
      </Header>

      <Tabs>
        <Tab
          $active={activeTab === 'notifications'}
          onClick={() => setActiveTab('notifications')}
        >
          <FiBell size={16} />
          <span>Notificaciones</span>
        </Tab>
        <Tab
          $active={activeTab === 'advanced'}
          onClick={() => setActiveTab('advanced')}
        >
          <FiSettings size={16} />
          <span>Avanzado</span>
        </Tab>
      </Tabs>

      <Content>
        {activeTab === 'notifications' ? (
          <>
            <Section>
              <SectionTitle>Tipos de notificaciones</SectionTitle>

              {preferences.map(pref => (
                <PreferenceItem key={pref.id}>
                  <PreferenceHeader>
                    <PreferenceIcon>{pref.icon}</PreferenceIcon>
                    <PreferenceInfo>
                      <PreferenceLabel>{pref.label}</PreferenceLabel>
                      <PreferenceDescription>{pref.description}</PreferenceDescription>
                    </PreferenceInfo>
                    <ToggleSwitch
                      $enabled={pref.enabled}
                      onClick={() => handleToggleEnabled(pref.id)}
                    >
                      <ToggleSlider $enabled={pref.enabled} />
                    </ToggleSwitch>
                  </PreferenceHeader>

                  {pref.enabled && (
                    <>
                      <PreferenceMethods>
                        <MethodButton
                          $active={pref.methods.email}
                          onClick={() => handleToggleMethod(pref.id, 'email')}
                          title="Notificaciones por email"
                        >
                          <FiMail size={16} />
                          <span>Email</span>
                        </MethodButton>

                        <MethodButton
                          $active={pref.methods.push}
                          onClick={() => handleToggleMethod(pref.id, 'push')}
                          title="Notificaciones push"
                        >
                          <FiSmartphone size={16} />
                          <span>Push</span>
                        </MethodButton>

                        <MethodButton
                          $active={pref.methods.sound}
                          onClick={() => handleToggleMethod(pref.id, 'sound')}
                          title="Sonidos de notificación"
                        >
                          <FiVolume2 size={16} />
                          <span>Sonido</span>
                        </MethodButton>
                      </PreferenceMethods>

                      <UrgencySection>
                        <UrgencyLabel>
                          <FiZap size={14} />
                          <span>Nivel de urgencia:</span>
                        </UrgencyLabel>

                        <UrgencyOptions>
                          {Object.values(UrgencyLevel).map(level => (
                            <UrgencyOption
                              key={level}
                              $active={pref.urgencyLevel === level}
                              $urgencyLevel={level}
                              onClick={() => handleUrgencyChange(pref.id, level)}
                            >
                              {getUrgencyText(level)}
                            </UrgencyOption>
                          ))}
                        </UrgencyOptions>
                      </UrgencySection>
                    </>
                  )}
                </PreferenceItem>
              ))}
            </Section>
          </>
        ) : (
          <>
            <Section>
              <SectionTitle>Configuración avanzada</SectionTitle>

              <CompressionStats showSettings={true} />

              <MessageQueueStatus showDetails={true} />

              <InfoBox>
                <FiInfo size={16} />
                <InfoText>
                  La compresión de mensajes reduce el consumo de datos y mejora el rendimiento,
                  especialmente en conexiones lentas o con mensajes grandes.
                </InfoText>
              </InfoBox>
            </Section>
          </>
        )}
      </Content>

      <Footer>
        <SaveButton onClick={onClose}>
          Guardar cambios
        </SaveButton>
      </Footer>
    </Container>
  );
};

// Estilos
const Container = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  background-color: ${({ theme }) => theme.backgroundSecondary};
  border-radius: 8px;
  box-shadow: ${({ theme }) => theme.shadow};
  display: flex;
  flex-direction: column;
  z-index: 1000;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.border};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

const Title = styled.h3`
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  color: ${({ theme }) => theme.textSecondary};

  &:hover {
    background-color: ${({ theme }) => theme.backgroundHover};
    color: ${({ theme }) => theme.text};
  }
`;

const Tabs = styled.div`
  display: flex;
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

const Tab = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  font-size: 14px;
  font-weight: ${({ $active }) => $active ? '500' : 'normal'};
  color: ${({ $active, theme }) => $active ? theme.primary : theme.textSecondary};
  border-bottom: 2px solid ${({ $active, theme }) => $active ? theme.primary : 'transparent'};

  &:hover {
    color: ${({ $active, theme }) => $active ? theme.primary : theme.text};
    background-color: ${({ theme }) => theme.backgroundHover};
  }
`;

const Content = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => theme.border};
    border-radius: 3px;
  }
`;

const Section = styled.div`
  margin-bottom: 24px;
`;

const SectionTitle = styled.h4`
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 16px;
  color: ${({ theme }) => theme.textSecondary};
`;

const PreferenceItem = styled.div`
  margin-bottom: 16px;
  padding: 16px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.backgroundAlt};
`;

const PreferenceHeader = styled.div`
  display: flex;
  align-items: center;
`;

const PreferenceIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.primaryLight};
  color: ${({ theme }) => theme.primary};
  margin-right: 12px;
`;

const PreferenceInfo = styled.div`
  flex: 1;
`;

const PreferenceLabel = styled.div`
  font-weight: 500;
  margin-bottom: 4px;
`;

const PreferenceDescription = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.textSecondary};
`;

const ToggleSwitch = styled.div<{ $enabled: boolean }>`
  position: relative;
  width: 40px;
  height: 20px;
  border-radius: 10px;
  background-color: ${({ $enabled, theme }) => $enabled ? theme.primary : theme.border};
  cursor: pointer;
  transition: background-color 0.2s;
`;

const ToggleSlider = styled.div<{ $enabled: boolean }>`
  position: absolute;
  top: 2px;
  left: ${({ $enabled }) => $enabled ? '22px' : '2px'};
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: white;
  transition: left 0.2s;
`;

const PreferenceMethods = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid ${({ theme }) => theme.border}40;
`;

const MethodButton = styled.button<{ $active: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px;
  border-radius: 4px;
  background-color: ${({ $active, theme }) => $active ? theme.primaryLight : 'transparent'};
  color: ${({ $active, theme }) => $active ? theme.primary : theme.textSecondary};
  font-size: 12px;

  &:hover {
    background-color: ${({ $active, theme }) => $active ? theme.primaryLight : theme.backgroundHover};
  }
`;

const UrgencySection = styled.div`
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid ${({ theme }) => theme.border}40;
`;

const UrgencyLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
  font-size: 12px;
  color: ${({ theme }) => theme.textSecondary};
`;

const UrgencyOptions = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const UrgencyOption = styled.button<{ $active: boolean; $urgencyLevel: UrgencyLevel }>`
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: ${({ $active }) => $active ? '600' : '400'};
  transition: all 0.2s;

  ${({ $urgencyLevel, $active, theme }) => {
    const level = getUrgencyColor($urgencyLevel);
    const color = theme[level];
    const bgColor = `${color}20`;

    if ($active) {
      return `
        background-color: ${color};
        color: white;
        box-shadow: 0 2px 4px ${color}40;
      `;
    } else {
      return `
        background-color: ${bgColor};
        color: ${color};

        &:hover {
          background-color: ${color}30;
        }
      `;
    }
  }}
`;

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 16px 20px;
  border-top: 1px solid ${({ theme }) => theme.border};
`;

const SaveButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background-color: ${({ theme }) => theme.primary};
  color: white;
  border-radius: 4px;
  font-weight: 500;

  &:hover {
    background-color: ${({ theme }) => theme.primaryDark};
  }
`;

const InfoBox = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.infoLight};
  color: ${({ theme }) => theme.info};
  margin-top: 16px;

  svg {
    flex-shrink: 0;
    margin-top: 2px;
  }
`;

const InfoText = styled.p`
  margin: 0;
  font-size: 13px;
  line-height: 1.5;
`;

export default NotificationPreferences;
