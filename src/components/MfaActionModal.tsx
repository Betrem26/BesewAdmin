import React, { useState } from 'react';
import { FiShield, FiX, FiAlertTriangle, FiUserCheck, FiUserX } from 'react-icons/fi';

export type MfaActionType = 'promote' | 'demote' | 'role-change';

interface Props {
  isOpen: boolean;
  actionType: MfaActionType;
  targetName: string;
  targetPartyId: string;
  newRole?: string;
  onConfirm: (reason: string, mfaChallengeId: string) => Promise<void>;
  onClose: () => void;
}

const MfaActionModal: React.FC<Props> = ({
  isOpen, actionType, targetName, targetPartyId, newRole, onConfirm, onClose
}) => {
  const [reason, setReason] = useState('');
  const [mfaChallengeId, setMfaChallengeId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const isPromote = actionType === 'promote';
  const isDemote = actionType === 'demote';

  const title = isPromote ? 'Promote to Admin'
    : isDemote ? 'Demote to User'
    : `Change Role to ${newRole}`;

  const defaultReason = isPromote
    ? 'Promoting user to admin for platform management'
    : isDemote
    ? 'Demoting admin to user role'
    : `Changing role to ${newRole}`;

  const accentColor = isPromote ? '#3182ce' : isDemote ? '#e53e3e' : '#805ad5';

  const handleSubmit = async () => {
    const finalReason = reason.trim() || defaultReason;
    if (!mfaChallengeId.trim()) {
      setError('MFA Challenge ID is required.');
      return;
    }
    try {
      setLoading(true);
      setError(null);
      await onConfirm(finalReason, mfaChallengeId.trim());
      setReason('');
      setMfaChallengeId('');
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Action failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) return;
    setReason('');
    setMfaChallengeId('');
    setError(null);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)',
      zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
    }} onClick={e => { if (e.target === e.currentTarget) handleClose(); }}>
      <div style={{
        background: 'white', borderRadius: '14px', width: '100%', maxWidth: '460px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.25)', overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          background: accentColor, padding: '20px 24px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'white' }}>
            <FiShield size={20} />
            <span style={{ fontWeight: 700, fontSize: '16px' }}>{title}</span>
          </div>
          <button onClick={handleClose} disabled={loading} style={{
            background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white',
            width: '32px', height: '32px', borderRadius: '8px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}><FiX size={16} /></button>
        </div>

        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Target info */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            padding: '12px 14px', borderRadius: '8px',
            background: isPromote ? '#ebf8ff' : isDemote ? '#fff5f5' : '#faf5ff',
            border: `1px solid ${isPromote ? '#bee3f8' : isDemote ? '#fed7d7' : '#e9d8fd'}`
          }}>
            {isPromote ? <FiUserCheck size={18} color={accentColor} /> : <FiUserX size={18} color={accentColor} />}
            <div>
              <div style={{ fontWeight: 600, fontSize: '14px', color: '#1a202c' }}>{targetName}</div>
              <div style={{ fontSize: '11px', color: '#718096', fontFamily: 'monospace' }}>{targetPartyId}</div>
            </div>
          </div>

          {/* Security warning */}
          <div style={{
            display: 'flex', gap: '10px', padding: '10px 14px', borderRadius: '8px',
            background: '#fffbeb', border: '1px solid #fbd38d'
          }}>
            <FiAlertTriangle size={15} color="#d69e2e" style={{ flexShrink: 0, marginTop: '1px' }} />
            <span style={{ fontSize: '12px', color: '#92400e', lineHeight: 1.5 }}>
              This is a privileged security operation. MFA verification is mandatory.
              The target account's sessions will be invalidated.
            </span>
          </div>

          {/* MFA Challenge ID */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: 600, color: '#2d3748' }}>
              MFA Challenge ID <span style={{ color: '#e53e3e' }}>*</span>
            </label>
            <input
              type="text"
              value={mfaChallengeId}
              onChange={e => setMfaChallengeId(e.target.value)}
              placeholder="e.g. mfa_challenge_abc123"
              disabled={loading}
              style={{
                padding: '10px 12px', borderRadius: '8px', fontSize: '13px',
                border: `1.5px solid ${error && !mfaChallengeId ? '#fc8181' : '#e2e8f0'}`,
                outline: 'none', fontFamily: 'monospace', color: '#2d3748',
                background: loading ? '#f7fafc' : 'white'
              }}
            />
            <span style={{ fontSize: '11px', color: '#a0aec0' }}>
              Obtain this from your MFA authenticator app or SMS.
            </span>
          </div>

          {/* Reason */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: 600, color: '#2d3748' }}>
              Reason <span style={{ fontSize: '11px', color: '#a0aec0', fontWeight: 400 }}>(optional)</span>
            </label>
            <textarea
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder={defaultReason}
              rows={2}
              disabled={loading}
              style={{
                padding: '10px 12px', borderRadius: '8px', fontSize: '13px',
                border: '1.5px solid #e2e8f0', outline: 'none', resize: 'vertical',
                fontFamily: 'inherit', color: '#2d3748',
                background: loading ? '#f7fafc' : 'white'
              }}
            />
          </div>

          {/* Error */}
          {error && (
            <div style={{
              padding: '10px 14px', borderRadius: '8px',
              background: '#fff5f5', border: '1px solid #fed7d7',
              fontSize: '13px', color: '#c53030', display: 'flex', gap: '8px', alignItems: 'flex-start'
            }}>
              <FiAlertTriangle size={14} style={{ flexShrink: 0, marginTop: '1px' }} />
              {error}
            </div>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', gap: '10px', paddingTop: '4px' }}>
            <button onClick={handleClose} disabled={loading} style={{
              flex: 1, padding: '10px', borderRadius: '8px',
              border: '1.5px solid #e2e8f0', background: 'white',
              fontSize: '14px', fontWeight: 600, color: '#4a5568', cursor: 'pointer'
            }}>Cancel</button>
            <button onClick={handleSubmit} disabled={loading || !mfaChallengeId.trim()} style={{
              flex: 1, padding: '10px', borderRadius: '8px', border: 'none',
              background: loading || !mfaChallengeId.trim() ? '#e2e8f0' : accentColor,
              color: loading || !mfaChallengeId.trim() ? '#a0aec0' : 'white',
              fontSize: '14px', fontWeight: 700, cursor: loading || !mfaChallengeId.trim() ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
            }}>
              <FiShield size={14} />
              {loading ? 'Processing…' : `Confirm ${isPromote ? 'Promote' : isDemote ? 'Demote' : 'Change'}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MfaActionModal;
