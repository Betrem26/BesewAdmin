import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  FiDollarSign,
  FiDownload,
  FiRefreshCw,
  FiAlertCircle,
  FiCheckCircle,
  FiClock,
  FiX,
  FiFilter,
  FiEye,
  FiEdit2,
  FiTrendingUp,
  FiBarChart2,
} from 'react-icons/fi';
import { commissionApi, handleApiError } from '../../services/api';
import monitoringApi from '../../services/monitoringApi';

const Container = styled.div`
  max-width: 1800px;
  margin: 0 auto;
  padding: 0;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  padding: 0 24px;
  flex-wrap: wrap;
  gap: 16px;
`;

const PageTitle = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #1a202c;
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0;
  
  svg {
    color: #10b981;
  }
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' | 'success' }>`
  background: ${props => {
    switch (props.variant) {
      case 'primary': return '#3498db';
      case 'success': return '#10b981';
      case 'danger': return '#e74c3c';
      default: return '#ecf0f1';
    }
  }};
  color: ${props => props.variant === 'secondary' ? '#2c3e50' : 'white'};
  border: none;
  padding: 10px 18px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
    background: ${props => {
      switch (props.variant) {
        case 'primary': return '#2980b9';
        case 'success': return '#059669';
        case 'danger': return '#c0392b';
        default: return '#d5dbdb';
      }
    }};
  }

  &:disabled {
    background: #95a5a6;
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const StatsBar = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
  padding: 0 24px;
`;

const StatCard = styled.div<{ $gradient?: string }>`
  background: ${props => props.$gradient || 'white'};
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  color: ${props => props.$gradient ? 'white' : '#2c3e50'};
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid ${props => props.$gradient ? 'transparent' : '#ecf0f1'};

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  }

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 200px;
    height: 200px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    pointer-events: none;
  }
`;

const StatValue = styled.div`
  font-size: 36px;
  font-weight: 800;
  margin-bottom: 12px;
  position: relative;
  z-index: 1;
`;

const StatLabel = styled.div`
  font-size: 13px;
  opacity: 0.9;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
  z-index: 1;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const FiltersCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  margin-left: 24px;
  margin-right: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border: 1px solid #ecf0f1;
`;

const FiltersHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const FiltersTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: #1a202c;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const FilterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FilterLabel = styled.label`
  font-size: 13px;
  font-weight: 600;
  color: #2c3e50;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const FilterInput = styled.input`
  padding: 10px 14px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s;
  background: #f8f9fa;

  &:focus {
    outline: none;
    border-color: #10b981;
    background: white;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  }
`;

const FilterSelect = styled.select`
  padding: 10px 14px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  background: #f8f9fa;
  cursor: pointer;
  transition: all 0.2s;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 20px;
  padding-right: 36px;

  &:focus {
    outline: none;
    border-color: #10b981;
    background-color: white;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  }
`;

const ClearFiltersBtn = styled.button`
  background: none;
  border: 1px solid #ddd;
  padding: 8px 14px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  color: #7f8c8d;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;

  &:hover {
    border-color: #e74c3c;
    color: #e74c3c;
    background: #ffe5e5;
  }
`;

const TableCard = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border: 1px solid #ecf0f1;
  margin: 0 24px 24px 24px;
`;

const TableWrapper = styled.div`
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  background: #f8f9fa;
  padding: 16px;
  text-align: left;
  font-size: 13px;
  font-weight: 700;
  color: #2c3e50;
  border-bottom: 2px solid #ecf0f1;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
`;

const Tr = styled.tr`
  border-bottom: 1px solid #ecf0f1;
  transition: all 0.2s;

  &:hover {
    background: #f8f9fa;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const Td = styled.td`
  padding: 16px;
  font-size: 14px;
  color: #2c3e50;
