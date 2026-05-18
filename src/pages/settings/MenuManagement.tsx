import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllMenuConfigs, createMenuConfig, updateMenuConfig, deleteMenuConfig, seedDefaultMenus, clearError, clearSuccess } from '../../store/features/menuConfigSlice';
import { RootState } from '../../store/store';

// Helper function to prepare menu config data for API submission
// Handles empty strings, null values, lowercase enum transformation, and includes menuId
const prepareMenuData = (data: any): any => {
  // Helper to convert to lowercase
  const toLowerCase = (value: string): string => String(value).toLowerCase();
  
  // Helper to handle empty strings - convert to null
  const emptyToNull = (value: any): any => {
    if (value === '' || value === undefined) return null;
    return value;
  };

  return {
    menuId: String(data.menuId || '').trim(), // Include menuId in payload
    label: String(data.label || '').trim(),
    path: String(data.path || '').trim(),
    icon: emptyToNull(data.icon ? String(data.icon).trim() : ''),
    description: emptyToNull(data.description ? String(data.description).trim() : ''),
    badge: emptyToNull(data.badge ? String(data.badge).trim() : ''),
    isActive: data.isActive === true,
    minTrustScore: parseInt(data.minTrustScore) || 0,
    // Transform arrays to lowercase
    allowedUserTypes: Array.isArray(data.allowedUserTypes) 
      ? data.allowedUserTypes.map((t: any) => toLowerCase(t)).filter((t: string) => t)
      : [],
    allowedWorkerTypes: Array.isArray(data.allowedWorkerTypes)
      ? data.allowedWorkerTypes.map((t: any) => toLowerCase(t)).filter((t: string) => t)
      : [],
    allowedSubscriptionTiers: Array.isArray(data.allowedSubscriptionTiers)
      ? data.allowedSubscriptionTiers.map((t: any) => toLowerCase(t)).filter((t: string) => t)
      : [],
    order: parseInt(data.order) || 0,
    parentMenuId: emptyToNull(data.parentMenuId ? String(data.parentMenuId).trim() : '')
  };
};

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
  FREE: 'free',
  TRIAL: 'trial',
  STANDARD: 'standard',
  GROWTH: 'growth',
  PROFESSIONAL: 'professional',
  PREMIUM: 'premium',
  ENTERPRISE: 'enterprise'
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

const Button = styled.button<{ $variant?: 'primary' | 'success' | 'danger' | 'secondary' }>`
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
  
  background: ${props => {
    switch(props.$variant) {
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
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Alert = styled.div<{ $type: 'error' | 'success' }>`
  padding: 12px 16px;
  border-radius: 4px;
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${props => props.$type === 'error' ? '#fee2e2' : '#dcfce7'};
  color: ${props => props.$type === 'error' ? '#991b1b' : '#166534'};
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

