import { Action, action, Thunk, thunk } from 'easy-peasy';

let initialState = {
	uuid: '',
	group: '',
	token: '',
	username: '',
	email: '',
	publicEmail: '',
	account: {
		id: '',
		verified: false,
		created: '',
		updated: '',
	},
	profile: {
		firstname: '',
		lastname: '',
		avatar: '',
		banner: '',
		about: '',
		discord: '',
		friends: [],
	},
	seller: {
		sellerStatus: '',
		sales: '',
	},
};

export interface UserData {
	uuid: string;
	group: string;
	token: string;
	username: string;
	email: string;
	publicEmail: string;
	account: {
		id: string;
		verified: boolean;
		created: string;
		updated: string;
	};
	profile: {
		firstname: string;
		lastname: string;
		avatar: string;
		banner: string;
		about: string;
		discord: string;
		friends: Array<string>;
	};
	seller: {
		sellerStatus: string;
		sales: string;
	};
}

export interface UserStore {
	data?: UserData;
	setUserData: Action<UserStore, UserData>;
	reset: Action<UserStore>;
}

const user: UserStore = {
	data: undefined,
	setUserData: action((state, payload) => {
		state.data = payload;
	}),
	reset: action((state) => {
		state.data = initialState;
	}),
};

export default user;
