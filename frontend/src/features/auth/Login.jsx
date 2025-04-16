import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { FiUser, FiLock, FiEye, FiEyeOff } from 'react-icons/fi'
import { login, reset } from './authSlice'

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.background};
`

const LoginCard = styled.div`
  width: 100%;
  max-width: 400px;
  padding: 40px;
  background-color: ${({ theme }) => theme.backgroundSecondary};
  border-radius: 8px;
  box-shadow: ${({ theme }) => theme.shadow};
`

const Logo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
  
  img {
    width: 60px;
    height: 60px;
    margin-bottom: 16px;
  }
  
  h1 {
    font-size: 24px;
    font-weight: 700;
    color: ${({ theme }) => theme.text};
  }
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const FormGroup = styled.div`
  position: relative;
`

const Input = styled.input`
  width: 100%;
  padding: 12px 12px 12px 40px;
  border-radius: 4px;
  border: 1px solid ${({ theme, error }) => error ? theme.error : theme.border};
  background-color: ${({ theme }) => theme.inputBackground};
  color: ${({ theme }) => theme.text};
  font-size: 14px;
  transition: border-color 0.2s;
  
  &:focus {
    outline: none;
    border-color: ${({ theme, error }) => error ? theme.error : theme.primary};
  }
`

const InputIcon = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.textSecondary};
`

const PasswordToggle = styled.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.textSecondary};
  
  &:hover {
    color: ${({ theme }) => theme.text};
  }
`

const ErrorMessage = styled.p`
  color: ${({ theme }) => theme.error};
  font-size: 12px;
  margin-top: 5px;
`

const SubmitButton = styled.button`
  padding: 12px;
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

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user, error, isAuthenticated } = useSelector(state => state.auth)
  const { loading } = useSelector(state => state.ui)
  
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/')
    }
    
    return () => {
      dispatch(reset())
    }
  }, [isAuthenticated, navigate, dispatch])
  
  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.username.trim()) {
      newErrors.username = 'El nombre de usuario es requerido'
    }
    
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida'
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
  }
  
  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (validateForm()) {
      dispatch(login(formData))
    }
  }
  
  return (
    <LoginContainer>
      <LoginCard>
        <Logo>
          <img src="/logo.svg" alt="Bitácora" />
          <h1>Bitácora</h1>
        </Logo>
        
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <InputIcon>
              <FiUser size={16} />
            </InputIcon>
            <Input
              type="text"
              name="username"
              placeholder="Nombre de usuario"
              value={formData.username}
              onChange={handleChange}
              error={errors.username}
            />
            {errors.username && <ErrorMessage>{errors.username}</ErrorMessage>}
          </FormGroup>
          
          <FormGroup>
            <InputIcon>
              <FiLock size={16} />
            </InputIcon>
            <Input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Contraseña"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
            />
            <PasswordToggle
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
            </PasswordToggle>
            {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
          </FormGroup>
          
          {error && <ErrorMessage>{error.message}</ErrorMessage>}
          
          <SubmitButton type="submit" disabled={loading}>
            {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </SubmitButton>
        </Form>
      </LoginCard>
    </LoginContainer>
  )
}

export default Login
