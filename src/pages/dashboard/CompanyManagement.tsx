import React, { useEffect, useState, useMemo } from 'react';
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

const TabContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  border-bottom: 2px solid #ecf0f1;
`;

const Tab = styled.button<{ $active?: boolean }>`
  padding: 12px 20px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.$active ? '#3498db' : '#7f8c8d'};
  border-bottom: 3px solid ${props => props.$active ? '#3498db' : 'transparent'};
  transition: all 0.2s;
  position: relative;
  bottom: -2px;

  &:hover {
    color: #3498db;
  }
`;

const TabBadge = styled.span`
  background: #e74c3c;
  color: white;
  border-radius: 12px;
  padding: 2px 8px;
  font-size: 11px;
  font-weight: 700;
  margin-left: 6px;
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

const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  background: ${props => props.$variant === 'primary' ? '#3498db' : '#ecf0f1'};
  color: ${props => props.$variant === 'primary' ? 'white' : '#2c3e50'};
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
    background: ${props => props.$variant === 'primary' ? '#2980b9' : '#d5dbdb'};
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
  company_type?: { name: string } | string;
  company_level?: { name: string } | string;
  role?: string;
  type?: string;
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

const STORAGE_KEY = 'bsw_verification_overrides';

// Read all locally-saved status overrides
const getOverrides = (): Record<string, string> => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
};

// Save a single override
const saveOverride = (companyId: string, status: string) => {
  const overrides = getOverrides();
  overrides[companyId] = status;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
};

// Remove an override (e.g. when company is deleted)
const removeOverride = (companyId: string) => {
  const overrides = getOverrides();
  delete overrides[companyId];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
};

// Merge backend list with local overrides so refresh never loses changes
const applyOverrides = (list: Company[]): Company[] => {
  const overrides = getOverrides();
  if (Object.keys(overrides).length === 0) return list;
  return list.map(c => {
    const id = c.company_id || c._id || '';
    return overrides[id] ? { ...c, verification_status: overrides[id] } : c;
  });
};

// Standardized company types mapping - STRICT 4 TYPES ONLY
const STANDARDIZED_COMPANY_TYPES: Record<string, string> = {
  // Employer variations
  'employer': 'Employer',
  'employers': 'Employer',
  'company': 'Employer',
  'enterprise': 'Employer',
  'corporate': 'Employer',
  'organization': 'Employer',
  'business': 'Employer',
  
  // Startup Founder variations
  'startup': 'Startup Founder',
  'startup_founder': 'Startup Founder',
  'startup founder': 'Startup Founder',
  'startupfounder': 'Startup Founder',
  'founder': 'Startup Founder',
  'startups': 'Startup Founder',
  
  // Aggregator variations
  'aggregator': 'Aggregator',
  'aggregators': 'Aggregator',
  'job aggregator': 'Aggregator',
  'recruitment agency': 'Aggregator',
  'recruitment_agency': 'Aggregator',
  'recruitmentagency': 'Aggregator',
  'recruiter': 'Aggregator',
  'recruitment': 'Aggregator',
  'agency': 'Aggregator',
  'broker': 'Aggregator',
  'bpo': 'Aggregator',
  'staffing': 'Aggregator',
  'staffing agency': 'Aggregator',
  'consulting': 'Aggregator',
  'consulting agency': 'Aggregator',
  
  // NGO / Non-Profit variations
  'ngo': 'NGO / Non-Profit',
  'ngos': 'NGO / Non-Profit',
  'non-profit': 'NGO / Non-Profit',
  'nonprofit': 'NGO / Non-Profit',
  'non_profit': 'NGO / Non-Profit',
  'ngo / non-profit': 'NGO / Non-Profit',
  'ngo/non-profit': 'NGO / Non-Profit',
  'charity': 'NGO / Non-Profit',
  'foundation': 'NGO / Non-Profit',
};

// Map company type to standardized type
const getStandardizedCompanyType = (company: Company): string => {
  let typeKey = '';
  
  // Try to extract type from various possible fields in order of priority
  // 1. Check company_type (string or object)
  if (typeof company.company_type === 'string') {
    typeKey = company.company_type;
  } else if (company.company_type?.name) {
    typeKey = company.company_type.name;
  }
  
  // 2. Check role field
  if (!typeKey && typeof company.role === 'string') {
    typeKey = company.role;
  }
  
  // 3. Check type field
  if (!typeKey && typeof company.type === 'string') {
    typeKey = company.type;
  }
  
  // 4. Fallback to company_level if company_type is empty
  if (!typeKey) {
    if (typeof company.company_level === 'string') {
      typeKey = company.company_level;
    } else if (company.company_level?.name) {
      typeKey = company.company_level.name;
    }
  }
  
  // 5. Normalize the key
  typeKey = typeKey.toLowerCase().trim();
  
  // 6. Look up in mapping
  const standardized = STANDARDIZED_COMPANY_TYPES[typeKey];
  
  // Debug logging for unmapped types
  if (!standardized && typeKey) {
    console.warn('[CompanyManagement] Unknown company type:', {
      original: typeKey,
      company_type: company.company_type,
      company_level: company.company_level,
      role: company.role,
      type: company.type,
      company_name: company.company_name
    });
  }
  
  return standardized || 'Unknown';
};

