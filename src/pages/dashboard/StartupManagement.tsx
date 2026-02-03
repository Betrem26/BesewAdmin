import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { 
  FiActivity, 
  FiSearch, 
  FiDownload, 
  FiEye, 
  FiCheckCircle, 
  FiXCircle,
  FiRefreshCw,
  FiTrendingUp,
  FiUsers,
  FiFileText,
  FiAlertCircle
} from 'react-icons/fi';
import { partyApi, handleApiError } from '../../services/api';
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
      case 'verified': return '#d4edda';
      case 'pending': return '#fff3cd';
      case 'rejected': return '#f8d7da';
      case 'active': return '#d1ecf1';
      default: return '#e2e3e5';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'verified': return '#155724';
      case 'pending': return '#856404';
      case 'rejected': return '#721c24';
      case 'active': return '#0c5460';
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

const ModalActions = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #ecf0f1;
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

interface Company {
  _id: string;
  company_name: string;
  organization_type: string;
  industry: string;
  location: string;
  verification_status: string;
  employee_count?: number;
  active_jobs?: number;
  created_at: string;
  contact_email?: string;
  contact_phone?: string;
  website?: string;
}

interface CompanyStats {
  total: number;
  verified: number;
  pending: number;
  rejected: number;
  active: number;
}

