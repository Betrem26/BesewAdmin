import React, { useState } from 'react';
import styled from 'styled-components';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { clearToken, clearUser } from '../store/features/userSlice';
import { checkPermission } from '../utils/rbac';
import {
  FiHome,
  FiUsers,
  FiHeadphones,
  FiShield,
  FiBriefcase,
  FiTarget,
  FiSettings,
  FiLogOut,
  FiMenu,
  FiX,
  FiAlertCircle,
  FiTrendingUp,
  FiActivity,
  FiBell,
  FiBarChart2,
} from 'react-icons/fi';
import besewLogo from '../assets/besew-logo.jpg';

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: #f5f7fa;
`;

const Sidebar = styled.aside<{ isOpen: boolean }>`
  width: ${props => props.isOpen ? '260px' : '0'};
  background: #2c3e50;
  color: white;
  transition: width 0.3s ease;
  overflow: hidden;
  position: fixed;
  height: 100vh;
  z-index: 1000;

  @media (max-width: 768px) {
    width: ${props => props.isOpen ? '260px' : '0'};
  }
`;

const SidebarHeader = styled.div`
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  
  img {
    height: 32px;
  }
  
  span {
    font-size: 18px;
    font-weight: 600;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 5px;
  display: none;

  @media (max-width: 768px) {
    display: block;
  }
`;

const Nav = styled.nav`
  padding: 20px 0;
`;

const NavSection = styled.div`
  margin-bottom: 20px;
`;

const NavSectionTitle = styled.div`
  padding: 10px 20px;
  font-size: 12px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.5);
  font-weight: 600;
  letter-spacing: 1px;
`;

const NavItem = styled.div<{ active: boolean }>`
  padding: 12px 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.2s;
  background: ${props => props.active ? 'rgba(255, 255, 255, 0.1)' : 'transparent'};
  border-left: 3px solid ${props => props.active ? '#3498db' : 'transparent'};
  color: ${props => props.active ? '#fff' : 'rgba(255, 255, 255, 0.8)'};

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    color: #fff;
  }

  svg {
    font-size: 18px;
  }

  span {
    font-size: 14px;
    font-weight: 500;
  }
`;

const MainContent = styled.main<{ sidebarOpen: boolean }>`
  flex: 1;
  margin-left: ${props => props.sidebarOpen ? '260px' : '0'};
  transition: margin-left 0.3s ease;
  
  @media (max-width: 768px) {
    margin-left: 0;
  }
`;

const TopBar = styled.header`
  background: white;
  padding: 15px 30px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  color: #2c3e50;
  font-size: 20px;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const UserName = styled.span`
  font-weight: 500;
  color: #2c3e50;
`;

const LogoutButton = styled.button`
  background: #e74c3c;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  transition: background 0.2s;

  &:hover {
    background: #c0392b;
  }
`;

const ContentArea = styled.div`
  padding: 30px;
  min-height: calc(100vh - 70px);
`;

interface MenuItem {
  path: string;
  label: string;
  icon: React.ReactNode;
  permission?: string;
}

