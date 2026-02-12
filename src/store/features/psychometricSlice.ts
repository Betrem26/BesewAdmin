import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { psychometricAdminApi, GenerateQuestionsDto, AnalystReviewDto, GenerateQuestionsResponse } from '../../services/psychometricApi';
import psychometricConfigApi, { PsychometricConfiguration } from '../../services/psychometricConfigApi';

interface PsychometricState {
  // Question generation state
  generatedQuestions: GenerateQuestionsResponse | null;
  
  // Configuration management state
  configurations: PsychometricConfiguration[];
  activeConfiguration: PsychometricConfiguration | null;
  selectedConfiguration: PsychometricConfiguration | null;
  
  // Loading states
  loading: boolean;
  configurationsLoading: boolean;
  savingConfiguration: boolean;
  activatingConfiguration: boolean;
  
  // Error and success messages
  error: string | null;
  successMessage: string | null;
}

const initialState: PsychometricState = {
  generatedQuestions: null,
  configurations: [],
  activeConfiguration: null,
  selectedConfiguration: null,
  loading: false,
  configurationsLoading: false,
  savingConfiguration: false,
  activatingConfiguration: false,
  error: null,
  successMessage: null,
};

// Question generation thunks
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

// Configuration management thunks
export const fetchActiveConfiguration = createAsyncThunk(
  'psychometric/fetchActiveConfiguration',
  async () => {
    const response = await psychometricConfigApi.getActiveConfiguration();
    return response;
  }
);

export const fetchAllConfigurations = createAsyncThunk(
  'psychometric/fetchAllConfigurations',
  async () => {
    const response = await psychometricConfigApi.getAllConfigurations();
    return response;
  }
);

export const fetchConfigurationById = createAsyncThunk(
  'psychometric/fetchConfigurationById',
  async (id: string) => {
    const response = await psychometricConfigApi.getConfigurationById(id);
    return response;
  }
);

export const createConfiguration = createAsyncThunk(
  'psychometric/createConfiguration',
  async (config: Partial<PsychometricConfiguration>) => {
    const response = await psychometricConfigApi.createConfiguration(config);
    return response;
  }
);

export const updateConfiguration = createAsyncThunk(
  'psychometric/updateConfiguration',
  async ({ id, updates }: { id: string; updates: Partial<PsychometricConfiguration> }) => {
    const response = await psychometricConfigApi.updateConfiguration(id, updates);
    return response;
  }
);

export const activateConfiguration = createAsyncThunk(
  'psychometric/activateConfiguration',
  async (id: string) => {
    const response = await psychometricConfigApi.activateConfiguration(id);
    return response;
  }
);

export const deleteConfiguration = createAsyncThunk(
  'psychometric/deleteConfiguration',
  async (id: string) => {
    await psychometricConfigApi.deleteConfiguration(id);
    return id;
  }
);

