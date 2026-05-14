import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  FiBriefcase,
  FiDownload,
  FiEye,
  FiRefreshCw,
  FiUsers,
  FiAlertCircle,
  FiFilter,
  FiX,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiBarChart2
} from 'react-icons/fi';
import { jobApi, handleApiError } from '../../services/api';

// Styled Components
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

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  background: ${props => props.variant === 'primary' ? '#3498db' : '#ecf0f1'};
  color: ${props => props.variant === 'primary' ? 'white' : '#2c3e50'};
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
    background: ${props => props.variant === 'primary' ? '#2980b9' : '#d5dbdb'};
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
  cursor: pointer;

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

const ApplicantName = styled.div`
  font-weight: 600;
  color: #1a202c;
  margin-bottom: 4px;
`;

const ApplicantMeta = styled.div`
  font-size: 12px;
  color: #7f8c8d;
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
      case 'applied': return '#fff3cd';
      case 'shortlisted': return '#cfe2ff';
      case 'hired': return '#d1e7dd';
      case 'rejected': return '#f8d7da';
      default: return '#e2e3e5';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'applied': return '#856404';
      case 'shortlisted': return '#084298';
      case 'hired': return '#0f5132';
      case 'rejected': return '#842029';
      default: return '#383d41';
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
    color: #3498db;
    background: #e8f4f8;
  }

  &:active {
    transform: scale(0.95);
  }
`;

const StatusSelect = styled.select`
  padding: 6px 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 12px;
  background: white;
  cursor: pointer;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
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
    from { opacity: 0; }
    to { opacity: 1; }
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
  word-break: break-word;
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
    to { transform: rotate(360deg); }
  }
`;

interface AppliedJob {
  _id: string;
  application_id: string;
  applicant_id: string;
  applicant_name: string;
  party_id: string;
  vacancy_id: string;
  status: string;
  is_agency_assisted: boolean;
  date_applied: string;
  contact_phone?: string;
  cover_letter?: string;
  portfolio_link?: string;
}

interface ApplicationStats {
  total: number;
  applied: number;
  shortlisted: number;
  hired: number;
  rejected: number;
}

