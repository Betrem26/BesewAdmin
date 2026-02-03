import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { fetchReports, updateReportStatus, deleteReport, clearError } from '../../store/features/accountReportsSlice';
import { toast } from 'react-toastify';

const AccountReports: React.FC = () => {
  const dispatch = useAppDispatch();
  const { reports, loading, error } = useAppSelector((state) => state.accountReports);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    dispatch(fetchReports());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleStatusUpdate = async (id: string, status: 'pending' | 'under_review' | 'resolved' | 'dismissed') => {
    await dispatch(updateReportStatus({ id, data: { status } }));
    toast.success('Report status updated');
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this report?')) {
      await dispatch(deleteReport(id));
      toast.success('Report deleted');
    }
  };

  const filteredReports = filter === 'all' ? reports : reports.filter(r => r.status === filter);

  return (
    <Container>
      <Header>
        <Title>Account Reports</Title>
        <FilterBox>
          <FilterButton active={filter === 'all'} onClick={() => setFilter('all')}>All</FilterButton>
          <FilterButton active={filter === 'pending'} onClick={() => setFilter('pending')}>Pending</FilterButton>
          <FilterButton active={filter === 'resolved'} onClick={() => setFilter('resolved')}>Resolved</FilterButton>
        </FilterBox>
      </Header>
      {loading && <LoadingText>Loading reports...</LoadingText>}
      {!loading && filteredReports.length === 0 && <EmptyState>No reports found</EmptyState>}
      {!loading && filteredReports.length > 0 && (
        <Table>
          <thead>
            <tr>
              <Th>Report ID</Th>
              <Th>Reported Party</Th>
              <Th>Reporter</Th>
              <Th>Type</Th>
              <Th>Status</Th>
              <Th>Date</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {filteredReports.map((report) => (
              <tr key={report._id}>
                <Td>{report._id.slice(-8)}</Td>
                <Td>{report.reportedPartyId}</Td>
                <Td>{report.reporterPartyId}</Td>
                <Td>{report.type}</Td>
                <Td><Status status={report.status}>{report.status}</Status></Td>
                <Td>{new Date(report.createdAt).toLocaleDateString()}</Td>
                <Td>
                  <ActionButton onClick={() => handleStatusUpdate(report._id, 'resolved')}>Resolve</ActionButton>
                  <ActionButton onClick={() => handleDelete(report._id)}>Delete</ActionButton>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default AccountReports;

const Container = styled.div`padding: 24px;`;
const Header = styled.div`display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;`;
const Title = styled.h1`font-size: 28px; font-weight: 600; color: #1a202c;`;
const FilterBox = styled.div`display: flex; gap: 8px;`;
const FilterButton = styled.button<{ active: boolean }>`padding: 8px 16px; background: ${p => p.active ? '#3182ce' : 'white'}; color: ${p => p.active ? 'white' : '#4a5568'}; border: 1px solid #e2e8f0; border-radius: 6px; cursor: pointer;`;
const LoadingText = styled.p`text-align: center; color: #718096; padding: 40px;`;
const EmptyState = styled.p`text-align: center; color: #718096; padding: 40px;`;
const Table = styled.table`width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden;`;
const Th = styled.th`text-align: left; padding: 12px; background: #f7fafc; color: #4a5568; font-weight: 600; font-size: 14px;`;
const Td = styled.td`padding: 12px; border-bottom: 1px solid #e2e8f0; color: #2d3748; font-size: 14px;`;
const Status = styled.span<{ status: string }>`padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 500; background: ${p => p.status === 'resolved' ? '#c6f6d5' : '#fed7d7'}; color: ${p => p.status === 'resolved' ? '#22543d' : '#742a2a'};`;
const ActionButton = styled.button`padding: 6px 12px; background: #3182ce; color: white; border: none; border-radius: 4px; font-size: 13px; cursor: pointer; margin-right: 8px; &:hover { background: #2c5282; }`;
