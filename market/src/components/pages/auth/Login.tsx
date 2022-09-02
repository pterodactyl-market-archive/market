import React, { useState, useEffect } from 'react';

import tw from 'twin.macro';
import { isProduction } from '@/helpers';
import { useStoreState } from 'easy-peasy';
import { authenticateEmail, loginProviders } from '@/api/auth';
import { store, ApplicationStore } from '@/state';
import { LoginBackground } from '@/assets/images';
import { Link, useNavigate } from 'react-router-dom';
import { PageContentBlock, Notification, Spinner } from '@/components/elements/generic';

const Login = (props: { title: string }) => {
	const [formData, setFormData] = useState({ email: '', password: '' });
	const [show, setShow] = useState(false);
	const [loading, setLoading] = useState(false);
	const [loginError, setLoginError] = useState({ status: 200 });
	const navigate = useNavigate();

	useEffect(() => {
		if (localStorage.getItem('pterodactyl_market_auth') || sessionStorage.getItem('pterodactyl_market_auth')) navigate('/');
	}, []);

	const handleChange = (event: any) => {
		setFormData({
			...formData,
			[event.target.name]: event.target.value,
		});
	};

	const handleSubmit = (event: any) => {
		event.preventDefault();
		setLoading(true);
		authenticateEmail(formData.email, formData.password)
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
				setLoading(false);
				navigate('/');
			})
			.catch((err) => {
				if (err.response) {
					setLoginError({ status: parseInt(err.response.status) });
				} else {
					setLoginError({ status: 204 });
				}
				setLoading(false);
				setShow(true);
			});
	};

	return (
		<PageContentBlock title={props.title}>
			<div tw='min-h-full flex'>
				<div tw='flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24'>
					<div tw='mx-auto w-full max-w-sm lg:w-96'>
						<div>
							<Link to='/'>
								<div className='flex items-center flex-shrink-0 text-sky-700 font-bold text-xl'>Pterodactyl Market</div>
							</Link>
							<h2 tw='mt-6 text-3xl font-extrabold text-gray-900'>Sign in to your account</h2>
							<p tw='mt-2 text-sm text-gray-600'>
								Don’t have an account?
								<Link to='/register' tw='font-medium text-sky-600 hover:text-sky-500'>
									{' Sign up '}
								</Link>
								for free.
							</p>
						</div>
						<div tw='mt-6'>
							<div>
								<div>
									<a
										onClick={() =>
											loginProviders('discord').then((method: any) => {
												localStorage.setItem('pterodactyl_market_auth_verifier', method.codeVerifier);
												window.location.replace(method.authUrl);
											})
										}
										tw='w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm bg-[#5865F3] text-sm font-medium text-white hover:bg-[#4A55D3] cursor-pointer transition flow-root'>
										<svg tw='w-5 h-5 float-right' aria-hidden='true' fill='currentColor' viewBox='0 0 71 55'>
											<g clipPath='url(#clip0)'>
												<path
													d='M60.1045 4.8978C55.5792 2.8214 50.7265 1.2916 45.6527 0.41542C45.5603 0.39851 45.468 0.440769 45.4204 0.525289C44.7963 1.6353 44.105 3.0834 43.6209 4.2216C38.1637 3.4046 32.7345 3.4046 27.3892 4.2216C26.905 3.0581 26.1886 1.6353 25.5617 0.525289C25.5141 0.443589 25.4218 0.40133 25.3294 0.41542C20.2584 1.2888 15.4057 2.8186 10.8776 4.8978C10.8384 4.9147 10.8048 4.9429 10.7825 4.9795C1.57795 18.7309 -0.943561 32.1443 0.293408 45.3914C0.299005 45.4562 0.335386 45.5182 0.385761 45.5576C6.45866 50.0174 12.3413 52.7249 18.1147 54.5195C18.2071 54.5477 18.305 54.5139 18.3638 54.4378C19.7295 52.5728 20.9469 50.6063 21.9907 48.5383C22.0523 48.4172 21.9935 48.2735 21.8676 48.2256C19.9366 47.4931 18.0979 46.6 16.3292 45.5858C16.1893 45.5041 16.1781 45.304 16.3068 45.2082C16.679 44.9293 17.0513 44.6391 17.4067 44.3461C17.471 44.2926 17.5606 44.2813 17.6362 44.3151C29.2558 49.6202 41.8354 49.6202 53.3179 44.3151C53.3935 44.2785 53.4831 44.2898 53.5502 44.3433C53.9057 44.6363 54.2779 44.9293 54.6529 45.2082C54.7816 45.304 54.7732 45.5041 54.6333 45.5858C52.8646 46.6197 51.0259 47.4931 49.0921 48.2228C48.9662 48.2707 48.9102 48.4172 48.9718 48.5383C50.038 50.6034 51.2554 52.5699 52.5959 54.435C52.6519 54.5139 52.7526 54.5477 52.845 54.5195C58.6464 52.7249 64.529 50.0174 70.6019 45.5576C70.6551 45.5182 70.6887 45.459 70.6943 45.3942C72.1747 30.0791 68.2147 16.7757 60.1968 4.9823C60.1772 4.9429 60.1437 4.9147 60.1045 4.8978ZM23.7259 37.3253C20.2276 37.3253 17.3451 34.1136 17.3451 30.1693C17.3451 26.225 20.1717 23.0133 23.7259 23.0133C27.308 23.0133 30.1626 26.2532 30.1066 30.1693C30.1066 34.1136 27.28 37.3253 23.7259 37.3253ZM47.3178 37.3253C43.8196 37.3253 40.9371 34.1136 40.9371 30.1693C40.9371 26.225 43.7636 23.0133 47.3178 23.0133C50.9 23.0133 53.7545 26.2532 53.6986 30.1693C53.6986 34.1136 50.9 37.3253 47.3178 37.3253Z'
													fill='currentColor'
												/>
											</g>
											<defs>
												<clipPath id='clip0'>
													<rect width='71' height='55' fill='white' />
												</clipPath>
											</defs>
										</svg>
										<span tw='float-left'>Sign in with Discord</span>
									</a>
								</div>
								<div tw='mt-4 relative'>
									<div tw='absolute inset-0 flex items-center' aria-hidden='true'>
										<div tw='w-full border-t border-gray-300' />
									</div>
									<div tw='relative flex justify-center text-sm'>
										<span tw='px-2 bg-white text-gray-500'>Or continue with</span>
									</div>
								</div>
							</div>
							<div tw='mt-6'>
								<form onSubmit={handleSubmit} tw='space-y-7'>
									<div
										tw='relative border border-gray-300 rounded-md px-3 py-2 shadow-sm focus-within:ring-1 focus-within:ring-sky-600 focus-within:border-sky-600 transition'
										css={loading && tw`cursor-default opacity-75`}>
										<label htmlFor='email' tw='absolute -top-2 left-2 -mt-px inline-block px-1 bg-white text-xs font-medium text-gray-900'>
											Email address
										</label>
										<div tw='mt-1'>
											<input
												disabled={loading}
												id='email'
												type='email'
												name='email'
												autoComplete='email'
												required
												value={formData.email}
												onChange={handleChange}
												placeholder='Ex. james@bond.com'
												tw='block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm transition'
											/>
										</div>
									</div>
									<div
										tw='relative border border-gray-300 rounded-md px-3 py-2 shadow-sm focus-within:ring-1 focus-within:ring-sky-600 focus-within:border-sky-600 transition'
										css={loading && tw`cursor-default opacity-75`}>
										<label htmlFor='password' tw='absolute -top-2 left-2 -mt-px inline-block px-1 bg-white text-xs font-medium text-gray-900'>
											Password
										</label>
										<div tw='mt-1'>
											<input
												disabled={loading}
												id='password'
												name='password'
												type='password'
												autoComplete='current-password'
												required
												value={formData.password}
												onChange={handleChange}
												placeholder='••••••••'
												tw='block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm transition'
											/>
										</div>
									</div>
									<div tw='flex items-center justify-between'>
										<div tw='flex items-center'>
											<input type='checkbox' tw='h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 rounded transition' />
											<div tw='ml-2 block text-sm text-gray-900'>Remember me</div>
										</div>
										<div tw='text-sm'>
											<a href='#' tw='font-medium text-sky-600 hover:text-sky-500 transition'>
												Forgot your password?
											</a>
										</div>
									</div>
									<div>
										<button
											type='submit'
											disabled={loading}
											tw='relative w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:(cursor-default bg-opacity-75 hover:bg-sky-600 hover:bg-opacity-75) transition'>
											Sign in
											{loading && (
												<span className='absolute right-0 inset-y-0 flex items-center pr-3'>
													<Spinner size='small' />
												</span>
											)}
										</button>
									</div>
								</form>
							</div>
						</div>
						<button onClick={() => navigate('/')} className='text-sky-600 text-sm font-semibold hover:text-sky-800 transition mt-5'>
							Go Back <span aria-hidden='true'>&rarr;</span>
						</button>
					</div>
				</div>
				<div tw='hidden lg:block relative w-0 flex-1'>
					<img tw='absolute inset-0 h-full w-full object-cover' src={LoginBackground} alt='' />
				</div>
			</div>
			<Notification
				show={show}
				callback={(close: boolean) => setShow(close)}
				type='error'
				icon
				content={{
					title: 'Unable to login.',
					message:
						(loginError.status === 400 && 'No account matching those credentials could be found.') ||
						'An error occurred while processing the login request.',
				}}
			/>
		</PageContentBlock>
	);
};

export default Login;
