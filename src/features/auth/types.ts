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

export interface Menu {
	id: number;
	code: string;
	title: string;
}

export interface Permission {
	id: number;
	code: string;
	title: string;
}