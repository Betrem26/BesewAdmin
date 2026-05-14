import React, { useState } from 'react';
import styled from 'styled-components';
import {
  FiX,
  FiMapPin,
  FiUsers,
  FiBriefcase,
  FiRefreshCw,
  FiUpload,
  FiCheck,
  FiAlertCircle,
  FiCheckCircle,
  FiXCircle,
  FiMessageSquare,
  FiArrowLeft,
  FiClock,
  FiUser
} from 'react-icons/fi';
import { partyApi, handleApiError } from '../services/api';
import platformAdminApi from '../services/platformAdminApi';

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
  border-bottom: 2px solid #ecf0f1;
  padding-bottom: 16px;
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

const SectionTitle = styled.h3`
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
  word-break: break-word;
`;

const CultureSection = styled.div`
  background: #f8f9fa;
  border-radius: 8px;
  padding: 16px;
  margin-top: 12px;
`;

const CultureList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
`;

const CultureTag = styled.span`
  background: #3498db;
  color: white;
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
`;

const LogoSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 12px;
`;

const LogoPreview = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 8px;
  object-fit: cover;
  background: #ecf0f1;
`;

const LogoPlaceholder = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 8px;
  background: #ecf0f1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #95a5a6;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 16px;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  background: ${props => props.variant === 'primary' ? '#3498db' : '#ecf0f1'};
  color: ${props => props.variant === 'primary' ? 'white' : '#2c3e50'};
  border: none;
  padding: 10px 16px;
  border-radius: 6px;
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

const FileInput = styled.input`
  display: none;
`;

const VerificationSection = styled.div`
  background: #f0f8ff;
  border-radius: 8px;
  padding: 16px;
  margin-top: 12px;
  border-left: 4px solid #3498db;
`;

const VerificationStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
`;

const StatusIcon = styled.div<{ status?: string }>`
  font-size: 24px;
  color: ${props => {
    switch (props.status) {
      case 'verified': return '#27ae60';
      case 'rejected': return '#e74c3c';
      default: return '#f39c12';
    }
  }};
`;

const VerificationActions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 12px;
`;

const FeedbackSection = styled.div`
  background: #f9f9f9;
  border-radius: 8px;
  padding: 16px;
  margin-top: 12px;
`;

const FeedbackStats = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
`;

const FeedbackStat = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: white;
  border-radius: 6px;
  border: 1px solid #ddd;
`;

const StatNumber = styled.span`
  font-weight: 600;
  font-size: 18px;
  color: #3498db;
`;

const SuccessMessage = styled.div`
  background: #d4edda;
  color: #155724;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ErrorMessage = styled.div`
  background: #f8d7da;
  color: #721c24;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: #3498db;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0;
  margin-bottom: 16px;

  &:hover {
    color: #2980b9;
  }
`;

const FeedbackList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const FeedbackItem = styled.div`
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  
  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

const FeedbackHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 8px;
`;

const FeedbackTitle = styled.h4`
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #2c3e50;
`;

const FeedbackMeta = styled.div`
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: #7f8c8d;
  margin-top: 8px;
`;

const FeedbackContent = styled.p`
  margin: 8px 0 0 0;
  font-size: 13px;
  color: #555;
  line-height: 1.5;
`;

const ReportItem = styled.div`
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  border-left: 4px solid #e74c3c;
  
  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

const ReportHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 8px;
`;

const ReportTitle = styled.h4`
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #2c3e50;
`;

const ReportStatus = styled.span<{ status?: string }>`
  background: ${props => {
    switch (props.status) {
      case 'resolved': return '#d4edda';
      case 'investigating': return '#fff3cd';
      case 'pending': return '#f8d7da';
      default: return '#e2e3e5';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'resolved': return '#155724';
      case 'investigating': return '#856404';
      case 'pending': return '#721c24';
      default: return '#383d41';
    }
  }};
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  text-transform: capitalize;
`;

const ReportContent = styled.p`
  margin: 8px 0 0 0;
  font-size: 13px;
  color: #555;
  line-height: 1.5;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 32px 16px;
  color: #7f8c8d;
