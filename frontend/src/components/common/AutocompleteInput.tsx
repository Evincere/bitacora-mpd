import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { FiX, FiChevronDown } from 'react-icons/fi';

interface AutocompleteInputProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  suggestions: string[];
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  name?: string;
  id?: string;
  className?: string;
  required?: boolean;
  autoFocus?: boolean;
  maxSuggestions?: number;
  onSuggestionSelected?: (suggestion: string) => void;
}

const AutocompleteInput: React.FC<AutocompleteInputProps> = ({
  value,
  onChange,
  onBlur,
  suggestions,
  placeholder = '',
  label,
  error,
  disabled = false,
  name,
  id,
  className,
  required = false,
  autoFocus = false,
  maxSuggestions = 5,
  onSuggestionSelected
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLUListElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filtrar sugerencias basadas en el valor actual
  useEffect(() => {
    if (!value.trim()) {
      setFilteredSuggestions([]);
      return;
    }

    const filtered = suggestions
      .filter(suggestion => 
        suggestion.toLowerCase().includes(value.toLowerCase()))
      .slice(0, maxSuggestions);
    
    setFilteredSuggestions(filtered);
    setActiveSuggestionIndex(0);
  }, [value, suggestions, maxSuggestions]);

  // Cerrar sugerencias al hacer clic fuera del componente
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    setShowSuggestions(true);
  };

  const handleFocus = () => {
    if (value && filteredSuggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
    setShowSuggestions(false);
    if (onSuggestionSelected) {
      onSuggestionSelected(suggestion);
    }
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Si no hay sugerencias, no hacer nada
    if (filteredSuggestions.length === 0) return;

    // Flecha abajo
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveSuggestionIndex(prev => 
        prev < filteredSuggestions.length - 1 ? prev + 1 : prev
      );
    }
    // Flecha arriba
    else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveSuggestionIndex(prev => prev > 0 ? prev - 1 : 0);
    }
    // Enter
    else if (e.key === 'Enter' && showSuggestions) {
      e.preventDefault();
      onChange(filteredSuggestions[activeSuggestionIndex]);
      setShowSuggestions(false);
      if (onSuggestionSelected) {
        onSuggestionSelected(filteredSuggestions[activeSuggestionIndex]);
      }
    }
    // Escape
    else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const clearInput = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    inputRef.current?.focus();
  };

  // Desplazar la lista de sugerencias para que la sugerencia activa sea visible
  useEffect(() => {
    if (showSuggestions && suggestionsRef.current) {
      const activeElement = suggestionsRef.current.children[activeSuggestionIndex] as HTMLElement;
      if (activeElement) {
        activeElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [activeSuggestionIndex, showSuggestions]);

  return (
    <Container ref={containerRef} className={className}>
      {label && (
        <Label htmlFor={id || name}>
          {label}
          {required && <RequiredMark>*</RequiredMark>}
        </Label>
      )}
      
      <InputWrapper $hasError={!!error}>
        <Input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={onBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          name={name}
          id={id || name}
          autoFocus={autoFocus}
          autoComplete="off"
        />
        
        {value && (
          <ClearButton onClick={clearInput}>
            <FiX size={16} />
          </ClearButton>
        )}
        
        <DropdownIcon>
          <FiChevronDown size={16} />
        </DropdownIcon>
      </InputWrapper>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      {showSuggestions && filteredSuggestions.length > 0 && (
        <SuggestionsList ref={suggestionsRef}>
          {filteredSuggestions.map((suggestion, index) => (
            <SuggestionItem
              key={suggestion}
              onClick={() => handleSuggestionClick(suggestion)}
              $isActive={index === activeSuggestionIndex}
            >
              {suggestion}
            </SuggestionItem>
          ))}
        </SuggestionsList>
      )}
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  width: 100%;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 6px;
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
`;

const RequiredMark = styled.span`
  color: ${({ theme }) => theme.danger};
  margin-left: 2px;
`;

const InputWrapper = styled.div<{ $hasError: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  border: 1px solid ${({ theme, $hasError }) => $hasError ? theme.danger : theme.border};
  border-radius: 4px;
  background-color: ${({ theme }) => theme.backgroundSecondary};
  transition: all 0.2s ease;

  &:focus-within {
    border-color: ${({ theme, $hasError }) => $hasError ? theme.danger : theme.primary};
    box-shadow: 0 0 0 2px ${({ theme, $hasError }) => $hasError ? `${theme.danger}30` : `${theme.primary}30`};
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 36px 10px 12px;
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.text};
  font-size: 14px;
  outline: none;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }

  &::placeholder {
    color: ${({ theme }) => theme.textSecondary};
  }
`;

const ClearButton = styled.button`
  position: absolute;
  right: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.textSecondary};
  padding: 0;
  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.text};
  }
`;

const DropdownIcon = styled.div`
  position: absolute;
  right: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.textSecondary};
  pointer-events: none;
`;

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.danger};
  font-size: 12px;
  margin-top: 4px;
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

const SuggestionItem = styled.li<{ $isActive: boolean }>`
  padding: 8px 12px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  background-color: ${({ theme, $isActive }) => $isActive ? theme.backgroundHover : 'transparent'};

  &:hover {
    background-color: ${({ theme }) => theme.backgroundHover};
  }
`;

export default AutocompleteInput;
