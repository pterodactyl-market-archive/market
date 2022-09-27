import React, { useState, useEffect, Fragment } from 'react';

import ky from 'ky';
import tw from 'twin.macro';
import { signOut } from '@/api/auth';
import { updateUserProfile } from '@/api/user';
import { Link, useLocation } from 'react-router-dom';
import { useStoreState } from 'easy-peasy';
import { ApplicationStore } from '@/state';
import { isProduction, debounce, classNames, formatPrice } from '@/helpers';
import { NavbarBackground } from '@/assets/images';
import { Spinner } from '@/components/elements/generic';
import { ChevronDownIcon } from '@heroicons/react/solid';
import { Dialog, Tab, Menu, Popover, Transition } from '@headlessui/react';

import {
	MenuIcon,
	QuestionMarkCircleIcon,
	SearchIcon,
	ShoppingBagIcon,
	DocumentAddIcon,
	XIcon,
	ChartBarIcon,
	DocumentIcon,
	AnnotationIcon,
	DocumentTextIcon,
	DocumentReportIcon,
	RefreshIcon,
	ShieldCheckIcon,
	ViewGridIcon,
	SupportIcon,
	BookmarkAltIcon,
	CalendarIcon,
	PuzzleIcon,
	PencilIcon,
	CogIcon,
	CollectionIcon,
	CubeTransparentIcon,
	LoginIcon,
	UserAddIcon,
	SpeakerphoneIcon,
} from '@heroicons/react/outline';

const resources = [
	{
		name: 'Help Center',
		description: 'Get all of your questions answered in our forums or contact support.',
		href: '#',
		icon: SupportIcon,
	},
	{
		name: 'Guides',
		description: 'Learn how to maximize our platform to get the most out of it.',
		href: '#',
		icon: BookmarkAltIcon,
	},
	{
		name: 'Reports',
		description: 'See what meet-ups and other events we might be planning near you.',
		href: '#',
		icon: SpeakerphoneIcon,
	},
	{ name: 'Security', description: 'Understand how we take your privacy seriously.', href: '#', icon: ShieldCheckIcon },
];

const account = [
	{
		name: 'Sign in',
		description: 'Welcome back, Sign into your account here.',
		href: '/login',
		icon: LoginIcon,
	},
	{
		name: 'Create an account',
		description: 'Don’t have an account? Sign up now for free.',
		href: '/register',
		icon: UserAddIcon,
	},
];

const currencies = ['USD', 'EUR', 'GBP'];
const navigation = {
	categories: [
		{
			name: 'Addons',
			description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
			href: '/marketplace/addons',
			color: 'bg-teal-500',
			icon: CollectionIcon,
		},
		{
			name: 'Eggs',
			description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
			href: '/marketplace/eggs',
			color: 'bg-blue-500',
			icon: DocumentTextIcon,
		},
		{
			name: 'Themes',
			description: 'CLorem ipsum dolor sit amet, consectetur adipiscing elit.',
			href: '/marketplace/themes',
			color: 'bg-cyan-500',
			icon: PencilIcon,
		},
		{
			name: 'Scripts',
			description: 'CLorem ipsum dolor sit amet, consectetur adipiscing elit.',
			href: '/marketplace/scripts',
			color: 'bg-sky-500',
			icon: CogIcon,
		},
		{
			name: 'Services',
			description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
			href: '/marketplace/services',
			color: 'bg-sky-500',
			icon: CubeTransparentIcon,
		},
		{
			name: 'Plugins',
			description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
			href: '/marketplace/plugins',
			color: 'bg-purple-500',
			icon: PuzzleIcon,
		},
	],
	pages: [
		{ name: 'Community', href: '/community' },
		{ name: 'About', href: '/about' },
		{ name: 'Docs', href: '/docs' },
	],
};

