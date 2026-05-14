import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  FiBriefcase,
  FiDownload,
  FiEye,
  FiCheckCircle,
  FiXCircle,
  FiRefreshCw,
  FiTrendingUp,
  FiUsers,
  FiAlertCircle,
  FiFilter,
  FiX,
  FiClock,
  FiMapPin,
  FiDollarSign,
  FiBarChart2
} from 'react-icons/fi';
import { jobApi, handleApiError } from '../../services/api';
import monitoringApi from '../../services/monitoringApi';
import JobMarketOverview from '../../components/charts/JobMarketOverview';
import { useJobServiceAuth } from '../../hooks/useJobServiceAuth';

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
    color: #3498db;
  }
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  background: ${props => {
    switch (props.variant) {
      case 'primary': return '#3498db';
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

const StatCard = styled.div<{ $gradient?: string; $icon?: string }>`
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
    border-color: #3498db;
    background: white;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
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
    border-color: #3498db;
    background-color: white;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
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

const JobTitle = styled.div`
  font-weight: 600;
  color: #1a202c;
  margin-bottom: 4px;
`;

const JobMeta = styled.div`
  font-size: 12px;
  color: #7f8c8d;
  display: flex;
  align-items: center;
  gap: 8px;
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
      case 'active': return '#d4edda';
      case 'closed': return '#f8d7da';
      case 'expired': return '#fff3cd';
      case 'draft': return '#e2e3e5';
      default: return '#d1ecf1';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'active': return '#155724';
      case 'closed': return '#721c24';
      case 'expired': return '#856404';
      case 'draft': return '#383d41';
      default: return '#0c5460';
    }
  }};
