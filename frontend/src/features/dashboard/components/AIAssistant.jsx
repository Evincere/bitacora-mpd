import { useState } from 'react'
import styled from 'styled-components'
import { FiSend, FiMessageSquare } from 'react-icons/fi'

const Card = styled.div`
  background-color: ${({ theme }) => theme.cardBackground};
  border-radius: 8px;
  padding: 20px;
  box-shadow: ${({ theme }) => theme.shadow};
`

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
`

const IconWrapper = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background-color: ${({ theme }) => `${theme.primary}20`};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.primary};
  margin-right: 12px;
`

const Title = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin: 0;
`

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 240px;
  overflow-y: auto;
  margin-bottom: 16px;
  padding-right: 4px;
  
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.backgroundSecondary};
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.scrollbarThumb};
    border-radius: 2px;
  }
`

const Message = styled.div`
  display: flex;
  align-items: flex-start;
  
  &.ai {
    flex-direction: row;
  }
  
  &.user {
    flex-direction: row-reverse;
  }
`

const Avatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: ${({ isAI, theme }) => isAI ? `${theme.primary}20` : `${theme.accent}20`};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ isAI, theme }) => isAI ? theme.primary : theme.accent};
  margin: 0 8px;
  flex-shrink: 0;
`

const MessageBubble = styled.div`
  padding: 10px 12px;
  border-radius: 12px;
  max-width: 80%;
  
  &.ai {
    background-color: ${({ theme }) => theme.backgroundSecondary};
    border-top-left-radius: 4px;
  }
  
  &.user {
    background-color: ${({ theme }) => `${theme.accent}20`};
    color: ${({ theme }) => theme.text};
    border-top-right-radius: 4px;
  }
`

const MessageText = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 1.4;
`

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: ${({ theme }) => theme.inputBackground};
  border-radius: 8px;
  padding: 4px;
`

const Input = styled.input`
  flex: 1;
  padding: 8px 12px;
  background: none;
  border: none;
  color: ${({ theme }) => theme.text};
  font-size: 14px;
  
  &:focus {
    outline: none;
  }
  
  &::placeholder {
    color: ${({ theme }) => theme.textSecondary};
  }
`

const SendButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.primary};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: ${({ theme }) => theme.buttonHover};
  }
  
  &:disabled {
    background-color: ${({ theme }) => theme.textSecondary};
    cursor: not-allowed;
  }
`

const AIAssistant = () => {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: '¡Hola! Soy tu asistente IA. ¿En qué puedo ayudarte hoy?',
      sender: 'ai'
    }
  ])
  
  const handleSendMessage = () => {
    if (!input.trim()) return
    
    // Agregar mensaje del usuario
    const userMessage = {
      id: Date.now(),
      text: input,
      sender: 'user'
    }
    
    setMessages(prev => [...prev, userMessage])
    setInput('')
    
    // Simular respuesta de la IA
    setTimeout(() => {
      const aiResponses = [
        'Estoy analizando tus actividades recientes. Parece que tienes 3 tareas pendientes de alta prioridad.',
        'He detectado un patrón en tus registros. Las actividades de tipo "Atención" suelen tomar más tiempo del estimado.',
        'Basado en tu historial, te recomendaría priorizar la documentación de los concursos pendientes.',
        'Acabo de revisar el calendario. Tienes una reunión importante mañana a las 10:00 AM.'
      ]
      
      const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)]
      
      const aiMessage = {
        id: Date.now(),
        text: randomResponse,
        sender: 'ai'
      }
      
      setMessages(prev => [...prev, aiMessage])
    }, 1000)
  }
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage()
    }
  }
  
  return (
    <Card>
      <CardHeader>
        <IconWrapper>
          <FiMessageSquare size={20} />
        </IconWrapper>
        <Title>Asistente IA</Title>
      </CardHeader>
      
      <ChatContainer>
        {messages.map(message => (
          <Message key={message.id} className={message.sender}>
            <Avatar isAI={message.sender === 'ai'}>
              {message.sender === 'ai' ? 'IA' : 'TÚ'}
            </Avatar>
            <MessageBubble className={message.sender}>
              <MessageText>{message.text}</MessageText>
            </MessageBubble>
          </Message>
        ))}
      </ChatContainer>
      
      <InputContainer>
        <Input
          placeholder="Escribe un mensaje..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <SendButton 
          onClick={handleSendMessage}
          disabled={!input.trim()}
        >
          <FiSend size={16} />
        </SendButton>
      </InputContainer>
    </Card>
  )
}

export default AIAssistant
