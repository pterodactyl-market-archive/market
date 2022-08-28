interface UserProfile {
	about: string;
	avatar: string;
	banner: string;
	username: string;
	discord: string;
	friends: Array<string>;
	group: string;
	id: string;
	userId: string;
	firstname: string;
	lastname: string;
	publicEmail: string;
	sales: number;
	seller_status: string;
	created: string;
	updated: string;
}

interface PaginatedResult {
	page: number;
	perPage: number;
	totalItems: number;
	items: Array<ResourceResult>;
}

interface ResourceResult {
	'@expand': { profile: UserProfile };
	banner: string;
	category: string;
	content: string;
	created: string;
	description: string;
	file: Array<string>;
	icon: string;
	id: string;
	name: string;
	price: number;
	profile: string;
	updated: string;
	featured: boolean;
}

interface PaginationProps {
	limit?: number;
	category?: string;
	customQuery?: string;
	paginatedEndpoint: string;
	render: (props: { data: never }) => JSX.Element;
}

export type { PaginatedResult, ResourceResult, PaginationProps };
