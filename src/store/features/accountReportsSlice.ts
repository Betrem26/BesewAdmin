import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { accountReportsApi, AccountReport } from '../../services/accountReportsApi';

interface AccountReportsState {
  reports: AccountReport[];
  selectedReport: AccountReport | null;
  loading: boolean;
  error: string | null;
}

const initialState: AccountReportsState = {
  reports: [],
  selectedReport: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchReports = createAsyncThunk(
  'accountReports/fetchReports',
  async () => {
    const response = await accountReportsApi.getAllReports();
    return response;
  }
);

export const fetchReportById = createAsyncThunk(
  'accountReports/fetchReportById',
  async (id: string) => {
    const response = await accountReportsApi.getReport(id);
    return response;
  }
);

export const updateReportStatus = createAsyncThunk(
  'accountReports/updateReportStatus',
  async ({ id, data }: { id: string; data: { status: 'pending' | 'under_review' | 'resolved' | 'dismissed'; adminNotes?: string } }) => {
    const response = await accountReportsApi.updateReportStatus(id, data);
    return response;
  }
);

export const deleteReport = createAsyncThunk(
  'accountReports/deleteReport',
  async (id: string) => {
    await accountReportsApi.deleteReport(id);
    return id;
  }
);

const accountReportsSlice = createSlice({
  name: 'accountReports',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedReport: (state) => {
      state.selectedReport = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch reports
      .addCase(fetchReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReports.fulfilled, (state, action) => {
        state.loading = false;
        state.reports = action.payload;
      })
      .addCase(fetchReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch reports';
      })
      // Fetch report by ID
      .addCase(fetchReportById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReportById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedReport = action.payload;
      })
      .addCase(fetchReportById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch report';
      })
      // Update report status
      .addCase(updateReportStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateReportStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.reports.findIndex(r => r._id === action.payload._id);
        if (index !== -1) {
          state.reports[index] = action.payload;
        }
        if (state.selectedReport?._id === action.payload._id) {
          state.selectedReport = action.payload;
        }
      })
      .addCase(updateReportStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update report status';
      })
      // Delete report
      .addCase(deleteReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteReport.fulfilled, (state, action) => {
        state.loading = false;
        state.reports = state.reports.filter(r => r._id !== action.payload);
        if (state.selectedReport?._id === action.payload) {
          state.selectedReport = null;
        }
      })
      .addCase(deleteReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete report';
      });
  },
});

export const { clearError, clearSelectedReport } = accountReportsSlice.actions;
export default accountReportsSlice.reducer;