const Navbar = () => {
	const location = useLocation();
	const [visible, setVisible] = useState(true);
	const [loading, setLoading] = useState(false);
	const [shoppingCart, setShoppingCart] = useState([]);
	const [currencyType, setCurrencyType] = useState('USD');
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [shoppingCartStatus, openShoppingCart] = useState(false);
	const UserData = useStoreState((state: ApplicationStore) => state.user.data);

	const handleScroll = debounce(() => {
		const currentScrollPos = window.pageYOffset;
		setVisible(currentScrollPos < 10);
	}, 5);

	const updateNavData = () => {
		if (UserData?.token) {
			ky.get(`https://beta.pterodactylmarket.com/api/collections/profiles/records/${UserData!.account.id}?expand=shopping_cart`)
				.json()
				.then((data: any) => {
					setShoppingCart(data['@expand'] ? data['@expand'].shopping_cart : []);
					setCurrencyType(data.currency);
				});
		}
	};

	const removeItem = (id: string) => {
		if (UserData?.token) {
			updateUserProfile(UserData!.token, UserData!.account.id, {
				shopping_cart: shoppingCart.filter((e: string) => e !== id),
			}).then(() => updateNavData());
		}
	};

	const stripeCheckout = () => {
		setLoading(true);
		const products = shoppingCart.map((item: any) => item.id);
		ky.post(`https://beta.pterodactylmarket.com/api/checkout/stripe/${products.join(',')}`, {
			headers: {
				Authorization: `User ${UserData!.token}`,
			},
		})
			.json()
			.then((data: any) => {
				updateUserProfile(UserData!.token, UserData!.account.id, {
					shopping_cart: [],
				})
					.then(() => {
						setLoading(false);
						//@ts-ignore
						window.location.href = data.session;
					})
					.catch((err) => console.log(err));
			})
			.catch((err) => console.log(err));
	};

	useEffect(() => {
		updateNavData();
	}, [location.pathname]);

	useEffect(() => {
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, [visible, handleScroll]);

	return (
		<nav>
			<Transition.Root show={shoppingCartStatus} as={Fragment}>
				<Dialog as='div' className='fixed inset-0 overflow-hidden z-[200]' onClose={openShoppingCart}>
					<div className='absolute inset-0 overflow-hidden'>
						<Transition.Child
							as={Fragment}
							enter='ease-in-out duration-500'
							enterFrom='opacity-0'
							enterTo='opacity-100'
							leave='ease-in-out duration-500'
							leaveFrom='opacity-100'
							leaveTo='opacity-0'>
							<Dialog.Overlay className='absolute inset-0 bg-zinc-500 bg-opacity-75 backdrop-blur-sm transition-opacity' />
						</Transition.Child>

						<div className='fixed inset-y-0 right-0 pl-10 max-w-full flex'>
							<Transition.Child
								as={Fragment}
								enter='transform transition ease-in-out duration-500'
								enterFrom='translate-x-full'
								enterTo='translate-x-0'
								leave='transform transition ease-in-out duration-500'
								leaveFrom='translate-x-0'
								leaveTo='translate-x-full'>
								<div className='w-screen max-w-md'>
									<div className='h-full flex flex-col bg-white shadow-xl overflow-y-scroll'>
										<div className='flex-1 py-6 overflow-y-auto px-4 sm:px-6'>
											<div className='flex items-start justify-between'>
												<Dialog.Title className='text-lg font-medium text-zinc-900'>Shopping cart</Dialog.Title>
												<div className='ml-3 h-7 flex items-center'>
													<button type='button' className='-m-2 p-2 text-zinc-400 hover:text-zinc-500' onClick={() => openShoppingCart(false)}>
														<span className='sr-only'>Close panel</span>
														<XIcon className='h-6 w-6' aria-hidden='true' />
													</button>
												</div>
											</div>

											<div className='mt-8'>
												<div className='flow-root'>
													<ul role='list' className='-my-6 divide-y divide-zinc-200'>
														{shoppingCart.map((item: any) => {
															const productIcon = item.icon
																? `${!isProduction ? 'https://beta.pterodactylmarket.com' : ''}/api/files/resources/${item.id}/${item.icon}`
																: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='rgb(161 161 170)'%3E%3Cpath fillRule='evenodd' d='M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z' clipRule='evenodd' /%3E%3C/svg%3E`;
															return (
																<li key={item.id} className='py-6 flex'>
																	<div className='flex-shrink-0 w-24 h-24 border border-zinc-200 rounded-md overflow-hidden'>
																		<img src={productIcon} className='w-full h-full object-center object-cover' />
																	</div>

																	<div className='ml-4 flex-1 flex flex-col'>
																		<div>
																			<div className='flex justify-between text-base font-medium text-zinc-900'>
																				<h3>
																					<Link to={item.id}>{item.name}</Link>
																				</h3>
																				<p className='ml-4'>${formatPrice((item.price / 100).toString())}</p>
																			</div>
																			<p className='text-[0.77rem] text-zinc-500 h-[3.8rem]'>
																				{item.details
																					? item.details.substr(0, 90).replace(/<[^>]*>?/gm, '') + (item.details.length > 90 ? '...' : '')
																					: 'The author has not yet provided a description.'}
																			</p>
																		</div>
																		<div className='-mt-1 flex-1 flex items-end justify-between text-sm'>
																			<div className='flex'>
																				<button
																					onClick={() => removeItem(item.id)}
																					type='button'
																					className='font-medium text-sky-600 hover:text-sky-500'>
																					Remove
																				</button>
																			</div>
																		</div>
																	</div>
																</li>
															);
														})}
													</ul>
												</div>
											</div>
										</div>

										<div className='border-t border-zinc-200 py-6 px-4 sm:px-6'>
											<div className='flex justify-between text-base font-medium text-zinc-900'>
												<p>Subtotal</p>
												<p>
													$
													{formatPrice(
														(
															shoppingCart.reduce((sum: number, item: any) => {
																return sum + item.price;
															}, 0) / 100
														).toString()
													)}
												</p>
											</div>
											<p className='mt-0.5 text-sm text-zinc-500'>Fees and taxes calculated at checkout.</p>
											{shoppingCart.length != 0 ? (
												<Fragment>
													<div className='mt-6'>
														<button
															disabled={loading}
															onClick={() => stripeCheckout()}
															tw='relative flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-sky-600 hover:(text-white bg-gradient-to-br from-purple-600 to-blue-500) w-full disabled:(pointer-events-none text-white bg-gradient-to-br from-purple-600 to-blue-500)'>
															Stripe Checkout
															{loading && (
																<span className='absolute left-0 inset-y-0 flex items-center pl-3'>
																	<Spinner size='small' />
																</span>
															)}
														</button>
													</div>
													<div className='mt-6 flex justify-center text-sm text-center text-zinc-500'>
														<p>
															or{' '}
															<button
																type='button'
																disabled={loading}
																className='text-sky-600 font-medium hover:text-sky-500 disabled:text-zinc-600'
																onClick={() => openShoppingCart(false)}>
																Continue Shopping<span aria-hidden='true'> &rarr;</span>
															</button>
														</p>
													</div>
												</Fragment>
											) : (
												<div className='mt-6 flex justify-center text-sm text-center text-zinc-500'>
													<button type='button' className='text-sky-600 font-medium hover:text-sky-500' onClick={() => openShoppingCart(false)}>
														Continue Shopping<span aria-hidden='true'> &rarr;</span>
													</button>
												</div>
											)}
										</div>
									</div>
								</div>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition.Root>
			<Transition.Root show={mobileMenuOpen} as={Fragment}>
				<Dialog as='div' tw='fixed inset-0 flex z-40 lg:hidden' onClose={setMobileMenuOpen}>
					<Transition.Child
						as={Fragment}
						enter='transition-opacity ease-linear duration-300'
						enterFrom='opacity-0'
						enterTo='opacity-100'
						leave='transition-opacity ease-linear duration-300'
						leaveFrom='opacity-100'
						leaveTo='opacity-0'>
						<Dialog.Overlay tw='fixed inset-0 bg-black bg-opacity-25' />
					</Transition.Child>

					<Transition.Child
						as={Fragment}
						enter='transition ease-in-out duration-300 transform'
						enterFrom='-translate-x-full'
						enterTo='translate-x-0'
						leave='transition ease-in-out duration-300 transform'
						leaveFrom='translate-x-0'
						leaveTo='-translate-x-full'>
						<div tw='relative max-w-xs w-full bg-white shadow-xl pb-12 flex flex-col overflow-y-auto'>
							<div tw='px-4 pt-5 pb-2 flex'>
								<button
									type='button'
									tw='-m-2 p-2 rounded-md inline-flex items-center justify-center text-zinc-400'
									onClick={() => setMobileMenuOpen(false)}>
									<span tw='sr-only'>Close menu</span>
									<XIcon tw='h-6 w-6' aria-hidden='true' />
								</button>
							</div>

							{/* Links */}
							<Tab.Group as='div' tw='mt-2'>
								<Tab.Panels as={Fragment}>
									<Tab.Panel tw='px-4 py-6 space-y-12'>
										<div tw='grid grid-cols-2 gap-x-4 gap-y-5'>
											{navigation.categories.map((item) => (
												<Link to={item.href} key={item.name} className='group relative'>
													<div tw='rounded-md bg-zinc-100 overflow-hidden group-hover:opacity-75 flex transition'>
														<div
															className={`flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-l-md text-white sm:h-12 sm:w-12 ${item.color}`}>
															<item.icon className='h-6 w-6' aria-hidden='true' />
														</div>
														<span tw='inline font-medium text-zinc-900 mt-2 ml-3'>{item.name}</span>
													</div>
												</Link>
											))}
										</div>
									</Tab.Panel>
								</Tab.Panels>
							</Tab.Group>

							<div tw='border-t border-zinc-200 py-6 px-4 space-y-6'>
								{navigation.pages.map((page) => (
									<div key={page.name} tw='flow-root'>
										<a href={page.href} tw='-m-2 p-2 block font-medium text-zinc-900'>
											{page.name}
										</a>
									</div>
								))}
							</div>

							<div tw='border-t border-zinc-200 py-6 px-4 space-y-6'>
								<div tw='flow-root'>
									<Link to='/register' tw='-m-2 p-2 block font-medium text-zinc-900'>
										Create an account
									</Link>
								</div>
								<div tw='flow-root'>
									<Link to='/login' tw='-m-2 p-2 block font-medium text-zinc-900'>
										Sign in
									</Link>
								</div>
							</div>

							<div tw='border-t border-zinc-200 py-6 px-4 space-y-6'>
								{/* Currency selector */}
								<form>
									<div tw='inline-block'>
										<label htmlFor='mobile-currency' tw='sr-only'>
											Currency
										</label>
										<div className='group' tw='-ml-2 relative border-transparent rounded-md'>
											<select
												id='mobile-currency'
												name='currency'
												tw='bg-none border-transparent rounded-md py-0.5 pl-2 pr-5 flex items-center text-sm font-medium text-zinc-700 group-hover:text-zinc-800 focus:outline-none focus:ring-0 focus:border-transparent'>
												{currencies.map((currency) => (
													<option key={currency}>{currency}</option>
												))}
											</select>
											<div tw='absolute right-0 inset-y-0 flex items-center pointer-events-none'>
												<svg aria-hidden='true' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20' tw='w-5 h-5 text-zinc-500'>
													<path stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5' d='M6 8l4 4 4-4' />
												</svg>
											</div>
										</div>
									</div>
								</form>
							</div>
						</div>
					</Transition.Child>
				</Dialog>
			</Transition.Root>
			<header tw='relative z-20 fixed w-full' style={{ transition: 'top 0.6s', top: visible ? '0' : '-40px' }}>
				<nav aria-label='Top'>
					<div tw='bg-sky-900'>
						<div tw='max-w-7xl mx-auto h-10 px-4 flex items-center justify-between sm:px-6 lg:px-8'>
							<form
								onBlur={() => {
									updateUserProfile(UserData!.token, UserData!.account.id, {
										currency: currencyType,
									});
								}}>
								<div>
									<label htmlFor='desktop-currency' tw='sr-only'>
										Currency
									</label>
									<div className='group' tw='-ml-2 relative bg-sky-900 border-transparent rounded-md'>
										<select
											disabled={!UserData?.token}
											id='desktop-currency'
											name='currency'
											value={currencyType}
											onChange={(event) => setCurrencyType(event.target.value)}
											tw='bg-none bg-sky-900 border-transparent rounded-md py-0.5 pl-2 pr-5 flex items-center text-sm font-medium text-white group-hover:text-zinc-100 focus:outline-none focus:ring-0 focus:border-transparent disabled:pointer-events-none'>
											{currencies.map((currency) => (
												<option key={currency}>{currency}</option>
											))}
										</select>
										<div tw='absolute right-0 inset-y-0 flex items-center pointer-events-none'>
											<svg aria-hidden='true' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20' tw='w-5 h-5 text-sky-100'>
												<path stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5' d='M6 8l4 4 4-4' />
											</svg>
										</div>
									</div>
								</div>
							</form>

							<div tw='flex items-center space-x-6'>
								{UserData?.token ? (
									<Menu as='div' className='relative inline-block text-left z-50'>
										<Menu.Button className='inline-flex justify-center text-sm font-medium text-white hover:text-zinc-100 mt-1'>
											<img className='h-5 w-5 rounded-full mr-2' src={UserData?.profile.avatar} alt='' />
											{UserData?.username}
											<ChevronDownIcon className='ml-1 h-5 w-5 mt-[1px]' aria-hidden='true' />
										</Menu.Button>
										<Transition
											as={Fragment}
											enter='transition ease-out duration-100'
											enterFrom='transform opacity-0 scale-95'
											enterTo='transform opacity-100 scale-100'
											leave='transition ease-in duration-75'
											leaveFrom='transform opacity-100 scale-100'
											leaveTo='transform opacity-0 scale-95'>
											<Menu.Items className='origin-top-right absolute right-0 mt-0.5 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-zinc-100 focus:outline-none'>
												<div className='px-4 py-3'>
													<p className='text-sm'>Signed in as</p>
													<Link to={`/profile/${UserData?.username}/`} className='text-sm font-medium text-zinc-900 truncate'>
														{UserData?.email}
													</Link>
												</div>
												<div className='py-1'>
													<Menu.Item>
														{({ active }) => (
															<Link
																to='/settings/account/purchases'
																className={classNames(active ? 'bg-zinc-100 text-zinc-900' : 'text-zinc-700', 'block px-4 py-2 text-sm')}>
																Purchases
															</Link>
														)}
													</Menu.Item>
													<Menu.Item>
														{({ active }) => (
															<Link
																to={`/profile/${UserData?.username}/friends`}
																className={classNames(active ? 'bg-zinc-100 text-zinc-900' : 'text-zinc-700', 'block px-4 py-2 text-sm')}>
																Friends
															</Link>
														)}
													</Menu.Item>
													<Menu.Item>
														{({ active }) => (
															<Link
																to='/settings/account'
																className={classNames(active ? 'bg-zinc-100 text-zinc-900' : 'text-zinc-700', 'block px-4 py-2 text-sm')}>
																Settings
															</Link>
														)}
													</Menu.Item>
												</div>
												{UserData?.group === 'user' ? (
													<div className='py-1'>
														<Menu.Item>
															{({ active }) => (
																<a href='#' className={classNames(active ? 'bg-zinc-100 text-zinc-900' : 'text-zinc-700', 'block px-4 py-2 text-sm')}>
																	Become a seller
																</a>
															)}
														</Menu.Item>
													</div>
												) : (
													<div className='py-1'>
														<Menu.Item>
															{({ active }) => (
																<Link
																	to='/seller/resources'
																	className={classNames(active ? 'bg-zinc-100 text-zinc-900' : 'text-zinc-700', 'block px-4 py-2 text-sm')}>
																	Resources
																</Link>
															)}
														</Menu.Item>
														<Menu.Item>
															{({ active }) => (
																<Link
																	to='/seller/dashboard'
																	className={classNames(active ? 'bg-zinc-100 text-zinc-900' : 'text-zinc-700', 'block px-4 py-2 text-sm')}>
																	Seller settings
																</Link>
															)}
														</Menu.Item>
													</div>
												)}
												<div className='py-1'>
													<Menu.Item>
														{({ active }) => (
															<button
																onClick={() => {
																	signOut();
																	//@ts-ignore
																	window.location.href = '/';
																}}
																className={classNames(
																	active ? 'bg-zinc-100 text-zinc-900' : 'text-zinc-700',
																	'block w-full text-left px-4 py-2 text-sm'
																)}>
																Sign out
															</button>
														)}
													</Menu.Item>
												</div>
											</Menu.Items>
										</Transition>
									</Menu>
								) : (
									<Fragment>
										<Link to='/login' tw='text-sm font-medium text-white hover:text-sky-200 transition'>
											Sign in
										</Link>
										<Link to='/register' tw='text-sm font-medium text-white hover:text-sky-200 transition'>
											Create an account
										</Link>
									</Fragment>
								)}
							</div>
						</div>
					</div>

					<div
						tw='backdrop-blur-md backdrop-filter bg-opacity-70 bg-sky-700 transition-all'
						css={(!visible || window.location.pathname !== '/') && tw`bg-opacity-[0.90] shadow-md bg-sky-700`}>
						<div tw='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
							<div>
								<div tw='h-16 flex items-center justify-between'>
									{/* Logo (lg+) */}
									<div tw='hidden lg:flex-1 lg:flex lg:items-center'>
										<Link to='/' tw='font-bold text-zinc-100 hover:text-sky-200 transition'>
											Pterodactyl Market
										</Link>
									</div>

									<div tw='hidden h-full lg:flex'>
										{/* Flyout menus */}
										<Popover.Group tw='px-4 bottom-0 inset-x-0'>
											<div tw='h-full flex justify-center space-x-8'>
												<Popover tw='relative flex'>
													{({ open }) => (
														<>
															<div tw='relative flex'>
																<Popover.Button
																	tw='relative z-10 flex items-center justify-center transition-colors ease-out duration-200 text-sm font-medium text-sky-100 drop-shadow-sm hover:text-sky-50 hover:font-semibold hover:tracking-[-0.01em] transition focus:outline-none'
																	css={open && tw`text-white font-semibold hover:text-white tracking-[-0.01em]`}>
																	Marketplace
																	<span
																		className={classNames(
																			open ? 'bg-white' : '',
																			'absolute -bottom-px inset-x-0 h-0.5 transition ease-out duration-200'
																		)}
																		aria-hidden='true'
																	/>
																</Popover.Button>
															</div>

															<Transition
																as={Fragment}
																enter='transition ease-out duration-200'
																enterFrom='opacity-0 translate-y-1'
																enterTo='opacity-100 translate-y-0'
																leave='transition ease-in duration-150'
																leaveFrom='opacity-100 translate-y-0'
																leaveTo='opacity-0 translate-y-1'>
																<Popover.Panel className='mt-20 absolute z-10 left-1/2 transform -translate-x-1/2 mt-3 px-2 w-screen max-w-md sm:px-0 lg:max-w-3xl'>
																	<div tw='rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden'>
																		<div tw='relative grid gap-6 bg-white px-5 py-6 sm:gap-8 sm:p-8 lg:grid-cols-2'>
																			{navigation.categories.map((item) => (
																				<Popover.Button
																					as={Link}
																					key={item.name}
																					to={item.href}
																					className='-m-3 p-3 flex items-start rounded-lg hover:bg-zinc-100/60 transition ease-in-out duration-150'>
																					<div
																						className={`flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-md text-white sm:h-12 sm:w-12 ${item.color}`}>
																						<item.icon className='h-6 w-6' aria-hidden='true' />
																					</div>
																					<div className='ml-4'>
																						<p className='text-base font-medium text-zinc-900'>{item.name}</p>
																						<p className='mt-1 text-sm text-zinc-500'>{item.description}</p>
																					</div>
																				</Popover.Button>
																			))}
																		</div>
																		{UserData?.group === 'seller' ? (
																			<div className='p-5 bg-zinc-50 sm:p-8 grid grid-cols-3'>
																				<Link
																					to='/seller/resources/create'
																					className='-my-5 -ml-5 mr-3 p-3 flow-root rounded-md hover:bg-zinc-200/40 transition ease-in-out duration-150'>
																					<span className='flex items-center'>
																						<DocumentAddIcon className='flex-shrink-0 h-6 w-6 text-zinc-400' aria-hidden='true' />
																						<span className='ml-3 text-base font-medium text-zinc-900'>Create resource</span>
																					</span>
																				</Link>
																				<Link
																					to='/seller/dashboard'
																					className='-my-5 p-3 -ml-3 flow-root rounded-md hover:bg-zinc-200/40 transition ease-in-out duration-150'>
																					<span className='flex items-center'>
																						<ViewGridIcon className='flex-shrink-0 h-6 w-6 text-zinc-400' aria-hidden='true' />
																						<span className='ml-3 text-base font-medium text-zinc-900'>Seller dashboard</span>
																					</span>
																				</Link>
																				<Link
																					to='/requests'
																					className='-my-5 -mr-5 p-3 flow-root rounded-md hover:bg-zinc-200/40 transition ease-in-out duration-150'>
																					<span className='flex items-center'>
																						<AnnotationIcon className='flex-shrink-0 h-6 w-6 text-zinc-400' aria-hidden='true' />
																						<span className='ml-3 text-base font-medium text-zinc-900'>Custom requests</span>
																						<span className='ml-3 inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium leading-5 bg-sky-200 text-sky-900'>
																							New
																						</span>
																					</span>
																				</Link>
																			</div>
																		) : (
																			<div className='p-5 bg-zinc-50 sm:p-8'>
																				<a
																					href='#'
																					className='-m-3 p-3 flow-root rounded-md hover:bg-zinc-200/40 transition ease-in-out duration-150'>
																					<span className='flex items-center'>
																						<span className='text-base font-medium text-zinc-900'>Custom requests</span>
																						<span className='ml-3 inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium leading-5 bg-sky-200 text-sky-900'>
																							New
																						</span>
																					</span>
																					<span className='mt-1 block text-sm text-zinc-500'>
																						Empower your entire team with even more advanced tools.
																					</span>
																				</a>
																			</div>
																		)}
																	</div>
																</Popover.Panel>
															</Transition>
														</>
													)}
												</Popover>

												{navigation.pages.map((page) => (
													<Link
														key={page.name}
														to={page.href}
														tw='flex items-center text-sm font-medium text-sky-100 drop-shadow-sm hover:text-sky-50 hover:font-semibold hover:tracking-[-0.01em] transition'>
														{page.name}
													</Link>
												))}
											</div>
										</Popover.Group>
									</div>

									{/* Mobile menu and search (lg-) */}
									<div tw='flex-1 flex items-center lg:hidden'>
										<button type='button' tw='-ml-2 p-2 text-sky-100 hover:text-sky-50 transition' onClick={() => setMobileMenuOpen(true)}>
											<span tw='sr-only'>Open menu</span>
											<MenuIcon tw='h-6 w-6' aria-hidden='true' />
										</button>

										{/* Search */}
										<a href='#' tw='ml-2 p-2 text-sky-100 hover:text-sky-50 transition'>
											<span tw='sr-only'>Search</span>
											<SearchIcon tw='w-6 h-6' aria-hidden='true' />
										</a>
									</div>

									<Link to='/' tw='font-bold text-zinc-100 lg:hidden hover:text-sky-300 transition'>
										Pterodactyl Market
									</Link>

									<div tw='flex-1 flex items-center justify-end'>
										<a href='#' tw='hidden text-sm font-medium text-white lg:block hover:text-sky-200 transition'>
											Search
										</a>
										<div tw='flex items-center lg:ml-6'>
											<Link to='/support' tw='p-2 text-white lg:hidden'>
												<span tw='sr-only'>Help</span>
												<QuestionMarkCircleIcon tw='w-6 h-6' aria-hidden='true' />
											</Link>

											<Popover className='relative'>
												{({ open }) => (
													<>
														<Popover.Button
															className={classNames(
																open ? 'text-sky-300' : 'text-white',
																'hidden text-sm font-medium lg:block hover:text-sky-200 transition outline-none'
															)}>
															<span>Help</span>
														</Popover.Button>

														<Transition
															as={Fragment}
															enter='transition ease-out duration-200'
															enterFrom='opacity-0 translate-y-1'
															enterTo='opacity-100 translate-y-0'
															leave='transition ease-in duration-150'
															leaveFrom='opacity-100 translate-y-0'
															leaveTo='opacity-0 translate-y-1'>
															<Popover.Panel className='absolute z-10 left-[-10rem] transform -translate-x-1/2 mt-3 px-2 w-screen max-w-md sm:px-0'>
																<div className='rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden'>
																	<div className='relative grid gap-6 bg-white px-5 py-6 sm:gap-8 sm:p-7'>
																		{resources.map((item) => (
																			<Link
																				key={item.name}
																				to={item.href}
																				className='-m-3 p-3 flex items-start rounded-lg hover:bg-zinc-100/60 transition ease-in-out duration-150'>
																				<item.icon className='flex-shrink-0 h-6 w-6 text-sky-600' aria-hidden='true' />
																				<div className='ml-4'>
																					<p className='text-base font-medium text-zinc-900'>{item.name}</p>
																					<p className='mt-1 text-sm text-zinc-500'>{item.description}</p>
																				</div>
																			</Link>
																		))}
																	</div>
																</div>
															</Popover.Panel>
														</Transition>
													</>
												)}
											</Popover>
											{!visible && (
												<div tw='flex items-center ml-6 hidden lg:block'>
													{UserData?.token ? (
														<Menu as='div' className='relative inline-block text-left z-50'>
															<Menu.Button className='inline-flex justify-center text-sm font-medium text-white hover:text-zinc-100 -mr-2 mt-1.5'>
																<img className='h-5 w-5 rounded-full mr-2' src={UserData?.profile.avatar} alt='' />
																{UserData?.username}
																<ChevronDownIcon className='ml-1 h-5 w-5 mt-[1px]' aria-hidden='true' />
															</Menu.Button>
															<Transition
																as={Fragment}
																enter='transition ease-out duration-100'
																enterFrom='transform opacity-0 scale-95'
																enterTo='transform opacity-100 scale-100'
																leave='transition ease-in duration-75'
																leaveFrom='transform opacity-100 scale-100'
																leaveTo='transform opacity-0 scale-95'>
																<Menu.Items className='origin-top-right absolute right-0 mt-0.5 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-zinc-100 focus:outline-none'>
																	<div className='px-4 py-3'>
																		<p className='text-sm'>Signed in as</p>
																		<Link to={`/profile/${UserData?.username}/`} className='text-sm font-medium text-zinc-900 truncate'>
																			{UserData?.email}
																		</Link>
																	</div>
																	<div className='py-1'>
																		<Menu.Item>
																			{({ active }) => (
																				<Link
																					to='/settings/account/purchases'
																					className={classNames(active ? 'bg-zinc-100 text-zinc-900' : 'text-zinc-700', 'block px-4 py-2 text-sm')}>
																					Purchases
																				</Link>
																			)}
																		</Menu.Item>
																		<Menu.Item>
																			{({ active }) => (
																				<Link
																					to={`/profile/${UserData?.username}/friends`}
																					className={classNames(active ? 'bg-zinc-100 text-zinc-900' : 'text-zinc-700', 'block px-4 py-2 text-sm')}>
																					Friends
																				</Link>
																			)}
																		</Menu.Item>
																		<Menu.Item>
																			{({ active }) => (
																				<Link
																					to='/settings/account'
																					className={classNames(active ? 'bg-zinc-100 text-zinc-900' : 'text-zinc-700', 'block px-4 py-2 text-sm')}>
																					Settings
																				</Link>
																			)}
																		</Menu.Item>
																	</div>
																	{UserData?.group === 'user' ? (
																		<div className='py-1'>
																			<Menu.Item>
																				{({ active }) => (
																					<a
																						href='#'
																						className={classNames(active ? 'bg-zinc-100 text-zinc-900' : 'text-zinc-700', 'block px-4 py-2 text-sm')}>
																						Become a seller
																					</a>
																				)}
																			</Menu.Item>
																		</div>
																	) : (
																		<div className='py-1'>
																			<Menu.Item>
																				{({ active }) => (
																					<Link
																						to='/seller/resources'
																						className={classNames(active ? 'bg-zinc-100 text-zinc-900' : 'text-zinc-700', 'block px-4 py-2 text-sm')}>
																						Resources
																					</Link>
																				)}
																			</Menu.Item>
																			<Menu.Item>
																				{({ active }) => (
																					<Link
																						to='/seller/dashboard'
																						className={classNames(active ? 'bg-zinc-100 text-zinc-900' : 'text-zinc-700', 'block px-4 py-2 text-sm')}>
																						Seller settings
																					</Link>
																				)}
																			</Menu.Item>
																		</div>
																	)}
																	<div className='py-1'>
																		<Menu.Item>
																			{({ active }) => (
																				<button
																					onClick={() => {
																						signOut();
																						//@ts-ignore
																						window.location.href = '/';
																					}}
																					className={classNames(
																						active ? 'bg-zinc-100 text-zinc-900' : 'text-zinc-700',
																						'block w-full text-left px-4 py-2 text-sm'
																					)}>
																					Sign out
																				</button>
																			)}
																		</Menu.Item>
																	</div>
																</Menu.Items>
															</Transition>
														</Menu>
													) : (
														<Fragment>
															<Popover className='relative'>
																{({ open }) => (
																	<>
																		<Popover.Button
																			className={classNames(
																				open ? 'text-sky-300' : 'text-white',
																				'hidden text-sm font-medium lg:block hover:text-sky-200 transition outline-none'
																			)}>
																			<span>Account</span>
																		</Popover.Button>

																		<Transition
																			as={Fragment}
																			enter='transition ease-out duration-200'
																			enterFrom='opacity-0 translate-y-1'
																			enterTo='opacity-100 translate-y-0'
																			leave='transition ease-in duration-150'
																			leaveFrom='opacity-100 translate-y-0'
																			leaveTo='opacity-0 translate-y-1'>
																			<Popover.Panel className='absolute z-10 left-[-10rem] transform -translate-x-1/2 mt-3 px-2 w-screen max-w-md sm:px-0'>
																				<div className='rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden'>
																					<div className='relative grid gap-6 bg-white px-5 py-6 sm:gap-8 sm:p-7'>
																						{account.map((item) => (
																							<Link
																								key={item.name}
																								to={item.href}
																								className='-m-3 p-3 flex items-start rounded-lg hover:bg-zinc-100/60 transition ease-in-out duration-150'>
																								<item.icon className='flex-shrink-0 h-6 w-6 text-sky-600' aria-hidden='true' />
																								<div className='ml-4'>
																									<p className='text-base font-medium text-zinc-900'>{item.name}</p>
																									<p className='mt-1 text-sm text-zinc-500'>{item.description}</p>
																								</div>
																							</Link>
																						))}
																					</div>
																				</div>
																			</Popover.Panel>
																		</Transition>
																	</>
																)}
															</Popover>
														</Fragment>
													)}
												</div>
											)}

											<div tw='ml-4 flow-root lg:ml-8'>
												<button
													disabled={!UserData?.token}
													onClick={() => openShoppingCart(true)}
													className='group -m-2 p-2 flex items-center disabled:pointer-events-none disabled:opacity-80'>
													<ShoppingBagIcon tw='flex-shrink-0 h-6 w-6 text-white hover:text-sky-200 transition' aria-hidden='true' />
													<span tw='ml-2 text-sm font-medium text-white'>{shoppingCart.length}</span>
													<span tw='sr-only'>items in cart, view bag</span>
												</button>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</nav>
			</header>
		</nav>
	);
};

export default Navbar;
