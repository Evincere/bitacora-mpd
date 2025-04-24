import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { FiFileText, FiChevronDown, FiEdit2, FiTrash2, FiClock } from 'react-icons/fi';
import useActivityTemplates, { ActivityTemplate } from '@/features/activities/hooks/useActivityTemplates';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { useToast } from '@/core/hooks/useToast';
import ConfirmDialog from '../../../shared/components/common/ConfirmDialog';

interface TemplateSelectorProps {
  onSelectTemplate: (template: ActivityTemplate) => void;
  onManageTemplates: () => void;
}

const SelectorContainer = styled.div`
  position: relative;
  width: 100%;
  display: block;
  min-width: 180px;
`;

const SelectorButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 10px 12px;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.primary};
  background-color: ${({ theme }) => theme.backgroundSecondary};
  color: ${({ theme }) => theme.primary};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  height: 36px;
  z-index: 5; /* Aumentado para asegurar visibilidad */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: ${({ theme }) => theme.primary};
    opacity: 0.05;
    z-index: -1;
  }

  &:hover {
    border-color: ${({ theme }) => theme.primary};
    background-color: ${({ theme }) => theme.inputBackground};
    color: ${({ theme }) => theme.primary};
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
    transform: translateY(-1px);
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
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.border};
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
  z-index: 100; /* Valor alto para asegurar que esté por encima de otros elementos */
  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
  min-width: 280px; /* Asegurar un ancho mínimo */
  animation: ${({ isOpen }) => isOpen ? 'dropdownFadeIn 0.2s ease-out' : 'none'};
  transform-origin: top center;

  @keyframes dropdownFadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const TemplateItem = styled.div`
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.2s;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  position: relative;
  overflow: hidden;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: ${({ theme }) => theme.inputBackground};
  }

  &::after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 3px;
    background-color: ${({ theme }) => theme.primary};
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  &:hover::after {
    opacity: 1;
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
    background-color: ${({ theme }) => theme.inputBackground};
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
  padding: 12px;
  text-align: center;
  background-color: ${({ theme }) => theme.backgroundTertiary};
  border: none;
  border-top: 1px solid ${({ theme }) => theme.border};
  color: ${({ theme }) => theme.primary};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: ${({ theme }) => theme.primary};
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: 0;
  }

  &:hover {
    background-color: ${({ theme }) => theme.inputBackground};
  }

  &:hover::before {
    opacity: 0.05;
  }

  span {
    position: relative;
    z-index: 1;
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
          <span>Gestionar plantillas</span>
        </ManageButton>
      </DropdownMenu>

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
    </SelectorContainer>
  );
};

export default TemplateSelector;
