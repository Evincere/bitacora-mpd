import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { FiX, FiSave, FiHelpCircle } from 'react-icons/fi'
import { useCreateActivity, useUpdateActivity } from '@/hooks/useActivities'

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
  z-index: 1000;
  padding: 20px;
`

const FormContainer = styled.div`
  background-color: ${({ theme }) => theme.backgroundSecondary};
  border-radius: 8px;
  box-shadow: ${({ theme }) => theme.shadow};
  width: 100%;
  max-width: 700px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`

const FormHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
`

const Title = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin: 0;
`

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  color: ${({ theme }) => theme.textSecondary};

  &:hover {
    background-color: ${({ theme }) => theme.inputBackground};
    color: ${({ theme }) => theme.text};
  }
`

const FormContent = styled.div`
  padding: 20px;
  overflow-y: auto;
  flex: 1;
`

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  grid-column: ${({ $fullWidth }) => $fullWidth ? '1 / -1' : 'auto'};
`

const FormLabel = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.textSecondary};
  display: flex;
  align-items: center;
  gap: 6px;

  .tooltip {
    position: relative;
    display: inline-block;

    &:hover .tooltip-text {
      visibility: visible;
      opacity: 1;
    }
  }

  .tooltip-text {
    visibility: hidden;
    width: 200px;
    background-color: ${({ theme }) => theme.backgroundSecondary};
    color: ${({ theme }) => theme.text};
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
    box-shadow: ${({ theme }) => theme.shadow};
    font-weight: 400;
    font-size: 12px;

    &::after {
      content: "";
      position: absolute;
      top: 100%;
      left: 50%;
      margin-left: -5px;
      border-width: 5px;
      border-style: solid;
      border-color: ${({ theme }) => theme.backgroundSecondary} transparent transparent transparent;
    }
  }
`

const Input = styled.input`
  padding: 10px 12px;
  border-radius: 4px;
  border: 1px solid ${({ theme, error }) => error ? theme.error : theme.border};
  background-color: ${({ theme }) => theme.inputBackground};
  color: ${({ theme }) => theme.text};
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: ${({ theme, error }) => error ? theme.error : theme.primary};
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`

const Select = styled.select`
  padding: 10px 12px;
  border-radius: 4px;
  border: 1px solid ${({ theme, error }) => error ? theme.error : theme.border};
  background-color: ${({ theme }) => theme.inputBackground};
  color: ${({ theme }) => theme.text};
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: ${({ theme, error }) => error ? theme.error : theme.primary};
  }
`

const Textarea = styled.textarea`
  padding: 10px 12px;
  border-radius: 4px;
  border: 1px solid ${({ theme, error }) => error ? theme.error : theme.border};
  background-color: ${({ theme }) => theme.inputBackground};
  color: ${({ theme }) => theme.text};
  font-size: 14px;
  resize: vertical;
  min-height: 100px;

  &:focus {
    outline: none;
    border-color: ${({ theme, error }) => error ? theme.error : theme.primary};
  }
`

const ErrorMessage = styled.p`
  color: ${({ theme }) => theme.error};
  font-size: 12px;
  margin: 4px 0 0;
`

const FormFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 16px 20px;
  border-top: 1px solid ${({ theme }) => theme.border};
`

const SubmitButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background-color: ${({ theme }) => theme.primary};
  color: white;
  border-radius: 4px;
  font-weight: 500;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.buttonHover};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.textSecondary};
    cursor: not-allowed;
  }
`

const CancelButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background-color: transparent;
  color: ${({ theme }) => theme.text};
  border-radius: 4px;
  font-weight: 500;
  margin-right: 12px;

  &:hover {
    background-color: ${({ theme }) => theme.inputBackground};
  }
