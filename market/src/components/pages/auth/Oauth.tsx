import React, { useState, useEffect } from 'react';

import tw from 'twin.macro';
import { isProduction } from '@/helpers';
import { useStoreState } from 'easy-peasy';
import { store, ApplicationStore } from '@/state';
import { authenticateOauth } from '@/api/auth';
import { updateUserProfile } from '@/api/user';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { PageContentBlock, Notification, Spinner } from '@/components/elements/generic';

const Oauth = (props: { title: string }) => {
	const [searchParams] = useSearchParams();
	const [show, setShow] = useState(false);
	const { provider } = useParams();
	const navigate = useNavigate();

	const code = searchParams.get('code');
	const state = searchParams.get('state');
	const error = searchParams.get('error');
	const error_description = searchParams.get('error_description');

	useEffect(() => {
		if (localStorage.getItem('pterodactyl_market_auth') || sessionStorage.getItem('pterodactyl_market_auth')) navigate('/');
	}, []);

	useEffect(() => {
		if (code === null && provider !== null) navigate('/');
		if (code !== null && provider !== null) LoginViaOauth(provider!, code!);
	}, []);

	const LoginViaOauth = (provider: string, code: string) => {
		authenticateOauth(provider, code, localStorage.getItem('pterodactyl_market_auth_verifier')!, 'https://beta.pterodactylmarket.com/')
			.then((res: any) => {
				localStorage.removeItem('pterodactyl_market_auth_verifier');
				localStorage.setItem('pterodactyl_market_auth', res.token);

				updateUserProfile(res.token, res.user.profile.id, {
					username: res.meta.name.split('#')[0],
					discord: res.meta.name,
					discord_id: res.meta.id,
					group: 'user',
				}).then((profile: any) => {
					const avatar = profile.avatar
						? `${!isProduction && 'https://beta.pterodactylmarket.com'}/api/files/profiles/${profile.id}/${profile.avatar}`
						: 'https://boring-avatars-api.vercel.app/api/avatar?size=512&variant=beam';
					const banner = profile.banner
						? `${!isProduction && 'https://beta.pterodactylmarket.com'}/api/files/profiles/${profile.id}/${profile.banner}`
						: 'https://boring-avatars-api.vercel.app/api/avatar?size=512&variant=beam';

					store.getActions().user.setUserData({
						uuid: res.user.id,
						group: profile.group,
						token: res.token,
						username: profile.username,
						email: res.user.email,
						publicEmail: profile.public_email,
						account: {
							id: profile.id,
							created: profile.created,
							updated: profile.updated,
						},
						profile: {
							avatar: avatar,
							banner: banner,
							firstname: profile.firstname,
							lastname: profile.lastname,
							about: profile.about,
							discord: profile.discord,
							friends: profile.friends,
						},
						seller: {
							sellerStatus: profile.seller_status,
							sales: profile.sales,
						},
					});
					navigate('/');
				});
			})
			.catch((err) => {
				console.log(err);
				setShow(true);
				setTimeout(() => navigate('/'), 2500);
			});
	};

	return (
		<PageContentBlock title={props.title}>
			<div css={tw`w-full h-screen flex flex-col justify-center items-center`}>
				<Spinner size='large' isBlue />
				<div css={tw`text-sky-600 font-medium mt-3`}>Logging you in via {provider}.</div>
			</div>
			<Notification
				show={show}
				callback={(close: boolean) => setShow(close)}
				type='error'
				icon
				content={{
					title: `Unable to login via ${provider}`,
					message: `An error occurred while processing the login request for ${provider}.`,
				}}
			/>
		</PageContentBlock>
	);
};

export default Oauth;
