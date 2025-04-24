import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { FiChevronDown, FiX } from 'react-icons/fi';

interface AutocompleteInputProps {
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  placeholder?: string;
  suggestions: string[];
  error?: string;
  onSuggestionSelected: (suggestion: string) => void;
  disabled?: boolean;
}

const InputContainer = styled.div`
  position: relative;
  width: 100%;
`;

const Input = styled.input<{ hasError?: boolean }>`
  width: 100%;
  padding: 10px 12px;
  padding-right: 32px;
  border-radius: 4px;
  border: 1px solid ${({ theme, hasError }) => hasError ? theme.error : theme.border};
  background-color: ${({ theme }) => theme.inputBackground};
  color: ${({ theme }) => theme.text};
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: ${({ theme, hasError }) => hasError ? theme.error : theme.primary};
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const IconButton = styled.button`
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: ${({ theme }) => theme.textSecondary};
  cursor: pointer;
  padding: 4px;

  &:hover {
    color: ${({ theme }) => theme.text};
  }
`;

const SuggestionsList = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 4px;
  padding: 0;
  list-style: none;
  background-color: ${({ theme }) => theme.backgroundSecondary};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 4px;
  box-shadow: ${({ theme }) => theme.shadow};
  max-height: 200px;
  overflow-y: auto;
  z-index: 10;
`;

const SuggestionItem = styled.li`
  padding: 8px 12px;
  cursor: pointer;
  font-size: 14px;
  color: ${({ theme }) => theme.text};

  &:hover {
    background-color: ${({ theme }) => theme.backgroundHover};
  }
`;

const ErrorMessage = styled.p`
  color: ${({ theme }) => theme.error};
  font-size: 12px;
  margin: 4px 0 0;
`;

const NoSuggestions = styled.div`
  padding: 8px 12px;
  font-size: 14px;
  color: ${({ theme }) => theme.textSecondary};
  font-style: italic;
`;

const AutocompleteInput: React.FC<AutocompleteInputProps> = ({
  id,
  value,
  onChange,
  onBlur,
  placeholder,
  suggestions,
  error,
  onSuggestionSelected,
  disabled = false
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLUListElement>(null);

  // Filtrar sugerencias basadas en el valor actual
  useEffect(() => {
    if (!value) {
      setFilteredSuggestions(suggestions.slice(0, 10)); // Mostrar las primeras 10 sugerencias
    } else {
      const filtered = suggestions
        .filter(suggestion => 
          suggestion.toLowerCase().includes(value.toLowerCase()))
        .slice(0, 10); // Limitar a 10 resultados
      setFilteredSuggestions(filtered);
    }
  }, [value, suggestions]);

  // Cerrar sugerencias al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current && 
        !inputRef.current.contains(event.target as Node) &&
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Manejar selección de sugerencia
  const handleSelectSuggestion = (suggestion: string) => {
    const event = {
      target: { value: suggestion }
    } as React.ChangeEvent<HTMLInputElement>;
    
    onChange(event);
    onSuggestionSelected(suggestion);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  // Manejar clic en el botón de limpiar
  const handleClear = () => {
    const event = {
      target: { value: '' }
    } as React.ChangeEvent<HTMLInputElement>;
    
    onChange(event);
    inputRef.current?.focus();
  };

  // Manejar clic en el botón de mostrar sugerencias
  const handleToggleSuggestions = () => {
    setShowSuggestions(!showSuggestions);
  };

  return (
    <InputContainer>
      <Input
        id={id}
        ref={inputRef}
        type="text"
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        onFocus={() => setShowSuggestions(true)}
        placeholder={placeholder}
        hasError={!!error}
        disabled={disabled}
      />
      
      <IconButton 
        type="button" 
        onClick={value ? handleClear : handleToggleSuggestions}
        tabIndex={-1}
      >
        {value ? <FiX size={16} /> : <FiChevronDown size={16} />}
      </IconButton>
      
      {showSuggestions && !disabled && (
        <SuggestionsList ref={suggestionsRef}>
          {filteredSuggestions.length > 0 ? (
            filteredSuggestions.map((suggestion, index) => (
              <SuggestionItem
                key={index}
                onClick={() => handleSelectSuggestion(suggestion)}
              >
                {suggestion}
              </SuggestionItem>
            ))
          ) : (
            <NoSuggestions>No hay sugerencias disponibles</NoSuggestions>
          )}
        </SuggestionsList>
      )}
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </InputContainer>
  );
};

export default AutocompleteInput;
