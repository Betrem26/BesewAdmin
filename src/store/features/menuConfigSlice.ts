import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { menuConfigApi } from '../../services/menuConfigApi';

export const fetchAllMenuConfigs = createAsyncThunk(
  'menuConfig/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await menuConfigApi.getAllMenuConfigs();
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to fetch menu configs');
    }
  }
);

export const createMenuConfig = createAsyncThunk(
  'menuConfig/create',
  async (data: any, { rejectWithValue }) => {
    try {
      return await menuConfigApi.createMenuConfig(data);
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to create menu config');
    }
  }
);

export const updateMenuConfig = createAsyncThunk(
  'menuConfig/update',
  async ({ menuId, data }: { menuId: string; data: any }, { rejectWithValue }) => {
    try {
      return await menuConfigApi.updateMenuConfig(menuId, data);
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to update menu config');
    }
  }
);

export const deleteMenuConfig = createAsyncThunk(
  'menuConfig/delete',
  async (menuId: string, { rejectWithValue }) => {
    try {
      await menuConfigApi.deleteMenuConfig(menuId);
      return menuId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to delete menu config');
    }
  }
);

export const bulkUpdateMenuConfigs = createAsyncThunk(
  'menuConfig/bulkUpdate',
  async (updates: any[], { rejectWithValue }) => {
    try {
      return await menuConfigApi.bulkUpdateMenuConfigs(updates);
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to bulk update menu configs');
    }
  }
);

export const getAccessibleMenus = createAsyncThunk(
  'menuConfig/getAccessible',
  async (filters?: {
    userType?: string;
    workerType?: string;
    subscriptionTier?: string;
    trustScore?: number;
  }, thunkAPI?: any) => {
    try {
      return await menuConfigApi.getAccessibleMenus(filters);
    } catch (error: any) {
      return thunkAPI?.rejectWithValue(error.response?.data || 'Failed to fetch accessible menus');
    }
  }
);

export const seedDefaultMenus = createAsyncThunk(
  'menuConfig/seed',
  async (_, { rejectWithValue }) => {
    try {
      await menuConfigApi.seedDefaultMenus();
      return await menuConfigApi.getAllMenuConfigs();
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to seed default menus');
    }
  }
);

interface MenuConfigState {
  items: any[];
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: MenuConfigState = {
  items: [],
  loading: false,
  error: null,
  success: false
};

const menuConfigSlice = createSlice({
  name: 'menuConfig',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllMenuConfigs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllMenuConfigs.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchAllMenuConfigs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createMenuConfig.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createMenuConfig.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
        state.success = true;
      })
      .addCase(createMenuConfig.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateMenuConfig.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMenuConfig.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(item => item.menuId === action.payload.menuId);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        state.success = true;
      })
      .addCase(updateMenuConfig.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteMenuConfig.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMenuConfig.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(item => item.menuId !== action.payload);
        state.success = true;
      })
      .addCase(deleteMenuConfig.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(bulkUpdateMenuConfigs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(bulkUpdateMenuConfigs.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.success = true;
      })
      .addCase(bulkUpdateMenuConfigs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(seedDefaultMenus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(seedDefaultMenus.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.success = true;
      })
      .addCase(seedDefaultMenus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getAccessibleMenus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAccessibleMenus.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(getAccessibleMenus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const { clearError, clearSuccess } = menuConfigSlice.actions;
export default menuConfigSlice.reducer;
