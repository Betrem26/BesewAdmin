import { accountApi, handleApiError } from './api';

export interface SupportTicket {
  _id: string;
  subject: string;
  message: string;
  category: string;
  subcategory?: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  partyId?: string;
  phone_number?: string;
  createdAt: string;
  updatedAt: string;
  adminNotes?: string;
}

export interface Subcategory {
  value: string;
  label: string;
}

export interface TicketCategory {
  category: string;
  label: string;
  subcategories: Subcategory[];
}

export interface CategoriesResponse {
  categories: TicketCategory[];
}

export interface CreateTicketDto {
  subject: string;
  message: string;
  category: string;
  subcategory?: string;
}

export interface UpdateTicketStatusDto {
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  adminNotes?: string;
}

export const customerSupportApi = {
  // GET /customer-support/categories
  getCategories: async (): Promise<CategoriesResponse> => {
    try {
      const response = await accountApi.get<CategoriesResponse>('/customer-support/categories');
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // POST /customer-support
  createTicket: async (data: CreateTicketDto): Promise<SupportTicket> => {
    try {
      const response = await accountApi.post<SupportTicket>('/customer-support', data);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // GET /customer-support/my
  getMyTickets: async (): Promise<SupportTicket[]> => {
    try {
      const response = await accountApi.get<SupportTicket[]>('/customer-support/my');
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // GET /customer-support/my/{id}
  getMyTicketById: async (id: string): Promise<SupportTicket> => {
    try {
      const response = await accountApi.get<SupportTicket>(`/customer-support/my/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // GET /customer-support/admin (Admin only)
  getAllTickets: async (): Promise<SupportTicket[]> => {
    try {
      const response = await accountApi.get<SupportTicket[]>('/customer-support/admin');
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // GET /customer-support/admin/{id} (Admin only)
  getTicket: async (id: string): Promise<SupportTicket> => {
    try {
      const response = await accountApi.get<SupportTicket>(`/customer-support/admin/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // DELETE /customer-support/admin/{id} (Admin only)
  deleteTicket: async (id: string): Promise<void> => {
    try {
      await accountApi.delete(`/customer-support/admin/${id}`);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // PUT /customer-support/admin/{id}/status (Admin only)
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

  // Computed stats from ticket list
  getTicketStats: async (): Promise<{ total: number; open: number; in_progress: number; resolved: number; closed: number }> => {
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
