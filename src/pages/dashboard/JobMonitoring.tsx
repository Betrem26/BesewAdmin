import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  FiBriefcase,
  FiDownload,
  FiEye,
  FiCheckCircle,
  FiXCircle,
  FiRefreshCw,
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
import { jobMonitoringApi } from '../../services/monitoringApi';

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
      case 'posted': return '#d4edda';
      case 'closed': return '#f8d7da';
      case 'expired': return '#fff3cd';
      case 'draft': return '#e2e3e5';
      default: return '#d1ecf1';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'active': return '#155724';
      case 'posted': return '#155724';
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

const PageButton = styled.button<{ $active?: boolean }>`
  padding: 8px 12px;
  border: 1px solid ${props => props.$active ? '#3498db' : '#ddd'};
  background: ${props => props.$active ? '#3498db' : 'white'};
  color: ${props => props.$active ? 'white' : '#2c3e50'};
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: ${props => props.$active ? '#2980b9' : '#f8f9fa'};
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

const PipelineWrap = styled.div`
  background: #f8fafc;
  border-radius: 12px;
  padding: 24px;
  margin: 0 24px 24px 24px;
  border: 1px solid #ecf0f1;
`;

const PipelineTitle = styled.div`
  font-size: 15px;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const FunnelList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const FunnelRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const FunnelMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const FunnelLabel = styled.span<{ $color: string }>`
  font-size: 13px;
  font-weight: 600;
  color: ${p => p.$color};
  display: flex;
  align-items: center;
  gap: 6px;
`;

const FunnelCount = styled.span`
  font-size: 13px;
  font-weight: 700;
  color: #2c3e50;
`;

const FunnelPct = styled.span`
  font-size: 11px;
  color: #94a3b8;
`;

const BarTrack = styled.div`
  height: 10px;
  background: #e2e8f0;
  border-radius: 99px;
  overflow: hidden;
`;

const BarFill = styled.div<{ $pct: number; $color: string }>`
  height: 100%;
  width: ${p => p.$pct}%;
  background: ${p => p.$color};
  border-radius: 99px;
  animation: fillBar 0.8s ease-out both;

  @keyframes fillBar {
    from {
      width: 0%;
    }
  }
`;

const SummaryRow = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 20px;
  flex-wrap: wrap;
`;

const SummaryChip = styled.div<{ $bg: string; $color: string }>`
  background: ${p => p.$bg};
  color: ${p => p.$color};
  border-radius: 10px;
  padding: 10px 16px;
  flex: 1;
  min-width: 120px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ChipVal = styled.div`
  font-size: 24px;
  font-weight: 800;
`;

const ChipLabel = styled.div`
  font-size: 12px;
  font-weight: 600;
  opacity: 0.85;
`;

interface Job {
  vacancy_id: string;
  title: string;
  status: string;
  verified: boolean;
  posted: boolean;
  deadline: string;
  filled: boolean;
  archived: boolean;
  posted_by_name: string;
  logo?: string;
  source?: string;
  sourcePlatform?: string;
  aggregatorInfo?: { id: string; name: string; type: string };
  // Location and category fields
  location?: string;
  category?: string;
  description?: string;
  salary_min?: number;
  salary_max?: number;
  currency?: string;
  applications_count?: number;
  views_count?: number;
  posted_date?: string;
  // Additional fields that might contain location
  jobLocation?: { city?: string; country?: string; state?: string };
  job_location?: { city?: string; country?: string; state?: string };
  work_location?: string;
  workLocation?: string;
  workplace_location?: string;
  city?: string;
  country?: string;
  state?: string;
  region?: string;
  // Company location
  company_location?: string;
  companyLocation?: string;
  posted_by_location?: string;
  // Category as object
  job_category?: string | { name?: string; title?: string };
  jobCategory?: string | { name?: string; title?: string };
  category_name?: string;
}

interface JobStats {
  total: number;
  active: number;
  closed: number;
  expired: number;
  total_applications: number;
  avg_applications_per_job: number;
}

interface AppBreakdown {
  applied: number;
  matched: number;
  interviewed: number;
  shortlisted: number;
  hired: number;
  rejected: number;
}

