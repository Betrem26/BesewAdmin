import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  FiBriefcase,
  FiSearch,
  FiDownload,
  FiEye,
  FiCheckCircle,
  FiXCircle,
  FiRefreshCw,
  FiTrendingUp,
  FiUsers
} from 'react-icons/fi';
import { jobApi, handleApiError } from '../../services/api';
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
  opacity: ${props => props.color ? 1 : 0.8};
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
  max-width: 800px;
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

interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  category: string;
  status: string;
  salary_min?: number;
  salary_max?: number;
  applications_count: number;
  views_count: number;
  created_at: string;
  expires_at?: string;
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
  const [jobs, setJobs] = useState<Job[]>([]);
  const [stats, setStats] = useState<JobStats>({
    total: 0,
    active: 0,
    closed: 0,
    expired: 0,
    total_applications: 0,
    avg_applications_per_job: 0,
  });
  const [agencyStats, setAgencyStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

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

      const params: any = {
        page: currentPage,
        limit: itemsPerPage,
      };

      if (statusFilter !== 'all') params.status = statusFilter;
      if (categoryFilter !== 'all') params.category = categoryFilter;
      if (locationFilter !== 'all') params.location = locationFilter;
      if (searchQuery) params.search = searchQuery;

      const response = await jobApi.get('/posts', { params });

      setJobs(response.data.jobs || response.data || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (err: any) {
      console.error('Error loading jobs:', err);
      setError(handleApiError(err));
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

      try {
        const aStats = await monitoringApi.job.getAgencyStats();
        setAgencyStats(aStats);
      } catch (err) {
        console.log('Skipping agency stats (might not be an agency user).');
      }
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

  const handleUpdateStatus = async (jobId: string, newStatus: string) => {
    try {
      await jobApi.patch(`/posts/${jobId}/status`, { status: newStatus });
      loadJobs();
      loadStats();
    } catch (err: any) {
      alert(handleApiError(err));
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
    return <LoadingMessage>Loading job postings...</LoadingMessage>;
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

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <StatsBar>
        <StatCard gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)">
          <StatValue>{stats.total.toLocaleString()}</StatValue>
          <StatLabel>
            <FiBriefcase />
            Total Jobs
          </StatLabel>
        </StatCard>
        <StatCard gradient="linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)">
          <StatValue>{stats.active.toLocaleString()}</StatValue>
          <StatLabel>
            <FiCheckCircle />
            Active Jobs
          </StatLabel>
        </StatCard>
        <StatCard gradient="linear-gradient(135deg, #fa709a 0%, #fee140 100%)">
          <StatValue>{stats.total_applications.toLocaleString()}</StatValue>
          <StatLabel>
            <FiUsers />
            Total Applications
          </StatLabel>
        </StatCard>
        <StatCard gradient="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)">
          <StatValue>{stats.avg_applications_per_job.toFixed(1)}</StatValue>
          <StatLabel>
            <FiTrendingUp />
            Avg Applications/Job
          </StatLabel>
        </StatCard>
      </StatsBar>

      {agencyStats && Object.keys(agencyStats).length > 0 && (
        <>
          <PageTitle style={{ fontSize: '20px', marginTop: '10px', marginBottom: '20px' }}>Your Agency Statistics</PageTitle>
          <StatsBar>
            {Object.entries(agencyStats).map(([key, value]) => {
              if (typeof value !== 'object' && value !== null) {
                return (
                  <StatCard key={key}>
                    <StatValue>{String(value)}</StatValue>
                    <StatLabel style={{ textTransform: 'capitalize' }}>
                      {key.replace(/_/g, ' ')}
                    </StatLabel>
                  </StatCard>
                );
              }
              return null;
            })}
          </StatsBar>
        </>
      )}

      <FiltersCard>
        <FiltersGrid>
          <FilterGroup>
            <Label>Search</Label>
            <SearchBar>
              <FiSearch />
              <Input
                type="text"
                placeholder="Search by title or company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </SearchBar>
          </FilterGroup>

          <FilterGroup>
            <Label>Status</Label>
            <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="closed">Closed</option>
              <option value="expired">Expired</option>
              <option value="draft">Draft</option>
            </Select>
          </FilterGroup>

          <FilterGroup>
            <Label>Category</Label>
            <Select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
              <option value="all">All Categories</option>
              <option value="technology">Technology</option>
              <option value="finance">Finance</option>
              <option value="healthcare">Healthcare</option>
              <option value="education">Education</option>
              <option value="marketing">Marketing</option>
            </Select>
          </FilterGroup>

          <FilterGroup>
            <Label>Location</Label>
            <Select value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)}>
              <option value="all">All Locations</option>
              <option value="addis-ababa">Addis Ababa</option>
              <option value="dire-dawa">Dire Dawa</option>
              <option value="mekelle">Mekelle</option>
              <option value="bahir-dar">Bahir Dar</option>
              <option value="remote">Remote</option>
            </Select>
          </FilterGroup>
        </FiltersGrid>
      </FiltersCard>

      <TableCard>
        {jobs.length === 0 && !loading ? (
          <LoadingMessage>
            No jobs found. {searchQuery || statusFilter !== 'all' || categoryFilter !== 'all' || locationFilter !== 'all'
              ? 'Try adjusting your filters.'
              : 'Jobs will appear here once they are posted.'}
          </LoadingMessage>
        ) : (
          <>
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
                {jobs.map((job) => (
                  <Tr key={job._id}>
                    <Td>{job.title}</Td>
                    <Td>{job.company}</Td>
                    <Td>{job.location}</Td>
                    <Td>{job.category}</Td>
                    <Td>
                      <StatusBadge status={job.status}>{job.status}</StatusBadge>
                    </Td>
                    <Td>{job.applications_count || 0}</Td>
                    <Td>{job.views_count || 0}</Td>
                    <Td>{new Date(job.created_at).toLocaleDateString()}</Td>
                    <Td>
                      <ActionButtons>
                        <IconButton onClick={() => handleViewJob(job)} title="View Details">
                          <FiEye />
                        </IconButton>
                        {job.status === 'active' && (
                          <IconButton
                            onClick={() => handleUpdateStatus(job._id, 'closed')}
                            title="Close Job"
                          >
                            <FiXCircle />
                          </IconButton>
                        )}
                        {job.status === 'closed' && (
                          <IconButton
                            onClick={() => handleUpdateStatus(job._id, 'active')}
                            title="Reopen Job"
                          >
                            <FiCheckCircle />
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

      <Modal isOpen={modalOpen}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Job Details</ModalTitle>
            <CloseButton onClick={() => setModalOpen(false)}>×</CloseButton>
          </ModalHeader>
          {selectedJob && (
            <>
              <DetailSection>
                <DetailSectionTitle>Basic Information</DetailSectionTitle>
                <DetailRow>
                  <DetailLabel>Job ID:</DetailLabel>
                  <DetailValue>{selectedJob._id}</DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>Title:</DetailLabel>
                  <DetailValue>{selectedJob.title}</DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>Company:</DetailLabel>
                  <DetailValue>{selectedJob.company}</DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>Location:</DetailLabel>
                  <DetailValue>{selectedJob.location}</DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>Category:</DetailLabel>
                  <DetailValue>{selectedJob.category}</DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>Status:</DetailLabel>
                  <DetailValue>
                    <StatusBadge status={selectedJob.status}>{selectedJob.status}</StatusBadge>
                  </DetailValue>
                </DetailRow>
              </DetailSection>

              <DetailSection>
                <DetailSectionTitle>Salary & Compensation</DetailSectionTitle>
                <DetailRow>
                  <DetailLabel>Salary Range:</DetailLabel>
                  <DetailValue>
                    {selectedJob.salary_min && selectedJob.salary_max
                      ? `$${selectedJob.salary_min.toLocaleString()} - $${selectedJob.salary_max.toLocaleString()}`
                      : 'Not specified'}
                  </DetailValue>
                </DetailRow>
              </DetailSection>

              <DetailSection>
                <DetailSectionTitle>Performance Metrics</DetailSectionTitle>
                <DetailRow>
                  <DetailLabel>Applications:</DetailLabel>
                  <DetailValue>{selectedJob.applications_count || 0}</DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>Views:</DetailLabel>
                  <DetailValue>{selectedJob.views_count || 0}</DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>Conversion Rate:</DetailLabel>
                  <DetailValue>
                    {selectedJob.views_count > 0
                      ? `${((selectedJob.applications_count / selectedJob.views_count) * 100).toFixed(1)}%`
                      : 'N/A'}
                  </DetailValue>
                </DetailRow>
              </DetailSection>

              <DetailSection>
                <DetailSectionTitle>Timeline</DetailSectionTitle>
                <DetailRow>
                  <DetailLabel>Posted:</DetailLabel>
                  <DetailValue>{new Date(selectedJob.created_at).toLocaleString()}</DetailValue>
                </DetailRow>
                {selectedJob.expires_at && (
                  <DetailRow>
                    <DetailLabel>Expires:</DetailLabel>
                    <DetailValue>{new Date(selectedJob.expires_at).toLocaleString()}</DetailValue>
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

export default JobMonitoring;
