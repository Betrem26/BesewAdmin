import React, { useState } from 'react';
import styled from 'styled-components';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { clearToken, clearUser } from '../store/features/userSlice';
import {
  FiHome, FiUsers, FiHeadphones, FiShield, FiBriefcase, FiTarget,
  FiSettings, FiLogOut, FiMenu, FiX, FiAlertCircle, FiTrendingUp,
  FiActivity, FiBell, FiBarChart2,
} from 'react-icons/fi';
import besewLogo from '../assets/besew-logo.jpg';

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: #f5f7fa;
`;

const Sidebar = styled.aside<{ $isOpen: boolean }>`
  width: ${p => p.$isOpen ? '260px' : '0'};
  background: #2c3e50;
  color: white;
  transition: width 0.3s ease;
  overflow: hidden;
  position: fixed;
  height: 100vh;
  z-index: 1000;
  @media (max-width: 768px) {
    width: ${p => p.$isOpen ? '260px' : '0'};
  }
`;

const SidebarHeader = styled.div`
  padding: 20px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  img { height: 32px; }
  span { font-size: 18px; font-weight: 600; }
`;

const CloseButton = styled.button`
  background: none; border: none; color: white; cursor: pointer; padding: 5px;
  display: none;
  @media (max-width: 768px) { display: block; }