`;

const StatusBadge = styled.span<{ status: string }>`
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  text-transform: capitalize;
  background: ${props => {
    switch (props.status) {
      case 'completed': return '#d4edda';
      case 'pending': return '#fff3cd';
      case 'processing': return '#d1ecf1';
      case 'failed': return '#f8d7da';
      case 'refunded': return '#e2e3e5';
      default: return '#d1ecf1';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'completed': return '#155724';
      case 'pending': return '#856404';
      case 'processing': return '#0c5460';
      case 'failed': return '#721c24';
      case 'refunded': return '#383d41';
      default: return '#0c5460';
    }
  }};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  color: #7f8c8d;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;

  &:hover {
    color: #10b981;
    background: #ecfdf5;
  }

  &:active {
    transform: scale(0.95);
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-top: 1px solid #ecf0f1;
  background: #f8f9fa;
`;

const PageInfo = styled.div`
  font-size: 14px;
  color: #7f8c8d;
  font-weight: 500;
`;

const PageButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const PageButton = styled.button<{ active?: boolean }>`
  padding: 8px 12px;
  border: 1px solid ${props => props.active ? '#10b981' : '#ddd'};
  background: ${props => props.active ? '#10b981' : 'white'};
  color: ${props => props.active ? 'white' : '#2c3e50'};
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: ${props => props.active ? '#059669' : '#f8f9fa'};
    border-color: #10b981;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60px 20px;
  color: #7f8c8d;
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 40px;
  height: 40px;
  border: 4px solid #ecf0f1;
  border-top-color: #10b981;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #7f8c8d;
  text-align: center;
`;

const EmptyStateIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
`;

const EmptyStateText = styled.p`
  font-size: 16px;
  margin: 0;
  color: #2c3e50;
`;

const ErrorAlert = styled.div`
  background: #ffe5e5;
  border: 1px solid #f5c6cb;
  border-radius: 8px;
  padding: 16px;
  margin: 0 24px 24px 24px;
  display: flex;
  align-items: center;
  gap: 12px;
  color: #721c24;
  font-size: 14px;
`;

const Thead = styled.thead`
  background: #f8f9fa;
`;

const Tbody = styled.tbody``;

interface Commission {
  commissionId: string;
  transactionType: string;
  transactionAmount: number;
  commissionRate: number;
  commissionAmount: number;
  netAmount: number;
  currency: string;
  status: string;
  calculatedAt: string;
  projectId?: string;
  orderId?: string;
  clientPartyId?: string;
  freelancerPartyId?: string;
}

interface CommissionStats {
  totalCommissions: number;
  totalAmount: number;
  averageCommissionRate: number;
  pendingAmount: number;
  completedAmount: number;
}

const CommissionManagement: React.FC = () => {
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [stats, setStats] = useState<CommissionStats>({
    totalCommissions: 0,
    totalAmount: 0,
    averageCommissionRate: 0,
    pendingAmount: 0,
    completedAmount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);

  useEffect(() => {
    loadCommissions();
    loadStats();
  }, []);

  // Apply filters
  const filteredCommissions = commissions.filter(commission => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = !searchQuery ||
      commission.commissionId.toLowerCase().includes(searchLower) ||
      commission.projectId?.toLowerCase().includes(searchLower) ||
      commission.orderId?.toLowerCase().includes(searchLower);

    const matchesStatus = statusFilter === 'all' || commission.status === statusFilter;
    const matchesType = typeFilter === 'all' || commission.transactionType === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const totalPages = Math.ceil(filteredCommissions.length / itemsPerPage);
  const paginatedCommissions = filteredCommissions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const loadCommissions = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch commissions from API
      const response = await commissionApi.get('/commission/orders/search');
      console.log('[CommissionManagement] API Response:', response.data);

      let commissionsData: Commission[] = [];

      if (Array.isArray(response.data)) {
        commissionsData = response.data;
      } else if (response.data?.items && Array.isArray(response.data.items)) {
        commissionsData = response.data.items;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        commissionsData = response.data.data;
      }

      console.log('[CommissionManagement] Loaded commissions count:', commissionsData.length);
      setCommissions(commissionsData);
    } catch (err: any) {
      console.error('Error loading commissions:', err);

      if (err.response?.status === 403) {
        const details = err.response?.data?.details;
        const message = details?.message || 'Access Denied';
        setError(message);
      } else {
        setError(handleApiError(err));
      }

      setCommissions([]);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const statsData = await monitoringApi.commission.getCommissionStats();
      setStats({
        totalCommissions: statsData.totalCommissions || 0,
        totalAmount: statsData.totalAmount || 0,
        averageCommissionRate: statsData.averageCommissionRate || 0,
        pendingAmount: statsData.pendingAmount || 0,
        completedAmount: statsData.completedAmount || 0,
      });
    } catch (err) {
      console.error('Failed to load commission stats:', err);
    }
  };

  const handleExport = () => {
    const csv = [
      ['Commission ID', 'Type', 'Amount', 'Commission Rate', 'Commission', 'Net Amount', 'Status', 'Date'],
      ...paginatedCommissions.map(c => [
        c.commissionId,
        c.transactionType,
        c.transactionAmount,
        c.commissionRate,
        c.commissionAmount,
        c.netAmount,
        c.status,
        new Date(c.calculatedAt).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `commissions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (loading && commissions.length === 0) {
    return (
      <Container>
        <LoadingContainer>
          <LoadingSpinner />
          <div style={{ marginLeft: '16px' }}>Loading commissions...</div>
        </LoadingContainer>
      </Container>
    );
  }

  return (
    <Container>
      <PageHeader>
        <PageTitle>
          <FiDollarSign />
          Commission Management
        </PageTitle>
        <HeaderActions>
          <Button onClick={loadCommissions} disabled={loading}>
            <FiRefreshCw />
            Refresh
          </Button>
          <Button onClick={handleExport}>
            <FiDownload />
            Export
          </Button>
        </HeaderActions>
      </PageHeader>

      {error && (
        <ErrorAlert>
          <FiAlertCircle size={18} />
          <div>{error}</div>
        </ErrorAlert>
      )}

      <StatsBar>
        <StatCard $gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)">
          <StatValue>{stats.totalCommissions.toLocaleString()}</StatValue>
          <StatLabel>
            <FiBarChart2 />
            Total Commissions
          </StatLabel>
        </StatCard>
        <StatCard $gradient="linear-gradient(135deg, #10b981 0%, #059669 100%)">
          <StatValue>${stats.totalAmount.toLocaleString()}</StatValue>
          <StatLabel>
            <FiDollarSign />
            Total Amount
          </StatLabel>
        </StatCard>
        <StatCard $gradient="linear-gradient(135deg, #f59e0b 0%, #d97706 100%)">
          <StatValue>{stats.averageCommissionRate.toFixed(1)}%</StatValue>
          <StatLabel>
            <FiTrendingUp />
            Avg Commission Rate
          </StatLabel>
        </StatCard>
        <StatCard $gradient="linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)">
          <StatValue>${stats.completedAmount.toLocaleString()}</StatValue>
          <StatLabel>
            <FiCheckCircle />
            Completed Amount
          </StatLabel>
        </StatCard>
      </StatsBar>

      <FiltersCard>
        <FiltersHeader>
          <FiltersTitle>
            <FiFilter size={18} />
            Filters & Search
          </FiltersTitle>
          {(searchQuery || statusFilter !== 'all' || typeFilter !== 'all') && (
            <ClearFiltersBtn onClick={() => {
              setSearchQuery('');
              setStatusFilter('all');
              setTypeFilter('all');
              setCurrentPage(1);
            }}>
              <FiX size={14} />
              Clear Filters
            </ClearFiltersBtn>
          )}
        </FiltersHeader>
        <FilterGrid>
          <FilterGroup>
            <FilterLabel>Search</FilterLabel>
            <FilterInput
              type="text"
              placeholder="Search by ID or project..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Status</FilterLabel>
            <FilterSelect value={statusFilter} onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}>
              <option value="all">All Status</option>
              <option value="calculated">Calculated</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </FilterSelect>
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Type</FilterLabel>
            <FilterSelect value={typeFilter} onChange={(e) => {
              setTypeFilter(e.target.value);
              setCurrentPage(1);
            }}>
              <option value="all">All Types</option>
              <option value="freelancer-project">Freelancer Project</option>
              <option value="subscription">Subscription</option>
              <option value="commission-payout">Commission Payout</option>
              <option value="escrow-deposit">Escrow Deposit</option>
            </FilterSelect>
          </FilterGroup>
        </FilterGrid>
      </FiltersCard>

      <TableCard>
        {commissions.length === 0 && !loading ? (
          <EmptyState>
            <EmptyStateIcon>
              <FiDollarSign size={48} />
            </EmptyStateIcon>
            <EmptyStateText>
              No commissions available yet.
            </EmptyStateText>
          </EmptyState>
        ) : filteredCommissions.length === 0 && !loading ? (
          <EmptyState>
            <EmptyStateIcon>
              <FiDollarSign size={48} />
            </EmptyStateIcon>
            <EmptyStateText>
              No commissions found. Try adjusting your filters.
            </EmptyStateText>
          </EmptyState>
        ) : (
          <>
            <TableWrapper>
              <Table>
                <Thead>
                  <Tr>
                    <Th>Commission ID</Th>
                    <Th>Type</Th>
                    <Th>Amount</Th>
                    <Th>Commission Rate</Th>
                    <Th>Commission</Th>
                    <Th>Net Amount</Th>
                    <Th>Status</Th>
                    <Th>Date</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {paginatedCommissions.map((commission) => (
                    <Tr key={commission.commissionId}>
                      <Td>{commission.commissionId}</Td>
                      <Td>{commission.transactionType}</Td>
                      <Td>${commission.transactionAmount.toLocaleString()}</Td>
                      <Td>{commission.commissionRate}%</Td>
                      <Td>${commission.commissionAmount.toLocaleString()}</Td>
                      <Td>${commission.netAmount.toLocaleString()}</Td>
                      <Td>
                        <StatusBadge status={commission.status}>
                          {commission.status === 'completed' && <FiCheckCircle size={12} />}
                          {commission.status === 'pending' && <FiClock size={12} />}
                          {commission.status === 'failed' && <FiX size={12} />}
                          {commission.status}
                        </StatusBadge>
                      </Td>
                      <Td>{new Date(commission.calculatedAt).toLocaleDateString()}</Td>
                      <Td>
                        <ActionButtons>
                          <IconButton title="View Details">
                            <FiEye size={16} />
                          </IconButton>
                          <IconButton title="Edit">
                            <FiEdit2 size={16} />
                          </IconButton>
                        </ActionButtons>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableWrapper>

            <Pagination>
              <PageInfo>
                Showing {filteredCommissions.length === 0 ? 0 : ((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredCommissions.length)} of {filteredCommissions.length} commissions
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
          </>
        )}
      </TableCard>
    </Container>
  );
};

export default CommissionManagement;
