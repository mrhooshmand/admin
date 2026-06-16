export interface User {
    id: number;
    username: string;
    email: string;
    full_name: string;
    created_at: string;
}

export interface LoginResponse {
    token: string;
    user: User;
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface RegisterRequest {
    username: string;
    password: string;
    email?: string;
    full_name?: string;
}

export interface ApiError {
    error: string;
}