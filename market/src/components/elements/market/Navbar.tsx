import React, { useState, useEffect, Fragment } from 'react';

import tw from 'twin.macro';
import { signOut } from '@/api/auth';
import { Link } from 'react-router-dom';
import { useStoreState } from 'easy-peasy';
import { ApplicationStore } from '@/state';
import { Offline } from 'react-detect-offline';
import { debounce, classNames } from '@/helpers';
import { NavbarBackground } from '@/assets/images';
import { Spinner } from '@/components/elements/generic';
import { ChevronDownIcon } from '@heroicons/react/solid';
import { Fallback } from '@/components/elements/generic';
import { Dialog, Tab, Menu, Popover, Transition } from '@headlessui/react';

import {
	MenuIcon,
	QuestionMarkCircleIcon,
	SearchIcon,
	ShoppingBagIcon,
	XIcon,
	ChartBarIcon,
	DocumentIcon,
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
		name: 'Events',
		description: 'See what meet-ups and other events we might be planning near you.',
		href: '#',
		icon: CalendarIcon,
	},
	{ name: 'Security', description: 'Understand how we take your privacy seriously.', href: '#', icon: ShieldCheckIcon },
];

const currencies = ['USD', 'EUR', 'GBP'];
const navigation = {
	categories: [
		{
			name: 'Marketplace',
			featured: [
				{
					name: 'Everything',
					href: '/marketplace',
					imageSrc: 'https://tailwindui.com/img/ecommerce-images/mega-menu-category-01.jpg',
					imageAlt: 'Models sitting back to back, wearing Basic Tee in black and bone.',
				},
				{
					name: 'Addons',
					href: '/marketplace/addons',
					imageSrc: 'https://tailwindui.com/img/ecommerce-images/mega-menu-category-02.jpg',
					imageAlt: 'Close up of Basic Tee fall bundle with off-white, ochre, olive, and black tees.',
				},
				{
					name: 'Accessories',
					href: '#',
					imageSrc: 'https://tailwindui.com/img/ecommerce-images/mega-menu-category-03.jpg',
					imageAlt: 'Model wearing minimalist watch with black wristband and white watch face.',
				},
				{
					name: 'Carry',
					href: '#',
					imageSrc: 'https://tailwindui.com/img/ecommerce-images/mega-menu-category-04.jpg',
					imageAlt: 'Model opening tan leather long wallet with credit card pockets and cash pouch.',
				},
			],
		},
	],
	pages: [
		{ name: 'Community', href: '/community' },
		{ name: 'About', href: '/about' },
		{ name: 'Docs', href: '/docs' },
	],
};

const solutions = [
	{
		name: 'Addons',
		description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
		href: '/marketplace/addons',
		icon: CollectionIcon,
	},
	{
		name: 'Eggs',
		description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
		href: '/marketplace/eggs',
		icon: DocumentTextIcon,
	},
	{
		name: 'Themes',
		description: 'CLorem ipsum dolor sit amet, consectetur adipiscing elit.',
		href: '/marketplace/themes',
		icon: PencilIcon,
	},
	{
		name: 'Scripts',
		description: 'CLorem ipsum dolor sit amet, consectetur adipiscing elit.',
		href: '/marketplace/scripts',
		icon: CogIcon,
	},
	{
		name: 'Services',
		description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
		href: '/marketplace/services',
		icon: CubeTransparentIcon,
	},
	{
		name: 'Plugins',
		description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
		href: '/marketplace/plugins',
		icon: PuzzleIcon,
	},
];

const NavLink = (props: any) => {
	const onPage = (path: string) => {
		return window.location.pathname.endsWith(props.href);
	};
	return (
		<Link
			to={props.href}
			css={[
				tw`rounded-[5px] px-2.5 py-[5px] mx-2 text-base font-medium text-center`,
				onPage(props.href)
					? tw`bg-opacity-50 bg-zinc-200 dark:bg-opacity-10`
					: tw`bg-opacity-0 text-zinc-600 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-300`,
			]}>
			{props.name}
		</Link>
	);
};

