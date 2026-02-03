import React from 'react';
import styled from 'styled-components';
import { ButtonProps } from '../../../types/button.styles';


export const CustomButton = styled.button<ButtonProps>`
  /* Common styles */
  border-radius: ${({ radius, theme }) => radius || theme.borderRadius.medium};
  display:flex;
  align-items:center;
  justify-content:center;
  background: ${({ background, theme }) => background || theme.colors.primary.main};
  width: ${({ width }) => width || 'auto'};
  height: ${({ height }) => height || 'auto'};
  padding: ${({ padding, theme }) => padding || `${theme.spacing.sm} ${theme.spacing.sm}`};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  ${({ customStyle }) => customStyle}; /* Apply custom styles */
  
  /* Hover effect */
  &:hover {
    background-color: ${({ hoverBackground }) => hoverBackground }; /* Default hover background */
    ${({ hoverColor }) => hoverColor && `color: ${hoverColor};`}
    opacity:0.9;
    box-shadow:0 0 2px black  textColor={theme.colors.black} // Add textColor prop
    fontSize="16px" // Add fontSize prop
    hoverBackground={theme.colors.gray.light}
    onClick={() => handleOption(option)}
  }
  
  /* Media query for responsiveness */
  @media (max-width: ${({ mediaQueryWidth }) => mediaQueryWidth || '768px'}) {
    width: 100%;
  }
  
  /* Linear gradient */
  ${({ linearGradient }) => linearGradient && `background-image: ${linearGradient};`}
`;

const Button: React.FC<ButtonProps> = ({ variant = 'primary', disabled = false, onClick, type = 'button', children, radius, background, width, height, padding, hoverColor, hoverBackground, mediaQueryWidth, linearGradient, customStyle }) => {
  return (
    <CustomButton
      variant={variant}
      disabled={disabled}
      onClick={onClick}
      type={type}
      radius={radius}
      background={background}
      width={width}
      height={height}
      padding={padding}
      hoverColor={hoverColor}
      hoverBackground={hoverBackground}
      mediaQueryWidth={mediaQueryWidth}
      linearGradient={linearGradient}
      customStyle={customStyle}
    >
      {children}
    </CustomButton>
  );
};

export default Button;
