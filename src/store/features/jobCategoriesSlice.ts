import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { jobCategoryApi, JobCategory } from '../../services/jobCategoryApi';

interface JobCategoriesState {
  categories: JobCategory[];
  adminCategories: JobCategory[];
  selectedCategory: JobCategory | null;
  loading: boolean;
  error: string | null;
}

const initialState: JobCategoriesState = {
  categories: [],
  adminCategories: [],
  selectedCategory: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchAdminCategories = createAsyncThunk(
  'jobCategories/fetchAdminCategories',
  async () => {
    const response = await jobCategoryApi.getAdminCategories();
    return response;
  }
);

export const createCategory = createAsyncThunk(
  'jobCategories/createCategory',
  async (data: { name: string; description?: string; companyType: string; langOpt: string; icon?: File }) => {
    const response = await jobCategoryApi.createCategory(data);
    return response;
  }
);

export const updateCategory = createAsyncThunk(
  'jobCategories/updateCategory',
  async ({ id, data }: { id: string; data: { name?: string; description?: string; companyType?: string; langOpt?: string; icon?: File; isActive?: boolean } }) => {
    const response = await jobCategoryApi.updateCategory(id, data);
    return response;
  }
);

export const deleteCategory = createAsyncThunk(
  'jobCategories/deleteCategory',
  async (id: string) => {
    await jobCategoryApi.deleteCategory(id);
    return id;
  }
);

const jobCategoriesSlice = createSlice({
  name: 'jobCategories',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedCategory: (state) => {
      state.selectedCategory = null;
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch admin categories
      .addCase(fetchAdminCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.adminCategories = action.payload;
      })
      .addCase(fetchAdminCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch categories';
      })
      // Create category
      .addCase(createCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.adminCategories.push(action.payload);
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create category';
      })
      // Update category
      .addCase(updateCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.adminCategories.findIndex(c => c._id === action.payload._id);
        if (index !== -1) {
          state.adminCategories[index] = action.payload;
        }
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update category';
      })
      // Delete category
      .addCase(deleteCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.adminCategories = state.adminCategories.filter(c => c._id !== action.payload);
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete category';
      });
  },
});

export const { clearError, clearSelectedCategory, setSelectedCategory } = jobCategoriesSlice.actions;
export default jobCategoriesSlice.reducer;