`;

const EmptyIcon = styled.div`
  font-size: 48px;
  margin-bottom: 12px;
  opacity: 0.5;
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
  mission?: string;
  vision?: string;
  values?: string[];
  culture_attributes?: string[];
  liscence_number?: string;
  tin_number?: string;
  phone_number?: string;
  website?: string;
  specialized_in?: string;
  verification_status?: string;
  verification_reason?: string;
  verified_at?: string;
  verified_by?: string;
  feedback_count?: number;
  report_count?: number;
}

interface Props {
  isOpen: boolean;
  company: Company | null;
  onClose: () => void;
  onUpdate?: () => void;
}

// Feedback Details Modal Component
const FeedbackDetailsModal: React.FC<{
  isOpen: boolean;
  companyId: string;
  companyName: string;
  onBack: () => void;
}> = ({ isOpen, companyId, companyName, onBack }) => {
  const [feedback, setFeedback] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    if (isOpen && companyId) {
      loadFeedback();
    }
  }, [isOpen, companyId]);

  const loadFeedback = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await platformAdminApi.getCompanyFeedback(companyId);
      setFeedback(Array.isArray(data) ? data : data.data || []);
    } catch (err: any) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal $isOpen={true}>
      <ModalContent>
        <BackButton onClick={onBack}>
          <FiArrowLeft />
          Back to Company
        </BackButton>
        <ModalHeader>
          <ModalTitle>Feedback for {companyName}</ModalTitle>
          <CloseButton onClick={onBack}>
            <FiX />
          </CloseButton>
        </ModalHeader>

        {error && (
          <ErrorMessage>
            <FiAlertCircle />
            {error}
          </ErrorMessage>
        )}

        {loading ? (
          <EmptyState>Loading feedback...</EmptyState>
        ) : feedback.length === 0 ? (
          <EmptyState>
            <EmptyIcon>
              <FiMessageSquare />
            </EmptyIcon>
            <p>No feedback available for this company</p>
          </EmptyState>
        ) : (
          <FeedbackList>
            {feedback.map((item, idx) => (
              <FeedbackItem key={idx}>
                <FeedbackHeader>
                  <FeedbackTitle>{item.title || 'Feedback'}</FeedbackTitle>
                </FeedbackHeader>
                <FeedbackMeta>
                  <span>
                    <FiUser size={12} style={{ display: 'inline', marginRight: '4px' }} />
                    {item.submitted_by || 'Anonymous'}
                  </span>
                  <span>
                    <FiClock size={12} style={{ display: 'inline', marginRight: '4px' }} />
                    {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'N/A'}
                  </span>
                </FeedbackMeta>
                <FeedbackContent>{item.content || item.message || item.description}</FeedbackContent>
              </FeedbackItem>
            ))}
          </FeedbackList>
        )}
      </ModalContent>
    </Modal>
  );
};

