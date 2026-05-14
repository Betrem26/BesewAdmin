import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  FiX, FiCheck, FiAlertCircle, FiBriefcase, FiCheckCircle, FiXCircle,
  FiMapPin, FiUsers, FiMessageSquare, FiUpload, FiGlobe,
  FiPhone, FiAward, FiTrendingUp, FiTarget, FiShield, FiCamera, FiLoader, FiEdit
} from 'react-icons/fi';
import { partyApi, handleApiError } from '../services/api';
import platformAdminApi from '../services/platformAdminApi';

// ── STYLED COMPONENTS ──

const Modal = styled.div<{ $isOpen: boolean }>`
  display: ${p => p.$isOpen ? 'flex' : 'none'};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  max-width: 1200px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  
  @media (max-width: 768px) {
    max-width: 100%;
    border-radius: 8px;
  }
`;

// ── HEADER SECTION ──

const HeaderSection = styled.div`
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  color: white;
  padding: 40px;
  position: relative;
  border-radius: 12px 12px 0 0;
  
  @media (max-width: 768px) {
    padding: 24px;
  }
`;

const HeaderTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const LogoImage = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  object-fit: cover;
  border: 3px solid rgba(255, 255, 255, 0.2);
`;

const LogoPlaceholder = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed rgba(255, 255, 255, 0.3);
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
`;

const CompanyInfo = styled.div`
  flex: 1;
`;

const CompanyName = styled.h1`
  font-size: 32px;
  font-weight: 700;
  margin: 0 0 12px 0;
  color: white;
  
  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const MetadataBadges = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
`;

const Badge = styled.span<{ $variant?: 'verified' | 'pending' | 'rejected' | 'default' }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  background: ${p => {
    switch(p.$variant) {
      case 'verified': return 'rgba(46, 204, 113, 0.2)';
      case 'rejected': return 'rgba(231, 76, 60, 0.2)';
      case 'pending': return 'rgba(241, 196, 15, 0.2)';
      default: return 'rgba(255, 255, 255, 0.15)';
    }
  }};
  color: ${p => {
    switch(p.$variant) {
      case 'verified': return '#2ecc71';
      case 'rejected': return '#e74c3c';
      case 'pending': return '#f39c12';
      default: return 'rgba(255, 255, 255, 0.9)';
    }
  }};
`;

const CloseButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  transition: all 0.2s;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

// ── CONTENT LAYOUT ──

const ContentWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 24px;
  padding: 32px;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
  
  @media (max-width: 768px) {
    padding: 20px;
    gap: 16px;
  }
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  
  @media (max-width: 1024px) {
    grid-column: 1 / -1;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }
`;

// ── CARD COMPONENTS ──

const Card = styled.div`
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  padding: 20px;
  transition: all 0.2s;
  
  &:hover {
    border-color: #3498db;
    box-shadow: 0 4px 12px rgba(52, 152, 219, 0.1);
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 2px solid #f0f0f0;
  
  svg {
    font-size: 20px;
    color: #3498db;
  }
  
  h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: #2c3e50;
  }
`;

// ── QUICK FACTS SIDEBAR ──

const QuickFactItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
  
  &:last-child {
    border-bottom: none;
  }
  
  svg {
    font-size: 18px;
    color: #3498db;
    margin-top: 2px;
    flex-shrink: 0;
  }