const menuItems: { section: string; items: MenuItem[] }[] = [
  {
    section: 'Main',
    items: [
      { path: '/dashboard', label: 'Dashboard', icon: <FiHome /> },
      { path: '/dashboard/executive', label: 'Executive Overview', icon: <FiTrendingUp /> },
    ],
  },
  {
    section: 'Monitoring',
    items: [
      { path: '/dashboard/system-health', label: 'System Health', icon: <FiActivity /> },
      { path: '/dashboard/analytics', label: 'Analytics Dashboard', icon: <FiBarChart2 /> },
      { path: '/dashboard/notifications', label: 'Notification Center', icon: <FiBell /> },
      { path: '/dashboard/audit-logs', label: 'Audit Logs', icon: <FiShield />, permission: 'VIEW_ACTIVITY_LOGS' },
    ],
  },
  {
    section: 'Management',
    items: [
      { path: '/dashboard/users', label: 'User Management', icon: <FiUsers />, permission: 'MANAGE_USERS' },
      { path: '/dashboard/roles', label: 'Role Management', icon: <FiShield />, permission: 'MANAGE_ROLES' },
      { path: '/dashboard/jobs', label: 'Job Monitoring', icon: <FiBriefcase />, permission: 'VIEW_JOB_STATISTICS' },
      { path: '/dashboard/startups', label: 'Company Management', icon: <FiActivity /> },
      { path: '/dashboard/candidates', label: 'Candidate Management', icon: <FiTarget />, permission: 'VIEW_CANDIDATE_STATISTICS' },
      { path: '/dashboard/commissions', label: 'Commission Tracking', icon: <FiTrendingUp />, permission: 'VIEW_FINANCIAL_STATISTICS' },
      { path: '/dashboard/support', label: 'Customer Support', icon: <FiHeadphones /> },
      { path: '/dashboard/reports', label: 'Account Reports', icon: <FiAlertCircle />, permission: 'VIEW_ACCOUNT_STATISTICS' },
    ],
  },
  {
    section: 'Security',
    items: [
      { path: '/dashboard/otp', label: 'OTP Management', icon: <FiShield /> },
    ],
  },
  {
    section: 'Psychometric & Assessment',
    items: [
      { path: '/dashboard/psychometric', label: 'Psychometric Questions', icon: <FiTarget />, permission: 'MANAGE_PSYCHOMETRIC' },
      { path: '/dashboard/psychometric-analytics', label: 'Psychometric Analytics', icon: <FiBarChart2 />, permission: 'VIEW_PSYCHOMETRIC_ANALYTICS' },
    ],
  },
  {
    section: 'Content',
    items: [
      { path: '/dashboard/job-categories', label: 'Job Categories', icon: <FiBriefcase /> },
    ],
  },
  {
    section: 'System',
    items: [
      { path: '/dashboard/settings', label: 'Settings', icon: <FiSettings /> },
    ],
  },
];

const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);

  const handleLogout = () => {
    dispatch(clearToken());
    dispatch(clearUser());
    navigate('/');
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    if (window.innerWidth <= 768) {
      setSidebarOpen(false);
    }
  };

  return (
    <LayoutContainer>
      <Sidebar isOpen={sidebarOpen}>
        <SidebarHeader>
          <Logo>
            <img src={besewLogo} alt="BESEW" />
            <span>Admin</span>
          </Logo>
          <CloseButton onClick={() => setSidebarOpen(false)}>
            <FiX />
          </CloseButton>
        </SidebarHeader>

        <Nav>
          {menuItems.map((section, idx) => {
            // Filter items based on permissions
            const visibleItems = section.items.filter(item => {
              if (!item.permission) return true;
              return checkPermission(item.permission as any);
            });

            // Don't render section if no visible items
            if (visibleItems.length === 0) return null;

            return (
              <NavSection key={idx}>
                <NavSectionTitle>{section.section}</NavSectionTitle>
                {visibleItems.map((item) => (
                  <NavItem
                    key={item.path}
                    active={location.pathname === item.path}
                    onClick={() => handleNavigation(item.path)}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </NavItem>
                ))}
              </NavSection>
            );
          })}
        </Nav>
      </Sidebar>

      <MainContent sidebarOpen={sidebarOpen}>
        <TopBar>
          <MenuButton onClick={() => setSidebarOpen(!sidebarOpen)}>
            <FiMenu />
          </MenuButton>

          <UserInfo>
            <UserName>{user?.phonenumber || 'Admin'}</UserName>
            <LogoutButton onClick={handleLogout}>
              <FiLogOut />
              Logout
            </LogoutButton>
          </UserInfo>
        </TopBar>

        <ContentArea>
          <Outlet />
        </ContentArea>
      </MainContent>
    </LayoutContainer>
  );
};

export default DashboardLayout;
