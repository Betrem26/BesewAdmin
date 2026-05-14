import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  FiBriefcase,
  FiSearch,
  FiDownload,
  FiRefreshCw,
  FiEye,
  FiEdit2,
  FiAlertCircle,
  FiCheckCircle,
  FiUsers,
  FiTrash2
} from 'react-icons/fi';
import { handleApiError } from '../../services/api';
import platformAdminApi from '../../services/platformAdminApi';
import CompanyDetailRefactored from '../../components/CompanyDetailRefactored';
import VerificationModal from '../../components/VerificationModal';

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

const StatCard = styled.div<{ $gradient?: string }>`
  background: ${props => props.$gradient || 'white'};
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  color: ${props => props.$gradient ? 'white' : '#2c3e50'};
`;

const StatValue = styled.div`
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 8px;
`;

const StatLabel = styled.div`
  font-size: 13px;
  opacity: 0.8;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const FilterBar = styled.div`
  background: white;
  border-radius: 14px;
  padding: 18px 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  display: flex;
  align-items: flex-end;
  gap: 16px;

  @media (max-width: 900px) {
    flex-wrap: wrap;
  }
`;

const SearchWrapper = styled.div`
  position: relative;
  flex: 1 1 0;
  min-width: 0;

  svg {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: #3498db;
    font-size: 16px;
    pointer-events: none;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 11px 16px 11px 44px;
  border: 2px solid #e8ecf0;
  border-radius: 10px;
  font-size: 14px;
  background: #f8fafc;
  color: #2c3e50;
  transition: all 0.2s;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #3498db;
    background: white;
    box-shadow: 0 0 0 4px rgba(52, 152, 219, 0.1);
  }

  &::placeholder {
    color: #b0bec5;
    font-size: 13px;
  }
`;

const Divider = styled.div`
  width: 1px;
  height: 40px;
  background: #e8ecf0;
  flex-shrink: 0;
  align-self: center;

  @media (max-width: 900px) {
    display: none;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  flex-shrink: 0;
`;

const FilterLabel = styled.label`
  font-size: 10px;
  font-weight: 700;
  color: #95a5a6;
  text-transform: uppercase;
  letter-spacing: 0.9px;
  padding-left: 3px;
`;

const FilterSelect = styled.select`
  padding: 10px 36px 10px 14px;
  border: 2px solid #e8ecf0;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 500;
  background: #f8fafc url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='11' height='11' viewBox='0 0 24 24' fill='none' stroke='%2395a5a6' stroke-width='2.5'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E") no-repeat right 12px center;
  appearance: none;
  cursor: pointer;
  color: #2c3e50;
  transition: all 0.2s;
  min-width: 160px;

  &:focus {
    outline: none;
    border-color: #3498db;
    background-color: white;
    box-shadow: 0 0 0 4px rgba(52, 152, 219, 0.1);
  }

  &:hover {
    border-color: #b0bec5;
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

  &:hover {
    background: #f8f9fa;
  }
`;

const Td = styled.td`
  padding: 16px;
  font-size: 14px;
  color: #2c3e50;
`;

const CompanyLogo = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 6px;
  object-fit: cover;
  background: #ecf0f1;
`;

const CompanyInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const CompanyName = styled.div`
  font-weight: 600;
  color: #2c3e50;
`;

const CompanyType = styled.div`
  font-size: 12px;
  color: #7f8c8d;
`;

const Badge = styled.span<{ type?: string }>`
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  background: ${props => {
    switch (props.type) {
      case 'startup': return '#d4edda';
      case 'enterprise': return '#cfe2ff';
      case 'agency': return '#fff3cd';
      case 'daily': return '#d1ecf1';
      case 'weekly': return '#e7d4f5';
      case 'monthly': return '#f8d7da';
      case 'verified': return '#d1fae5';
      case 'pending': return '#fef3c7';
      case 'rejected': return '#fee2e2';
      default: return '#e2e3e5';
    }
  }};
  color: ${props => {
    switch (props.type) {
      case 'startup': return '#155724';
      case 'enterprise': return '#084298';
      case 'agency': return '#856404';
      case 'daily': return '#0c5460';
      case 'weekly': return '#5a1a7f';
      case 'monthly': return '#721c24';
      case 'verified': return '#065f46';
      case 'pending': return '#92400e';
      case 'rejected': return '#991b1b';
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
  display: flex;
  align-items: center;
  gap: 12px;
`;

const DeleteOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.55);
  backdrop-filter: blur(4px);
  z-index: 4000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  animation: fadeIn 0.15s ease;

  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
`;

const DeleteModal = styled.div`
  background: white;
  border-radius: 16px;
  padding: 36px 32px 28px;
  max-width: 420px;
  width: 100%;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.18);
  animation: slideUp 0.2s ease;
  position: relative;

  @keyframes slideUp {
    from { transform: translateY(16px); opacity: 0; }
    to   { transform: translateY(0);    opacity: 1; }
  }
