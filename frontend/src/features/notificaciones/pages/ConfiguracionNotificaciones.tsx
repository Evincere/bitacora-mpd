import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  FiBell,
  FiSettings,
  FiCheck,
  FiClock,
  FiMessageSquare,
  FiAlertCircle,
  FiInfo,
  FiMail,
  FiSmartphone,
  FiSave
} from 'react-icons/fi';
import { useToastContext } from '@/components/ui';
import { useUserNotificationPreferences, useUpdateUserNotificationPreferences } from '../hooks/useNotificationConfig';
import NotificationTemplates from '../components/NotificationTemplates';

const PageContainer = styled.div`
  padding: 0;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const PageTitle = styled.h1`
  font-size: 24px;
  margin: 0;
  color: ${({ theme }) => theme.text};
  display: flex;
  align-items: center;
  gap: 12px;
`;

const InfoBox = styled.div`
  background-color: ${({ theme }) => `${theme.info}10`};
  border-left: 3px solid ${({ theme }) => theme.info};
  padding: 16px;
  margin-bottom: 24px;
  border-radius: 4px;
  display: flex;
  align-items: flex-start;
  gap: 12px;

  .icon {
    color: ${({ theme }) => theme.info};
    margin-top: 2px;
  }

  .content {
    flex: 1;

    h4 {
      margin: 0 0 8px;
      font-size: 16px;
      color: ${({ theme }) => theme.text};
    }

    p {
      margin: 0;
      font-size: 14px;
      color: ${({ theme }) => theme.textSecondary};
    }
  }
`;

const ConfigSection = styled.div`
  background-color: ${({ theme }) => theme.backgroundSecondary};
  border-radius: 8px;
  box-shadow: ${({ theme }) => theme.shadow};
  margin-bottom: 24px;
  overflow: hidden;
`;

const SectionHeader = styled.div`
  padding: 16px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

const SectionTitle = styled.h2`
  margin: 0;
  font-size: 18px;
  color: ${({ theme }) => theme.text};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SectionContent = styled.div`
  padding: 16px;
`;

const NotificationTypeList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const NotificationType = styled.div`
  padding: 16px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.backgroundAlt};

  &:hover {
    background-color: ${({ theme }) => theme.backgroundHover};
  }
`;

const TypeHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const TypeTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  color: ${({ theme }) => theme.text};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const TypeDescription = styled.p`
  margin: 0 0 16px;
  font-size: 14px;
  color: ${({ theme }) => theme.textSecondary};
`;

const ChannelsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
`;

const ChannelOption = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ChannelLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  color: ${({ theme }) => theme.text};
`;

const ChannelIcon = styled.div`
  color: ${({ theme }) => theme.textSecondary};
`;

const Checkbox = styled.input`
  cursor: pointer;
  width: 16px;
  height: 16px;
`;

const SaveButton = styled.button`
  padding: 10px 16px;
  border-radius: 4px;
  font-weight: 500;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  background-color: ${({ theme }) => theme.primary};
  color: white;
  border: none;
  transition: all 0.2s;
  margin-top: 24px;

  &:hover {
    background-color: ${({ theme }) => theme.primaryDark};
  }
