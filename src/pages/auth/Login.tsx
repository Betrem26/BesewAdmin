import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import bannerimage from '../../assets/banner-image.jpg';
import besewLogo from '../../assets/besew-logo.jpg';

const HeaderContainer = styled.header`
  background-color: #131921;
  display: flex;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;
  height: 60px;
  padding: 0 20px;
`;

const Logo = styled.div`
  color: white;
  font-size: 24px;
  font-weight: bold;
  padding: 5px 10px;
  border: 1px solid transparent;
  cursor: pointer;
  display: flex;
  align-items: center;

  &:hover {
    border: 1px solid white;
    border-radius: 3px;
  }
`;

const Ethiopia = styled.span`
  color: #fff;
  font-weight: bold;
  font-size: 18px;
  margin-left: 18px;
`;

const HeaderButton = styled.span`
  color: white;
  cursor: pointer;
  font-size: 16px;
  margin-left: 32px;
  padding: 6px 16px;
  border-radius: 4px;
  transition: background 0.2s, color 0.2s;
  &:hover {
    background: #232f3e;
    color: #ffd814;
  }
`;

const BannerImage = styled.img`
  width: 100%;         
  height: calc(100vh - 60px);       
  object-fit: cover;    
  display: block;
  margin: 0;
  padding: 0;
`;

const Header: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    try {
      navigate(path);
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  return (
    <>
      <HeaderContainer>
        <Logo onClick={() => handleNavigation('/')}>
          <img
            src={besewLogo}
            alt="BESEW logo"
            style={{ height: 32, marginRight: 8, verticalAlign: 'middle' }}
            onError={(e) => {
              console.error('Logo image failed to load');
              e.currentTarget.style.display = 'none';
            }}
          />
          BESEW
          <Ethiopia>Ethiopia</Ethiopia>
        </Logo>
        <div style={{ display: 'flex', alignItems: 'center', marginLeft: 'auto' }}>
          <HeaderButton onClick={() => handleNavigation('/signin')}>
            Hello, Sign in
          </HeaderButton>
        </div>
      </HeaderContainer>
      <BannerImage
        src={bannerimage}
        alt="Creative Teamwork Banner"
        onError={(e) => {
          console.error('Banner image failed to load');
          e.currentTarget.style.display = 'none';
        }}
      />
    </>
  );
};

export default Header;