const Tr = styled.tr<{ $isChild?: boolean }>`
  &:hover {
    background: #f9fafb;
  }
  background: ${props => props.$isChild ? '#fafbfc' : 'white'};
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

const Toggle = styled.input`
  appearance: none;
  width: 44px;
  height: 24px;
  background: #ccc;
  border-radius: 12px;
  cursor: pointer;
  position: relative;
  transition: background 0.3s;
  
  &:checked {
    background: #10b981;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const MenuLabel = styled.span<{ $level?: number }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding-left: ${props => (props.$level || 0) * 24}px;
  
  &::before {
    content: ${props => props.$level && props.$level > 0 ? '"└─"' : '""'};
    color: #9ca3af;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const Modal = styled.div`
  background: white;
  border-radius: 8px;
  padding: 24px;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
`;

const ModalHeader = styled.h2`
  font-size: 20px;
  font-weight: bold;
  margin: 0 0 16px 0;
  color: #1a1a1a;
`;

const FormGroup = styled.div`
  margin-bottom: 16px;
`;

const Label = styled.label`
  display: block;
  font-weight: 600;
  margin-bottom: 8px;
  color: #374151;
  font-size: 14px;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const ModalFooter = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
`;

export const MenuManagement: React.FC = () => {
  const dispatch = useDispatch();
  const { items, loading, error, success } = useSelector((state: RootState) => state.menuConfig);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    dispatch(fetchAllMenuConfigs() as any);
  }, [dispatch]);

  // Build a map of menu items by ID for parent-child relationships
  const menuMap = new Map(items.map(item => [item.menuId, item]));

  // Get the hierarchy level of a menu item
  const getMenuLevel = (menuId: string, visited = new Set<string>()): number => {
    if (visited.has(menuId)) return 0; // Prevent infinite loops
    visited.add(menuId);
    
    const item = menuMap.get(menuId);
    if (!item?.parentMenuId) return 0;
    
    return 1 + getMenuLevel(item.parentMenuId, visited);
  };

  // Sort items to show parents before children
  const sortedItems = [...items].sort((a, b) => {
    const levelA = getMenuLevel(a.menuId);
    const levelB = getMenuLevel(b.menuId);
    if (levelA !== levelB) return levelA - levelB;
    return (a.order || 0) - (b.order || 0);
  });

  const handleEdit = (item: any) => {
    setShowModal(true);
    setEditData({ ...item });
  };

  const handleSave = () => {
    if (editData) {
      setIsSaving(true);
      try {
        // Prepare data for API submission
        const updateData = prepareMenuData(editData);
        
        console.log('Saving menu config:', { 
          menuId: editData.menuId, 
          updateData,
          isCreate: !editData._id
        });
        
        // If creating new menu, use create action, otherwise use update
        if (editData._id) {
          dispatch(updateMenuConfig({ menuId: editData.menuId, data: updateData }) as any);
        } else {
          dispatch(createMenuConfig({ menuId: editData.menuId, ...updateData }) as any);
        }
        
        setShowModal(false);
        setEditData({});
      } catch (err) {
        console.error('Error preparing menu data:', err);
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleToggleActive = (item: any) => {
    setIsSaving(true);
    try {
      // Prepare data with toggled isActive status
      const updateData = prepareMenuData({
        ...item,
        isActive: !item.isActive
      });

      console.log('Toggling menu active status:', { 
        menuId: item.menuId, 
        previousStatus: item.isActive,
        newStatus: !item.isActive,
        updateData 
      });
      
      dispatch(updateMenuConfig({ 
        menuId: item.menuId, 
        data: updateData
      }) as any);
    } catch (err) {
      console.error('Error toggling menu status:', err);
    } finally {
      setIsSaving(false);
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
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button onClick={() => { setEditData({}); setShowModal(true); }} disabled={loading}>
            Create New Menu
          </Button>
          <Button onClick={handleSeedDefaults} disabled={loading}>
            Seed Default Menus
          </Button>
        </div>
      </Header>

      {error && (
        <Alert $type="error">
          <div style={{ flex: 1 }}>
            <strong>Error:</strong> {typeof error === 'string' ? error : (error as any)?.message || 'An error occurred'}
            {(error as any)?.validationErrors && (
              <div style={{ marginTop: '8px', fontSize: '12px', opacity: 0.9 }}>
                <strong>Details:</strong> {JSON.stringify((error as any).validationErrors)}
              </div>
            )}
          </div>
          <button onClick={() => dispatch(clearError())} style={{ background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', color: 'inherit', whiteSpace: 'nowrap', marginLeft: '16px' }}>Dismiss</button>
        </Alert>
      )}

      {success && (
        <Alert $type="success">
          <span>Operation completed successfully</span>
          <button onClick={() => dispatch(clearSuccess())} style={{ background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', color: 'inherit' }}>Dismiss</button>
        </Alert>
      )}

      {loading ? (
        <LoadingText>Loading menu configurations...</LoadingText>
      ) : items.length === 0 ? (
        <LoadingText>No menu configurations found. Click "Seed Default Menus" to get started.</LoadingText>
      ) : (
        <Table>
          <thead>
            <Tr>
              <Th>Menu</Th>
              <Th>Path</Th>
              <Th>Icon</Th>
              <Th>Active</Th>
              <Th>User Types</Th>
              <Th>Worker Types</Th>
              <Th>Min Trust Score</Th>
              <Th>Actions</Th>
            </Tr>
          </thead>
          <tbody>
            {sortedItems.map((item) => {
              const level = getMenuLevel(item.menuId);
              const isChild = level > 0;
              
              return (
                <Tr key={item.menuId} $isChild={isChild}>
                  <Td>
                    <MenuLabel $level={level}>
                      {item.label}
                      {item.badge && <span style={{ fontSize: '12px', background: '#dbeafe', color: '#1e40af', padding: '2px 6px', borderRadius: '3px' }}>{item.badge}</span>}
                    </MenuLabel>
                  </Td>
                  <Td>{item.path}</Td>
                  <Td>{item.icon}</Td>
                  <Td>
                    <Toggle
                      type="checkbox"
                      checked={item.isActive}
                      onChange={() => handleToggleActive(item)}
                      disabled={isSaving}
                      title={item.isActive ? 'Click to disable' : 'Click to enable'}
                    />
                  </Td>
                  <Td>
                    <div style={{ fontSize: '12px' }}>
                      {(item.allowedUserTypes || []).length > 0 
                        ? (item.allowedUserTypes || []).join(', ') 
                        : <span style={{ color: '#9ca3af' }}>All</span>
                      }
                    </div>
                  </Td>
                  <Td>
                    <div style={{ fontSize: '12px' }}>
                      {(item.allowedWorkerTypes || []).length > 0 
                        ? (item.allowedWorkerTypes || []).join(', ') 
                        : <span style={{ color: '#9ca3af' }}>All</span>
                      }
                    </div>
                  </Td>
                  <Td>{item.minTrustScore || 0}</Td>
                  <Td>
                    <ActionButtons>
                      <Button onClick={() => handleEdit(item)} disabled={isSaving} title="Edit menu configuration">Edit</Button>
                      <Button $variant="danger" onClick={() => handleDelete(item.menuId)} disabled={isSaving}>Delete</Button>
                    </ActionButtons>
                  </Td>
                </Tr>
              );
            })}
          </tbody>
        </Table>
      )}

      {/* Edit/Create Modal */}
      {showModal && (
        <ModalOverlay onClick={() => !isSaving && setShowModal(false)}>
          <Modal onClick={(e) => e.stopPropagation()}>
            <ModalHeader>{editData.menuId ? 'Edit Menu: ' + editData.label : 'Create New Menu'}</ModalHeader>

            <FormGroup>
              <Label>Menu ID</Label>
              <Input 
                type="text" 
                value={editData.menuId || ''} 
                onChange={(e) => setEditData({ ...editData, menuId: e.target.value })}
                disabled={!!editData._id}
                placeholder="e.g., my-menu"
              />
            </FormGroup>

            <FormGroup>
              <Label>Label</Label>
              <Input 
                type="text" 
                value={editData.label || ''} 
                onChange={(e) => setEditData({ ...editData, label: e.target.value })}
              />
            </FormGroup>

            <FormGroup>
              <Label>Path</Label>
              <Input 
                type="text" 
                value={editData.path || ''} 
                onChange={(e) => setEditData({ ...editData, path: e.target.value })}
              />
            </FormGroup>

            <FormGroup>
              <Label>Min Trust Score</Label>
              <Input 
                type="number" 
                value={editData.minTrustScore || 0} 
                onChange={(e) => setEditData({ ...editData, minTrustScore: parseInt(e.target.value) })}
              />
            </FormGroup>

            <FormGroup>
              <Label>Allowed User Types</Label>
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
            </FormGroup>

            <FormGroup>
              <Label>Allowed Worker Types</Label>
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
            </FormGroup>

            <FormGroup>
              <Label>Allowed Subscription Tiers</Label>
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
            </FormGroup>

            <ModalFooter>
              <Button 
                $variant="secondary" 
                onClick={() => setShowModal(false)}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button 
                $variant="success" 
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </ModalFooter>
          </Modal>
        </ModalOverlay>
      )}
    </Container>
  );
};

export default MenuManagement;
