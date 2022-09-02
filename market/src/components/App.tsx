import React, { useEffect, useState, Fragment } from 'react';

import tw from 'twin.macro';
import Page from '@/components/Page';
import { refreshUser } from '@/api/auth';
import { MarketRouter } from '@/routers';
import { useStoreState } from 'easy-peasy';
import { Login, Oauth } from '@/components/pages/auth';
import { Base } from '@/components/pages/market';
import { store, ApplicationStore } from '@/state';
import { isProduction, debounce } from '@/helpers';
import { Navbar, Footer } from '@/components/elements/market';
import { ScrollToTop, Spinner } from '@/components/elements/generic';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

const App = () => {
	const [loaded, setLoaded] = useState(false);
	const [visible, setVisible] = useState(false);
	const UserData = useStoreState((state: ApplicationStore) => state.user.data);

	useEffect(() => {
		if (localStorage.getItem('pterodactyl_market_auth')) {
			refreshUser(localStorage.getItem('pterodactyl_market_auth'))
				.then((data: any) => {
					localStorage.setItem('pterodactyl_market_auth', data.token);

					const user = data.user;
					const profile = user.profile;
					const avatar = profile.avatar ? profile.avatar : 'https://boring-avatars-api.vercel.app/api/avatar?size=512&variant=beam';
					const banner = profile.banner
						? `${!isProduction && 'https://beta.pterodactylmarket.com'}/api/files/profiles/${profile.id}/${profile.banner}`
						: 'https://boring-avatars-api.vercel.app/api/avatar?size=512&variant=beam';

					store.getActions().user.setUserData({
						uuid: user.id,
						group: profile.group,
						token: data.token,
						username: profile.username,
						email: user.email,
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
				})
				.catch((err) => {
					localStorage.removeItem('pterodactyl_market_auth');
					store.getActions().user.reset();
					console.log(err);
				})
				.then(() => setLoaded(true));
		} else {
			localStorage.removeItem('pterodactyl_market_auth');
			setLoaded(true);
		}
	}, []);

	if (!loaded) {
		return (
			<div css={tw`w-full h-screen flex justify-center items-center bg-white`}>
				<Spinner size='large' isBlue />
			</div>
		);
	} else {
		return (
			<BrowserRouter>
				<ScrollToTop>
					<Routes>
						<Route
							path='/'
							element={
								<div tw='bg-zinc-100 text-zinc-900 dark:(bg-zinc-800 text-zinc-50) overscroll-none'>
									<Navbar />
									<Page component={Base} title='Home' />
									<Footer />
								</div>
							}
						/>
						<Route
							path='/marketplace/*'
							element={
								<div tw='bg-zinc-100 text-zinc-900 dark:(bg-zinc-800 text-zinc-50) overscroll-none'>
									<Navbar />
									<MarketRouter />
									<Footer />
								</div>
							}
						/>
						{(!localStorage.getItem('pterodactyl_market_auth') || !sessionStorage.getItem('pterodactyl_market_auth')) && (
							<Fragment>
								<Route
									path='/login'
									element={
										<div tw='bg-white h-screen'>
											<Page component={Login} title='Login to your account' />
										</div>
									}
								/>
								<Route
									path='/auth/oauth/:provider'
									element={
										<div tw='bg-zinc-50'>
											<Page component={Oauth} title='Logging in...' />
										</div>
									}
								/>
							</Fragment>
						)}
					</Routes>
				</ScrollToTop>
			</BrowserRouter>
		);
	}
};

export default App;
