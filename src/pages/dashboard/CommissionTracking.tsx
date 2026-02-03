import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { 
  FiDollarSign, 
  FiSearch, 
  FiDownload, 
  FiEye, 
  FiRefreshCw,
  FiTrendingUp,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiAlertCircle,
  FiCreditCard
} from 'react-icons/fi';
import { commissionApi, handleApiError } from '../../services/api';
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

const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'success' | 'danger' }>`
  background: ${props => {
    switch (props.variant) {
      case 'primary': return '#3498db';
      case 'success': return '#27ae60';
      case 'danger': return '#e74c3c';
      default: return '#ecf0f1';
    }
  }};
  color: ${props => props.variant && props.variant !== 'secondary' ? 'white' : '#2c3e50'};
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
    opacity: 0.9;
  }

  &:disabled {
    background: #95a5a6;
    cursor: not-allowed;
  }
`;

const StatsBar = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const StatCard = styled.div<{ gradient?: string }>`
  background: ${props => props.gradient || 'white'};
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  color: ${props => props.gradient ? 'white' : '#2c3e50'};
`;

const StatValue = styled.div`
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 8px;
`;

const StatLabel = styled.div`
  font-size: 13px;
  opacity: 0.9;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
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
      case 'completed': return '#d4edda';
      case 'pending': return '#fff3cd';
      case 'failed': return '#f8d7da';
      case 'processing': return '#d1ecf1';
      default: return '#e2e3e5';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'completed': return '#155724';
      case 'pending': return '#856404';
      case 'failed': return '#721c24';
      case 'processing': return '#0c5460';
      default: return '#383d41';
    }
  }};
`;

const AmountText = styled.span<{ positive?: boolean }>`
  font-weight: 600;
  color: ${props => props.positive ? '#27ae60' : '#2c3e50'};
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
  overflow-y: auto;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  padding: 32px;
  max-width: 900px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  margin: 20px;
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

const DetailSection = styled.div`
  margin-bottom: 24px;