const Navbar = () => {
	const [visible, setVisible] = useState(true);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const UserData = useStoreState((state: ApplicationStore) => state.user.data);

	const Fallback = () => {
		return (
			<Offline>
				<div css={tw`z-50 w-full bg-red-500 py-2 pointer-events-none`} style={{ transition: 'top 0.6s', top: visible ? '0' : '-40px' }}>
					<div css={tw`flex items-center justify-center`}>
						<Spinner size={'small'} />
						<p css={tw`ml-2 text-sm text-red-50 font-semibold`}>We&apos;re having some trouble connecting to the internet, please wait...</p>
					</div>
				</div>
				<div
					css={[
						tw`right-0 bg-red-500 z-50 sm:shadow-lg sm:rounded-lg pointer-events-none ring-1 ring-black ring-opacity-5 overflow-hidden sm:mb-4 sm:mr-4 p-3`,
						window.location.pathname == '/login' && tw`hidden`,
					]}
					style={{ position: 'fixed', bottom: !visible ? '0' : '-10rem' }}>
					<div css={tw`flex items-center`}>
						<Spinner size={'small'} />
						<p css={tw`ml-3 text-sm text-red-50 font-semibold`}>We&apos;re having some trouble connecting to the internet, please wait...</p>
					</div>
				</div>
			</Offline>
		);
	};

	const handleScroll = debounce(() => {
		const currentScrollPos = window.pageYOffset;
		setVisible(currentScrollPos < 10);
	}, 5);

	useEffect(() => {
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, [visible, handleScroll]);

	return (
		<nav>
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
								<div tw='border-b border-zinc-200'>
									<Tab.List tw='-mb-px flex px-4 space-x-8'>
										{navigation.categories.map((category) => (
											<Tab
												key={category.name}
												className={({ selected }) =>
													classNames(
														selected ? 'text-sky-600 border-sky-600' : 'text-zinc-900 border-transparent',
														'flex-1 whitespace-nowrap py-4 px-1 border-b-2 text-base font-medium'
													)
												}>
												{category.name}
											</Tab>
										))}
									</Tab.List>
								</div>
								<Tab.Panels as={Fragment}>
									{navigation.categories.map((category) => (
										<Tab.Panel key={category.name} tw='px-4 py-6 space-y-12'>
											<div tw='grid grid-cols-2 gap-x-4 gap-y-10'>
												{category.featured.map((item) => (
													<div key={item.name} className='group relative'>
														<div tw='aspect-[1/1] rounded-md bg-zinc-100 overflow-hidden group-hover:opacity-75'>
															<img src={item.imageSrc} alt={item.imageAlt} tw='object-center object-cover' />
														</div>
														<a href={item.href} tw='mt-6 block text-sm font-medium text-zinc-900'>
															<span tw='absolute z-10 inset-0' aria-hidden='true' />
															{item.name}
														</a>
														<p aria-hidden='true' tw='mt-1 text-sm text-zinc-500'>
															Shop now
														</p>
													</div>
												))}
											</div>
										</Tab.Panel>
									))}
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
										<div className='group' tw='-ml-2 relative border-transparent rounded-md focus-within:ring-2 focus-within:ring-white'>
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
				<Fallback />
				<nav aria-label='Top'>
					<div tw='bg-zinc-900'>
						<div tw='max-w-7xl mx-auto h-10 px-4 flex items-center justify-between sm:px-6 lg:px-8'>
							<form>
								<div>
									<label htmlFor='desktop-currency' tw='sr-only'>
										Currency
									</label>
									<div className='group' tw='-ml-2  relative bg-zinc-900 border-transparent rounded-md focus-within:ring-2 focus-within:ring-white'>
										<select
											id='desktop-currency'
											name='currency'
											tw='bg-none bg-zinc-900 border-transparent rounded-md py-0.5 pl-2 pr-5 flex items-center text-sm font-medium text-white group-hover:text-zinc-100 focus:outline-none focus:ring-0 focus:border-transparent'>
											{currencies.map((currency) => (
												<option key={currency}>{currency}</option>
											))}
										</select>
										<div tw='absolute right-0 inset-y-0 flex items-center pointer-events-none'>
											<svg aria-hidden='true' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20' tw='w-5 h-5 text-zinc-300'>
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
											<Menu.Items className='origin-top-right absolute right-0 mt-0.5 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none'>
												<div className='px-4 py-3'>
													<p className='text-sm'>Signed in as</p>
													<p className='text-sm font-medium text-gray-900 truncate'>{UserData?.email}</p>
												</div>
												<div className='py-1'>
													<Menu.Item>
														{({ active }) => (
															<a href='#' className={classNames(active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm')}>
																Purchases
															</a>
														)}
													</Menu.Item>
													<Menu.Item>
														{({ active }) => (
															<a href='#' className={classNames(active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm')}>
																Friends
															</a>
														)}
													</Menu.Item>
													<Menu.Item>
														{({ active }) => (
															<a href='#' className={classNames(active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm')}>
																Settings
															</a>
														)}
													</Menu.Item>
												</div>
												{UserData?.group === 'user' ? (
													<div className='py-1'>
														<Menu.Item>
															{({ active }) => (
																<a href='#' className={classNames(active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm')}>
																	Become a seller
																</a>
															)}
														</Menu.Item>
													</div>
												) : (
													<div className='py-1'>
														<Menu.Item>
															{({ active }) => (
																<a href='#' className={classNames(active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm')}>
																	Resources
																</a>
															)}
														</Menu.Item>
														<Menu.Item>
															{({ active }) => (
																<a href='#' className={classNames(active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm')}>
																	Seller settings
																</a>
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
																	window.location.reload();
																}}
																className={classNames(
																	active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
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
										<Link to='/login' tw='text-sm font-medium text-white hover:text-zinc-200'>
											Sign in
										</Link>
										<Link to='/register' tw='text-sm font-medium text-white hover:text-zinc-200'>
											Create an account
										</Link>
									</Fragment>
								)}
							</div>
						</div>
					</div>

					<div
						tw='backdrop-blur-md backdrop-filter bg-opacity-20 bg-black transition-all'
						css={(!visible || window.location.pathname !== '/') && tw`bg-opacity-70 shadow-md`}>
						<div tw='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
							<div>
								<div tw='h-16 flex items-center justify-between'>
									{/* Logo (lg+) */}
									<div tw='hidden lg:flex-1 lg:flex lg:items-center'>
										<Link to='/' tw='font-bold text-zinc-100 hover:text-sky-300 transition'>
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
																	tw='relative z-10 flex items-center justify-center transition-colors ease-out duration-200 text-sm font-medium text-white drop-shadow-sm hover:text-sky-200 transition focus:outline-none'
																	css={open && tw`text-sky-300 hover:text-sky-300`}>
																	Marketplace
																	<span
																		className={classNames(
																			open ? 'bg-sky-300' : '',
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
																			{solutions.map((item) => (
																				<Popover.Button
																					as={Link}
																					key={item.name}
																					to={item.href}
																					className='-m-3 p-3 flex items-start rounded-lg hover:bg-gray-50 transition ease-in-out duration-150'>
																					<div className='flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-md bg-sky-500 text-white sm:h-12 sm:w-12'>
																						<item.icon className='h-6 w-6' aria-hidden='true' />
																					</div>
																					<div className='ml-4'>
																						<p className='text-base font-medium text-gray-900'>{item.name}</p>
																						<p className='mt-1 text-sm text-gray-500'>{item.description}</p>
																					</div>
																				</Popover.Button>
																			))}
																		</div>
																		{UserData?.group === 'seller' ? (
																			<div className='p-5 bg-gray-50 sm:p-8 grid grid-cols-2'>
																				<a
																					href='#'
																					className='-my-5 -ml-5 p-3 flow-root rounded-md hover:bg-gray-100 transition ease-in-out duration-150'>
																					<span className='flex items-center'>
																						<SupportIcon className='flex-shrink-0 h-6 w-6 text-gray-400' aria-hidden='true' />
																						<span className='ml-3 text-base font-medium text-gray-900'>Create resource</span>
																					</span>
																				</a>
																				<a
																					href='#'
																					className='-my-5 -mr-5 p-3 flow-root rounded-md hover:bg-gray-100 transition ease-in-out duration-150'>
																					<span className='flex items-center'>
																						<SupportIcon className='flex-shrink-0 h-6 w-6 text-gray-400' aria-hidden='true' />
																						<span className='ml-3 text-base font-medium text-gray-900'>Seller dashboard</span>
																						<span className='ml-3 inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium leading-5 bg-sky-100 text-sky-800'>
																							New
																						</span>
																					</span>
																				</a>
																			</div>
																		) : (
																			<div className='p-5 bg-gray-50 sm:p-8'>
																				<a href='#' className='-m-3 p-3 flow-root rounded-md hover:bg-gray-100 transition ease-in-out duration-150'>
																					<span className='flex items-center'>
																						<span className='text-base font-medium text-gray-900'>Custom requests</span>
																						<span className='ml-3 inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium leading-5 bg-sky-100 text-sky-800'>
																							New
																						</span>
																					</span>
																					<span className='mt-1 block text-sm text-gray-500'>
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
													<a
														key={page.name}
														href={page.href}
														tw='flex items-center text-sm font-medium text-white drop-shadow-sm hover:text-sky-200 transition'>
														{page.name}
													</a>
												))}
											</div>
										</Popover.Group>
									</div>

									{/* Mobile menu and search (lg-) */}
									<div tw='flex-1 flex items-center lg:hidden'>
										<button type='button' tw='-ml-2 p-2 text-white hover:text-sky-200 transition' onClick={() => setMobileMenuOpen(true)}>
											<span tw='sr-only'>Open menu</span>
											<MenuIcon tw='h-6 w-6' aria-hidden='true' />
										</button>

										{/* Search */}
										<a href='#' tw='ml-2 p-2 text-white hover:text-sky-200 transition'>
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
																'hidden text-sm font-medium lg:block hover:text-sky-200 transition'
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
																	<div className='relative grid gap-6 bg-white px-5 py-6 sm:gap-8 sm:p-8'>
																		{resources.map((item) => (
																			<a
																				key={item.name}
																				href={item.href}
																				className='-m-3 p-3 flex items-start rounded-lg hover:bg-gray-50 transition ease-in-out duration-150'>
																				<item.icon className='flex-shrink-0 h-6 w-6 text-sky-600' aria-hidden='true' />
																				<div className='ml-4'>
																					<p className='text-base font-medium text-gray-900'>{item.name}</p>
																					<p className='mt-1 text-sm text-gray-500'>{item.description}</p>
																				</div>
																			</a>
																		))}
																	</div>
																</div>
															</Popover.Panel>
														</Transition>
													</>
												)}
											</Popover>
											{/* Cart */}
											<div tw='ml-4 flow-root lg:ml-8'>
												<a href='#' className='group -m-2 p-2 flex items-center'>
													<ShoppingBagIcon tw='flex-shrink-0 h-6 w-6 text-white hover:text-sky-200 transition' aria-hidden='true' />
													<span tw='ml-2 text-sm font-medium text-white'>0</span>
													<span tw='sr-only'>items in cart, view bag</span>
												</a>
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
