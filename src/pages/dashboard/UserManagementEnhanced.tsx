import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FiUsers, FiSearch, FiDownload, FiEye, FiLock, FiUnlock, FiRefreshCw } from 'react-icons/fi';
import { accountApi, handleApiError } from '../../services/api';
import monitoringApi from '../../services/monitoringApi';

const Container = styled.div`
  max-width: 1600px;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const PageTitle = styled.h1`
  font-size: 28px;
  font-weight: 600;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 12px;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  background: ${props => props.variant === 'primary' ? '#3498db' : '#ecf0f1'};
  color: ${props => props.variant === 'primary' ? 'white' : '#2c3e50'};
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.variant === 'primary' ? '#2980b9' : '#d5dbdb'};
  }

  &:disabled {
    background: #95a5a6;
    cursor: not-allowed;
  }
`;

const FiltersCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const FiltersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  margin-bottom: 16px;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 13px;
  font-weight: 600;
  color: #2c3e50;
`;

const Input = styled.input`
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #3498db;
  }
`;

const Select = styled.select`
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  background: white;
  cursor: pointer;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #3498db;
  }
`;

const SearchBar = styled.div`
  position: relative;
  flex: 1;

  svg {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #95a5a6;
  }

  input {
    width: 100%;
    padding: 10px 12px 10px 40px;
  }
`;

const StatsBar = styled.div`
  display: flex;
  gap: 24px;
  margin-bottom: 24px;
`;

const StatCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  flex: 1;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const StatValue = styled.div`
  font-size: 32px;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 4px;
`;

const StatLabel = styled.div`
  font-size: 13px;
  color: #7f8c8d;
  font-weight: 500;
`;

const TableCard = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Thead = styled.thead`
  background: #f8f9fa;
`;

const Th = styled.th`
  padding: 16px;
  text-align: left;
  font-size: 13px;
  font-weight: 600;
  color: #2c3e50;
  border-bottom: 2px solid #ecf0f1;
`;

const Tbody = styled.tbody``;

const Tr = styled.tr`
  border-bottom: 1px solid #ecf0f1;
  transition: background 0.2s;

  &:hover {
    background: #f8f9fa;
  }
`;

const Td = styled.td`
  padding: 16px;
  font-size: 14px;
  color: #2c3e50;
`;

const StatusBadge = styled.span<{ status: string }>`
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  background: ${props => {
    switch (props.status) {
      case 'active': return '#d4edda';
      case 'verified': return '#d1ecf1';
      case 'suspended': return '#fff3cd';
      case 'banned': return '#f8d7da';
      default: return '#e2e3e5';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'active': return '#155724';
      case 'verified': return '#0c5460';
      case 'suspended': return '#856404';
      case 'banned': return '#721c24';
      default: return '#383d41';
    }
  }};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  padding: 6px;
  cursor: pointer;
  color: #7f8c8d;
  transition: color 0.2s;
  display: flex;
  align-items: center;

  &:hover {
    color: #3498db;
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-top: 1px solid #ecf0f1;
`;

const PageInfo = styled.div`
  font-size: 14px;
  color: #7f8c8d;
`;

const PageButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const PageButton = styled.button<{ active?: boolean }>`
  padding: 8px 12px;
  border: 1px solid ${props => props.active ? '#3498db' : '#ddd'};
  background: ${props => props.active ? '#3498db' : 'white'};
  color: ${props => props.active ? 'white' : '#2c3e50'};
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: ${props => props.active ? '#2980b9' : '#f8f9fa'};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Modal = styled.div<{ isOpen: boolean }>`
  display: ${props => props.isOpen ? 'flex' : 'none'};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  align-items: center;
  justify-content: center;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  padding: 32px;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const ModalTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: #2c3e50;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #7f8c8d;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #2c3e50;
  }
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #ecf0f1;

  &:last-child {
    border-bottom: none;
  }
`;

const DetailLabel = styled.span`
  font-weight: 600;
  color: #7f8c8d;
`;

const DetailValue = styled.span`
  color: #2c3e50;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 60px;
  font-size: 16px;
  color: #7f8c8d;
`;

const ErrorMessage = styled.div`
  background: #fee;
  color: #c0392b;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 24px;