`;

const DetailSectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
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
  text-align: right;
  max-width: 60%;
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

interface Transaction {
  _id: string;
  transaction_id: string;
  amount: number;
  currency: string;
  status: string;
  payment_method: string;
  commission_rate: number;
  commission_amount: number;
  user_id: string;
  user_name?: string;
  job_id?: string;
  job_title?: string;
  created_at: string;
  completed_at?: string;
  description?: string;
}

interface CommissionStats {
  totalRevenue: number;
  pendingCommissions: number;
  completedPayments: number;
  failedTransactions: number;
}

const CommissionTracking: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<CommissionStats>({
    totalRevenue: 0,
    pendingCommissions: 0,
    completedPayments: 0,
    failedTransactions: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(20);

  useEffect(() => {
    loadTransactions();
    loadStats();
  }, [currentPage, statusFilter, paymentMethodFilter, dateFilter, searchQuery]);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      setError(null);

      const params: any = {
        page: currentPage,
        limit: itemsPerPage,
      };

      if (statusFilter !== 'all') params.status = statusFilter;
      if (paymentMethodFilter !== 'all') params.payment_method = paymentMethodFilter;
      if (dateFilter !== 'all') {
        const now = new Date();
        if (dateFilter === 'today') {
          params.date_from = new Date(now.setHours(0, 0, 0, 0)).toISOString();
        } else if (dateFilter === 'week') {
          params.date_from = new Date(now.setDate(now.getDate() - 7)).toISOString();
        } else if (dateFilter === 'month') {
          params.date_from = new Date(now.setMonth(now.getMonth() - 1)).toISOString();
        }
      }
      if (searchQuery) params.search = searchQuery;

      const response = await commissionApi.get('/commissions', { params });
      
      setTransactions(response.data.transactions || response.data || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (err: any) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const statsData = await monitoringApi.commission.getCommissionStats();
      setStats({
        totalRevenue: statsData.totalRevenue || 0,
        pendingCommissions: statsData.pending || 0,
        completedPayments: statsData.completed || 0,
        failedTransactions: statsData.failed || 0,
      });
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  };

  const handleViewTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setModalOpen(true);
  };

  const formatCurrency = (amount: number, currency: string = 'ETB') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const handleExport = () => {
    const csv = [
      ['Transaction ID', 'Amount', 'Currency', 'Commission', 'Status', 'Payment Method', 'User', 'Job', 'Date'],
      ...transactions.map(t => [
        t.transaction_id,
        t.amount,
        t.currency,
        t.commission_amount,
        t.status,
        t.payment_method,
        t.user_name || t.user_id,
        t.job_title || t.job_id || 'N/A',
        new Date(t.created_at).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `commission-transactions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (loading && transactions.length === 0) {
    return <LoadingMessage>Loading transactions...</LoadingMessage>;
  }

  return (
    <Container>
      <PageHeader>
        <PageTitle>
          <FiDollarSign />
          Commission & Payment Tracking
        </PageTitle>
        <HeaderActions>
          <Button onClick={loadTransactions} disabled={loading}>
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
        <StatCard gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)">
          <StatValue>{formatCurrency(stats.totalRevenue)}</StatValue>
          <StatLabel>
            <FiTrendingUp />
            Total Revenue
          </StatLabel>
        </StatCard>
        <StatCard gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)">
          <StatValue>{formatCurrency(stats.pendingCommissions)}</StatValue>
          <StatLabel>
            <FiClock />
            Pending Commissions
          </StatLabel>
        </StatCard>
        <StatCard gradient="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)">
          <StatValue>{stats.completedPayments.toLocaleString()}</StatValue>
          <StatLabel>
            <FiCheckCircle />
            Completed Payments
          </StatLabel>
        </StatCard>
        <StatCard gradient="linear-gradient(135deg, #fa709a 0%, #fee140 100%)">
          <StatValue>{stats.failedTransactions.toLocaleString()}</StatValue>
          <StatLabel>
            <FiXCircle />
            Failed Transactions
          </StatLabel>
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
                placeholder="Search by transaction ID or user..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </SearchBar>
          </FilterGroup>

          <FilterGroup>
            <Label>Status</Label>
            <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="failed">Failed</option>
            </Select>
          </FilterGroup>

          <FilterGroup>
            <Label>Payment Method</Label>
            <Select value={paymentMethodFilter} onChange={(e) => setPaymentMethodFilter(e.target.value)}>
              <option value="all">All Methods</option>
              <option value="credit_card">Credit Card</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="mobile_money">Mobile Money</option>
              <option value="cash">Cash</option>
            </Select>
          </FilterGroup>

          <FilterGroup>
            <Label>Date Range</Label>
            <Select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}>
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
            </Select>
          </FilterGroup>
        </FiltersGrid>
      </FiltersCard>

      <TableCard>
        <Table>
          <Thead>
            <Tr>
              <Th>Transaction ID</Th>
              <Th>Amount</Th>
              <Th>Commission</Th>
              <Th>Status</Th>
              <Th>Payment Method</Th>
              <Th>User</Th>
              <Th>Job</Th>
              <Th>Date</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {transactions.map((transaction) => (
              <Tr key={transaction._id}>
                <Td>{transaction.transaction_id}</Td>
                <Td>
                  <AmountText positive>
                    {formatCurrency(transaction.amount, transaction.currency)}
                  </AmountText>
                </Td>
                <Td>
                  <div>{formatCurrency(transaction.commission_amount, transaction.currency)}</div>
                  <div style={{ fontSize: '12px', color: '#7f8c8d' }}>
                    ({transaction.commission_rate}%)
                  </div>
                </Td>
                <Td>
                  <StatusBadge status={transaction.status}>
                    {transaction.status}
                  </StatusBadge>
                </Td>
                <Td>{transaction.payment_method}</Td>
                <Td>{transaction.user_name || transaction.user_id}</Td>
                <Td>{transaction.job_title || transaction.job_id || 'N/A'}</Td>
                <Td>{new Date(transaction.created_at).toLocaleDateString()}</Td>
                <Td>
                  <ActionButtons>
                    <IconButton onClick={() => handleViewTransaction(transaction)} title="View Details">
                      <FiEye />
                    </IconButton>
                  </ActionButtons>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>

        <Pagination>
          <PageInfo>
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, stats.completedPayments + stats.pendingCommissions)} transactions
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
            <ModalTitle>Transaction Details</ModalTitle>
            <CloseButton onClick={() => setModalOpen(false)}>×</CloseButton>
          </ModalHeader>
          {selectedTransaction && (
            <>
              <DetailSection>
                <DetailSectionTitle>
                  <FiDollarSign />
                  Transaction Information
                </DetailSectionTitle>
                <DetailRow>
                  <DetailLabel>Transaction ID:</DetailLabel>
                  <DetailValue>{selectedTransaction.transaction_id}</DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>Amount:</DetailLabel>
                  <DetailValue>
                    <AmountText positive>
                      {formatCurrency(selectedTransaction.amount, selectedTransaction.currency)}
                    </AmountText>
                  </DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>Commission Rate:</DetailLabel>
                  <DetailValue>{selectedTransaction.commission_rate}%</DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>Commission Amount:</DetailLabel>
                  <DetailValue>
                    {formatCurrency(selectedTransaction.commission_amount, selectedTransaction.currency)}
                  </DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>Status:</DetailLabel>
                  <DetailValue>
                    <StatusBadge status={selectedTransaction.status}>
                      {selectedTransaction.status}
                    </StatusBadge>
                  </DetailValue>
                </DetailRow>
              </DetailSection>

              <DetailSection>
                <DetailSectionTitle>
                  <FiCreditCard />
                  Payment Details
                </DetailSectionTitle>
                <DetailRow>
                  <DetailLabel>Payment Method:</DetailLabel>
                  <DetailValue>{selectedTransaction.payment_method}</DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>Currency:</DetailLabel>
                  <DetailValue>{selectedTransaction.currency}</DetailValue>
                </DetailRow>
              </DetailSection>

              <DetailSection>
                <DetailSectionTitle>
                  <FiAlertCircle />
                  Related Information
                </DetailSectionTitle>
                <DetailRow>
                  <DetailLabel>User:</DetailLabel>
                  <DetailValue>{selectedTransaction.user_name || selectedTransaction.user_id}</DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>Job:</DetailLabel>
                  <DetailValue>{selectedTransaction.job_title || selectedTransaction.job_id || 'N/A'}</DetailValue>
                </DetailRow>
                {selectedTransaction.description && (
                  <DetailRow>
                    <DetailLabel>Description:</DetailLabel>
                    <DetailValue>{selectedTransaction.description}</DetailValue>
                  </DetailRow>
                )}
              </DetailSection>

              <DetailSection>
                <DetailSectionTitle>Timeline</DetailSectionTitle>
                <DetailRow>
                  <DetailLabel>Created:</DetailLabel>
                  <DetailValue>{new Date(selectedTransaction.created_at).toLocaleString()}</DetailValue>
                </DetailRow>
                {selectedTransaction.completed_at && (
                  <DetailRow>
                    <DetailLabel>Completed:</DetailLabel>
                    <DetailValue>{new Date(selectedTransaction.completed_at).toLocaleString()}</DetailValue>
                  </DetailRow>
                )}
              </DetailSection>
            </>
          )}
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default CommissionTracking;
