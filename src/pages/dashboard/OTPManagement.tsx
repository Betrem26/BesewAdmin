import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../../store/store';
import {
  fetchBlockedNumbers,
  checkRateLimitStatus,
  resetRateLimit,
  clearError,
  clearRateLimitStatus,
} from '../../store/features/otpManagementSlice';
import { toast } from 'react-toastify';

const OTPManagement: React.FC = () => {
  const dispatch = useAppDispatch();
  const { blockedNumbers, rateLimitStatus, loading, error } = useAppSelector(
    (state) => state.otpManagement
  );
  const [searchPhone, setSearchPhone] = useState('');

  useEffect(() => {
    dispatch(fetchBlockedNumbers());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleCheckStatus = async () => {
    if (!searchPhone.trim()) {
      toast.error('Please enter a phone number');
      return;
    }
    await dispatch(checkRateLimitStatus(searchPhone));
  };

  const handleResetRateLimit = async (phone: string) => {
    if (window.confirm(`Reset rate limit for ${phone}?`)) {
      await dispatch(resetRateLimit({ phoneNumber: phone, reason: 'Admin reset' }));
      toast.success('Rate limit reset successfully');
      dispatch(fetchBlockedNumbers());
      dispatch(clearRateLimitStatus());
    }
  };

  return (
    <Container>
      <Header>
        <Title>OTP & Rate Limit Management</Title>
        <Description>Manage OTP rate limits and blocked phone numbers</Description>
      </Header>

      <Section>
        <SectionTitle>Check Rate Limit Status</SectionTitle>
        <SearchBox>
          <Input
            type="text"
            placeholder="Enter phone number (e.g., +251911234567)"
            value={searchPhone}
            onChange={(e) => setSearchPhone(e.target.value)}
          />
          <Button onClick={handleCheckStatus} disabled={loading}>
            {loading ? 'Checking...' : 'Check Status'}
          </Button>
        </SearchBox>

        {rateLimitStatus && (
          <StatusCard>
            <StatusRow>
              <StatusLabel>Phone Number:</StatusLabel>
              <StatusValue>{rateLimitStatus.phoneNumber}</StatusValue>
            </StatusRow>
            <StatusRow>
              <StatusLabel>Is Blocked:</StatusLabel>
              <StatusValue status={rateLimitStatus.isBlocked ? 'blocked' : 'active'}>
                {rateLimitStatus.isBlocked ? 'Yes' : 'No'}
              </StatusValue>
            </StatusRow>
            <StatusRow>
              <StatusLabel>Attempts:</StatusLabel>
              <StatusValue>{rateLimitStatus.attemptCount}</StatusValue>
            </StatusRow>
            {rateLimitStatus.isBlocked && (
              <ButtonRow>
                <ResetButton onClick={() => handleResetRateLimit(rateLimitStatus.phoneNumber)}>
                  Reset Rate Limit
                </ResetButton>
              </ButtonRow>
            )}
          </StatusCard>
        )}
      </Section>

      <Section>
        <SectionTitle>Blocked Phone Numbers</SectionTitle>
        {loading && <LoadingText>Loading blocked numbers...</LoadingText>}
        {!loading && blockedNumbers.length === 0 && (
          <EmptyState>No blocked phone numbers found</EmptyState>
        )}
        {!loading && blockedNumbers.length > 0 && (
          <Table>
            <thead>
              <tr>
                <Th>Phone Number</Th>
                <Th>Attempts</Th>
                <Th>Blocked Until</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {blockedNumbers.map((blocked) => (
                <tr key={blocked.phoneNumber}>
                  <Td>{blocked.phoneNumber}</Td>
                  <Td>{blocked.attemptCount}</Td>
                  <Td>{new Date(blocked.expiresAt).toLocaleString()}</Td>
                  <Td>
                    <ActionButton onClick={() => handleResetRateLimit(blocked.phoneNumber)}>
                      Reset
                    </ActionButton>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Section>
    </Container>
  );
};

export default OTPManagement;

const Container = styled.div`padding: 24px;`;
const Header = styled.div`margin-bottom: 32px;`;
const Title = styled.h1`font-size: 28px; font-weight: 600; color: #1a202c; margin-bottom: 8px;`;
const Description = styled.p`font-size: 14px; color: #718096;`;
const Section = styled.div`background: white; border-radius: 8px; padding: 24px; margin-bottom: 24px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);`;
const SectionTitle = styled.h2`font-size: 18px; font-weight: 600; color: #2d3748; margin-bottom: 16px;`;
const SearchBox = styled.div`display: flex; gap: 12px; margin-bottom: 24px;`;
const Input = styled.input`flex: 1; padding: 10px 16px; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 14px; &:focus { outline: none; border-color: #3182ce; }`;
const Button = styled.button`padding: 10px 24px; background: #3182ce; color: white; border: none; border-radius: 6px; font-size: 14px; font-weight: 500; cursor: pointer; &:hover { background: #2c5282; } &:disabled { background: #cbd5e0; cursor: not-allowed; }`;
const StatusCard = styled.div`background: #f7fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px;`;
const StatusRow = styled.div`display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #e2e8f0; &:last-child { border-bottom: none; }`;
const StatusLabel = styled.span`font-weight: 500; color: #4a5568;`;
const StatusValue = styled.span<{ status?: string }>`color: ${(props) => props.status === 'blocked' ? '#e53e3e' : props.status === 'active' ? '#38a169' : '#2d3748'}; font-weight: ${(props) => (props.status ? '600' : '400')};`;
const ButtonRow = styled.div`margin-top: 16px; padding-top: 16px; border-top: 1px solid #e2e8f0;`;
const ResetButton = styled.button`padding: 8px 16px; background: #e53e3e; color: white; border: none; border-radius: 6px; font-size: 14px; font-weight: 500; cursor: pointer; &:hover { background: #c53030; }`;
const LoadingText = styled.p`text-align: center; color: #718096; padding: 40px;`;
const EmptyState = styled.p`text-align: center; color: #718096; padding: 40px;`;
const Table = styled.table`width: 100%; border-collapse: collapse;`;
const Th = styled.th`text-align: left; padding: 12px; background: #f7fafc; color: #4a5568; font-weight: 600; font-size: 14px; border-bottom: 2px solid #e2e8f0;`;
const Td = styled.td`padding: 12px; border-bottom: 1px solid #e2e8f0; color: #2d3748; font-size: 14px;`;
const ActionButton = styled.button`padding: 6px 12px; background: #3182ce; color: white; border: none; border-radius: 4px; font-size: 13px; cursor: pointer; &:hover { background: #2c5282; }`;
