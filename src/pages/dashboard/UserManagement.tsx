import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { FiSearch, FiTrash2, FiUserCheck, FiUserX, FiShield } from 'react-icons/fi';
import accountsApi, { Account } from '../../services/accountsApi';

const UserManagement: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const data = await accountsApi.getAllAccounts();
      setAccounts(data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to fetch accounts');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (partyId: string) => {
    if (!window.confirm('Are you sure you want to delete this account?')) return;
    try {
      await accountsApi.deleteAccount(partyId);
      setAccounts(prev => prev.filter(a => a.party_id !== partyId));
      toast.success('Account deleted successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete account');
    }
  };

  const handlePromote = async (partyId: string) => {
    try {
      await accountsApi.promoteToAdmin(partyId);
      setAccounts(prev => prev.map(a => a.party_id === partyId ? { ...a, role: 'admin' } : a));
      toast.success('User promoted to admin');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to promote user');
    }
  };

  const handleDemote = async (partyId: string) => {
    try {
      await accountsApi.demoteToUser(partyId);
      setAccounts(prev => prev.map(a => a.party_id === partyId ? { ...a, role: 'user' } : a));
      toast.success('Admin demoted to user');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to demote admin');
    }
  };

  const filtered = accounts.filter(a => {
    const matchesSearch =
      a.profile_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.party_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.email || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || a.role === filterRole;
    const matchesStatus = filterStatus === 'all' || a.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const activeCount = accounts.filter(a => a.status === 'active').length;
  const pendingCount = accounts.filter(a => a.status === 'pending_otp').length;

  return (
    <Container>
      <Header>
        <Title>User Management</Title>
        <Stats>
          <StatCard>
            <StatValue>{accounts.length}</StatValue>
            <StatLabel>Total Accounts</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{activeCount}</StatValue>
            <StatLabel>Active</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{pendingCount}</StatValue>
            <StatLabel>Pending OTP</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{accounts.filter(a => a.role === 'admin').length}</StatValue>
            <StatLabel>Admins</StatLabel>
          </StatCard>
        </Stats>
      </Header>

      <FilterSection>
        <SearchBox>
          <FiSearch />
          <SearchInput
            type="text"
            placeholder="Search by name, party ID or email..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </SearchBox>
        <FilterGroup>
          <Select value={filterRole} onChange={e => setFilterRole(e.target.value)}>
            <option value="all">All Roles</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="agency">Agency</option>
          </Select>
          <Select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending_otp">Pending OTP</option>
          </Select>
        </FilterGroup>
      </FilterSection>

      {loading && <LoadingText>Loading accounts...</LoadingText>}
      {!loading && filtered.length === 0 && <EmptyState>No accounts found</EmptyState>}
      {!loading && filtered.length > 0 && (
        <Table>
          <thead>
            <tr>
              <Th>Profile</Th>
              <Th>Party ID</Th>
              <Th>Party Type</Th>
              <Th>Role</Th>
              <Th>Status</Th>
              <Th>Subscription</Th>
              <Th>Joined</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(account => (
              <tr key={account.account_id}>
                <Td>
                  <ProfileCell>
                    {account.avatar
                      ? <Avatar src={account.avatar} alt={account.profile_name} />
                      : <AvatarPlaceholder>{account.profile_name.charAt(0).toUpperCase()}</AvatarPlaceholder>
                    }
                    <ProfileInfo>
                      <ProfileName>{account.profile_name}</ProfileName>
                      {account.email && <ProfileEmail>{account.email}</ProfileEmail>}
                    </ProfileInfo>
                  </ProfileCell>
                </Td>
                <Td>{account.party_id}</Td>
                <Td>{account.party_type.name}</Td>
                <Td><RoleBadge role={account.role}>{account.role}</RoleBadge></Td>
                <Td><StatusBadge status={account.status}>{account.status.replace('_', ' ')}</StatusBadge></Td>
                <Td>
                  {account.subscription
                    ? <SubBadge>{account.subscription.type}</SubBadge>
                    : '-'
                  }
                </Td>
                <Td>{new Date(account.date).toLocaleDateString()}</Td>
                <Td>
                  <ActionButtons>
                    {account.role === 'user' && (
                      <ActionButton title="Promote to Admin" onClick={() => handlePromote(account.party_id)}>
                        <FiShield />
                      </ActionButton>
                    )}
                    {account.role === 'admin' && (
                      <ActionButton title="Demote to User" onClick={() => handleDemote(account.party_id)}>
                        <FiUserX />
                      </ActionButton>
                    )}
                    <DeleteButton title="Delete Account" onClick={() => handleDelete(account.party_id)}>
                      <FiTrash2 />
                    </DeleteButton>
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
const Table = styled.table`width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);`;
const Th = styled.th`text-align: left; padding: 12px; background: #f7fafc; color: #4a5568; font-weight: 600; font-size: 14px; border-bottom: 2px solid #e2e8f0;`;
const Td = styled.td`padding: 12px; border-bottom: 1px solid #e2e8f0; color: #2d3748; font-size: 14px;`;
const ProfileCell = styled.div`display: flex; align-items: center; gap: 10px;`;
const Avatar = styled.img`width: 36px; height: 36px; border-radius: 50%; object-fit: cover;`;
const AvatarPlaceholder = styled.div`width: 36px; height: 36px; border-radius: 50%; background: #3182ce; color: white; display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 14px; flex-shrink: 0;`;
const ProfileInfo = styled.div`display: flex; flex-direction: column;`;
const ProfileName = styled.span`font-weight: 500; font-size: 14px;`;
const ProfileEmail = styled.span`font-size: 12px; color: #718096;`;
const RoleBadge = styled.span<{ role: string }>`padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 500; background: ${p => p.role === 'admin' ? '#fed7d7' : p.role === 'agency' ? '#feebc8' : '#c6f6d5'}; color: ${p => p.role === 'admin' ? '#742a2a' : p.role === 'agency' ? '#7c2d12' : '#22543d'};`;
const StatusBadge = styled.span<{ status: string }>`padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 500; background: ${p => p.status === 'active' ? '#c6f6d5' : '#fefcbf'}; color: ${p => p.status === 'active' ? '#22543d' : '#744210'}; text-transform: capitalize;`;
const SubBadge = styled.span`padding: 4px 8px; border-radius: 4px; font-size: 12px; background: #ebf8ff; color: #2b6cb0; text-transform: capitalize;`;
const ActionButtons = styled.div`display: flex; gap: 8px;`;
const ActionButton = styled.button`padding: 6px; background: #3182ce; color: white; border: none; border-radius: 4px; cursor: pointer; display: flex; align-items: center; justify-content: center; &:hover { background: #2c5282; }`;
const DeleteButton = styled.button`padding: 6px; background: #e53e3e; color: white; border: none; border-radius: 4px; cursor: pointer; display: flex; align-items: center; justify-content: center; &:hover { background: #c53030; }`;
