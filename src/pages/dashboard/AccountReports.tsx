import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FiAlertTriangle, FiRefreshCw, FiTrash2, FiShield, FiEye } from 'react-icons/fi';
import { accountReportsApi, AccountReport, AccountRating } from '../../services/accountReportsApi';
import { toast } from 'react-toastify';

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  pending:      { bg: '#fff3e0', color: '#f57c00' },
  in_mediation: { bg: '#e3f2fd', color: '#1976d2' },
  in_progress:  { bg: '#f3e5f5', color: '#7b1fa2' },
  resolved:     { bg: '#e8f5e9', color: '#388e3c' },
  dismissed:    { bg: '#f5f5f5', color: '#616161' },
};

const BADGE_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  GOLD:   { label: '🥇 Gold',   color: '#92400e', bg: '#fef3c7' },
  SILVER: { label: '🥈 Silver', color: '#374151', bg: '#f3f4f6' },
  BRONZE: { label: '🥉 Bronze', color: '#78350f', bg: '#fde8d8' },
};

const AccountReports: React.FC = () => {
  const [reports, setReports] = useState<AccountReport[]>([]);
  const [ratings, setRatings] = useState<Record<string, AccountRating>>({});
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReport, setSelectedReport] = useState<AccountReport | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [newStatus, setNewStatus] = useState<AccountReport['status']>('in_progress');
  const [adminNotes, setAdminNotes] = useState('');
  const [updating, setUpdating] = useState(false);
  const [detailReport, setDetailReport] = useState<AccountReport | null>(null);
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      setLoading(true);
      const data = await accountReportsApi.getAllReports();
      const list = Array.isArray(data) ? data : [];
      setReports(list);
      // Fetch ratings for unique reported party IDs
      fetchRatings(list);
    } catch (err: any) {
      const status = err.message?.includes('403') || err.response?.status === 403;
      if (status) {
        toast.error('Access denied — admin role required to view reports');
      } else {
        toast.error(err.message || 'Failed to load reports');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchRatings = async (list: AccountReport[]) => {
    const uniqueIds = [...new Set(list.map(r => r.reportedPartyId))];
    const results = await Promise.allSettled(
      uniqueIds.map(id => accountReportsApi.getAccountRating(id))
    );
    const map: Record<string, AccountRating> = {};
    results.forEach((res, i) => {
      if (res.status === 'fulfilled') map[uniqueIds[i]] = res.value;
    });
    setRatings(map);
  };

  const openActionModal = (report: AccountReport) => {
    setSelectedReport(report);
    setNewStatus(report.status);
    setAdminNotes(report.adminNotes || '');
    setShowModal(true);
  };

  const openDetailModal = (report: AccountReport) => {
    setDetailReport(report);
    setShowDetail(true);
  };

  const handleUpdateStatus = async () => {
    if (!selectedReport) return;
    try {
      setUpdating(true);
      const updated = await accountReportsApi.updateReportStatus(selectedReport.id, {
        status: newStatus,
        adminNotes,
      });
      setReports(prev => prev.map(r => r.id === selectedReport.id ? { ...r, ...updated } : r));
      toast.success('Report status updated');
      setShowModal(false);
    } catch (err: any) {
      toast.error(err.message || 'Failed to update report');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this report? This cannot be undone.')) return;
    try {
      await accountReportsApi.deleteReport(id);
      setReports(prev => prev.filter(r => r.id !== id));
      toast.success('Report deleted');
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete report');
    }
  };

  const uniqueTypes = [...new Set(reports.map(r => r.type))];

  const filtered = reports.filter(r => {
    const matchStatus = statusFilter === 'all' || r.status === statusFilter;
    const matchType = typeFilter === 'all' || r.type === typeFilter;
    const matchSearch =
      r.reportedPartyId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.reporterPartyId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchStatus && matchType && matchSearch;
  });

  const countByStatus = (s: string) => reports.filter(r => r.status === s).length;

  return (
    <Container>
      <Header>
        <div>
          <PageTitle><FiAlertTriangle /> Flagged Accounts & Reports</PageTitle>
          <PageSub>{reports.length} total reports</PageSub>
        </div>
        <RefreshBtn onClick={loadReports} disabled={loading}>
          <FiRefreshCw /> Refresh
        </RefreshBtn>
      </Header>

      {/* Stats */}
      <StatsRow>
        {(['pending', 'in_mediation', 'in_progress', 'resolved', 'dismissed'] as const).map(s => (
          <StatCard
            key={s}
            $color={STATUS_COLORS[s].color}
            $bg={STATUS_COLORS[s].bg}
            $active={statusFilter === s}
            onClick={() => setStatusFilter(statusFilter === s ? 'all' : s)}
          >
            <StatNum>{countByStatus(s)}</StatNum>
            <StatLbl>{s.replace('_', ' ')}</StatLbl>
          </StatCard>
        ))}
      </StatsRow>

      {/* Filters */}
      <FilterBar>
        <SearchInput
          type="text"
          placeholder="Search by party ID or description..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <FilterSelect value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="in_mediation">In Mediation</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="dismissed">Dismissed</option>
        </FilterSelect>
        <FilterSelect value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
          <option value="all">All Types</option>
          {uniqueTypes.map(t => (
            <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>
          ))}
        </FilterSelect>
      </FilterBar>

      {/* Table */}
      {loading ? (
        <LoadingMsg>Loading reports...</LoadingMsg>
      ) : filtered.length === 0 ? (
        <EmptyMsg>No reports found</EmptyMsg>
      ) : (
        <TableCard>
          <Table>
            <thead>
              <tr>
                <Th>Reported Account</Th>
                <Th>Reporter</Th>
                <Th>Type</Th>
                <Th>Trust Rating</Th>
                <Th>Status</Th>
                <Th>Date</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(report => {
                const rating = ratings[report.reportedPartyId];
                const isLowRating = rating && rating.rating < 4;
                const badge = rating?.ethicalPremiumBadgeLevel
                  ? BADGE_CONFIG[rating.ethicalPremiumBadgeLevel]
                  : null;

                return (
                  <Tr key={report.id} $alert={isLowRating}>
                    <Td>
                      <PartyCell>
                        <PartyId>{report.reportedPartyId}</PartyId>
                        {badge && <TrustBadge $bg={badge.bg} $color={badge.color}>{badge.label}</TrustBadge>}
                        {isLowRating && <AlertBadge>⚠ Low Trust</AlertBadge>}
                      </PartyCell>
                    </Td>
                    <Td><PartyId>{report.reporterPartyId}</PartyId></Td>
                    <Td><TypeBadge>{report.type.replace(/_/g, ' ')}</TypeBadge></Td>
                    <Td>
                      {rating ? (
                        <RatingCell $low={isLowRating}>
                          <RatingNum $low={isLowRating}>{rating.rating}/10</RatingNum>
                          <RatingBar>
                            <RatingFill $pct={rating.rating * 10} $low={isLowRating} />
                          </RatingBar>
                        </RatingCell>
                      ) : <span style={{ color: '#bdc3c7', fontSize: 12 }}>—</span>}
                    </Td>
                    <Td>
                      <StatusBadge $status={report.status}>
                        {report.status.replace(/_/g, ' ')}
                      </StatusBadge>
                    </Td>
                    <Td>{new Date(report.createdAt).toLocaleDateString()}</Td>
                    <Td>
                      <ActionBtns>
                        <ActionBtn title="View Details" onClick={() => openDetailModal(report)}>
                          <FiEye />
                        </ActionBtn>
                        <ActionBtn $primary title="Take Action" onClick={() => openActionModal(report)}>
                          <FiShield /> Take Action
                        </ActionBtn>
                        <ActionBtn $danger title="Delete" onClick={() => handleDelete(report.id)}>
                          <FiTrash2 />
                        </ActionBtn>
                      </ActionBtns>
                    </Td>
                  </Tr>
                );
              })}
            </tbody>
          </Table>
        </TableCard>
      )}

      {/* Take Action Modal */}
      <Overlay $open={showModal} onClick={e => { if (e.target === e.currentTarget) setShowModal(false); }}>
        <ModalBox>
          <ModalHeader>
            <ModalTitle><FiShield /> Take Action</ModalTitle>
            <CloseBtn onClick={() => setShowModal(false)}>×</CloseBtn>
          </ModalHeader>
          {selectedReport && (
            <>
              <InfoGrid>
                <InfoItem><InfoLbl>Reported Party</InfoLbl><InfoVal>{selectedReport.reportedPartyId}</InfoVal></InfoItem>
                <InfoItem><InfoLbl>Reporter</InfoLbl><InfoVal>{selectedReport.reporterPartyId}</InfoVal></InfoItem>
                <InfoItem><InfoLbl>Type</InfoLbl><InfoVal><TypeBadge>{selectedReport.type.replace(/_/g, ' ')}</TypeBadge></InfoVal></InfoItem>
                <InfoItem><InfoLbl>Created</InfoLbl><InfoVal>{new Date(selectedReport.createdAt).toLocaleString()}</InfoVal></InfoItem>
              </InfoGrid>
              <InfoItem style={{ marginBottom: 16 }}>
                <InfoLbl>Description</InfoLbl>
                <DescBox>{selectedReport.description}</DescBox>
              </InfoItem>
              <InfoItem style={{ marginBottom: 16 }}>
                <InfoLbl>Update Status</InfoLbl>
                <StatusSelect value={newStatus} onChange={e => setNewStatus(e.target.value as AccountReport['status'])}>
                  <option value="pending">Pending</option>
                  <option value="in_mediation">In Mediation</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="dismissed">Dismissed</option>
                </StatusSelect>
              </InfoItem>
              <InfoItem style={{ marginBottom: 20 }}>
                <InfoLbl>Admin Notes</InfoLbl>
                <TextArea
                  value={adminNotes}
                  onChange={e => setAdminNotes(e.target.value)}
                  placeholder="Write your investigation notes or response..."
                  rows={4}
                />
              </InfoItem>
              <ModalActions>
                <CancelBtn onClick={() => setShowModal(false)}>Cancel</CancelBtn>
                <SubmitBtn onClick={handleUpdateStatus} disabled={updating}>
                  {updating ? 'Updating...' : 'Update Report'}
                </SubmitBtn>
              </ModalActions>
            </>
          )}
        </ModalBox>
      </Overlay>

      {/* Detail Modal */}
      <Overlay $open={showDetail} onClick={e => { if (e.target === e.currentTarget) setShowDetail(false); }}>
        <ModalBox>
          <ModalHeader>
            <ModalTitle><FiEye /> Report Details</ModalTitle>
            <CloseBtn onClick={() => setShowDetail(false)}>×</CloseBtn>
          </ModalHeader>
          {detailReport && (
            <>
              <InfoGrid>
                <InfoItem><InfoLbl>Report ID</InfoLbl><InfoVal style={{ fontFamily: 'monospace', fontSize: 12 }}>{detailReport.id}</InfoVal></InfoItem>
                <InfoItem><InfoLbl>Status</InfoLbl><InfoVal><StatusBadge $status={detailReport.status}>{detailReport.status.replace(/_/g, ' ')}</StatusBadge></InfoVal></InfoItem>
                <InfoItem><InfoLbl>Reported Party</InfoLbl><InfoVal>{detailReport.reportedPartyId}</InfoVal></InfoItem>
                <InfoItem><InfoLbl>Reporter</InfoLbl><InfoVal>{detailReport.reporterPartyId}</InfoVal></InfoItem>
                <InfoItem><InfoLbl>Type</InfoLbl><InfoVal><TypeBadge>{detailReport.type.replace(/_/g, ' ')}</TypeBadge></InfoVal></InfoItem>
                {detailReport.vacancyId && <InfoItem><InfoLbl>Vacancy ID</InfoLbl><InfoVal>{detailReport.vacancyId}</InfoVal></InfoItem>}
                <InfoItem><InfoLbl>Created</InfoLbl><InfoVal>{new Date(detailReport.createdAt).toLocaleString()}</InfoVal></InfoItem>
                <InfoItem><InfoLbl>Updated</InfoLbl><InfoVal>{new Date(detailReport.updatedAt).toLocaleString()}</InfoVal></InfoItem>
              </InfoGrid>
              <InfoItem style={{ marginBottom: 16 }}>
                <InfoLbl>Description</InfoLbl>
                <DescBox>{detailReport.description}</DescBox>
              </InfoItem>
              {detailReport.adminNotes && (
                <InfoItem>
                  <InfoLbl>Admin Notes</InfoLbl>
                  <DescBox>{detailReport.adminNotes}</DescBox>
                </InfoItem>
              )}
              {ratings[detailReport.reportedPartyId] && (
                <TrustSection>
                  <InfoLbl>Trust Rating for Reported Account</InfoLbl>
                  <TrustDetail>
                    <TrustScore $low={ratings[detailReport.reportedPartyId].rating < 4}>
                      {ratings[detailReport.reportedPartyId].rating}/10
                    </TrustScore>
                    <TrustExplanation>{ratings[detailReport.reportedPartyId].explanation}</TrustExplanation>
                  </TrustDetail>
                </TrustSection>
              )}
              <ModalActions>
                <SubmitBtn onClick={() => { setShowDetail(false); openActionModal(detailReport); }}>
                  <FiShield /> Take Action
                </SubmitBtn>
              </ModalActions>
            </>
          )}
        </ModalBox>
      </Overlay>
    </Container>
  );
};

export default AccountReports;

// ── Styled Components ──────────────────────────────────────────────────────
const Container = styled.div`max-width: 1400px;`;
const Header = styled.div`display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px;`;
const PageTitle = styled.h1`font-size: 26px; font-weight: 600; color: #2c3e50; display: flex; align-items: center; gap: 10px; margin: 0;`;
const PageSub = styled.p`font-size: 13px; color: #7f8c8d; margin: 4px 0 0;`;
const RefreshBtn = styled.button`display: flex; align-items: center; gap: 8px; padding: 10px 18px; background: #ecf0f1; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 500; color: #2c3e50; &:hover { background: #d5dbdb; } &:disabled { opacity: 0.5; }`;

const StatsRow = styled.div`display: flex; gap: 12px; margin-bottom: 24px; flex-wrap: wrap;`;
const StatCard = styled.div<{ $color: string; $bg: string; $active: boolean }>`
  flex: 1; min-width: 100px; background: ${p => p.$bg}; border-radius: 8px;
  padding: 14px 16px; border-left: 4px solid ${p => p.$color};
  cursor: pointer; opacity: ${p => p.$active ? 1 : 0.75};
  box-shadow: ${p => p.$active ? `0 0 0 2px ${p.$color}` : 'none'};
  transition: all 0.15s;
  &:hover { opacity: 1; }
`;
const StatNum = styled.div`font-size: 26px; font-weight: 700; color: #2c3e50;`;
const StatLbl = styled.div`font-size: 11px; font-weight: 500; color: #7f8c8d; text-transform: capitalize; margin-top: 2px;`;

const FilterBar = styled.div`background: white; padding: 16px 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); margin-bottom: 20px; display: flex; gap: 12px; flex-wrap: wrap;`;
const SearchInput = styled.input`flex: 1; min-width: 240px; padding: 10px 14px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px; &:focus { outline: none; border-color: #3498db; }`;
const FilterSelect = styled.select`padding: 10px 14px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px; background: white; cursor: pointer;`;

const TableCard = styled.div`background: white; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); overflow: hidden;`;
const Table = styled.table`width: 100%; border-collapse: collapse;`;
const Th = styled.th`padding: 14px 16px; text-align: left; font-size: 12px; font-weight: 600; color: #7f8c8d; border-bottom: 2px solid #ecf0f1; background: #f8f9fa; text-transform: uppercase; letter-spacing: 0.5px;`;
const Tr = styled.tr<{ $alert?: boolean }>`
  border-bottom: 1px solid #ecf0f1;
  background: ${p => p.$alert ? '#fff5f5' : 'white'};
  &:hover { background: ${p => p.$alert ? '#fee2e2' : '#f8f9fa'}; }
  &:last-child { border-bottom: none; }
`;
const Td = styled.td`padding: 14px 16px; font-size: 14px; color: #2c3e50; vertical-align: middle;`;

const PartyCell = styled.div`display: flex; flex-direction: column; gap: 4px;`;
const PartyId = styled.div`font-size: 13px; font-weight: 500; color: #2c3e50; font-family: monospace;`;
const TrustBadge = styled.span<{ $bg: string; $color: string }>`display: inline-block; padding: 2px 8px; border-radius: 10px; font-size: 11px; font-weight: 600; background: ${p => p.$bg}; color: ${p => p.$color};`;
const AlertBadge = styled.span`display: inline-block; padding: 2px 8px; border-radius: 10px; font-size: 11px; font-weight: 600; background: #fee2e2; color: #dc2626;`;
const TypeBadge = styled.span`padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 500; background: #ede9fe; color: #5b21b6; text-transform: capitalize;`;

const RatingCell = styled.div<{ $low?: boolean }>`display: flex; flex-direction: column; gap: 4px; min-width: 80px;`;
const RatingNum = styled.div<{ $low?: boolean }>`font-size: 13px; font-weight: 700; color: ${p => p.$low ? '#dc2626' : '#16a34a'};`;
const RatingBar = styled.div`height: 4px; background: #e5e7eb; border-radius: 2px; overflow: hidden;`;
const RatingFill = styled.div<{ $pct: number; $low?: boolean }>`height: 100%; width: ${p => p.$pct}%; background: ${p => p.$low ? '#dc2626' : '#16a34a'}; border-radius: 2px;`;

const StatusBadge = styled.span<{ $status: string }>`
  padding: 4px 10px; border-radius: 12px; font-size: 12px; font-weight: 500; text-transform: capitalize; white-space: nowrap;
  background: ${p => STATUS_COLORS[p.$status]?.bg || '#f5f5f5'};
  color: ${p => STATUS_COLORS[p.$status]?.color || '#616161'};
`;

const ActionBtns = styled.div`display: flex; gap: 6px; align-items: center;`;
const ActionBtn = styled.button<{ $primary?: boolean; $danger?: boolean }>`
  display: flex; align-items: center; gap: 4px;
  padding: ${p => p.$primary ? '6px 12px' : '6px'};
  border: none; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: 500;
  background: ${p => p.$danger ? 'none' : p.$primary ? '#3498db' : 'none'};
  color: ${p => p.$danger ? '#e74c3c' : p.$primary ? 'white' : '#7f8c8d'};
  &:hover { background: ${p => p.$danger ? '#fee2e2' : p.$primary ? '#2980b9' : '#f3f4f6'}; }
`;

const LoadingMsg = styled.div`text-align: center; padding: 60px; color: #7f8c8d; background: white; border-radius: 10px;`;
const EmptyMsg = styled.div`text-align: center; padding: 60px; color: #7f8c8d; background: white; border-radius: 10px;`;

// Modals
const Overlay = styled.div<{ $open: boolean }>`display: ${p => p.$open ? 'flex' : 'none'}; position: fixed; inset: 0; background: rgba(0,0,0,0.5); align-items: center; justify-content: center; z-index: 2000;`;
const ModalBox = styled.div`background: white; border-radius: 12px; padding: 28px; width: 90%; max-width: 620px; max-height: 90vh; overflow-y: auto;`;
const ModalHeader = styled.div`display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;`;
const ModalTitle = styled.h2`font-size: 18px; font-weight: 600; color: #2c3e50; margin: 0; display: flex; align-items: center; gap: 8px;`;
const CloseBtn = styled.button`background: none; border: none; font-size: 26px; cursor: pointer; color: #7f8c8d; line-height: 1;`;
const InfoGrid = styled.div`display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 16px;`;
const InfoItem = styled.div`display: flex; flex-direction: column; gap: 4px;`;
const InfoLbl = styled.span`font-size: 11px; font-weight: 600; color: #7f8c8d; text-transform: uppercase; letter-spacing: 0.5px;`;
const InfoVal = styled.span`font-size: 14px; color: #2c3e50;`;
const DescBox = styled.div`background: #f8f9fa; border: 1px solid #ecf0f1; border-radius: 6px; padding: 12px; font-size: 14px; color: #2c3e50; line-height: 1.6; margin-top: 4px; white-space: pre-wrap;`;
const StatusSelect = styled.select`width: 100%; padding: 10px 14px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px; background: white; margin-top: 4px;`;
const TextArea = styled.textarea`width: 100%; padding: 10px 14px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px; font-family: inherit; resize: vertical; margin-top: 4px; box-sizing: border-box; &:focus { outline: none; border-color: #3498db; }`;
const ModalActions = styled.div`display: flex; gap: 12px; justify-content: flex-end; margin-top: 20px;`;
const CancelBtn = styled.button`padding: 10px 20px; background: #ecf0f1; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; color: #2c3e50; &:hover { background: #d5dbdb; }`;
const SubmitBtn = styled.button`display: flex; align-items: center; gap: 6px; padding: 10px 20px; background: #3498db; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 500; &:hover { background: #2980b9; } &:disabled { opacity: 0.6; cursor: not-allowed; }`;
const TrustSection = styled.div`margin-top: 16px; padding: 14px; background: #f8f9fa; border-radius: 8px;`;
const TrustDetail = styled.div`display: flex; align-items: center; gap: 12px; margin-top: 8px;`;
const TrustScore = styled.div<{ $low: boolean }>`font-size: 24px; font-weight: 700; color: ${p => p.$low ? '#dc2626' : '#16a34a'};`;
const TrustExplanation = styled.div`font-size: 13px; color: #7f8c8d; line-height: 1.5;`;
