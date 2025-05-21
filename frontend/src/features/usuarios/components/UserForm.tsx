import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FiSave, FiX, FiHelpCircle } from 'react-icons/fi';
import { User, UserRole } from '@/core/types/models';
import { useCreateUser, useUpdateUser } from '../hooks/useUsers';
import { UserCreateDto, UserUpdateDto } from '../services/userService';
import PermissionsManager from './PermissionsManager';

// Estilos
const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
`;

const FormHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  margin: 0;
`;

const FormActions = styled.div`
  display: flex;
  gap: 10px;
`;

const Button = styled.button<{ $primary?: boolean, $danger?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: ${({ theme, $primary, $danger }) =>
    $primary ? theme.primary :
    $danger ? theme.danger + '20' :
    theme.cardBackground};
  color: ${({ theme, $primary, $danger }) =>
    $primary ? '#fff' :
    $danger ? theme.danger :
    theme.text};
  border: 1px solid ${({ theme, $primary, $danger }) =>
    $primary ? theme.primary :
    $danger ? theme.danger :
    theme.border};

  &:hover {
    background-color: ${({ theme, $primary, $danger }) =>
      $primary ? theme.primaryDark :
      $danger ? theme.danger + '30' :
      theme.hoverBackground};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FormLabel = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.textSecondary};
  display: flex;
  align-items: center;
  gap: 4px;

  .tooltip {
    position: relative;
    display: inline-flex;
    color: ${({ theme }) => theme.textSecondary};

    &:hover .tooltip-text {
      visibility: visible;
      opacity: 1;
    }

    .tooltip-text {
      visibility: hidden;
      width: 200px;
      background-color: ${({ theme }) => theme.tooltipBackground};
      color: ${({ theme }) => theme.tooltipText};
      text-align: center;
      border-radius: 6px;
      padding: 8px;
      position: absolute;
      z-index: 1;
      bottom: 125%;
      left: 50%;
      transform: translateX(-50%);
      opacity: 0;
      transition: opacity 0.3s;
      font-weight: normal;
      font-size: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    }
  }
`;

const Input = styled.input<{ $hasError?: boolean }>`
  padding: 10px 16px;
  border-radius: 8px;
  border: 1px solid ${({ theme, $hasError }) =>
    $hasError ? theme.danger : theme.border};
  background-color: ${({ theme }) => theme.inputBackground};
  color: ${({ theme }) => theme.text};
  font-size: 14px;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme, $hasError }) =>
      $hasError ? theme.danger : theme.primary};
    box-shadow: 0 0 0 2px ${({ theme, $hasError }) =>
      $hasError ? theme.danger + '20' : theme.primary + '20'};
  }
`;

const Select = styled.select<{ $hasError?: boolean }>`
  padding: 10px 16px;
  border-radius: 8px;
  border: 1px solid ${({ theme, $hasError }) =>
    $hasError ? theme.danger : theme.border};
  background-color: ${({ theme }) => theme.inputBackground};
  color: ${({ theme }) => theme.text};
  font-size: 14px;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme, $hasError }) =>
      $hasError ? theme.danger : theme.primary};
    box-shadow: 0 0 0 2px ${({ theme, $hasError }) =>
      $hasError ? theme.danger + '20' : theme.primary + '20'};
  }
`;

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.danger};
  font-size: 12px;
  margin-top: 4px;
`;

// Esquema de validación para crear usuario
const userCreateSchema = z.object({
  username: z.string()
    .min(3, 'El nombre de usuario debe tener al menos 3 caracteres')
    .max(50, 'El nombre de usuario no puede tener más de 50 caracteres')
    .regex(/^[a-zA-Z0-9._-]+$/, 'El nombre de usuario solo puede contener letras, números, puntos, guiones bajos y guiones'),
  password: z.string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])(?=\S+$).{8,}$/,
           'La contraseña debe contener al menos un número, una letra minúscula, una letra mayúscula y un carácter especial'),
  email: z.string()
    .email('Debe ser un correo electrónico válido'),
  firstName: z.string()
    .min(1, 'El nombre no puede estar vacío')
    .max(100, 'El nombre no puede tener más de 100 caracteres'),
  lastName: z.string()
    .min(1, 'El apellido no puede estar vacío')
    .max(100, 'El apellido no puede tener más de 100 caracteres'),
  role: z.string()
    .min(1, 'El rol no puede estar vacío'),
  position: z.string().optional(),
  department: z.string().optional(),
  active: z.boolean().optional(),
  permissions: z.array(z.string()).optional(),
});