const CompanyManagement: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [verifyModalCompany, setVerifyModalCompany] = useState<Company | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Company | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [frequencyFilter, setFrequencyFilter] = useState('all');
  const [companyTypeFilter, setCompanyTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [activeTab, setActiveTab] = useState<'all' | 'pending'>('all');

  const [stats, setStats] = useState({ total: 0, pending: 0, verified: 0, rejected: 0 });

  useEffect(() => {
    loadAllCompanies();
  }, []);

  useEffect(() => {
    filterCompanies();
  }, [companies, searchQuery, statusFilter, frequencyFilter, companyTypeFilter, activeTab]);

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Compute stats directly from the company list — the only reliable source of truth
  const computeStats = (list: Company[]) => {
    setStats({
      total: list.length,
      pending: list.filter(c => !c.verification_status || c.verification_status.toUpperCase() === 'PENDING' || c.verification_status.toUpperCase() === 'PENDING_APPROVAL').length,
      verified: list.filter(c => c.verification_status?.toUpperCase() === 'VERIFIED' || c.verification_status?.toUpperCase() === 'APPROVED').length,
      rejected: list.filter(c => c.verification_status?.toUpperCase() === 'REJECTED').length,
    });
  };

  // Load ALL companies on initial page load (for stats) — no filters
  const loadAllCompanies = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await platformAdminApi.getAllCompanies({ limit: 1000 });

      let companyList: Company[] = [];
      if (Array.isArray(response)) {
        companyList = response;
      } else if (response?.data && Array.isArray(response.data)) {
        companyList = response.data;
      } else if (response?.items && Array.isArray(response.items)) {
        companyList = response.items;
      }

      // Debug: log company type values
      if (companyList.length > 0) {
        console.log('[CompanyManagement] Sample company types:', {
          company_type: companyList[0].company_type,
          company_level: companyList[0].company_level,
          standardized: getStandardizedCompanyType(companyList[0])
        });
      }

      // Merge any locally-saved overrides (handles backend not persisting status)
      const merged = applyOverrides(companyList);
      setCompanies(merged);

      // Always compute stats from the complete list (not filtered)
      computeStats(merged);
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

  // Load companies with optional filters (for table display)
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

      // Merge any locally-saved overrides (handles backend not persisting status)
      const merged = applyOverrides(companyList);
      setCompanies(merged);

      // Always compute stats from the merged list
      computeStats(merged);
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
    // Persist locally so page refresh keeps the change
    saveOverride(companyId, newStatus);

    // Update UI immediately
    const updatedCompanies = companies.map(c =>
      (c.company_id || c._id) === companyId ? { ...c, verification_status: newStatus } : c
    );
    setCompanies(updatedCompanies);
    computeStats(updatedCompanies);
    
    // If verified, automatically approve the company
    if (newStatus === 'verified') {
      const company = updatedCompanies.find(c => (c.company_id || c._id) === companyId);
      if (company) {
        handleApproveCompany(company);
      }
    }
  };

  const handleApproveCompany = async (company: Company) => {
    const companyId = company.company_id || company._id;
    if (!companyId) return;

    try {
      // Update company status to APPROVED via company-data endpoint
      await platformAdminApi.updateCompany(companyId, {
        verification_status: 'APPROVED'
      });
      
      // Update local state with APPROVED status
      const updatedCompanies = companies.map(c =>
        (c.company_id || c._id) === companyId 
          ? { ...c, verification_status: 'APPROVED' } 
          : c
      );
      setCompanies(updatedCompanies);
      computeStats(updatedCompanies);
      saveOverride(companyId, 'APPROVED');
      
      showToast(`✓ "${company.company_name}" approved! Dashboard unlocked.`, 'success');
    } catch (err: any) {
      showToast(handleApiError(err) || 'Failed to approve company', 'error');
    }
  };

  const handleDeleteCompany = async () => {
    if (!deleteTarget) return;
    const id = deleteTarget.company_id || deleteTarget._id;
    if (!id) return;
    try {
      setDeleteLoading(true);
      await platformAdminApi.deleteCompany(id);
      
      const updatedCompanies = companies.filter(c => (c.company_id || c._id) !== id);
      setCompanies(updatedCompanies);
      computeStats(updatedCompanies);
      removeOverride(id);
      
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
    
    // Apply tab filter first - filter for PENDING_APPROVAL status
    if (activeTab === 'pending') {
      filtered = filtered.filter(c => {
        const status = (c.verification_status || 'PENDING_APPROVAL').toUpperCase();
        return status === 'PENDING_APPROVAL' || status === 'PENDING';
      });
    }
    
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
        (c.verification_status || 'PENDING_APPROVAL').toUpperCase() === statusFilter.toUpperCase()
      );
    }
    if (frequencyFilter !== 'all') {
      filtered = filtered.filter(c =>
        c.posting_frequency?.toLowerCase() === frequencyFilter.toLowerCase()
      );
    }
    if (companyTypeFilter !== 'all') {
      filtered = filtered.filter(c => {
        const standardizedType = getStandardizedCompanyType(c);
        return standardizedType.toLowerCase() === companyTypeFilter.toLowerCase();
      });
    }
    setFilteredCompanies(filtered);
  };

  // Apply sorting to filtered results
  const processedCompanies = useMemo(() => {
    if (!filteredCompanies) return [];

    return [...filteredCompanies].sort((a, b) => {
      if (sortBy === "newest") {
        const dateA = new Date(a.verified_at || "0").getTime();
        const dateB = new Date(b.verified_at || "0").getTime();
        return dateB - dateA;
      }
      if (sortBy === "oldest") {
        const dateA = new Date(a.verified_at || "0").getTime();
        const dateB = new Date(b.verified_at || "0").getTime();
        return dateA - dateB;
      }
      if (sortBy === "alpha-asc") {
        const nameA = (a.company_name || "").toLowerCase();
        const nameB = (b.company_name || "").toLowerCase();
        return nameA.localeCompare(nameB);
      }
      if (sortBy === "alpha-desc") {
        const nameA = (a.company_name || "").toLowerCase();
        const nameB = (b.company_name || "").toLowerCase();
        return nameB.localeCompare(nameA);
      }
      return 0;
    });
  }, [filteredCompanies, sortBy]);

  const filterCompanies = () => {
    applyAllFilters(companies);
  };

  const handleExport = () => {
    const csv = [
      ['Company Name', 'Type', 'Location', 'Posting Frequency', 'Career Page', 'Employees', 'Vacancies'],
      ...processedCompanies.map(c => [
        c.company_name,
        getStandardizedCompanyType(c),
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
          <Button onClick={() => { loadAllCompanies(); }} disabled={loading}>
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

      <TabContainer>
        <Tab $active={activeTab === 'all'} onClick={() => setActiveTab('all')}>
          All Companies
        </Tab>
        <Tab $active={activeTab === 'pending'} onClick={() => setActiveTab('pending')}>
          Pending Approvals
          {stats.pending > 0 && <TabBadge>{stats.pending}</TabBadge>}
        </Tab>
      </TabContainer>

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

        <Divider />

        <FilterGroup>
          <FilterLabel>Company Type</FilterLabel>
          <FilterSelect value={companyTypeFilter} onChange={(e) => setCompanyTypeFilter(e.target.value)}>
            <option value="all">All Types</option>
            <option value="employer">Employer</option>
            <option value="startup founder">Startup Founder</option>
            <option value="aggregator">Aggregator</option>
            <option value="ngo / non-profit">NGO / Non-Profit</option>
          </FilterSelect>
        </FilterGroup>

        <Divider />

        <FilterGroup>
          <FilterLabel>Sort By</FilterLabel>
          <FilterSelect value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="newest">Lastly Verified</option>
            <option value="oldest">Oldest Verified</option>
            <option value="alpha-asc">Name: A to Z</option>
            <option value="alpha-desc">Name: Z to A</option>
          </FilterSelect>
        </FilterGroup>
      </FilterBar>

      <TableCard>
        {processedCompanies.length === 0 && !loading ? (
          <LoadingMessage>
            No companies found. {searchQuery || statusFilter !== 'all' || frequencyFilter !== 'all' || companyTypeFilter !== 'all'
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
              {processedCompanies.map((company) => (
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
                    <Badge type={getStandardizedCompanyType(company).toLowerCase()}>
                      {getStandardizedCompanyType(company)}
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
                      
                      {/* Show verify button only for PENDING_APPROVAL companies */}
                      {(!company.verification_status || 
                        company.verification_status.toUpperCase() === 'PENDING_APPROVAL' ||
                        company.verification_status.toUpperCase() === 'PENDING') && (
                        <IconButton
                          title="Verify & Approve Company"
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
        company={selectedCompany as any}
        onClose={handleCloseModal}
        onUpdate={() => {
          loadCompanies();
          handleCloseModal();
        }}
      />

      <VerificationModal
        isOpen={!!verifyModalCompany}
        company={verifyModalCompany as any}
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
