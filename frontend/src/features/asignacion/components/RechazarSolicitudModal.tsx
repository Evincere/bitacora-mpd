import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { TaskRequest } from '@/features/solicitudes/services/solicitudesService';
import { RechazoRequest } from '../services/asignacionService';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormHelperText, ErrorAlert } from '@/shared/components/ui';
import { Button } from '@/components/ui';
import { FiX } from 'react-icons/fi';

interface RechazarSolicitudModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReject: (rechazo: RechazoRequest) => void;
  taskRequest: TaskRequest | null;
  isRejecting: boolean;
}

const StyledDialog = styled(Dialog)`
  /* Estilos adicionales si son necesarios */
`;

const StyledDialogTitle = styled(DialogTitle)`
  background-color: ${({ theme }) => theme.backgroundTertiary};
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
  margin: 0;
  color: ${({ theme }) => theme.textSecondary};
  font-size: 14px;
`;

const RechazarSolicitudModal: React.FC<RechazarSolicitudModalProps> = ({
  isOpen,
  onClose,
  onReject,
  taskRequest,
  isRejecting
}) => {
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  const [reasonError, setReasonError] = useState('');
  const [statusError, setStatusError] = useState('');

  useEffect(() => {
    // Verificar si la solicitud está en estado SUBMITTED
    if (taskRequest && taskRequest.status !== 'SUBMITTED') {
      setStatusError(`Esta solicitud no puede ser rechazada porque está en estado ${taskRequest.status}`);
    } else {
      setStatusError('');
    }
  }, [taskRequest]);

  const handleSubmit = () => {
    // Validar el motivo
    if (!reason.trim()) {
      setReasonError('El motivo de rechazo es obligatorio');
      return;
    }

    // Verificar si hay error de estado
    if (statusError) {
      return;
    }

    onReject({
      reason,
      notes: notes.trim() ? notes : undefined
    });
  };

  const handleClose = () => {
    setReason('');
    setNotes('');
    setReasonError('');
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
        Rechazar Solicitud
      </StyledDialogTitle>
      <DialogContent>
        {statusError && (
          <ErrorAlert
            title="No se puede rechazar"
            message={statusError}
            style={{ marginBottom: '16px' }}
          />
        )}

        {taskRequest && (
          <TaskInfo>
            <TaskTitle>{taskRequest.title}</TaskTitle>
            <TaskDescription>{taskRequest.description}</TaskDescription>
          </TaskInfo>
        )}

        <FormGroup>
          <StyledTextField
            label="Motivo del rechazo"
            variant="outlined"
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              if (e.target.value.trim()) {
                setReasonError('');
              }
            }}
            required
            error={!!reasonError}
            helperText={reasonError}
            disabled={isRejecting}
          />
        </FormGroup>

        <FormGroup>
          <StyledTextField
            label="Notas adicionales (opcional)"
            variant="outlined"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            multiline
            rows={4}
            disabled={isRejecting}
          />
          <FormHelperText>
            Proporcione detalles adicionales o sugerencias para mejorar la solicitud.
          </FormHelperText>
        </FormGroup>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleClose}
          variant="secondary"
          disabled={isRejecting}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="primary"
          disabled={isRejecting || !!statusError}
          loading={isRejecting}
        >
          Rechazar Solicitud
        </Button>
      </DialogActions>
    </StyledDialog>
  );
};

export default RechazarSolicitudModal;
