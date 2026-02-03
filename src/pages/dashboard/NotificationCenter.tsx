import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { 
  FiBell, 
  FiSearch, 
  FiDownload, 
  FiEye, 
  FiRefreshCw,
  FiMail,
  FiMessageSquare,
  FiSmartphone,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiAlertCircle
} from 'react-icons/fi';
import { notificationApi, handleApiError } from '../../services/api';
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
      case 'delivered': return '#d4edda';
      case 'pending': return '#fff3cd';
      case 'failed': return '#f8d7da';
      case 'sent': return '#d1ecf1';
      default: return '#e2e3e5';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'delivered': return '#155724';
      case 'pending': return '#856404';
      case 'failed': return '#721c24';
      case 'sent': return '#0c5460';
      default: return '#383d41';
    }
  }};
`;

const ChannelBadge = styled.span<{ channel: string }>`
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: ${props => {
    switch (props.channel) {
      case 'sms': return '#e3f2fd';
      case 'email': return '#f3e5f5';
      case 'push': return '#e8f5e9';
      default: return '#f5f5f5';
    }
  }};
  color: ${props => {
    switch (props.channel) {
      case 'sms': return '#1565c0';
      case 'email': return '#6a1b9a';
      case 'push': return '#2e7d32';
      default: return '#616161';
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

const MessageContent = styled.div`
  background: #f8f9fa;
  padding: 16px;
  border-radius: 8px;
  margin-top: 12px;
  white-space: pre-wrap;
  word-break: break-word;
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

interface Notification {
  _id: string;
  notification_id: string;
  recipient: string;
  channel: 'sms' | 'email' | 'push';
  status: 'pending' | 'sent' | 'delivered' | 'failed';
  subject?: string;
  message: string;
  template_id?: string;
  sent_at?: string;
  delivered_at?: string;
  failed_reason?: string;
  metadata?: any;
  created_at: string;
}

interface NotificationStats {
  totalSent: number;
  delivered: number;
  failed: number;
  pending: number;
  deliveryRate: number;
}

const NotificationCenter: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [stats, setStats] = useState<NotificationStats>({
    totalSent: 0,
    delivered: 0,
    failed: 0,
    pending: 0,
    deliveryRate: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [channelFilter, setChannelFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(20);

  useEffect(() => {
    loadNotifications();
    loadStats();
  }, [currentPage, statusFilter, channelFilter, dateFilter, searchQuery]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      setError(null);

      const params: any = {
        page: currentPage,
        limit: itemsPerPage,
      };

      if (statusFilter !== 'all') params.status = statusFilter;
      if (channelFilter !== 'all') params.channel = channelFilter;
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

      const response = await notificationApi.get('/notifications', { params });
      
      setNotifications(response.data.notifications || response.data || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (err: any) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const statsData = await monitoringApi.notification.getNotificationStats();
      setStats({
        totalSent: statsData.totalSent || 0,
        delivered: statsData.delivered || 0,
        failed: statsData.failed || 0,
        pending: statsData.pending || 0,
        deliveryRate: statsData.deliveryRate || 0,
      });
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  };

  const handleViewNotification = (notification: Notification) => {
    setSelectedNotification(notification);
    setModalOpen(true);
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'sms': return <FiMessageSquare />;
      case 'email': return <FiMail />;
      case 'push': return <FiSmartphone />;
      default: return <FiBell />;
    }
  };

  const handleExport = () => {
    const csv = [
      ['Notification ID', 'Recipient', 'Channel', 'Status', 'Subject', 'Sent At', 'Delivered At'],
      ...notifications.map(n => [
        n.notification_id,
        n.recipient,
        n.channel,
        n.status,
        n.subject || 'N/A',
        n.sent_at ? new Date(n.sent_at).toLocaleString() : 'N/A',
        n.delivered_at ? new Date(n.delivered_at).toLocaleString() : 'N/A'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `notifications-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (loading && notifications.length === 0) {
    return <LoadingMessage>Loading notifications...</LoadingMessage>;
  }

  return (
    <Container>
      <PageHeader>
        <PageTitle>
          <FiBell />
          Notification Center
        </PageTitle>
        <HeaderActions>
          <Button onClick={loadNotifications} disabled={loading}>
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
          <StatValue>{stats.totalSent.toLocaleString()}</StatValue>
          <StatLabel>
            <FiBell />
            Total Sent
          </StatLabel>
        </StatCard>
        <StatCard gradient="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)">
          <StatValue>{stats.delivered.toLocaleString()}</StatValue>
          <StatLabel>
            <FiCheckCircle />
            Delivered
          </StatLabel>
        </StatCard>
        <StatCard gradient="linear-gradient(135deg, #fa709a 0%, #fee140 100%)">
          <StatValue>{stats.failed.toLocaleString()}</StatValue>
          <StatLabel>
            <FiXCircle />
            Failed
          </StatLabel>
        </StatCard>
        <StatCard gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)">
          <StatValue>{stats.deliveryRate.toFixed(1)}%</StatValue>
          <StatLabel>
            <FiCheckCircle />
            Delivery Rate
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
                placeholder="Search by recipient or notification ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </SearchBar>
          </FilterGroup>

          <FilterGroup>
            <Label>Status</Label>
            <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">All Status</option>
              <option value="delivered">Delivered</option>
              <option value="sent">Sent</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </Select>
          </FilterGroup>

          <FilterGroup>
            <Label>Channel</Label>
            <Select value={channelFilter} onChange={(e) => setChannelFilter(e.target.value)}>
              <option value="all">All Channels</option>
              <option value="sms">SMS</option>
              <option value="email">Email</option>
              <option value="push">Push Notification</option>
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
              <Th>Notification ID</Th>
              <Th>Recipient</Th>
              <Th>Channel</Th>
              <Th>Status</Th>
              <Th>Subject</Th>
              <Th>Sent At</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {notifications.map((notification) => (
              <Tr key={notification._id}>
                <Td>{notification.notification_id}</Td>
                <Td>{notification.recipient}</Td>
                <Td>
                  <ChannelBadge channel={notification.channel}>
                    {getChannelIcon(notification.channel)}
                    {notification.channel.toUpperCase()}
                  </ChannelBadge>
                </Td>
                <Td>
                  <StatusBadge status={notification.status}>
                    {notification.status}
                  </StatusBadge>
                </Td>
                <Td>{notification.subject || 'N/A'}</Td>
                <Td>
                  {notification.sent_at 
                    ? new Date(notification.sent_at).toLocaleString()
                    : 'Not sent'}
                </Td>
                <Td>
                  <ActionButtons>
                    <IconButton onClick={() => handleViewNotification(notification)} title="View Details">
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
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, stats.totalSent)} notifications
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
            <ModalTitle>Notification Details</ModalTitle>
            <CloseButton onClick={() => setModalOpen(false)}>×</CloseButton>
          </ModalHeader>
          {selectedNotification && (
            <>
              <DetailSection>
                <DetailSectionTitle>
                  <FiBell />
                  Notification Information
                </DetailSectionTitle>
                <DetailRow>
                  <DetailLabel>Notification ID:</DetailLabel>
                  <DetailValue>{selectedNotification.notification_id}</DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>Recipient:</DetailLabel>
                  <DetailValue>{selectedNotification.recipient}</DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>Channel:</DetailLabel>
                  <DetailValue>
                    <ChannelBadge channel={selectedNotification.channel}>
                      {getChannelIcon(selectedNotification.channel)}
                      {selectedNotification.channel.toUpperCase()}
                    </ChannelBadge>
                  </DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>Status:</DetailLabel>
                  <DetailValue>
                    <StatusBadge status={selectedNotification.status}>
                      {selectedNotification.status}
                    </StatusBadge>
                  </DetailValue>
                </DetailRow>
                {selectedNotification.subject && (
                  <DetailRow>
                    <DetailLabel>Subject:</DetailLabel>
                    <DetailValue>{selectedNotification.subject}</DetailValue>
                  </DetailRow>
                )}
              </DetailSection>

              <DetailSection>
                <DetailSectionTitle>Message Content</DetailSectionTitle>
                <MessageContent>{selectedNotification.message}</MessageContent>
              </DetailSection>

              <DetailSection>
                <DetailSectionTitle>
                  <FiClock />
                  Timeline
                </DetailSectionTitle>
                <DetailRow>
                  <DetailLabel>Created:</DetailLabel>
                  <DetailValue>{new Date(selectedNotification.created_at).toLocaleString()}</DetailValue>
                </DetailRow>
                {selectedNotification.sent_at && (
                  <DetailRow>
                    <DetailLabel>Sent:</DetailLabel>
                    <DetailValue>{new Date(selectedNotification.sent_at).toLocaleString()}</DetailValue>
                  </DetailRow>
                )}
                {selectedNotification.delivered_at && (
                  <DetailRow>
                    <DetailLabel>Delivered:</DetailLabel>
                    <DetailValue>{new Date(selectedNotification.delivered_at).toLocaleString()}</DetailValue>
                  </DetailRow>
                )}
              </DetailSection>

              {selectedNotification.failed_reason && (
                <DetailSection>
                  <DetailSectionTitle>
                    <FiAlertCircle />
                    Failure Information
                  </DetailSectionTitle>
                  <DetailRow>
                    <DetailLabel>Reason:</DetailLabel>
                    <DetailValue>{selectedNotification.failed_reason}</DetailValue>
                  </DetailRow>
                </DetailSection>
              )}
            </>
          )}
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default NotificationCenter;
