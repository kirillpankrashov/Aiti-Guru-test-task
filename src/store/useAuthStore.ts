import { create } from 'zustand';
import { clearTokens, getStoredTokens, type Tokens, saveTokens } from '../utils/tokenStorage';

type AuthState = {
	accessToken: string | null;
	refreshToken: string | null;
	isAuthenticated: boolean;
	login: (tokens: Tokens, remember: boolean) => void;
	logout: () => void;
};

const initialTokens = getStoredTokens();

const useAuthStore = create<AuthState>((set) => ({
	accessToken: initialTokens?.accessToken ?? null,
	refreshToken: initialTokens?.refreshToken ?? null,
	isAuthenticated: Boolean(initialTokens?.accessToken),
	login: (tokens, remember) => {
		saveTokens(tokens, remember);
		set({
			accessToken: tokens.accessToken,
			refreshToken: tokens.refreshToken,
			isAuthenticated: true,
		});
	},
	logout: () => {
		clearTokens();
		set({
			accessToken: null,
			refreshToken: null,
			isAuthenticated: false,
		});
	},
}));

export { useAuthStore };
