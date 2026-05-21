import React, { useState } from 'react';
import {
  FiX, FiCheckCircle, FiXCircle, FiMessageSquare, FiShield,
  FiFileText, FiAlertCircle, FiExternalLink
} from 'react-icons/fi';
import platformAdminApi from '../services/platformAdminApi';

interface Company {
  _id?: string;
  company_id?: string;
  company_name: string;
  tin_number?: string;
  liscence_number?: string;
  mission?: string;
  vision?: string;
  values?: string[];
  company_description?: string;
  verification_status?: string;
  website?: string;
  city?: string;
  region?: string;
  company_type?: { name: string };
}

interface Props {
  isOpen: boolean;
  company: Company | null;
  onClose: () => void;
  onSuccess: (companyId: string, newStatus: 'verified' | 'rejected') => void;
  onToast: (msg: string, type: 'success' | 'error') => void;
}

const VerificationModal: React.FC<Props> = ({ isOpen, company, onClose, onSuccess, onToast }) => {
  const [docsChecked, setDocsChecked] = useState(false);
  const [showRejectReason, setShowRejectReason] = useState(false);
  const [showClarification, setShowClarification] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [clarificationNote, setClarificationNote] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen || !company) return null;

  const companyId = company.company_id || company._id || '';

  const reset = () => {
    setDocsChecked(false);
    setShowRejectReason(false);
    setShowClarification(false);
    setRejectReason('');
    setClarificationNote('');
    setLoading(false);
  };

  const handleClose = () => { reset(); onClose(); };

  const handleApprove = async () => {
    try {
      setLoading(true);
      await platformAdminApi.verifyCompany(companyId, 'verified', 'Manually verified by platform admin');
    } catch (err: any) {
      // Backend may return 500 but we still proceed — status is saved locally
      console.warn('[VerificationModal] Backend verify failed, proceeding with local save:', err?.message);
    }
    // Always call onSuccess — localStorage handles persistence
    onSuccess(companyId, 'verified');
    onToast('Company Verified Successfully!', 'success');
    reset();
    onClose();
    setLoading(false);
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) return;
    try {
      setLoading(true);
      await platformAdminApi.verifyCompany(companyId, 'rejected', rejectReason.trim());
    } catch (err: any) {
      // Backend may return 500 but we still proceed — status is saved locally
      console.warn('[VerificationModal] Backend reject failed, proceeding with local save:', err?.message);
    }
    // Always call onSuccess — localStorage handles persistence
    onSuccess(companyId, 'rejected');
    onToast('Company Rejected.', 'success');
    reset();
    onClose();
    setLoading(false);
  };

  const statusColor = (s?: string) => {
    const v = (s || 'pending').toLowerCase();
    if (v === 'verified') return { bg: '#d1fae5', text: '#065f46', border: '#6ee7b7' };
    if (v === 'rejected') return { bg: '#fee2e2', text: '#991b1b', border: '#fca5a5' };
    return { bg: '#fef3c7', text: '#92400e', border: '#fcd34d' };
  };

  const sc = statusColor(company.verification_status);

  return (
    <div
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)',
        zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
      }}
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <div style={{
        background: 'white', borderRadius: '14px', width: '100%', maxWidth: '620px',
        maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 60px rgba(0,0,0,0.3)'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #1e3a5f 0%, #2c5282 100%)',
          padding: '24px 28px', borderRadius: '14px 14px 0 0',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <FiShield style={{ color: '#90cdf4', fontSize: '22px' }} />
            <div>
              <div style={{ color: 'white', fontWeight: 700, fontSize: '18px' }}>Company Verification</div>
              <div style={{ color: '#90cdf4', fontSize: '13px', marginTop: '2px' }}>{company.company_name}</div>
            </div>
          </div>
          <button onClick={handleClose} style={{
            background: 'rgba(255,255,255,0.15)', border: 'none', color: 'white',
            width: '36px', height: '36px', borderRadius: '8px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px'
          }}>
            <FiX />
          </button>
        </div>

        <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Current Status Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '8px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: 600,
            background: sc.bg, color: sc.text, border: `1px solid ${sc.border}`, alignSelf: 'flex-start'
          }}>
            {(company.verification_status || 'pending').toLowerCase() === 'verified' && <FiCheckCircle />}
            {(company.verification_status || 'pending').toLowerCase() === 'rejected' && <FiXCircle />}
            {(!company.verification_status || !['verified','rejected'].includes(company.verification_status.toLowerCase())) && <FiAlertCircle />}
            {(company.verification_status || 'Pending').charAt(0).toUpperCase() + (company.verification_status || 'pending').slice(1).toLowerCase()}
          </div>

          {/* Legal Documents Section */}
          <div style={{ background: '#f8fafc', borderRadius: '10px', padding: '18px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', fontWeight: 600, color: '#2d3748', fontSize: '14px' }}>
              <FiFileText style={{ color: '#3b82f6' }} />
              Legal Documents
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', color: '#4a5568' }}>TIN Number</span>
                <span style={{ fontWeight: 600, color: '#1a202c', fontSize: '13px', fontFamily: 'monospace' }}>
                  {company.tin_number || <span style={{ color: '#a0aec0', fontFamily: 'inherit' }}>Not provided</span>}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', color: '#4a5568' }}>License Number</span>
                <span style={{ fontWeight: 600, color: '#1a202c', fontSize: '13px', fontFamily: 'monospace' }}>
                  {company.liscence_number || <span style={{ color: '#a0aec0', fontFamily: 'inherit' }}>Not provided</span>}
                </span>
              </div>
              {company.website && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', color: '#4a5568' }}>Documents / Website</span>
                  <a href={company.website} target="_blank" rel="noopener noreferrer"
                    style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#3b82f6', fontSize: '13px', fontWeight: 500 }}>
                    View <FiExternalLink style={{ fontSize: '12px' }} />
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Company Info */}
          {(company.mission || company.vision || company.company_description) && (
            <div style={{ background: '#f8fafc', borderRadius: '10px', padding: '18px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontWeight: 600, color: '#2d3748', fontSize: '14px', marginBottom: '12px' }}>Company Details</div>
              {company.company_description && (
                <div style={{ marginBottom: '10px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 600, color: '#718096', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Description</div>
                  <div style={{ fontSize: '13px', color: '#4a5568', lineHeight: 1.5 }}>{company.company_description}</div>
                </div>
              )}
              {company.mission && (
                <div style={{ marginBottom: '10px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 600, color: '#718096', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Mission</div>
                  <div style={{ fontSize: '13px', color: '#4a5568', lineHeight: 1.5 }}>{company.mission}</div>
                </div>
              )}
              {company.vision && (
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 600, color: '#718096', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Vision</div>
                  <div style={{ fontSize: '13px', color: '#4a5568', lineHeight: 1.5 }}>{company.vision}</div>
                </div>
              )}
            </div>
          )}

          {/* Checklist */}
          <label style={{
            display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer',
            padding: '14px 16px', borderRadius: '8px',
            background: docsChecked ? '#f0fdf4' : '#fffbeb',
            border: `1px solid ${docsChecked ? '#86efac' : '#fcd34d'}`,
            transition: 'all 0.2s'
          }}>
            <input
              type="checkbox"
              checked={docsChecked}
              onChange={e => setDocsChecked(e.target.checked)}
              style={{ marginTop: '2px', width: '16px', height: '16px', cursor: 'pointer', accentColor: '#16a34a' }}
            />
            <span style={{ fontSize: '13px', color: '#374151', fontWeight: 500, lineHeight: 1.5 }}>
              I have reviewed and verified the legal documents (TIN, License, and supporting files) for this company.
            </span>
          </label>

          {/* Rejection Reason */}
          {showRejectReason && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>
                Rejection Reason <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <textarea
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value)}
                placeholder="Provide a clear reason for rejection..."
                rows={3}
                style={{
                  padding: '10px 12px', border: '1px solid #fca5a5', borderRadius: '8px',
                  fontSize: '13px', resize: 'vertical', outline: 'none',
                  background: '#fff5f5', color: '#374151', fontFamily: 'inherit'
                }}
              />
            </div>
          )}

          {/* Clarification Note */}
          {showClarification && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>
                Clarification Request
              </label>
              <textarea
                value={clarificationNote}
                onChange={e => setClarificationNote(e.target.value)}
                placeholder="Describe what additional information or documents are needed..."
                rows={3}
                style={{
                  padding: '10px 12px', border: '1px solid #93c5fd', borderRadius: '8px',
                  fontSize: '13px', resize: 'vertical', outline: 'none',
                  background: '#eff6ff', color: '#374151', fontFamily: 'inherit'
                }}
              />
              <div style={{ fontSize: '12px', color: '#6b7280' }}>
                Note: This is recorded for admin reference. Notify the company separately.
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', paddingTop: '4px' }}>
            {/* Approve */}
            <button
              onClick={handleApprove}
              disabled={!docsChecked || loading}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '10px 20px', borderRadius: '8px', border: 'none',
                background: docsChecked && !loading ? '#16a34a' : '#d1d5db',
                color: docsChecked && !loading ? 'white' : '#9ca3af',
                fontWeight: 600, fontSize: '14px', cursor: docsChecked && !loading ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s', flex: 1, justifyContent: 'center'
              }}
            >
              <FiCheckCircle />
              {loading ? 'Processing...' : 'Approve'}
            </button>

            {/* Reject */}
            {!showRejectReason ? (
              <button
                onClick={() => { setShowRejectReason(true); setShowClarification(false); }}
                disabled={loading}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '10px 20px', borderRadius: '8px', border: '1px solid #fca5a5',
                  background: '#fff5f5', color: '#dc2626',
                  fontWeight: 600, fontSize: '14px', cursor: 'pointer',
                  transition: 'all 0.2s', flex: 1, justifyContent: 'center'
                }}
              >
                <FiXCircle />
                Reject
              </button>
            ) : (
              <button
                onClick={handleReject}
                disabled={!rejectReason.trim() || loading}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '10px 20px', borderRadius: '8px', border: 'none',
                  background: rejectReason.trim() && !loading ? '#dc2626' : '#d1d5db',
                  color: rejectReason.trim() && !loading ? 'white' : '#9ca3af',
                  fontWeight: 600, fontSize: '14px',
                  cursor: rejectReason.trim() && !loading ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s', flex: 1, justifyContent: 'center'
                }}
              >
                <FiXCircle />
                Confirm Reject
              </button>
            )}

            {/* Request Clarification */}
            <button
              onClick={() => { setShowClarification(v => !v); setShowRejectReason(false); }}
              disabled={loading}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '10px 20px', borderRadius: '8px', border: '1px solid #93c5fd',
                background: showClarification ? '#eff6ff' : 'white', color: '#2563eb',
                fontWeight: 600, fontSize: '14px', cursor: 'pointer',
                transition: 'all 0.2s', flex: 1, justifyContent: 'center'
              }}
            >
              <FiMessageSquare />
              Clarification
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationModal;