`;

const DeleteIconWrap = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(135deg, #fee2e2, #fecaca);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;

  svg {
    font-size: 28px;
    color: #dc2626;
  }
`;

const DeleteTitle = styled.h3`
  margin: 0 0 8px;
  font-size: 20px;
  font-weight: 700;
  color: #111827;
  text-align: center;
`;

const DeleteSubtitle = styled.p`
  margin: 0 0 28px;
  font-size: 14px;
  color: #6b7280;
  text-align: center;
  line-height: 1.6;

  strong {
    color: #111827;
  }
`;

const DeleteActions = styled.div`
  display: flex;
  gap: 12px;
`;

const CancelBtn = styled.button`
  flex: 1;
  padding: 11px;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  background: white;
  color: #374151;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #d1d5db;
    background: #f9fafb;
  }
`;

const ConfirmDeleteBtn = styled.button`
  flex: 1;
  padding: 11px;
  border: none;
  border-radius: 10px;
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover {
    background: linear-gradient(135deg, #dc2626, #b91c1c);
    box-shadow: 0 4px 14px rgba(220, 38, 38, 0.4);
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

interface Company {
  _id?: string;
  company_id?: string;
  company_name: string;
  company_type?: { name: string };
  company_level?: { name: string };
  logo?: string;
  location?: string;
  city?: string;
  region?: string;
  company_description?: string;
  posting_frequency?: string;
  has_career_page?: boolean;
  career_page_url?: string;
  total_employee?: number;
  total_vacancy?: number;
  tin_number?: string;
  liscence_number?: string;
  mission?: string;
  vision?: string;
  values?: string[];
  website?: string;
  verification_status?: string;
  verification_reason?: string;
  verified_at?: string;
  verified_by?: string;
  feedback_count?: number;
  report_count?: number;
}

const CompanyManagement: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [verifyModalCompany, setVerifyModalCompany] = useState<Company | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [frequencyFilter, setFrequencyFilter] = useState('all');
  const [deleteTarget, setDeleteTarget] = useState<Company | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [stats, setStats] = useState({ total: 0, pending: 0, verified: 0, rejected: 0 });

  useEffect(() => {
    loadCompanies();
    loadStats();
  }, []);

  useEffect(() => {
    filterCompanies();
  }, [companies, searchQuery, statusFilter, frequencyFilter]);

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const loadStats = async () => {
    try {
      const response = await platformAdminApi.getCompanyStats();
      const data = response?.data ?? response;
      const byStatus = data?.by_verification_status ?? {};
      setStats({
        total: data?.total ?? 0,
        pending: byStatus.pending ?? byStatus.PENDING ?? data?.pending ?? 0,
        verified: byStatus.verified ?? byStatus.VERIFIED ?? data?.verified ?? 0,
        rejected: byStatus.rejected ?? byStatus.REJECTED ?? data?.rejected ?? 0,
      });
    } catch (err) {
      console.warn('[CompanyManagement] Stats endpoint failed, will compute from list:', err);
    }
  };

  const loadCompanies = async () => {
    try {
      setLoading(true);
      setError(null);

      const params: any = { limit: 1000 };
      if (statusFilter !== 'all') params.verification_status = statusFilter;
      if (frequencyFilter !== 'all') params.posting_frequency = frequencyFilter;

      const response = await platformAdminApi.getAllCompanies(params);

      let companyList: Company[] = [];
      if (Array.isArray(response)) {
        companyList = response;
      } else if (response?.data && Array.isArray(response.data)) {
        companyList = response.data;
      } else if (response?.items && Array.isArray(response.items)) {
        companyList = response.items;
      }

      setCompanies(companyList);

      setStats(prev => {
        if (prev.total === 0 && companyList.length > 0) {
          return {
            total: companyList.length,
            pending: companyList.filter(c => !c.verification_status || c.verification_status.toUpperCase() === 'PENDING').length,
            verified: companyList.filter(c => c.verification_status?.toUpperCase() === 'VERIFIED').length,
            rejected: companyList.filter(c => c.verification_status?.toUpperCase() === 'REJECTED').length,
          };
        }
        return prev;
      });
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError('Session expired. Please log in again.');
      } else {
        setError(handleApiError(err));
      }
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationSuccess = (companyId: string, newStatus: 'verified' | 'rejected') => {
    setCompanies(prev =>
      prev.map(c =>
        (c.company_id || c._id) === companyId ? { ...c, verification_status: newStatus } : c
      )
    );
    setStats(prev => ({
      ...prev,
      pending: Math.max(0, prev.pending - 1),
      verified: newStatus === 'verified' ? prev.verified + 1 : prev.verified,
      rejected: newStatus === 'rejected' ? prev.rejected + 1 : prev.rejected,
    }));
  };

  const handleDeleteCompany = async () => {
    if (!deleteTarget) return;
    const id = deleteTarget.company_id || deleteTarget._id;
    if (!id) return;
    try {
      setDeleteLoading(true);
      await platformAdminApi.deleteCompany(id);
      setCompanies(prev => prev.filter(c => (c.company_id || c._id) !== id));
      setStats(prev => ({ ...prev, total: Math.max(0, prev.total - 1) }));
      setDeleteTarget(null);
      showToast(`"${deleteTarget.company_name}" deleted successfully.`, 'success');
    } catch (err: any) {
      setError(handleApiError(err));
    } finally {
      setDeleteLoading(false);
    }
  };

  const applyAllFilters = (baseList: Company[]) => {
    let filtered = baseList;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(c =>
        c.company_name.toLowerCase().includes(q) ||
        c.location?.toLowerCase().includes(q) ||
        c.city?.toLowerCase().includes(q) ||
        c.region?.toLowerCase().includes(q) ||
        c.tin_number?.toLowerCase().includes(q) ||
        c.liscence_number?.toLowerCase().includes(q) ||
        c.website?.toLowerCase().includes(q) ||
        c.company_id?.toLowerCase().includes(q) ||
        c._id?.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== 'all') {
      filtered = filtered.filter(c =>
        (c.verification_status || 'pending').toLowerCase() === statusFilter.toLowerCase()
      );
    }
    if (frequencyFilter !== 'all') {
      filtered = filtered.filter(c =>
        c.posting_frequency?.toLowerCase() === frequencyFilter.toLowerCase()
      );
    }
    setFilteredCompanies(filtered);
  };

  const filterCompanies = () => {
    applyAllFilters(companies);
  };

  const handleExport = () => {
    const csv = [
      ['Company Name', 'Type', 'Location', 'Posting Frequency', 'Career Page', 'Employees', 'Vacancies'],
      ...filteredCompanies.map(c => [
        c.company_name,
        c.company_type?.name || c.company_level?.name || 'N/A',
        `${c.city || ''}, ${c.region || ''}`,
        c.posting_frequency || 'N/A',
        c.has_career_page || c.career_page_url ? 'Yes' : 'No',
        c.total_employee || 0,
        c.total_vacancy || 0,
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `companies-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedCompany(null);
  };

  if (loading) {
    return <LoadingMessage>Loading companies...</LoadingMessage>;
  }

  return (
    <Container>
      <PageHeader>
        <PageTitle>
          <FiBriefcase />
          Company Management
        </PageTitle>
        <HeaderActions>
          <Button onClick={() => { loadCompanies(); loadStats(); }} disabled={loading}>
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
        <ErrorMessage>
          <FiAlertCircle />
          {error}
        </ErrorMessage>
      )}

      <StatsBar>
        <StatCard $gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)">
          <StatValue>{stats.total.toLocaleString()}</StatValue>
          <StatLabel><FiBriefcase /> Total Companies</StatLabel>
        </StatCard>
        <StatCard $gradient="linear-gradient(135deg, #f39c12 0%, #e67e22 100%)">
          <StatValue>{stats.pending.toLocaleString()}</StatValue>
          <StatLabel><FiAlertCircle /> Pending Verification</StatLabel>
        </StatCard>
        <StatCard $gradient="linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)">
          <StatValue>{stats.verified.toLocaleString()}</StatValue>
          <StatLabel><FiCheckCircle /> Verified</StatLabel>
        </StatCard>
        <StatCard $gradient="linear-gradient(135deg, #fa709a 0%, #fee140 100%)">
          <StatValue>{stats.rejected.toLocaleString()}</StatValue>
          <StatLabel><FiUsers /> Rejected</StatLabel>
        </StatCard>
      </StatsBar>

      <FilterBar>
        <FilterGroup style={{ flex: 1, minWidth: 0 }}>
          <FilterLabel>Search</FilterLabel>
          <SearchWrapper>
            <FiSearch />
            <SearchInput
              type="text"
              placeholder="Search by company name, location or TIN number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </SearchWrapper>
        </FilterGroup>

        <Divider />

        <FilterGroup>
          <FilterLabel>Verification Status</FilterLabel>
          <FilterSelect value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="verified">Verified</option>
            <option value="rejected">Rejected</option>
          </FilterSelect>
        </FilterGroup>

        <Divider />

        <FilterGroup>
          <FilterLabel>Posting Frequency</FilterLabel>
          <FilterSelect value={frequencyFilter} onChange={(e) => setFrequencyFilter(e.target.value)}>
            <option value="all">All Frequencies</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </FilterSelect>
        </FilterGroup>
      </FilterBar>

      <TableCard>
        {filteredCompanies.length === 0 && !loading ? (
          <LoadingMessage>
            No companies found. {searchQuery || statusFilter !== 'all' || frequencyFilter !== 'all'
              ? 'Try adjusting your filters.'
              : 'No companies registered yet.'}
          </LoadingMessage>
        ) : (
          <Table>
            <Thead>
              <Tr>
                <Th>Company</Th>
                <Th>Type</Th>
                <Th>Location</Th>
                <Th>Verification</Th>
                <Th>Posting Frequency</Th>
                <Th>Career Page</Th>
                <Th>Employees</Th>
                <Th>Vacancies</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredCompanies.map((company) => (
                <Tr key={company._id || company.company_id}>
                  <Td>
                    <CompanyInfo>
                      {company.logo && (
                        <CompanyLogo src={company.logo} alt={company.company_name} />
                      )}
                      <div>
                        <CompanyName>{company.company_name}</CompanyName>
                        <CompanyType>{company.city}, {company.region}</CompanyType>
                      </div>
                    </CompanyInfo>
                  </Td>
                  <Td>
                    <Badge type={company.company_type?.name?.toLowerCase() || company.company_level?.name?.toLowerCase()}>
                      {company.company_type?.name || company.company_level?.name || 'N/A'}
                    </Badge>
                  </Td>
                  <Td>{company.location}</Td>
                  <Td>
                    <Badge type={(company.verification_status || 'pending').toLowerCase()}>
                      {(company.verification_status || 'Pending').charAt(0).toUpperCase() +
                        (company.verification_status || 'pending').slice(1).toLowerCase()}
                    </Badge>
                  </Td>
                  <Td>
                    {company.posting_frequency && (
                      <Badge type={company.posting_frequency}>
                        {company.posting_frequency}
                      </Badge>
                    )}
                  </Td>
                  <Td>
                    {company.has_career_page || company.career_page_url ? (
                      <FiCheckCircle color="#27ae60" />
                    ) : (
                      <FiAlertCircle color="#e74c3c" />
                    )}
                  </Td>
                  <Td>{company.total_employee || 0}</Td>
                  <Td>{company.total_vacancy || 0}</Td>
                  <Td>
                    <ActionButtons>
                      <IconButton
                        onClick={() => { setSelectedCompany(company); setModalOpen(true); }}
                        title="View Details"
                        style={{ color: '#3498db' }}
                      >
                        <FiEye />
                      </IconButton>
                      <IconButton
                        onClick={() => { setSelectedCompany(company); setModalOpen(true); }}
                        title="Edit / Update"
                        style={{ color: '#8e44ad' }}
                      >
                        <FiEdit2 />
                      </IconButton>
                      {(company.verification_status?.toUpperCase() ?? 'PENDING') !== 'VERIFIED' && (
                        <IconButton
                          title="Verify Company"
                          onClick={() => setVerifyModalCompany(company)}
                          style={{ color: '#27ae60' }}
                        >
                          <FiCheckCircle />
                        </IconButton>
                      )}
                      <IconButton
                        title="Delete Company"
                        onClick={() => setDeleteTarget(company)}
                        style={{ color: '#e74c3c' }}
                      >
                        <FiTrash2 />
                      </IconButton>
                    </ActionButtons>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </TableCard>

      <CompanyDetailRefactored
        isOpen={modalOpen}
        company={selectedCompany}
        onClose={handleCloseModal}
        onUpdate={() => {
          loadCompanies();
          loadStats();
          handleCloseModal();
        }}
      />

      <VerificationModal
        isOpen={!!verifyModalCompany}
        company={verifyModalCompany}
        onClose={() => setVerifyModalCompany(null)}
        onSuccess={handleVerificationSuccess}
        onToast={showToast}
      />

      {deleteTarget && (
        <DeleteOverlay onClick={() => !deleteLoading && setDeleteTarget(null)}>
          <DeleteModal onClick={e => e.stopPropagation()}>
            <DeleteIconWrap>
              <FiTrash2 />
            </DeleteIconWrap>
            <DeleteTitle>Delete Company?</DeleteTitle>
            <DeleteSubtitle>
              You are about to permanently delete <strong>{deleteTarget.company_name}</strong>.
              This action cannot be undone and all associated data will be removed.
            </DeleteSubtitle>
            <DeleteActions>
              <CancelBtn onClick={() => setDeleteTarget(null)} disabled={deleteLoading}>
                Cancel
              </CancelBtn>
              <ConfirmDeleteBtn onClick={handleDeleteCompany} disabled={deleteLoading}>
                <FiTrash2 />
                {deleteLoading ? 'Deleting...' : 'Yes, Delete'}
              </ConfirmDeleteBtn>
            </DeleteActions>
          </DeleteModal>
        </DeleteOverlay>
      )}

      {toast && (
        <div style={{
          position: 'fixed', bottom: '28px', right: '28px', zIndex: 3000,
          padding: '14px 22px', borderRadius: '10px', fontWeight: 600, fontSize: '14px',
          background: toast.type === 'success' ? '#16a34a' : '#dc2626',
          color: 'white', boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
          display: 'flex', alignItems: 'center', gap: '10px'
        }}>
          {toast.type === 'success' ? <FiCheckCircle /> : <FiAlertCircle />}
          {toast.msg}
        </div>
      )}
    </Container>
  );
};

export default CompanyManagement;
