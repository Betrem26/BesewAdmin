export const API_CONFIG = {
    ACCOUNT_API: 'https://account.besewonline.com',
    JOB_API: 'https://job.besewonline.com',
    PARTY_API: 'https://party.besewonline.com',
    EMPLOYEE_API: 'https://employee.besewonline.com',
    COMMISSION_API: 'https://comission.besewonline.com',
    CANDIDATE_API: 'https://candidate.besewonline.com'
} as const;

export const API_ENDPOINTS = {
    ACCOUNTS: {
        LIST: '/accounts',
        DETAIL: (id: string) => `/accounts/${id}`,
        CREATE: '/accounts',
        UPDATE: (id: string) => `/accounts/${id}`,
        DELETE: (id: string) => `/accounts/${id}`,
    },
    PARTY: {
        COMPANIES: '/companies',
        AGENCIES: '/agencies',
    },
    EMPLOYEES: {
        LIST: '/employees',
        DETAIL: (id: string) => `/employees/${id}`,
    }
} as const; 