const AppliedJobs: React.FC = () => {
  const [applications, setApplications] = useState<AppliedJob[]>([]);
  const [stats, setStats] = useState<ApplicationStats>({
    total: 0,
    applied: 0,
    shortlisted: 0,
    hired: 0,
    rejected: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedApp, setSelectedApp] = useState<AppliedJob | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(20);

  useEffect(() => {
    loadApplications();
  }, [currentPage]);

  const loadApplications = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await jobApi.get('/applied-jobs');
      console.log('[AppliedJobs] Response:', response.data);

      let appsData: AppliedJob[] = [];
      if (Array.isArray(response.data)) {
        appsData = response.data;
      } else if (response.data?.items && Array.isArray(response.data.items)) {
        appsData = response.data.items;
      }

      setApplications(appsData);

      // Calculate stats
      const statsData: ApplicationStats = {
        total: appsData.length,
        applied: appsData.filter(a => a.status === 'applied').length,
        shortlisted: appsData.filter(a => a.status === 'shortlisted').length,
        hired: appsData.filter(a => a.status === 'hired').length,
        rejected: appsData.filter(a => a.status === 'rejected').length,
      };
      setStats(statsData);
      setTotalPages(Math.ceil(appsData.length / itemsPerPage));
    } catch (err: any) {
      console.error('Error loading applications:', err);
      setError(handleApiError(err));
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (appId: string, newStatus: string) => {
    try {
      await jobApi.patch(`/applied-jobs/${appId}/status`, { status: newStatus });
      
      // Update local state
      setApplications(prev =>
        prev.map(app =>
          app._id === appId ? { ...app, status: newStatus } : app
        )
      );

      // Update selected app if open
      if (selectedApp?._id === appId) {
        setSelectedApp({ ...selectedApp, status: newStatus });
      }

      loadApplications();
    } catch (err: any) {
      alert('Failed to update status: ' + handleApiError(err));
    }
  };

  const handleViewApplication = async (app: AppliedJob) => {
    try {
      const response = await jobApi.get(`/applied-jobs/${app.application_id}`);
      setSelectedApp({ ...app, ...response.data });
      setModalOpen(true);
    } catch (err: any) {
      console.error('Error loading application details:', err);
      setSelectedApp(app);
      setModalOpen(true);
    }
  };

  const handleExport = () => {
    const csv = [
      ['Applicant Name', 'Application ID', 'Vacancy ID', 'Status', 'Date Applied', 'Agency Assisted'],
      ...applications.map(a => [
        a.applicant_name,
        a.application_id,
        a.vacancy_id,
        a.status,
        new Date(a.date_applied).toLocaleDateString(),
        a.is_agency_assisted ? 'Yes' : 'No'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `applied-jobs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (loading && applications.length === 0) {
    return (
      <Container>
        <LoadingContainer>
          <LoadingSpinner />
          <div style={{ marginLeft: '16px' }}>Loading applications...</div>
        </LoadingContainer>
      </Container>
    );
  }

  const paginatedApps = applications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Container>
      <PageHeader>
        <PageTitle>
          <FiBriefcase />
          Applied Jobs
        </PageTitle>
        <HeaderActions>
          <Button onClick={loadApplications} disabled={loading}>
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
          <StatValue>{stats.total.toLocaleString()}</StatValue>
          <StatLabel>
            <FiBriefcase />
            Total Applications
          </StatLabel>
        </StatCard>
        <StatCard $gradient="linear-gradient(135deg, #fff3cd 0%, #ffc107 100%)">
          <StatValue>{stats.applied.toLocaleString()}</StatValue>
          <StatLabel>
            <FiClock />
            Applied
          </StatLabel>
        </StatCard>
        <StatCard $gradient="linear-gradient(135deg, #cfe2ff 0%, #084298 100%)">
          <StatValue>{stats.shortlisted.toLocaleString()}</StatValue>
          <StatLabel>
            <FiCheckCircle />
            Shortlisted
          </StatLabel>
        </StatCard>
        <StatCard $gradient="linear-gradient(135deg, #d1e7dd 0%, #0f5132 100%)">
          <StatValue>{stats.hired.toLocaleString()}</StatValue>
          <StatLabel>
            <FiUsers />
            Hired
          </StatLabel>
        </StatCard>
      </StatsBar>

      <TableCard>
        {applications.length === 0 ? (
          <EmptyState>
            <EmptyStateIcon>
              <FiBriefcase size={48} />
            </EmptyStateIcon>
            <EmptyStateText>
              No applications yet. Applications will appear here once candidates apply.
            </EmptyStateText>
          </EmptyState>
        ) : (
          <>
            <TableWrapper>
              <Table>
                <thead>
                  <Tr>
                    <Th>Applicant Name</Th>
                    <Th>Application ID</Th>
                    <Th>Vacancy ID</Th>
                    <Th>Status</Th>
                    <Th>Date Applied</Th>
                    <Th>Agency Assisted</Th>
                    <Th>Actions</Th>
                  </Tr>
                </thead>
                <tbody>
                  {paginatedApps.map((app) => (
                    <Tr key={app._id}>
                      <Td>
                        <ApplicantName>{app.applicant_name}</ApplicantName>
                        <ApplicantMeta>{app.applicant_id}</ApplicantMeta>
                      </Td>
                      <Td>{app.application_id}</Td>
                      <Td>{app.vacancy_id}</Td>
                      <Td>
                        <StatusSelect
                          value={app.status}
                          onChange={(e) => handleStatusChange(app._id, e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <option value="applied">Applied</option>
                          <option value="shortlisted">Shortlisted</option>
                          <option value="hired">Hired</option>
                          <option value="rejected">Rejected</option>
                        </StatusSelect>
                      </Td>
                      <Td>{new Date(app.date_applied).toLocaleDateString()}</Td>
                      <Td>{app.is_agency_assisted ? 'Yes' : 'No'}</Td>
                      <Td>
                        <ActionButtons>
                          <IconButton
                            onClick={() => handleViewApplication(app)}
                            title="View Details"
                          >
                            <FiEye size={16} />
                          </IconButton>
                        </ActionButtons>
                      </Td>
                    </Tr>
                  ))}
                </tbody>
              </Table>
            </TableWrapper>

            <Pagination>
              <PageInfo>
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, stats.total)} of {stats.total} applications
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
              Application Details
            </ModalTitle>
            <CloseButton onClick={() => setModalOpen(false)}>
              <FiX size={24} />
            </CloseButton>
          </ModalHeader>
          {selectedApp && (
            <>
              <ModalSection>
                <ModalSectionTitle>
                  <FiBriefcase size={16} />
                  Applicant Information
                </ModalSectionTitle>
                <ModalGrid>
                  <ModalField>
                    <ModalFieldLabel>Applicant Name</ModalFieldLabel>
                    <ModalFieldValue>{selectedApp.applicant_name}</ModalFieldValue>
                  </ModalField>
                  <ModalField>
                    <ModalFieldLabel>Applicant ID</ModalFieldLabel>
                    <ModalFieldValue>{selectedApp.applicant_id}</ModalFieldValue>
                  </ModalField>
                  <ModalField>
                    <ModalFieldLabel>Application ID</ModalFieldLabel>
                    <ModalFieldValue>{selectedApp.application_id}</ModalFieldValue>
                  </ModalField>
                  <ModalField>
                    <ModalFieldLabel>Contact Phone</ModalFieldLabel>
                    <ModalFieldValue>{selectedApp.contact_phone || 'N/A'}</ModalFieldValue>
                  </ModalField>
                </ModalGrid>
              </ModalSection>

              <ModalSection>
                <ModalSectionTitle>
                  <FiBarChart2 size={16} />
                  Application Details
                </ModalSectionTitle>
                <ModalGrid>
                  <ModalField>
                    <ModalFieldLabel>Vacancy ID</ModalFieldLabel>
                    <ModalFieldValue>{selectedApp.vacancy_id}</ModalFieldValue>
                  </ModalField>
                  <ModalField>
                    <ModalFieldLabel>Status</ModalFieldLabel>
                    <ModalFieldValue>
                      <StatusBadge status={selectedApp.status}>
                        {selectedApp.status}
                      </StatusBadge>
                    </ModalFieldValue>
                  </ModalField>
                  <ModalField>
                    <ModalFieldLabel>Date Applied</ModalFieldLabel>
                    <ModalFieldValue>{new Date(selectedApp.date_applied).toLocaleString()}</ModalFieldValue>
                  </ModalField>
                  <ModalField>
                    <ModalFieldLabel>Agency Assisted</ModalFieldLabel>
                    <ModalFieldValue>{selectedApp.is_agency_assisted ? 'Yes' : 'No'}</ModalFieldValue>
                  </ModalField>
                </ModalGrid>
              </ModalSection>

              {selectedApp.cover_letter && (
                <ModalSection>
                  <ModalSectionTitle>Cover Letter</ModalSectionTitle>
                  <ModalFieldValue style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                    {selectedApp.cover_letter}
                  </ModalFieldValue>
                </ModalSection>
              )}

              {selectedApp.portfolio_link && (
                <ModalSection>
                  <ModalSectionTitle>Portfolio</ModalSectionTitle>
                  <ModalFieldValue>
                    <a href={selectedApp.portfolio_link} target="_blank" rel="noopener noreferrer" style={{ color: '#3498db', textDecoration: 'none' }}>
                      {selectedApp.portfolio_link}
                    </a>
                  </ModalFieldValue>
                </ModalSection>
              )}
            </>
          )}
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default AppliedJobs;