// Esquema de validación para actualizar usuario
const userUpdateSchema = z.object({
  password: z.string()
    .regex(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])(?=\S+$).{8,}$/,
           'La contraseña debe contener al menos un número, una letra minúscula, una letra mayúscula y un carácter especial')
    .optional()
    .or(z.literal('')),
  email: z.string()
    .email('Debe ser un correo electrónico válido'),
  firstName: z.string()
    .min(1, 'El nombre no puede estar vacío')
    .max(100, 'El nombre no puede tener más de 100 caracteres'),
  lastName: z.string()
    .min(1, 'El apellido no puede estar vacío')
    .max(100, 'El apellido no puede tener más de 100 caracteres'),
  role: z.string()
    .min(1, 'El rol no puede estar vacío'),
  position: z.string().optional(),
  department: z.string().optional(),
  active: z.boolean().optional(),
  permissions: z.array(z.string()).optional(),
});

// Tipos para el formulario
type UserFormData = z.infer<typeof userCreateSchema>;
type UserUpdateFormData = z.infer<typeof userUpdateSchema>;

interface UserFormProps {
  user?: User;
  onSubmit?: (data: UserCreateDto | UserUpdateDto) => void;
  onCancel?: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ user, onSubmit, onCancel }) => {
  const isEditMode = !!user;
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();

  // Configurar React Hook Form con validación Zod
  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<UserFormData | UserUpdateFormData>({
    resolver: zodResolver(isEditMode ? userUpdateSchema : userCreateSchema) as any,
    defaultValues: isEditMode
      ? {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          position: user.position || '',
          department: user.department || '',
          active: user.active,
          permissions: user.permissions,
          password: '',
        }
      : {
          username: '',
          password: '',
          email: '',
          firstName: '',
          lastName: '',
          role: 'USUARIO',
          position: '',
          department: '',
          active: true,
          permissions: [],
        },
  });

  const handleFormSubmit = async (data: UserFormData | UserUpdateFormData) => {
    try {
      if (isEditMode) {
        // Si estamos editando, eliminamos campos vacíos y el username que no se puede cambiar
        const updateData = { ...data } as UserUpdateDto;
        if (!updateData.password) delete updateData.password;

        if (onSubmit) {
          onSubmit(updateData);
        } else {
          await updateUser.mutateAsync({ id: user.id, userData: updateData });
        }
      } else {
        // Si estamos creando un nuevo usuario
        if (onSubmit) {
          onSubmit(data as UserCreateDto);
        } else {
          await createUser.mutateAsync(data as UserCreateDto);
        }
      }
    } catch (error) {
      console.error('Error al guardar usuario:', error);
    }
  };

  return (
    <FormContainer>
      <FormHeader>
        <Title>{isEditMode ? 'Editar Usuario' : 'Nuevo Usuario'}</Title>
        <FormActions>
          <Button $danger onClick={onCancel}>
            <FiX size={16} />
            Cancelar
          </Button>
          <Button
            $primary
            onClick={handleSubmit(handleFormSubmit)}
            disabled={isSubmitting}
          >
            <FiSave size={16} />
            {isSubmitting ? 'Guardando...' : 'Guardar'}
          </Button>
        </FormActions>
      </FormHeader>

      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <FormGrid>
          {/* Nombre de usuario - solo visible en modo creación */}
          {!isEditMode && (
            <FormGroup>
              <FormLabel htmlFor="username">
                Nombre de usuario
                <div className="tooltip">
                  <FiHelpCircle size={14} />
                  <span className="tooltip-text">Identificador único para iniciar sesión (no se puede cambiar después)</span>
                </div>
              </FormLabel>
              <Controller
                name="username"
                control={control}
                render={({ field }) => (
                  <Input
                    id="username"
                    type="text"
                    $hasError={!!errors.username}
                    {...field}
                  />
                )}
              />
              {errors.username && <ErrorMessage>{errors.username.message as string}</ErrorMessage>}
            </FormGroup>
          )}

          {/* Contraseña */}
          <FormGroup>
            <FormLabel htmlFor="password">
              {isEditMode ? 'Nueva contraseña (dejar en blanco para mantener la actual)' : 'Contraseña'}
              <div className="tooltip">
                <FiHelpCircle size={14} />
                <span className="tooltip-text">Debe contener al menos 8 caracteres, incluyendo mayúsculas, minúsculas, números y caracteres especiales</span>
              </div>
            </FormLabel>
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <Input
                  id="password"
                  type="password"
                  $hasError={!!errors.password}
                  {...field}
                />
              )}
            />
            {errors.password && <ErrorMessage>{errors.password.message as string}</ErrorMessage>}
          </FormGroup>

          {/* Email */}
          <FormGroup>
            <FormLabel htmlFor="email">
              Correo electrónico
              <div className="tooltip">
                <FiHelpCircle size={14} />
                <span className="tooltip-text">Dirección de correo electrónico válida</span>
              </div>
            </FormLabel>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input
                  id="email"
                  type="email"
                  $hasError={!!errors.email}
                  {...field}
                />
              )}
            />
            {errors.email && <ErrorMessage>{errors.email.message as string}</ErrorMessage>}
          </FormGroup>

          {/* Nombre */}
          <FormGroup>
            <FormLabel htmlFor="firstName">
              Nombre
            </FormLabel>
            <Controller
              name="firstName"
              control={control}
              render={({ field }) => (
                <Input
                  id="firstName"
                  type="text"
                  $hasError={!!errors.firstName}
                  {...field}
                />
              )}
            />
            {errors.firstName && <ErrorMessage>{errors.firstName.message as string}</ErrorMessage>}
          </FormGroup>

          {/* Apellido */}
          <FormGroup>
            <FormLabel htmlFor="lastName">
              Apellido
            </FormLabel>
            <Controller
              name="lastName"
              control={control}
              render={({ field }) => (
                <Input
                  id="lastName"
                  type="text"
                  $hasError={!!errors.lastName}
                  {...field}
                />
              )}
            />
            {errors.lastName && <ErrorMessage>{errors.lastName.message as string}</ErrorMessage>}
          </FormGroup>

          {/* Rol */}
          <FormGroup>
            <FormLabel htmlFor="role">
              Rol
              <div className="tooltip">
                <FiHelpCircle size={14} />
                <span className="tooltip-text">Determina los permisos y acceso del usuario</span>
              </div>
            </FormLabel>
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <Select
                  id="role"
                  $hasError={!!errors.role}
                  {...field}
                >
                  <option value="ADMIN">Administrador</option>
                  <option value="SUPERVISOR">Supervisor</option>
                  <option value="ASIGNADOR">Asignador</option>
                  <option value="EJECUTOR">Ejecutor</option>
                  <option value="SOLICITANTE">Solicitante</option>
                  <option value="USUARIO">Usuario</option>
                  <option value="CONSULTA">Consulta</option>
                </Select>
              )}
            />
            {errors.role && <ErrorMessage>{errors.role.message as string}</ErrorMessage>}
          </FormGroup>

          {/* Cargo */}
          <FormGroup>
            <FormLabel htmlFor="position">
              Cargo
            </FormLabel>
            <Controller
              name="position"
              control={control}
              render={({ field }) => (
                <Input
                  id="position"
                  type="text"
                  $hasError={!!errors.position}
                  {...field}
                />
              )}
            />
            {errors.position && <ErrorMessage>{errors.position.message as string}</ErrorMessage>}
          </FormGroup>

          {/* Departamento */}
          <FormGroup>
            <FormLabel htmlFor="department">
              Departamento
            </FormLabel>
            <Controller
              name="department"
              control={control}
              render={({ field }) => (
                <Input
                  id="department"
                  type="text"
                  $hasError={!!errors.department}
                  {...field}
                />
              )}
            />
            {errors.department && <ErrorMessage>{errors.department.message as string}</ErrorMessage>}
          </FormGroup>

          {/* Estado (solo en modo edición) */}
          {isEditMode && (
            <FormGroup>
              <FormLabel htmlFor="active">
                Estado
              </FormLabel>
              <Controller
                name="active"
                control={control}
                render={({ field }) => (
                  <Select
                    id="active"
                    $hasError={!!errors.active}
                    value={field.value ? 'true' : 'false'}
                    onChange={(e) => field.onChange(e.target.value === 'true')}
                  >
                    <option value="true">Activo</option>
                    <option value="false">Inactivo</option>
                  </Select>
                )}
              />
              {errors.active && <ErrorMessage>{errors.active.message as string}</ErrorMessage>}
            </FormGroup>
          )}

          {/* Sección de permisos */}
          <div style={{ gridColumn: '1 / span 2', marginTop: '20px' }}>
            <Controller
              name="permissions"
              control={control}
              render={({ field }) => (
                <PermissionsManager
                  selectedRole={watch('role')}
                  selectedPermissions={field.value || []}
                  onChange={(permissions) => field.onChange(permissions)}
                />
              )}
            />
          </div>
        </FormGrid>
      </form>
    </FormContainer>
  );
};

export default UserForm;
