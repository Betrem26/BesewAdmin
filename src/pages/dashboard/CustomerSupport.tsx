import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FiEye, FiTrash2, FiRefreshCw, FiMessageSquare } from 'react-icons/fi';
import { customerSupportApi, SupportTicket, TicketCategory } from '../../services/customerSupportApi';
import { toast } from 'react-toastify';

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  open:        { bg: '#e3f2fd', color: '#1976d2' },
  in_progress: { bg: '#fff3e0', color: '#f57c00' },
  resolved:    { bg: '#e8f5e9', color: '#388e3c' },
  closed:      { bg: '#f5f5f5', color: '#616161' },
};

const CustomerSupport: React.FC = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [categories, setCategories] = useState<TicketCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [newStatus, setNewStatus] = useState<SupportTicket['status']>('open');
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => {
    loadTickets();
    loadCategories();
  }, []);

  const loadTickets = async () => {
    try {
      setLoading(true);
      const data = await customerSupportApi.getAllTickets();
      setTickets(Array.isArray(data) ? data : []);
    } catch (err: any) {
      const status = err.response?.status;
      if (status === 403) {
        toast.error('Access denied — admin role required to view tickets');
      } else {
        toast.error(err.message || 'Failed to load tickets');
      }
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await customerSupportApi.getCategories();
      setCategories(data.categories || []);
    } catch {
      // non-critical — filter will still work with raw values
    }
  };

  // Resolve category key → human label using loaded categories
  const getCategoryLabel = (categoryKey: string): string => {
    const found = categories.find(c => c.category === categoryKey);
    return found ? found.label : categoryKey;
  };

  const getSubcategoryLabel = (categoryKey: string, subcategoryValue: string): string => {
    const cat = categories.find(c => c.category === categoryKey);
    if (!cat) return subcategoryValue;
    const sub = cat.subcategories.find(s => s.value === subcategoryValue);
    return sub ? sub.label : subcategoryValue;
  };

  const openModal = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    setNewStatus(ticket.status);
    setAdminNotes(ticket.adminNotes || '');
    setShowModal(true);
  };

  const handleUpdateStatus = async () => {
    if (!selectedTicket) return;
    try {
      setUpdating(true);
      const updated = await customerSupportApi.updateTicketStatus(selectedTicket._id, {
        status: newStatus,
        adminNotes,
      });
      setTickets(prev => prev.map(t => t._id === selectedTicket._id ? { ...t, ...updated } : t));
      toast.success('Ticket updated successfully');
      setShowModal(false);
    } catch (err: any) {
      toast.error(err.message || 'Failed to update ticket');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this ticket? This cannot be undone.')) return;
    try {
      await customerSupportApi.deleteTicket(id);
      setTickets(prev => prev.filter(t => t._id !== id));
      if (selectedTicket?._id === id) setShowModal(false);
      toast.success('Ticket deleted');
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete ticket');
    }
  };

  const filtered = tickets.filter(t => {
    const matchSearch =
      t.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.partyId || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'all' || t.status === statusFilter;
    const matchCat = categoryFilter === 'all' || t.category === categoryFilter;
    return matchSearch && matchStatus && matchCat;
  });

  // Stats
  const countByStatus = (s: string) => tickets.filter(t => t.status === s).length;

  return (
    <Container>
      <Header>
        <div>
          <PageTitle>Customer Support</PageTitle>
          <PageSubtitle>{tickets.length} total tickets</PageSubtitle>
        </div>
        <Btn onClick={loadTickets} disabled={loading}>
          <FiRefreshCw /> Refresh
        </Btn>
      </Header>

      {/* Stats row */}
      <StatsRow>
        {(['open', 'in_progress', 'resolved', 'closed'] as const).map(s => (
          <StatCard key={s} $color={STATUS_COLORS[s].color} $bg={STATUS_COLORS[s].bg}>
            <StatNum>{countByStatus(s)}</StatNum>
            <StatLabel>{s.replace('_', ' ')}</StatLabel>
          </StatCard>
        ))}
      </StatsRow>

      {/* Filters */}
      <FilterBar>
        <SearchInput
          type="text"
          placeholder="Search by subject, message or party ID..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <FilterSelect value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="all">All Status</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </FilterSelect>
        <FilterSelect value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
          <option value="all">All Categories</option>
          {categories.map(cat => (
            <option key={cat.category} value={cat.category}>{cat.label}</option>
          ))}
        </FilterSelect>
      </FilterBar>

      {/* Table */}
      {loading ? (
        <LoadingMessage>Loading support tickets...</LoadingMessage>
      ) : filtered.length === 0 ? (
        <EmptyMessage>
          <FiMessageSquare size={40} style={{ marginBottom: 12, opacity: 0.3 }} />
          <div>No tickets found</div>
        </EmptyMessage>
      ) : (
        <TableCard>
          <Table>
            <thead>
              <tr>
                <Th>Subject</Th>
                <Th>Category / Subcategory</Th>
                <Th>User (Party ID)</Th>
                <Th>Status</Th>
                <Th>Created</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(ticket => (
                <Tr key={ticket._id}>
                  <Td>
                    <SubjectText>{ticket.subject}</SubjectText>
                    <MessagePreview>{ticket.message.slice(0, 60)}{ticket.message.length > 60 ? '...' : ''}</MessagePreview>
                  </Td>
                  <Td>
                    <CategoryLabel>{getCategoryLabel(ticket.category)}</CategoryLabel>
                    {ticket.subcategory && (
                      <SubcategoryLabel>{getSubcategoryLabel(ticket.category, ticket.subcategory)}</SubcategoryLabel>
                    )}
                  </Td>
                  <Td>{ticket.partyId || <span style={{ color: '#bdc3c7' }}>—</span>}</Td>
                  <Td>
                    <StatusBadge $status={ticket.status}>
                      {ticket.status.replace('_', ' ')}
                    </StatusBadge>
                  </Td>
                  <Td>{new Date(ticket.createdAt).toLocaleDateString()}</Td>
                  <Td>
                    <ActionButtons>
                      <ActionBtn title="View & Update" onClick={() => openModal(ticket)}>
                        <FiEye />
                      </ActionBtn>
                      <ActionBtn $danger title="Delete" onClick={() => handleDelete(ticket._id)}>
                        <FiTrash2 />
                      </ActionBtn>
                    </ActionButtons>
                  </Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        </TableCard>
      )}

      {/* Modal */}
      <Overlay $isOpen={showModal} onClick={e => { if (e.target === e.currentTarget) setShowModal(false); }}>
        <ModalBox>
          <ModalHeader>
            <ModalTitle>Ticket Details</ModalTitle>
            <CloseBtn onClick={() => setShowModal(false)}>×</CloseBtn>
          </ModalHeader>

          {selectedTicket && (
            <>
              <TicketInfoGrid>
                <InfoItem>
                  <InfoLabel>Subject</InfoLabel>
                  <InfoValue>{selectedTicket.subject}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Party ID (User)</InfoLabel>
                  <InfoValue>{selectedTicket.partyId || '—'}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Category</InfoLabel>
                  <InfoValue>
                    {getCategoryLabel(selectedTicket.category)}
                    {selectedTicket.subcategory && (
                      <> › {getSubcategoryLabel(selectedTicket.category, selectedTicket.subcategory)}</>
                    )}
                  </InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Created</InfoLabel>
                  <InfoValue>{new Date(selectedTicket.createdAt).toLocaleString()}</InfoValue>
                </InfoItem>
              </TicketInfoGrid>

              <InfoItem style={{ marginBottom: 20 }}>
                <InfoLabel>Message</InfoLabel>
                <MessageBox>{selectedTicket.message}</MessageBox>
              </InfoItem>

              <Divider />

              <InfoItem>
                <InfoLabel>Update Status</InfoLabel>
                <StatusSelect
                  value={newStatus}
                  onChange={e => setNewStatus(e.target.value as SupportTicket['status'])}
                >
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </StatusSelect>
              </InfoItem>

              <InfoItem>
                <InfoLabel>Admin Notes / Response</InfoLabel>
                <TextArea
                  value={adminNotes}
                  onChange={e => setAdminNotes(e.target.value)}
                  placeholder="Write your response or internal notes here..."
                  rows={4}
                />
              </InfoItem>

              <ModalActions>
                <Btn $secondary onClick={() => setShowModal(false)}>Cancel</Btn>
                <Btn onClick={handleUpdateStatus} disabled={updating}>
                  {updating ? 'Updating...' : 'Update Ticket'}
                </Btn>
              </ModalActions>
            </>
          )}
        </ModalBox>
      </Overlay>
    </Container>
  );
};

export default CustomerSupport;

// --- Styled Components ---
const Container = styled.div`max-width: 1400px;`;
const Header = styled.div`display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px;`;
const PageTitle = styled.h1`font-size: 26px; font-weight: 600; color: #2c3e50; margin: 0;`;
const PageSubtitle = styled.p`font-size: 13px; color: #7f8c8d; margin: 4px 0 0;`;

const Btn = styled.button<{ $secondary?: boolean }>`
  background: ${p => p.$secondary ? '#ecf0f1' : '#3498db'};
  color: ${p => p.$secondary ? '#2c3e50' : 'white'};
  border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer;
  font-size: 14px; font-weight: 500; display: flex; align-items: center; gap: 8px;
  &:hover { background: ${p => p.$secondary ? '#d5dbdb' : '#2980b9'}; }
  &:disabled { opacity: 0.6; cursor: not-allowed; }
`;

const StatsRow = styled.div`display: flex; gap: 16px; margin-bottom: 24px; flex-wrap: wrap;`;
const StatCard = styled.div<{ $color: string; $bg: string }>`
  flex: 1; min-width: 100px; background: ${p => p.$bg}; border-radius: 8px;
  padding: 16px 20px; border-left: 4px solid ${p => p.$color};
`;
const StatNum = styled.div`font-size: 28px; font-weight: 700; color: #2c3e50;`;
const StatLabel = styled.div`font-size: 12px; font-weight: 500; color: #7f8c8d; text-transform: capitalize; margin-top: 2px;`;

const FilterBar = styled.div`
  background: white; padding: 16px 20px; border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05); margin-bottom: 20px;
  display: flex; gap: 12px; flex-wrap: wrap;
`;
const SearchInput = styled.input`
  flex: 1; min-width: 240px; padding: 10px 14px; border: 1px solid #ddd;
  border-radius: 6px; font-size: 14px;
  &:focus { outline: none; border-color: #3498db; }
`;
const FilterSelect = styled.select`
  padding: 10px 14px; border: 1px solid #ddd; border-radius: 6px;
  font-size: 14px; background: white; cursor: pointer;
  &:focus { outline: none; border-color: #3498db; }
`;

const TableCard = styled.div`background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); overflow: hidden;`;
const Table = styled.table`width: 100%; border-collapse: collapse;`;
const Th = styled.th`padding: 14px 16px; text-align: left; font-size: 13px; font-weight: 600; color: #2c3e50; border-bottom: 2px solid #ecf0f1; background: #f8f9fa;`;
const Tr = styled.tr`border-bottom: 1px solid #ecf0f1; &:hover { background: #f8f9fa; } &:last-child { border-bottom: none; }`;
const Td = styled.td`padding: 14px 16px; font-size: 14px; color: #2c3e50; vertical-align: top;`;

const SubjectText = styled.div`font-weight: 500; font-size: 14px; color: #2c3e50;`;
const MessagePreview = styled.div`font-size: 12px; color: #95a5a6; margin-top: 3px;`;
const CategoryLabel = styled.div`font-size: 13px; font-weight: 500; color: #2c3e50;`;
const SubcategoryLabel = styled.div`font-size: 12px; color: #7f8c8d; margin-top: 2px;`;

const StatusBadge = styled.span<{ $status: string }>`
  padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 500;
  text-transform: capitalize; white-space: nowrap;
  background: ${p => STATUS_COLORS[p.$status]?.bg || '#ecf0f1'};
  color: ${p => STATUS_COLORS[p.$status]?.color || '#7f8c8d'};
`;

const ActionButtons = styled.div`display: flex; gap: 6px;`;
const ActionBtn = styled.button<{ $danger?: boolean }>`
  background: none; border: none; cursor: pointer; padding: 6px;
  color: ${p => p.$danger ? '#e74c3c' : '#3498db'}; font-size: 16px;
  border-radius: 4px; display: flex; align-items: center;
  &:hover { background: ${p => p.$danger ? '#fdecea' : '#ebf5fb'}; }
`;

const LoadingMessage = styled.div`text-align: center; padding: 60px; color: #7f8c8d; background: white; border-radius: 8px;`;
const EmptyMessage = styled.div`
  text-align: center; padding: 60px 20px; color: #7f8c8d;
  background: white; border-radius: 8px; display: flex; flex-direction: column; align-items: center;
`;

// Modal
const Overlay = styled.div<{ $isOpen: boolean }>`
  display: ${p => p.$isOpen ? 'flex' : 'none'};
  position: fixed; inset: 0; background: rgba(0,0,0,0.5);
  align-items: center; justify-content: center; z-index: 2000;
`;
const ModalBox = styled.div`
  background: white; border-radius: 10px; padding: 28px;
  width: 90%; max-width: 620px; max-height: 90vh; overflow-y: auto;
`;
const ModalHeader = styled.div`display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;`;
const ModalTitle = styled.h2`font-size: 20px; font-weight: 600; color: #2c3e50; margin: 0;`;
const CloseBtn = styled.button`background: none; border: none; font-size: 26px; cursor: pointer; color: #7f8c8d; line-height: 1; &:hover { color: #2c3e50; }`;

const TicketInfoGrid = styled.div`display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;`;
const InfoItem = styled.div`display: flex; flex-direction: column; gap: 4px;`;
const InfoLabel = styled.span`font-size: 12px; font-weight: 600; color: #7f8c8d; text-transform: uppercase; letter-spacing: 0.5px;`;
const InfoValue = styled.span`font-size: 14px; color: #2c3e50;`;
const MessageBox = styled.div`
  background: #f8f9fa; border: 1px solid #ecf0f1; border-radius: 6px;
  padding: 12px; font-size: 14px; color: #2c3e50; line-height: 1.6;
  white-space: pre-wrap; margin-top: 4px;
`;
const Divider = styled.hr`border: none; border-top: 1px solid #ecf0f1; margin: 20px 0;`;
const StatusSelect = styled.select`
  padding: 10px 14px; border: 1px solid #ddd; border-radius: 6px;
  font-size: 14px; background: white; cursor: pointer; width: 100%;
  &:focus { outline: none; border-color: #3498db; }
`;
const TextArea = styled.textarea`
  width: 100%; padding: 10px 14px; border: 1px solid #ddd; border-radius: 6px;
  font-size: 14px; font-family: inherit; resize: vertical;
  &:focus { outline: none; border-color: #3498db; }
  box-sizing: border-box;
`;
const ModalActions = styled.div`display: flex; gap: 12px; justify-content: flex-end; margin-top: 24px;`;
