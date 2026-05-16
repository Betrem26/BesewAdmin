import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import styled, { keyframes } from 'styled-components';
import { FiAlertTriangle, FiTrash2 } from 'react-icons/fi';

interface Props {
  isOpen: boolean;
  name: string;
  onConfirm: () => Promise<void>;
  onClose: () => void;
}

const DeleteConfirmModal: React.FC<Props> = ({ isOpen, name, onConfirm, onClose }) => {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    try {
      setLoading(true);
      await onConfirm();
      onClose();
    } catch {
      // error handled by caller
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) return;
    onClose();
  };

  return ReactDOM.createPortal(
    <Overlay onClick={e => { if (e.target === e.currentTarget) handleClose(); }}>
      <Modal>
        <IconCircle>
          <FiAlertTriangle size={28} />
        </IconCircle>

        <Title>Are you sure?</Title>

        <Message>
          You are about to permanently delete{' '}
          <strong>{name}</strong>.{' '}
          This action cannot be undone and all associated data will be removed.
        </Message>

        <Actions>
          <CancelBtn onClick={handleClose} disabled={loading}>
            Cancel
          </CancelBtn>
          <DeleteBtn onClick={handleConfirm} disabled={loading}>
            <FiTrash2 size={14} />
            {loading ? 'Deleting…' : 'Delete'}
          </DeleteBtn>
        </Actions>
      </Modal>
    </Overlay>,
    document.body
  );
};

export default DeleteConfirmModal;

// ── Animations ──
const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;
const popIn = keyframes`
  from { opacity: 0; transform: scale(0.92) translateY(12px); }
  to   { opacity: 1; transform: scale(1)    translateY(0);    }
`;

// ── Styled Components ──
const Overlay = styled.div`
  position: fixed; inset: 0;
  background: rgba(15, 23, 42, 0.55);
  backdrop-filter: blur(3px);
  z-index: 3000;
  display: flex; align-items: center; justify-content: center;
  padding: 20px;
  animation: ${fadeIn} 0.15s ease;
`;

const Modal = styled.div`
  background: #fff;
  border-radius: 20px;
  width: 100%; max-width: 400px;
  padding: 36px 32px 28px;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.05);
  animation: ${popIn} 0.22s cubic-bezier(0.34, 1.56, 0.64, 1);
  display: flex; flex-direction: column; align-items: center; gap: 12px;
`;

const IconCircle = styled.div`
  width: 64px; height: 64px; border-radius: 50%;
  background: #fff5f5;
  border: 2px solid #fed7d7;
  display: flex; align-items: center; justify-content: center;
  color: #e53e3e;
  margin-bottom: 4px;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: #1a202c;
`;

const Message = styled.p`
  margin: 0;
  font-size: 14px;
  color: #718096;
  line-height: 1.65;

  strong {
    color: #2d3748;
    font-weight: 600;
  }
`;

const Actions = styled.div`
  display: flex; gap: 12px;
  width: 100%;
  margin-top: 8px;
`;

const CancelBtn = styled.button`
  flex: 1; padding: 12px;
  border-radius: 10px;
  border: 1.5px solid #e2e8f0;
  background: white;
  font-size: 14px; font-weight: 600; color: #4a5568;
  cursor: pointer;
  transition: all 0.15s;
  &:hover:not(:disabled) { background: #f7fafc; border-color: #cbd5e0; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const DeleteBtn = styled.button`
  flex: 1; padding: 12px;
  border-radius: 10px; border: none;
  background: #e53e3e;
  font-size: 14px; font-weight: 700; color: white;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center; gap: 7px;
  transition: all 0.15s;
  box-shadow: 0 4px 14px rgba(229, 62, 62, 0.35);
  &:hover:not(:disabled) {
    background: #c53030;
    box-shadow: 0 6px 18px rgba(229, 62, 62, 0.45);
    transform: translateY(-1px);
  }
  &:active:not(:disabled) { transform: translateY(0); }
  &:disabled { background: #fc8181; cursor: not-allowed; box-shadow: none; }
`;