const StartupManagement: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [stats, setStats] = useState<CompanyStats>({
    total: 0,
    verified: 0,
    pending: 0,
    rejected: 0,
    active: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [verificationFilter, setVerificationFilter] = useState('all');
  const [industryFilter, setIndustryFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(20);

  useEffect(() => {
    loadCompanies();
    loadStats();
  }, [currentPage, verificationFilter, industryFilter, typeFilter, searchQuery]);

  const loadCompanies = async () => {
    try {
      setLoading(true);
      setError(null);

      const params: any = {
        page: currentPage,
        limit: itemsPerPage,
      };

      if (verificationFilter !== 'all') params.verification_status = verificationFilter;
      if (industryFilter !== 'all') params.industry = industryFilter;
      if (typeFilter !== 'all') params.organization_type = typeFilter;
      if (searchQuery) params.search = searchQuery;

      const response = await partyApi.get('/party-profiles', { params });
      
      setCompanies(response.data.companies || response.data || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (err: any) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const statsData = await monitoringApi.party.getPartyStats();
      setStats({
        total: statsData.total || 0,
        verified: statsData.verified || 0,
        pending: statsData.pending || 0,
        rejected: statsData.rejected || 0,
        active: statsData.active || 0,
      });
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  };

  const handleViewCompany = (company: Company) => {
    setSelectedCompany(company);
    setModalOpen(true);
  };

  const handleVerifyCompany = async (companyId: string) => {
    try {
      await partyApi.patch(`/party-profiles/${companyId}/verify`, { 
        verification_status: 'verified' 
      });
      loadCompanies();
      loadStats();
      setModalOpen(false);
    } catch (err: any) {
      alert(handleApiError(err));
    }
  };

  const handleRejectCompany = async (companyId: string) => {
    try {
      await partyApi.patch(`/party-profiles/${companyId}/verify`, { 
        verification_status: 'rejected' 
      });
      loadCompanies();
      loadStats();
      setModalOpen(false);
    } catch (err: any) {
      alert(handleApiError(err));
    }
  };

  const handleExport = () => {
    const csv = [
      ['Company Name', 'Type', 'Industry', 'Location', 'Verification', 'Employees', 'Active Jobs', 'Created'],
      ...companies.map(c => [
        c.company_name,
        c.organization_type,
        c.industry,
        c.location,
        c.verification_status,
        c.employee_count || 0,
        c.active_jobs || 0,
        new Date(c.created_at).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `companies-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (loading && companies.length === 0) {
    return <LoadingMessage>Loading companies...</LoadingMessage>;
  }

  return (
    <Container>
      <PageHeader>
        <PageTitle>
          <FiActivity />
          Startup & Company Management
        </PageTitle>
        <HeaderActions>
          <Button onClick={loadCompanies} disabled={loading}>
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
            <FiActivity />
            Total Companies
          </StatLabel>
        </StatCard>
        <StatCard gradient="linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)">
          <StatValue>{stats.verified.toLocaleString()}</StatValue>
          <StatLabel>
            <FiCheckCircle />
            Verified
          </StatLabel>
        </StatCard>
        <StatCard gradient="linear-gradient(135deg, #fa709a 0%, #fee140 100%)">
          <StatValue>{stats.pending.toLocaleString()}</StatValue>
          <StatLabel>
            <FiAlertCircle />
            Pending Verification
          </StatLabel>
        </StatCard>
        <StatCard gradient="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)">
          <StatValue>{stats.active.toLocaleString()}</StatValue>
          <StatLabel>
            <FiTrendingUp />
            Active
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
                placeholder="Search by company name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </SearchBar>
          </FilterGroup>

          <FilterGroup>
            <Label>Verification Status</Label>
            <Select value={verificationFilter} onChange={(e) => setVerificationFilter(e.target.value)}>
              <option value="all">All Status</option>
              <option value="verified">Verified</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </Select>
          </FilterGroup>

          <FilterGroup>
            <Label>Industry</Label>
            <Select value={industryFilter} onChange={(e) => setIndustryFilter(e.target.value)}>
              <option value="all">All Industries</option>
              <option value="technology">Technology</option>
              <option value="finance">Finance</option>
              <option value="healthcare">Healthcare</option>
              <option value="education">Education</option>
              <option value="retail">Retail</option>
              <option value="manufacturing">Manufacturing</option>
            </Select>
          </FilterGroup>

          <FilterGroup>
            <Label>Organization Type</Label>
            <Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
              <option value="all">All Types</option>
              <option value="startup">Startup</option>
              <option value="company">Company</option>
              <option value="agency">Agency</option>
              <option value="freelancer">Freelancer</option>
            </Select>
          </FilterGroup>
        </FiltersGrid>
      </FiltersCard>

      <TableCard>
        <Table>
          <Thead>
            <Tr>
              <Th>Company Name</Th>
              <Th>Type</Th>
              <Th>Industry</Th>
              <Th>Location</Th>
              <Th>Verification</Th>
              <Th>Employees</Th>
              <Th>Active Jobs</Th>
              <Th>Registered</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {companies.map((company) => (
              <Tr key={company._id}>
                <Td>{company.company_name}</Td>
                <Td>{company.organization_type}</Td>
                <Td>{company.industry}</Td>
                <Td>{company.location}</Td>
                <Td>
                  <StatusBadge status={company.verification_status}>
                    {company.verification_status}
                  </StatusBadge>
                </Td>
                <Td>{company.employee_count || 0}</Td>
                <Td>{company.active_jobs || 0}</Td>
                <Td>{new Date(company.created_at).toLocaleDateString()}</Td>
                <Td>
                  <ActionButtons>
                    <IconButton onClick={() => handleViewCompany(company)} title="View Details">
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
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, stats.total)} of {stats.total} companies
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
            <ModalTitle>Company Details</ModalTitle>
            <CloseButton onClick={() => setModalOpen(false)}>×</CloseButton>
          </ModalHeader>
          {selectedCompany && (
            <>
              <DetailSection>
                <DetailSectionTitle>
                  <FiActivity />
                  Basic Information
                </DetailSectionTitle>
                <DetailRow>
                  <DetailLabel>Company ID:</DetailLabel>
                  <DetailValue>{selectedCompany._id}</DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>Company Name:</DetailLabel>
                  <DetailValue>{selectedCompany.company_name}</DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>Organization Type:</DetailLabel>
                  <DetailValue>{selectedCompany.organization_type}</DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>Industry:</DetailLabel>
                  <DetailValue>{selectedCompany.industry}</DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>Location:</DetailLabel>
                  <DetailValue>{selectedCompany.location}</DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>Verification Status:</DetailLabel>
                  <DetailValue>
                    <StatusBadge status={selectedCompany.verification_status}>
                      {selectedCompany.verification_status}
                    </StatusBadge>
                  </DetailValue>
                </DetailRow>
              </DetailSection>

              <DetailSection>
                <DetailSectionTitle>
                  <FiUsers />
                  Company Metrics
                </DetailSectionTitle>
                <DetailRow>
                  <DetailLabel>Employee Count:</DetailLabel>
                  <DetailValue>{selectedCompany.employee_count || 'Not specified'}</DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>Active Job Postings:</DetailLabel>
                  <DetailValue>{selectedCompany.active_jobs || 0}</DetailValue>
                </DetailRow>
              </DetailSection>

              <DetailSection>
                <DetailSectionTitle>
                  <FiFileText />
                  Contact Information
                </DetailSectionTitle>
                <DetailRow>
                  <DetailLabel>Email:</DetailLabel>
                  <DetailValue>{selectedCompany.contact_email || 'Not provided'}</DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>Phone:</DetailLabel>
                  <DetailValue>{selectedCompany.contact_phone || 'Not provided'}</DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>Website:</DetailLabel>
                  <DetailValue>{selectedCompany.website || 'Not provided'}</DetailValue>
                </DetailRow>
              </DetailSection>

              <DetailSection>
                <DetailSectionTitle>Timeline</DetailSectionTitle>
                <DetailRow>
                  <DetailLabel>Registered:</DetailLabel>
                  <DetailValue>{new Date(selectedCompany.created_at).toLocaleString()}</DetailValue>
                </DetailRow>
              </DetailSection>

              {selectedCompany.verification_status === 'pending' && (
                <ModalActions>
                  <Button 
                    variant="danger" 
                    onClick={() => handleRejectCompany(selectedCompany._id)}
                  >
                    <FiXCircle />
                    Reject
                  </Button>
                  <Button 
                    variant="success" 
                    onClick={() => handleVerifyCompany(selectedCompany._id)}
                  >
                    <FiCheckCircle />
                    Verify Company
                  </Button>
                </ModalActions>
              )}
            </>
          )}
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default StartupManagement;
