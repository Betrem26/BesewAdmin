import React from 'react';
import styled, { keyframes } from 'styled-components';

// Define keyframe animation
const rotate = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

// Styled component for the loading spinner
const Spinner = styled.div`
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: #09f;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  background:white;
  animation: ${rotate} 1s linear infinite;
`;

// Wrapper component to center the spinner
const SpinnerWrapper = styled.div`
  z-index:3;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background:#0000ff44
`;

const LoadingSpinner: React.FC = () => {
  return (
    <SpinnerWrapper>
      <Spinner />
    </SpinnerWrapper>
  );
};

export default LoadingSpinner;