// Reports Details Modal Component
const ReportsDetailsModal: React.FC<{
  isOpen: boolean;
  companyId: string;
  companyName: string;
  onBack: () => void;
}> = ({ isOpen, companyId, companyName, onBack }) => {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    if (isOpen && companyId) {
      loadReports();
    }
  }, [isOpen, companyId]);

  const loadReports = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await platformAdminApi.getCompanyReports(companyId);
      setReports(Array.isArray(data) ? data : data.data || []);
    } catch (err: any) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal $isOpen={true}>
      <ModalContent>
        <BackButton onClick={onBack}>
          <FiArrowLeft />
          Back to Company
        </BackButton>
        <ModalHeader>
          <ModalTitle>Reports for {companyName}</ModalTitle>
          <CloseButton onClick={onBack}>
            <FiX />
          </CloseButton>
        </ModalHeader>

        {error && (
          <ErrorMessage>
            <FiAlertCircle />
            {error}
          </ErrorMessage>
        )}

        {loading ? (
          <EmptyState>Loading reports...</EmptyState>
        ) : reports.length === 0 ? (
          <EmptyState>
            <EmptyIcon>
              <FiAlertCircle />
            </EmptyIcon>
            <p>No reports available for this company</p>
          </EmptyState>
        ) : (
          <FeedbackList>
            {reports.map((item, idx) => (
              <ReportItem key={idx}>
                <ReportHeader>
                  <ReportTitle>{item.title || 'Report'}</ReportTitle>
                  <ReportStatus status={item.status}>
                    {item.status || 'pending'}
                  </ReportStatus>
                </ReportHeader>
                <FeedbackMeta>
                  <span>
                    <FiUser size={12} style={{ display: 'inline', marginRight: '4px' }} />
                    {item.reported_by || 'Anonymous'}
                  </span>
                  <span>
                    <FiClock size={12} style={{ display: 'inline', marginRight: '4px' }} />
                    {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'N/A'}
                  </span>
                </FeedbackMeta>
                <ReportContent>{item.content || item.message || item.description}</ReportContent>
                {item.notes && (
                  <ReportContent style={{ marginTop: '8px', fontStyle: 'italic', color: '#7f8c8d' }}>
                    <strong>Notes:</strong> {item.notes}
                  </ReportContent>
                )}
              </ReportItem>
            ))}
          </FeedbackList>
        )}
      </ModalContent>
    </Modal>
  );
};

