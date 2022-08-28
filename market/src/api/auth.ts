import ky from 'ky';
import { store } from '@/state';
import { isProduction } from '@/helpers';

const registerUser = (username: string, email: string, password: { primary: string; confirm: string }, names: { first: string; last: string }) => {
	return ky
		.post(`${!isProduction ? 'https://beta.pterodactylmarket.com' : ''}/api/users`, {
			json: {
				email: email,
				password: password.primary,
				passwordConfirm: password.confirm,
			},
		})
		.json();
};

const authenticateEmail = (email: string, password: string) => {
	return ky
		.post(`${!isProduction ? 'https://beta.pterodactylmarket.com' : ''}/api/users/auth-via-email`, { json: { email: email, password: password } })
		.json();
};

const authenticateOauth = (provider: string, code: string, codeVerifier: string, redirectUrl: string) => {
	return ky
		.post(`${!isProduction ? 'https://beta.pterodactylmarket.com' : ''}/api/users/auth-via-oauth2`, {
			json: { provider: provider, code: code, codeVerifier: codeVerifier, redirectUrl: redirectUrl },
		})
		.json();
};

const signOut = () => {
	localStorage.removeItem('pterodactyl_market_auth');
	store.getActions().user.reset();
};

const refreshUser = (userAuthToken: string | null) => {
	const token = ky.extend({
		hooks: {
			beforeRequest: [
				(request) => {
					request.headers.set('Authorization', `User ${userAuthToken}`);
				},
			],
		},
	});
	return token.post(`${!isProduction ? 'https://beta.pterodactylmarket.com' : ''}/api/users/refresh`).json();
};

export { registerUser, authenticateEmail, authenticateOauth, signOut, refreshUser };
