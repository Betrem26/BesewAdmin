import React from 'react';
import styled, { keyframes, css } from 'styled-components';
import { FiAlertTriangle, FiTrash2, FiX } from 'react-icons/fi';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;
const spin = keyframes`from{transform:rotate(0deg)}to{transform:rotate(360deg)}`;

const Overlay = styled.div<{ $open: boolean }>`
  display:${p => p.$open ? "flex" : "none"};
  position:fixed;inset:0;background:rgba(0,0,0,0.5);
  z-index:1100;align-items:center;justify-content:center;padding:20px;
  animation:${p => p.$open ? css`${fadeIn} 0.2s ease` : "none"};
`;

const Modal = styled.div`
  background:white;border-radius:16px;padding:32px;
  width:100%;max-width:420px;box-shadow:0 20px 60px rgba(0,0,0,0.3);
  animation:${fadeIn} 0.3s ease;
`;

const Header = styled.div`
  display:flex;align-items:flex-start;gap:16px;margin-bottom:20px;
`;

const IconBox = styled.div`
  width:48px;height:48px;border-radius:12px;
  background:#fee2e2;display:flex;align-items:center;justify-content:center;
  flex-shrink:0;
`;

const Content = styled.div`flex:1;`;

const Title = styled.h3`
  font-size:18px;font-weight:700;color:#1e293b;margin:0 0 8px;
`;

const Message = styled.p`
  font-size:14px;color:#64748b;margin:0 0 12px;line-height:1.5;
`;

const ItemName = styled.div`
  background:#f1f5f9;border-left:3px solid #ef4444;
  padding:10px 12px;border-radius:6px;font-size:13px;
  font-weight:600;color:#1e293b;margin-bottom:16px;
  word-break:break-word;
`;

const Warning = styled.div`
  background:#fef9c3;border-left:3px solid #f59e0b;
  padding:10px 12px;border-radius:6px;font-size:12px;
  color:#92400e;margin-bottom:20px;display:flex;gap:8px;align-items:flex-start;
`;

const Actions = styled.div`
  display:flex;gap:10px;
  button{flex:1;}
`;

const Btn = styled.button<{ $variant: "danger" | "secondary" }>`
  padding:10px 16px;border:none;border-radius:8px;
  font-size:14px;font-weight:600;cursor:pointer;transition:all 0.15s;
  ${p => p.$variant === "danger" && css`
    background:#ef4444;color:white;
    &:hover{background:#dc2626;}
    &:disabled{opacity:0.5;cursor:not-allowed;}
  `}
  ${p => p.$variant === "secondary" && css`
    background:#f1f5f9;color:#475569;
    &:hover{background:#e2e8f0;}
    &:disabled{opacity:0.5;cursor:not-allowed;}
  `}
  display:flex;align-items:center;justify-content:center;gap:6px;
`;

const SpinIcon = styled.span<{ $spin?: boolean }>`
  display:inline-flex;
  ${p => p.$spin && css`animation:${spin} 1s linear infinite;`}
`;

export interface SmartConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  itemName?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  confirmText?: string;
  cancelText?: string;
}

export const SmartConfirmDialog: React.FC<SmartConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  itemName,
  onConfirm,
  onCancel,
  isLoading = false,
  confirmText = 'Delete',
  cancelText = 'Cancel',
}) => {
  return (
    <Overlay $open={isOpen} onClick={e => { if (e.target === e.currentTarget && !isLoading) onCancel(); }}>
      <Modal>
        <Header>
          <IconBox>
            <FiAlertTriangle size={24} color="#dc2626" />
          </IconBox>
          <Content>
            <Title>{title}</Title>
            <Message>{message}</Message>
          </Content>
        </Header>

        {itemName && (
          <ItemName>
            📁 {itemName}
          </ItemName>
        )}

        <Warning>
          <span style={{ marginTop: 2 }}>⚠️</span>
          <span>This action is permanent and cannot be reversed.</span>
        </Warning>

        <Actions>
          <Btn
            $variant="secondary"
            onClick={onCancel}
            disabled={isLoading}
          >
            <FiX size={14} /> {cancelText}
          </Btn>
          <Btn
            $variant="danger"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <SpinIcon $spin>⟳</SpinIcon> Deleting...
              </>
            ) : (
              <>
                <FiTrash2 size={14} /> {confirmText}
              </>
            )}
          </Btn>
        </Actions>
      </Modal>
    </Overlay>
  );
};

export default SmartConfirmDialog;