const CompanyDetailModal: React.FC<Props> = ({ isOpen, company, onClose, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showReportsModal, setShowReportsModal] = useState(false);
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

  const handleRegenerateCulture = async () => {
    try {
      setLoading(true);
      setMessage(null);

      const companyId = company.company_id || company._id;
      await partyApi.post(`/company-data/culture/generate-and-save`, {
        company_id: companyId,
        user_needs: 'comprehensive culture attributes and values'
      });

      setMessage({ type: 'success', text: 'Culture attributes regenerated successfully!' });
      onUpdate?.();
    } catch (err: any) {
      setMessage({ type: 'error', text: handleApiError(err) });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCompany = async (status: 'verified' | 'rejected') => {
    try {
      setLoading(true);
      setMessage(null);

      const companyId = company.company_id || company._id;
      const reason = status === 'verified' 
        ? 'Manually verified by platform admin' 
        : 'Rejected by platform admin';

      await platformAdminApi.verifyCompany(companyId, status, reason);

      setMessage({ 
        type: 'success', 
        text: `Company ${status} successfully!` 
      });
      onUpdate?.();
    } catch (err: any) {
      setMessage({ type: 'error', text: handleApiError(err) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal $isOpen={isOpen}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>{company.company_name}</ModalTitle>
          <CloseButton onClick={onClose}>
            <FiX />
          </CloseButton>
        </ModalHeader>

        {message && (
          message.type === 'success' ? (
            <SuccessMessage>
              <FiCheck />
              {message.text}
            </SuccessMessage>
          ) : (
            <ErrorMessage>
              <FiAlertCircle />
              {message.text}
            </ErrorMessage>
          )
        )}

        <DetailSection>
          <SectionTitle>
            <FiBriefcase />
            Basic Information
          </SectionTitle>
          <DetailRow>
            <DetailLabel>Company Type:</DetailLabel>
            <DetailValue>{company.company_type?.name || company.company_level?.name || 'N/A'}</DetailValue>
          </DetailRow>
          <DetailRow>
            <DetailLabel>Description:</DetailLabel>
            <DetailValue>{company.company_description || 'N/A'}</DetailValue>
          </DetailRow>
          <DetailRow>
            <DetailLabel>License Number:</DetailLabel>
            <DetailValue>{company.liscence_number || 'N/A'}</DetailValue>
          </DetailRow>
          <DetailRow>
            <DetailLabel>TIN Number:</DetailLabel>
            <DetailValue>{company.tin_number || 'N/A'}</DetailValue>
          </DetailRow>
        </DetailSection>

        {company.verification_status && (
          <DetailSection>
            <SectionTitle>
              <FiCheckCircle />
              Verification Status
            </SectionTitle>
            <VerificationSection>
              <VerificationStatus>
                <StatusIcon status={company.verification_status?.toLowerCase()}>
                  {company.verification_status?.toUpperCase() === 'VERIFIED' && <FiCheckCircle />}
                  {company.verification_status?.toUpperCase() === 'REJECTED' && <FiXCircle />}
                  {(!company.verification_status || !['VERIFIED','REJECTED'].includes(company.verification_status.toUpperCase())) && <FiAlertCircle />}
                </StatusIcon>
                <div>
                  <strong style={{ textTransform: 'capitalize' }}>
                    {company.verification_status?.toLowerCase()}
                  </strong>
                  {company.verification_reason && (
                    <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                      {company.verification_reason}
                    </div>
                  )}
                  {company.verified_at && (
                    <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
                      Verified on {new Date(company.verified_at).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </VerificationStatus>
              {(!company.verification_status || !['VERIFIED','REJECTED'].includes(company.verification_status.toUpperCase())) && (
                <VerificationActions>
                  <Button 
                    variant="primary" 
                    onClick={() => handleVerifyCompany('verified')}
                    disabled={loading}
                  >
                    <FiCheck />
                    Verify
                  </Button>
                  <Button 
                    onClick={() => handleVerifyCompany('rejected')}
                    disabled={loading}
                  >
                    <FiXCircle />
                    Reject
                  </Button>
                </VerificationActions>
              )}
            </VerificationSection>
          </DetailSection>
        )}

        <DetailSection>
          <SectionTitle>
            <FiMapPin />
            Location & Contact
          </SectionTitle>
          <DetailRow>
            <DetailLabel>Address:</DetailLabel>
            <DetailValue>{company.location || 'N/A'}</DetailValue>
          </DetailRow>
          <DetailRow>
            <DetailLabel>City:</DetailLabel>
            <DetailValue>{company.city || 'N/A'}</DetailValue>
          </DetailRow>
          <DetailRow>
            <DetailLabel>Region:</DetailLabel>
            <DetailValue>{company.region || 'N/A'}</DetailValue>
          </DetailRow>
          <DetailRow>
            <DetailLabel>Phone:</DetailLabel>
            <DetailValue>{company.phone_number || 'N/A'}</DetailValue>
          </DetailRow>
          <DetailRow>
            <DetailLabel>Website:</DetailLabel>
            <DetailValue>
              {company.website ? (
                <a href={company.website} target="_blank" rel="noopener noreferrer">
                  {company.website}
                </a>
              ) : (
                'N/A'
              )}
            </DetailValue>
          </DetailRow>
        </DetailSection>

        <DetailSection>
          <SectionTitle>
            <FiBriefcase />
            Operations
          </SectionTitle>
          <DetailRow>
            <DetailLabel>Employees:</DetailLabel>
            <DetailValue>{company.total_employee || 0}</DetailValue>
          </DetailRow>
          <DetailRow>
            <DetailLabel>Open Vacancies:</DetailLabel>
            <DetailValue>{company.total_vacancy || 0}</DetailValue>
          </DetailRow>
          <DetailRow>
            <DetailLabel>Posting Frequency:</DetailLabel>
            <DetailValue>{company.posting_frequency || 'N/A'}</DetailValue>
          </DetailRow>
          <DetailRow>
            <DetailLabel>Career Page:</DetailLabel>
            <DetailValue>
              {company.has_career_page || company.career_page_url ? (
                <a href={company.career_page_url} target="_blank" rel="noopener noreferrer">
                  <FiCheck color="#27ae60" />
                </a>
              ) : (
                <FiAlertCircle color="#e74c3c" />
              )}
            </DetailValue>
          </DetailRow>
          <DetailRow>
            <DetailLabel>Specialized In:</DetailLabel>
            <DetailValue>{company.specialized_in || 'N/A'}</DetailValue>
          </DetailRow>
        </DetailSection>

        {(company.mission || company.vision || company.values || company.culture_attributes) && (
          <DetailSection>
            <SectionTitle>
              <FiUsers />
              Culture & Values
            </SectionTitle>
            {company.mission && (
              <DetailRow>
                <DetailLabel>Mission:</DetailLabel>
                <DetailValue>{company.mission}</DetailValue>
              </DetailRow>
            )}
            {company.vision && (
              <DetailRow>
                <DetailLabel>Vision:</DetailLabel>
                <DetailValue>{company.vision}</DetailValue>
              </DetailRow>
            )}
            {company.values && company.values.length > 0 && (
              <CultureSection>
                <strong>Core Values</strong>
                <CultureList>
                  {company.values.map((value, idx) => (
                    <CultureTag key={idx}>{value}</CultureTag>
                  ))}
                </CultureList>
              </CultureSection>
            )}
            {company.culture_attributes && company.culture_attributes.length > 0 && (
              <CultureSection>
                <strong>Culture Attributes</strong>
                <CultureList>
                  {company.culture_attributes.map((attr, idx) => (
                    <CultureTag key={idx}>{attr}</CultureTag>
                  ))}
                </CultureList>
              </CultureSection>
            )}
            <ActionButtons>
              <Button onClick={handleRegenerateCulture} disabled={loading}>
                <FiRefreshCw />
                Re-generate with AI
              </Button>
            </ActionButtons>
          </DetailSection>
        )}

        {(company.feedback_count !== undefined || company.report_count !== undefined) && (
          <DetailSection>
            <SectionTitle>
              <FiMessageSquare />
              Feedback & Reports
            </SectionTitle>
            <FeedbackSection>
              <FeedbackStats>
                <FeedbackStat>
                  <FiMessageSquare />
                  <div>
                    <StatNumber>{company.feedback_count || 0}</StatNumber>
                    <div style={{ fontSize: '12px', color: '#666' }}>Feedback</div>
                  </div>
                </FeedbackStat>
                <FeedbackStat>
                  <FiAlertCircle />
                  <div>
                    <StatNumber>{company.report_count || 0}</StatNumber>
                    <div style={{ fontSize: '12px', color: '#666' }}>Reports</div>
                  </div>
                </FeedbackStat>
              </FeedbackStats>
              {(company.feedback_count || 0) > 0 && (
                <Button 
                  variant="secondary" 
                  onClick={() => setShowFeedbackModal(true)}
                  disabled={loading}
                >
                  <FiMessageSquare />
                  View Feedback
                </Button>
              )}
              {(company.report_count || 0) > 0 && (
                <Button 
                  variant="secondary" 
                  onClick={() => setShowReportsModal(true)}
                  disabled={loading} 
                  style={{ marginLeft: '8px' }}
                >
                  <FiAlertCircle />
                  View Reports
                </Button>
              )}
            </FeedbackSection>
          </DetailSection>
        )}

        <DetailSection>
          <SectionTitle>
            <FiUpload />
            Logo Management
          </SectionTitle>
          <LogoSection>
            {company.logo ? (
              <LogoPreview src={company.logo} alt={company.company_name} />
            ) : (
              <LogoPlaceholder>No Logo</LogoPlaceholder>
            )}
            <div>
              <p style={{ marginBottom: '12px', color: '#7f8c8d' }}>
                Upload a new logo (JPG, PNG, max 5MB)
              </p>
              <Button onClick={() => fileInputRef.current?.click()} disabled={loading}>
                <FiUpload />
                Upload Logo
              </Button>
              <FileInput
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png"
                onChange={handleLogoUpload}
              />
            </div>
          </LogoSection>
        </DetailSection>

        <FeedbackDetailsModal
          isOpen={showFeedbackModal}
          companyId={company.company_id || company._id || ''}
          companyName={company.company_name}
          onBack={() => setShowFeedbackModal(false)}
        />

        <ReportsDetailsModal
          isOpen={showReportsModal}
          companyId={company.company_id || company._id || ''}
          companyName={company.company_name}
          onBack={() => setShowReportsModal(false)}
        />
      </ModalContent>
    </Modal>
  );
};

export default CompanyDetailModal;
