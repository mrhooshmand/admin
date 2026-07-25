export interface User {
	id: number;
	username: string;
	email: string;
	full_name: string;
	created_at: string;
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

export interface LoginResponse {
	user: User;
	message?: string;
}

export interface RegisterResponse {
	user: User;
	message?: string;
}

export interface AuthContextType {
	user: User | null;
	login: (user: User) => void;
	logout: () => void;
	isAuthenticated: boolean;
	loading: boolean;
}
