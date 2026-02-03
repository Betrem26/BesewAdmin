import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { FiSearch, FiTrash2, FiUserCheck, FiUserX } from 'react-icons/fi';

interface User {
  _id: string;
  phone_number: string;
  role: string;
  isActive: boolean;
  isOtpVerified: boolean;
  partyId?: string;
  createdAt: string;
  lastLogin?: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // TODO: Implement actual API call when endpoint is available
      // const response = await accountApi.get('/admin/users');
      // setUsers(response.data);
      
      // Mock data for now
      const mockUsers: User[] = [
        {
          _id: '1',
          phone_number: '+251911234567',
          role: 'admin',
          isActive: true,
          isOtpVerified: true,
          partyId: 'ETH26-1-SA-001',
          createdAt: '2024-01-15T10:00:00Z',
          lastLogin: '2024-01-27T08:30:00Z'
        },
        {
          _id: '2',
          phone_number: '+251922345678',
          role: 'user',
          isActive: true,
          isOtpVerified: true,
          partyId: 'ETH26-2-CA-002',
          createdAt: '2024-01-20T14:20:00Z',
          lastLogin: '2024-01-26T16:45:00Z'
        },
        {
          _id: '3',
          phone_number: '+251933456789',
          role: 'agency',
          isActive: false,
          isOtpVerified: false,
          createdAt: '2024-01-25T09:15:00Z'
        }
      ];
      setUsers(mockUsers);
    } catch (error) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (userId: string, currentStatus: boolean) => {
    try {
      // TODO: Implement actual API call
      // await accountApi.put(`/admin/users/${userId}/status`, { isActive: !currentStatus });
      setUsers(users.map(u => u._id === userId ? { ...u, isActive: !currentStatus } : u));
      toast.success(`User ${!currentStatus ? 'activated' : 'deactivated'}`);
    } catch (error) {
      toast.error('Failed to update user status');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    try {
      // TODO: Implement actual API call
      // await accountApi.delete(`/admin/users/${userId}`);
      setUsers(users.filter(u => u._id !== userId));
      toast.success('User deleted successfully');
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.phone_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.partyId?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && user.isActive) ||
                         (filterStatus === 'inactive' && !user.isActive);
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <Container>
      <Header>
        <Title>User Management</Title>
        <Stats>
          <StatCard>
            <StatValue>{users.length}</StatValue>
            <StatLabel>Total Users</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{users.filter(u => u.isActive).length}</StatValue>
            <StatLabel>Active</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{users.filter(u => !u.isActive).length}</StatValue>
            <StatLabel>Inactive</StatLabel>
          </StatCard>
        </Stats>
      </Header>

      <FilterSection>
        <SearchBox>
          <FiSearch />
          <SearchInput
            type="text"
            placeholder="Search by phone number or party ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchBox>
        <FilterGroup>
          <Select value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
            <option value="all">All Roles</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="agency">Agency</option>
            <option value="employee">Employee</option>
          </Select>
          <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </Select>
        </FilterGroup>
      </FilterSection>

      {loading && <LoadingText>Loading users...</LoadingText>}
      {!loading && filteredUsers.length === 0 && <EmptyState>No users found</EmptyState>}
      {!loading && filteredUsers.length > 0 && (
        <Table>
          <thead>
            <tr>
              <Th>Phone Number</Th>
              <Th>Party ID</Th>
              <Th>Role</Th>
              <Th>Status</Th>
              <Th>OTP Verified</Th>
              <Th>Created</Th>
              <Th>Last Login</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user._id}>
                <Td>{user.phone_number}</Td>
                <Td>{user.partyId || '-'}</Td>
                <Td><RoleBadge role={user.role}>{user.role}</RoleBadge></Td>
                <Td>
                  <StatusBadge status={user.isActive ? 'active' : 'inactive'}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </StatusBadge>
                </Td>
                <Td>
                  {user.isOtpVerified ? (
                    <VerifiedIcon><FiUserCheck /> Verified</VerifiedIcon>
                  ) : (
                    <UnverifiedIcon><FiUserX /> Not Verified</UnverifiedIcon>
                  )}
                </Td>
                <Td>{new Date(user.createdAt).toLocaleDateString()}</Td>
                <Td>{user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : '-'}</Td>
                <Td>
                  <ActionButtons>
                    <ActionButton
                      onClick={() => handleToggleStatus(user._id, user.isActive)}
                      title={user.isActive ? 'Deactivate' : 'Activate'}
                    >
                      {user.isActive ? <FiUserX /> : <FiUserCheck />}
                    </ActionButton>
                    <ActionButton onClick={() => handleDeleteUser(user._id)} title="Delete">
                      <FiTrash2 />
                    </ActionButton>
                  </ActionButtons>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default UserManagement;

const Container = styled.div`padding: 24px;`;
const Header = styled.div`margin-bottom: 32px;`;
const Title = styled.h1`font-size: 28px; font-weight: 600; color: #1a202c; margin-bottom: 16px;`;
const Stats = styled.div`display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 16px; margin-bottom: 24px;`;
const StatCard = styled.div`background: white; padding: 20px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);`;
const StatValue = styled.div`font-size: 32px; font-weight: 700; color: #3182ce; margin-bottom: 4px;`;
const StatLabel = styled.div`font-size: 14px; color: #718096;`;
const FilterSection = styled.div`background: white; padding: 20px; border-radius: 8px; margin-bottom: 24px; display: flex; gap: 16px; flex-wrap: wrap;`;
const SearchBox = styled.div`flex: 1; min-width: 300px; display: flex; align-items: center; gap: 12px; padding: 10px 16px; border: 1px solid #e2e8f0; border-radius: 6px; svg { color: #718096; }`;
const SearchInput = styled.input`flex: 1; border: none; outline: none; font-size: 14px;`;
const FilterGroup = styled.div`display: flex; gap: 12px;`;
const Select = styled.select`padding: 10px 16px; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 14px; cursor: pointer;`;
const LoadingText = styled.p`text-align: center; color: #718096; padding: 40px;`;
const EmptyState = styled.p`text-align: center; color: #718096; padding: 40px;`;
const Table = styled.table`width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden;`;
const Th = styled.th`text-align: left; padding: 12px; background: #f7fafc; color: #4a5568; font-weight: 600; font-size: 14px; border-bottom: 2px solid #e2e8f0;`;
const Td = styled.td`padding: 12px; border-bottom: 1px solid #e2e8f0; color: #2d3748; font-size: 14px;`;
const RoleBadge = styled.span<{ role: string }>`padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 500; background: ${p => p.role === 'admin' ? '#fed7d7' : p.role === 'agency' ? '#feebc8' : '#c6f6d5'}; color: ${p => p.role === 'admin' ? '#742a2a' : p.role === 'agency' ? '#7c2d12' : '#22543d'};`;
const StatusBadge = styled.span<{ status: string }>`padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 500; background: ${p => p.status === 'active' ? '#c6f6d5' : '#fed7d7'}; color: ${p => p.status === 'active' ? '#22543d' : '#742a2a'};`;
const VerifiedIcon = styled.span`display: flex; align-items: center; gap: 4px; color: #38a169; font-size: 13px;`;
const UnverifiedIcon = styled.span`display: flex; align-items: center; gap: 4px; color: #e53e3e; font-size: 13px;`;
const ActionButtons = styled.div`display: flex; gap: 8px;`;
const ActionButton = styled.button`padding: 6px; background: #3182ce; color: white; border: none; border-radius: 4px; cursor: pointer; display: flex; align-items: center; justify-content: center; &:hover { background: #2c5282; }`;
