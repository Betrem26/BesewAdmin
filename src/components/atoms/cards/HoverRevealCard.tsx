import React, { useState } from 'react';
import styled, { keyframes, css } from 'styled-components';

// Keyframe animations
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const scaleIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

// Types
interface HoverRevealCardProps {
  /** Front content - visible by default */
  frontContent: React.ReactNode;
  /** Back/reveal content - shown on hover */
  revealContent: React.ReactNode;
  /** Card width */
  width?: string;
  /** Card height */
  height?: string;
  /** Card border radius */
  borderRadius?: string;
  /** Background color */
  background?: string;
  /** Box shadow */
  boxShadow?: string;
  /** Hover box shadow */
  hoverBoxShadow?: string;
  /** Animation type: 'slide' | 'fade' | 'scale' | 'shimmer' */
  animationType?: 'slide' | 'fade' | 'scale' | 'shimmer';
  /** Reveal direction for slide animation: 'top' | 'bottom' | 'left' | 'right' */
  revealDirection?: 'top' | 'bottom' | 'left' | 'right';
  /** Custom className */
  className?: string;
  /** Disable hover effect */
  disabled?: boolean;
  /** Card border */
  border?: string;
  /** Hover border */
  hoverBorder?: string;
}

// Styled card container
const CardWrapper = styled.div<{
  $width?: string;
  $height?: string;
  $borderRadius?: string;
  $background?: string;
  $boxShadow?: string;
  $hoverBoxShadow?: string;
  $border?: string;
  $hoverBorder?: string;
  $disabled?: boolean;
}>`
  position: relative;
  width: ${({ $width }) => $width || '300px'};
  height: ${({ $height }) => $height || '200px'};
  border-radius: ${({ $borderRadius }) => $borderRadius || '16px'};
  background: ${({ $background }) => $background || '#ffffff'};
  box-shadow: ${({ $boxShadow }) => $boxShadow || '0 4px 20px rgba(0, 0, 0, 0.08)'};
  border: ${({ $border }) => $border || '1px solid rgba(0, 0, 0, 0.05)'};
  overflow: hidden;
  cursor: ${({ $disabled }) => $disabled ? 'default' : 'pointer'};
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    box-shadow: ${({ $hoverBoxShadow, $boxShadow, $disabled }) => 
      $disabled ? $boxShadow || '0 4px 20px rgba(0, 0, 0, 0.08)' : 
      $hoverBoxShadow || '0 12px 40px rgba(0, 0, 0, 0.15)'};
    border: ${({ $hoverBorder, $disabled }) => $disabled ? 'none' : $hoverBorder || '1px solid rgba(99, 102, 241, 0.3)'};
    transform: ${({ $disabled }) => $disabled ? 'none' : 'translateY(-4px)'};
  }
`;

// Front content layer
const FrontContent = styled.div<{
  $visible: boolean;
  $disabled?: boolean;
}>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: ${({ $visible, $disabled }) => $disabled ? 1 : $visible ? 1 : 0};
  visibility: ${({ $visible, $disabled }) => $disabled ? 'visible' : $visible ? 'visible' : 'hidden'};
  z-index: ${({ $visible }) => $visible ? 2 : 1};
`;

// Reveal content layer
const RevealContent = styled.div<{
  $animationType?: string;
  $visible: boolean;
  $disabled?: boolean;
}>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: ${({ $visible, $disabled }) => $disabled ? 0 : $visible ? 1 : 0};
  visibility: ${({ $visible, $disabled }) => $disabled ? 'hidden' : $visible ? 'visible' : 'hidden'};
  z-index: ${({ $visible }) => $visible ? 3 : 1};
  
  ${({ $animationType, $visible, $disabled }) => !$disabled && $visible && css`
    ${$animationType === 'fade' && css`
      animation: ${fadeInUp} 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    `}
    ${$animationType === 'scale' && css`
      animation: ${scaleIn} 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    `}
    ${$animationType === 'shimmer' && css`
      animation: ${fadeInUp} 0.4s forwards;
    `}
  `}
`;

// Slide front content wrapper
const SlideFrontContent = styled(FrontContent)<{ $direction?: string; $visible: boolean }>`
  transform: ${({ $direction, $visible }) => {
    if ($visible) return 'translateY(0)';
    switch ($direction) {
      case 'top': return 'translateY(-100%)';
      case 'bottom': return 'translateY(100%)';
      case 'left': return 'translateX(-100%)';
      case 'right': return 'translateX(100%)';
      default: return 'translateY(100%)';
    }
  }};
`;

// Slide reveal content wrapper
const SlideRevealContent = styled(RevealContent)<{ $direction?: string }>`
  transform: ${({ $direction }) => {
    switch ($direction) {
      case 'top': return 'translateY(-100%)';
      case 'bottom': return 'translateY(100%)';
      case 'left': return 'translateX(-100%)';
      case 'right': return 'translateX(100%)';
      default: return 'translateY(100%)';
    }
  }};
  
  ${({ $visible }) => $visible && css`
    transform: translateY(0);
  `}
`;

// Gradient overlay for enhanced visuals
const GradientOverlay = styled.div<{ $visible: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%);
  opacity: ${({ $visible }) => $visible ? 1 : 0};
  transition: opacity 0.4s ease;
  pointer-events: none;
  z-index: 1;
`;

const HoverRevealCard: React.FC<HoverRevealCardProps> = ({
  frontContent,
  revealContent,
  width,
  height,
  borderRadius,
  background,
  boxShadow,
  hoverBoxShadow,
  animationType = 'fade',
  revealDirection = 'bottom',
  className,
  disabled = false,
  border,
  hoverBorder,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    if (!disabled) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    if (!disabled) {
      setIsHovered(false);
    }
  };

  const renderContent = () => {
    if (animationType === 'slide') {
      return (
        <>
          <SlideFrontContent 
            $direction={revealDirection} 
            $visible={!isHovered} 
            $disabled={disabled}
          >
            {frontContent}
          </SlideFrontContent>
          <SlideRevealContent 
            $animationType={animationType} 
            $visible={isHovered} 
            $disabled={disabled}
            $direction={revealDirection}
          >
            {revealContent}
          </SlideRevealContent>
        </>
      );
    }

    return (
      <>
        <FrontContent $visible={!isHovered} $disabled={disabled}>
          {frontContent}
        </FrontContent>
        <RevealContent 
          $animationType={animationType} 
          $visible={isHovered} 
          $disabled={disabled}
        >
          {revealContent}
        </RevealContent>
      </>
    );
  };

  return (
    <CardWrapper
      $width={width}
      $height={height}
      $borderRadius={borderRadius}
      $background={background}
      $boxShadow={boxShadow}
      $hoverBoxShadow={hoverBoxShadow}
      $border={border}
      $hoverBorder={hoverBorder}
      $disabled={disabled}
      className={className}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <GradientOverlay $visible={isHovered} />
      {renderContent()}
    </CardWrapper>
  );
};

export default HoverRevealCard;
