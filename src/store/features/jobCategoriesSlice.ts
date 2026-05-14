import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { jobCategoryApi, JobCategory } from "../../services/jobCategoryApi";

interface JobCategoriesState {
  adminCategories: JobCategory[];
  loading: boolean;
  error: string | null;
}

const initialState: JobCategoriesState = {
  adminCategories: [],
  loading: false,
  error: null,
};

export const fetchAdminCategories = createAsyncThunk(
  "jobCategories/fetchAdminCategories",
  async ({ langOpt, companyType }: { langOpt?: string; companyType?: string } = {}) => {
    return jobCategoryApi.getAdminCategories(langOpt, companyType);
  }
);

export const createCategory = createAsyncThunk(
  "jobCategories/createCategory",
  async (data: { categoryName: string; companyType: string; langOpt: string; icon?: File }) => {
    return jobCategoryApi.createCategory(data);
  }
);

export const updateCategory = createAsyncThunk(
  "jobCategories/updateCategory",
  async ({ id, data }: { id: string; data: { categoryName?: string; companyType?: string; langOpt?: string; icon?: File } }) => {
    return jobCategoryApi.updateCategory(id, data);
  }
);

export const deleteCategory = createAsyncThunk(
  "jobCategories/deleteCategory",
  async (id: string) => {
    await jobCategoryApi.deleteCategory(id);
    return id;
  }
);

// Keep these for backward compat with other pages that may use them
export const fetchCategoriesByLang = createAsyncThunk(
  "jobCategories/fetchCategoriesByLang",
  async (langOpt: string) => jobCategoryApi.getCategoryByLang(langOpt)
);

export const fetchCategoriesByType = createAsyncThunk(
  "jobCategories/fetchCategoriesByType",
  async (companyType: string) => jobCategoryApi.getCategoryByType(companyType)
);

const jobCategoriesSlice = createSlice({
  name: "jobCategories",
  initialState,
  reducers: {
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    const pending  = (state: JobCategoriesState) => { state.loading = true;  state.error = null; };
    const rejected = (state: JobCategoriesState, action: any) => {
      state.loading = false;
      state.error = action.error.message || "Request failed";
    };

    builder
      .addCase(fetchAdminCategories.pending,   pending)
      .addCase(fetchAdminCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.adminCategories = action.payload;
      })
      .addCase(fetchAdminCategories.rejected,  rejected)

      .addCase(fetchCategoriesByLang.pending,   pending)
      .addCase(fetchCategoriesByLang.fulfilled, (state, action) => {
        state.loading = false;
        state.adminCategories = action.payload;
      })
      .addCase(fetchCategoriesByLang.rejected,  rejected)

      .addCase(fetchCategoriesByType.pending,   pending)
      .addCase(fetchCategoriesByType.fulfilled, (state, action) => {
        state.loading = false;
        state.adminCategories = action.payload;
      })
      .addCase(fetchCategoriesByType.rejected,  rejected)

      .addCase(createCategory.pending,   pending)
      .addCase(createCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.adminCategories.unshift(action.payload);
      })
      .addCase(createCategory.rejected,  rejected)

      .addCase(updateCategory.pending,   pending)
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.adminCategories.findIndex(c => c._id === action.payload._id);
        if (idx !== -1) state.adminCategories[idx] = action.payload;
      })
      .addCase(updateCategory.rejected,  rejected)

      .addCase(deleteCategory.pending,   pending)
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.adminCategories = state.adminCategories.filter(c => c._id !== action.payload);
      })
      .addCase(deleteCategory.rejected,  rejected);
  },
});

export const { clearError } = jobCategoriesSlice.actions;
export default jobCategoriesSlice.reducer;
