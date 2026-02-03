import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { 
  FiActivity, 
  FiSearch, 
  FiDownload, 
  FiRefreshCw,
  FiUser,
  FiShield,
  FiAlertTriangle,
  FiClock
} from 'react-icons/fi';
import { handleApiError } from '../../services/api';

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

const TimelineCard = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;
`;

const Timeline = styled.div`
  padding: 24px;
`;

const TimelineItem = styled.div`
  display: flex;
  gap: 16px;
  padding: 16px 0;
  border-bottom: 1px solid #ecf0f1;
  position: relative;

  &:last-child {
    border-bottom: none;
  }

  &:not(:last-child)::after {
    content: '';
    position: absolute;
    left: 19px;
    top: 50px;
    bottom: -16px;
    width: 2px;
    background: #ecf0f1;
  }
`;

const TimelineIcon = styled.div<{ type: string }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: ${props => {
    switch (props.type) {
      case 'user': return '#e3f2fd';
      case 'admin': return '#f3e5f5';
      case 'security': return '#ffebee';
      case 'system': return '#e8f5e9';
      default: return '#f5f5f5';
    }
  }};
  color: ${props => {
    switch (props.type) {
      case 'user': return '#1565c0';
      case 'admin': return '#6a1b9a';
      case 'security': return '#c62828';
      case 'system': return '#2e7d32';
      default: return '#616161';
    }
  }};
  z-index: 1;
`;

const TimelineContent = styled.div`
  flex: 1;
`;

const TimelineHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 8px;
`;

const TimelineTitle = styled.div`
  font-weight: 600;
  color: #2c3e50;
  font-size: 15px;
`;

const TimelineTime = styled.div`
  font-size: 13px;
  color: #7f8c8d;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const TimelineDescription = styled.div`
  font-size: 14px;
  color: #7f8c8d;
  margin-bottom: 8px;
`;

const TimelineMetadata = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
`;

const MetadataTag = styled.span`
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  background: #f8f9fa;
  color: #495057;
`;

const StatusBadge = styled.span<{ status: string }>`
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  background: ${props => {
    switch (props.status) {
      case 'success': return '#d4edda';
      case 'warning': return '#fff3cd';
      case 'error': return '#f8d7da';
      case 'info': return '#d1ecf1';
      default: return '#e2e3e5';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'success': return '#155724';
      case 'warning': return '#856404';
      case 'error': return '#721c24';
      case 'info': return '#0c5460';
      default: return '#383d41';
    }
  }};
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

const EmptyState = styled.div`
  text-align: center;
  padding: 60px;
  color: #7f8c8d;