`;

interface User {
  _id: string;
  phonenumber: string;
  role: string;
  status: string;
  isOtpVerified: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

interface UserStats {
  total: number;
  active: number;
  verified: number;
  suspended: number;
}

const UserManagementEnhanced: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<UserStats>({ total: 0, active: 0, verified: 0, suspended: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [verificationFilter, setVerificationFilter] = useState('all');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(20);

  useEffect(() => {
    loadUsers();
    loadStats();
  }, [currentPage, roleFilter, statusFilter, verificationFilter, searchQuery]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      // Build query parameters
      const params: any = {
        page: currentPage,
        limit: itemsPerPage,
      };

      if (roleFilter !== 'all') params.role = roleFilter;
      if (statusFilter !== 'all') params.status = statusFilter;
      if (verificationFilter !== 'all') params.isOtpVerified = verificationFilter === 'verified';
      if (searchQuery) params.search = searchQuery;

      const response = await accountApi.get('/accounts', { params });
      
      setUsers(response.data.users || response.data || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (err: any) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const statsData = await monitoringApi.account.getAccountStats();
      setStats({
        total: statsData.total || 0,
        active: statsData.active || 0,
        verified: statsData.verified || 0,
        suspended: statsData.suspended || 0,
      });
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  };

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  const handleUpdateStatus = async (userId: string, newStatus: string) => {
    try {
      await accountApi.patch(`/accounts/${userId}/status`, { status: newStatus });
      loadUsers();
      loadStats();
    } catch (err: any) {
      alert(handleApiError(err));
    }
  };

  const handleExport = () => {
    // Export users to CSV
    const csv = [
      ['Phone Number', 'Role', 'Status', 'Verified', 'Created At'],
      ...users.map(u => [
        u.phonenumber,
        u.role,
        u.status,
        u.isOtpVerified ? 'Yes' : 'No',
        new Date(u.createdAt).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (loading && users.length === 0) {
    return <LoadingMessage>Loading users...</LoadingMessage>;
  }

  return (
    <Container>
      <PageHeader>
        <PageTitle>
          <FiUsers />
          User Management
        </PageTitle>
        <HeaderActions>
          <Button onClick={loadUsers} disabled={loading}>
            <FiRefreshCw />
            Refresh
          </Button>
          <Button onClick={handleExport}>
            <FiDownload />
            Export
          </Button>
        </HeaderActions>
      </PageHeader>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <StatsBar>
        <StatCard>
          <StatValue>{stats.total.toLocaleString()}</StatValue>
          <StatLabel>Total Users</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{stats.active.toLocaleString()}</StatValue>
          <StatLabel>Active Users</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{stats.verified.toLocaleString()}</StatValue>
          <StatLabel>Verified Users</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{stats.suspended.toLocaleString()}</StatValue>
          <StatLabel>Suspended</StatLabel>
        </StatCard>
      </StatsBar>

      <FiltersCard>
        <FiltersGrid>
          <FilterGroup>
            <Label>Search</Label>
            <SearchBar>
              <FiSearch />
              <Input
                type="text"
                placeholder="Search by phone number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </SearchBar>
          </FilterGroup>

          <FilterGroup>
            <Label>Role</Label>
            <Select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
              <option value="all">All Roles</option>
              <option value="user">User</option>
              <option value="agency">Agency</option>
              <option value="employee">Employee</option>
              <option value="admin">Admin</option>
            </Select>
          </FilterGroup>

          <FilterGroup>
            <Label>Status</Label>
            <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="banned">Banned</option>
            </Select>
          </FilterGroup>

          <FilterGroup>
            <Label>Verification</Label>
            <Select value={verificationFilter} onChange={(e) => setVerificationFilter(e.target.value)}>
              <option value="all">All</option>
              <option value="verified">Verified</option>
              <option value="unverified">Unverified</option>
            </Select>
          </FilterGroup>
        </FiltersGrid>
      </FiltersCard>

      <TableCard>
        <Table>
          <Thead>
            <Tr>
              <Th>Phone Number</Th>
              <Th>Role</Th>
              <Th>Status</Th>
              <Th>Verified</Th>
              <Th>Created</Th>
              <Th>Last Login</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {users.map((user) => (
              <Tr key={user._id}>
                <Td>{user.phonenumber}</Td>
                <Td>{user.role}</Td>
                <Td>
                  <StatusBadge status={user.status}>{user.status}</StatusBadge>
                </Td>
                <Td>
                  <StatusBadge status={user.isOtpVerified ? 'verified' : 'unverified'}>
                    {user.isOtpVerified ? 'Yes' : 'No'}
                  </StatusBadge>
                </Td>
                <Td>{new Date(user.createdAt).toLocaleDateString()}</Td>
                <Td>{user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : 'Never'}</Td>
                <Td>
                  <ActionButtons>
                    <IconButton onClick={() => handleViewUser(user)} title="View Details">
                      <FiEye />
                    </IconButton>
                    {user.status === 'active' && (
                      <IconButton 
                        onClick={() => handleUpdateStatus(user._id, 'suspended')}
                        title="Suspend User"
                      >
                        <FiLock />
                      </IconButton>
                    )}
                    {user.status === 'suspended' && (
                      <IconButton 
                        onClick={() => handleUpdateStatus(user._id, 'active')}
                        title="Activate User"
                      >
                        <FiUnlock />
                      </IconButton>
                    )}
                  </ActionButtons>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>

        <Pagination>
          <PageInfo>
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, stats.total)} of {stats.total} users
          </PageInfo>
          <PageButtons>
            <PageButton 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </PageButton>
            {[...Array(Math.min(5, totalPages))].map((_, i) => {
              const page = i + 1;
              return (
                <PageButton
                  key={page}
                  active={currentPage === page}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </PageButton>
              );
            })}
            <PageButton 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </PageButton>
          </PageButtons>
        </Pagination>
      </TableCard>

      <Modal isOpen={modalOpen}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>User Details</ModalTitle>
            <CloseButton onClick={() => setModalOpen(false)}>×</CloseButton>
          </ModalHeader>
          {selectedUser && (
            <>
              <DetailRow>
                <DetailLabel>User ID:</DetailLabel>
                <DetailValue>{selectedUser._id}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Phone Number:</DetailLabel>
                <DetailValue>{selectedUser.phonenumber}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Role:</DetailLabel>
                <DetailValue>{selectedUser.role}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Status:</DetailLabel>
                <DetailValue>
                  <StatusBadge status={selectedUser.status}>{selectedUser.status}</StatusBadge>
                </DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>OTP Verified:</DetailLabel>
                <DetailValue>
                  <StatusBadge status={selectedUser.isOtpVerified ? 'verified' : 'unverified'}>
                    {selectedUser.isOtpVerified ? 'Yes' : 'No'}
                  </StatusBadge>
                </DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Created At:</DetailLabel>
                <DetailValue>{new Date(selectedUser.createdAt).toLocaleString()}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Last Login:</DetailLabel>
                <DetailValue>
                  {selectedUser.lastLoginAt 
                    ? new Date(selectedUser.lastLoginAt).toLocaleString() 
                    : 'Never logged in'}
                </DetailValue>
              </DetailRow>
            </>
          )}
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default UserManagementEnhanced;
