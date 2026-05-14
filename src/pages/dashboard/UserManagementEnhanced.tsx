import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { FiUsers, FiSearch, FiDownload, FiEye, FiShield, FiUserX, FiTrash2, FiRefreshCw, FiPhone, FiMail, FiHash, FiUser } from 'react-icons/fi';
import accountsApi, { Account } from '../../services/accountsApi';
import { accountReportsApi, AccountRating } from '../../services/accountReportsApi';
import { partyApi } from '../../services/api';
import UserProfileModal from '../../components/UserProfileModal';
import { toast } from 'react-toastify';
import RegistrationTrendsCard from '../../components/charts/RegistrationTrendsCard';

const UserManagementEnhanced: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [ratings, setRatings] = useState<Record<string, AccountRating>>({});
  const [loading, setLoading] = useState(true);
  const [growth, setGrowth] = useState<{ today: number; thisWeek: number; thisMonth: number } | null>(null);
  const [phoneSearchResult, setPhoneSearchResult] = useState<Account | null>(null);
  const [phoneSearching, setPhoneSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [verifiedFilter, setVerifiedFilter] = useState('all');
  const [searchType, setSearchType] = useState<'all' | 'name' | 'email' | 'phone' | 'id'>('all');
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [partyTypeFilter, setPartyTypeFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const phoneDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);
  const phoneQuery = searchQuery;
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
      if (data.status === 'fulfilled') {
        setAccounts(data.value);
        fetchRatings(data.value);
        fetchAllPhones(data.value);
      }
      else toast.error(data.reason?.response?.data?.message || 'Failed to load accounts');
      // Stats 403 is expected for non-admin — silently ignore
      if (stats.status === 'fulfilled') setGrowth(stats.value.growth);
    } finally {
      setLoading(false);
    }
  };

  // Search by phone number using the real API endpoint
  const fetchAllPhones = async (list: Account[]) => {
    // Fetch party profile for every account to get phone + photo
    for (const a of list) {
      try {
        const res = await partyApi.get(`/party-profiles/find-by-party-id/${a.party_id}`);
        const phone = res.data?.phone_number || res.data?.phone || res.data?.phonenumber;
        const rawPhoto = res.data?.photo;
        const PARTY_BASE = import.meta.env.VITE_PARTY_SERVICE || 'https://stage-party.besewonline.com';
        const photo = rawPhoto
          ? (rawPhoto.startsWith('http') ? rawPhoto : `${PARTY_BASE}/company-data/file/${rawPhoto}`)
          : undefined;
        if (phone || photo) {
          setAccounts(prev => prev.map(acc =>
            acc.party_id === a.party_id
              ? { ...acc, ...(phone ? { phone } : {}), ...(photo ? { avatar: photo } : {}) }
              : acc
          ));
        }
      } catch { /* silent */ }
    }
  };

  const fetchRatings = async (list: Account[]) => {
    const results = await Promise.allSettled(
      list.map(a => accountReportsApi.getAccountRating(a.party_id))
    );
    const map: Record<string, AccountRating> = {};
    results.forEach((res, i) => {
      if (res.status === 'fulfilled') map[list[i].party_id] = res.value;
    });
    setRatings(map);
  };

  const handlePhoneSearch = async (query: string) => {
    setPhoneSearchResult(null);
    const isPhone = /^[\+0-9]{7,}$/.test(query.trim().replace(/\s/g, ''));
    if (!isPhone) return;

    let normalized = query.trim();
    if (!normalized.startsWith('+')) {
      if (normalized.startsWith('0')) normalized = '+251' + normalized.slice(1);
      else if (normalized.startsWith('251')) normalized = '+' + normalized;
      else normalized = '+251' + normalized;
    }

    if (phoneDebounce.current) clearTimeout(phoneDebounce.current);
    phoneDebounce.current = setTimeout(async () => {
      if (normalized.length < 10) return;
      try {
        setPhoneSearching(true);
        const result = await accountsApi.getAccountByPhoneNumber(normalized);
        setPhoneSearchResult(result);
      } catch (err: any) {
        const msg = err.response?.data?.message || err.message || '';
        if (err.response?.status === 404) toast.info('No account found with that phone number');
        else if (err.response?.status === 502) toast.warning('Phone search service temporarily unavailable');
        else toast.error(msg || 'Phone search failed');
        setPhoneSearchResult(null);
      } finally {
        setPhoneSearching(false);
      }
    }, 600);
  };

  const openModal = (account: Account) => {
    setSelectedAccount(account);
    setModalOpen(true);
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
    const q = searchQuery.toLowerCase();
    let matchSearch = false;
    if (!q) {
      matchSearch = true;
    } else if (searchType === 'name') {
      matchSearch = a.profile_name.toLowerCase().includes(q);
    } else if (searchType === 'email') {
      matchSearch = (a.email || '').toLowerCase().includes(q);
    } else if (searchType === 'phone') {
      matchSearch = (a.phone || a.phonenumber || '').toLowerCase().includes(q);
    } else if (searchType === 'id') {
      matchSearch = a.party_id.toLowerCase().includes(q);
    } else {
      matchSearch =
        a.profile_name.toLowerCase().includes(q) ||
        a.party_id.toLowerCase().includes(q) ||
        (a.email || '').toLowerCase().includes(q) ||
        (a.phone || a.phonenumber || '').toLowerCase().includes(q);
    }
    const matchRole = roleFilter === 'all' || a.role === roleFilter;
    const matchStatus = statusFilter === 'all' || a.status === statusFilter;
    const matchVerified =
      verifiedFilter === 'all' ||
      (verifiedFilter === 'verified' && (a.is_verified || a.verified)) ||
      (verifiedFilter === 'unverified' && !a.is_verified && !a.verified);
    const matchPartyType = partyTypeFilter === 'all' || a.party_type?.name?.toLowerCase() === partyTypeFilter;
    return matchSearch && matchRole && matchStatus && matchVerified && matchPartyType;
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
        <StatsGrid>
          <StatCard><StatValue>{accounts.length}</StatValue><StatLabel>Total Accounts</StatLabel></StatCard>
          <StatCard><StatValue>{activeCount}</StatValue><StatLabel>Active</StatLabel></StatCard>
          <StatCard><StatValue>{pendingCount}</StatValue><StatLabel>Pending OTP</StatLabel></StatCard>
          <StatCard><StatValue>{adminCount}</StatValue><StatLabel>Admins</StatLabel></StatCard>
        </StatsGrid>
        <RegistrationTrendsCard growth={growth} />
      </TopRow>


      <FiltersCard>
        {/* ── top: search input + type tabs ── */}
        <SearchSection>
          <TypeTabs>
            {([
              ['all',   'All',   <FiSearch size={13}/>],
              ['name',  'Name',  <FiUser   size={13}/>],
              ['email', 'Email', <FiMail   size={13}/>],
              ['phone', 'Phone', <FiPhone  size={13}/>],
              ['id',    'ID',    <FiHash   size={13}/>],
            ] as [string, string, React.ReactNode][]).map(([val, label, icon]) => (
              <TypeTab
                key={val}
                $active={searchType === val}
                onClick={() => { setSearchType(val as any); setCurrentPage(1); }}
              >
                <TypeTabIcon $active={searchType === val} $val={val}>{icon}</TypeTabIcon>
                {label}
              </TypeTab>
            ))}
          </TypeTabs>
          <SearchWrap>
            <SearchIconWrap $type={searchType}>
              {searchType === 'phone' ? <FiPhone size={15}/> :
               searchType === 'email' ? <FiMail size={15}/> :
               searchType === 'id'    ? <FiHash size={15}/> :
               searchType === 'name'  ? <FiUser size={15}/> :
               <FiSearch size={15}/>}
            </SearchIconWrap>
            <SearchInput
              type="text"
              placeholder={
                searchType === 'phone' ? 'Search by phone  e.g. +251910296505 or 0910296505' :
                searchType === 'email' ? 'Search by email address' :
                searchType === 'id'    ? 'Search by Party ID' :
                searchType === 'name'  ? 'Search by full name' :
                'Search users by name, email, phone or ID…'
              }
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
                if (searchType === 'all' || searchType === 'phone') handlePhoneSearch(e.target.value);
              }}
            />
            <SearchRight>
              {phoneSearching && (
                <SearchSpinner>
                  <SpinRing />
                  <span>Searching…</span>
                </SearchSpinner>
              )}
              {searchQuery && !phoneSearching && (
                <LiveCount>{filtered.length}</LiveCount>
              )}
              {searchQuery && (
                <SearchClear onClick={() => { setSearchQuery(''); setPhoneSearchResult(null); setCurrentPage(1); }}>
                  <FiSearch size={12} style={{ opacity: 0 }} />
                  ✕
                </SearchClear>
              )}
            </SearchRight>
          </SearchWrap>
        </SearchSection>

        {/* ── bottom: filter dropdowns ── */}
        <FilterBar>
          <FilterSection2>
            <FilterSectionLabel>Role</FilterSectionLabel>
            <FilterDropdown
              value={roleFilter}
              onChange={e => { setRoleFilter(e.target.value); setCurrentPage(1); }}
            >
              <option value="all">All roles ({accounts.length})</option>
              <option value="user">User ({accounts.filter(a => a.role === 'user').length})</option>
              <option value="agency">Agency ({accounts.filter(a => a.role === 'agency').length})</option>
              <option value="admin">Admin ({accounts.filter(a => a.role === 'admin').length})</option>
            </FilterDropdown>
          </FilterSection2>

          <FilterBarDivider />

          <FilterSection2>
            <FilterSectionLabel>Status</FilterSectionLabel>
            <FilterDropdown
              value={statusFilter}
              onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            >
              <option value="all">All status ({accounts.length})</option>
              <option value="active">Active ({accounts.filter(a => a.status === 'active').length})</option>
              <option value="pending_otp">Pending OTP ({accounts.filter(a => a.status === 'pending_otp').length})</option>
              <option value="inactive">Inactive ({accounts.filter(a => a.status === 'inactive').length})</option>
              <option value="suspended">Suspended ({accounts.filter(a => a.status === 'suspended').length})</option>
            </FilterDropdown>
          </FilterSection2>

          <FilterBarDivider />

          <FilterSection2>
            <FilterSectionLabel>Party Type</FilterSectionLabel>
            <FilterDropdown
              value={partyTypeFilter}
              onChange={e => { setPartyTypeFilter(e.target.value); setCurrentPage(1); }}
            >
              <option value="all">All types</option>
              <option value="candidate">Candidate</option>
              <option value="agency">Agency</option>
              <option value="employee">Employee</option>
              <option value="individual">Individual</option>
            </FilterDropdown>
          </FilterSection2>

          <FilterBarDivider />

          <FilterSection2>
            <FilterSectionLabel>Verified</FilterSectionLabel>
            <FilterDropdown
              value={verifiedFilter}
              onChange={e => { setVerifiedFilter(e.target.value); setCurrentPage(1); }}
            >
              <option value="all">All ({accounts.length})</option>
              <option value="verified">Verified ({accounts.filter(a => a.is_verified || a.verified).length})</option>
              <option value="unverified">Not verified ({accounts.filter(a => !a.is_verified && !a.verified).length})</option>
            </FilterDropdown>
          </FilterSection2>

          {(roleFilter !== 'all' || statusFilter !== 'all' || verifiedFilter !== 'all' || partyTypeFilter !== 'all' || searchQuery) && (
            <ClearAllBtn onClick={() => { setRoleFilter('all'); setStatusFilter('all'); setVerifiedFilter('all'); setPartyTypeFilter('all'); setSearchQuery(''); setPhoneSearchResult(null); setCurrentPage(1); }}>
              Clear all
            </ClearAllBtn>
          )}
        </FilterBar>

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
                <IconButton title="View Details" onClick={() => openModal(phoneSearchResult)}>
                  <FiEye />
                </IconButton>
                <IconButton $danger title="Delete" onClick={() => handleDelete(phoneSearchResult.party_id)}>
                  <FiTrash2 />
                </IconButton>
              </PhoneResultActions>
            </PhoneResultRow>
          </PhoneResultCard>
        )}
      </FiltersCard>

      <TableCard>
        <Table>
          <thead>
            <Tr>
              <Th>Profile</Th>
              <Th>Phone</Th>
              <Th>Verified</Th>
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
                <Td colSpan={10} style={{ textAlign: 'center', padding: '40px', color: '#7f8c8d' }}>
                  No accounts found.
                </Td>
              </Tr>
            ) : paginated.map(account => (
              <Tr key={account.account_id} $alert={ratings[account.party_id]?.rating < 4}>
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
                      {ratings[account.party_id] && (
                        <TrustRow>
                          {ratings[account.party_id].ethicalPremiumBadgeLevel === 'GOLD' && <TrustBadge $level="GOLD">🥇 Gold</TrustBadge>}
                          {ratings[account.party_id].ethicalPremiumBadgeLevel === 'SILVER' && <TrustBadge $level="SILVER">🥈 Silver</TrustBadge>}
                          {ratings[account.party_id].ethicalPremiumBadgeLevel === 'BRONZE' && <TrustBadge $level="BRONZE">🥉 Bronze</TrustBadge>}
                          {ratings[account.party_id].rating < 4 && <LowTrustBadge>⚠ Low Trust {ratings[account.party_id].rating}/10</LowTrustBadge>}
                        </TrustRow>
                      )}
                    </div>
                  </ProfileCell>
                </Td>
                <Td>
                  {(account.phone || account.phonenumber)
                    ? <PhoneCell><FiPhone size={11} />{account.phone || account.phonenumber}</PhoneCell>
                    : <NoData>—</NoData>
                  }
                </Td>
                <Td>
                  {(account.is_verified || account.verified)
                    ? <VerifiedBadge>✓ Verified</VerifiedBadge>
                    : <UnverifiedBadge>✗ Not verified</UnverifiedBadge>
                  }
                </Td>
                <Td>{account.party_id}</Td>
                <Td>{account.party_type.name}</Td>
                <Td><RoleBadge $role={account.role}>{account.role}</RoleBadge></Td>
                <Td><StatusBadge $status={account.status}>{account.status.replace('_', ' ')}</StatusBadge></Td>
                <Td>{account.subscription ? <SubBadge>{account.subscription.type}</SubBadge> : '-'}</Td>
                <Td>{new Date(account.date).toLocaleDateString()}</Td>
                <Td>
                  <ActionButtons>
                    <IconButton title="View Details" onClick={() => openModal(account)}>
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

      {modalOpen && selectedAccount && (
        <UserProfileModal
          account={selectedAccount}
          onClose={() => { setModalOpen(false); setSelectedAccount(null); }}
        />
      )}
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
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 24px;
  align-items: stretch;
`;
const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 16px;
`;
const StatCard = styled.div`
  background: white; border-radius: 12px; padding: 22px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  display: flex; flex-direction: column; justify-content: center;
`;
const StatValue = styled.div`font-size: 32px; font-weight: 700; color: #2c3e50; margin-bottom: 4px;`;
const StatLabel = styled.div`font-size: 13px; color: #7f8c8d; font-weight: 500;`;

const PhoneResultCard = styled.div`margin-top: 14px; padding: 14px; background: #f8f9fa; border-radius: 8px; border: 1px solid #e2e8f0;`;
const PhoneResultRow = styled.div`display: flex; align-items: center; gap: 14px; flex-wrap: wrap;`;
const PhoneResultInfo = styled.div`flex: 1; min-width: 150px;`;
const PhoneResultMeta = styled.div`display: flex; gap: 8px; align-items: center;`;
const PhoneResultActions = styled.div`display: flex; gap: 6px;`;
const PhoneNumber = styled.div`font-size: 13px; color: #3498db; font-weight: 500; margin-top: 2px;`;
const FiltersCard = styled.div`
  background: #fff;
  border-radius: 16px;
  margin-bottom: 24px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04);
  border: 1px solid #edf2f7;
  overflow: hidden;
`;

/* ── Search section ── */
const SearchSection = styled.div`
  padding: 20px 24px;
`;
const SearchWrap = styled.div`
  display: flex;
  align-items: center;
  background: #f7fafc;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
  &:focus-within {
    border-color: #4299e1;
    box-shadow: 0 0 0 4px rgba(66,153,225,0.12);
    background: #fff;
  }
`;
const SearchIconWrap = styled.div<{ $type: string }>`
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: ${
    p => p.$type === 'phone' ? '#38a169' :
         p.$type === 'email' ? '#805ad5' :
         p.$type === 'id'    ? '#dd6b20' :
         p.$type === 'name'  ? '#3182ce' : '#a0aec0'
  };
  transition: color 0.2s;
`;
const SearchInput = styled.input`
  flex: 1;
  height: 48px;
  border: none;
  background: transparent;
  font-size: 15px;
  color: #1a202c;
  outline: none;
  padding: 0 4px;
  &::placeholder { color: #a0aec0; font-weight: 400; }
`;
const SearchRight = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding-right: 12px;
  flex-shrink: 0;
`;
const SearchSpinner = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #a0aec0;
`;
const SpinRing = styled.span`
  width: 14px; height: 14px;
  border-radius: 50%;
  border: 2px solid #e2e8f0;
  border-top-color: #4299e1;
  display: inline-block;
  animation: spinRing 0.7s linear infinite;
  @keyframes spinRing { to { transform: rotate(360deg); } }
`;
const LiveCount = styled.span`
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  font-size: 11px;
  font-weight: 700;
  padding: 2px 9px;
  border-radius: 20px;
  letter-spacing: 0.3px;
`;
const SearchClear = styled.button`
  width: 26px; height: 26px;
  border-radius: 50%;
  border: none;
  background: #edf2f7;
  color: #718096;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  transition: background 0.15s, color 0.15s;
  &:hover { background: #e53e3e; color: white; }
`;
const TypeTabs = styled.div`
  display: flex;
  gap: 6px;
  margin-bottom: 12px;
`;
const TypeTab = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 8px;
  border: 1.5px solid ${p => p.$active ? '#4299e1' : '#e2e8f0'};
  background: ${p => p.$active ? '#ebf8ff' : '#fff'};
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  color: ${p => p.$active ? '#2b6cb0' : '#a0aec0'};
  letter-spacing: 0.3px;
  transition: all 0.15s;
  box-shadow: ${p => p.$active ? '0 1px 4px rgba(66,153,225,0.15)' : 'none'};
  &:hover { border-color: #4299e1; color: #2b6cb0; background: #ebf8ff; }
`;
const TypeTabIcon = styled.span<{ $active: boolean; $val: string }>`
  display: flex;
  align-items: center;
  color: ${
    p => !p.$active ? '#cbd5e0' :
         p.$val === 'phone' ? '#38a169' :
         p.$val === 'email' ? '#805ad5' :
         p.$val === 'id'    ? '#dd6b20' :
         p.$val === 'name'  ? '#3182ce' : '#4299e1'
  };
  transition: color 0.15s;
`;

/* ── Filter bar ── */
const FilterBar = styled.div`
  display: flex;
  align-items: center;
  padding: 14px 24px;
  background: #f7fafc;
  border-top: 1px solid #edf2f7;
  flex-wrap: wrap;
  gap: 12px;
`;
const FilterSection2 = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;
const FilterSectionLabel = styled.span`
  font-size: 11px;
  font-weight: 700;
  color: #718096;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  white-space: nowrap;
`;
const FilterBarDivider = styled.div`
  width: 1px; height: 30px;
  background: #e2e8f0;
  margin: 0 4px;
  flex-shrink: 0;
`;
const ClearAllBtn = styled.button`
  margin-left: auto;
  padding: 5px 14px;
  border-radius: 8px;
  border: 1.5px solid #fed7d7;
  background: #fff5f5;
  color: #e53e3e;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
  &:hover { background: #e53e3e; color: white; border-color: #e53e3e; }
`;
const FilterDropdown = styled.select`
  height: 36px;
  padding: 0 36px 0 14px;
  border: 1.5px solid #e2e8f0;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  color: #2d3748;
  background: #fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%234299e1'/%3E%3C/svg%3E") no-repeat right 12px center;
  appearance: none;
  cursor: pointer;
  outline: none;
  min-width: 160px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04);
  transition: border-color 0.15s, box-shadow 0.15s;
  &:hover { border-color: #4299e1; background-color: #f7fafc; }
  &:focus { border-color: #4299e1; box-shadow: 0 0 0 3px rgba(66,153,225,0.15); }
  option { font-weight: 500; }
`;
const TableCard = styled.div`background: white; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); overflow: hidden;`;
const Table = styled.table`width: 100%; border-collapse: collapse;`;
const Th = styled.th`padding: 16px; text-align: left; font-size: 13px; font-weight: 600; color: #2c3e50; border-bottom: 2px solid #ecf0f1; background: #f8f9fa;`;
const Tr = styled.tr<{ $alert?: boolean }>`border-bottom: 1px solid #ecf0f1; background: ${p => p.$alert ? '#fff5f5' : 'white'}; &:hover { background: ${p => p.$alert ? '#fee2e2' : '#f8f9fa'}; }`;
const Td = styled.td`padding: 16px; font-size: 14px; color: #2c3e50;`;
const ProfileCell = styled.div`display: flex; align-items: center; gap: 10px;`;
const Avatar = styled.img`width: 36px; height: 36px; border-radius: 50%; object-fit: cover;`;
const AvatarPlaceholder = styled.div`width: 36px; height: 36px; border-radius: 50%; background: #3498db; color: white; display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 14px; flex-shrink: 0;`;
const ProfileName = styled.div`font-weight: 500; font-size: 14px;`;
const ProfileEmail = styled.div`font-size: 12px; color: #7f8c8d;`;
const RoleBadge = styled.span<{ $role: string }>`
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 700;
  text-transform: capitalize;
  letter-spacing: 0.3px;
  background: ${
    p => p.$role === 'admin'  ? '#fff5f5' :
         p.$role === 'agency' ? '#fffbeb' : '#ebf8ff'
  };
  color: ${
    p => p.$role === 'admin'  ? '#c53030' :
         p.$role === 'agency' ? '#b7791f' : '#2b6cb0'
  };
  border: 1px solid ${
    p => p.$role === 'admin'  ? '#feb2b2' :
         p.$role === 'agency' ? '#f6e05e' : '#bee3f8'
  };
`;
const StatusBadge = styled.span<{ $status: string }>`
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 700;
  text-transform: capitalize;
  letter-spacing: 0.3px;
  background: ${
    p => p.$status === 'active'      ? '#f0fff4' :
         p.$status === 'pending_otp' ? '#ebf8ff' :
         p.$status === 'inactive'    ? '#f7fafc' :
         p.$status === 'suspended'   ? '#fffbeb' : '#fff5f5'
  };
  color: ${
    p => p.$status === 'active'      ? '#276749' :
         p.$status === 'pending_otp' ? '#2b6cb0' :
         p.$status === 'inactive'    ? '#718096' :
         p.$status === 'suspended'   ? '#92400e' : '#9b2c2c'
  };
  border: 1px solid ${
    p => p.$status === 'active'      ? '#9ae6b4' :
         p.$status === 'pending_otp' ? '#bee3f8' :
         p.$status === 'inactive'    ? '#e2e8f0' :
         p.$status === 'suspended'   ? '#fbd38d' : '#feb2b2'
  };
`;
const SubBadge = styled.span`padding: 4px 8px; border-radius: 4px; font-size: 12px; background: #ebf8ff; color: #2b6cb0; text-transform: capitalize;`;
const ActionButtons = styled.div`display: flex; gap: 6px;`;
const IconButton = styled.button<{ $danger?: boolean }>`background: none; border: none; padding: 6px; cursor: pointer; color: ${p => p.$danger ? '#e74c3c' : '#7f8c8d'}; display: flex; align-items: center; &:hover { color: ${p => p.$danger ? '#c0392b' : '#3498db'}; }`;
const Pagination = styled.div`display: flex; justify-content: space-between; align-items: center; padding: 20px; border-top: 1px solid #ecf0f1;`;
const PageInfo = styled.div`font-size: 14px; color: #7f8c8d;`;
const PageButtons = styled.div`display: flex; gap: 8px;`;
const PageButton = styled.button<{ $active?: boolean }>`padding: 8px 12px; border: 1px solid ${p => p.$active ? '#3498db' : '#ddd'}; background: ${p => p.$active ? '#3498db' : 'white'}; color: ${p => p.$active ? 'white' : '#2c3e50'}; border-radius: 6px; cursor: pointer; font-size: 14px; &:disabled { opacity: 0.5; cursor: not-allowed; }`;
const LoadingMessage = styled.div`text-align: center; padding: 60px; font-size: 16px; color: #7f8c8d;`;
const TrustRow = styled.div`display: flex; gap: 4px; margin-top: 3px; flex-wrap: wrap;`;
const TrustBadge = styled.span<{ $level: string }>`
  padding: 1px 6px; border-radius: 8px; font-size: 10px; font-weight: 600;
  background: ${p => p.$level === 'GOLD' ? '#fef3c7' : p.$level === 'SILVER' ? '#f3f4f6' : '#fde8d8'};
  color: ${p => p.$level === 'GOLD' ? '#92400e' : p.$level === 'SILVER' ? '#374151' : '#78350f'};
`;
const LowTrustBadge = styled.span`padding: 1px 6px; border-radius: 8px; font-size: 10px; font-weight: 600; background: #fee2e2; color: #dc2626;`;
const PhoneCell = styled.div`display: flex; align-items: center; gap: 5px; font-size: 13px; color: #2c3e50; white-space: nowrap;`;
const NoData = styled.span`color: #cbd5e0; font-size: 16px;`;
const VerifiedBadge = styled.span`
  display: inline-flex; align-items: center; gap: 3px;
  padding: 3px 8px; border-radius: 20px; font-size: 11px; font-weight: 600;
  background: #f0fff4; color: #276749; border: 1px solid #9ae6b4;
`;
const UnverifiedBadge = styled.span`
  display: inline-flex; align-items: center; gap: 3px;
  padding: 3px 8px; border-radius: 20px; font-size: 11px; font-weight: 600;
  background: #fff5f5; color: #c53030; border: 1px solid #fed7d7;
`;
