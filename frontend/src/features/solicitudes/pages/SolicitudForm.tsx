import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FiSend, FiPaperclip, FiAlertCircle, FiInfo, FiLoader, FiX } from 'react-icons/fi';
import { toast } from 'react-toastify';

// Hooks y servicios
import useSolicitudes from '../hooks/useSolicitudes';

// Definición del esquema de validación con Zod
const solicitudSchema = z.object({
  titulo: z.string().min(5, 'El título debe tener al menos 5 caracteres'),
  descripcion: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  categoria: z.string().min(1, 'Debe seleccionar una categoría'),
  prioridad: z.string().min(1, 'Debe seleccionar una prioridad'),
  fechaLimite: z.string().optional(),
  adjuntos: z.array(z.any()).optional()
});

type SolicitudFormData = z.infer<typeof solicitudSchema>;

const FormContainer = styled.div`
  background-color: ${({ theme }) => theme.backgroundSecondary};
  border-radius: 8px;
  box-shadow: ${({ theme }) => theme.shadow};
  padding: 24px;
  max-width: 800px;
  margin: 0 auto;
  border: 1px solid ${({ theme }) => theme.border};
`;

const FormTitle = styled.h1`
  font-size: 24px;
  margin-bottom: 24px;
  color: ${({ theme }) => theme.text};
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
  background-color: ${({ theme }) => theme.backgroundTertiary};
  color: ${({ theme }) => theme.text};
  font-size: 14px;
  transition: all 0.2s;

  &:focus {
    border-color: ${({ theme }) => theme.primary};
    outline: none;
    box-shadow: 0 0 0 2px ${({ theme }) => `${theme.primary}30`};
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px 12px;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.border};
  background-color: ${({ theme }) => theme.backgroundTertiary};
  color: ${({ theme }) => theme.text};
  font-size: 14px;
  min-height: 120px;
  resize: vertical;
  transition: all 0.2s;

  &:focus {
    border-color: ${({ theme }) => theme.primary};
    outline: none;
    box-shadow: 0 0 0 2px ${({ theme }) => `${theme.primary}30`};
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 10px 12px;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.border};
  background-color: ${({ theme }) => theme.backgroundTertiary};
  color: ${({ theme }) => theme.text};
  font-size: 14px;
  transition: all 0.2s;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 16px;
  padding-right: 30px;

  &:focus {
    border-color: ${({ theme }) => theme.primary};
    outline: none;
    box-shadow: 0 0 0 2px ${({ theme }) => `${theme.primary}30`};
  }
`;

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.error};
  font-size: 12px;
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
`;

const Button = styled.button<{ $primary?: boolean }>`
  padding: 10px 16px;
  border-radius: 4px;
  font-weight: 500;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s;

  ${({ $primary, theme }) =>
    $primary
      ? `
    background-color: ${theme.primary};
    color: white;
    border: none;

    &:hover {
      background-color: ${theme.primaryDark};
    }
  `
      : `
    background-color: transparent;
    color: ${theme.textSecondary};
    border: 1px solid ${theme.border};

    &:hover {
      background-color: ${theme.backgroundHover};
    }
  `}
`;

const FileInput = styled.div`
  position: relative;
  overflow: hidden;
  display: inline-block;
`;

const HiddenInput = styled.input`
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
`;

const FileList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 8px 0 0;
`;

const FileItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 8px;
  background-color: ${({ theme }) => theme.backgroundAlt};
  border-radius: 4px;
  margin-bottom: 4px;
  font-size: 13px;
`;

const FileInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.textSecondary};
  cursor: pointer;
  padding: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;

  &:hover {
    color: ${({ theme }) => theme.error};
    background-color: ${({ theme }) => `${theme.error}10`};
  }
`;

const LoadingSpinner = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const InfoBox = styled.div`
  background-color: ${({ theme }) => `${theme.info}10`};
  border-left: 3px solid ${({ theme }) => theme.info};
  padding: 12px 16px;
  margin-bottom: 20px;
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
      margin: 0 0 4px;
      font-size: 14px;
      color: ${({ theme }) => theme.text};
    }

    p {
      margin: 0;
      font-size: 13px;
      color: ${({ theme }) => theme.textSecondary};
    }
  }
`;

