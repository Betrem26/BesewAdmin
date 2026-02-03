import React from 'react';
import styled from 'styled-components';
import { FaUser, FaLock, FaEye, FaShieldAlt, FaRegBell, FaRegCreditCard, FaArrowLeft, FaQuestionCircle } from 'react-icons/fa';
import besewLogo from '../../assets/besew-logo.jpg';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  max-width: 480px;
  margin: 0 auto;
  background: #fff;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  padding: 18px 16px 0 16px;
  position: relative;
`;

const BackArrow = styled(FaArrowLeft)`
  font-size: 22px;
  cursor: pointer;
`;

const HelpIcon = styled(FaQuestionCircle)`
  font-size: 22px;
  position: absolute;
  right: 16px;
  top: 18px;
  color: #222;
  cursor: pointer;
`;

const Logo = styled.img`
  height: 48px;
  width: 48px;
  border-radius: 50%;
  margin-right: 12px;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
  display: flex;
  align-items: center;
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 32px 0 0 0;
  width: 100%;
`;

const ListItem = styled.li`
  display: flex;
  align-items: center;
  padding: 18px 16px;
  font-size: 1.15rem;
  font-weight: 500;
  color: #222;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  transition: background 0.15s;
  text-align: left;
  &:hover {
    background: #f5f5f5;
  }
  svg {
    margin-right: 18px;
    font-size: 1.3em;
    color: #555;
  }
`;

const FooterLinks = styled.div`
  margin: 32px 0 0 0;
  padding: 0 16px;
  color: #555;
  font-size: 1rem;
  display: flex;
  flex-direction: column;
  gap: 8px;
  text-align: left;
`;

const SignOutButton = styled.button`
  margin: 32px 16px 24px 16px;
  padding: 12px 0;
  width: calc(100% - 32px);
  background: #d32f2f;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  &:hover {
    background: #b71c1c;
  }
`;

const Settings: React.FC = () => {
  const navigate = useNavigate();

  const handleSignOut = () => {
    alert('Signed out! (Connect to backend to persist)');
  };

  const handleAccountPreferences = () => {
    navigate('/account-preferences');
  };

  const handleSignInSecurity = () => {
    navigate('/signin-security');
  };

  const handleVisibility = () => {
    console.log('Visibility clicked');
  };

  const handleDataPrivacy = () => {
    console.log('Data privacy clicked');
  };

  const handleAdvertisingData = () => {
    console.log('Advertising data clicked');
  };

  const handleNotifications = () => {
    console.log('Notifications clicked');
  };

  return (
    <Container>
      <Header>
        <BackArrow onClick={() => window.history.back()} />
        <Logo src={besewLogo} alt="BESEW logo" />
        <Title>Settings</Title>
        <HelpIcon />
      </Header>
      <List>
        <ListItem onClick={handleAccountPreferences}>
          <FaUser /> Account preferences
        </ListItem>
        <ListItem onClick={handleSignInSecurity}>
          <FaLock /> Sign in & security
        </ListItem>
        <ListItem onClick={handleVisibility}>
          <FaEye /> Visibility
        </ListItem>
        <ListItem onClick={handleDataPrivacy}>
          <FaShieldAlt /> Data privacy
        </ListItem>
        <ListItem onClick={handleAdvertisingData}>
          <FaRegCreditCard /> Advertising data
        </ListItem>
        <ListItem onClick={handleNotifications}>
          <FaRegBell /> Notifications
        </ListItem>
      </List>
      <FooterLinks>
        <span onClick={() => navigate('/help-center')} style={{ cursor: 'pointer' }}>Help Center</span>
      </FooterLinks>
      <SignOutButton onClick={handleSignOut}>Sign Out</SignOutButton>
    </Container>
  );
};

export default Settings;