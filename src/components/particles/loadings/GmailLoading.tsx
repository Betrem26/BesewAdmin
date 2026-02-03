import styled, { keyframes } from 'styled-components';

// Keyframes for the spinner loading animation
const rotateAnimation = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

// Styled wrapper for the loading animation
const LoadingWrapper = styled.div`
  width: 50px;
  height: 50px;
  position: relative;
`;

// Styled div for the spinner
const Spinner = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 40px;
  height: 40px;
  border: 4px solid transparent;
  border-top-color: #007bff;
  border-radius: 50%;
  animation: ${rotateAnimation} 1s linear infinite;
`;

// Loading animation component
const GmailLoading = () => {
  return (
    <LoadingWrapper>
      <Spinner />
    </LoadingWrapper>
  );
};

export default GmailLoading;
