import React, { useState } from 'react';
import styled from 'styled-components';
import MenuManagement from './MenuManagement';
import RoleManagement from '../RoleManagement';

const SettingsContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  background: #f5f7fa;
`;

const TabsContainer = styled.div`
  display: flex;
  gap: 0;
  border-bottom: 2px solid #e0e0e0;
  background: white;
  padding: 0 30px;
`;

const Tab = styled.button<{ $active: boolean }>`
  padding: 16px 24px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: ${props => props.$active ? '#3498db' : '#666'};
  border-bottom: 3px solid ${props => props.$active ? '#3498db' : 'transparent'};
  transition: all 0.2s;

  &:hover {
    color: #3498db;
  }
`;

const ContentArea = styled.div`
  padding: 30px;
`;

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'menu' | 'roles'>('menu');

  return (
    <SettingsContainer>
      <TabsContainer>
        <Tab $active={activeTab === 'menu'} onClick={() => setActiveTab('menu')}>
          Menu Management
        </Tab>
        <Tab $active={activeTab === 'roles'} onClick={() => setActiveTab('roles')}>
          Role Management
        </Tab>
      </TabsContainer>
      <ContentArea>
        {activeTab === 'menu' && <MenuManagement />}
        {activeTab === 'roles' && <RoleManagement />}
      </ContentArea>
    </SettingsContainer>
  );
};

export default Settings;
