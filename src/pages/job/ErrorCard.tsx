import styled from 'styled-components';
import Button from '../../components/atoms/buttons/CustomButton';

// Styled wrapper for the card
const CardWrapper = styled.div`
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  padding: 24px;
`;

// Styled error message
const ErrorMessage = styled.h1`
  color: #ff4d4f;
  margin-bottom: 16px;
`;



// Styled text
const Text = styled.span`
  color: ${(props) => props.color};
`;

// Professional card component
export const ProfessionalCard = ({ error, onClose }) => {
  return (
    <CardWrapper>
      {error && (
        <ErrorMessage>
          {error.map((item, index) => (
            <span key={index}>
              {item}
              {index < error.length - 1 && <br />}
            </span>
          ))}
        </ErrorMessage>
      )}
      <Button background="blue" onClick={onClose}>
        <Text color="white">Close</Text>
      </Button>
    </CardWrapper>
  );
};

export default ProfessionalCard;
