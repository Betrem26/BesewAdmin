import React from 'react';
import styled from 'styled-components';
import { InputProps } from '../../../types/input.styles';


const CustomInput = styled.input<InputProps>`
  /* Common styles */
  border-radius: ${({ radius, theme }) => radius || theme.borderRadius.medium};
  background-color: ${({ background, theme }) => background || theme.colors.light};
  width: ${({ width }) => width || 'auto'};
  outline:none;
  font-weight:bold;
  color: ${({ color, theme }) => color || theme.colors.black.dark};
  font-size:${({fontSize})=> fontSize ? fontSize : '14px'};
  height: ${({ height }) => height || 'auto'};
  padding: ${({ padding, theme }) => padding || `${theme.spacing.sm} ${theme.spacing.md}`};
  ${({ customStyle }) => customStyle}; /* Apply custom styles */
`;

const Input: React.FC<InputProps> = ({color, type = 'text', disabled = false, placeholder, value,name, onChange, radius, background, width, height, padding, customStyle, fontSize }) => {
  return (
    <CustomInput
      type={type} // Pass the type prop to the input element
      disabled={disabled}
      placeholder={placeholder}
      value={value}
      name={name}
      onChange={onChange}
      radius={radius}
      background={background}
      width={width}
      height={height}
      padding={padding}
      customStyle={customStyle}
      fontSize = {fontSize}
      color={color}
    />
  );
};

export default Input;
