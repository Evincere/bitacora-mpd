import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  FiEdit2, 
  FiSave, 
  FiX, 
  FiAlertCircle, 
  FiRefreshCw,
  FiFileText,
  FiMail,
  FiBell,
  FiSmartphone,
  FiInfo
} from 'react-icons/fi';
import { 
  useNotificationTemplates, 
  useUpdateNotificationTemplate 
} from '../hooks/useNotificationConfig';
import { NotificationTemplate } from '../services/notificationConfigService';

// Estilos
const Container = styled.div`
  background-color: ${({ theme }) => theme.cardBackground};
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 20px;
  margin-top: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Title = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 10px;
`;

const Button = styled.button<{ $primary?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: ${({ theme, $primary }) => 
    $primary ? theme.primary : theme.cardBackground};
  color: ${({ theme, $primary }) => 
    $primary ? '#fff' : theme.text};
  border: 1px solid ${({ theme, $primary }) => 
    $primary ? theme.primary : theme.border};

  &:hover {
    background-color: ${({ theme, $primary }) => 
      $primary ? theme.primaryDark : theme.hoverBackground};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const TemplatesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const TemplateItem = styled.div`
  border-radius: 8px;
  background-color: ${({ theme }) => theme.backgroundSecondary};
  overflow: hidden;
`;

const TemplateHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

const TemplateTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const TemplateActions = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.textSecondary};
  transition: color 0.2s ease;
  padding: 4px;
  border-radius: 4px;

  &:hover {
    color: ${({ theme }) => theme.text};
    background-color: ${({ theme }) => theme.hoverBackground};
  }
`;

const TemplateContent = styled.div`
  padding: 16px;
`;

const TemplateInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 16px;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const InfoLabel = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.textSecondary};
  font-weight: 500;
`;

const InfoValue = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.text};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ChannelBadge = styled.div<{ $channel: string }>`
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
  
  background-color: ${({ theme, $channel }) => 
    $channel === 'email' ? theme.info + '20' :
    $channel === 'app' ? theme.success + '20' :
    $channel === 'push' ? theme.warning + '20' :
    theme.textSecondary + '20'
  };
  
  color: ${({ theme, $channel }) => 
    $channel === 'email' ? theme.info :
    $channel === 'app' ? theme.success :
    $channel === 'push' ? theme.warning :
    theme.textSecondary
  };
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.textSecondary};
`;

const Input = styled.input`
  padding: 10px 16px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.border};
  background-color: ${({ theme }) => theme.inputBackground};
  color: ${({ theme }) => theme.text};
  font-size: 14px;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.primary}20;
  }
`;

const TextArea = styled.textarea`
  padding: 10px 16px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.border};
  background-color: ${({ theme }) => theme.inputBackground};
  color: ${({ theme }) => theme.text};
  font-size: 14px;
  transition: all 0.2s ease;
  min-height: 120px;
  resize: vertical;
  font-family: monospace;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.primary}20;
  }
`;

const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
`;

const VariablesList = styled.div`
  margin-top: 16px;
  padding: 12px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.backgroundAlt};
  border: 1px dashed ${({ theme }) => theme.border};
`;

const VariablesTitle = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const VariablesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 8px;
`;

const VariableItem = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.textSecondary};
  padding: 4px 8px;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.backgroundSecondary};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.hoverBackground};
    color: ${({ theme }) => theme.text};
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
  color: ${({ theme }) => theme.textSecondary};
`;

const EmptyStateIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
  color: ${({ theme }) => theme.textTertiary};
`;

const EmptyStateText = styled.div`
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 8px;
`;

const EmptyStateSubtext = styled.div`
  font-size: 14px;
  margin-bottom: 16px;
`;

