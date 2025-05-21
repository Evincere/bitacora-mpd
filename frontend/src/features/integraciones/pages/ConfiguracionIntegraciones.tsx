import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  FiLink,
  FiCalendar,
  FiHardDrive,
  FiInfo,
  FiCheck,
  FiX,
  FiLogIn,
  FiLogOut,
  FiSettings,
  FiSave,
  FiRefreshCw,
  FiLoader
} from 'react-icons/fi';
import { useToastContext } from '@/components/ui';
import { useIntegrations, useToggleIntegration, useSyncIntegration } from '../hooks/useIntegrations';
import { realCalendarIntegrationService } from '../services/RealCalendarIntegrationService';
import { realDriveIntegrationService } from '../services/RealDriveIntegrationService';
import SyncHistory from '../components/SyncHistory';
import ConnectionTest from '../components/ConnectionTest';
import { calendarIntegrationService as mockCalendarIntegrationService, CalendarIntegrationConfig } from '../services/CalendarIntegrationService';
import { driveIntegrationService as mockDriveIntegrationService, DriveIntegrationConfig } from '../services/DriveIntegrationService';

// Usar los servicios reales o mock según el entorno
const calendarIntegrationService = process.env.NODE_ENV === 'production'
  ? realCalendarIntegrationService
  : mockCalendarIntegrationService;

const driveIntegrationService = process.env.NODE_ENV === 'production'
  ? realDriveIntegrationService
  : mockDriveIntegrationService;

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

const IntegrationGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const IntegrationCard = styled.div`
  background-color: ${({ theme }) => theme.backgroundSecondary};
  border-radius: 8px;
  box-shadow: ${({ theme }) => theme.shadow};
  overflow: hidden;
`;

