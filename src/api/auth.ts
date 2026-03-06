import { apiClient } from './apiClient';

export type AuthBody = {
	username: string;
	password: string;
	expiresInMins?: number;
};

export type AuthResponse = {
	refreshToken: string;
	accessToken: string;
};

const auth = async (body: AuthBody): Promise<AuthResponse> => {
	return apiClient<AuthResponse>('/auth/login', { method: 'POST', body });
};

export { auth };