const NotificationTemplates: React.FC = () => {
  const [editingTemplate, setEditingTemplate] = useState<NotificationTemplate | null>(null);
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  
  const { data: templates, isLoading, isError, refetch } = useNotificationTemplates();
  const updateTemplate = useUpdateNotificationTemplate();

  const handleEditTemplate = (template: NotificationTemplate) => {
    setEditingTemplate(template);
    setSubject(template.subject);
    setContent(template.content);
  };

  const handleCancelEdit = () => {
    setEditingTemplate(null);
    setSubject('');
    setContent('');
  };

  const handleSaveTemplate = async () => {
    if (!editingTemplate) return;
    
    try {
      await updateTemplate.mutateAsync({
        id: editingTemplate.id,
        templateData: {
          subject,
          content
        }
      });
      
      setEditingTemplate(null);
      setSubject('');
      setContent('');
    } catch (error) {
      console.error('Error al guardar plantilla:', error);
    }
  };

  const insertVariable = (variable: string) => {
    setContent(prev => `${prev}{{${variable}}}`);
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'email':
        return <FiMail size={14} />;
      case 'app':
        return <FiBell size={14} />;
      case 'push':
        return <FiSmartphone size={14} />;
      default:
        return <FiFileText size={14} />;
    }
  };

  const getChannelName = (channel: string) => {
    switch (channel) {
      case 'email':
        return 'Correo electrónico';
      case 'app':
        return 'Aplicación';
      case 'push':
        return 'Notificación push';
      default:
        return channel;
    }
  };

  return (
    <Container>
      <Header>
        <Title>
          <FiFileText size={18} />
          Plantillas de Notificación
        </Title>
        <ActionButtons>
          <Button onClick={() => refetch()}>
            <FiRefreshCw size={16} />
            Actualizar
          </Button>
        </ActionButtons>
      </Header>

      {isLoading ? (
        <div>Cargando plantillas...</div>
      ) : isError ? (
        <div>Error al cargar plantillas</div>
      ) : templates && templates.length > 0 ? (
        <TemplatesList>
          {templates.map(template => (
            <TemplateItem key={template.id}>
              <TemplateHeader>
                <TemplateTitle>
                  {getChannelIcon(template.channel)}
                  {template.name}
                </TemplateTitle>
                <TemplateActions>
                  <ActionButton onClick={() => handleEditTemplate(template)}>
                    <FiEdit2 size={16} />
                  </ActionButton>
                </TemplateActions>
              </TemplateHeader>
              
              {editingTemplate && editingTemplate.id === template.id ? (
                <TemplateContent>
                  <FormGroup>
                    <Label htmlFor={`subject-${template.id}`}>Asunto</Label>
                    <Input
                      id={`subject-${template.id}`}
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      disabled={template.channel !== 'email'}
                    />
                    {template.channel !== 'email' && (
                      <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>
                        El asunto solo aplica para notificaciones por correo electrónico
                      </div>
                    )}
                  </FormGroup>
                  
                  <FormGroup>
                    <Label htmlFor={`content-${template.id}`}>Contenido</Label>
                    <TextArea
                      id={`content-${template.id}`}
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                    />
                  </FormGroup>
                  
                  <VariablesList>
                    <VariablesTitle>
                      <FiInfo size={14} />
                      Variables disponibles
                    </VariablesTitle>
                    <VariablesGrid>
                      <VariableItem onClick={() => insertVariable('userName')}>userName</VariableItem>
                      <VariableItem onClick={() => insertVariable('taskTitle')}>taskTitle</VariableItem>
                      <VariableItem onClick={() => insertVariable('taskLink')}>taskLink</VariableItem>
                      <VariableItem onClick={() => insertVariable('dueDate')}>dueDate</VariableItem>
                      <VariableItem onClick={() => insertVariable('priority')}>priority</VariableItem>
                      <VariableItem onClick={() => insertVariable('newStatus')}>newStatus</VariableItem>
                      <VariableItem onClick={() => insertVariable('comment')}>comment</VariableItem>
                      <VariableItem onClick={() => insertVariable('commentAuthor')}>commentAuthor</VariableItem>
                    </VariablesGrid>
                  </VariablesList>
                  
                  <FormActions>
                    <Button type="button" onClick={handleCancelEdit}>
                      <FiX size={16} />
                      Cancelar
                    </Button>
                    <Button type="button" $primary onClick={handleSaveTemplate}>
                      <FiSave size={16} />
                      Guardar
                    </Button>
                  </FormActions>
                </TemplateContent>
              ) : (
                <TemplateContent>
                  <TemplateInfo>
                    <InfoItem>
                      <InfoLabel>Tipo</InfoLabel>
                      <InfoValue>{template.type}</InfoValue>
                    </InfoItem>
                    <InfoItem>
                      <InfoLabel>Canal</InfoLabel>
                      <InfoValue>
                        <ChannelBadge $channel={template.channel}>
                          {getChannelIcon(template.channel)}
                          {getChannelName(template.channel)}
                        </ChannelBadge>
                      </InfoValue>
                    </InfoItem>
                  </TemplateInfo>
                  
                  {template.channel === 'email' && template.subject && (
                    <FormGroup>
                      <Label>Asunto</Label>
                      <div style={{ 
                        padding: '10px 16px',
                        borderRadius: '8px',
                        backgroundColor: '#f5f5f5',
                        fontSize: '14px',
                        fontFamily: 'monospace'
                      }}>
                        {template.subject}
                      </div>
                    </FormGroup>
                  )}
                  
                  <FormGroup>
                    <Label>Contenido</Label>
                    <div style={{ 
                      padding: '10px 16px',
                      borderRadius: '8px',
                      backgroundColor: '#f5f5f5',
                      fontSize: '14px',
                      fontFamily: 'monospace',
                      whiteSpace: 'pre-wrap'
                    }}>
                      {template.content}
                    </div>
                  </FormGroup>
                </TemplateContent>
              )}
            </TemplateItem>
          ))}
        </TemplatesList>
      ) : (
        <EmptyState>
          <EmptyStateIcon>
            <FiAlertCircle />
          </EmptyStateIcon>
          <EmptyStateText>No se encontraron plantillas</EmptyStateText>
          <EmptyStateSubtext>
            No hay plantillas de notificación configuradas en el sistema
          </EmptyStateSubtext>
        </EmptyState>
      )}
    </Container>
  );
};

export default NotificationTemplates;
