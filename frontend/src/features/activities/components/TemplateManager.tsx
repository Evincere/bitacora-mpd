import React, { useState } from 'react';
import styled from 'styled-components';
import { FiX, FiEdit2, FiTrash2, FiFileText, FiClock, FiSearch, FiInfo } from 'react-icons/fi';
import useActivityTemplates, { ActivityTemplate } from '@/features/activities/hooks/useActivityTemplates';
import { formatDistanceToNow, format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useToast } from '@/core/hooks/useToast';
import ConfirmDialog from '../../../shared/components/common/ConfirmDialog';
import EditTemplateDialog from './EditTemplateDialog';

interface TemplateManagerProps {
  onClose: () => void;
}

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 20px;
`;

const ManagerContainer = styled.div`
  background-color: ${({ theme }) => theme.backgroundSecondary};
  border-radius: 8px;
  box-shadow: ${({ theme }) => theme.shadow};
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  animation: fadeIn 0.2s ease-out;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const ManagerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

const Title = styled.h2`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.textSecondary};
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  transition: all 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.backgroundHover};
    color: ${({ theme }) => theme.text};
  }
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 20px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  background-color: ${({ theme }) => theme.background};
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 8px 12px 8px 36px;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.border};
  background-color: ${({ theme }) => theme.backgroundSecondary};
  color: ${({ theme }) => theme.text};
  font-size: 14px;

  &:focus {
    border-color: ${({ theme }) => theme.primary};
    outline: none;
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 32px;
  color: ${({ theme }) => theme.textSecondary};
`;

const ManagerContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0;
`;

const TemplatesList = styled.div`
  display: flex;
  flex-direction: column;
`;

const TemplateItem = styled.div`
  padding: 16px 20px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  transition: all 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.inputBackground};
  }
`;

const TemplateHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
`;

const TemplateInfo = styled.div`
  flex: 1;
`;

const TemplateName = styled.div`
  font-weight: 600;
  font-size: 16px;
  color: ${({ theme }) => theme.text};
  margin-bottom: 4px;
`;

const TemplateDescription = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.textSecondary};
  margin-bottom: 8px;
`;

const TemplateActions = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  background: none;
  border: none;
  color: ${({ theme }) => theme.textSecondary};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.backgroundTertiary};
    color: ${({ theme }) => theme.text};
  }
`;

const TemplateMetadata = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 12px;
  color: ${({ theme }) => theme.textTertiary};
`;

const MetadataItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const TemplateFields = styled.div`
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px dashed ${({ theme }) => theme.border};
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
`;

const TemplateField = styled.div`
  font-size: 13px;
`;

const FieldLabel = styled.div`
  font-weight: 500;
  color: ${({ theme }) => theme.textSecondary};
  margin-bottom: 2px;
`;

const FieldValue = styled.div`
  color: ${({ theme }) => theme.text};
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  color: ${({ theme }) => theme.textSecondary};
  text-align: center;
`;

const EmptyStateIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
  color: ${({ theme }) => theme.textTertiary};
`;

const EmptyStateTitle = styled.h3`
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
`;

const EmptyStateDescription = styled.p`
  margin: 0;
  font-size: 14px;
  max-width: 400px;
`;

const ManagerFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 16px 20px;
  border-top: 1px solid ${({ theme }) => theme.border};
`;

const CloseFooterButton = styled.button`
  padding: 8px 16px;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.border};
  background-color: transparent;
  color: ${({ theme }) => theme.textSecondary};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.inputBackground};
    color: ${({ theme }) => theme.text};
  }
