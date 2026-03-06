export type Tokens = {
	accessToken: string;
	refreshToken: string;
};

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

const isBrowser = typeof globalThis !== 'undefined' && 'window' in globalThis;

const getStorage = (persistent: boolean): Storage | null => {
	if (!isBrowser) return null;

	const browserWindow = globalThis.window as unknown as Window;

	return persistent ? browserWindow.localStorage : browserWindow.sessionStorage;
};

const saveTokens = (tokens: Tokens, remember: boolean) => {
	const mainStorage = getStorage(remember);
	const secondaryStorage = getStorage(!remember);

	if (!mainStorage) return;

	mainStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
	mainStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);

	secondaryStorage?.removeItem(ACCESS_TOKEN_KEY);
	secondaryStorage?.removeItem(REFRESH_TOKEN_KEY);
};

const clearTokens = () => {
	if (!isBrowser) return;

	const browserWindow = globalThis.window as unknown as Window;

	browserWindow.localStorage.removeItem(ACCESS_TOKEN_KEY);
	browserWindow.localStorage.removeItem(REFRESH_TOKEN_KEY);
	browserWindow.sessionStorage.removeItem(ACCESS_TOKEN_KEY);
	browserWindow.sessionStorage.removeItem(REFRESH_TOKEN_KEY);
};

const getStoredTokens = (): Tokens | null => {
	if (!isBrowser) return null;

	const browserWindow = globalThis.window as unknown as Window;

	const accessTokenSession = browserWindow.sessionStorage.getItem(ACCESS_TOKEN_KEY);
	const refreshTokenSession = browserWindow.sessionStorage.getItem(REFRESH_TOKEN_KEY);

	if (accessTokenSession && refreshTokenSession) {
		return {
			accessToken: accessTokenSession,
			refreshToken: refreshTokenSession,
		};
	}

	const accessTokenLocal = browserWindow.localStorage.getItem(ACCESS_TOKEN_KEY);
	const refreshTokenLocal = browserWindow.localStorage.getItem(REFRESH_TOKEN_KEY);

	if (accessTokenLocal && refreshTokenLocal) {
		return {
			accessToken: accessTokenLocal,
			refreshToken: refreshTokenLocal,
		};
	}

	return null;
};

const getAccessToken = (): string | null => {
	return getStoredTokens()?.accessToken ?? null;
};

const getRefreshToken = (): string | null => {
	return getStoredTokens()?.refreshToken ?? null;
};

export { saveTokens, clearTokens, getStoredTokens, getAccessToken, getRefreshToken, isBrowser };
