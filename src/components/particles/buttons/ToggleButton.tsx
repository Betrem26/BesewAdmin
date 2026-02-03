import React, { useState } from 'react';
import styled from 'styled-components';

const ToggleContainer = styled.div`
  display: inline-block;
  cursor: pointer;
  width:fit-content;
`;

const ToggleInput = styled.input`
  display: none;
`;

interface ToggleProps {
  sliderWidth:string
}
const ToggleSlider = styled.span<{sliderPos:string, sliderWidth:string}>`
  position: relative;
  display: inline-block;
  width: ${({sliderWidth})=> sliderWidth ? sliderWidth: '40px'};
  height: 20px;
  background-color: #ccc;
  border-radius: 20px;
  transition: all 0.3s;
  &:before {
    position: absolute;
    content: '';
    
    height: 100%;
    width: 50%;
    left: ${({sliderPos})=>sliderPos};
    border:1px solid #ccc;
    background-color: white;
    border-radius: 50%;
    transition: all 0.3s;
  }
`;

const ToggleButton: React.FC<ToggleProps>  = ({sliderWidth}) => {
  const [checked, setChecked] = useState(false);

  const handleToggle = () => {
    console.log(checked);
    
    setChecked(!checked);
  };

  
  return (
    <ToggleContainer onClick={handleToggle}>
      <ToggleInput type="checkbox" checked={checked} onChange={() => {}} />
      <ToggleSlider sliderWidth={sliderWidth} sliderPos={checked ? '50%':'0%'}/>
    </ToggleContainer>
  );
};

export default ToggleButton;
