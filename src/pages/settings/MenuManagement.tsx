import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllMenuConfigs, updateMenuConfig, deleteMenuConfig, seedDefaultMenus, clearError, clearSuccess } from '../../store/features/menuConfigSlice';
import { RootState } from '../../store/store';

const UserTypeCategory = {
  JOB_SEEKER: 'JOB_SEEKER',
  GIG_WORKER: 'GIG_WORKER',
  EMPLOYER: 'EMPLOYER',
  AGGREGATOR: 'AGGREGATOR',
  STARTUP_FOUNDER: 'STARTUP_FOUNDER'
};

const WorkerType = {
  EMPLOYEE: 'EMPLOYEE',
  FREELANCER: 'FREELANCER',
  BOTH: 'BOTH',
  CONSULTANT: 'CONSULTANT',
  CONTRACTOR: 'CONTRACTOR'
};

const SubscriptionTier = {
  FREE: 'FREE',
  TRIAL: 'TRIAL',
  PREMIUM: 'PREMIUM',
  ENTERPRISE: 'ENTERPRISE'
};

const Container = styled.div`
  padding: 24px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: bold;
  color: #1a1a1a;
  margin: 0;
`;

const Button = styled.button<{ variant?: 'primary' | 'success' | 'danger' | 'secondary' }>`
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
  
  background: ${props => {
    switch(props.variant) {
      case 'success': return '#10b981';
      case 'danger': return '#ef4444';
      case 'secondary': return '#6b7280';
      default: return '#3b82f6';
    }
  }};
  color: white;
  
  &:hover {
    opacity: 0.9;
  }
`;

const Alert = styled.div<{ type: 'error' | 'success' }>`
  padding: 12px 16px;
  border-radius: 4px;
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${props => props.type === 'error' ? '#fee2e2' : '#dcfce7'};
  color: ${props => props.type === 'error' ? '#991b1b' : '#166534'};
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 16px;
`;

const Th = styled.th`
  background: #f3f4f6;
  padding: 12px;
  text-align: left;
  font-weight: 600;
  border: 1px solid #e5e7eb;
  font-size: 14px;
`;

const Td = styled.td`
  padding: 12px;
  border: 1px solid #e5e7eb;
  font-size: 14px;
`;

const Tr = styled.tr`
  &:hover {
    background: #f9fafb;
  }
`;

