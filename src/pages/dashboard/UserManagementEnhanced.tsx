import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { FiUsers, FiSearch, FiDownload, FiEye, FiShield, FiUserX, FiTrash2, FiRefreshCw, FiPhone } from 'react-icons/fi';
import accountsApi, { Account } from '../../services/accountsApi';
import { toast } from 'react-toastify';
import GrowthChart from '../../components/charts/GrowthChart';
import RegistrationTrendsCard from '../../components/charts/RegistrationTrendsCard';

const UserManagementEnhanced: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [growth, setGrowth] = useState<{ today: number; thisWeek: number; thisMonth: number } | null>(null);
  const [phoneSearchResult, setPhoneSearchResult] = useState<Account | null>(null);
  const [phoneSearching, setPhoneSearching] = useState(false);
  const [phoneQuery, setPhoneQuery] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const phoneDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);
  const itemsPerPage = 20;

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    try {
      setLoading(true);
      const [data, stats] = await Promise.allSettled([
        accountsApi.getAllAccounts(),
        accountsApi.getStats(),
      ]);
      if (data.status === 'fulfilled') setAccounts(data.value);
      else toast.error(data.reason?.response?.data?.message || 'Failed to load accounts');
      // Stats 403 is expected for non-admin — silently ignore
      if (stats.status === 'fulfilled') setGrowth(stats.value.growth);
    } finally {
      setLoading(false);
    }
  };

  // Search by phone number using the real API endpoint
  const handlePhoneSearch = async (phone: string) => {
    setPhoneQuery(phone);
    setPhoneSearchResult(null);

    if (!phone.trim()) return;

    // Normalize phone
    let normalized = phone.trim();
    if (!normalized.startsWith('+')) {
      if (normalized.startsWith('0')) normalized = '+251' + normalized.slice(1);
      else if (normalized.startsWith('251')) normalized = '+' + normalized;
      else normalized = '+251' + normalized;
    }

    // Debounce — wait 600ms after user stops typing
    if (phoneDebounce.current) clearTimeout(phoneDebounce.current);
    phoneDebounce.current = setTimeout(async () => {
      if (normalized.length < 10) return;
      try {
        setPhoneSearching(true);
        const result = await accountsApi.getAccountByPhoneNumber(normalized);
        setPhoneSearchResult(result);
      } catch (err: any) {
        const msg = err.response?.data?.message || err.message || '';
        if (err.response?.status === 404) {
          toast.info('No account found with that phone number');
        } else if (err.response?.status === 502) {
          toast.warning('Phone search service temporarily unavailable');
        } else {
          toast.error(msg || 'Phone search failed');
        }
        setPhoneSearchResult(null);
      } finally {
        setPhoneSearching(false);
      }
    }, 600);
  };

  const handleDelete = async (partyId: string) => {
    if (!window.confirm('Are you sure you want to delete this account?')) return;
    try {
      await accountsApi.deleteAccount(partyId);
      setAccounts(prev => prev.filter(a => a.party_id !== partyId));
      toast.success('Account deleted');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete account');
    }
  };

  const handlePromote = async (partyId: string) => {
    try {
      await accountsApi.promoteToAdmin(partyId);
      setAccounts(prev => prev.map(a => a.party_id === partyId ? { ...a, role: 'admin' } : a));
      toast.success('User promoted to admin');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to promote user');
    }
  };

  const handleDemote = async (partyId: string) => {
    try {
      await accountsApi.demoteToUser(partyId);
      setAccounts(prev => prev.map(a => a.party_id === partyId ? { ...a, role: 'user' } : a));
      toast.success('Admin demoted to user');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to demote admin');
    }
  };

  const handleExport = () => {
    const csv = [
      ['Account ID', 'Party ID', 'Profile Name', 'Email', 'Role', 'Status', 'Party Type', 'Date'],
      ...filtered.map(a => [
        a.account_id, a.party_id, a.profile_name,
        a.email || '', a.role, a.status,
        a.party_type.name, new Date(a.date).toLocaleDateString()
      ])
    ].map(r => r.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `accounts-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const filtered = accounts.filter(a => {
    const matchSearch =
      a.profile_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.party_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.email || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchRole = roleFilter === 'all' || a.role === roleFilter;
    const matchStatus = statusFilter === 'all' || a.status === statusFilter;
    return matchSearch && matchRole && matchStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const activeCount = accounts.filter(a => a.status === 'active').length;
  const pendingCount = accounts.filter(a => a.status === 'pending_otp').length;
  const adminCount = accounts.filter(a => a.role === 'admin').length;

  if (loading) return <LoadingMessage>Loading accounts...</LoadingMessage>;

  return (
    <Container>
      <PageHeader>
        <PageTitle><FiUsers /> User Management</PageTitle>
        <HeaderActions>
          <Button onClick={loadAccounts}><FiRefreshCw /> Refresh</Button>
          <Button $variant="primary" onClick={handleExport}><FiDownload /> Export</Button>
        </HeaderActions>
      </PageHeader>

      <TopRow>
        <StatsBar>
          <StatCard><StatValue>{accounts.length}</StatValue><StatLabel>Total Accounts</StatLabel></StatCard>
          <StatCard><StatValue>{activeCount}</StatValue><StatLabel>Active</StatLabel></StatCard>
          <StatCard><StatValue>{pendingCount}</StatValue><StatLabel>Pending OTP</StatLabel></StatCard>
          <StatCard><StatValue>{adminCount}</StatValue><StatLabel>Admins</StatLabel></StatCard>
        </StatsBar>
        <RegistrationTrendsCard growth={growth} />
      </TopRow>


      {/* Phone number search — calls real API */}
      <PhoneSearchCard>
        <PhoneSearchTitle><FiPhone /> Search by Phone Number</PhoneSearchTitle>
        <PhoneSearchRow>
          <PhoneSearchInput
            type="tel"
            placeholder="e.g. +251910296505 or 0910296505"
            value={phoneQuery}
            onChange={e => handlePhoneSearch(e.target.value)}
          />
          {phoneSearching && <PhoneSearchStatus>Searching...</PhoneSearchStatus>}
          {!phoneSearching && phoneQuery && !phoneSearchResult && <PhoneSearchStatus $notFound>No result</PhoneSearchStatus>}
        </PhoneSearchRow>
        {phoneSearchResult && (
          <PhoneResultCard>
            <PhoneResultRow>
              {phoneSearchResult.avatar
                ? <Avatar src={phoneSearchResult.avatar} alt={phoneSearchResult.profile_name} />
                : <AvatarPlaceholder>{phoneSearchResult.profile_name.charAt(0).toUpperCase()}</AvatarPlaceholder>
              }
              <PhoneResultInfo>
                <ProfileName>{phoneSearchResult.profile_name}</ProfileName>
                <ProfileEmail>{phoneSearchResult.email || 'No email'}</ProfileEmail>
                <PhoneNumber>{phoneQuery}</PhoneNumber>
              </PhoneResultInfo>
              <PhoneResultMeta>
                <RoleBadge $role={phoneSearchResult.role}>{phoneSearchResult.role}</RoleBadge>
                <StatusBadge $status={phoneSearchResult.status}>{phoneSearchResult.status.replace('_', ' ')}</StatusBadge>
              </PhoneResultMeta>
              <PhoneResultActions>
                <IconButton title="View Details" onClick={() => { setSelectedAccount(phoneSearchResult); setModalOpen(true); }}>
                  <FiEye />
                </IconButton>
                <IconButton $danger title="Delete" onClick={() => handleDelete(phoneSearchResult.party_id)}>
                  <FiTrash2 />
                </IconButton>
              </PhoneResultActions>
            </PhoneResultRow>
            <PhoneNote>⚠ Phone numbers are not shown in the list below for security — use this search to look up by phone.</PhoneNote>
          </PhoneResultCard>
        )}
      </PhoneSearchCard>

      <FiltersCard>
        <FiltersGrid>
          <FilterGroup>
            <Label>Search by Name / Party ID / Email</Label>
            <SearchBar>
              <FiSearch />
              <Input
                type="text"
                placeholder="Search by name, party ID or email..."
                value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              />
            </SearchBar>
          </FilterGroup>
          <FilterGroup>
            <Label>Role</Label>
            <Select value={roleFilter} onChange={e => { setRoleFilter(e.target.value); setCurrentPage(1); }}>
              <option value="all">All Roles</option>
              <option value="user">User</option>
              <option value="agency">Agency</option>
              <option value="admin">Admin</option>
            </Select>
          </FilterGroup>
          <FilterGroup>
            <Label>Status</Label>
            <Select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }}>
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending_otp">Pending OTP</option>
            </Select>
          </FilterGroup>
        </FiltersGrid>
      </FiltersCard>

      <TableCard>
        <Table>
          <thead>
            <Tr>
              <Th>Profile</Th>
              <Th>Party ID</Th>
              <Th>Type</Th>
              <Th>Role</Th>
              <Th>Status</Th>
              <Th>Subscription</Th>
              <Th>Joined</Th>
              <Th>Actions</Th>
            </Tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <Tr>
                <Td colSpan={8} style={{ textAlign: 'center', padding: '40px', color: '#7f8c8d' }}>
                  No accounts found.
                </Td>
              </Tr>
            ) : paginated.map(account => (
              <Tr key={account.account_id}>
                <Td>
                  <ProfileCell>
                    {account.avatar
                      ? <Avatar src={account.avatar} alt={account.profile_name} />
                      : <AvatarPlaceholder>{account.profile_name.charAt(0).toUpperCase()}</AvatarPlaceholder>
                    }
                    <div>
                      <ProfileName>{account.profile_name}</ProfileName>
                      {account.email
                        ? <ProfileEmail>{account.email}</ProfileEmail>
                        : <ProfileEmail style={{ color: '#bdc3c7' }}>No email · use phone search</ProfileEmail>
                      }
                    </div>
                  </ProfileCell>
                </Td>
                <Td>{account.party_id}</Td>
                <Td>{account.party_type.name}</Td>
                <Td><RoleBadge $role={account.role}>{account.role}</RoleBadge></Td>
                <Td><StatusBadge $status={account.status}>{account.status.replace('_', ' ')}</StatusBadge></Td>
                <Td>{account.subscription ? <SubBadge>{account.subscription.type}</SubBadge> : '-'}</Td>
                <Td>{new Date(account.date).toLocaleDateString()}</Td>
                <Td>
                  <ActionButtons>
                    <IconButton title="View Details" onClick={() => { setSelectedAccount(account); setModalOpen(true); }}>
                      <FiEye />
                    </IconButton>
                    {account.role === 'user' && (
                      <IconButton title="Promote to Admin" onClick={() => handlePromote(account.party_id)}>
                        <FiShield />
                      </IconButton>
                    )}
                    {account.role === 'admin' && (
                      <IconButton title="Demote to User" onClick={() => handleDemote(account.party_id)}>
                        <FiUserX />
                      </IconButton>
                    )}
                    <IconButton $danger title="Delete" onClick={() => handleDelete(account.party_id)}>
                      <FiTrash2 />
                    </IconButton>
                  </ActionButtons>
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>

        <Pagination>
          <PageInfo>
            Showing {filtered.length === 0 ? 0 : Math.min((currentPage - 1) * itemsPerPage + 1, filtered.length)}–{Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length}
          </PageInfo>
          <PageButtons>
            <PageButton onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>Previous</PageButton>
            {[...Array(Math.min(5, totalPages))].map((_, i) => (
              <PageButton key={i + 1} $active={currentPage === i + 1} onClick={() => setCurrentPage(i + 1)}>{i + 1}</PageButton>
            ))}
            <PageButton onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Next</PageButton>
          </PageButtons>
        </Pagination>
      </TableCard>

      <Modal $isOpen={modalOpen}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Account Details</ModalTitle>
            <CloseButton onClick={() => setModalOpen(false)}>×</CloseButton>
          </ModalHeader>
          {selectedAccount && (
            <>
              <DetailRow><DetailLabel>Account ID</DetailLabel><DetailValue>{selectedAccount.account_id}</DetailValue></DetailRow>
              <DetailRow><DetailLabel>Party ID</DetailLabel><DetailValue>{selectedAccount.party_id}</DetailValue></DetailRow>
              <DetailRow><DetailLabel>Profile Name</DetailLabel><DetailValue>{selectedAccount.profile_name}</DetailValue></DetailRow>
              {selectedAccount.name && <DetailRow><DetailLabel>First Name</DetailLabel><DetailValue>{selectedAccount.name}</DetailValue></DetailRow>}
              {selectedAccount.last_name && <DetailRow><DetailLabel>Last Name</DetailLabel><DetailValue>{selectedAccount.last_name}</DetailValue></DetailRow>}
              {selectedAccount.email && <DetailRow><DetailLabel>Email</DetailLabel><DetailValue>{selectedAccount.email}</DetailValue></DetailRow>}
              <DetailRow><DetailLabel>Role</DetailLabel><DetailValue><RoleBadge $role={selectedAccount.role}>{selectedAccount.role}</RoleBadge></DetailValue></DetailRow>
              <DetailRow><DetailLabel>Status</DetailLabel><DetailValue><StatusBadge $status={selectedAccount.status}>{selectedAccount.status}</StatusBadge></DetailValue></DetailRow>
              <DetailRow><DetailLabel>Party Type</DetailLabel><DetailValue>{selectedAccount.party_type.name}</DetailValue></DetailRow>
              {selectedAccount.subscription && (
                <>
                  <DetailRow><DetailLabel>Subscription</DetailLabel><DetailValue>{selectedAccount.subscription.type} / {selectedAccount.subscription.period}</DetailValue></DetailRow>
                  <DetailRow><DetailLabel>Sub Status</DetailLabel><DetailValue>{selectedAccount.subscription.status}</DetailValue></DetailRow>
                  <DetailRow><DetailLabel>Expires</DetailLabel><DetailValue>{new Date(selectedAccount.subscription.expires_at).toLocaleDateString()}</DetailValue></DetailRow>
                </>
              )}
              <DetailRow><DetailLabel>Joined</DetailLabel><DetailValue>{new Date(selectedAccount.date).toLocaleString()}</DetailValue></DetailRow>
              <PhoneNote style={{ marginTop: 12 }}>📞 To see phone number, use the phone search above</PhoneNote>
            </>
          )}
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default UserManagementEnhanced;

const Container = styled.div`max-width: 1600px;`;
const PageHeader = styled.div`display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;`;
const PageTitle = styled.h1`font-size: 28px; font-weight: 600; color: #2c3e50; display: flex; align-items: center; gap: 12px;`;
const HeaderActions = styled.div`display: flex; gap: 12px;`;
const Button = styled.button<{ $variant?: string }>`
  background: ${p => p.$variant === 'primary' ? '#3498db' : '#ecf0f1'};
  color: ${p => p.$variant === 'primary' ? 'white' : '#2c3e50'};
  border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer;
  font-size: 14px; font-weight: 500; display: flex; align-items: center; gap: 8px;
  &:hover { background: ${p => p.$variant === 'primary' ? '#2980b9' : '#d5dbdb'}; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;
const TopRow = styled.div`
  display: flex;
  gap: 24px;
  margin-bottom: 24px;
  align-items: flex-start;
  flex-wrap: wrap;
`;
const StatsBar = styled.div`display: flex; gap: 16px; flex-wrap: wrap; flex: 2; min-width: 0;`;
const StatCard = styled.div`background: white; border-radius: 12px; padding: 20px; flex: 1; min-width: 120px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);`;
const StatValue = styled.div`font-size: 32px; font-weight: 700; color: #2c3e50; margin-bottom: 4px;`;
const StatLabel = styled.div`font-size: 13px; color: #7f8c8d; font-weight: 500;`;
const PhoneSearchCard = styled.div`background: white; border-radius: 12px; padding: 24px; margin-bottom: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); border-left: 4px solid #3498db;`;
const PhoneSearchTitle = styled.div`font-size: 15px; font-weight: 600; color: #2c3e50; margin-bottom: 14px; display: flex; align-items: center; gap: 8px;`;
const PhoneSearchRow = styled.div`display: flex; align-items: center; gap: 12px;`;
const PhoneSearchInput = styled.input`flex: 1; max-width: 360px; padding: 10px 14px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px; &:focus { outline: none; border-color: #3498db; }`;
const PhoneSearchStatus = styled.span<{ $notFound?: boolean }>`font-size: 13px; color: ${p => p.$notFound ? '#e74c3c' : '#7f8c8d'};`;
const PhoneResultCard = styled.div`margin-top: 14px; padding: 14px; background: #f8f9fa; border-radius: 8px; border: 1px solid #e2e8f0;`;
const PhoneResultRow = styled.div`display: flex; align-items: center; gap: 14px; flex-wrap: wrap;`;
const PhoneResultInfo = styled.div`flex: 1; min-width: 150px;`;
const PhoneResultMeta = styled.div`display: flex; gap: 8px; align-items: center;`;
const PhoneResultActions = styled.div`display: flex; gap: 6px;`;
const PhoneNumber = styled.div`font-size: 13px; color: #3498db; font-weight: 500; margin-top: 2px;`;
const PhoneNote = styled.div`font-size: 12px; color: #95a5a6; margin-top: 10px;`;
const FiltersCard = styled.div`background: white; border-radius: 12px; padding: 24px; margin-bottom: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);`;
const FiltersGrid = styled.div`display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px;`;
const FilterGroup = styled.div`display: flex; flex-direction: column; gap: 8px;`;
const Label = styled.label`font-size: 13px; font-weight: 600; color: #2c3e50;`;
const Input = styled.input`padding: 10px 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px; width: 100%; &:focus { outline: none; border-color: #3498db; }`;
const Select = styled.select`padding: 10px 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px; background: white; cursor: pointer;`;
const SearchBar = styled.div`position: relative; svg { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #95a5a6; } input { padding-left: 40px; }`;
const TableCard = styled.div`background: white; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); overflow: hidden;`;
const Table = styled.table`width: 100%; border-collapse: collapse;`;
const Th = styled.th`padding: 16px; text-align: left; font-size: 13px; font-weight: 600; color: #2c3e50; border-bottom: 2px solid #ecf0f1; background: #f8f9fa;`;
const Tr = styled.tr`border-bottom: 1px solid #ecf0f1; &:hover { background: #f8f9fa; }`;
const Td = styled.td`padding: 16px; font-size: 14px; color: #2c3e50;`;
const ProfileCell = styled.div`display: flex; align-items: center; gap: 10px;`;
const Avatar = styled.img`width: 36px; height: 36px; border-radius: 50%; object-fit: cover;`;
const AvatarPlaceholder = styled.div`width: 36px; height: 36px; border-radius: 50%; background: #3498db; color: white; display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 14px; flex-shrink: 0;`;
const ProfileName = styled.div`font-weight: 500; font-size: 14px;`;
const ProfileEmail = styled.div`font-size: 12px; color: #7f8c8d;`;
const RoleBadge = styled.span<{ $role: string }>`padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 500; background: ${p => p.$role === 'admin' ? '#fed7d7' : p.$role === 'agency' ? '#feebc8' : '#c6f6d5'}; color: ${p => p.$role === 'admin' ? '#742a2a' : p.$role === 'agency' ? '#7c2d12' : '#22543d'};`;
const StatusBadge = styled.span<{ $status: string }>`padding: 4px 10px; border-radius: 12px; font-size: 12px; font-weight: 500; text-transform: capitalize; background: ${p => p.$status === 'active' ? '#d4edda' : '#e2e3e5'}; color: ${p => p.$status === 'active' ? '#155724' : '#6c757d'};`;
const SubBadge = styled.span`padding: 4px 8px; border-radius: 4px; font-size: 12px; background: #ebf8ff; color: #2b6cb0; text-transform: capitalize;`;
const ActionButtons = styled.div`display: flex; gap: 6px;`;
const IconButton = styled.button<{ $danger?: boolean }>`background: none; border: none; padding: 6px; cursor: pointer; color: ${p => p.$danger ? '#e74c3c' : '#7f8c8d'}; display: flex; align-items: center; &:hover { color: ${p => p.$danger ? '#c0392b' : '#3498db'}; }`;
const Pagination = styled.div`display: flex; justify-content: space-between; align-items: center; padding: 20px; border-top: 1px solid #ecf0f1;`;
const PageInfo = styled.div`font-size: 14px; color: #7f8c8d;`;
const PageButtons = styled.div`display: flex; gap: 8px;`;
const PageButton = styled.button<{ $active?: boolean }>`padding: 8px 12px; border: 1px solid ${p => p.$active ? '#3498db' : '#ddd'}; background: ${p => p.$active ? '#3498db' : 'white'}; color: ${p => p.$active ? 'white' : '#2c3e50'}; border-radius: 6px; cursor: pointer; font-size: 14px; &:disabled { opacity: 0.5; cursor: not-allowed; }`;
const Modal = styled.div<{ $isOpen: boolean }>`display: ${p => p.$isOpen ? 'flex' : 'none'}; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 1000; align-items: center; justify-content: center;`;
const ModalContent = styled.div`background: white; border-radius: 12px; padding: 32px; max-width: 600px; width: 90%; max-height: 80vh; overflow-y: auto;`;
const ModalHeader = styled.div`display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;`;
const ModalTitle = styled.h2`font-size: 24px; font-weight: 600; color: #2c3e50;`;
const CloseButton = styled.button`background: none; border: none; font-size: 24px; cursor: pointer; color: #7f8c8d; &:hover { color: #2c3e50; }`;
const DetailRow = styled.div`display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #ecf0f1; &:last-child { border-bottom: none; }`;
const DetailLabel = styled.span`font-weight: 600; color: #7f8c8d; font-size: 14px;`;
const DetailValue = styled.span`color: #2c3e50; font-size: 14px;`;
const LoadingMessage = styled.div`text-align: center; padding: 60px; font-size: 16px; color: #7f8c8d;`;