`;

const QuickFactLabel = styled.div`
  font-size: 12px;
  color: #7f8c8d;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const QuickFactValue = styled.div`
  font-size: 14px;
  color: #2c3e50;
  font-weight: 600;
  margin-top: 4px;
  word-break: break-word;
  
  a {
    color: #3498db;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

// ── STATS GRID ──

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
  margin-bottom: 16px;
`;

const StatBox = styled.div`
  background: linear-gradient(135deg, #f5f7fa 0%, #f0f2f5 100%);
  border-radius: 8px;
  padding: 16px;
  text-align: center;
  border: 1px solid #e0e0e0;
  
  svg {
    font-size: 24px;
    color: #3498db;
    margin-bottom: 8px;
  }
`;

const StatValue = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: #2c3e50;
`;

const StatLabel = styled.div`
  font-size: 11px;
  color: #7f8c8d;
  margin-top: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

// ── DESCRIPTION SECTION ──

const DescriptionText = styled.p`
  color: #555;
  line-height: 1.6;
  margin: 0;
  font-size: 14px;
`;

// ── TAGS ──

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
`;

const Tag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%);
  border: 1px solid #bbdefb;
  border-radius: 20px;
  font-size: 12px;
  color: #1976d2;
  font-weight: 500;
`;

// ── ACTION BUTTONS ──

const ActionBar = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' | 'danger' }>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  
  background: ${p => {
    switch(p.$variant) {
      case 'primary': return '#3498db';
      case 'danger': return '#e74c3c';
      default: return '#ecf0f1';
    }
  }};
  
  color: ${p => {
    switch(p.$variant) {
      case 'primary': return 'white';
      case 'danger': return 'white';
      default: return '#2c3e50';
    }
  }};
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  svg {
    font-size: 16px;
  }
`;

// ── MESSAGE ALERTS ──

const MessageAlert = styled.div<{ $type: 'success' | 'error' }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 6px;
  margin-bottom: 16px;
  background: ${p => p.$type === 'success' ? '#d4edda' : '#f8d7da'};
  color: ${p => p.$type === 'success' ? '#155724' : '#721c24'};
  border: 1px solid ${p => p.$type === 'success' ? '#c3e6cb' : '#f5c6cb'};
  
  svg {
    font-size: 18px;
    flex-shrink: 0;
  }
`;

// ── VERIFICATION BADGE ──

const VerificationBadge = styled.div<{ $status: string }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: ${p => {
    switch(p.$status?.toLowerCase()) {
      case 'verified': return '#d4edda';
      case 'rejected': return '#f8d7da';
      default: return '#fff3cd';
    }
  }};
  border: 1px solid ${p => {
    switch(p.$status?.toLowerCase()) {
      case 'verified': return '#c3e6cb';
      case 'rejected': return '#f5c6cb';
      default: return '#ffeaa7';
    }
  }};
  border-radius: 8px;
  
  svg {
    font-size: 24px;
    color: ${p => {
      switch(p.$status?.toLowerCase()) {
        case 'verified': return '#28a745';
        case 'rejected': return '#dc3545';
        default: return '#ffc107';
      }
    }};
  }
`;

// ── FILE INPUT ──

const FileInput = styled.input`
  display: none;
`;

// ── LOGO EDIT MODAL ──

const LogoEditOverlay = styled.div<{ $show: boolean }>`
  display: ${p => p.$show ? 'flex' : 'none'};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 2000;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const LogoEditModal = styled.div`
  background: white;
  border-radius: 12px;
  padding: 32px;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
`;

const LogoEditTitle = styled.h3`
  margin: 0 0 24px 0;
  font-size: 20px;
  font-weight: 600;
  color: #2c3e50;
`;

const LogoPreviewContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
`;

const LogoPreviewCircle = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f5f7fa 0%, #f0f2f5 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid #e0e0e0;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const LogoInputGroup = styled.div`
  margin-bottom: 20px;
`;

const LogoInputLabel = styled.label`
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const LogoInput = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  transition: all 0.2s;
  
  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
  }
`;

const LogoEditActions = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;

const LogoEditButton = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  
  background: ${p => p.$variant === 'primary' ? '#3498db' : '#ecf0f1'};
  color: ${p => p.$variant === 'primary' ? 'white' : '#2c3e50'};
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  svg {
    font-size: 16px;
  }
`;

// ── LOGO EDIT BUTTON OVERLAY ──

const LogoEditButtonOverlay = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 40px;
  height: 40px;
  background: #3498db;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
  
  &:hover {
    background: #2980b9;
    transform: scale(1.1);
  }
  
  svg {
    font-size: 18px;
  }
`;

const LogoEditContainer = styled.div`
  position: relative;
  display: inline-block;
`;

// ── DELETE CONFIRMATION MODAL ──

const DeleteConfirmOverlay = styled.div<{ $show: boolean }>`
  display: ${p => p.$show ? 'flex' : 'none'};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 2000;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const DeleteConfirmModal = styled.div`
  background: white;
  border-radius: 12px;
  padding: 32px;
  max-width: 450px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
`;

const DeleteConfirmIcon = styled.div`
  width: 60px;
  height: 60px;
  background: #fee;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  
  svg {
    font-size: 32px;
    color: #dc3545;
  }
`;

const DeleteConfirmTitle = styled.h3`
  margin: 0 0 12px 0;
  font-size: 20px;
  font-weight: 700;
  color: #2c3e50;
  text-align: center;
`;