`;

const MetricBadge = styled.span`
  background: #e8f4f8;
  color: #0c5460;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
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
    color: #3498db;
    background: #e8f4f8;
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
  border: 1px solid ${props => props.active ? '#3498db' : '#ddd'};
  background: ${props => props.active ? '#3498db' : 'white'};
  color: ${props => props.active ? 'white' : '#2c3e50'};
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: ${props => props.active ? '#2980b9' : '#f8f9fa'};
    border-color: #3498db;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Modal = styled.div<{ $isOpen: boolean }>`
  display: ${props => props.$isOpen ? 'flex' : 'none'};
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
  padding: 20px;
  animation: fadeIn 0.3s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  padding: 32px;
  max-width: 900px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease;

  @keyframes slideUp {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 28px;
  padding-bottom: 20px;
  border-bottom: 2px solid #ecf0f1;
`;

const ModalTitle = styled.h2`
  font-size: 26px;
  font-weight: 700;
  color: #1a202c;
  margin: 0;
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
  border-radius: 6px;
  transition: all 0.2s;

  &:hover {
    color: #e74c3c;
    background: #ffe5e5;
  }
`;

const ModalSection = styled.div`
  margin-bottom: 28px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const ModalSectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: #1a202c;
  margin: 0 0 16px 0;
  padding-bottom: 12px;
  border-bottom: 1px solid #ecf0f1;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ModalGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
`;

const ModalField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ModalFieldLabel = styled.label`
  font-size: 12px;
  font-weight: 700;
  color: #7f8c8d;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const ModalFieldValue = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: #1a202c;
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
  border-top-color: #3498db;
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

const OverviewSection = styled.div`
  background: white;
  border-radius: 12px;
  padding: 28px;
  margin: 0 24px 32px 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border: 1px solid #ecf0f1;
`;

const ConfirmModal = styled.div<{ $isOpen: boolean }>`
  display: ${props => props.$isOpen ? 'flex' : 'none'};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1001;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const ConfirmContent = styled.div`
  background: white;
  border-radius: 12px;
  padding: 32px;
  max-width: 400px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
`;

const ConfirmTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: #1a202c;
  margin: 0 0 12px 0;
`;

const ConfirmText = styled.p`
  font-size: 14px;
  color: #7f8c8d;
  margin: 0 0 24px 0;
  line-height: 1.6;
`;

const ConfirmButtons = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;

const ConfirmBtn = styled.button<{ variant?: 'danger' | 'secondary' }>`
  padding: 10px 18px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s;
  background: ${props => props.variant === 'danger' ? '#e74c3c' : '#ecf0f1'};
  color: ${props => props.variant === 'danger' ? 'white' : '#2c3e50'};

  &:hover {
    background: ${props => props.variant === 'danger' ? '#c0392b' : '#d5dbdb'};
  }
`;

interface Job {
  _id: string;
  post_id: string;
  vacancies_topost: Array<{
    vacancy_id: string;
    jobData: {
      jobTitle: string;
      jobDescription: string;
      jobLocation: { city: string; country: string };
      jobResponsibility: string[];
    };
    category: { name: string };
    skills: string[];
    salary: { minAmount: number; maxAmount: number; currency: string };
    employer: string;
    companyData: { companyName: string };
    deadline: string;
  }>;
  post_status: string;
  posted_date: string;
  posted_by_name: string;
}

interface JobStats {
  total: number;
  active: number;
  closed: number;
  expired: number;
  total_applications: number;
  avg_applications_per_job: number;
}

const JobMonitoring: React.FC = () => {
  const { isAdmin } = useJobServiceAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [stats, setStats] = useState<JobStats>({
    total: 0,
    active: 0,
    closed: 0,
    expired: 0,
    total_applications: 0,
    avg_applications_per_job: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(20);

  useEffect(() => {
    loadJobs();
    loadStats();
  }, [currentPage, statusFilter, categoryFilter, locationFilter, searchQuery]);

  const loadJobs = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await jobApi.get('/posts');
      console.log('[JobMonitoring] API Response:', response.data);

      // Map API response to Job interface
      let jobsData: Job[] = [];
      
      if (response.data?.items && Array.isArray(response.data.items)) {
        jobsData = response.data.items;
      } else if (Array.isArray(response.data)) {
        jobsData = response.data;
      }

      setJobs(jobsData);
      setTotalPages(Math.ceil((response.data?.total || jobsData.length) / itemsPerPage));
    } catch (err: any) {
      console.error('Error loading jobs:', err);
      
      // Handle 403 Forbidden with detailed error message
      if (err.response?.status === 403) {
        const details = err.response?.data?.details;
        const message = details?.message || 'Access Denied';
        setError(message);
      } else {
        setError(handleApiError(err));
      }
      
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const statsData = await monitoringApi.job.getJobStats();
      setStats({
        total: statsData.total || 0,
        active: statsData.active || 0,
        closed: statsData.closed || 0,
        expired: statsData.expired || 0,
        total_applications: statsData.total_applications || 0,
        avg_applications_per_job: statsData.avg_applications_per_job || 0,
      });
    } catch (err) {
      console.error('Failed to load stats from API:', err);
      // Fallback: Calculate stats from loaded jobs if API fails
      if (Array.isArray(jobs) && jobs.length > 0) {
        try {
          const calculatedStats = {
            total: jobs.length,
            active: jobs.filter(j => j?.status === 'active').length,
            closed: jobs.filter(j => j?.status === 'closed').length,
            expired: jobs.filter(j => j?.status === 'expired').length,
            total_applications: jobs.reduce((sum, j) => sum + (j?.applications_count || 0), 0),
            avg_applications_per_job: jobs.length > 0
              ? jobs.reduce((sum, j) => sum + (j?.applications_count || 0), 0) / jobs.length
              : 0,
          };
          setStats(calculatedStats);
          console.log('Calculated stats from jobs:', calculatedStats);
        } catch (calcErr) {
          console.error('Error calculating stats:', calcErr);
        }
      }
    }
  };

  const handleViewJob = (job: Job) => {
    setSelectedJob(job);
    setModalOpen(true);
  };

  const handleDeleteClick = (postId: string) => {
    setJobToDelete(postId);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!jobToDelete) return;
    
    try {
      setDeleting(true);
      await jobApi.delete(`/posts/${jobToDelete}`);
      setDeleteConfirmOpen(false);
      setJobToDelete(null);
      loadJobs();
    } catch (err: any) {
      const message = err.response?.data?.message || handleApiError(err);
      setError(message);
    } finally {
      setDeleting(false);
    }
  };

  const handleUpdateStatus = async (postId: string, newStatus: string) => {
    try {
      await jobApi.patch(`/posts/${postId}`, { post_status: newStatus });
      loadJobs();
    } catch (err: any) {
      const message = err.response?.data?.message || handleApiError(err);
      setError(message);
    }
  };

  const handleExport = () => {
    const csv = [
      ['Title', 'Company', 'Location', 'Category', 'Status', 'Applications', 'Views', 'Created'],
      ...jobs.map(j => [
        j.title,
        j.company,
        j.location,
        j.category,
        j.status,
        j.applications_count,
        j.views_count,
        new Date(j.created_at).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jobs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (loading && jobs.length === 0) {
    return (
      <Container>
        <LoadingContainer>
          <LoadingSpinner />
          <div style={{ marginLeft: '16px' }}>Loading job postings...</div>
        </LoadingContainer>
      </Container>
    );
  }

  return (
    <Container>
      <PageHeader>
        <PageTitle>
          <FiBriefcase />
          Job Monitoring
        </PageTitle>
        <HeaderActions>
          <Button onClick={loadJobs} disabled={loading}>
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

      {/* ── Job Market Overview (Global + Agency Stats) ── */}
      <OverviewSection>
        <JobMarketOverview />
      </OverviewSection>

      <StatsBar>
        <StatCard $gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)">
          <StatValue>{stats.total.toLocaleString()}</StatValue>
          <StatLabel>
            <FiBriefcase />
            Total Jobs
          </StatLabel>
        </StatCard>
        <StatCard $gradient="linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)">
          <StatValue>{stats.active.toLocaleString()}</StatValue>
          <StatLabel>
            <FiCheckCircle />
            Active Jobs
          </StatLabel>
        </StatCard>
        <StatCard $gradient="linear-gradient(135deg, #fa709a 0%, #fee140 100%)">
          <StatValue>{stats.total_applications.toLocaleString()}</StatValue>
          <StatLabel>
            <FiUsers />
            Total Applications
          </StatLabel>
        </StatCard>
        <StatCard $gradient="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)">
          <StatValue>{stats.avg_applications_per_job.toFixed(1)}</StatValue>
          <StatLabel>
            <FiTrendingUp />
            Avg Applications/Job
          </StatLabel>
        </StatCard>
      </StatsBar>

      <FiltersCard>
        <FiltersHeader>
          <FiltersTitle>
            <FiFilter size={18} />
            Filters & Search
          </FiltersTitle>
          {(searchQuery || statusFilter !== 'all' || categoryFilter !== 'all' || locationFilter !== 'all') && (
            <ClearFiltersBtn onClick={() => {
              setSearchQuery('');
              setStatusFilter('all');
              setCategoryFilter('all');
              setLocationFilter('all');
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
              placeholder="Search by title or company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Status</FilterLabel>
            <FilterSelect value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="closed">Closed</option>
              <option value="expired">Expired</option>
              <option value="draft">Draft</option>
            </FilterSelect>
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Category</FilterLabel>
            <FilterSelect value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
              <option value="all">All Categories</option>
              <option value="technology">Technology</option>
              <option value="finance">Finance</option>
              <option value="healthcare">Healthcare</option>
              <option value="education">Education</option>
              <option value="marketing">Marketing</option>
            </FilterSelect>
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Location</FilterLabel>
            <FilterSelect value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)}>
              <option value="all">All Locations</option>
              <option value="addis-ababa">Addis Ababa</option>
              <option value="dire-dawa">Dire Dawa</option>
              <option value="mekelle">Mekelle</option>
              <option value="bahir-dar">Bahir Dar</option>
              <option value="remote">Remote</option>
            </FilterSelect>
          </FilterGroup>
        </FilterGrid>
      </FiltersCard>

      <TableCard>
        {jobs.length === 0 && !loading ? (
          <EmptyState>
            <EmptyStateIcon>
              <FiBriefcase size={48} />
            </EmptyStateIcon>
            <EmptyStateText>
              {searchQuery || statusFilter !== 'all' || categoryFilter !== 'all' || locationFilter !== 'all'
                ? 'No jobs found. Try adjusting your filters.'
                : 'No jobs available yet. Jobs will appear here once they are posted.'}
            </EmptyStateText>
          </EmptyState>
        ) : (
          <>
            <TableWrapper>
              <Table>
                <Thead>
                  <Tr>
                    <Th>Job Title</Th>
                    <Th>Company</Th>
                    <Th>Location</Th>
                    <Th>Category</Th>
                    <Th>Status</Th>
                    <Th>Applications</Th>
                    <Th>Views</Th>
                    <Th>Posted</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {jobs.map((job) => {
                    const vacancy = job.vacancies_topost?.[0];
                    if (!vacancy) return null;
                    
                    const jobData = vacancy.jobData;
                    const salary = vacancy.salary;
                    const location = jobData.jobLocation;
                    
                    return (
                      <Tr key={job._id}>
                        <Td>
                          <JobTitle>{jobData.jobTitle}</JobTitle>
                          <JobMeta>
                            {salary?.minAmount && salary?.maxAmount && (
                              <>
                                <FiDollarSign size={12} />
                                {salary.currency} {salary.minAmount.toLocaleString()} - {salary.maxAmount.toLocaleString()}
                              </>
                            )}
                          </JobMeta>
                        </Td>
                        <Td>{vacancy.companyData?.companyName || vacancy.employer}</Td>
                        <Td>
                          <JobMeta>
                            <FiMapPin size={12} />
                            {location?.city}, {location?.country}
                          </JobMeta>
                        </Td>
                        <Td>{vacancy.category?.name}</Td>
                        <Td>
                          <StatusBadge status={job.post_status}>
                            {job.post_status === 'active' && <FiCheckCircle size={12} />}
                            {job.post_status === 'closed' && <FiXCircle size={12} />}
                            {job.post_status === 'expired' && <FiClock size={12} />}
                            {job.post_status}
                          </StatusBadge>
                        </Td>
                        <Td>
                          <MetricBadge>
                            <FiUsers size={12} style={{ marginRight: '4px' }} />
                            0
                          </MetricBadge>
                        </Td>
                        <Td>
                          <MetricBadge>
                            <FiEye size={12} style={{ marginRight: '4px' }} />
                            0
                          </MetricBadge>
                        </Td>
                        <Td>{new Date(job.posted_date).toLocaleDateString()}</Td>
                        <Td>
                          <ActionButtons>
                            <IconButton onClick={() => handleViewJob(job)} title="View Details">
                              <FiEye size={16} />
                            </IconButton>
                            <IconButton 
                              onClick={() => handleDeleteClick(job.post_id)} 
                              title="Delete Job"
                              style={{ color: '#e74c3c' }}
                            >
                              <FiXCircle size={16} />
                            </IconButton>
                          </ActionButtons>
                        </Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            </TableWrapper>

            <Pagination>
              <PageInfo>
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, stats.total)} of {stats.total} jobs
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

      <Modal $isOpen={modalOpen}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>
              <FiBriefcase style={{ marginRight: '12px' }} />
              Job Details
            </ModalTitle>
            <CloseButton onClick={() => setModalOpen(false)}>
              <FiX size={24} />
            </CloseButton>
          </ModalHeader>
          {selectedJob && selectedJob.vacancies_topost?.[0] && (
            <>
              {(() => {
                const vacancy = selectedJob.vacancies_topost[0];
                const jobData = vacancy.jobData;
                const salary = vacancy.salary;
                
                return (
                  <>
                    <ModalSection>
                      <ModalSectionTitle>
                        <FiBriefcase size={16} />
                        Basic Information
                      </ModalSectionTitle>
                      <ModalGrid>
                        <ModalField>
                          <ModalFieldLabel>Job Title</ModalFieldLabel>
                          <ModalFieldValue>{jobData.jobTitle}</ModalFieldValue>
                        </ModalField>
                        <ModalField>
                          <ModalFieldLabel>Company</ModalFieldLabel>
                          <ModalFieldValue>{vacancy.companyData?.companyName || vacancy.employer}</ModalFieldValue>
                        </ModalField>
                        <ModalField>
                          <ModalFieldLabel>Location</ModalFieldLabel>
                          <ModalFieldValue>{jobData.jobLocation?.city}, {jobData.jobLocation?.country}</ModalFieldValue>
                        </ModalField>
                        <ModalField>
                          <ModalFieldLabel>Category</ModalFieldLabel>
                          <ModalFieldValue>{vacancy.category?.name}</ModalFieldValue>
                        </ModalField>
                        <ModalField>
                          <ModalFieldLabel>Status</ModalFieldLabel>
                          <ModalFieldValue>
                            <StatusBadge status={selectedJob.post_status}>
                              {selectedJob.post_status}
                            </StatusBadge>
                          </ModalFieldValue>
                        </ModalField>
                      </ModalGrid>
                    </ModalSection>

                    <ModalSection>
                      <ModalSectionTitle>
                        <FiDollarSign size={16} />
                        Salary & Compensation
                      </ModalSectionTitle>
                      <ModalGrid>
                        <ModalField>
                          <ModalFieldLabel>Salary Range</ModalFieldLabel>
                          <ModalFieldValue>
                            {salary?.minAmount && salary?.maxAmount
                              ? `${salary.currency} ${salary.minAmount.toLocaleString()} - ${salary.maxAmount.toLocaleString()}`
                              : 'Not specified'}
                          </ModalFieldValue>
                        </ModalField>
                      </ModalGrid>
                    </ModalSection>

                    <ModalSection>
                      <ModalSectionTitle>
                        <FiBarChart2 size={16} />
                        Job Description
                      </ModalSectionTitle>
                      <ModalFieldValue style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                        {jobData.jobDescription}
                      </ModalFieldValue>
                    </ModalSection>

                    {jobData.jobResponsibility && jobData.jobResponsibility.length > 0 && (
                      <ModalSection>
                        <ModalSectionTitle>
                          <FiCheckCircle size={16} />
                          Responsibilities
                        </ModalSectionTitle>
                        <ul style={{ margin: '0', paddingLeft: '20px', color: '#2c3e50' }}>
                          {jobData.jobResponsibility.map((resp, idx) => (
                            <li key={idx} style={{ marginBottom: '8px', fontSize: '14px' }}>
                              {resp}
                            </li>
                          ))}
                        </ul>
                      </ModalSection>
                    )}

                    {vacancy.skills && vacancy.skills.length > 0 && (
                      <ModalSection>
                        <ModalSectionTitle>
                          <FiUsers size={16} />
                          Required Skills
                        </ModalSectionTitle>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                          {vacancy.skills.map((skill, idx) => (
                            <span
                              key={idx}
                              style={{
                                background: '#e8f4f8',
                                color: '#0c5460',
                                padding: '6px 12px',
                                borderRadius: '6px',
                                fontSize: '12px',
                                fontWeight: '600'
                              }}
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </ModalSection>
                    )}

                    <ModalSection>
                      <ModalSectionTitle>
                        <FiClock size={16} />
                        Timeline
                      </ModalSectionTitle>
                      <ModalGrid>
                        <ModalField>
                          <ModalFieldLabel>Posted</ModalFieldLabel>
                          <ModalFieldValue>{new Date(selectedJob.posted_date).toLocaleString()}</ModalFieldValue>
                        </ModalField>
                        <ModalField>
                          <ModalFieldLabel>Deadline</ModalFieldLabel>
                          <ModalFieldValue>{new Date(vacancy.deadline).toLocaleString()}</ModalFieldValue>
                        </ModalField>
                      </ModalGrid>
                    </ModalSection>
                  </>
                );
              })()}
            </>
          )}
        </ModalContent>
      </Modal>

      <ConfirmModal $isOpen={deleteConfirmOpen}>
        <ConfirmContent>
          <ConfirmTitle>Delete Job Post?</ConfirmTitle>
          <ConfirmText>
            Are you sure you want to delete this job post? This action cannot be undone.
          </ConfirmText>
          <ConfirmButtons>
            <ConfirmBtn onClick={() => setDeleteConfirmOpen(false)}>
              Cancel
            </ConfirmBtn>
            <ConfirmBtn 
              variant="danger" 
              onClick={handleConfirmDelete}
              disabled={deleting}
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </ConfirmBtn>
          </ConfirmButtons>
        </ConfirmContent>
      </ConfirmModal>
    </Container>
  );
};

export default JobMonitoring;
