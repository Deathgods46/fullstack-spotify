import { User } from './userTypes';

export interface ApiResponse<T> {
	success: boolean;
	data: T;
	message: string;
}

export interface RegisterPayload {
	username: string;
	email: string;
	password: string;
}

export interface LoginPayload {
	username: string;
	password: string;
}

export interface LoginResponse {
	user: User;
}