const CardHeader = styled.div`
  padding: 16px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CardTitle = styled.h2`
  margin: 0;
  font-size: 18px;
  color: ${({ theme }) => theme.text};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CardStatus = styled.div<{ $authenticated: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 500;
  color: ${({ $authenticated, theme }) => $authenticated ? theme.success : theme.error};
`;

const CardContent = styled.div`
  padding: 16px;
`;

const AuthSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background-color: ${({ theme }) => theme.backgroundAlt};
  border-radius: 8px;
  margin-bottom: 24px;
`;

const AuthStatus = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const AuthTitle = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
`;

const AuthDescription = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.textSecondary};
`;

const Button = styled.button<{ $primary?: boolean; $danger?: boolean }>`
  padding: 10px 16px;
  border-radius: 4px;
  font-weight: 500;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s;

  ${({ $primary, $danger, theme }) => {
    if ($primary) {
      return `
        background-color: ${theme.primary};
        color: white;
        border: none;

        &:hover {
          background-color: ${theme.primaryDark};
        }
      `;
    } else if ($danger) {
      return `
        background-color: ${theme.error};
        color: white;
        border: none;

        &:hover {
          background-color: ${theme.errorDark || '#c82333'};
        }
      `;
    } else {
      return `
        background-color: transparent;
        color: ${theme.textSecondary};
        border: 1px solid ${theme.border};

        &:hover {
          background-color: ${theme.backgroundHover};
        }
      `;
    }
  }}
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 12px;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.border};
  background-color: ${({ theme }) => theme.backgroundInput};
  color: ${({ theme }) => theme.text};
  font-size: 14px;
  transition: border-color 0.2s;

  &:focus {
    border-color: ${({ theme }) => theme.primary};
    outline: none;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 10px 12px;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.border};
  background-color: ${({ theme }) => theme.backgroundInput};
  color: ${({ theme }) => theme.text};
  font-size: 14px;
  transition: border-color 0.2s;

  &:focus {
    border-color: ${({ theme }) => theme.primary};
    outline: none;
  }
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
`;

const Checkbox = styled.input`
  width: 16px;
  height: 16px;
  cursor: pointer;
`;

const CheckboxLabel = styled.label`
  font-size: 14px;
  color: ${({ theme }) => theme.text};
  cursor: pointer;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
`;

const ConfiguracionIntegraciones: React.FC = () => {
  const { showSuccess, showError } = useToastContext();
  const { data: integrations, isLoading: isLoadingIntegrations } = useIntegrations();
  const toggleIntegration = useToggleIntegration();
  const syncIntegration = useSyncIntegration();

  // Estado para Google Calendar
  const [calendarAuthenticated, setCalendarAuthenticated] = useState(false);
  const [calendarConfig, setCalendarConfig] = useState<CalendarIntegrationConfig>({
    calendarId: 'primary',
    syncEnabled: false,
    syncDirection: 'one-way',
    eventMapping: {
      title: '{title}',
      description: '{description}',
      location: '{location}'
    },
    notifyAttendees: false
  });

  // Estado para Google Drive
  const [driveAuthenticated, setDriveAuthenticated] = useState(false);
  const [driveConfig, setDriveConfig] = useState<DriveIntegrationConfig>({
    rootFolderId: 'root',
    createActivityFolders: true,
    organizeFoldersByType: true,
    defaultPermissions: 'private',
    autoSync: false,
    syncFrequency: 60
  });

  // Cargar estado de autenticación y configuración al montar el componente
  useEffect(() => {
    const loadCalendarState = async () => {
      try {
        // Inicializar el servicio si es necesario
        if ('initialize' in calendarIntegrationService) {
          await (calendarIntegrationService as any).initialize();
        }

        const isAuthenticated = await calendarIntegrationService.isAuthenticated();
        setCalendarAuthenticated(isAuthenticated);

        if (isAuthenticated) {
          const config = await calendarIntegrationService.getConfig();
          setCalendarConfig(config);
        }
      } catch (error) {
        console.error('Error al cargar el estado de Google Calendar:', error);
      }
    };

    const loadDriveState = async () => {
      try {
        // Inicializar el servicio si es necesario
        if ('initialize' in driveIntegrationService) {
          await (driveIntegrationService as any).initialize();
        }

        const isAuthenticated = await driveIntegrationService.isAuthenticated();
        setDriveAuthenticated(isAuthenticated);

        if (isAuthenticated) {
          const config = await driveIntegrationService.getConfig();
          setDriveConfig(config);
        }
      } catch (error) {
        console.error('Error al cargar el estado de Google Drive:', error);
      }
    };

    loadCalendarState();
    loadDriveState();
  }, []);

  // Funciones para Google Calendar
  const handleCalendarLogin = async () => {
    try {
      await calendarIntegrationService.authenticate();
      setCalendarAuthenticated(true);
      showSuccess('Autenticación con Google Calendar exitosa');

      // Actualizar la configuración después de la autenticación
      const config = await calendarIntegrationService.getConfig();
      setCalendarConfig(config);
    } catch (error) {
      console.error('Error al autenticar con Google Calendar:', error);
      showError('Error al autenticar con Google Calendar');
    }
  };

  const handleCalendarLogout = async () => {
    try {
      await calendarIntegrationService.logout();
      setCalendarAuthenticated(false);
      showSuccess('Sesión cerrada con Google Calendar');
    } catch (error) {
      console.error('Error al cerrar sesión con Google Calendar:', error);
      showError('Error al cerrar sesión con Google Calendar');
    }
  };

  const handleCalendarSync = async () => {
    try {
      // Usar el hook de sincronización si está disponible
      if (integrations?.find(i => i.id === 'google-calendar')) {
        await syncIntegration.mutateAsync('google-calendar');
      } else {
        // Fallback al método directo
        const result = await calendarIntegrationService.syncEvents();
        showSuccess(`Sincronización completada: ${result.created} creados, ${result.updated} actualizados, ${result.deleted} eliminados`);
      }
    } catch (error) {
      console.error('Error al sincronizar con Google Calendar:', error);
      showError('Error al sincronizar con Google Calendar');
    }
  };

  const handleSaveCalendarConfig = async () => {
    try {
      await calendarIntegrationService.updateConfig(calendarConfig);
      showSuccess('Configuración de Google Calendar guardada');
    } catch (error) {
      console.error('Error al guardar la configuración de Google Calendar:', error);
      showError('Error al guardar la configuración de Google Calendar');
    }
  };

  // Funciones para Google Drive
  const handleDriveLogin = async () => {
    try {
      await driveIntegrationService.authenticate();
      setDriveAuthenticated(true);
      showSuccess('Autenticación con Google Drive exitosa');

      // Actualizar la configuración después de la autenticación
      const config = await driveIntegrationService.getConfig();
      setDriveConfig(config);
    } catch (error) {
      console.error('Error al autenticar con Google Drive:', error);
      showError('Error al autenticar con Google Drive');
    }
  };

  const handleDriveLogout = async () => {
    try {
      await driveIntegrationService.logout();
      setDriveAuthenticated(false);
      showSuccess('Sesión cerrada con Google Drive');
    } catch (error) {
      console.error('Error al cerrar sesión con Google Drive:', error);
      showError('Error al cerrar sesión con Google Drive');
    }
  };

  const handleDriveSync = async () => {
    try {
      // Usar el hook de sincronización si está disponible
      if (integrations?.find(i => i.id === 'google-drive')) {
        await syncIntegration.mutateAsync('google-drive');
      } else {
        // Fallback al método directo
        const result = await driveIntegrationService.syncFiles();
        showSuccess(`Sincronización completada: ${result.uploaded} subidos, ${result.downloaded} descargados, ${result.deleted} eliminados`);
      }
    } catch (error) {
      console.error('Error al sincronizar con Google Drive:', error);
      showError('Error al sincronizar con Google Drive');
    }
  };

  const handleSaveDriveConfig = async () => {
    try {
      await driveIntegrationService.updateConfig(driveConfig);
      showSuccess('Configuración de Google Drive guardada');
    } catch (error) {
      console.error('Error al guardar la configuración de Google Drive:', error);
      showError('Error al guardar la configuración de Google Drive');
    }
  };

  // Función para habilitar/deshabilitar una integración
  const handleToggleIntegration = async (id: string, enabled: boolean) => {
    try {
      await toggleIntegration.mutateAsync({ id, enabled });
    } catch (error) {
      console.error(`Error al ${enabled ? 'habilitar' : 'deshabilitar'} la integración:`, error);
    }
  };

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>
          <FiLink size={24} />
          Configuración de Integraciones
        </PageTitle>
      </PageHeader>

      <InfoBox>
        <div className="icon">
          <FiInfo size={20} />
        </div>
        <div className="content">
          <h4>Integraciones con servicios externos</h4>
          <p>
            Configure las integraciones con Google Calendar y Google Drive para sincronizar actividades y archivos.
            Estas integraciones permiten mantener sus calendarios y documentos actualizados automáticamente.
          </p>
        </div>
      </InfoBox>

      <IntegrationGrid>
        {/* Google Calendar */}
        <IntegrationCard>
          <CardHeader>
            <CardTitle>
              <FiCalendar size={18} />
              Google Calendar
            </CardTitle>
            <CardStatus $authenticated={calendarAuthenticated}>
              {calendarAuthenticated ? (
                <>
                  <FiCheck size={16} />
                  Conectado
                </>
              ) : (
                <>
                  <FiX size={16} />
                  No conectado
                </>
              )}
            </CardStatus>
          </CardHeader>

          <CardContent>
            <AuthSection>
              <AuthStatus>
                <AuthTitle>Estado de autenticación</AuthTitle>
                <AuthDescription>
                  {calendarAuthenticated
                    ? 'Conectado a Google Calendar. Puede sincronizar eventos y configurar la integración.'
                    : 'No conectado a Google Calendar. Inicie sesión para habilitar la integración.'}
                </AuthDescription>
              </AuthStatus>

              {calendarAuthenticated ? (
                <Button $danger onClick={handleCalendarLogout}>
                  <FiLogOut size={16} />
                  Cerrar sesión
                </Button>
              ) : (
                <Button $primary onClick={handleCalendarLogin}>
                  <FiLogIn size={16} />
                  Iniciar sesión
                </Button>
              )}
            </AuthSection>

            {calendarAuthenticated && (
              <>
                <FormGroup>
                  <Label htmlFor="calendarId">Calendario predeterminado</Label>
                  <Select
                    id="calendarId"
                    value={calendarConfig.calendarId}
                    onChange={(e) => setCalendarConfig({
                      ...calendarConfig,
                      calendarId: e.target.value
                    })}
                  >
                    <option value="primary">Calendario principal</option>
                    <option value="work">Trabajo</option>
                    <option value="personal">Personal</option>
                  </Select>
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="syncDirection">Dirección de sincronización</Label>
                  <Select
                    id="syncDirection"
                    value={calendarConfig.syncDirection}
                    onChange={(e) => setCalendarConfig({
                      ...calendarConfig,
                      syncDirection: e.target.value as 'one-way' | 'two-way'
                    })}
                  >
                    <option value="one-way">Unidireccional (app → Google Calendar)</option>
                    <option value="two-way">Bidireccional (sincronización completa)</option>
                  </Select>
                </FormGroup>

                <CheckboxContainer>
                  <Checkbox
                    type="checkbox"
                    id="syncEnabled"
                    checked={calendarConfig.syncEnabled}
                    onChange={(e) => setCalendarConfig({
                      ...calendarConfig,
                      syncEnabled: e.target.checked
                    })}
                  />
                  <CheckboxLabel htmlFor="syncEnabled">
                    Habilitar sincronización automática
                  </CheckboxLabel>
                </CheckboxContainer>

                <CheckboxContainer>
                  <Checkbox
                    type="checkbox"
                    id="notifyAttendees"
                    checked={calendarConfig.notifyAttendees}
                    onChange={(e) => setCalendarConfig({
                      ...calendarConfig,
                      notifyAttendees: e.target.checked
                    })}
                  />
                  <CheckboxLabel htmlFor="notifyAttendees">
                    Notificar a los participantes al crear eventos
                  </CheckboxLabel>
                </CheckboxContainer>

                <ButtonGroup>
                  <Button onClick={handleCalendarSync}>
                    <FiRefreshCw size={16} />
                    Sincronizar ahora
                  </Button>
                  <Button $primary onClick={handleSaveCalendarConfig}>
                    <FiSave size={16} />
                    Guardar configuración
                  </Button>
                </ButtonGroup>
              </>
            )}
          </CardContent>
        </IntegrationCard>

        {/* Google Drive */}
        <IntegrationCard>
          <CardHeader>
            <CardTitle>
              <FiHardDrive size={18} />
              Google Drive
            </CardTitle>
            <CardStatus $authenticated={driveAuthenticated}>
              {driveAuthenticated ? (
                <>
                  <FiCheck size={16} />
                  Conectado
                </>
              ) : (
                <>
                  <FiX size={16} />
                  No conectado
                </>
              )}
            </CardStatus>
          </CardHeader>

          <CardContent>
            <AuthSection>
              <AuthStatus>
                <AuthTitle>Estado de autenticación</AuthTitle>
                <AuthDescription>
                  {driveAuthenticated
                    ? 'Conectado a Google Drive. Puede sincronizar archivos y configurar la integración.'
                    : 'No conectado a Google Drive. Inicie sesión para habilitar la integración.'}
                </AuthDescription>
              </AuthStatus>

              {driveAuthenticated ? (
                <Button $danger onClick={handleDriveLogout}>
                  <FiLogOut size={16} />
                  Cerrar sesión
                </Button>
              ) : (
                <Button $primary onClick={handleDriveLogin}>
                  <FiLogIn size={16} />
                  Iniciar sesión
                </Button>
              )}
            </AuthSection>

            {driveAuthenticated && (
              <>
                <FormGroup>
                  <Label htmlFor="rootFolderId">Carpeta raíz</Label>
                  <Select
                    id="rootFolderId"
                    value={driveConfig.rootFolderId}
                    onChange={(e) => setDriveConfig({
                      ...driveConfig,
                      rootFolderId: e.target.value
                    })}
                  >
                    <option value="root">Carpeta raíz</option>
                    <option value="folder_1">Documentos</option>
                    <option value="folder_2">Imágenes</option>
                    <option value="folder_3">Proyectos</option>
                  </Select>
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="defaultPermissions">Permisos predeterminados</Label>
                  <Select
                    id="defaultPermissions"
                    value={driveConfig.defaultPermissions}
                    onChange={(e) => setDriveConfig({
                      ...driveConfig,
                      defaultPermissions: e.target.value as 'private' | 'viewable' | 'editable'
                    })}
                  >
                    <option value="private">Privado (solo yo)</option>
                    <option value="viewable">Visible (solo lectura)</option>
                    <option value="editable">Editable (lectura y escritura)</option>
                  </Select>
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="syncFrequency">Frecuencia de sincronización</Label>
                  <Select
                    id="syncFrequency"
                    value={driveConfig.syncFrequency.toString()}
                    onChange={(e) => setDriveConfig({
                      ...driveConfig,
                      syncFrequency: parseInt(e.target.value)
                    })}
                  >
                    <option value="15">Cada 15 minutos</option>
                    <option value="30">Cada 30 minutos</option>
                    <option value="60">Cada hora</option>
                    <option value="360">Cada 6 horas</option>
                    <option value="720">Cada 12 horas</option>
                    <option value="1440">Cada día</option>
                  </Select>
                </FormGroup>

                <CheckboxContainer>
                  <Checkbox
                    type="checkbox"
                    id="createActivityFolders"
                    checked={driveConfig.createActivityFolders}
                    onChange={(e) => setDriveConfig({
                      ...driveConfig,
                      createActivityFolders: e.target.checked
                    })}
                  />
                  <CheckboxLabel htmlFor="createActivityFolders">
                    Crear carpetas por actividad
                  </CheckboxLabel>
                </CheckboxContainer>

                <CheckboxContainer>
                  <Checkbox
                    type="checkbox"
                    id="organizeFoldersByType"
                    checked={driveConfig.organizeFoldersByType}
                    onChange={(e) => setDriveConfig({
                      ...driveConfig,
                      organizeFoldersByType: e.target.checked
                    })}
                  />
                  <CheckboxLabel htmlFor="organizeFoldersByType">
                    Organizar carpetas por tipo de actividad
                  </CheckboxLabel>
                </CheckboxContainer>

                <CheckboxContainer>
                  <Checkbox
                    type="checkbox"
                    id="autoSync"
                    checked={driveConfig.autoSync}
                    onChange={(e) => setDriveConfig({
                      ...driveConfig,
                      autoSync: e.target.checked
                    })}
                  />
                  <CheckboxLabel htmlFor="autoSync">
                    Habilitar sincronización automática
                  </CheckboxLabel>
                </CheckboxContainer>

                <ButtonGroup>
                  <Button onClick={handleDriveSync}>
                    <FiRefreshCw size={16} />
                    Sincronizar ahora
                  </Button>
                  <Button $primary onClick={handleSaveDriveConfig}>
                    <FiSave size={16} />
                    Guardar configuración
                  </Button>
                </ButtonGroup>
              </>
            )}
          </CardContent>
        </IntegrationCard>
      </IntegrationGrid>

      {/* Componentes adicionales para Google Calendar */}
      {calendarAuthenticated && (
        <>
          <ConnectionTest
            integrationId="google-calendar"
            integrationName="Google Calendar"
          />
          <SyncHistory
            integrationId="google-calendar"
          />
        </>
      )}

      {/* Componentes adicionales para Google Drive */}
      {driveAuthenticated && (
        <>
          <ConnectionTest
            integrationId="google-drive"
            integrationName="Google Drive"
          />
          <SyncHistory
            integrationId="google-drive"
          />
        </>
      )}
    </PageContainer>
  );
};

export default ConfiguracionIntegraciones;
