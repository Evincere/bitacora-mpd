import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { FiFileText, FiChevronDown, FiEdit2, FiTrash2, FiClock, FiStar, FiInfo, FiPlus } from 'react-icons/fi';
import useActivityTemplates, { ActivityTemplate } from '@/hooks/useActivityTemplates';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { useToast } from '@/hooks/useToast';
import ConfirmDialog from '@/components/common/ConfirmDialog';

interface TemplateSelectorProps {
  onSelectTemplate: (template: ActivityTemplate) => void;
  onManageTemplates: () => void;
}

const SelectorContainer = styled.div`
  position: relative;
  width: 100%;
`;

const SelectorButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 10px 12px;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.primary + '50'};
  background-color: ${({ theme }) => theme.backgroundSecondary};
  color: ${({ theme }) => theme.text};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  height: 40px;
  z-index: 1;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  &:hover {
    border-color: ${({ theme }) => theme.primary};
    background-color: ${({ theme }) => theme.backgroundHover};
    color: ${({ theme }) => theme.primary};
  }

  .left {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  svg {
    color: ${({ theme }) => theme.primary};
  }
`;

const DropdownMenu = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  width: 300px; /* Ancho fijo para mejor legibilidad */
  max-height: 350px;
  overflow-y: auto;
  background-color: ${({ theme }) => theme.backgroundSecondary};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.border};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 10;
  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
  padding: 8px 0;
  transform-origin: top center;
  animation: ${({ isOpen }) => isOpen ? 'dropdownFadeIn 0.2s ease-out' : 'none'};

  @keyframes dropdownFadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const TemplateItem = styled.div`
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.2s;
  border-bottom: 1px solid ${({ theme }) => theme.border + '50'};
  position: relative;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: ${({ theme }) => theme.backgroundHover};
  }

  &:hover .template-apply-indicator {
    opacity: 1;
  }
`;

const TemplateHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
`;

const TemplateName = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  display: flex;
  align-items: center;
  gap: 6px;

  .favorite-icon {
    color: ${({ theme }) => theme.warning};
  }
`;

const TemplateActions = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  background: none;
  border: none;
  color: ${({ theme }) => theme.textSecondary};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.backgroundHover};
    color: ${({ theme }) => theme.text};
  }
`;

const TemplateDescription = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.textSecondary};
  margin-bottom: 8px;
  line-height: 1.4;
`;

const TemplateTimestamp = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: ${({ theme }) => theme.textTertiary};
`;

const EmptyState = styled.div`
  padding: 24px 16px;
  text-align: center;
  color: ${({ theme }) => theme.textSecondary};
  font-size: 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;

  svg {
    font-size: 24px;
    color: ${({ theme }) => theme.textTertiary};
  }
`;

const ManageButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 12px;
  text-align: center;
  background-color: ${({ theme }) => theme.backgroundTertiary};
  border: none;
  border-top: 1px solid ${({ theme }) => theme.border};
  color: ${({ theme }) => theme.primary};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.backgroundHover};
  }

  svg {
    font-size: 16px;
  }
`;

// Indicador de aplicar plantilla
const ApplyIndicator = styled.div`
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  background-color: ${({ theme }) => theme.primary};
  color: white;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 12px;
  font-weight: 500;
  opacity: 0;
  transition: opacity 0.2s ease;
  display: flex;
  align-items: center;
  gap: 4px;
`;

// Botón para crear nueva plantilla
const CreateTemplateButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 10px 16px;
  background: none;
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.border + '50'};
  color: ${({ theme }) => theme.primary};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;

  &:hover {
    background-color: ${({ theme }) => theme.backgroundHover};
  }

  svg {
    font-size: 16px;
  }
`;

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ onSelectTemplate, onManageTemplates }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<string | null>(null);
  const { templates, deleteTemplate } = useActivityTemplates();
  const toast = useToast();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [recentTemplates, setRecentTemplates] = useState<ActivityTemplate[]>([]);

  // Cerrar el dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Obtener plantillas recientes (las 3 más recientes)
  useEffect(() => {
    if (templates.length > 0) {
      const sorted = [...templates].sort((a, b) => b.updatedAt - a.updatedAt);
      setRecentTemplates(sorted.slice(0, 3));
    }
  }, [templates]);

  const handleToggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelectTemplate = (template: ActivityTemplate) => {
    onSelectTemplate(template);
    setIsOpen(false);
    toast.success(`Plantilla "${template.name}" aplicada`, 'Plantilla aplicada');
  };

  const handleCreateTemplate = () => {
    setIsOpen(false);
    // Mostrar diálogo para crear plantilla
    onManageTemplates();
  };

  const handleDeleteTemplate = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setTemplateToDelete(id);
  };

  const confirmDeleteTemplate = () => {
    if (templateToDelete) {
      deleteTemplate(templateToDelete);
      toast.success('Plantilla eliminada correctamente', 'Plantilla eliminada');
      setTemplateToDelete(null);
    }
  };

  const handleManageTemplates = () => {
    setIsOpen(false);
    onManageTemplates();
  };

  return (
    <SelectorContainer ref={dropdownRef}>
      <SelectorButton onClick={handleToggleDropdown}>
        <div className="left">
          <FiFileText size={18} />
          <span>Usar plantilla</span>
        </div>
        <FiChevronDown size={16} />
      </SelectorButton>

      <DropdownMenu isOpen={isOpen}>
        <CreateTemplateButton onClick={handleCreateTemplate}>
          <FiPlus size={16} />
          Crear nueva plantilla
        </CreateTemplateButton>

        {templates.length === 0 ? (
          <EmptyState>
            <FiInfo size={24} />
            <div>No hay plantillas guardadas</div>
            <div>Crea plantillas para agilizar la creación de actividades similares</div>
          </EmptyState>
        ) : (
          <>
            {templates.map((template) => (
              <TemplateItem
                key={template.id}
                onClick={() => handleSelectTemplate(template)}
              >
                <TemplateHeader>
                  <TemplateName>
                    {template.updatedAt > Date.now() - 7 * 24 * 60 * 60 * 1000 && (
                      <FiStar className="favorite-icon" size={14} title="Plantilla reciente" />
                    )}
                    {template.name}
                  </TemplateName>
                  <TemplateActions>
                    <ActionButton
                      onClick={(e) => handleDeleteTemplate(template.id, e)}
                      title="Eliminar plantilla"
                    >
                      <FiTrash2 size={14} />
                    </ActionButton>
                  </TemplateActions>
                </TemplateHeader>
                <TemplateDescription>{template.description}</TemplateDescription>
                <TemplateTimestamp>
                  <FiClock size={12} />
                  Actualizado {formatDistanceToNow(new Date(template.updatedAt), { addSuffix: true, locale: es })}
                </TemplateTimestamp>
                <ApplyIndicator className="template-apply-indicator">
                  <FiFileText size={12} />
                  Aplicar
                </ApplyIndicator>
              </TemplateItem>
            ))}
          </>
        )}
        <ManageButton onClick={handleManageTemplates}>
          <FiEdit2 size={16} />
          Gestionar plantillas
        </ManageButton>
      </DropdownMenu>

      {templateToDelete && (
        <ConfirmDialog
          title="Eliminar plantilla"
          message="¿Estás seguro de que deseas eliminar esta plantilla? Esta acción no se puede deshacer."
          confirmLabel="Eliminar"
          cancelLabel="Cancelar"
          onConfirm={confirmDeleteTemplate}
          onCancel={() => setTemplateToDelete(null)}
        />
      )}
    </SelectorContainer>
  );
};

export default TemplateSelector;
