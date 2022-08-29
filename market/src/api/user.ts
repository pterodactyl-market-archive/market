import ky from 'ky';
import { isProduction } from '@/helpers';

const getUserProfile = (id: string, publicProfile: boolean, token?: string) => {
	return publicProfile
		? ky.get(`${!isProduction ? 'https://beta.pterodactylmarket.com' : ''}/api/collections/profiles/records/${id}`, {}).json()
		: ky.get(`${!isProduction ? 'https://beta.pterodactylmarket.com' : ''}/api/users/${id}`, { headers: { Authorization: `User ${token}` } }).json();
};

const getUserList = (id: string) => {
	return ky.get(`${!isProduction ? 'https://beta.pterodactylmarket.com' : ''}/api/collections/profiles/records`).json();
};

const updateUserProfile = (token: string, id: string, data: any) => {
	return ky
		.patch(`${!isProduction ? 'https://beta.pterodactylmarket.com' : ''}/api/collections/profiles/records/${id}`, {
			json: data,
			headers: {
				Authorization: `User ${token}`,
			},
		})
		.json();
};

export { getUserProfile, getUserList, updateUserProfile };