`;

const ConfiguracionNotificaciones: React.FC = () => {
  const { showSuccess, showError } = useToastContext();
  const { data: userPreferences, isLoading, isError } = useUserNotificationPreferences();
  const updatePreferences = useUpdateUserNotificationPreferences();

  // Estado local para las preferencias de notificaciones
  const [preferencias, setPreferencias] = useState({
    asignacion: {
      app: true,
      email: true,
      push: true
    },
    cambioEstado: {
      app: true,
      email: false,
      push: true
    },
    fechaLimite: {
      app: true,
      email: true,
      push: true
    },
    comentario: {
      app: true,
      email: false,
      push: false
    },
    sistema: {
      app: true,
      email: true,
      push: false
    }
  });

  // Actualizar el estado local cuando se cargan las preferencias del usuario
  useEffect(() => {
    if (userPreferences && userPreferences.types) {
      setPreferencias(userPreferences.types);
    }
  }, [userPreferences]);

  const handleToggleChannel = (tipo: string, canal: string) => {
    setPreferencias({
      ...preferencias,
      [tipo]: {
        ...preferencias[tipo as keyof typeof preferencias],
        [canal]: !preferencias[tipo as keyof typeof preferencias][canal as keyof typeof preferencias[keyof typeof preferencias]]
      }
    });
  };

  const handleSavePreferences = async () => {
    try {
      await updatePreferences.mutateAsync({ types: preferencias });
    } catch (error) {
      console.error('Error al guardar preferencias:', error);
    }
  };

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>
          <FiSettings size={24} />
          Configuración de Notificaciones
        </PageTitle>
      </PageHeader>

      <InfoBox>
        <div className="icon">
          <FiInfo size={20} />
        </div>
        <div className="content">
          <h4>Personaliza tus notificaciones</h4>
          <p>
            Configura qué notificaciones deseas recibir y a través de qué canales. Puedes elegir entre
            recibir notificaciones en la aplicación, por correo electrónico o como notificaciones push
            en tu dispositivo móvil.
          </p>
        </div>
      </InfoBox>

      <ConfigSection>
        <SectionHeader>
          <SectionTitle>
            <FiBell size={18} />
            Tipos de Notificaciones
          </SectionTitle>
        </SectionHeader>
        <SectionContent>
          <NotificationTypeList>
            <NotificationType>
              <TypeHeader>
                <TypeTitle>
                  <FiCheck size={16} />
                  Asignación de Tareas
                </TypeTitle>
              </TypeHeader>
              <TypeDescription>
                Recibe notificaciones cuando se te asigne una nueva tarea o cuando seas designado como responsable de una actividad.
              </TypeDescription>
              <ChannelsGrid>
                <ChannelOption>
                  <Checkbox
                    type="checkbox"
                    id="asignacion-app"
                    checked={preferencias.asignacion.app}
                    onChange={() => handleToggleChannel('asignacion', 'app')}
                  />
                  <ChannelLabel htmlFor="asignacion-app">
                    <ChannelIcon>
                      <FiBell size={14} />
                    </ChannelIcon>
                    En la aplicación
                  </ChannelLabel>
                </ChannelOption>
                <ChannelOption>
                  <Checkbox
                    type="checkbox"
                    id="asignacion-email"
                    checked={preferencias.asignacion.email}
                    onChange={() => handleToggleChannel('asignacion', 'email')}
                  />
                  <ChannelLabel htmlFor="asignacion-email">
                    <ChannelIcon>
                      <FiMail size={14} />
                    </ChannelIcon>
                    Correo electrónico
                  </ChannelLabel>
                </ChannelOption>
                <ChannelOption>
                  <Checkbox
                    type="checkbox"
                    id="asignacion-push"
                    checked={preferencias.asignacion.push}
                    onChange={() => handleToggleChannel('asignacion', 'push')}
                  />
                  <ChannelLabel htmlFor="asignacion-push">
                    <ChannelIcon>
                      <FiSmartphone size={14} />
                    </ChannelIcon>
                    Notificación push
                  </ChannelLabel>
                </ChannelOption>
              </ChannelsGrid>
            </NotificationType>

            <NotificationType>
              <TypeHeader>
                <TypeTitle>
                  <FiInfo size={16} />
                  Cambios de Estado
                </TypeTitle>
              </TypeHeader>
              <TypeDescription>
                Recibe notificaciones cuando cambie el estado de una tarea en la que estés involucrado (asignada, en progreso, completada, etc.).
              </TypeDescription>
              <ChannelsGrid>
                <ChannelOption>
                  <Checkbox
                    type="checkbox"
                    id="cambioEstado-app"
                    checked={preferencias.cambioEstado.app}
                    onChange={() => handleToggleChannel('cambioEstado', 'app')}
                  />
                  <ChannelLabel htmlFor="cambioEstado-app">
                    <ChannelIcon>
                      <FiBell size={14} />
                    </ChannelIcon>
                    En la aplicación
                  </ChannelLabel>
                </ChannelOption>
                <ChannelOption>
                  <Checkbox
                    type="checkbox"
                    id="cambioEstado-email"
                    checked={preferencias.cambioEstado.email}
                    onChange={() => handleToggleChannel('cambioEstado', 'email')}
                  />
                  <ChannelLabel htmlFor="cambioEstado-email">
                    <ChannelIcon>
                      <FiMail size={14} />
                    </ChannelIcon>
                    Correo electrónico
                  </ChannelLabel>
                </ChannelOption>
                <ChannelOption>
                  <Checkbox
                    type="checkbox"
                    id="cambioEstado-push"
                    checked={preferencias.cambioEstado.push}
                    onChange={() => handleToggleChannel('cambioEstado', 'push')}
                  />
                  <ChannelLabel htmlFor="cambioEstado-push">
                    <ChannelIcon>
                      <FiSmartphone size={14} />
                    </ChannelIcon>
                    Notificación push
                  </ChannelLabel>
                </ChannelOption>
              </ChannelsGrid>
            </NotificationType>

            <NotificationType>
              <TypeHeader>
                <TypeTitle>
                  <FiClock size={16} />
                  Fechas Límite
                </TypeTitle>
              </TypeHeader>
              <TypeDescription>
                Recibe recordatorios cuando se acerque la fecha límite de tus tareas (1 día, 4 horas, 1 hora antes).
              </TypeDescription>
              <ChannelsGrid>
                <ChannelOption>
                  <Checkbox
                    type="checkbox"
                    id="fechaLimite-app"
                    checked={preferencias.fechaLimite.app}
                    onChange={() => handleToggleChannel('fechaLimite', 'app')}
                  />
                  <ChannelLabel htmlFor="fechaLimite-app">
                    <ChannelIcon>
                      <FiBell size={14} />
                    </ChannelIcon>
                    En la aplicación
                  </ChannelLabel>
                </ChannelOption>
                <ChannelOption>
                  <Checkbox
                    type="checkbox"
                    id="fechaLimite-email"
                    checked={preferencias.fechaLimite.email}
                    onChange={() => handleToggleChannel('fechaLimite', 'email')}
                  />
                  <ChannelLabel htmlFor="fechaLimite-email">
                    <ChannelIcon>
                      <FiMail size={14} />
                    </ChannelIcon>
                    Correo electrónico
                  </ChannelLabel>
                </ChannelOption>
                <ChannelOption>
                  <Checkbox
                    type="checkbox"
                    id="fechaLimite-push"
                    checked={preferencias.fechaLimite.push}
                    onChange={() => handleToggleChannel('fechaLimite', 'push')}
                  />
                  <ChannelLabel htmlFor="fechaLimite-push">
                    <ChannelIcon>
                      <FiSmartphone size={14} />
                    </ChannelIcon>
                    Notificación push
                  </ChannelLabel>
                </ChannelOption>
              </ChannelsGrid>
            </NotificationType>

            <NotificationType>
              <TypeHeader>
                <TypeTitle>
                  <FiMessageSquare size={16} />
                  Comentarios
                </TypeTitle>
              </TypeHeader>
              <TypeDescription>
                Recibe notificaciones cuando alguien comente en una tarea en la que estés involucrado o cuando te mencionen en un comentario.
              </TypeDescription>
              <ChannelsGrid>
                <ChannelOption>
                  <Checkbox
                    type="checkbox"
                    id="comentario-app"
                    checked={preferencias.comentario.app}
                    onChange={() => handleToggleChannel('comentario', 'app')}
                  />
                  <ChannelLabel htmlFor="comentario-app">
                    <ChannelIcon>
                      <FiBell size={14} />
                    </ChannelIcon>
                    En la aplicación
                  </ChannelLabel>
                </ChannelOption>
                <ChannelOption>
                  <Checkbox
                    type="checkbox"
                    id="comentario-email"
                    checked={preferencias.comentario.email}
                    onChange={() => handleToggleChannel('comentario', 'email')}
                  />
                  <ChannelLabel htmlFor="comentario-email">
                    <ChannelIcon>
                      <FiMail size={14} />
                    </ChannelIcon>
                    Correo electrónico
                  </ChannelLabel>
                </ChannelOption>
                <ChannelOption>
                  <Checkbox
                    type="checkbox"
                    id="comentario-push"
                    checked={preferencias.comentario.push}
                    onChange={() => handleToggleChannel('comentario', 'push')}
                  />
                  <ChannelLabel htmlFor="comentario-push">
                    <ChannelIcon>
                      <FiSmartphone size={14} />
                    </ChannelIcon>
                    Notificación push
                  </ChannelLabel>
                </ChannelOption>
              </ChannelsGrid>
            </NotificationType>

            <NotificationType>
              <TypeHeader>
                <TypeTitle>
                  <FiAlertCircle size={16} />
                  Sistema
                </TypeTitle>
              </TypeHeader>
              <TypeDescription>
                Recibe notificaciones sobre eventos del sistema, como inicios de sesión en nuevos dispositivos, actualizaciones de la aplicación, etc.
              </TypeDescription>
              <ChannelsGrid>
                <ChannelOption>
                  <Checkbox
                    type="checkbox"
                    id="sistema-app"
                    checked={preferencias.sistema.app}
                    onChange={() => handleToggleChannel('sistema', 'app')}
                  />
                  <ChannelLabel htmlFor="sistema-app">
                    <ChannelIcon>
                      <FiBell size={14} />
                    </ChannelIcon>
                    En la aplicación
                  </ChannelLabel>
                </ChannelOption>
                <ChannelOption>
                  <Checkbox
                    type="checkbox"
                    id="sistema-email"
                    checked={preferencias.sistema.email}
                    onChange={() => handleToggleChannel('sistema', 'email')}
                  />
                  <ChannelLabel htmlFor="sistema-email">
                    <ChannelIcon>
                      <FiMail size={14} />
                    </ChannelIcon>
                    Correo electrónico
                  </ChannelLabel>
                </ChannelOption>
                <ChannelOption>
                  <Checkbox
                    type="checkbox"
                    id="sistema-push"
                    checked={preferencias.sistema.push}
                    onChange={() => handleToggleChannel('sistema', 'push')}
                  />
                  <ChannelLabel htmlFor="sistema-push">
                    <ChannelIcon>
                      <FiSmartphone size={14} />
                    </ChannelIcon>
                    Notificación push
                  </ChannelLabel>
                </ChannelOption>
              </ChannelsGrid>
            </NotificationType>
          </NotificationTypeList>

          <SaveButton onClick={handleSavePreferences}>
            <FiSave size={16} />
            Guardar preferencias
          </SaveButton>
        </SectionContent>
      </ConfigSection>

      {/* Componente de plantillas de notificación */}
      <NotificationTemplates />
    </PageContainer>
  );
};

export default ConfiguracionNotificaciones;