export const clearConfigCache = createAsyncThunk(
  'psychometric/clearConfigCache',
  async () => {
    await psychometricConfigApi.clearCache();
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
    setSelectedConfiguration: (state, action: PayloadAction<PsychometricConfiguration | null>) => {
      state.selectedConfiguration = action.payload;
    },
    updateSelectedConfigurationField: (state, action: PayloadAction<{ path: string; value: any }>) => {
      if (state.selectedConfiguration) {
        const { path, value } = action.payload;
        const keys = path.split('.');
        let obj: any = state.selectedConfiguration;
        for (let i = 0; i < keys.length - 1; i++) {
          obj = obj[keys[i]];
        }
        obj[keys[keys.length - 1]] = value;
      }
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
      })
      
      // Fetch active configuration
      .addCase(fetchActiveConfiguration.pending, (state) => {
        state.configurationsLoading = true;
        state.error = null;
      })
      .addCase(fetchActiveConfiguration.fulfilled, (state, action) => {
        state.configurationsLoading = false;
        state.activeConfiguration = action.payload;
      })
      .addCase(fetchActiveConfiguration.rejected, (state, action) => {
        state.configurationsLoading = false;
        state.error = action.error.message || 'Failed to fetch active configuration';
      })
      
      // Fetch all configurations
      .addCase(fetchAllConfigurations.pending, (state) => {
        state.configurationsLoading = true;
        state.error = null;
      })
      .addCase(fetchAllConfigurations.fulfilled, (state, action) => {
        state.configurationsLoading = false;
        state.configurations = action.payload;
        state.activeConfiguration = action.payload.find(c => c.isActive) || null;
      })
      .addCase(fetchAllConfigurations.rejected, (state, action) => {
        state.configurationsLoading = false;
        state.error = action.error.message || 'Failed to fetch configurations';
      })
      
      // Fetch configuration by ID
      .addCase(fetchConfigurationById.pending, (state) => {
        state.configurationsLoading = true;
        state.error = null;
      })
      .addCase(fetchConfigurationById.fulfilled, (state, action) => {
        state.configurationsLoading = false;
        state.selectedConfiguration = action.payload;
      })
      .addCase(fetchConfigurationById.rejected, (state, action) => {
        state.configurationsLoading = false;
        state.error = action.error.message || 'Failed to fetch configuration';
      })
      
      // Create configuration
      .addCase(createConfiguration.pending, (state) => {
        state.savingConfiguration = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createConfiguration.fulfilled, (state, action) => {
        state.savingConfiguration = false;
        state.configurations.push(action.payload);
        state.selectedConfiguration = action.payload;
        state.successMessage = 'Configuration created successfully';
      })
      .addCase(createConfiguration.rejected, (state, action) => {
        state.savingConfiguration = false;
        state.error = action.error.message || 'Failed to create configuration';
      })
      
      // Update configuration
      .addCase(updateConfiguration.pending, (state) => {
        state.savingConfiguration = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateConfiguration.fulfilled, (state, action) => {
        state.savingConfiguration = false;
        const index = state.configurations.findIndex(c => c._id === action.payload._id);
        if (index !== -1) {
          state.configurations[index] = action.payload;
        }
        if (state.selectedConfiguration?._id === action.payload._id) {
          state.selectedConfiguration = action.payload;
        }
        if (action.payload.isActive) {
          state.activeConfiguration = action.payload;
        }
        state.successMessage = 'Configuration updated successfully';
      })
      .addCase(updateConfiguration.rejected, (state, action) => {
        state.savingConfiguration = false;
        state.error = action.error.message || 'Failed to update configuration';
      })
      
      // Activate configuration
      .addCase(activateConfiguration.pending, (state) => {
        state.activatingConfiguration = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(activateConfiguration.fulfilled, (state, action) => {
        state.activatingConfiguration = false;
        // Deactivate all other configurations
        state.configurations = state.configurations.map(c => ({
          ...c,
          isActive: c._id === action.payload._id
        }));
        state.activeConfiguration = action.payload;
        if (state.selectedConfiguration?._id === action.payload._id) {
          state.selectedConfiguration = action.payload;
        }
        state.successMessage = 'Configuration activated successfully';
      })
      .addCase(activateConfiguration.rejected, (state, action) => {
        state.activatingConfiguration = false;
        state.error = action.error.message || 'Failed to activate configuration';
      })
      
      // Delete configuration
      .addCase(deleteConfiguration.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(deleteConfiguration.fulfilled, (state, action) => {
        state.loading = false;
        state.configurations = state.configurations.filter(c => c._id !== action.payload);
        if (state.selectedConfiguration?._id === action.payload) {
          state.selectedConfiguration = null;
        }
        state.successMessage = 'Configuration deleted successfully';
      })
      .addCase(deleteConfiguration.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete configuration';
      })
      
      // Clear cache
      .addCase(clearConfigCache.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(clearConfigCache.fulfilled, (state) => {
        state.loading = false;
        state.successMessage = 'Configuration cache cleared successfully';
      })
      .addCase(clearConfigCache.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to clear cache';
      });
  },
});

export const { 
  clearError, 
  clearSuccessMessage, 
  clearGeneratedQuestions,
  setSelectedConfiguration,
  updateSelectedConfigurationField
} = psychometricSlice.actions;

export default psychometricSlice.reducer;
