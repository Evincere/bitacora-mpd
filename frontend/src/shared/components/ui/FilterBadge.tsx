import React from 'react';
import styled from 'styled-components';
import { FiFilter, FiChevronDown } from 'react-icons/fi';

interface FilterBadgeProps {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  icon?: React.ReactNode;
  className?: string;
  placeholder?: string;
}

const FilterContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const SelectWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const StyledSelect = styled.select`
  appearance: none;
  padding: 8px 36px 8px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
  transition: all 0.2s ease;
  text-transform: none;
  letter-spacing: 0.5px;
  width: 100%;
  cursor: pointer;
  
  /* Usar un fondo oscuro con una ligera transparencia del color primario */
  background-color: ${({ theme }) => `${theme.primary}20`};
  color: ${({ theme }) => theme.primary};
  border: 1.5px solid ${({ theme }) => `${theme.primary}70`};
  
  &:hover, &:focus {
    transform: translateY(-1px);
    box-shadow: 0 5px 10px ${({ theme }) => `${theme.primary}40`};
    background-color: ${({ theme }) => `${theme.primary}30`};
    outline: none;
  }
  
  option {
    background-color: ${({ theme }) => theme.backgroundSecondary};
    color: ${({ theme }) => theme.text};
    font-weight: 500;
    padding: 8px;
  }
`;

const IconWrapper = styled.div`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.primary};
`;

const LeftIconWrapper = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.primary};
`;

const StyledSelectWithIcon = styled(StyledSelect)`
  padding-left: 36px;
`;

const FilterBadge: React.FC<FilterBadgeProps> = ({
  label,
  value,
  options,
  onChange,
  icon,
  className,
  placeholder = 'Todos'
}) => {
  return (
    <FilterContainer className={className}>
      <SelectWrapper>
        {icon && (
          <LeftIconWrapper>
            {icon}
          </LeftIconWrapper>
        )}
        {icon ? (
          <StyledSelectWithIcon
            value={value}
            onChange={(e) => onChange(e.target.value)}
            aria-label={label}
            title={label}
          >
            <option value="">{placeholder}</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </StyledSelectWithIcon>
        ) : (
          <StyledSelect
            value={value}
            onChange={(e) => onChange(e.target.value)}
            aria-label={label}
            title={label}
          >
            <option value="">{placeholder}</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </StyledSelect>
        )}
        <IconWrapper>
          <FiChevronDown size={16} />
        </IconWrapper>
      </SelectWrapper>
    </FilterContainer>
  );
};

export default FilterBadge;