const DeleteConfirmText = styled.p`
  margin: 0 0 24px 0;
  font-size: 14px;
  color: #555;
  text-align: center;
  line-height: 1.6;
`;

const DeleteConfirmActions = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;

// ── COMPONENT ──

interface Company {
  company_id?: string;
  _id?: string;
  company_name: string;
  company_description?: string;
  company_type?: { name: string };
  company_level?: { name: string };
  liscence_number?: string;
  tin_number?: string;
  location?: string;
  city?: string;
  region?: string;
  phone_number?: string;
  website?: string;
  total_employee?: number;
  total_vacancy?: number;
  posting_frequency?: string;
  has_career_page?: boolean;
  career_page_url?: string;
  specialized_in?: string;
  mission?: string;
  vision?: string;
  values?: string[];
  culture_attributes?: string[];
  verification_status?: string;
  verification_reason?: string;
  verified_at?: string;
  logo?: string;
  feedback_count?: number;
  report_count?: number;
}

interface Props {
  isOpen: boolean;
  company: Company | null;
  onClose: () => void;
  onUpdate?: () => void;
}

const CompanyDetailRefactored: React.FC<Props> = ({ isOpen, company, onClose, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [docsChecked, setDocsChecked] = useState(false);
  const [showRejectReason, setShowRejectReason] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [showClarification, setShowClarification] = useState(false);
  const [clarificationNote, setClarificationNote] = useState('');
  const [showLogoEdit, setShowLogoEdit] = useState(false);
  const [logoUrl, setLogoUrl] = useState('');
  const [logoLoading, setLogoLoading] = useState(false);
  const [localCompany, setLocalCompany] = useState<Company | null>(company);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  if (!company) return null;

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      setMessage(null);

      const formData = new FormData();
      formData.append('logo', file);

      const companyId = company.company_id || company._id;
      await partyApi.put(`/company-data/company-logo/${companyId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setMessage({ type: 'success', text: 'Logo updated successfully!' });
      onUpdate?.();
    } catch (err: any) {
      setMessage({ type: 'error', text: handleApiError(err) });
    } finally {
      setLoading(false);
    }
  };

  const handleLogoUrlUpdate = async () => {
    if (!logoUrl.trim()) {
      setMessage({ type: 'error', text: 'Please enter a valid logo URL' });
      return;
    }

    try {
      setLogoLoading(true);
      setMessage(null);

      const companyId = company.company_id || company._id;
      
      // Update via platform admin API
      const response = await platformAdminApi.updateCompany(companyId, {
        logo: logoUrl.trim()
      });

      // Update local state immediately
      setLocalCompany(prev => prev ? { ...prev, logo: logoUrl.trim() } : null);
      
      setMessage({ type: 'success', text: 'Logo updated successfully!' });
      setShowLogoEdit(false);
      
      // Notify parent to refresh
      onUpdate?.();
    } catch (err: any) {
      setMessage({ type: 'error', text: handleApiError(err) });
    } finally {
      setLogoLoading(false);
    }
  };

  const handleVerifyCompany = async (status: 'verified' | 'rejected') => {
    try {
      setLoading(true);
      setMessage(null);

      const companyId = company.company_id || company._id;
      const reason = status === 'verified'
        ? 'Manually verified by platform admin'
        : (rejectReason.trim() || 'Rejected by platform admin');

      await platformAdminApi.verifyCompany(companyId, status, reason);

      setMessage({ type: 'success', text: `Company ${status} successfully!` });
      setDocsChecked(false);
      setShowRejectReason(false);
      setRejectReason('');
      setShowClarification(false);
      setClarificationNote('');
      onUpdate?.();
    } catch (err: any) {
      setMessage({ type: 'error', text: handleApiError(err) });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCompany = async () => {
    try {
      setLoading(true);
      setMessage(null);

      const companyId = company.company_id || company._id;
      await platformAdminApi.deleteCompany(companyId);

      setMessage({ type: 'success', text: 'Company deleted successfully!' });
      setShowDeleteConfirm(false);
      
      // Close modal after 1.5 seconds
      setTimeout(() => {
        onClose();
        onUpdate?.();
      }, 1500);
    } catch (err: any) {
      setMessage({ type: 'error', text: handleApiError(err) });
    } finally {
      setLoading(false);
    }
  };

  const getVerificationBadgeVariant = (status?: string) => {
    if (!status) return 'default';
    const lower = status.toLowerCase();
    if (lower === 'verified') return 'verified';
    if (lower === 'rejected') return 'rejected';
    return 'pending';
  };

  return (
    <Modal $isOpen={isOpen}>
      <ModalContent>
        {/* HEADER */}
        <HeaderSection>
          <HeaderTop>
            <LogoContainer>
              {company.logo ? (
                <LogoImage src={company.logo} alt={company.company_name} />
              ) : (
                <LogoPlaceholder>
                  <FiBriefcase />
                </LogoPlaceholder>
              )}
              <CompanyInfo>
                <CompanyName>{company.company_name}</CompanyName>
                <MetadataBadges>
                  <Badge $variant={getVerificationBadgeVariant(company.verification_status)}>
                    {company.verification_status?.toUpperCase() === 'VERIFIED' && <FiCheckCircle />}
                    {company.verification_status?.toUpperCase() === 'REJECTED' && <FiXCircle />}
                    {(!company.verification_status || !['VERIFIED','REJECTED'].includes(company.verification_status.toUpperCase())) && <FiAlertCircle />}
                    {company.verification_status?.charAt(0).toUpperCase() + company.verification_status?.slice(1).toLowerCase()}
                  </Badge>
                  {company.company_type?.name && (
                    <Badge $variant="default">
                      <FiAward /> {company.company_type.name}
                    </Badge>
                  )}
                  {company.city && (
                    <Badge $variant="default">
                      <FiMapPin /> {company.city}
                    </Badge>
                  )}
                  {company.total_employee && (
                    <Badge $variant="default">
                      <FiUsers /> {company.total_employee} Employees
                    </Badge>
                  )}
                </MetadataBadges>
              </CompanyInfo>
            </LogoContainer>
            <CloseButton onClick={onClose}>
              <FiX />
            </CloseButton>
          </HeaderTop>
        </HeaderSection>

        {/* MESSAGE ALERTS */}
        {message && (
          <div style={{ padding: '0 32px', paddingTop: '16px' }}>
            <MessageAlert $type={message.type}>
              {message.type === 'success' ? <FiCheck /> : <FiAlertCircle />}
              {message.text}
            </MessageAlert>
          </div>
        )}

        {/* MAIN CONTENT */}
        <ContentWrapper>
          <MainContent>
            {/* DESCRIPTION */}
            {company.company_description && (
              <Card>
                <CardHeader>
                  <FiBriefcase />
                  <h3>About Company</h3>
                </CardHeader>
                <DescriptionText>{company.company_description}</DescriptionText>
              </Card>
            )}

            {/* OPERATIONS STATS */}
            <Card>
              <CardHeader>
                <FiTrendingUp />
                <h3>Operations Overview</h3>
              </CardHeader>
              <StatsGrid>
                <StatBox>
                  <FiUsers />
                  <StatValue>{company.total_employee || 0}</StatValue>
                  <StatLabel>Employees</StatLabel>
                </StatBox>
                <StatBox>
                  <FiTarget />
                  <StatValue>{company.total_vacancy || 0}</StatValue>
                  <StatLabel>Open Vacancies</StatLabel>
                </StatBox>
                <StatBox>
                  <FiTrendingUp />
                  <StatValue>{company.posting_frequency || 'N/A'}</StatValue>
                  <StatLabel>Posting Freq</StatLabel>
                </StatBox>
              </StatsGrid>
            </Card>

            {/* CULTURE & VALUES */}
            {(company.mission || company.vision || company.values || company.culture_attributes) && (
              <Card>
                <CardHeader>
                  <FiUsers />
                  <h3>Culture & Values</h3>
                </CardHeader>
                {company.mission && (
                  <div style={{ marginBottom: '16px' }}>
                    <strong style={{ color: '#2c3e50', fontSize: '13px' }}>Mission</strong>
                    <DescriptionText style={{ marginTop: '6px' }}>{company.mission}</DescriptionText>
                  </div>
                )}
                {company.vision && (
                  <div style={{ marginBottom: '16px' }}>
                    <strong style={{ color: '#2c3e50', fontSize: '13px' }}>Vision</strong>
                    <DescriptionText style={{ marginTop: '6px' }}>{company.vision}</DescriptionText>
                  </div>
                )}
                {(company.values || company.culture_attributes) && (
                  <div>
                    <strong style={{ color: '#2c3e50', fontSize: '13px' }}>Core Values & Attributes</strong>
                    <TagsContainer>
                      {company.values?.map((v, i) => <Tag key={`v-${i}`}>{v}</Tag>)}
                      {company.culture_attributes?.map((a, i) => <Tag key={`a-${i}`}>{a}</Tag>)}
                    </TagsContainer>
                  </div>
                )}
              </Card>
            )}

            {/* VERIFICATION & ACTIONS */}
            {company.verification_status && (
              <Card>
                <CardHeader>
                  <FiShield />
                  <h3>Verification Status</h3>
                </CardHeader>
                <VerificationBadge $status={company.verification_status}>
                  {company.verification_status?.toUpperCase() === 'VERIFIED' && <FiCheckCircle />}
                  {company.verification_status?.toUpperCase() === 'REJECTED' && <FiXCircle />}
                  {(!company.verification_status || !['VERIFIED','REJECTED'].includes(company.verification_status.toUpperCase())) && <FiAlertCircle />}
                  <div>
                    <strong style={{ textTransform: 'capitalize' }}>
                      {company.verification_status?.toLowerCase()}
                    </strong>
                    {company.verification_reason && (
                      <div style={{ fontSize: '12px', marginTop: '4px', opacity: 0.8 }}>
                        {company.verification_reason}
                      </div>
                    )}
                  </div>
                </VerificationBadge>
                {(!company.verification_status || !['VERIFIED','REJECTED'].includes(company.verification_status.toUpperCase())) && (
                  <ActionBar style={{ flexDirection: 'column', gap: '12px' }}>
                    {/* Checklist */}
                    <label style={{
                      display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer',
                      padding: '12px 14px', borderRadius: '8px',
                      background: docsChecked ? '#f0fdf4' : '#fffbeb',
                      border: `1px solid ${docsChecked ? '#86efac' : '#fcd34d'}`,
                      width: '100%', boxSizing: 'border-box'
                    }}>
                      <input
                        type="checkbox"
                        checked={docsChecked}
                        onChange={e => setDocsChecked(e.target.checked)}
                        style={{ marginTop: '2px', width: '15px', height: '15px', cursor: 'pointer', accentColor: '#16a34a' }}
                      />
                      <span style={{ fontSize: '13px', color: '#374151', fontWeight: 500, lineHeight: 1.5 }}>
                        I have verified the legal documents (TIN, License, and supporting files).
                      </span>
                    </label>

                    {/* Rejection reason textarea */}
                    {showRejectReason && (
                      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>
                          Rejection Reason <span style={{ color: '#ef4444' }}>*</span>
                        </span>
                        <textarea
                          value={rejectReason}
                          onChange={e => setRejectReason(e.target.value)}
                          placeholder="Provide a clear reason for rejection..."
                          rows={3}
                          style={{
                            padding: '10px 12px', border: '1px solid #fca5a5', borderRadius: '8px',
                            fontSize: '13px', resize: 'vertical', outline: 'none',
                            background: '#fff5f5', color: '#374151', fontFamily: 'inherit', width: '100%', boxSizing: 'border-box'
                          }}
                        />
                      </div>
                    )}

                    {/* Clarification textarea */}
                    {showClarification && (
                      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>Clarification Request</span>
                        <textarea
                          value={clarificationNote}
                          onChange={e => setClarificationNote(e.target.value)}
                          placeholder="Describe what additional information or documents are needed..."
                          rows={3}
                          style={{
                            padding: '10px 12px', border: '1px solid #93c5fd', borderRadius: '8px',
                            fontSize: '13px', resize: 'vertical', outline: 'none',
                            background: '#eff6ff', color: '#374151', fontFamily: 'inherit', width: '100%', boxSizing: 'border-box'
                          }}
                        />
                        <span style={{ fontSize: '12px', color: '#6b7280' }}>Recorded for admin reference. Notify the company separately.</span>
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      <Button
                        $variant="primary"
                        onClick={() => handleVerifyCompany('verified')}
                        disabled={!docsChecked || loading}
                      >
                        <FiCheck />
                        Approve
                      </Button>
                      {!showRejectReason ? (
                        <Button
                          $variant="danger"
                          onClick={() => { setShowRejectReason(true); setShowClarification(false); }}
                          disabled={loading}
                        >
                          <FiXCircle />
                          Reject
                        </Button>
                      ) : (
                        <Button
                          $variant="danger"
                          onClick={() => handleVerifyCompany('rejected')}
                          disabled={!rejectReason.trim() || loading}
                        >
                          <FiXCircle />
                          Confirm Reject
                        </Button>
                      )}
                      <Button
                        onClick={() => { setShowClarification(v => !v); setShowRejectReason(false); }}
                        disabled={loading}
                        style={{ background: showClarification ? '#eff6ff' : undefined, color: '#2563eb', border: '1px solid #93c5fd' }}
                      >
                        <FiMessageSquare />
                        Clarification
                      </Button>
                      <Button
                        $variant="danger"
                        onClick={() => setShowDeleteConfirm(true)}
                        disabled={loading}
                        style={{ marginLeft: 'auto', background: '#dc3545' }}
                      >
                        <FiX />
                        Delete Company
                      </Button>
                    </div>
                  </ActionBar>
                )}
              </Card>
            )}
          </MainContent>

          {/* SIDEBAR - QUICK FACTS */}
          <Sidebar>
            <Card>
              <CardHeader>
                <FiAward />
                <h3>Quick Facts</h3>
              </CardHeader>
              
              {company.tin_number && (
                <QuickFactItem>
                  <FiTarget />
                  <div>
                    <QuickFactLabel>TIN Number</QuickFactLabel>
                    <QuickFactValue>{company.tin_number}</QuickFactValue>
                  </div>
                </QuickFactItem>
              )}
              
              {company.liscence_number && (
                <QuickFactItem>
                  <FiAward />
                  <div>
                    <QuickFactLabel>License</QuickFactLabel>
                    <QuickFactValue>{company.liscence_number}</QuickFactValue>
                  </div>
                </QuickFactItem>
              )}
              
              {company.phone_number && (
                <QuickFactItem>
                  <FiPhone />
                  <div>
                    <QuickFactLabel>Phone</QuickFactLabel>
                    <QuickFactValue>
                      <a href={`tel:${company.phone_number}`}>{company.phone_number}</a>
                    </QuickFactValue>
                  </div>
                </QuickFactItem>
              )}
              
              {company.website && (
                <QuickFactItem>
                  <FiGlobe />
                  <div>
                    <QuickFactLabel>Website</QuickFactLabel>
                    <QuickFactValue>
                      <a href={company.website} target="_blank" rel="noopener noreferrer">
                        Visit Site
                      </a>
                    </QuickFactValue>
                  </div>
                </QuickFactItem>
              )}
              
              {company.location && (
                <QuickFactItem>
                  <FiMapPin />
                  <div>
                    <QuickFactLabel>Location</QuickFactLabel>
                    <QuickFactValue>{company.location}</QuickFactValue>
                  </div>
                </QuickFactItem>
              )}
            </Card>

            {/* LOGO MANAGEMENT */}
            <Card>
              <CardHeader>
                <FiUpload />
                <h3>Logo</h3>
              </CardHeader>
              <div style={{ textAlign: 'center' }}>
                <LogoEditContainer style={{ justifyContent: 'center', marginBottom: '16px' }}>
                  {company.logo ? (
                    <>
                      <img 
                        src={company.logo} 
                        alt={company.company_name}
                        style={{ maxWidth: '100%', height: 'auto', borderRadius: '6px' }}
                      />
                      <LogoEditButtonOverlay onClick={() => {
                        setLogoUrl(company.logo || '');
                        setShowLogoEdit(true);
                      }}>
                        <FiCamera />
                      </LogoEditButtonOverlay>
                    </>
                  ) : (
                    <div style={{ 
                      padding: '24px', 
                      background: '#f5f7fa', 
                      borderRadius: '6px',
                      color: '#7f8c8d',
                      position: 'relative'
                    }}>
                      No Logo
                      <LogoEditButtonOverlay onClick={() => {
                        setLogoUrl('');
                        setShowLogoEdit(true);
                      }}>
                        <FiCamera />
                      </LogoEditButtonOverlay>
                    </div>
                  )}
                </LogoEditContainer>
                <Button 
                  onClick={() => fileInputRef.current?.click()} 
                  disabled={loading}
                  style={{ width: '100%', justifyContent: 'center', marginBottom: '8px' }}
                >
                  <FiUpload />
                  Upload File
                </Button>
                <Button 
                  onClick={() => {
                    setLogoUrl(company.logo || '');
                    setShowLogoEdit(true);
                  }} 
                  disabled={loading}
                  style={{ width: '100%', justifyContent: 'center', background: '#8e44ad', color: 'white' }}
                >
                  <FiEdit />
                  Edit URL
                </Button>
                <FileInput
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png"
                  onChange={handleLogoUpload}
                />
              </div>
            </Card>

            {/* FEEDBACK & REPORTS */}
            {(company.feedback_count !== undefined || company.report_count !== undefined) && (
              <Card>
                <CardHeader>
                  <FiMessageSquare />
                  <h3>Community</h3>
                </CardHeader>
                <StatsGrid>
                  <StatBox>
                    <FiMessageSquare />
                    <StatValue>{company.feedback_count || 0}</StatValue>
                    <StatLabel>Feedback</StatLabel>
                  </StatBox>
                  <StatBox>
                    <FiAlertCircle />
                    <StatValue>{company.report_count || 0}</StatValue>
                    <StatLabel>Reports</StatLabel>
                  </StatBox>
                </StatsGrid>
              </Card>
            )}
          </Sidebar>
        </ContentWrapper>
      </ModalContent>

      {/* LOGO EDIT MODAL */}
      <LogoEditOverlay $show={showLogoEdit} onClick={() => setShowLogoEdit(false)}>
        <LogoEditModal onClick={(e) => e.stopPropagation()}>
          <LogoEditTitle>Edit Logo URL</LogoEditTitle>
          
          <LogoPreviewContainer>
            <LogoPreviewCircle>
              {logoUrl ? (
                <img src={logoUrl} alt="Logo preview" onError={() => {}} />
              ) : (
                <FiBriefcase style={{ fontSize: '40px', color: '#bdc3c7' }} />
              )}
            </LogoPreviewCircle>
          </LogoPreviewContainer>

          <LogoInputGroup>
            <LogoInputLabel>Logo URL</LogoInputLabel>
            <LogoInput
              type="url"
              placeholder="https://example.com/logo.png"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              disabled={logoLoading}
            />
            <div style={{ fontSize: '12px', color: '#7f8c8d', marginTop: '6px' }}>
              Enter a valid image URL (JPG, PNG). The preview will update as you type.
            </div>
          </LogoInputGroup>

          <LogoEditActions>
            <LogoEditButton 
              $variant="secondary"
              onClick={() => setShowLogoEdit(false)}
              disabled={logoLoading}
            >
              Cancel
            </LogoEditButton>
            <LogoEditButton 
              $variant="primary"
              onClick={handleLogoUrlUpdate}
              disabled={logoLoading || !logoUrl.trim()}
            >
              {logoLoading ? (
                <>
                  <FiLoader style={{ animation: 'spin 1s linear infinite' }} />
                  Updating...
                </>
              ) : (
                <>
                  <FiCheck />
                  Update Logo
                </>
              )}
            </LogoEditButton>
          </LogoEditActions>
        </LogoEditModal>
      </LogoEditOverlay>

      {/* DELETE CONFIRMATION MODAL */}
      <DeleteConfirmOverlay $show={showDeleteConfirm} onClick={() => setShowDeleteConfirm(false)}>
        <DeleteConfirmModal onClick={(e) => e.stopPropagation()}>
          <DeleteConfirmIcon>
            <FiAlertCircle />
          </DeleteConfirmIcon>
          <DeleteConfirmTitle>Delete Company?</DeleteConfirmTitle>
          <DeleteConfirmText>
            Are you sure you want to delete <strong>{company.company_name}</strong>? This action cannot be undone and all associated data will be permanently removed.
          </DeleteConfirmText>
          <DeleteConfirmActions>
            <LogoEditButton 
              $variant="secondary"
              onClick={() => setShowDeleteConfirm(false)}
              disabled={loading}
            >
              Cancel
            </LogoEditButton>
            <LogoEditButton 
              $variant="primary"
              onClick={handleDeleteCompany}
              disabled={loading}
              style={{ background: '#dc3545' }}
            >
              {loading ? (
                <>
                  <FiLoader style={{ animation: 'spin 1s linear infinite' }} />
                  Deleting...
                </>
              ) : (
                <>
                  <FiX />
                  Delete Permanently
                </>
              )}
            </LogoEditButton>
          </DeleteConfirmActions>
        </DeleteConfirmModal>
      </DeleteConfirmOverlay>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </Modal>
  );
};

export default CompanyDetailRefactored;