const LoadingText = styled.div`
  text-align: center;
  padding: 32px;
  color: #6b7280;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  cursor: pointer;
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const MenuManagement: React.FC = () => {
  const dispatch = useDispatch();
  const { items, loading, error, success } = useSelector((state: RootState) => state.menuConfig);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>({});

  useEffect(() => {
    dispatch(fetchAllMenuConfigs() as any);
  }, [dispatch]);

  const handleEdit = (item: any) => {
    setEditingId(item.menuId);
    setEditData({ ...item });
  };

  const handleSave = async () => {
    if (editingId) {
      dispatch(updateMenuConfig({ menuId: editingId, data: editData }) as any);
      setEditingId(null);
    }
  };

  const handleDelete = (menuId: string) => {
    if (window.confirm('Are you sure you want to delete this menu item?')) {
      dispatch(deleteMenuConfig(menuId) as any);
    }
  };

  const handleSeedDefaults = () => {
    if (window.confirm('This will seed default menu configurations. Continue?')) {
      dispatch(seedDefaultMenus() as any);
    }
  };

  const toggleUserType = (userType: string) => {
    const current = editData.allowedUserTypes || [];
    if (current.includes(userType)) {
      setEditData({
        ...editData,
        allowedUserTypes: current.filter((t: string) => t !== userType)
      });
    } else {
      setEditData({
        ...editData,
        allowedUserTypes: [...current, userType]
      });
    }
  };

  const toggleWorkerType = (workerType: string) => {
    const current = editData.allowedWorkerTypes || [];
    if (current.includes(workerType)) {
      setEditData({
        ...editData,
        allowedWorkerTypes: current.filter((t: string) => t !== workerType)
      });
    } else {
      setEditData({
        ...editData,
        allowedWorkerTypes: [...current, workerType]
      });
    }
  };

  const toggleSubscriptionTier = (tier: string) => {
    const current = editData.allowedSubscriptionTiers || [];
    if (current.includes(tier)) {
      setEditData({
        ...editData,
        allowedSubscriptionTiers: current.filter((t: string) => t !== tier)
      });
    } else {
      setEditData({
        ...editData,
        allowedSubscriptionTiers: [...current, tier]
      });
    }
  };

  return (
    <Container>
      <Header>
        <Title>Menu Management</Title>
        <Button onClick={handleSeedDefaults}>Seed Defaults</Button>
      </Header>

      {error && (
        <Alert type="error">
          <span>{error}</span>
          <button onClick={() => dispatch(clearError())} style={{ background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', color: 'inherit' }}>Dismiss</button>
        </Alert>
      )}

      {success && (
        <Alert type="success">
          <span>Operation completed successfully</span>
          <button onClick={() => dispatch(clearSuccess())} style={{ background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', color: 'inherit' }}>Dismiss</button>
        </Alert>
      )}

      {loading ? (
        <LoadingText>Loading...</LoadingText>
      ) : (
        <Table>
          <thead>
            <Tr>
              <Th>Menu ID</Th>
              <Th>Label</Th>
              <Th>Path</Th>
              <Th>Active</Th>
              <Th>User Types</Th>
              <Th>Worker Types</Th>
              <Th>Subscription Tiers</Th>
              <Th>Min Trust Score</Th>
              <Th>Actions</Th>
            </Tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <Tr key={item.menuId}>
                <Td>{item.menuId}</Td>
                <Td>{item.label}</Td>
                <Td>{item.path}</Td>
                <Td>
                  <input
                    type="checkbox"
                    checked={editingId === item.menuId ? editData.isActive : item.isActive}
                    onChange={(e) => {
                      if (editingId === item.menuId) {
                        setEditData({ ...editData, isActive: e.target.checked });
                      }
                    }}
                    disabled={editingId !== item.menuId}
                  />
                </Td>
                <Td>
                  {editingId === item.menuId ? (
                    <CheckboxGroup>
                      {Object.values(UserTypeCategory).map((type) => (
                        <CheckboxLabel key={type}>
                          <input
                            type="checkbox"
                            checked={(editData.allowedUserTypes || []).includes(type)}
                            onChange={() => toggleUserType(type)}
                          />
                          {type}
                        </CheckboxLabel>
                      ))}
                    </CheckboxGroup>
                  ) : (
                    <div>{(item.allowedUserTypes || []).join(', ') || 'All'}</div>
                  )}
                </Td>
                <Td>
                  {editingId === item.menuId ? (
                    <CheckboxGroup>
                      {Object.values(WorkerType).map((type) => (
                        <CheckboxLabel key={type}>
                          <input
                            type="checkbox"
                            checked={(editData.allowedWorkerTypes || []).includes(type)}
                            onChange={() => toggleWorkerType(type)}
                          />
                          {type}
                        </CheckboxLabel>
                      ))}
                    </CheckboxGroup>
                  ) : (
                    <div>{(item.allowedWorkerTypes || []).join(', ') || 'All'}</div>
                  )}
                </Td>
                <Td>
                  {editingId === item.menuId ? (
                    <CheckboxGroup>
                      {Object.values(SubscriptionTier).map((tier) => (
                        <CheckboxLabel key={tier}>
                          <input
                            type="checkbox"
                            checked={(editData.allowedSubscriptionTiers || []).includes(tier)}
                            onChange={() => toggleSubscriptionTier(tier)}
                          />
                          {tier}
                        </CheckboxLabel>
                      ))}
                    </CheckboxGroup>
                  ) : (
                    <div>{(item.allowedSubscriptionTiers || []).join(', ')}</div>
                  )}
                </Td>
                <Td>
                  {editingId === item.menuId ? (
                    <input
                      type="number"
                      value={editData.minTrustScore || 0}
                      onChange={(e) => setEditData({ ...editData, minTrustScore: parseInt(e.target.value) })}
                      style={{ width: '64px', padding: '4px 8px', border: '1px solid #d1d5db', borderRadius: '4px' }}
                    />
                  ) : (
                    item.minTrustScore
                  )}
                </Td>
                <Td>
                  <ActionButtons>
                    {editingId === item.menuId ? (
                      <>
                        <Button variant="success" onClick={handleSave}>Save</Button>
                        <Button variant="secondary" onClick={() => setEditingId(null)}>Cancel</Button>
                      </>
                    ) : (
                      <>
                        <Button onClick={() => handleEdit(item)}>Edit</Button>
                        <Button variant="danger" onClick={() => handleDelete(item.menuId)}>Delete</Button>
                      </>
                    )}
                  </ActionButtons>
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default MenuManagement;
