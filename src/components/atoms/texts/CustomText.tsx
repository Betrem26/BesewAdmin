import React from 'react';
import styled, { DefaultTheme } from 'styled-components';

interface TextProps {
  variant?: 'heading' | 'paragraph' | 'caption';
  color?: string;
  textAlign?: 'left' | 'center' | 'right';
  fontSize?: keyof DefaultTheme['typography']['fontSize'];
  fontWeight?: keyof DefaultTheme['typography']['fontWeight'];
  lineHeight?: string;
  letterSpacing?: string;
  fontFamily?: 'primary' | 'secondary';
  customStyle?: any;
  children?:any
  background?:string
  padding?:string
}

const CustomText = styled.p<TextProps>`
  color: ${({ color, theme }) => color || theme.colors.text};
  font-size: ${({ fontSize, theme }) => theme.typography.fontSize[fontSize || 'xs']};
  font-weight: ${({ fontWeight, theme }) => theme.typography.fontWeight[fontWeight || 'bold']};
  line-height: ${({ lineHeight }) => lineHeight || '1.5'};
  letter-spacing: ${({ letterSpacing }) => letterSpacing || 'normal'};
  text-align: ${({ textAlign }) => textAlign || 'left'};
  font-family: ${({ fontFamily, theme }) => theme.typography.fontFamily[fontFamily || 'primary']};
  ${({ customStyle }) => customStyle};
  padding: ${({ padding }) => padding};
  background: ${({ background }) => background};

  
`;

const Text: React.FC<TextProps> = ({
  variant = 'paragraph',
  color,
  textAlign,
  fontSize,
  fontWeight,
  lineHeight,
  letterSpacing,
  fontFamily,
  customStyle,
  children,
  background,
  padding
}) => {
  return (
    <CustomText
      variant={variant}
      color={color}
      textAlign={textAlign}
      fontSize={fontSize}
      fontWeight={fontWeight}
      lineHeight={lineHeight}
      letterSpacing={letterSpacing}
      fontFamily={fontFamily}
      customStyle={customStyle}
      background = {background}
      padding = {padding}
    >
      {children}
    </CustomText>
  );
};

export default Text;
