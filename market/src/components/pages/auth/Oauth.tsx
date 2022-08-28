import React, { useState, useEffect } from 'react';

import tw from 'twin.macro';
import { isProduction } from '@/helpers';
import { useStoreState } from 'easy-peasy';
import { authenticateOauth } from '@/api/auth';
import { store, ApplicationStore } from '@/state';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { PageContentBlock, Spinner } from '@/components/elements/generic';

const Oauth = (props: { title: string }) => {
	const navigate = useNavigate();
	const { provider } = useParams();

	useEffect(() => {
		if (localStorage.getItem('pterodactyl_market_auth') || sessionStorage.getItem('pterodactyl_market_auth')) navigate('/');
	}, []);

	return <PageContentBlock title={props.title}>{provider}</PageContentBlock>;
};

export default Oauth;
