import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiX, FiCheck, FiTag } from 'react-icons/fi';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Definición del esquema de validación con Zod
const categoriaSchema = z.object({
  nombre: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  descripcion: z.string().min(5, 'La descripción debe tener al menos 5 caracteres'),
  color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Debe ser un color hexadecimal válido')
});

type CategoriaFormData = z.infer<typeof categoriaSchema>;

const FormContainer = styled.div`
  padding: 24px;
`;

const FormHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const FormTitle = styled.h2`
  margin: 0;
  font-size: 18px;
  color: ${({ theme }) => theme.text};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.textSecondary};
  cursor: pointer;
  padding: 6px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.backgroundHover};
    color: ${({ theme }) => theme.text};
  }
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
  background-color: ${({ theme }) => theme.backgroundInput};
  color: ${({ theme }) => theme.text};
  font-size: 14px;
  transition: border-color 0.2s;

  &:focus {
    border-color: ${({ theme }) => theme.primary};
    outline: none;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px 12px;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.border};
  background-color: ${({ theme }) => theme.backgroundInput};
  color: ${({ theme }) => theme.text};
  font-size: 14px;
  min-height: 80px;
  resize: vertical;
  transition: border-color 0.2s;

  &:focus {
    border-color: ${({ theme }) => theme.primary};
    outline: none;
  }
`;

const ColorPickerContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ColorPreview = styled.div<{ $color: string }>`
  width: 36px;
  height: 36px;
  border-radius: 4px;
  background-color: ${({ $color }) => $color};
  border: 1px solid ${({ theme }) => theme.border};
`;

const ColorInput = styled.input`
  flex: 1;
  padding: 10px 12px;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.border};
  background-color: ${({ theme }) => theme.backgroundInput};
  color: ${({ theme }) => theme.text};
  font-size: 14px;
  transition: border-color 0.2s;

  &:focus {
    border-color: ${({ theme }) => theme.primary};
    outline: none;
  }
`;

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.error};
  font-size: 12px;
  margin-top: 4px;
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

const ColorPalette = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
`;

const ColorOption = styled.button<{ $color: string; $selected: boolean }>`
  width: 24px;
  height: 24px;
  border-radius: 4px;
  background-color: ${({ $color }) => $color};
  border: 2px solid ${({ $selected, theme }) => $selected ? theme.primary : 'transparent'};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: scale(1.1);
  }
`;

// Paleta de colores predefinidos
const PREDEFINED_COLORS = [
  '#3b82f6', // blue
  '#ef4444', // red
  '#10b981', // green
  '#f59e0b', // amber
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#06b6d4', // cyan
  '#14b8a6', // teal
  '#f97316', // orange
  '#6366f1', // indigo
  '#a855f7', // violet
  '#64748b', // slate
];

interface CategoriaFormProps {
  categoria?: {
    id?: number;
    nombre: string;
    descripcion: string;
    color: string;
  } | null;
  onSave: (categoria: CategoriaFormData) => void;
  onCancel: () => void;
}

const CategoriaForm: React.FC<CategoriaFormProps> = ({ categoria, onSave, onCancel }) => {
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<CategoriaFormData>({
    resolver: zodResolver(categoriaSchema),
    defaultValues: {
      nombre: categoria?.nombre || '',
      descripcion: categoria?.descripcion || '',
      color: categoria?.color || '#3b82f6'
    }
  });

  const currentColor = watch('color');

  const handleColorSelect = (color: string) => {
    setValue('color', color);
  };

  const onSubmit = (data: CategoriaFormData) => {
    onSave(data);
  };

  return (
    <FormContainer>
      <FormHeader>
        <FormTitle>
          <FiTag size={18} />
          {categoria ? 'Editar Categoría' : 'Nueva Categoría'}
        </FormTitle>
        <CloseButton onClick={onCancel}>
          <FiX size={20} />
        </CloseButton>
      </FormHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <FormGroup>
          <Label htmlFor="nombre">Nombre</Label>
          <Controller
            name="nombre"
            control={control}
            render={({ field }) => (
              <Input
                id="nombre"
                placeholder="Nombre de la categoría"
                {...field}
              />
            )}
          />
          {errors.nombre && <ErrorMessage>{errors.nombre.message}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="descripcion">Descripción</Label>
          <Controller
            name="descripcion"
            control={control}
            render={({ field }) => (
              <TextArea
                id="descripcion"
                placeholder="Descripción de la categoría"
                {...field}
              />
            )}
          />
          {errors.descripcion && <ErrorMessage>{errors.descripcion.message}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="color">Color</Label>
          <ColorPickerContainer>
            <ColorPreview $color={currentColor} />
            <Controller
              name="color"
              control={control}
              render={({ field }) => (
                <ColorInput
                  id="color"
                  type="text"
                  placeholder="#RRGGBB"
                  {...field}
                />
              )}
            />
          </ColorPickerContainer>
          {errors.color && <ErrorMessage>{errors.color.message}</ErrorMessage>}

          <ColorPalette>
            {PREDEFINED_COLORS.map((color) => (
              <ColorOption
                key={color}
                $color={color}
                $selected={currentColor === color}
                onClick={() => handleColorSelect(color)}
                type="button"
              />
            ))}
          </ColorPalette>
        </FormGroup>

        <ButtonGroup>
          <Button type="button" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" $primary>
            <FiCheck size={16} />
            {categoria ? 'Actualizar' : 'Crear'}
          </Button>
        </ButtonGroup>
      </form>
    </FormContainer>
  );
};

export default CategoriaForm;
