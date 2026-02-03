import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { psychometricAdminApi, GenerateQuestionsDto, AnalystReviewDto, GenerateQuestionsResponse } from '../../services/psychometricApi';

interface PsychometricState {
  generatedQuestions: GenerateQuestionsResponse | null;
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: PsychometricState = {
  generatedQuestions: null,
  loading: false,
  error: null,
  successMessage: null,
};

// Async thunks
export const generateQuestions = createAsyncThunk(
  'psychometric/generateQuestions',
  async (data: GenerateQuestionsDto) => {
    const response = await psychometricAdminApi.generateQuestions(data);
    return response;
  }
);

export const reviewQuestion = createAsyncThunk(
  'psychometric/reviewQuestion',
  async (data: AnalystReviewDto) => {
    const response = await psychometricAdminApi.reviewQuestion(data);
    return response;
  }
);

const psychometricSlice = createSlice({
  name: 'psychometric',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
    clearGeneratedQuestions: (state) => {
      state.generatedQuestions = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Generate questions
      .addCase(generateQuestions.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(generateQuestions.fulfilled, (state, action) => {
        state.loading = false;
        state.generatedQuestions = action.payload;
        state.successMessage = 'Questions generated successfully';
      })
      .addCase(generateQuestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to generate questions';
      })
      // Review question
      .addCase(reviewQuestion.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(reviewQuestion.fulfilled, (state) => {
        state.loading = false;
        state.successMessage = 'Question reviewed successfully';
      })
      .addCase(reviewQuestion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to review question';
      });
  },
});

export const { clearError, clearSuccessMessage, clearGeneratedQuestions } = psychometricSlice.actions;
export default psychometricSlice.reducer;
