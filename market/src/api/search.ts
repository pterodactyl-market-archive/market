import ky from 'ky';
import { isProduction } from '@/helpers';

const searchRecords = (type: string, filter?: any) => {
	return ky
		.get(
			`${!isProduction ? 'https://beta.pterodactylmarket.com' : ''}/api/collections/${type}/records/${
				filter ? '?filter=(name~%27' + filter + '%27)' : ''
			}&sort=-updated`
		)
		.json();
};

export { searchRecords };