`

const formatDateForInput = (dateString) => {
  if (!dateString) return ''

  const date = new Date(dateString)
  return date.toISOString().split('T')[0]
}

const formatTimeForInput = (dateString) => {
  if (!dateString) return ''

  const date = new Date(dateString)
  return date.toTimeString().slice(0, 5)
}

const ActivityForm = ({ activity, onClose }) => {
  const createActivity = useCreateActivity()
  const updateActivity = useUpdateActivity()
  const isEditing = !!activity

  const initialFormData = {
    date: formatDateForInput(activity?.date) || formatDateForInput(new Date()),
    time: formatTimeForInput(activity?.date) || formatTimeForInput(new Date()),
    type: activity?.type || '',
    description: activity?.description || '',
    person: activity?.person || '',
    role: activity?.role || '',
    dependency: activity?.dependency || '',
    situation: activity?.situation || '',
    result: activity?.result || '',
    status: activity?.status || 'Pendiente',
    comments: activity?.comments || '',
    agent: activity?.agent || ''
  }

  const [formData, setFormData] = useState(initialFormData)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [onClose])

  const validateForm = () => {
    const newErrors = {}

    if (!formData.date) {
      newErrors.date = 'La fecha es requerida'
    }

    if (!formData.time) {
      newErrors.time = 'La hora es requerida'
    }

    if (!formData.type) {
      newErrors.type = 'El tipo de actividad es requerido'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es requerida'
    }

    if (!formData.status) {
      newErrors.status = 'El estado es requerido'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Combine date and time
      const dateTime = new Date(`${formData.date}T${formData.time}:00`)

      // Formatear la fecha en el formato que espera el backend (sin la Z al final)
      const formattedDate = dateTime.toISOString().replace(/\.\d{3}Z$/, '')
      const formattedNow = new Date().toISOString().replace(/\.\d{3}Z$/, '')

      const activityData = {
        ...formData,
        date: formattedDate,
        lastStatusChangeDate: formattedNow
      }

      delete activityData.time // Remove time field as it's now part of date

      if (isEditing) {
        await updateActivity.mutateAsync({
          id: activity.id,
          activityData
        })
      } else {
        await createActivity.mutateAsync(activityData)
      }

      onClose()
    } catch (error) {
      console.error('Error saving activity:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <Overlay onClick={handleOverlayClick}>
      <FormContainer>
        <FormHeader>
          <Title>{isEditing ? 'Editar actividad' : 'Nueva actividad'}</Title>
          <CloseButton onClick={onClose}>
            <FiX size={20} />
          </CloseButton>
        </FormHeader>

        <FormContent>
          <form onSubmit={handleSubmit}>
            <FormGrid>
              <FormGroup>
                <FormLabel>
                  Fecha
                  <div className="tooltip">
                    <FiHelpCircle size={14} />
                    <span className="tooltip-text">Fecha en que se realizó la actividad</span>
                  </div>
                </FormLabel>
                <Input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  error={errors.date}
                />
                {errors.date && <ErrorMessage>{errors.date}</ErrorMessage>}
              </FormGroup>

              <FormGroup>
                <FormLabel>
                  Hora
                </FormLabel>
                <Input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  error={errors.time}
                />
                {errors.time && <ErrorMessage>{errors.time}</ErrorMessage>}
              </FormGroup>

              <FormGroup>
                <FormLabel>
                  Tipo de actividad
                </FormLabel>
                <Select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  error={errors.type}
                >
                  <option value="">Seleccionar tipo</option>
                  <option value="Atención Personal">Atención Personal</option>
                  <option value="Atención Telefónica">Atención Telefónica</option>
                  <option value="Concursos">Concursos</option>
                  <option value="Solicitud de info">Solicitud de info</option>
                  <option value="Mails">Mails</option>
                  <option value="Multitareas">Multitareas</option>
                  <option value="Tomo Nota">Tomo Nota</option>
                </Select>
                {errors.type && <ErrorMessage>{errors.type}</ErrorMessage>}
              </FormGroup>

              <FormGroup>
                <FormLabel>
                  Estado
                </FormLabel>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  error={errors.status}
                >
                  <option value="Pendiente">Pendiente</option>
                  <option value="En progreso">En progreso</option>
                  <option value="Completado">Completado</option>
                </Select>
                {errors.status && <ErrorMessage>{errors.status}</ErrorMessage>}
              </FormGroup>

              <FormGroup>
                <FormLabel>
                  Persona
                </FormLabel>
                <Input
                  type="text"
                  name="person"
                  value={formData.person}
                  onChange={handleChange}
                  placeholder="Nombre de la persona relacionada"
                />
              </FormGroup>

              <FormGroup>
                <FormLabel>
                  Cargo / Rol
                </FormLabel>
                <Input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  placeholder="Cargo o rol de la persona"
                />
              </FormGroup>

              <FormGroup>
                <FormLabel>
                  Dependencia
                </FormLabel>
                <Input
                  type="text"
                  name="dependency"
                  value={formData.dependency}
                  onChange={handleChange}
                  placeholder="Dependencia o área"
                />
              </FormGroup>

              <FormGroup>
                <FormLabel>
                  Agente
                </FormLabel>
                <Input
                  type="text"
                  name="agent"
                  value={formData.agent}
                  onChange={handleChange}
                  placeholder="Nombre del agente"
                />
              </FormGroup>

              <FormGroup $fullWidth>
                <FormLabel>
                  Descripción
                </FormLabel>
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Descripción detallada de la actividad"
                  error={errors.description}
                />
                {errors.description && <ErrorMessage>{errors.description}</ErrorMessage>}
              </FormGroup>

              <FormGroup $fullWidth>
                <FormLabel>
                  Situación
                </FormLabel>
                <Textarea
                  name="situation"
                  value={formData.situation}
                  onChange={handleChange}
                  placeholder="Situación o contexto"
                />
              </FormGroup>

              <FormGroup $fullWidth>
                <FormLabel>
                  Resultado
                </FormLabel>
                <Textarea
                  name="result"
                  value={formData.result}
                  onChange={handleChange}
                  placeholder="Resultado o resolución"
                />
              </FormGroup>

              <FormGroup $fullWidth>
                <FormLabel>
                  Comentarios
                </FormLabel>
                <Textarea
                  name="comments"
                  value={formData.comments}
                  onChange={handleChange}
                  placeholder="Comentarios adicionales"
                />
              </FormGroup>
            </FormGrid>
          </form>
        </FormContent>

        <FormFooter>
          <CancelButton onClick={onClose}>
            Cancelar
          </CancelButton>
          <SubmitButton onClick={handleSubmit} disabled={isSubmitting}>
            <FiSave size={16} />
            {isSubmitting ? 'Guardando...' : 'Guardar'}
          </SubmitButton>
        </FormFooter>
      </FormContainer>
    </Overlay>
  )
}

export default ActivityForm
