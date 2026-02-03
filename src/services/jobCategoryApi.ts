// Job Category API Service
import { jobApi, handleApiError } from './api';

export interface JobCategory {
  _id: string;
  name: string;
  description?: string;
  icon?: string;
  companyType: 'company' | 'local_agency' | 'Int_agency' | 'bpo' | 'broker';
  langOpt: 'English' | 'Amharic' | 'Oromiffa';
  addedByAdmin: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateJobCategoryDto {
  name: string;
  description?: string;
  companyType: string;
  langOpt: string;
  icon?: File;
}

export interface UpdateJobCategoryDto {
  name?: string;
  description?: string;
  companyType?: string;
  langOpt?: string;
  icon?: File;
  isActive?: boolean;
}

export const jobCategoryApi = {
  /**
   * Get all job categories
   */
  getAllCategories: async (): Promise<JobCategory[]> => {
    try {
      const response = await jobApi.get<JobCategory[]>('/job-category');
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Get admin-added categories with filters
   */
  getAdminCategories: async (langOpt?: string, companyType?: string): Promise<JobCategory[]> => {
    try {
      const params = new URLSearchParams();
      if (langOpt) params.append('langOpt', langOpt);
      if (companyType) params.append('companyType', companyType);
      
      const response = await jobApi.get<JobCategory[]>(
        `/job-category/adminCategory?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Get category by ID
   */
  getCategory: async (id: string): Promise<JobCategory> => {
    try {
      const response = await jobApi.get<JobCategory>(`/job-category/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Create new job category (Admin only)
   */
  createCategory: async (data: CreateJobCategoryDto): Promise<JobCategory> => {
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      if (data.description) formData.append('description', data.description);
      formData.append('companyType', data.companyType);
      formData.append('langOpt', data.langOpt);
      if (data.icon) formData.append('icon', data.icon);

      const response = await jobApi.post<JobCategory>('/job-category', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Update job category (Admin only)
   */
  updateCategory: async (id: string, data: UpdateJobCategoryDto): Promise<JobCategory> => {
    try {
      const formData = new FormData();
      if (data.name) formData.append('name', data.name);
      if (data.description) formData.append('description', data.description);
      if (data.companyType) formData.append('companyType', data.companyType);
      if (data.langOpt) formData.append('langOpt', data.langOpt);
      if (data.icon) formData.append('icon', data.icon);
      if (data.isActive !== undefined) formData.append('isActive', String(data.isActive));

      const response = await jobApi.put<JobCategory>(`/job-category/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Delete job category (Admin only)
   */
  deleteCategory: async (id: string): Promise<void> => {
    try {
      await jobApi.delete(`/job-category/${id}`);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Get category statistics
   */
  getCategoryStats: async (): Promise<{
    total: number;
    byCompanyType: Record<string, number>;
    byLanguage: Record<string, number>;
    adminAdded: number;
  }> => {
    try {
      const categories = await jobCategoryApi.getAllCategories();
      const byCompanyType: Record<string, number> = {};
      const byLanguage: Record<string, number> = {};
      
      categories.forEach(cat => {
        byCompanyType[cat.companyType] = (byCompanyType[cat.companyType] || 0) + 1;
        byLanguage[cat.langOpt] = (byLanguage[cat.langOpt] || 0) + 1;
      });

      return {
        total: categories.length,
        byCompanyType,
        byLanguage,
        adminAdded: categories.filter(c => c.addedByAdmin).length,
      };
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};
