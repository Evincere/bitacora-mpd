import React, { useState } from 'react';
import styled from 'styled-components';
import { TaskRequest } from '../services/solicitudesService';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormHelperText } from '@/shared/components/ui';
import { Button } from '@/components/ui';
import { FiX, FiAlertCircle } from 'react-icons/fi';

interface ReenviarSolicitudModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResubmit: (notes?: string) => void;
  taskRequest: TaskRequest | null;
  isResubmitting: boolean;
}

const StyledDialog = styled(Dialog)`
  /* Estilos adicionales si son necesarios */
`;

const StyledDialogTitle = styled(DialogTitle)`
  background-color: ${({ theme }) => theme.backgroundTertiary};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.textSecondary};
  cursor: pointer;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: 50%;
  transition: all 0.2s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    color: ${({ theme }) => theme.textPrimary};
  }
`;

const StyledDialogContent = styled(DialogContent)`
  /* Estilos adicionales si son necesarios */
`;

const StyledDialogActions = styled(DialogActions)`
  /* Estilos adicionales si son necesarios */
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const StyledTextField = styled(TextField)`
  width: 100%;
  margin-bottom: 16px;
`;

const TaskInfo = styled.div`
  margin-bottom: 24px;
  padding: 16px;
  background-color: ${({ theme }) => theme.backgroundPrimary};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.borderColor};
`;

const TaskTitle = styled.h3`
  margin: 0 0 8px 0;
  color: ${({ theme }) => theme.textPrimary};
  font-size: 16px;
`;

const TaskDescription = styled.p`
  margin: 0 0 12px 0;
  color: ${({ theme }) => theme.textSecondary};
  font-size: 14px;
`;

const RejectionReason = styled.div`
  margin-top: 12px;
  padding: 12px;
  background-color: rgba(244, 67, 54, 0.1);
  border-radius: 6px;
  border-left: 3px solid #f44336;
  display: flex;
  align-items: flex-start;
  gap: 8px;
`;

const RejectionIcon = styled(FiAlertCircle)`
  color: #f44336;
  margin-top: 2px;
`;

const RejectionText = styled.div`
  color: ${({ theme }) => theme.textPrimary};
  font-size: 14px;
`;

const ReenviarSolicitudModal: React.FC<ReenviarSolicitudModalProps> = ({
  isOpen,
  onClose,
  onResubmit,
  taskRequest,
  isResubmitting
}) => {
  const [notes, setNotes] = useState('');

  const handleSubmit = () => {
    onResubmit(notes.trim() ? notes : undefined);
  };

  const handleClose = () => {
    setNotes('');
    onClose();
  };

  return (
    <StyledDialog
      open={isOpen}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
    >
      <StyledDialogTitle onClose={handleClose}>
        Reenviar Solicitud Rechazada
      </StyledDialogTitle>
      <StyledDialogContent>
        {taskRequest && (
          <TaskInfo>
            <TaskTitle>{taskRequest.title}</TaskTitle>
            <TaskDescription>{taskRequest.description}</TaskDescription>

            {taskRequest.notes && (
              <RejectionReason>
                <RejectionIcon size={16} />
                <RejectionText>
                  <strong>Motivo del rechazo:</strong> {taskRequest.notes}
                </RejectionText>
              </RejectionReason>
            )}
          </TaskInfo>
        )}

        <FormGroup>
          <StyledTextField
            label="Notas adicionales (opcional)"
            variant="outlined"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            multiline
            rows={4}
            disabled={isResubmitting}
            placeholder="Añada información sobre los cambios realizados para corregir los problemas señalados"
          />
          <FormHelperText>
            Puede añadir notas explicando cómo ha corregido los problemas que llevaron al rechazo de la solicitud.
          </FormHelperText>
        </FormGroup>
      </StyledDialogContent>
      <StyledDialogActions>
        <Button
          onClick={handleClose}
          variant="secondary"
          disabled={isResubmitting}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="primary"
          disabled={isResubmitting}
          loading={isResubmitting}
        >
          Reenviar Solicitud
        </Button>
      </StyledDialogActions>
    </StyledDialog>
  );
};

export default ReenviarSolicitudModal;