`;

interface AuditLog {
  _id: string;
  log_id: string;
  event_type: 'user_action' | 'admin_action' | 'security_event' | 'system_event';
  action: string;
  actor_id: string;
  actor_name?: string;
  actor_role?: string;
  target_id?: string;
  target_type?: string;
  status: 'success' | 'warning' | 'error' | 'info';
  ip_address?: string;
  user_agent?: string;
  metadata?: any;
  created_at: string;
}

interface AuditStats {
  totalEvents: number;
  userActions: number;
  adminActions: number;
  securityEvents: number;
  systemEvents: number;
}

const AuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [stats, setStats] = useState<AuditStats>({
    totalEvents: 0,
    userActions: 0,
    adminActions: 0,
    securityEvents: 0,
    systemEvents: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [eventTypeFilter, setEventTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(20);

  useEffect(() => {
    loadLogs();
    loadStats();
  }, [currentPage, eventTypeFilter, statusFilter, dateFilter, searchQuery]);

  const loadLogs = async () => {
    try {
      setLoading(true);
      setError(null);

      const params: any = {
        page: currentPage,
        limit: itemsPerPage,
      };

      if (eventTypeFilter !== 'all') params.event_type = eventTypeFilter;
      if (statusFilter !== 'all') params.status = statusFilter;
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

      // Mock data for now - replace with actual API call when endpoint is available
      const mockLogs: AuditLog[] = [
        {
          _id: '1',
          log_id: 'LOG-001',
          event_type: 'admin_action',
          action: 'User Status Updated',
          actor_id: 'admin-123',
          actor_name: 'Admin User',
          actor_role: 'admin',
          target_id: 'user-456',
          target_type: 'user',
          status: 'success',
          ip_address: '192.168.1.1',
          metadata: { previous_status: 'active', new_status: 'suspended' },
          created_at: new Date().toISOString(),
        },
        {
          _id: '2',
          log_id: 'LOG-002',
          event_type: 'security_event',
          action: 'Failed Login Attempt',
          actor_id: 'user-789',
          actor_name: 'Unknown User',
          status: 'warning',
          ip_address: '10.0.0.1',
          metadata: { attempts: 3, reason: 'Invalid credentials' },
          created_at: new Date(Date.now() - 3600000).toISOString(),
        },
        {
          _id: '3',
          log_id: 'LOG-003',
          event_type: 'user_action',
          action: 'Profile Updated',
          actor_id: 'user-101',
          actor_name: 'John Doe',
          actor_role: 'user',
          status: 'success',
          ip_address: '172.16.0.1',
          created_at: new Date(Date.now() - 7200000).toISOString(),
        },
      ];

      setLogs(mockLogs);
      setTotalPages(1);
    } catch (err: any) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      // Mock stats - replace with actual API call
      setStats({
        totalEvents: 1247,
        userActions: 856,
        adminActions: 234,
        securityEvents: 89,
        systemEvents: 68,
      });
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  };

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'user_action': return <FiUser />;
      case 'admin_action': return <FiShield />;
      case 'security_event': return <FiAlertTriangle />;
      case 'system_event': return <FiActivity />;
      default: return <FiActivity />;
    }
  };

  const handleExport = () => {
    const csv = [
      ['Log ID', 'Event Type', 'Action', 'Actor', 'Status', 'IP Address', 'Timestamp'],
      ...logs.map(log => [
        log.log_id,
        log.event_type,
        log.action,
        log.actor_name || log.actor_id,
        log.status,
        log.ip_address || 'N/A',
        new Date(log.created_at).toLocaleString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (loading && logs.length === 0) {
    return <LoadingMessage>Loading audit logs...</LoadingMessage>;
  }

  return (
    <Container>
      <PageHeader>
        <PageTitle>
          <FiActivity />
          Audit Logs & Activity Timeline
        </PageTitle>
        <HeaderActions>
          <Button onClick={loadLogs} disabled={loading}>
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
          <StatValue>{stats.totalEvents.toLocaleString()}</StatValue>
          <StatLabel>
            <FiActivity />
            Total Events
          </StatLabel>
        </StatCard>
        <StatCard gradient="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)">
          <StatValue>{stats.userActions.toLocaleString()}</StatValue>
          <StatLabel>
            <FiUser />
            User Actions
          </StatLabel>
        </StatCard>
        <StatCard gradient="linear-gradient(135deg, #fa709a 0%, #fee140 100%)">
          <StatValue>{stats.adminActions.toLocaleString()}</StatValue>
          <StatLabel>
            <FiShield />
            Admin Actions
          </StatLabel>
        </StatCard>
        <StatCard gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)">
          <StatValue>{stats.securityEvents.toLocaleString()}</StatValue>
          <StatLabel>
            <FiAlertTriangle />
            Security Events
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
                placeholder="Search by action, actor, or log ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </SearchBar>
          </FilterGroup>

          <FilterGroup>
            <Label>Event Type</Label>
            <Select value={eventTypeFilter} onChange={(e) => setEventTypeFilter(e.target.value)}>
              <option value="all">All Events</option>
              <option value="user_action">User Actions</option>
              <option value="admin_action">Admin Actions</option>
              <option value="security_event">Security Events</option>
              <option value="system_event">System Events</option>
            </Select>
          </FilterGroup>

          <FilterGroup>
            <Label>Status</Label>
            <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">All Status</option>
              <option value="success">Success</option>
              <option value="warning">Warning</option>
              <option value="error">Error</option>
              <option value="info">Info</option>
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

      <TimelineCard>
        <Timeline>
          {logs.length === 0 ? (
            <EmptyState>No audit logs found matching your filters</EmptyState>
          ) : (
            logs.map((log) => (
              <TimelineItem key={log._id}>
                <TimelineIcon type={log.event_type}>
                  {getEventIcon(log.event_type)}
                </TimelineIcon>
                <TimelineContent>
                  <TimelineHeader>
                    <TimelineTitle>{log.action}</TimelineTitle>
                    <TimelineTime>
                      <FiClock />
                      {new Date(log.created_at).toLocaleString()}
                    </TimelineTime>
                  </TimelineHeader>
                  <TimelineDescription>
                    {log.actor_name || log.actor_id} 
                    {log.actor_role && ` (${log.actor_role})`}
                    {log.target_type && ` performed action on ${log.target_type}`}
                  </TimelineDescription>
                  <TimelineMetadata>
                    <StatusBadge status={log.status}>{log.status}</StatusBadge>
                    {log.ip_address && <MetadataTag>IP: {log.ip_address}</MetadataTag>}
                    {log.log_id && <MetadataTag>ID: {log.log_id}</MetadataTag>}
                    {log.metadata && Object.keys(log.metadata).length > 0 && (
                      <MetadataTag>
                        {Object.keys(log.metadata).length} metadata fields
                      </MetadataTag>
                    )}
                  </TimelineMetadata>
                </TimelineContent>
              </TimelineItem>
            ))
          )}
        </Timeline>

        <Pagination>
          <PageInfo>
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, stats.totalEvents)} events
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
      </TimelineCard>
    </Container>
  );
};

export default AuditLogs;
