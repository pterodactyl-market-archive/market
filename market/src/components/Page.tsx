import React, { useEffect } from 'react';

const Page = (props: { component: any; title?: any }) => {
	return <props.component title={props.title} />;
};

export default Page;