const SolicitudForm: React.FC = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState<File[]>([]);

  // Usar el hook personalizado para solicitudes
  const {
    categories,
    priorities,
    isLoadingCategories,
    isLoadingPriorities,
    isCreatingSolicitud,
    isUploading,
    createSolicitud
  } = useSolicitudes();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<SolicitudFormData>({
    resolver: zodResolver(solicitudSchema),
    defaultValues: {
      titulo: '',
      descripcion: '',
      categoria: '',
      prioridad: '',
      fechaLimite: '',
      adjuntos: []
    }
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: SolicitudFormData) => {
    try {
      // Crear la solicitud y subir los archivos adjuntos
      createSolicitud({
        solicitud: {
          titulo: data.titulo,
          descripcion: data.descripcion,
          categoria: data.categoria,
          prioridad: data.prioridad,
          fechaLimite: data.fechaLimite
        },
        files
      }, {
        onSuccess: () => {
          navigate('/app/solicitudes');
        }
      });
    } catch (error) {
      console.error('Error al enviar la solicitud:', error);
      toast.error('Error al enviar la solicitud. Inténtelo de nuevo.');
    }
  };

  // Determinar si el formulario está en estado de carga
  const isLoading = isCreatingSolicitud || isUploading;

  return (
    <FormContainer>
      <FormTitle>Nueva Solicitud</FormTitle>

      <InfoBox>
        <div className="icon">
          <FiInfo size={20} />
        </div>
        <div className="content">
          <h4>Información sobre solicitudes</h4>
          <p>
            Complete el formulario con todos los detalles necesarios para su solicitud.
            Las solicitudes son revisadas por un asignador que distribuirá la tarea al equipo correspondiente.
            Recibirá notificaciones sobre el estado de su solicitud.
          </p>
        </div>
      </InfoBox>

      <form onSubmit={handleSubmit(onSubmit)}>
        <FormGroup>
          <Label htmlFor="titulo">Título de la solicitud</Label>
          <Controller
            name="titulo"
            control={control}
            render={({ field }) => <Input id="titulo" {...field} placeholder="Ingrese un título descriptivo" />}
          />
          {errors.titulo && (
            <ErrorMessage>
              <FiAlertCircle size={12} />
              {errors.titulo.message}
            </ErrorMessage>
          )}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="descripcion">Descripción detallada</Label>
          <Controller
            name="descripcion"
            control={control}
            render={({ field }) => (
              <TextArea
                id="descripcion"
                {...field}
                placeholder="Describa en detalle lo que necesita"
              />
            )}
          />
          {errors.descripcion && (
            <ErrorMessage>
              <FiAlertCircle size={12} />
              {errors.descripcion.message}
            </ErrorMessage>
          )}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="categoria">Categoría</Label>
          <Controller
            name="categoria"
            control={control}
            render={({ field }) => (
              <Select
                id="categoria"
                {...field}
                disabled={isLoadingCategories || isLoading}
              >
                <option value="">Seleccione una categoría</option>
                {categories?.map(category => (
                  <option key={category.id} value={category.name}>
                    {category.description}
                  </option>
                ))}
              </Select>
            )}
          />
          {errors.categoria && (
            <ErrorMessage>
              <FiAlertCircle size={12} />
              {errors.categoria.message}
            </ErrorMessage>
          )}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="prioridad">Prioridad</Label>
          <Controller
            name="prioridad"
            control={control}
            render={({ field }) => (
              <Select
                id="prioridad"
                {...field}
                disabled={isLoadingPriorities || isLoading}
              >
                <option value="">Seleccione una prioridad</option>
                {priorities?.map(priority => (
                  <option key={priority.name} value={priority.name}>
                    {priority.displayName}
                  </option>
                ))}
              </Select>
            )}
          />
          {errors.prioridad && (
            <ErrorMessage>
              <FiAlertCircle size={12} />
              {errors.prioridad.message}
            </ErrorMessage>
          )}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="fechaLimite">Fecha límite (opcional)</Label>
          <Controller
            name="fechaLimite"
            control={control}
            render={({ field }) => (
              <Input id="fechaLimite" type="date" {...field} />
            )}
          />
        </FormGroup>

        <FormGroup>
          <Label>Archivos adjuntos (opcional)</Label>
          <FileInput>
            <Button type="button" disabled={isLoading}>
              <FiPaperclip size={16} />
              Adjuntar archivos
            </Button>
            <HiddenInput
              type="file"
              multiple
              onChange={handleFileChange}
              disabled={isLoading}
            />
          </FileInput>
          {files.length > 0 && (
            <FileList>
              {files.map((file, index) => (
                <FileItem key={index}>
                  <FileInfo>
                    <FiPaperclip size={14} />
                    {file.name} ({(file.size / 1024).toFixed(1)} KB)
                  </FileInfo>
                  {!isLoading && (
                    <RemoveButton
                      type="button"
                      onClick={() => handleRemoveFile(index)}
                      title="Eliminar archivo"
                    >
                      <FiX size={14} />
                    </RemoveButton>
                  )}
                </FileItem>
              ))}
            </FileList>
          )}
        </FormGroup>

        <ButtonGroup>
          <Button
            type="button"
            onClick={() => navigate('/app/solicitudes')}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            $primary
            disabled={isLoading}
          >
            {isLoading && (
              <LoadingSpinner>
                <FiLoader size={16} />
              </LoadingSpinner>
            )}
            <FiSend size={16} />
            {isCreatingSolicitud
              ? 'Enviando solicitud...'
              : isUploading
                ? 'Subiendo archivos...'
                : 'Enviar solicitud'
            }
          </Button>
        </ButtonGroup>
      </form>
    </FormContainer>
  );
};

export default SolicitudForm;
