import { partyApi } from './api';

export interface PartyProfile {
  _id: string;
  party_id: string;
  name: string;
  last_name?: string;
  phone_number?: string;
  party_type: { id: number; name: string };
  date_of_birth?: string;
  sex?: string;
  martial_status?: string;
  country?: string;
  region?: string;
  city?: string;
  photo?: string;
  resume_file_upload?: string;
  multiple_profile?: string[];
  social_media_links?: string[];
  status?: string;
  auth_verfied?: boolean;
  verfied?: boolean;
  open_to_work?: boolean;
  is_trusted?: boolean;
  lang_skill?: string[];
  language_skills?: { language: string; proficiency: string; certification?: string }[];
  education?: {
    institute: string;
    level: string;
    fieldOfStudies: string;
    start_date?: string;
    end_date?: string;
    gpa?: number;
    graduated?: boolean;
  }[];
  experiance?: {
    sn?: number;
    company: string;
    position: string;
    level?: string;
    salary?: number;
    start_date?: string;
    end_date?: string;
    no_of_years?: number;
    description?: string;
    is_current?: boolean;
  }[];
  experience?: {
    sn?: number;
    company: string;
    position: string;
    level?: string;
    salary?: number;
    start_date?: string;
    end_date?: string;
    no_of_years?: number;
    description?: string;
    is_current?: boolean;
  }[];
  number_of_applied?: number;
  number_of_offered?: number;
  number_of_hired?: number;
  number_of_completed_projects?: number;
  id_type?: { id: number; type: string };
  id_number?: string;
  added_by?: string;
  added_date?: string;
  referedBy?: string;
  interest?: { id: number; name: string }[];
  allowed_countries?: { id: number; name: string }[];
  has_contact?: boolean;
  has_company?: boolean;
  ratetype?: string;
  rate?: number;
  paymentStandard?: string;
  worker_type_preference?: string;
}

export interface PartyStats {
  total: number;
  verified: number;
  unverified: number;
  byType: Record<string, number>;
  growth: { today: number; thisWeek: number; thisMonth: number };
  lastUpdated: string;
}

export interface VerificationStats {
  totalProfiles: number;
  verified: number;
  pending: number;
  rejected: number;
  verificationRate: number;
  lastUpdated: string;
}

export interface EducationStats {
  totalProfiles: number;
  completeEducation: number;
  incompleteEducation: number;
  noEducation: number;
  completenessRate: number;
  byRole: Record<string, { total: number; complete: number; rate: number }>;
  complianceStatus: string;
  lastUpdated: string;
}

export interface RecentPartyProfile {
  party_id: string;
  name: string;
  type: string;
  verified: boolean;
  createdAt: string;
}

const partyProfileApi = {
  getByPartyId: async (partyId: string): Promise<PartyProfile> => {
    const res = await partyApi.get(`/party-profiles/find-by-party-id/${partyId}`);
    return res.data;
  },

  getStats: async (): Promise<PartyStats> => {
    const res = await partyApi.get('/party-profiles/stats');
    return res.data;
  },

  getVerificationStats: async (): Promise<VerificationStats> => {
    const res = await partyApi.get('/party-profiles/verification-stats');
    return res.data;
  },

  getEducationStats: async (): Promise<EducationStats> => {
    const res = await partyApi.get('/party-profiles/education-completeness');
    return res.data;
  },

  getRecentProfiles: async (limit = 5): Promise<RecentPartyProfile[]> => {
    const res = await partyApi.get(`/party-profiles/recent?limit=${limit}`);
    return res.data;
  },

  toggleVerification: async (partyId: string): Promise<PartyProfile> => {
    const res = await partyApi.put(`/party-profiles/${partyId}/toggle-verification`);
    return res.data;
  },

  setTrust: async (partyId: string, is_trusted: boolean): Promise<any> => {
    const res = await partyApi.put(`/party-profiles/${partyId}/trust`, { is_trusted });
    return res.data;
  },
};

export default partyProfileApi;
