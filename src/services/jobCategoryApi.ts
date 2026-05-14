// Job Category API Service
import { jobApi, API_ENDPOINTS } from "./api";

// ── Types matching the real API response ─────────────────────────────────

export interface JobCategory {
  _id: string;
  categoryName: string;   // API field name
  company_type: "company" | "local_agency" | "Int_agency" | "bpo" | "broker";
  lang_opt: "English" | "Amharic" | "Oromiffa";
  partyId: string;
  icon?: string;
  addedByAdmin?: boolean;
  cat_id?: number;
  __v?: number;
}

export interface CreateJobCategoryDto {
  categoryName: string;
  companyType: string;
  langOpt: string;
  icon?: File;
}

export interface UpdateJobCategoryDto {
  categoryName?: string;
  companyType?: string;
  langOpt?: string;
  icon?: File;
}

/** Resolve icon URL — API returns relative paths like "uploads/icon/abc.png" */
export const resolveIconUrl = (icon?: string): string | undefined => {
  if (!icon) return undefined;
  if (icon.startsWith("http://") || icon.startsWith("https://")) return icon;
  const base = API_ENDPOINTS.job.replace(/\/$/, "");
  return `${base}/${icon.replace(/^\//, "")}`;
};

export const jobCategoryApi = {
  /** GET /job-category */
  getAllCategories: async (): Promise<JobCategory[]> => {
    const response = await jobApi.get<JobCategory[]>("/job-category");
    return response.data;
  },

  /**
   * POST /job-category/adminCategory
   * Fetches admin categories. Uses POST with JSON body per Swagger spec.
   */
  getAdminCategories: async (langOpt?: string, companyType?: string): Promise<JobCategory[]> => {
    const body: Record<string, string> = {};
    if (langOpt && langOpt !== "all") body.langOpt = langOpt;
    if (companyType && companyType !== "all") body.companyType = companyType;
    const response = await jobApi.post<JobCategory[]>("/job-category/adminCategory", body, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  },

  /** GET /job-category/{id} */
  getCategory: async (id: string): Promise<JobCategory> => {
    const response = await jobApi.get<JobCategory>(`/job-category/${id}`);
    return response.data;
  },

  /** GET /job-category/by-lang/{lang} */
  getCategoryByLang: async (langOpt: string): Promise<JobCategory[]> => {
    const response = await jobApi.get<JobCategory[]>(`/job-category/by-lang/${langOpt}`);
    return response.data;
  },

  /** GET /job-category/by-type/{companyType} */
  getCategoryByType: async (companyType: string): Promise<JobCategory[]> => {
    const response = await jobApi.get<JobCategory[]>(`/job-category/by-type/${companyType}`);
    return response.data;
  },

  /** POST /job-category — multipart/form-data */
  createCategory: async (data: CreateJobCategoryDto): Promise<JobCategory> => {
    const fd = new FormData();
    fd.append("categoryName", data.categoryName);
    fd.append("company_type", data.companyType);
    fd.append("lang_opt", data.langOpt);
    if (data.icon) fd.append("icon", data.icon);
    const response = await jobApi.post<JobCategory>("/job-category", fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  /** PUT /job-category/{id} — multipart/form-data */
  updateCategory: async (id: string, data: UpdateJobCategoryDto): Promise<JobCategory> => {
    const fd = new FormData();
    if (data.categoryName) fd.append("categoryName", data.categoryName);
    if (data.companyType)  fd.append("company_type", data.companyType);
    if (data.langOpt)      fd.append("lang_opt", data.langOpt);
    if (data.icon)         fd.append("icon", data.icon);
    const response = await jobApi.put<JobCategory>(`/job-category/${id}`, fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  /** DELETE /job-category/{id} */
  deleteCategory: async (id: string): Promise<void> => {
    await jobApi.delete(`/job-category/${id}`);
  },
};
