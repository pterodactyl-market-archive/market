import ky from 'ky';
import { isProduction } from '@/helpers';

const fetchCollection = <T>(name: string, query: string) => {
	return ky.get(`${!isProduction ? 'https://beta.pterodactylmarket.com' : ''}/api/collections/${name}/records${query}`).json();
};

const fetchRecord = <T>(name: string, id: string, query: string) => {
	return ky.get(`${!isProduction ? 'https://beta.pterodactylmarket.com' : ''}/api/collections/${name}/records/${id}/${query}`).json();
};

const updateRecord = <T>(token: string, collection: string, id: string, data: any) => {
	return ky
		.patch(`${!isProduction ? 'https://beta.pterodactylmarket.com' : ''}/api/collections/${collection}/records/${id}`, {
			json: data,
			headers: {
				Authorization: `User ${token}`,
			},
		})
		.json();
};

const updateContent = <T>(token: string, collection: string, id: string, data: any) => {
	return ky
		.patch(`${!isProduction ? 'https://beta.pterodactylmarket.com' : ''}/api/collections/${collection}/records/${id}`, {
			body: data,
			headers: {
				Authorization: `User ${token}`,
			},
		})
		.json();
};

const getFile = <T>(collection: string, id: string, fileName: string) => {
	return ky.get(`${!isProduction ? 'https://beta.pterodactylmarket.com' : ''}/api/files/${collection}/${id}/${fileName}`).text();
};

const getFileURL = <T>(collection: string, id: string, fileName: string) => {
	return `${!isProduction ? 'https://beta.pterodactylmarket.com' : ''}/api/files/${collection}/${id}/${fileName}`;
};

export { fetchCollection, fetchRecord, updateRecord, updateContent, getFile, getFileURL };
