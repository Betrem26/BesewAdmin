import React, { useEffect, useState, useMemo } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { FiSearch, FiTrash2, FiUserX, FiShield, FiPhone, FiCheckCircle, FiXCircle, FiFilter } from 'react-icons/fi';
import accountsApi, { Account } from '../../services/accountsApi';
import { SmartConfirmDialog } from '../../components/SmartConfirmDialog';

const UserManagement: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedRole, setSelectedRole] = useState('all');
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; partyId: string; name: string; isDeleting: boolean }>({
    isOpen: false,
    partyId: '',
    name: '',
    isDeleting: false,
  });

  useEffect(() => { fetchAccounts(); }, []);

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

  const handleDeleteClick = (partyId: string, name: string) => {
    setDeleteDialog({ isOpen: true, partyId, name, isDeleting: false });
  };

  const handleDeleteConfirm = async () => {
    setDeleteDialog(prev => ({ ...prev, isDeleting: true }));
    try {
      await accountsApi.deleteAccount(deleteDialog.partyId);
      setAccounts(prev => prev.filter(a => a.party_id !== deleteDialog.partyId));
      toast.success('Account deleted successfully');
      setDeleteDialog({ isOpen: false, partyId: '', name: '', isDeleting: false });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete account');
      setDeleteDialog(prev => ({ ...prev, isDeleting: false }));
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ isOpen: false, partyId: '', name: '', isDeleting: false });
  };

  const handlePromote = async (partyId: string) => {
    try {
      await accountsApi.promoteToAdmin(partyId, '', '');
      setAccounts(prev => prev.map(a => a.party_id === partyId ? { ...a, role: 'admin' } : a));
      toast.success('User promoted to admin');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to promote user');
    }
  };

  const handleDemote = async (partyId: string) => {
    try {
      await accountsApi.demoteToUser(partyId, '', '');
      setAccounts(prev => prev.map(a => a.party_id === partyId ? { ...a, role: 'user' } : a));
      toast.success('Admin demoted to user');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to demote admin');
    }
  };

  const getPhone = (a: Account) => a.phone || a.phonenumber || '';
  const isVerified = (a: Account) => a.is_verified === true || a.verified === true;

  const filtered = accounts.filter(a => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      a.profile_name.toLowerCase().includes(q) ||
      a.party_id.toLowerCase().includes(q) ||
      (a.email || '').toLowerCase().includes(q) ||
      getPhone(a).toLowerCase().includes(q);
    const matchesRole = selectedRole === 'all' || a.role?.toLowerCase() === selectedRole.toLowerCase();
    const matchesStatus = filterStatus === 'all' || a.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Apply sorting to filtered results
  const processedUsers = useMemo(() => {
    if (!filtered) return [];

    return [...filtered].sort((a, b) => {
      if (sortBy === "newest") {
        const dateA = new Date(a.date || "0").getTime();
        const dateB = new Date(b.date || "0").getTime();
        return dateB - dateA;
      }
      if (sortBy === "oldest") {
        const dateA = new Date(a.date || "0").getTime();
        const dateB = new Date(b.date || "0").getTime();
        return dateA - dateB;
      }
      if (sortBy === "alpha-asc") {
        const nameA = (a.profile_name || "").toLowerCase();
        const nameB = (b.profile_name || "").toLowerCase();
        return nameA.localeCompare(nameB);
      }
      if (sortBy === "alpha-desc") {
        const nameA = (a.profile_name || "").toLowerCase();
        const nameB = (b.profile_name || "").toLowerCase();
        return nameB.localeCompare(nameA);
      }
      return 0;
    });
  }, [filtered, sortBy]);

  const activeCount = accounts.filter(a => a.status === 'active').length;
  const pendingCount = accounts.filter(a => a.status === 'pending_otp').length;
  const hasFilters = searchTerm || selectedRole !== 'all' || filterStatus !== 'all';

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
          <SearchIconWrap><FiSearch /></SearchIconWrap>
          <SearchInput
            type="text"
            placeholder="Search by name, party ID, email or phone…"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          {searchTerm && <ClearBtn onClick={() => setSearchTerm('')}>✕</ClearBtn>}
        </SearchBox>
        <Divider />
        <FilterGroup>
          <FilterLabel><FiFilter size={13} /> Filters</FilterLabel>
          <Select value={selectedRole} onChange={e => setSelectedRole(e.target.value)}>
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="employer">Employer</option>
            <option value="job_seeker">Job Seeker</option>
          </Select>
          <Select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending_otp">Pending OTP</option>
          </Select>
          <Select value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="newest">Lastly Registered</option>
            <option value="oldest">Oldest Registered</option>
            <option value="alpha-asc">Name: A to Z</option>
            <option value="alpha-desc">Name: Z to A</option>
          </Select>
        </FilterGroup>
        {hasFilters && (
          <ResultCount>{processedUsers.length} result{processedUsers.length !== 1 ? 's' : ''}</ResultCount>
        )}
      </FilterSection>

      {loading && <LoadingText>Loading accounts...</LoadingText>}
      {!loading && processedUsers.length === 0 && <EmptyState>No accounts found</EmptyState>}
      {!loading && processedUsers.length > 0 && (
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
            {processedUsers.map(account => (
              <tr key={account.account_id}>
                <Td>
                  <ProfileCell>
                    {account.avatar
                      ? <Avatar src={account.avatar} alt={account.profile_name} />
                      : <AvatarPlaceholder>{account.profile_name.charAt(0).toUpperCase()}</AvatarPlaceholder>
                    }
                    <ProfileInfo>
                      <ProfileNameRow>
                        <ProfileName>{account.profile_name}</ProfileName>
                        {isVerified(account)
                          ? <VerifiedIcon title="Verified"><FiCheckCircle /></VerifiedIcon>
                          : <UnverifiedIcon title="Not Verified"><FiXCircle /></UnverifiedIcon>
                        }
                      </ProfileNameRow>
                      {account.email && <ProfileEmail>{account.email}</ProfileEmail>}
                      {getPhone(account)
                        ? <ProfilePhone><FiPhone size={11} /> {getPhone(account)}</ProfilePhone>
                        : <ProfilePhone style={{ color: '#cbd5e0' }}><FiPhone size={11} /> No phone</ProfilePhone>
                      }
                    </ProfileInfo>
                  </ProfileCell>
                </Td>
                <Td><PartyIdText>{account.party_id}</PartyIdText></Td>
                <Td>{account.party_type.name}</Td>
                <Td><RoleBadge role={account.role}>{account.role}</RoleBadge></Td>
                <Td><StatusBadge status={account.status}>{account.status.replace('_', ' ')}</StatusBadge></Td>
                <Td>
                  {account.subscription
                    ? <SubBadge>{account.subscription.type}</SubBadge>
                    : <NoneText>—</NoneText>
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
                    <DeleteButton title="Delete Account" onClick={() => handleDeleteClick(account.party_id, account.profile_name)}>
                      <FiTrash2 />
                    </DeleteButton>
                  </ActionButtons>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <SmartConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="Delete Account"
        message="This will permanently delete the account and all associated data. This action cannot be reversed."
        itemName={deleteDialog.name}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        isLoading={deleteDialog.isDeleting}
        confirmText="Delete Account"
      />
    </Container>
  );
};

export default UserManagement;

const Container = styled.div`
  padding: 28px 32px;
  background: #f0f4f8;
  min-height: 100vh;
`;

const Header = styled.div`
  margin-bottom: 28px;
`;

const Title = styled.h1`
  font-size: 26px;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 20px;
  letter-spacing: -0.3px;
`;

const Stats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 16px;
`;

const StatCard = styled.div`
  background: white;
  padding: 20px 24px;
  border-radius: 12px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.07);
  border-left: 4px solid #3182ce;
  transition: transform 0.15s, box-shadow 0.15s;
  &:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
`;

const StatValue = styled.div`
  font-size: 30px;
  font-weight: 700;
  color: #3182ce;
  margin-bottom: 4px;
  line-height: 1;
`;

const StatLabel = styled.div`
  font-size: 13px;
  color: #718096;
  font-weight: 500;
`;

const FilterSection = styled.div`
  background: white;
  padding: 14px 20px;
  border-radius: 12px;
  margin-bottom: 20px;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  align-items: center;
  box-shadow: 0 1px 4px rgba(0,0,0,0.07);
`;

const SearchBox = styled.div`
  flex: 1;
  min-width: 260px;
  display: flex;
  align-items: center;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  background: #f7fafc;
  overflow: hidden;
  transition: border-color 0.2s, box-shadow 0.2s;
  &:focus-within {
    border-color: #3182ce;
    box-shadow: 0 0 0 3px rgba(49,130,206,0.12);
    background: white;
  }
`;

const SearchIconWrap = styled.div`
  padding: 0 12px;
  display: flex;
  align-items: center;
  color: #a0aec0;
  font-size: 16px;
  flex-shrink: 0;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 10px 0;
  border: none;
  outline: none;
  font-size: 14px;
  background: transparent;
  color: #2d3748;
  &::placeholder { color: #a0aec0; }
`;

const ClearBtn = styled.button`
  background: none;
  border: none;
  color: #a0aec0;
  cursor: pointer;
  font-size: 14px;
  padding: 0 12px;
  line-height: 1;
  &:hover { color: #4a5568; }
`;

const Divider = styled.div`
  width: 1px;
  height: 32px;
  background: #e2e8f0;
  flex-shrink: 0;
`;

const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

const FilterLabel = styled.span`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 13px;
  color: #718096;
  font-weight: 500;
  white-space: nowrap;
`;

const Select = styled.select`
  padding: 8px 14px;
  border: 1.5px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  background: #f7fafc;
  color: #2d3748;
  outline: none;
  transition: border-color 0.2s;
  min-width: 140px;
  &:focus { border-color: #3182ce; background: white; }
`;

const ResultCount = styled.span`
  margin-left: auto;
  font-size: 13px;
  color: #3182ce;
  font-weight: 600;
  background: #ebf8ff;
  padding: 4px 12px;
  border-radius: 20px;
  border: 1px solid #bee3f8;
  white-space: nowrap;
`;

const LoadingText = styled.p`
  text-align: center;
  color: #718096;
  padding: 60px;
  font-size: 15px;
`;

const EmptyState = styled.p`
  text-align: center;
  color: #a0aec0;
  padding: 60px;
  font-size: 15px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.07);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0,0,0,0.07);
`;

const Th = styled.th`
  text-align: left;
  padding: 13px 16px;
  background: #f7fafc;
  color: #4a5568;
  font-weight: 600;
  font-size: 13px;
  border-bottom: 2px solid #e2e8f0;
  white-space: nowrap;
  letter-spacing: 0.3px;
  text-transform: uppercase;
`;

const Td = styled.td`
  padding: 13px 16px;
  border-bottom: 1px solid #edf2f7;
  color: #2d3748;
  font-size: 14px;
  vertical-align: middle;
`;

const ProfileCell = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Avatar = styled.img`
  width: 38px;
  height: 38px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e2e8f0;
  flex-shrink: 0;
`;

const AvatarPlaceholder = styled.div`
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3182ce, #63b3ed);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
  flex-shrink: 0;
`;

const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const ProfileNameRow = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

const ProfileName = styled.span`
  font-weight: 600;
  font-size: 14px;
  color: #1a202c;
`;

const VerifiedIcon = styled.span`
  color: #38a169;
  display: flex;
  align-items: center;
  font-size: 13px;
`;

const UnverifiedIcon = styled.span`
  color: #e53e3e;
  display: flex;
  align-items: center;
  font-size: 13px;
`;

const ProfileEmail = styled.span`
  font-size: 12px;
  color: #718096;
`;

const ProfilePhone = styled.span`
  font-size: 11px;
  color: #a0aec0;
  display: flex;
  align-items: center;
  gap: 3px;
`;

const PartyIdText = styled.span`
  font-family: monospace;
  font-size: 12px;
  color: #4a5568;
  background: #f7fafc;
  padding: 2px 6px;
  border-radius: 4px;
  border: 1px solid #e2e8f0;
`;

const NoneText = styled.span`
  color: #cbd5e0;
  font-size: 16px;
`;

const RoleBadge = styled.span<{ role: string }>`
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  background: ${p => p.role === 'admin' ? '#fff5f5' : p.role === 'agency' ? '#fffaf0' : '#f0fff4'};
  color: ${p => p.role === 'admin' ? '#c53030' : p.role === 'agency' ? '#c05621' : '#276749'};
  border: 1px solid ${p => p.role === 'admin' ? '#fed7d7' : p.role === 'agency' ? '#fbd38d' : '#9ae6b4'};
  text-transform: capitalize;
`;

const StatusBadge = styled.span<{ status: string }>`
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  background: ${p => p.status === 'active' ? '#f0fff4' : '#fffff0'};
  color: ${p => p.status === 'active' ? '#276749' : '#744210'};
  border: 1px solid ${p => p.status === 'active' ? '#9ae6b4' : '#f6e05e'};
  text-transform: capitalize;
`;

const SubBadge = styled.span`
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  background: #ebf8ff;
  color: #2b6cb0;
  border: 1px solid #bee3f8;
  text-transform: capitalize;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 6px;
`;

const ActionButton = styled.button`
  padding: 7px;
  background: #ebf8ff;
  color: #2b6cb0;
  border: 1px solid #bee3f8;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s, color 0.15s;
  &:hover { background: #3182ce; color: white; border-color: #3182ce; }
`;

const DeleteButton = styled.button`
  padding: 7px;
  background: #fff5f5;
  color: #c53030;
  border: 1px solid #fed7d7;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s, color 0.15s;
  &:hover { background: #e53e3e; color: white; border-color: #e53e3e; }
`;
