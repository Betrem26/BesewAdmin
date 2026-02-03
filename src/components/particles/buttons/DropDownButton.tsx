import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { CustomButton } from '../../atoms/buttons/CustomButton'; // Assuming this is the filename where the Button component is saved
import { ButtonProps } from '../../../types/button.styles';
import theme from '../../../themes/Theme';
import { FaCaretDown, FaCaretUp } from 'react-icons/fa';

const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
  cursor:pointer;
  width:100%;
`;

const DropdownContent = styled.div<{ isOpen: boolean }>`
  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
  position: absolute;
  background-color: #f9f9f9;
  min-width: 160px;
  z-index: 1;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
`;

const DropdownButton = styled.div<DropdownProps>`
  background:${({ background }) => background};
  border:${({ border }) => border};
  padding:${({ padding }) => padding};
  color:${({ color }) => color};
  width:${({ width }) => width};
  display:flex;
  justify-content:space-between;
  align-items:center;
  ${({ sx }) => sx}
`;

const DropdownItem = CustomButton

interface DropdownProps extends ButtonProps {
  buttonLabel?: string;
  options?: string[];
  currentValue?: any;
  backgroundColor?: string
  border?: string
  iconColor?: string
  iconSize?: number
  sx?: string
}

const Dropdown: React.FC<DropdownProps> = ({ customStyle, buttonLabel, options, currentValue, backgroundColor, border, width, padding, iconColor, iconSize, sx }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentOption, setCurrentOption] = useState<string | null>(null);
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  const handleOption = (option: string) => {

    setCurrentOption(option)
    setIsOpen(false)
  }
  useEffect(() => {
    if (currentValue) {
      currentValue(currentOption);
    }
  }, [currentOption]);
  return (
    <DropdownContainer>
      <DropdownButton sx={sx} padding={padding} width={width} customStyle={customStyle} background={backgroundColor} border={border} onClick={toggleDropdown}>{currentOption ? currentOption : buttonLabel} {isOpen ? <FaCaretUp color={iconColor} fontSize={iconSize} /> : <FaCaretDown color={iconColor} fontSize={iconSize} />} </DropdownButton>
      <DropdownContent isOpen={isOpen}>
        {options.map((option, index) => (
          <DropdownItem
            customStyle={'border-radius:0'}
            background='white'
            hoverBackground={theme.colors.gray.light}
            onClick={() => handleOption(option)} key={index} width='100%' >{option}</DropdownItem>
        ))}

      </DropdownContent>
    </DropdownContainer>
  );
};

export default Dropdown;
