import { addUserEndpoint, getMeEndpoint, loginUserEndpoint } from '../api/apiRoutes';
import { get, post } from '../axios/apiService';
import { ApiResponse, LoginPayload, LoginResponse, RegisterPayload } from '../types/apiTypes';
import { User } from '../types/userTypes';

export const addUser = async (payload: RegisterPayload): Promise<ApiResponse<User>> => {
	try {
		const response = await post<ApiResponse<User>, RegisterPayload>(addUserEndpoint, payload);
		return response.data;
	} catch (error) {
		throw error;
	}
};

export const loginUser = async (payload: LoginPayload): Promise<ApiResponse<LoginResponse>> => {
	try {
		const response = await post<ApiResponse<LoginResponse>, LoginPayload>(
			loginUserEndpoint,
			payload,
		);
		return response.data;
	} catch (error) {
		throw error;
	}
};

export const getCurrentUser = async (token: string): Promise<ApiResponse<User>> => {
	try {
		const response = await get<ApiResponse<User>>(getMeEndpoint, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	} catch (error) {
		throw error;
	}
};
