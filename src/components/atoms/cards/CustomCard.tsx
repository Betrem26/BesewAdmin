import React from 'react';
import styled from 'styled-components';

// Styled component for the card
interface EmptyCardProps {
    background?: string;
    width?: string;
    height?: string;
    position?: string;
    boxShadow?: string;
    border?: string;
    customCss?: any;
    children?: React.ReactNode;
    borderRadius?:string;
    padding?:string;
    hoverStyles?:string;
  }

const CardContainer = styled.div<EmptyCardProps>`
  border: ${({ border }) => border};
  border-radius: ${({borderRadius})=> borderRadius};
  padding:${({padding})=>padding ? padding : '2px'};
  display:flex;
  justify-content:center;
  flex-direction:column;
  align-items:center;
  background: ${({ background }) => background };
  box-shadow: ${({ boxShadow }) => boxShadow };
  width: ${({ width }) => width };
  height: ${({ height }) => height };
  position: ${({ position }) => position};
  transition:all 0.3;
  &:hover {
    ${({ hoverStyles }) => hoverStyles}; // Apply hover styles
  }
  /* Apply custom CSS */
  ${({ customCss }) => customCss};
`;


const CustomCard: React.FC<EmptyCardProps> = ({
  background,
  width,
  height,
  position,
  boxShadow,
  border,
  customCss,
  children,
  borderRadius,
  padding,
  hoverStyles
}) => {
  return (
    <CardContainer
      background={background}
      width={width}
      height={height}
      position={position}
      boxShadow={boxShadow}
      border={border}
      customCss={customCss}
      borderRadius={borderRadius}
      padding = {padding}
      hoverStyles = {hoverStyles}
    >
      {children}
    </CardContainer>
  );
};

export default CustomCard;
