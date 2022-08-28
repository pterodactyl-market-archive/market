import { useEffect } from 'react';

const PageContentBlock = (props: { title: string; children: any }) => {
	useEffect(() => {
		document.title = props.title + ' | Pterodactyl Market' || '';
	}, [props.title]);
	return props.children;
};

export default PageContentBlock;
