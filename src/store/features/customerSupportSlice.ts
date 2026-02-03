// Customer Support Redux Slice
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { customerSupportApi, SupportTicket, UpdateTicketStatusDto } from '../../services/customerSupportApi';

interface CustomerSupportState {
  tickets: SupportTicket[];
  selectedTicket: SupportTicket | null;
  loading: boolean;
  error: string | null;
  stats: {
    total: number;
    open: number;
    in_progress: number;
    resolved: number;
    closed: number;
  } | null;
}

const initialState: CustomerSupportState = {
  tickets: [],
  selectedTicket: null,
  loading: false,
  error: null,
  stats: null,
};

// Async thunks
export const fetchAllTickets = createAsyncThunk(
  'customerSupport/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await customerSupportApi.getAllTickets();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchTicket = createAsyncThunk(
  'customerSupport/fetchOne',
  async (id: string, { rejectWithValue }) => {
    try {
      return await customerSupportApi.getTicket(id);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateTicketStatus = createAsyncThunk(
  'customerSupport/updateStatus',
  async ({ id, data }: { id: string; data: UpdateTicketStatusDto }, { rejectWithValue }) => {
    try {
      return await customerSupportApi.updateTicketStatus(id, data);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteTicket = createAsyncThunk(
  'customerSupport/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await customerSupportApi.deleteTicket(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchTicketStats = createAsyncThunk(
  'customerSupport/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      return await customerSupportApi.getTicketStats();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Slice
const customerSupportSlice = createSlice({
  name: 'customerSupport',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedTicket: (state) => {
      state.selectedTicket = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all tickets
    builder.addCase(fetchAllTickets.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchAllTickets.fulfilled, (state, action) => {
      state.loading = false;
      state.tickets = action.payload;
    });
    builder.addCase(fetchAllTickets.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch single ticket
    builder.addCase(fetchTicket.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchTicket.fulfilled, (state, action) => {
      state.loading = false;
      state.selectedTicket = action.payload;
    });
    builder.addCase(fetchTicket.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Update ticket status
    builder.addCase(updateTicketStatus.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateTicketStatus.fulfilled, (state, action) => {
      state.loading = false;
      const index = state.tickets.findIndex(t => t._id === action.payload._id);
      if (index !== -1) {
        state.tickets[index] = action.payload;
      }
      if (state.selectedTicket?._id === action.payload._id) {
        state.selectedTicket = action.payload;
      }
    });
    builder.addCase(updateTicketStatus.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Delete ticket
    builder.addCase(deleteTicket.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteTicket.fulfilled, (state, action) => {
      state.loading = false;
      state.tickets = state.tickets.filter(t => t._id !== action.payload);
      if (state.selectedTicket?._id === action.payload) {
        state.selectedTicket = null;
      }
    });
    builder.addCase(deleteTicket.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch stats
    builder.addCase(fetchTicketStats.fulfilled, (state, action) => {
      state.stats = action.payload;
    });
  },
});

export const { clearError, clearSelectedTicket } = customerSupportSlice.actions;
export default customerSupportSlice.reducer;
