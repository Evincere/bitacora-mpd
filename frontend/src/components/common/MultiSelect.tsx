import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { FiChevronDown, FiX, FiCheck } from 'react-icons/fi';

export interface Option {
  value: string;
  label: string;
}

interface MultiSelectProps {
  options: Option[];
  value: Option[];
  onChange: (selected: Option[]) => void;
  placeholder?: string;
  disabled?: boolean;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Seleccionar...',
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleOption = (option: Option) => {
    const isSelected = value.some(item => item.value === option.value);
    
    if (isSelected) {
      onChange(value.filter(item => item.value !== option.value));
    } else {
      onChange([...value, option]);
    }
  };

  const removeOption = (e: React.MouseEvent, option: Option) => {
    e.stopPropagation();
    onChange(value.filter(item => item.value !== option.value));
  };

  const clearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange([]);
  };

  return (
    <Container ref={containerRef}>
      <SelectButton 
        onClick={() => !disabled && setIsOpen(!isOpen)}
        $isOpen={isOpen}
        $disabled={disabled}
      >
        <SelectContent>
          {value.length === 0 ? (
            <Placeholder>{placeholder}</Placeholder>
          ) : (
            <SelectedOptions>
              {value.map(option => (
                <SelectedOption key={option.value}>
                  {option.label}
                  <RemoveButton onClick={(e) => removeOption(e, option)}>
                    <FiX size={14} />
                  </RemoveButton>
                </SelectedOption>
              ))}
            </SelectedOptions>
          )}
        </SelectContent>
        <SelectActions>
          {value.length > 0 && (
            <ClearButton onClick={clearAll}>
              <FiX size={16} />
            </ClearButton>
          )}
          <ChevronIcon $isOpen={isOpen}>
            <FiChevronDown size={18} />
          </ChevronIcon>
        </SelectActions>
      </SelectButton>
      
      {isOpen && (
        <OptionsContainer>
          {options.map(option => {
            const isSelected = value.some(item => item.value === option.value);
            return (
              <Option 
                key={option.value} 
                onClick={() => toggleOption(option)}
                $isSelected={isSelected}
              >
                <OptionCheckbox $isSelected={isSelected}>
                  {isSelected && <FiCheck size={12} />}
                </OptionCheckbox>
                {option.label}
              </Option>
            );
          })}
        </OptionsContainer>
      )}
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  width: 100%;
`;

const SelectButton = styled.div<{ $isOpen: boolean; $disabled: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  min-height: 38px;
  padding: 6px 8px;
  border: 1px solid ${({ theme, $isOpen }) => $isOpen ? theme.primary : theme.borderColor};
  border-radius: 4px;
  background-color: ${({ theme, $disabled }) => $disabled ? theme.backgroundDisabled : theme.inputBackground};
  color: ${({ theme, $disabled }) => $disabled ? theme.textDisabled : theme.text};
  cursor: ${({ $disabled }) => $disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${({ theme, $disabled }) => $disabled ? theme.borderColor : theme.primary};
  }
  
  ${({ $isOpen, theme }) => $isOpen && `
    box-shadow: 0 0 0 2px ${theme.primary}30;
  `}
`;

const SelectContent = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

const Placeholder = styled.span`
  color: ${({ theme }) => theme.textSecondary};
`;

const SelectedOptions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
`;

const SelectedOption = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 2px 6px;
  background-color: ${({ theme }) => theme.backgroundTertiary};
  border-radius: 4px;
  font-size: 13px;
`;

const RemoveButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: ${({ theme }) => theme.textSecondary};
  cursor: pointer;
  padding: 2px;
  border-radius: 50%;
  
  &:hover {
    color: ${({ theme }) => theme.text};
    background-color: ${({ theme }) => theme.backgroundHover};
  }
`;

const SelectActions = styled.div`
  display: flex;
  align-items: center;
`;

const ClearButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: ${({ theme }) => theme.textSecondary};
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  
  &:hover {
    color: ${({ theme }) => theme.text};
    background-color: ${({ theme }) => theme.backgroundHover};
  }
`;

const ChevronIcon = styled.div<{ $isOpen: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.textSecondary};
  transition: transform 0.2s ease;
  transform: ${({ $isOpen }) => $isOpen ? 'rotate(180deg)' : 'rotate(0)'};
`;

const OptionsContainer = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 4px;
  max-height: 200px;
  overflow-y: auto;
  background-color: ${({ theme }) => theme.backgroundSecondary};
  border: 1px solid ${({ theme }) => theme.borderColor};
  border-radius: 4px;
  box-shadow: ${({ theme }) => theme.shadow};
  z-index: 10;
`;

const Option = styled.div<{ $isSelected: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  background-color: ${({ theme, $isSelected }) => $isSelected ? theme.backgroundHover : 'transparent'};
  
  &:hover {
    background-color: ${({ theme }) => theme.backgroundHover};
  }
`;

const OptionCheckbox = styled.div<{ $isSelected: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border: 1px solid ${({ theme, $isSelected }) => $isSelected ? theme.primary : theme.borderColor};
  border-radius: 3px;
  background-color: ${({ theme, $isSelected }) => $isSelected ? theme.primary : 'transparent'};
  color: white;
`;

export default MultiSelect;
