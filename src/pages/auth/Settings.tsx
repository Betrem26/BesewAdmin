import React from "react";
import styled from "styled-components";
import {
  FaUser,
  FaLock,
  FaEye,
  FaRegBell,
  FaRegCreditCard,
  FaQuestionCircle,
} from "react-icons/fa";
import besewLogo from "../../assets/besew-logo.jpg";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  width: 100vw;
  min-height: 100vh;
  background: #fff;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  padding: 18px 16px 0 16px;
  position: relative;
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
  text-align: left;
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
  padding: 10px 0;
  width: 120px;
  background: #131921;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  text-align: center;
  &:hover {
    background: #b71c1c;
  }
`;

const Settings: React.FC = () => {
  const navigate = useNavigate();

  const handleSignOut = () => {
    // Optionally clear user state here
    navigate("/login");
  };

  // Navigation handlers
  const handleAccountPreferences = () => {
    navigate("/account-preferences");
  };

  const handleSignInSecurity = () => {
    navigate("/signin-security"); // FIXED: Changed from console.log to navigate
  };

  const handleVisibility = () => {
    navigate("/visibility");
  };

  const handleAdvertisingData = () => {
    navigate("/advertising-data");
  };
  // const handleDataPrivacy = () => {
  //   // Add route when ready
  //   console.log("Data privacy clicked");
  // };

  const handleNotifications = () => {
    navigate("/notifications");
  };
  const handleHelpCenter = () => {
    navigate("/help-center");
  };

  return (
    <Container>
      <Header>
        <Logo src={besewLogo} alt="BESEW logo" />
        <Title>Settings</Title>
        <HelpIcon onClick={handleHelpCenter} />
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
        <ListItem onClick={handleAdvertisingData}>
          <FaRegCreditCard /> Advertising data
        </ListItem>
        <ListItem onClick={handleNotifications}>
          <FaRegBell /> Notifications
        </ListItem>
      </List>
      <FooterLinks>
        <span
          onClick={() => navigate("/help-center")}
          style={{ cursor: "pointer" }}
        >
          Help Center
        </span>
      </FooterLinks>
      <SignOutButton onClick={handleSignOut}>Sign Out</SignOutButton>
    </Container>
  );
};

export default Settings;