`;

const Nav = styled.nav`padding: 20px 0;`;
const NavSection = styled.div`margin-bottom: 20px;`;

const NavItem = styled.div<{ $active: boolean }>`
  padding: 12px 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.2s;
  background: ${p => p.$active ? 'rgba(255,255,255,0.1)' : 'transparent'};
  border-left: 3px solid ${p => p.$active ? '#3498db' : 'transparent'};
  color: ${p => p.$active ? '#fff' : 'rgba(255,255,255,0.8)'};
  &:hover { background: rgba(255,255,255,0.05); color: #fff; }
  svg { font-size: 18px; }
  span { font-size: 14px; font-weight: 500; }
`;

const MainContent = styled.main<{ $sidebarOpen: boolean }>`
  flex: 1;
  margin-left: ${p => p.$sidebarOpen ? '260px' : '0'};
  transition: margin-left 0.3s ease;
  @media (max-width: 768px) { margin-left: 0; }
`;

const TopBar = styled.header`
  background: white;
  padding: 0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 0;
  z-index: 100;
`;

const TopBarMain = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 30px;
  border-bottom: 1px solid #e0e0e0;
`;

const TabsContainer = styled.div`
  display: flex;
  overflow-x: auto;
  padding: 0 30px;
  gap: 5px;
  background: #f9f9f9;
  &::-webkit-scrollbar { height: 4px; }
  &::-webkit-scrollbar-track { background: #f1f1f1; }
  &::-webkit-scrollbar-thumb { background: #888; border-radius: 2px; }
`;

const Tab = styled.button<{ $active: boolean }>`
  padding: 12px 16px;
  background: ${p => p.$active ? '#3498db' : 'transparent'};
  color: ${p => p.$active ? 'white' : '#666'};
  border: none;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  border-radius: 4px 4px 0 0;
  transition: all 0.2s;
  &:hover { background: ${p => p.$active ? '#2980b9' : '#e8e8e8'}; }
`;

const MenuButton = styled.button`
  background: none; border: none; cursor: pointer; padding: 8px;
  display: flex; align-items: center; color: #2c3e50; font-size: 20px;
`;

const UserInfo = styled.div`display: flex; align-items: center; gap: 15px;`;
const UserName = styled.span`font-weight: 500; color: #2c3e50;`;

const LogoutButton = styled.button`
  background: #e74c3c; color: white; border: none; padding: 8px 16px;
  border-radius: 4px; cursor: pointer; display: flex; align-items: center;
  gap: 8px; font-size: 14px; transition: background 0.2s;
  &:hover { background: #c0392b; }
`;

const ContentArea = styled.div`padding: 30px; min-height: calc(100vh - 70px);`;

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
    section: 'User Management',
    items: [
      { path: '/dashboard/users', label: 'Users', icon: <FiUsers /> },
      { path: '/dashboard/roles', label: 'Roles', icon: <FiShield /> },
    ],
  },
  {
    section: 'Business',
    items: [
      { path: '/dashboard/jobs', label: 'Jobs', icon: <FiBriefcase />, permission: 'VIEW_JOB_STATISTICS' },
      { path: '/dashboard/company-management', label: 'Company Management', icon: <FiUsers />, permission: 'VIEW_COMPANY_STATISTICS' },
      { path: '/dashboard/companies', label: 'Companies', icon: <FiUsers />, permission: 'VIEW_COMPANY_STATISTICS' },
      { path: '/dashboard/candidates', label: 'Candidates', icon: <FiTarget />, permission: 'VIEW_CANDIDATE_STATISTICS' },
      { path: '/dashboard/startups', label: 'Startups', icon: <FiActivity /> },
    ],
  },
  {
    section: 'Financial',
    items: [
      { path: '/dashboard/commissions', label: 'Commissions', icon: <FiTrendingUp />, permission: 'VIEW_FINANCIAL_STATISTICS' },
      { path: '/dashboard/commission-management', label: 'Commission Management', icon: <FiBarChart2 />, permission: 'VIEW_FINANCIAL_STATISTICS' },
      { path: '/dashboard/subscriptions', label: 'Subscription Plans', icon: <FiTarget /> },
    ],
  },
  {
    section: 'Support & Reports',
    items: [
      { path: '/dashboard/support', label: 'Support', icon: <FiHeadphones /> },
      { path: '/dashboard/reports', label: 'Reports', icon: <FiAlertCircle />, permission: 'VIEW_ACCOUNT_STATISTICS' },
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
      { path: '/dashboard/psychometric', label: 'Psychometric Questions', icon: <FiTarget /> },
      { path: '/dashboard/psychometric-analytics', label: 'Psychometric Analytics', icon: <FiBarChart2 /> },
    ],
  },
  {
    section: 'Content',
    items: [
      { path: '/dashboard/job-categories', label: 'Job Categories', icon: <FiBriefcase /> },
      { path: '/dashboard/job-templates',  label: 'Job Templates & AI', icon: <FiTarget /> },
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
  const [activeTab, setActiveTab] = useState<string>('Main');
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);

  const handleLogout = () => {
    dispatch(clearToken());
    dispatch(clearUser());
    navigate('/');
  };

  React.useEffect(() => {
    const currentPath = location.pathname;
    
    // Find the section by matching the longest matching path
    // This prevents /dashboard/company-management from matching /dashboard/companies
    let foundSection = null;
    let longestMatch = '';
    
    menuItems.forEach(section => {
      section.items.forEach(item => {
        if (currentPath.startsWith(item.path) && item.path.length > longestMatch.length) {
          longestMatch = item.path;
          foundSection = section;
        }
      });
    });
    
    if (foundSection) setActiveTab(foundSection.section);
  }, [location.pathname]);

  const handleTabClick = (section: string, items: MenuItem[]) => {
    setActiveTab(section);
    if (items.length > 0) {
      handleNavigation(items[0].path);
    }
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    if (window.innerWidth <= 768) setSidebarOpen(false);
  };

  return (
    <LayoutContainer>
      <Sidebar $isOpen={sidebarOpen}>
        <SidebarHeader>
          <Logo>
            <img src={besewLogo} alt="BESEW" />
            <span>Admin</span>
          </Logo>
          <CloseButton onClick={() => setSidebarOpen(false)}><FiX /></CloseButton>
        </SidebarHeader>

        <Nav>
          {menuItems.map((section, idx) => {
            const shouldShow = section.section === activeTab;
            if (!shouldShow) return null;
            return (
              <NavSection key={idx}>
                {section.items.map(item => (
                  <NavItem
                    key={item.path}
                    $active={location.pathname === item.path}
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

      <MainContent $sidebarOpen={sidebarOpen}>
        <TopBar>
          <TopBarMain>
            <MenuButton onClick={() => setSidebarOpen(!sidebarOpen)}><FiMenu /></MenuButton>
            <UserInfo>
              <UserName>{user?.phonenumber || 'Admin'}</UserName>
              <LogoutButton onClick={handleLogout}><FiLogOut /> Logout</LogoutButton>
            </UserInfo>
          </TopBarMain>

          <TabsContainer>
            {menuItems.map(section => (
              <Tab
                key={section.section}
                $active={activeTab === section.section}
                onClick={() => handleTabClick(section.section, section.items)}
              >
                {section.section}
              </Tab>
            ))}
          </TabsContainer>
        </TopBar>

        <ContentArea>
          <Outlet />
        </ContentArea>
      </MainContent>
    </LayoutContainer>
  );
};

export default DashboardLayout;