`;

const TemplateManager: React.FC<TemplateManagerProps> = ({ onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [templateToDelete, setTemplateToDelete] = useState<string | null>(null);
  const [templateToEdit, setTemplateToEdit] = useState<ActivityTemplate | null>(null);
  const { templates, deleteTemplate, updateTemplate } = useActivityTemplates();
  const toast = useToast();

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleDeleteTemplate = (id: string) => {
    setTemplateToDelete(id);
  };

  const confirmDeleteTemplate = () => {
    if (templateToDelete) {
      deleteTemplate(templateToDelete);
      toast.success('Plantilla eliminada correctamente', 'Plantilla eliminada');
      setTemplateToDelete(null);
    }
  };

  const handleEditTemplate = (template: ActivityTemplate) => {
    setTemplateToEdit(template);
  };

  const handleUpdateTemplate = (id: string, name: string, description: string) => {
    updateTemplate(id, { name, description });
    toast.success('Plantilla actualizada correctamente', 'Plantilla actualizada');
    setTemplateToEdit(null);
  };

  // Filtrar plantillas según la búsqueda
  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Ordenar plantillas por fecha de actualización (más recientes primero)
  const sortedTemplates = [...filteredTemplates].sort((a, b) => b.updatedAt - a.updatedAt);

  return (
    <Overlay onClick={handleOverlayClick}>
      <ManagerContainer>
        <ManagerHeader>
          <Title>
            <FiFileText size={18} />
            Gestionar plantillas
          </Title>
          <CloseButton onClick={onClose}>
            <FiX size={20} />
          </CloseButton>
        </ManagerHeader>

        <SearchContainer>
          <SearchIcon>
            <FiSearch size={16} />
          </SearchIcon>
          <SearchInput
            placeholder="Buscar plantillas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </SearchContainer>

        <ManagerContent>
          {sortedTemplates.length === 0 ? (
            <EmptyState>
              <EmptyStateIcon>
                <FiInfo />
              </EmptyStateIcon>
              <EmptyStateTitle>No hay plantillas</EmptyStateTitle>
              <EmptyStateDescription>
                {searchQuery
                  ? 'No se encontraron plantillas que coincidan con tu búsqueda.'
                  : 'Aún no has creado ninguna plantilla. Puedes crear plantillas al guardar actividades.'}
              </EmptyStateDescription>
            </EmptyState>
          ) : (
            <TemplatesList>
              {sortedTemplates.map((template) => (
                <TemplateItem key={template.id}>
                  <TemplateHeader>
                    <TemplateInfo>
                      <TemplateName>{template.name}</TemplateName>
                      <TemplateDescription>{template.description}</TemplateDescription>
                    </TemplateInfo>
                    <TemplateActions>
                      <ActionButton
                        onClick={() => handleEditTemplate(template)}
                        title="Editar plantilla"
                      >
                        <FiEdit2 size={16} />
                      </ActionButton>
                      <ActionButton
                        onClick={() => handleDeleteTemplate(template.id)}
                        title="Eliminar plantilla"
                      >
                        <FiTrash2 size={16} />
                      </ActionButton>
                    </TemplateActions>
                  </TemplateHeader>

                  <TemplateMetadata>
                    <MetadataItem>
                      <FiClock size={12} />
                      Creada: {format(new Date(template.createdAt), 'dd/MM/yyyy')}
                    </MetadataItem>
                    <MetadataItem>
                      <FiClock size={12} />
                      Actualizada: {formatDistanceToNow(new Date(template.updatedAt), { addSuffix: true, locale: es })}
                    </MetadataItem>
                  </TemplateMetadata>

                  <TemplateFields>
                    {Object.entries(template.data).map(([key, value]) => {
                      // No mostrar campos vacíos
                      if (!value) return null;

                      // Formatear el nombre del campo
                      const fieldName = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');

                      return (
                        <TemplateField key={key}>
                          <FieldLabel>{fieldName}</FieldLabel>
                          <FieldValue>
                            {typeof value === 'string' && value.length > 30
                              ? `${value.substring(0, 30)}...`
                              : value}
                          </FieldValue>
                        </TemplateField>
                      );
                    })}
                  </TemplateFields>
                </TemplateItem>
              ))}
            </TemplatesList>
          )}
        </ManagerContent>

        <ManagerFooter>
          <CloseFooterButton onClick={onClose}>
            Cerrar
          </CloseFooterButton>
        </ManagerFooter>
      </ManagerContainer>

      {templateToDelete && (
        <ConfirmDialog
          isOpen={true}
          title="Eliminar plantilla"
          message="¿Estás seguro de que deseas eliminar esta plantilla? Esta acción no se puede deshacer."
          confirmText="Eliminar"
          cancelText="Cancelar"
          onConfirm={confirmDeleteTemplate}
          onCancel={() => setTemplateToDelete(null)}
          type="danger"
        />
      )}

      {templateToEdit && (
        <EditTemplateDialog
          template={templateToEdit}
          onClose={() => setTemplateToEdit(null)}
          onSave={handleUpdateTemplate}
        />
      )}
    </Overlay>
  );
};

export default TemplateManager;
