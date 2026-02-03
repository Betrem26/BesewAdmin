// Customer Support API Service
import { accountApi, handleApiError } from './api';

export interface SupportTicket {
  _id: string;
  subject: string;
  message: string;
  category: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  partyId: string;
  phone_number: string;
  createdAt: string;
  updatedAt: string;
  adminNotes?: string;
}

export interface UpdateTicketStatusDto {
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  adminNotes?: string;
}

export const customerSupportApi = {
  /**
   * Get all support tickets (Admin only)
   */
  getAllTickets: async (): Promise<SupportTicket[]> => {
    try {
      const response = await accountApi.get<SupportTicket[]>('/customer-support/admin');
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Get specific support ticket by ID (Admin only)
   */
  getTicket: async (id: string): Promise<SupportTicket> => {
    try {
      const response = await accountApi.get<SupportTicket>(`/customer-support/admin/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Update support ticket status (Admin only)
   */
  updateTicketStatus: async (id: string, data: UpdateTicketStatusDto): Promise<SupportTicket> => {
    try {
      const response = await accountApi.put<SupportTicket>(
        `/customer-support/admin/${id}/status`,
        data
      );
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Delete support ticket (Admin only)
   */
  deleteTicket: async (id: string): Promise<void> => {
    try {
      await accountApi.delete(`/customer-support/admin/${id}`);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Get ticket statistics
   */
  getTicketStats: async (): Promise<{
    total: number;
    open: number;
    in_progress: number;
    resolved: number;
    closed: number;
  }> => {
    try {
      const tickets = await customerSupportApi.getAllTickets();
      return {
        total: tickets.length,
        open: tickets.filter(t => t.status === 'open').length,
        in_progress: tickets.filter(t => t.status === 'in_progress').length,
        resolved: tickets.filter(t => t.status === 'resolved').length,
        closed: tickets.filter(t => t.status === 'closed').length,
      };
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};
