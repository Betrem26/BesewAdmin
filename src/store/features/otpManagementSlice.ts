import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { otpManagementApi, BlockedNumber, RateLimitStatus, ResetRateLimitDto } from '../../services/otpManagementApi';

interface OTPManagementState {
  blockedNumbers: BlockedNumber[];
  rateLimitStatus: RateLimitStatus | null;
  loading: boolean;
  error: string | null;
}

const initialState: OTPManagementState = {
  blockedNumbers: [],
  rateLimitStatus: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchBlockedNumbers = createAsyncThunk(
  'otpManagement/fetchBlockedNumbers',
  async () => {
    const response = await otpManagementApi.getBlockedNumbers();
    return response;
  }
);

export const checkRateLimitStatus = createAsyncThunk(
  'otpManagement/checkRateLimitStatus',
  async (phoneNumber: string) => {
    const response = await otpManagementApi.getRateLimitStatus(phoneNumber);
    return response;
  }
);

export const resetRateLimit = createAsyncThunk(
  'otpManagement/resetRateLimit',
  async (data: ResetRateLimitDto) => {
    const response = await otpManagementApi.resetRateLimit(data);
    return response;
  }
);

const otpManagementSlice = createSlice({
  name: 'otpManagement',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearRateLimitStatus: (state) => {
      state.rateLimitStatus = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch blocked numbers
      .addCase(fetchBlockedNumbers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlockedNumbers.fulfilled, (state, action) => {
        state.loading = false;
        state.blockedNumbers = action.payload.blockedNumbers;
      })
      .addCase(fetchBlockedNumbers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch blocked numbers';
      })
      // Check rate limit status
      .addCase(checkRateLimitStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkRateLimitStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.rateLimitStatus = action.payload;
      })
      .addCase(checkRateLimitStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to check rate limit status';
      })
      // Reset rate limit
      .addCase(resetRateLimit.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetRateLimit.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resetRateLimit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to reset rate limit';
      });
  },
});

export const { clearError, clearRateLimitStatus } = otpManagementSlice.actions;
export default otpManagementSlice.reducer;