interface ApplicationStats {
  total: number;
  breakdown: AppBreakdown;
  lastUpdated: string;
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Application stats for Hiring Pipeline
  const [appStats, setAppStats] = useState<ApplicationStats | null>(null);
  // Category lookup map: _id → categoryName
  const [categoryMap, setCategoryMap] = useState<Record<string, string>>({});
  const [categoryOptions, setCategoryOptions] = useState<string[]>([]);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);

  useEffect(() => {
    loadCategories();
    loadJobs();
    loadApplicationStats();
  }, []);

  // Load stats whenever jobs change
  useEffect(() => {
    loadStats();
  }, [jobs]);

  // Apply filters and pagination
  const filteredJobs = jobs.filter(job => {
    // Search filter
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = !searchQuery || 
      job.title.toLowerCase().includes(searchLower) ||
      job.posted_by_name.toLowerCase().includes(searchLower) ||
      (job.location && job.location.toLowerCase().includes(searchLower));

    const matchesStatus = statusFilter === 'all' ||
      job.status === statusFilter;

    // Category filter
    const matchesCategory = categoryFilter === 'all' || 
      (job.category && job.category.toLowerCase() === categoryFilter.toLowerCase());

    // Location filter
    const matchesLocation = locationFilter === 'all' || 
      (job.location && job.location.toLowerCase() === locationFilter.toLowerCase());

    return matchesSearch && matchesStatus && matchesCategory && matchesLocation;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const loadCategories = async () => {
    try {
      const res = await jobApi.get('/job-category');
      const cats: { _id: string; categoryName: string; lang_opt?: string }[] = Array.isArray(res.data) ? res.data : [];
      // Build lookup map _id -> categoryName (English only preferred)
      const map: Record<string, string> = {};
      cats.forEach(c => { if (c._id && c.categoryName) map[c._id] = c.categoryName; });
      setCategoryMap(map);
      // Unique English category names for filter dropdown
      const englishNames = [...new Set(
        cats.filter(c => c.lang_opt === 'English' || !c.lang_opt).map(c => c.categoryName).filter(Boolean)
      )].sort();
      setCategoryOptions(englishNames);
    } catch {
      // silent — categories are optional enrichment
    }
  };

  const loadJobs = async () => {
    try {
      setLoading(true);
      setError(null);

      // Use /vacancies/public/posts which returns richer data including location & category
      const [postedRes, expiredRes, closedRes] = await Promise.allSettled([
        jobApi.get('/vacancies/public/posts'),
        jobApi.get('/vacancies/public/posts', { params: { status: 'expired' } }),
        jobApi.get('/vacancies/public/posts', { params: { status: 'closed' } }),
      ]);

      const extract = (res: PromiseSettledResult<any>): Job[] => {
        if (res.status !== 'fulfilled') return [];
        const d = res.value.data;
        if (Array.isArray(d)) return d;
        if (Array.isArray(d?.items)) return d.items;
        if (Array.isArray(d?.data)) return d.data;
        if (Array.isArray(d?.vacancies)) return d.vacancies;
        return [];
      };

      // Merge and deduplicate by vacancy_id
      const merged = [...extract(postedRes), ...extract(expiredRes), ...extract(closedRes)];
      const seen = new Set<string>();
      const jobsData: Job[] = merged.filter((j: any) => {
        const id = j.vacancy_id || j._id;
        if (!id || seen.has(id)) return false;
        seen.add(id);
        return true;
      });

      if (jobsData.length > 0) {
        console.log('[JobMonitoring] ALL FIELDS on first job:', JSON.stringify(jobsData[0], null, 2));
      }

      const enriched = jobsData.map((job: any) => {
        // company name
        const posted_by_name = job.company?.name || job.posted_by_name || 'Unknown';
        // location: API returns { city, country } object
        const loc = job.location;
        const location = typeof loc === 'string' ? loc
          : (loc?.city && loc?.country) ? `${loc.city}, ${loc.country}`
          : loc?.city || loc?.country || job.workingLocation || 'Not specified';
        // category: already a string from API
        const category = typeof job.category === 'string' ? job.category
          : job.category?.name || '';
        // status: normalize — API has no status field, derive from deadline
        const now = new Date();
        const deadline = job.deadline ? new Date(job.deadline) : null;
        const rawStatus = job.status || '';
        const status = rawStatus === 'posted' ? 'active'
          : rawStatus ? rawStatus
          : (deadline && deadline < now ? 'expired' : 'active');
        // salary
        const salary_min = job.salary?.min;
        const salary_max = job.salary?.max;
        const currency = job.salary?.currency;
        // logo
        const logo = job.company?.logo;
        return {
          ...job,
          posted_by_name,
          location,
          category,
          status,
          salary_min,
          salary_max,
          currency,
          logo,
          posted_date: job.postedDate || job.posted_date,
          verified: job.verified ?? true,
          filled: job.filled ?? false,
          applications_count: 0, // will be enriched below
        };
      });

      // Fetch application counts per vacancy in parallel (batched to avoid rate limits)
      const enrichedWithCounts = await Promise.all(
        enriched.map(async (job: any) => {
          try {
            const res = await jobApi.get(`/applied-jobs/job-applicants/${job.vacancy_id}`);
            const data = res.data;
            const count = Array.isArray(data) ? data.length
              : data?.total ?? data?.count ?? data?.length ?? 0;
            return { ...job, applications_count: count };
          } catch {
            return job;
          }
        })
      );

      setJobs(enrichedWithCounts);
      setCurrentPage(1);
    } catch (err: any) {
      console.error('Error loading jobs:', err);
      if (err.response?.status === 403) {
        setError(err.response?.data?.details?.message || 'Access Denied');
      } else {
        setError(handleApiError(err));
      }
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = () => {
    const active  = jobs.filter(j => j.status === 'active').length;
    const closed  = jobs.filter(j => j.status === 'closed').length;
    const expired = jobs.filter(j => j.status === 'expired').length;
    setStats({
      total: jobs.length,
      active,
      closed,
      expired,
      total_applications: jobs.reduce((s, j) => s + (j.applications_count || 0), 0),
      avg_applications_per_job: jobs.length > 0
        ? Math.round(jobs.reduce((s, j) => s + (j.applications_count || 0), 0) / jobs.length)
        : 0,
    });
  };

  const loadApplicationStats = async () => {
    try {
      const data = await jobMonitoringApi.getApplicationStats();
      setAppStats({
        total: data.total || 0,
        breakdown: {
          applied: data.breakdown?.applied || 0,
          matched: data.breakdown?.matched || 0,
          interviewed: data.breakdown?.interviewed || 0,
          shortlisted: data.breakdown?.shortlisted || 0,
          hired: data.breakdown?.hired || 0,
          rejected: data.breakdown?.rejected || 0,
        },
        lastUpdated: data.lastUpdated || new Date().toISOString(),
      });
    } catch {
      setAppStats({
        total: 0,
        breakdown: { applied: 0, matched: 0, interviewed: 0, shortlisted: 0, hired: 0, rejected: 0 },
        lastUpdated: new Date().toISOString(),
      });
    }
  };

  const getJobLocation = (job: Job): string => {
    if (job.location && typeof job.location === 'string' && job.location !== 'Not specified') return job.location;
    const j = job as any;
    const loc = j.location;
    if (loc && typeof loc === 'object') {
      if (loc.city && loc.country) return `${loc.city}, ${loc.country}`;
      if (loc.city) return loc.city;
      if (loc.country) return loc.country;
    }
    return j.workingLocation || 'Not specified';
  };

  const getJobCategory = (job: Job): string => {
    if (job.category && typeof job.category === 'string') return job.category;
    const j = job as any;
    const catId = j.job_category_id || j.category_id || j.jobCategoryId;
    if (catId && categoryMap[catId]) return categoryMap[catId];
    return 'General';
  };

  const handleViewJob = (job: Job) => {
    setSelectedJob(job);
    setModalOpen(true);
  };

  const handleDeleteClick = (vacancyId: string) => {
    setJobToDelete(vacancyId);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!jobToDelete) return;
    
    try {
      setDeleting(true);
      await jobApi.delete(`/vacancies/${jobToDelete}`);
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

  const handleExport = () => {
    const csv = [
      ['Title', 'Posted By', 'Status', 'Verified', 'Deadline'],
      ...jobs.map(j => [
        j.title,
        j.posted_by_name,
        j.status,
        j.verified ? 'Yes' : 'No',
        new Date(j.deadline).toLocaleDateString()
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
          <StatValue>{stats.expired.toLocaleString()}</StatValue>
          <StatLabel>
            <FiClock />
            Expired Posts
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
              {categoryOptions.map(name => (
                <option key={name} value={name}>{name}</option>
              ))}
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
              No jobs available yet. Jobs will appear here once they are posted.
            </EmptyStateText>
          </EmptyState>
        ) : filteredJobs.length === 0 && !loading ? (
          <EmptyState>
            <EmptyStateIcon>
              <FiBriefcase size={48} />
            </EmptyStateIcon>
            <EmptyStateText>
              No jobs found. Try adjusting your filters or search query.
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
                    <Th>Type</Th>
                    <Th>Deadline</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {paginatedJobs.map((job) => {
                    const isExpired = job.status === 'expired';
                    
                    return (
                      <Tr key={job.vacancy_id} style={{ opacity: isExpired ? 0.7 : 1, backgroundColor: isExpired ? '#fef5f5' : 'transparent' }}>
                        <Td>
                          <JobTitle style={{ color: isExpired ? '#a0a0a0' : '#1a202c' }}>
                            {job.title}
                            {isExpired && <span style={{ marginLeft: '8px', fontSize: '11px', color: '#e74c3c', fontWeight: 600 }}>EXPIRED</span>}
                          </JobTitle>
                        </Td>
                        <Td>{job.posted_by_name}</Td>
                        <Td>
                          <JobMeta>
                            <FiMapPin size={12} />
                            {getJobLocation(job)}
                          </JobMeta>
                        </Td>
                        <Td>{getJobCategory(job)}</Td>
                        <Td>
                          <StatusBadge status={job.status}>
                            {job.status === 'active' && <FiCheckCircle size={12} />}
                            {job.status === 'closed' && <FiXCircle size={12} />}
                            {job.status === 'expired' && <FiClock size={12} />}
                            {job.status === 'active' ? 'Active' : job.status}
                          </StatusBadge>
                        </Td>
                        <Td>
                          <MetricBadge>
                            <FiUsers size={12} style={{ marginRight: '4px' }} />
                            {job.applications_count ?? 0}
                          </MetricBadge>
                        </Td>
                        <Td style={{ fontSize: '12px', color: '#7f8c8d' }}>
                          {(job as any).employmentType || '—'}
                        </Td>
                        <Td>{new Date(job.deadline).toLocaleDateString()}</Td>
                        <Td>
                          <ActionButtons>
                            <IconButton onClick={() => handleViewJob(job)} title="View Details">
                              <FiEye size={16} />
                            </IconButton>
                            <IconButton 
                              onClick={() => handleDeleteClick(job.vacancy_id)} 
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
                Showing {filteredJobs.length === 0 ? 0 : ((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredJobs.length)} of {filteredJobs.length} jobs
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
                      $active={currentPage === page}
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

      {/* Hiring Pipeline Section */}
      {appStats && (
        <PipelineWrap>
          <PipelineTitle>
            <FiUsers size={16} color="#3b82f6" />
            Hiring Pipeline — {appStats.total.toLocaleString()} total applications
          </PipelineTitle>

          <FunnelList>
            {[
              { key: 'applied', label: 'Applied', color: '#3b82f6' },
              { key: 'matched', label: 'Matched', color: '#8b5cf6' },
              { key: 'interviewed', label: 'Interviewed', color: '#f59e0b' },
              { key: 'shortlisted', label: 'Shortlisted', color: '#f97316' },
              { key: 'hired', label: 'Hired', color: '#10b981' },
              { key: 'rejected', label: 'Rejected', color: '#ef4444' },
            ].map(stage => {
              const val = appStats.breakdown[stage.key as keyof AppBreakdown];
              const pct = appStats.total > 0 ? (val / appStats.total) * 100 : 0;
              const maxVal = Math.max(...Object.values(appStats.breakdown), 1);
              const barPct = (val / maxVal) * 100;
              
              return (
                <FunnelRow key={stage.key}>
                  <FunnelMeta>
                    <FunnelLabel $color={stage.color}>
                      {stage.key === 'hired' && <FiCheckCircle size={13} />}
                      {stage.key === 'rejected' && <FiXCircle size={13} />}
                      {stage.label}
                    </FunnelLabel>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                      <FunnelCount>{val.toLocaleString()}</FunnelCount>
                      <FunnelPct>{pct.toFixed(1)}%</FunnelPct>
                    </div>
                  </FunnelMeta>
                  <BarTrack>
                    <BarFill $pct={barPct} $color={stage.color} />
                  </BarTrack>
                </FunnelRow>
              );
            })}
          </FunnelList>

          {/* Summary chips */}
          <SummaryRow>
            <SummaryChip $bg="#ecfdf5" $color="#065f46">
              <ChipVal>{appStats.breakdown.hired.toLocaleString()}</ChipVal>
              <ChipLabel>✓ Hired ({appStats.total > 0 ? ((appStats.breakdown.hired / appStats.total) * 100).toFixed(1) : 0}%)</ChipLabel>
            </SummaryChip>
            <SummaryChip $bg="#fef2f2" $color="#991b1b">
              <ChipVal>{appStats.breakdown.rejected.toLocaleString()}</ChipVal>
              <ChipLabel>✗ Rejected ({appStats.total > 0 ? ((appStats.breakdown.rejected / appStats.total) * 100).toFixed(1) : 0}%)</ChipLabel>
            </SummaryChip>
            <SummaryChip $bg="#fffbeb" $color="#92400e">
              <ChipVal>
                {(appStats.breakdown.interviewed + appStats.breakdown.shortlisted).toLocaleString()}
              </ChipVal>
              <ChipLabel>⏳ In Progress</ChipLabel>
            </SummaryChip>
            <SummaryChip $bg="#eff6ff" $color="#1e40af">
              <ChipVal>{appStats.total.toLocaleString()}</ChipVal>
              <ChipLabel>Total Applications</ChipLabel>
            </SummaryChip>
          </SummaryRow>
        </PipelineWrap>
      )}

      <Modal $isOpen={modalOpen}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>
              <FiBriefcase style={{ marginRight: '12px' }} />
              {selectedJob?.title}
            </ModalTitle>
            <CloseButton onClick={() => setModalOpen(false)}>
              <FiX size={24} />
            </CloseButton>
          </ModalHeader>
          
          {selectedJob && (
            <>
              {/* Status Banner */}
              <div style={{
                background: selectedJob.status === 'expired' ? '#fef5f5' : selectedJob.status === 'active' ? '#f0f9ff' : '#f5f5f5',
                border: `2px solid ${selectedJob.status === 'expired' ? '#fecaca' : selectedJob.status === 'active' ? '#bfdbfe' : '#e5e7eb'}`,
                borderRadius: '12px', padding: '16px', marginBottom: '24px',
                display: 'flex', alignItems: 'center', gap: '12px'
              }}>
                <div style={{ fontSize: '24px', display: 'flex', alignItems: 'center' }}>
                  {selectedJob.status === 'expired' ? '⏰' : selectedJob.status === 'active' ? '✓' : '○'}
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700,
                    color: selectedJob.status === 'expired' ? '#dc2626' : selectedJob.status === 'active' ? '#0369a1' : '#6b7280' }}>
                    {selectedJob.status === 'active' ? 'Active Job' : selectedJob.status === 'expired' ? 'Expired Job' : 'Closed Job'}
                  </div>
                  <div style={{ fontSize: '12px', marginTop: '2px',
                    color: selectedJob.status === 'expired' ? '#991b1b' : selectedJob.status === 'active' ? '#164e63' : '#4b5563' }}>
                    {selectedJob.status === 'expired'
                      ? `Expired on ${new Date(selectedJob.deadline).toLocaleDateString()}`
                      : selectedJob.status === 'active'
                      ? `Deadline: ${new Date(selectedJob.deadline).toLocaleDateString()}`
                      : 'This job posting is no longer accepting applications'}
                  </div>
                </div>
              </div>

              {/* Basic Information */}
              <ModalSection>
                <ModalSectionTitle>
                  <FiBriefcase size={16} />
                  Basic Information
                </ModalSectionTitle>
                <ModalGrid>
                  <ModalField>
                    <ModalFieldLabel>Job Title</ModalFieldLabel>
                    <ModalFieldValue>{selectedJob.title}</ModalFieldValue>
                  </ModalField>
                  <ModalField>
                    <ModalFieldLabel>Company</ModalFieldLabel>
                    <ModalFieldValue>{selectedJob.posted_by_name}</ModalFieldValue>
                  </ModalField>
                  <ModalField>
                    <ModalFieldLabel>Location</ModalFieldLabel>
                    <ModalFieldValue style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <FiMapPin size={14} />
                      {getJobLocation(selectedJob)}
                    </ModalFieldValue>
                  </ModalField>
                  <ModalField>
                    <ModalFieldLabel>Category</ModalFieldLabel>
                    <ModalFieldValue>{getJobCategory(selectedJob)}</ModalFieldValue>
                  </ModalField>
                </ModalGrid>
              </ModalSection>

              {/* Verification & Status */}
              <ModalSection>
                <ModalSectionTitle>
                  <FiCheckCircle size={16} />
                  Verification & Status
                </ModalSectionTitle>
                <ModalGrid>
                  <ModalField>
                    <ModalFieldLabel>Verification Status</ModalFieldLabel>
                    <ModalFieldValue style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: selectedJob.verified ? '#ecfdf5' : '#fef3c7',
                      color: selectedJob.verified ? '#065f46' : '#92400e',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '13px',
                      fontWeight: 600,
                      width: 'fit-content'
                    }}>
                      {selectedJob.verified ? '✓ Verified' : '⏳ Pending'}
                    </ModalFieldValue>
                  </ModalField>
                  <ModalField>
                    <ModalFieldLabel>Job Status</ModalFieldLabel>
                    <ModalFieldValue>
                      <StatusBadge status={selectedJob.status}>
                        {selectedJob.status === 'active' ? 'Active' : selectedJob.status}
                      </StatusBadge>
                    </ModalFieldValue>
                  </ModalField>
                  <ModalField>
                    <ModalFieldLabel>Posted Date</ModalFieldLabel>
                    <ModalFieldValue>{new Date((selectedJob as any).posted_date || selectedJob.deadline).toLocaleString()}</ModalFieldValue>
                  </ModalField>
                  <ModalField>
                    <ModalFieldLabel>Deadline</ModalFieldLabel>
                    <ModalFieldValue>{new Date(selectedJob.deadline).toLocaleString()}</ModalFieldValue>
                  </ModalField>
                </ModalGrid>
              </ModalSection>

              {/* Engagement Metrics */}
              <ModalSection>
                <ModalSectionTitle><FiBarChart2 size={16} />Engagement Metrics</ModalSectionTitle>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
                  <div style={{ background: '#f0f9ff', border: '1px solid #bfdbfe', borderRadius: '10px', padding: '16px', textAlign: 'center' }}>
                    <div style={{ fontSize: '28px', fontWeight: 800, color: '#0369a1' }}>{selectedJob.applications_count ?? 0}</div>
                    <div style={{ fontSize: '12px', color: '#0c4a6e', fontWeight: 600, marginTop: '4px' }}>Applications</div>
                  </div>
                  <div style={{ background: '#f0fff4', border: '1px solid #9ae6b4', borderRadius: '10px', padding: '16px', textAlign: 'center' }}>
                    <div style={{ fontSize: '20px', fontWeight: 700, color: '#276749' }}>{(selectedJob as any).employmentType || '—'}</div>
                    <div style={{ fontSize: '12px', color: '#276749', fontWeight: 600, marginTop: '4px' }}>Employment Type</div>
                  </div>
                  <div style={{ background: '#fef3c7', border: '1px solid #fcd34d', borderRadius: '10px', padding: '16px', textAlign: 'center' }}>
                    <div style={{ fontSize: '20px', fontWeight: 700, color: '#d97706' }}>{(selectedJob as any).workingLocation || '—'}</div>
                    <div style={{ fontSize: '12px', color: '#92400e', fontWeight: 600, marginTop: '4px' }}>Work Location</div>
                  </div>
                </div>
              </ModalSection>

              {/* Salary Information */}
              {(selectedJob.salary_min || selectedJob.salary_max) && (
                <ModalSection>
                  <ModalSectionTitle>
                    <FiDollarSign size={16} />
                    Salary & Compensation
                  </ModalSectionTitle>
                  <ModalGrid>
                    <ModalField>
                      <ModalFieldLabel>Salary Range</ModalFieldLabel>
                      <ModalFieldValue style={{
                        fontSize: '16px',
                        fontWeight: 700,
                        color: '#059669'
                      }}>
                        {selectedJob.currency || 'USD'} {selectedJob.salary_min?.toLocaleString() || '—'} - {selectedJob.salary_max?.toLocaleString() || '—'}
                      </ModalFieldValue>
                    </ModalField>
                  </ModalGrid>
                </ModalSection>
              )}

              {/* Description */}
              {selectedJob.description && (
                <ModalSection>
                  <ModalSectionTitle>
                    <FiBarChart2 size={16} />
                    Job Description
                  </ModalSectionTitle>
                  <div style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '10px',
                    padding: '16px',
                    fontSize: '14px',
                    lineHeight: '1.6',
                    color: '#2c3e50',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word'
                  }}>
                    {selectedJob.description}
                  </div>
                </ModalSection>
              )}

              {/* Action Buttons */}
              <div style={{
                display: 'flex',
                gap: '12px',
                marginTop: '28px',
                paddingTop: '20px',
                borderTop: '1px solid #ecf0f1'
              }}>
                <Button 
                  onClick={() => setModalOpen(false)}
                  style={{ flex: 1 }}
                >
                  Close
                </Button>
                <Button 
                  variant="danger"
                  onClick={() => {
                    setModalOpen(false);
                    handleDeleteClick(selectedJob.vacancy_id);
                  }}
                  style={{ flex: 1 }}
                >
                  Delete Job
                </Button>
              </div>
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
