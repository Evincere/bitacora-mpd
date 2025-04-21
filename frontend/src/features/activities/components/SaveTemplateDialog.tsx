import React, { useState } from 'react';
import styled from 'styled-components';
import { FiX, FiSave, FiFileText } from 'react-icons/fi';
import { ActivityFormData } from '../schemas/activitySchema';
import useActivityTemplates from '@/hooks/useActivityTemplates';
import { useToast } from '@/hooks/useToast';

interface SaveTemplateDialogProps {
  formData: ActivityFormData;
  onClose: () => void;
  onSaved?: () => void;
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
  z-index: 1100;
  padding: 20px;
`;

const DialogContainer = styled.div`
  background-color: ${({ theme }) => theme.backgroundSecondary};
  border-radius: 8px;
  box-shadow: ${({ theme }) => theme.shadow};
  width: 100%;
  max-width: 500px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  animation: fadeIn 0.2s ease-out;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const DialogHeader = styled.div`
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

const DialogContent = styled.div`
  padding: 20px;
`;

const FormGroup = styled.div`
  margin-bottom: 16px;
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
`;

const Input = styled.input<{ hasError?: boolean }>`
  width: 100%;
  padding: 10px 12px;
  border-radius: 4px;
  border: 1px solid ${({ theme, hasError }) => hasError ? theme.danger : theme.border};
  background-color: ${({ theme }) => theme.backgroundPrimary};
  color: ${({ theme }) => theme.text};
  font-size: 14px;
  transition: border-color 0.2s;

  &:focus {
    border-color: ${({ theme, hasError }) => hasError ? theme.danger : theme.primary};
    outline: none;
  }
`;

const Textarea = styled.textarea<{ hasError?: boolean }>`
  width: 100%;
  padding: 10px 12px;
  border-radius: 4px;
  border: 1px solid ${({ theme, hasError }) => hasError ? theme.danger : theme.border};
  background-color: ${({ theme }) => theme.backgroundPrimary};
  color: ${({ theme }) => theme.text};
  font-size: 14px;
  min-height: 80px;
  resize: vertical;
  transition: border-color 0.2s;

  &:focus {
    border-color: ${({ theme, hasError }) => hasError ? theme.danger : theme.primary};
    outline: none;
  }
`;

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.danger};
  font-size: 12px;
  margin-top: 4px;
`;

const DialogFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 16px 20px;
  border-top: 1px solid ${({ theme }) => theme.border};
  gap: 12px;
`;

const CancelButton = styled.button`
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
    background-color: ${({ theme }) => theme.backgroundHover};
    color: ${({ theme }) => theme.text};
  }
`;

const SaveButton = styled.button`
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  background-color: ${({ theme }) => theme.primary};
  color: white;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background-color: ${({ theme }) => theme.primaryHover};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.backgroundDisabled};
    color: ${({ theme }) => theme.textDisabled};
    cursor: not-allowed;
  }
`;

const SaveTemplateDialog: React.FC<SaveTemplateDialogProps> = ({ formData, onClose, onSaved }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<{ name?: string; description?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { saveTemplate } = useActivityTemplates();
  const toast = useToast();

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const validate = () => {
    const newErrors: { name?: string; description?: string } = {};
    
    if (!name.trim()) {
      newErrors.name = 'El nombre es obligatorio';
    }
    
    if (!description.trim()) {
      newErrors.description = 'La descripción es obligatoria';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    
    setIsSubmitting(true);
    
    try {
      saveTemplate(name, description, formData);
      toast.success('Plantilla guardada correctamente', 'Plantilla guardada');
      onSaved?.();
      onClose();
    } catch (error) {
      console.error('Error al guardar la plantilla:', error);
      toast.error('Error al guardar la plantilla');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Overlay onClick={handleOverlayClick}>
      <DialogContainer>
        <DialogHeader>
          <Title>
            <FiFileText size={18} />
            Guardar como plantilla
          </Title>
          <CloseButton onClick={onClose}>
            <FiX size={20} />
          </CloseButton>
        </DialogHeader>
        
        <DialogContent>
          <FormGroup>
            <FormLabel htmlFor="template-name">Nombre de la plantilla</FormLabel>
            <Input
              id="template-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Reunión semanal de equipo"
              hasError={!!errors.name}
            />
            {errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}
          </FormGroup>
          
          <FormGroup>
            <FormLabel htmlFor="template-description">Descripción</FormLabel>
            <Textarea
              id="template-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe para qué se utiliza esta plantilla"
              hasError={!!errors.description}
            />
            {errors.description && <ErrorMessage>{errors.description}</ErrorMessage>}
          </FormGroup>
        </DialogContent>
        
        <DialogFooter>
          <CancelButton onClick={onClose}>
            Cancelar
          </CancelButton>
          <SaveButton onClick={handleSubmit} disabled={isSubmitting}>
            <FiSave size={16} />
            {isSubmitting ? 'Guardando...' : 'Guardar plantilla'}
          </SaveButton>
        </DialogFooter>
      </DialogContainer>
    </Overlay>
  );
};

export default SaveTemplateDialog;
