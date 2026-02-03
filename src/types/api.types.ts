export interface Account {
    _id: string;
    act_id: string;
    uname: string;
    email: string;
    role: string;
    agency: string;
    company: string;
    location: string;
    status: 'active' | 'inactive' | 'pending';
    created_at: string;
    updated_at: string;
}

export interface Company {
    _id: string;
    name: string;
    location: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface Agency {
    _id: string;
    name: string;
    location: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface ApiResponse<T> {
    data: T;
    message?: string;
    status: number;
    success: boolean;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

export interface ErrorResponse {
    message: string;
    status: number;
    success: false;
} 