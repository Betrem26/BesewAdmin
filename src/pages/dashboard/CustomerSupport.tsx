import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FiEye, FiTrash2, FiRefreshCw } from 'react-icons/fi';
import { customerSupportApi, SupportTicket } from '../../services/customerSupportApi';
import { toast } from 'react-toastify';

const Container = styled.div`
  max-width: 1400px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const PageTitle = styled.h1`
  font-size: 28px;
  font-weight: 600;
  color: #2c3e50;
`;

const Actions = styled.div`
  display: flex;
  gap: 12px;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  background: ${props => props.variant === 'secondary' ? '#ecf0f1' : '#3498db'};
  color: ${props => props.variant === 'secondary' ? '#2c3e50' : 'white'};
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.variant === 'secondary' ? '#d5dbdb' : '#2980b9'};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const FilterBar = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin-bottom: 20px;
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
`;

const SearchInput = styled.input`
  flex: 1;
  min-width: 250px;
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #3498db;
  }
`;

const Select = styled.select`
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  background: white;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #3498db;
  }
`;

const Table = styled.table`
  width: 100%;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;
`;

const Thead = styled.thead`
  background: #f8f9fa;
`;

const Th = styled.th`
  padding: 16px;
  text-align: left;
  font-size: 14px;
  font-weight: 600;
  color: #2c3e50;
  border-bottom: 2px solid #ecf0f1;
`;

const Tbody = styled.tbody``;

const Tr = styled.tr`
  border-bottom: 1px solid #ecf0f1;
  transition: background 0.2s;

  &:hover {
    background: #f8f9fa;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const Td = styled.td`
  padding: 16px;
  font-size: 14px;
  color: #2c3e50;
`;

const StatusBadge = styled.span<{ status: string }>`
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  background: ${props => {
    switch (props.status) {
      case 'open': return '#e3f2fd';
      case 'in_progress': return '#fff3e0';
      case 'resolved': return '#e8f5e9';
      case 'closed': return '#f5f5f5';
      default: return '#ecf0f1';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'open': return '#1976d2';
      case 'in_progress': return '#f57c00';
      case 'resolved': return '#388e3c';
      case 'closed': return '#616161';
      default: return '#7f8c8d';
    }
  }};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const IconButton = styled.button<{ color?: string }>`
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px;
  color: ${props => props.color || '#3498db'};
  font-size: 18px;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.7;
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: #7f8c8d;
  background: white;
  border-radius: 8px;
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #7f8c8d;
  background: white;
  border-radius: 8px;
`;

const Modal = styled.div<{ isOpen: boolean }>`
  display: ${props => props.isOpen ? 'flex' : 'none'};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  align-items: center;
  justify-content: center;
  z-index: 2000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 8px;
  padding: 30px;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
`;

const ModalTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 20px;
`;

const ModalField = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #2c3e50;
  margin-bottom: 8px;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
  min-height: 100px;

  &:focus {
    outline: none;
    border-color: #3498db;
  }
`;

const ModalActions = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
`;

const CustomerSupport: React.FC = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => {
    loadTickets();
  }, []);

  useEffect(() => {
    filterTickets();
  }, [tickets, searchTerm, statusFilter, categoryFilter]);

  const loadTickets = async () => {
    try {
      setLoading(true);
      const data = await customerSupportApi.getAllTickets();
      setTickets(data);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load tickets');
    } finally {
      setLoading(false);
    }
  };

  const filterTickets = () => {
    let filtered = [...tickets];

    if (searchTerm) {
      filtered = filtered.filter(ticket =>
        ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.partyId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(ticket => ticket.status === statusFilter);
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(ticket => ticket.category === categoryFilter);
    }

    setFilteredTickets(filtered);
  };

  const handleViewTicket = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    setNewStatus(ticket.status);
    setAdminNotes(ticket.adminNotes || '');
    setShowModal(true);
  };

  const handleUpdateStatus = async () => {
    if (!selectedTicket) return;

    try {
      await customerSupportApi.updateTicketStatus(selectedTicket._id, {
        status: newStatus as any,
        adminNotes,
      });
      toast.success('Ticket updated successfully');
      setShowModal(false);
      loadTickets();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update ticket');
    }
  };

  const handleDeleteTicket = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this ticket?')) return;

    try {
      await customerSupportApi.deleteTicket(id);
      toast.success('Ticket deleted successfully');
      loadTickets();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete ticket');
    }
  };

  if (loading) {
    return <LoadingMessage>Loading support tickets...</LoadingMessage>;
  }

  return (
    <Container>
      <Header>
        <PageTitle>Customer Support</PageTitle>
        <Actions>
          <Button variant="secondary" onClick={loadTickets}>
            <FiRefreshCw />
            Refresh
          </Button>
        </Actions>
      </Header>

      <FilterBar>
        <SearchInput
          type="text"
          placeholder="Search tickets..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">All Status</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </Select>
        <Select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          <option value="all">All Categories</option>
          <option value="technical">Technical</option>
          <option value="billing">Billing</option>
          <option value="account">Account</option>
          <option value="general">General</option>
        </Select>
      </FilterBar>

      {filteredTickets.length === 0 ? (
        <EmptyMessage>No tickets found</EmptyMessage>
      ) : (
        <Table>
          <Thead>
            <Tr>
              <Th>Subject</Th>
              <Th>Category</Th>
              <Th>Status</Th>
              <Th>Party ID</Th>
              <Th>Created</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredTickets.map((ticket) => (
              <Tr key={ticket._id}>
                <Td>{ticket.subject}</Td>
                <Td>{ticket.category}</Td>
                <Td>
                  <StatusBadge status={ticket.status}>{ticket.status.replace('_', ' ')}</StatusBadge>
                </Td>
                <Td>{ticket.partyId}</Td>
                <Td>{new Date(ticket.createdAt).toLocaleDateString()}</Td>
                <Td>
                  <ActionButtons>
                    <IconButton onClick={() => handleViewTicket(ticket)}>
                      <FiEye />
                    </IconButton>
                    <IconButton color="#e74c3c" onClick={() => handleDeleteTicket(ticket._id)}>
                      <FiTrash2 />
                    </IconButton>
                  </ActionButtons>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}

      <Modal isOpen={showModal}>
        <ModalContent>
          <ModalTitle>Ticket Details</ModalTitle>
          {selectedTicket && (
            <>
              <ModalField>
                <Label>Subject</Label>
                <div>{selectedTicket.subject}</div>
              </ModalField>
              <ModalField>
                <Label>Message</Label>
                <div>{selectedTicket.message}</div>
              </ModalField>
              <ModalField>
                <Label>Category</Label>
                <div>{selectedTicket.category}</div>
              </ModalField>
              <ModalField>
                <Label>Party ID</Label>
                <div>{selectedTicket.partyId}</div>
              </ModalField>
              <ModalField>
                <Label>Phone Number</Label>
                <div>{selectedTicket.phone_number}</div>
              </ModalField>
              <ModalField>
                <Label>Status</Label>
                <Select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </Select>
              </ModalField>
              <ModalField>
                <Label>Admin Notes</Label>
                <TextArea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add notes about this ticket..."
                />
              </ModalField>
              <ModalActions>
                <Button variant="secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateStatus}>
                  Update Ticket
                </Button>
              </ModalActions>
            </>
          )}
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default CustomerSupport;
