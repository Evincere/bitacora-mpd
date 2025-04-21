import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { FiFileText, FiChevronDown, FiEdit2, FiTrash2, FiClock } from 'react-icons/fi';
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
  border: 1px solid ${({ theme }) => theme.border};
  background-color: ${({ theme }) => theme.backgroundSecondary};
  color: ${({ theme }) => theme.text};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  height: 36px;
  z-index: 1;

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
`;

const DropdownMenu = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  width: 100%;
  max-height: 300px;
  overflow-y: auto;
  background-color: ${({ theme }) => theme.backgroundSecondary};
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.border};
  box-shadow: ${({ theme }) => theme.shadow};
  z-index: 10;
  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
`;

const TemplateItem = styled.div`
  padding: 10px 12px;
  cursor: pointer;
  transition: all 0.2s;
  border-bottom: 1px solid ${({ theme }) => theme.border};

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: ${({ theme }) => theme.backgroundHover};
  }
`;

const TemplateHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
`;

const TemplateName = styled.div`
  font-weight: 500;
  color: ${({ theme }) => theme.text};
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
  font-size: 12px;
  color: ${({ theme }) => theme.textSecondary};
  margin-bottom: 4px;
`;

const TemplateTimestamp = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: ${({ theme }) => theme.textTertiary};
`;

const EmptyState = styled.div`
  padding: 16px;
  text-align: center;
  color: ${({ theme }) => theme.textSecondary};
  font-size: 14px;
`;

const ManageButton = styled.button`
  display: block;
  width: 100%;
  padding: 10px;
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
`;

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ onSelectTemplate, onManageTemplates }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<string | null>(null);
  const { templates, deleteTemplate } = useActivityTemplates();
  const toast = useToast();
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const handleToggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelectTemplate = (template: ActivityTemplate) => {
    onSelectTemplate(template);
    setIsOpen(false);
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
          <FiFileText size={16} />
          <span>Usar plantilla</span>
        </div>
        <FiChevronDown size={16} />
      </SelectorButton>

      <DropdownMenu isOpen={isOpen}>
        {templates.length === 0 ? (
          <EmptyState>
            No hay plantillas guardadas
          </EmptyState>
        ) : (
          templates.map((template) => (
            <TemplateItem
              key={template.id}
              onClick={() => handleSelectTemplate(template)}
            >
              <TemplateHeader>
                <TemplateName>{template.name}</TemplateName>
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
            </TemplateItem>
          ))
        )}
        <ManageButton onClick={handleManageTemplates}>
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
