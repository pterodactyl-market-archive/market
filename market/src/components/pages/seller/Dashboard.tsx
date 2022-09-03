import React, { useEffect, useState, Fragment } from 'react';

import tw from 'twin.macro';
import { Link } from 'react-router-dom';
import { classNames, isProduction, debounce } from '@/helpers';
import { Menu, Popover, Transition } from '@headlessui/react';
import {
	AcademicCapIcon,
	BadgeCheckIcon,
	BellIcon,
	CashIcon,
	ClockIcon,
	MenuIcon,
	ReceiptRefundIcon,
	UsersIcon,
	XIcon,
	CloudIcon,
	SparklesIcon,
} from '@heroicons/react/outline';
import { SearchIcon, OfficeBuildingIcon, CheckCircleIcon, QuestionMarkCircleIcon } from '@heroicons/react/solid';
import { version } from '../../../../package.json';

const navigation = [
	{ name: 'Dashboard', href: '/seller/dashboard', current: true },
	{ name: 'Resources', href: '/seller/resources', current: false },
	{ name: 'Sales', href: '/seller/transactions', current: false },
	{ name: 'Tickets', href: '/seller/tickets', current: false },
	{ name: 'Docs', href: '/docs', current: false },
];

const cards = [
	{ name: 'Resource purchases', href: '#', icon: CloudIcon, amount: '2' },
	{ name: 'Total income', href: '#', icon: CashIcon, amount: '$40' },
	{ name: 'Average rating', href: '#', icon: SparklesIcon, amount: '4.5 stars' },
];

const userNavigation = [
	{ name: 'Your Profile', href: '#' },
	{ name: 'Settings', href: '#' },
	{ name: 'Sign out', href: '#' },
];

const stats = [
	{ label: 'Resources', value: 2 },
	{ label: 'Resource views', value: 4 },
	{ label: 'Unresolved messages', value: 1 },
];

const actions = [
	{
		icon: ClockIcon,
		name: 'Pending resources',
		href: '#',
		iconForeground: 'text-teal-700',
		iconBackground: 'bg-teal-50',
	},
	{
		icon: BadgeCheckIcon,
		name: 'Benefits',
		href: '#',
		iconForeground: 'text-purple-700',
		iconBackground: 'bg-purple-50',
	},
	{
		icon: UsersIcon,
		name: 'Contact support',
		href: '#',
		iconForeground: 'text-sky-700',
		iconBackground: 'bg-sky-50',
	},
	{ icon: CashIcon, name: 'Transactions', href: '#', iconForeground: 'text-yellow-700', iconBackground: 'bg-yellow-50' },
	{
		icon: ReceiptRefundIcon,
		name: 'Disputes',
		href: '#',
		iconForeground: 'text-rose-700',
		iconBackground: 'bg-rose-50',
	},
	{
		icon: AcademicCapIcon,
		name: 'Marketplace tips',
		href: '#',
		iconForeground: 'text-indigo-700',
		iconBackground: 'bg-indigo-50',
	},
];
const recentPurchases = [
	{
		id: 0,
		resource: 'A cool addon',
		price: 599,
		user: 'leonardkrasner',
		href: '#',
	},
	{
		id: 1,
		resource: 'A cool addon',
		price: 599,
		user: 'floydmiles',
		href: '#',
	},
	{
		id: 2,
		resource: 'A cool addon',
		price: 599,
		user: 'emilyselman',
		href: '#',
	},
	{
		id: 3,
		resource: 'Another cool addon',
		price: 999,
		user: 'kristinwatson',
		href: '#',
	},
];
const announcements = [
	{
		id: 1,
		title: 'New password policy',
		href: '#',
		preview:
			'Cum qui rem deleniti. Suscipit in dolor veritatis sequi aut. Vero ut earum quis deleniti. Ut a sunt eum cum ut repudiandae possimus. Nihil ex tempora neque cum consectetur dolores.',
	},
	{
		id: 2,
		title: 'New password policy',
		href: '#',
		preview:
			'Alias inventore ut autem optio voluptas et repellendus. Facere totam quaerat quam quo laudantium cumque eaque excepturi vel. Accusamus maxime ipsam reprehenderit rerum id repellendus rerum. Culpa cum vel natus. Est sit autem mollitia.',
	},
	{
		id: 3,
		title: 'New password policy',
		href: '#',
		preview:
			'Tenetur libero voluptatem rerum occaecati qui est molestiae exercitationem. Voluptate quisquam iure assumenda consequatur ex et recusandae. Alias consectetur voluptatibus. Accusamus a ab dicta et. Consequatur quis dignissimos voluptatem nisi.',
	},
];

import { PageContentBlock, Container, Pagination } from '@/components/elements/generic';
import { useStoreState } from 'easy-peasy';
import { store, ApplicationStore } from '@/state';

const Dashboard = (props: { title: string }) => {
	const UserData = useStoreState((state: ApplicationStore) => state.user.data);

	return (
		<PageContentBlock title={`${props.title}`}>
			<div tw='min-h-full'>
				<Popover as='header' tw='pb-24 bg-gradient-to-r from-sky-800 to-sky-600'>
					{({ open }) => (
						<>
							<div tw='max-w-3xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8'>
								<div tw='pb-8 pt-6 lg:p-0 relative flex flex-wrap items-center justify-center lg:justify-between'>
									{/* Logo */}
									<div tw='absolute left-0 py-5 flex-shrink-0 lg:static text-sky-100 font-bold text-2xl'>
										<Link to='/'>Pterodactyl Market</Link>
										<p tw='text-lg text-sky-200 font-semibold'>Seller Dashboard</p>
									</div>

									{/* Right section on desktop */}
									<div tw='hidden lg:ml-4 lg:flex lg:items-center lg:py-5 lg:pr-0.5'>
										<button
											type='button'
											tw='flex-shrink-0 p-1 text-sky-200 rounded-full hover:text-white hover:bg-white hover:bg-opacity-10 focus:outline-none focus:ring-2 focus:ring-white'>
											<span tw='sr-only'>View notifications</span>
											<BellIcon tw='h-6 w-6' aria-hidden='true' />
										</button>

										{/* Profile dropdown */}
										<Menu as='div' tw='ml-4 relative flex-shrink-0'>
											<div>
												<Menu.Button tw='bg-white rounded-full flex text-sm ring-2 ring-white ring-opacity-20 focus:outline-none focus:ring-opacity-100'>
													<span tw='sr-only'>Open user menu</span>
													<img tw='h-8 w-8 rounded-full' src={UserData!.profile.avatar} alt='' />
												</Menu.Button>
											</div>
											<Transition
												as={Fragment}
												leave='transition ease-in duration-75'
												leaveFrom='transform opacity-100 scale-100'
												leaveTo='transform opacity-0 scale-95'>
												<Menu.Items tw='origin-top-right z-40 absolute -right-2 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none'>
													{userNavigation.map((item) => (
														<Menu.Item key={item.name}>
															{({ active }) => (
																<a href={item.href} className={classNames(active ? 'bg-zinc-100' : '', 'block px-4 py-2 text-sm text-zinc-700')}>
																	{item.name}
																</a>
															)}
														</Menu.Item>
													))}
												</Menu.Items>
											</Transition>
										</Menu>
									</div>

									<div tw='w-full py-5 lg:border-t lg:border-white lg:border-opacity-20'>
										<div tw='lg:grid lg:grid-cols-3 lg:gap-8 lg:items-center'>
											{/* Left nav */}
											<div tw='hidden lg:block lg:col-span-2'>
												<nav tw='flex space-x-4'>
													{navigation.map((item) => (
														<a
															key={item.name}
															href={item.href}
															className={classNames(
																item.current ? 'text-white drop-shadow-sm' : 'text-sky-100',
																'text-sm font-medium rounded-md bg-white bg-opacity-0 px-3 py-2 hover:bg-opacity-10'
															)}
															aria-current={item.current ? 'page' : undefined}>
															{item.name}
														</a>
													))}
												</nav>
											</div>
										</div>
									</div>

									<div tw='absolute right-0 flex-shrink-0 lg:hidden'>
										<Popover.Button tw='bg-transparent p-2 rounded-md inline-flex items-center justify-center text-sky-200 hover:text-white hover:bg-white hover:bg-opacity-10 focus:outline-none focus:ring-2 focus:ring-white'>
											<span tw='sr-only'>Open main menu</span>
											{open ? <XIcon tw='block h-6 w-6' aria-hidden='true' /> : <MenuIcon tw='block h-6 w-6' aria-hidden='true' />}
										</Popover.Button>
									</div>
								</div>
							</div>

							<Transition.Root as={Fragment}>
								<div tw='lg:hidden'>
									<Transition.Child
										as={Fragment}
										enter='duration-150 ease-out'
										enterFrom='opacity-0'
										enterTo='opacity-100'
										leave='duration-150 ease-in'
										leaveFrom='opacity-100'
										leaveTo='opacity-0'>
										<Popover.Overlay tw='z-20 fixed inset-0 bg-black bg-opacity-25' />
									</Transition.Child>

									<Transition.Child
										as={Fragment}
										enter='duration-150 ease-out'
										enterFrom='opacity-0 scale-95'
										enterTo='opacity-100 scale-100'
										leave='duration-150 ease-in'
										leaveFrom='opacity-100 scale-100'
										leaveTo='opacity-0 scale-95'>
										<Popover.Panel focus tw='z-30 absolute top-0 inset-x-0 max-w-3xl mx-auto w-full p-2 transition transform origin-top'>
											<div tw='rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-white divide-y divide-zinc-200'>
												<div tw='pt-3 pb-2'>
													<div tw='flex items-center justify-between px-4'>
														<div>Pterodactyl Market</div>
														<div tw='-mr-2'>
															<Popover.Button tw='bg-white rounded-md p-2 inline-flex items-center justify-center text-zinc-400 hover:text-zinc-500 hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-sky-500'>
																<span tw='sr-only'>Close menu</span>
																<XIcon tw='h-6 w-6' aria-hidden='true' />
															</Popover.Button>
														</div>
													</div>
													<div tw='mt-3 px-2 space-y-1'>
														{navigation.map((item) => (
															<a
																key={item.name}
																href={item.href}
																tw='block rounded-md px-3 py-2 text-base text-zinc-900 font-medium hover:bg-zinc-100 hover:text-zinc-800'>
																{item.name}
															</a>
														))}
													</div>
												</div>
												<div tw='pt-4 pb-2'>
													<div tw='flex items-center px-5'>
														<div tw='flex-shrink-0'>
															<img tw='h-10 w-10 rounded-full' src={UserData!.profile.avatar} alt='' />
														</div>
														<div tw='ml-3 min-w-0 flex-1'>
															<div tw='text-base font-medium text-zinc-800 truncate'>{UserData!.username}</div>
															<div tw='text-sm font-medium text-zinc-500 truncate'>{UserData!.email}</div>
														</div>
														<button
															type='button'
															tw='ml-auto flex-shrink-0 bg-white p-1 text-zinc-400 rounded-full hover:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500'>
															<span tw='sr-only'>View notifications</span>
															<BellIcon tw='h-6 w-6' aria-hidden='true' />
														</button>
													</div>
													<div tw='mt-3 px-2 space-y-1'>
														{userNavigation.map((item) => (
															<a
																key={item.name}
																href={item.href}
																tw='block rounded-md px-3 py-2 text-base text-zinc-900 font-medium hover:bg-zinc-100 hover:text-zinc-800'>
																{item.name}
															</a>
														))}
													</div>
												</div>
											</div>
										</Popover.Panel>
									</Transition.Child>
								</div>
							</Transition.Root>
						</>
					)}
				</Popover>

				<main tw='-mt-24 pb-8'>
					<div tw='max-w-3xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8'>
						<h1 tw='sr-only'>Profile</h1>
						<div tw='grid grid-cols-1 gap-4 items-start lg:grid-cols-3 lg:gap-8'>
							<div tw='grid grid-cols-1 gap-4 lg:col-span-2'>
								<section aria-labelledby='profile-overview-title'>
									<div tw='rounded-lg bg-white overflow-hidden shadow'>
										<h2 tw='sr-only' id='profile-overview-title'>
											Profile Overview
										</h2>
										<div tw='bg-white p-6'>
											<div tw='sm:flex sm:items-center sm:justify-between'>
												<div tw='sm:flex sm:space-x-5'>
													<div tw='flex-shrink-0'>
														<img tw='mx-auto h-20 w-20 rounded-full' src={UserData!.profile.avatar} alt='' />
													</div>
													<div tw='mt-4 text-center sm:mt-0 sm:pt-1 sm:text-left'>
														<p tw='text-sm font-medium text-zinc-600'>Welcome back,</p>
														<p tw='text-xl font-bold text-zinc-900 sm:text-2xl'>{UserData!.username}</p>
														<dl className='mt-6 flex flex-col sm:mt-1 sm:flex-row sm:flex-wrap'>
															<dt className='sr-only'>Company</dt>
															<dd className='flex items-center text-sm text-zinc-500 font-medium capitalize sm:mr-6'>
																<OfficeBuildingIcon className='flex-shrink-0 mr-1.5 h-5 w-5 text-zinc-400' aria-hidden='true' />
																Gamespeed LTD
															</dd>
															<dt className='sr-only'>Account status</dt>
															{UserData!.seller.sellerStatus === 'verified' ? (
																<dd className='mt-3 flex items-center text-sm text-zinc-500 font-medium sm:mr-6 sm:mt-0 capitalize'>
																	<CheckCircleIcon className='flex-shrink-0 mr-1.5 h-5 w-5 text-green-400' aria-hidden='true' />
																	Verified seller
																</dd>
															) : (
																<dd className='mt-3 flex items-center text-sm text-zinc-500 font-medium sm:mr-6 sm:mt-0 capitalize'>
																	<QuestionMarkCircleIcon className='flex-shrink-0 mr-1.5 h-5 w-5 text-amber-400' aria-hidden='true' />
																	Normal seller
																</dd>
															)}
														</dl>
													</div>
												</div>
												<div tw='mt-5 flex justify-center sm:mt-0'>
													<Link
														to='/profile/theMackabu'
														tw='flex justify-center items-center px-4 py-2 border border-zinc-300 shadow-sm text-sm font-medium rounded-md text-zinc-700 bg-white hover:bg-zinc-50 mr-1 transition'>
														View profile
													</Link>
													<Link
														to='/settings/account'
														tw='flex justify-center items-center px-4 py-2 border border-sky-700 hover:border-sky-800 shadow-sm text-sm font-medium rounded-md text-sky-50 bg-sky-600 hover:bg-sky-700 ml-1 transition'>
														Edit account
													</Link>
												</div>
											</div>
										</div>
										<div tw='border-t border-zinc-200 bg-zinc-50 grid grid-cols-1 divide-y divide-zinc-200 sm:grid-cols-3 sm:divide-y-0 sm:divide-x'>
											{stats.map((stat) => (
												<div key={stat.label} tw='px-6 py-5 text-sm font-medium text-center'>
													<span tw='text-zinc-900'>{stat.value}</span> <span tw='text-zinc-600'>{stat.label}</span>
												</div>
											))}
										</div>
									</div>
								</section>

								<h2 className='mt-2 text-lg leading-6 font-medium text-zinc-900'>Overview</h2>
								<div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3'>
									{cards.map((card) => (
										<div key={card.name} className='bg-white overflow-hidden shadow rounded-lg'>
											<div className='p-5'>
												<div className='flex items-center'>
													<div className='flex-shrink-0'>
														<card.icon className='h-6 w-6 text-zinc-400' aria-hidden='true' />
													</div>
													<div className='ml-5 w-0 flex-1'>
														<dl>
															<dt className='text-sm font-medium text-zinc-500 truncate'>{card.name}</dt>
															<dd>
																<div className='text-lg font-medium text-zinc-900'>{card.amount}</div>
															</dd>
														</dl>
													</div>
												</div>
											</div>
											<div className='bg-zinc-50 px-5 py-3'>
												<div className='text-sm'>
													<a href={card.href} className='font-medium text-sky-700 hover:text-sky-900'>
														View all
													</a>
												</div>
											</div>
										</div>
									))}
								</div>

								<h2 className='mt-2 text-lg leading-6 font-medium text-zinc-900'>Quick Links</h2>
								<section aria-labelledby='quick-links-title'>
									<div tw='rounded-lg bg-zinc-200 overflow-hidden shadow divide-y divide-zinc-200 sm:divide-y-0 sm:grid sm:grid-cols-2 sm:gap-px'>
										<h2 tw='sr-only' id='quick-links-title'>
											Quick links
										</h2>
										{actions.map((action, actionIdx) => (
											<div
												key={action.name}
												className={classNames(
													actionIdx === 0 ? 'rounded-tl-lg rounded-tr-lg sm:rounded-tr-none' : '',
													actionIdx === 1 ? 'sm:rounded-tr-lg' : '',
													actionIdx === actions.length - 2 ? 'sm:rounded-bl-lg' : '',
													actionIdx === actions.length - 1 ? 'rounded-bl-lg rounded-br-lg sm:rounded-bl-none' : '',
													'relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-sky-500'
												)}>
												<div>
													<span className={classNames(action.iconBackground, action.iconForeground, 'rounded-lg inline-flex p-3 ring-4 ring-white')}>
														<action.icon tw='h-6 w-6' aria-hidden='true' />
													</span>
												</div>
												<div tw='mt-8'>
													<h3 tw='text-lg font-medium'>
														<a href={action.href} tw='focus:outline-none'>
															{/* Extend touch target to entire panel */}
															<span tw='absolute inset-0' aria-hidden='true' />
															{action.name}
														</a>
													</h3>
													<p tw='mt-2 text-sm text-zinc-500'>
														Doloribus dolores nostrum quia qui natus officia quod et dolorem. Sit repellendus qui ut at blanditiis et quo et
														molestiae.
													</p>
												</div>
												<span tw='pointer-events-none absolute top-6 right-6 text-zinc-300 group-hover:text-zinc-400' aria-hidden='true'>
													<svg tw='h-6 w-6' xmlns='http://www.w3.org/2000/svg' fill='currentColor' viewBox='0 0 24 24'>
														<path d='M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z' />
													</svg>
												</span>
											</div>
										))}
									</div>
								</section>
							</div>

							{/* Right column */}
							<div tw='grid grid-cols-1 gap-4'>
								{/* Announcements */}
								<section aria-labelledby='announcements-title'>
									<div tw='rounded-lg bg-white overflow-hidden shadow'>
										<div tw='p-6'>
											<h2 tw='text-base font-medium text-zinc-900' id='announcements-title'>
												Announcements
											</h2>
											<div tw='flow-root mt-6'>
												<ul role='list' tw='-my-5 divide-y divide-zinc-200'>
													{announcements.map((announcement) => (
														<li key={announcement.id} tw='py-5'>
															<div tw='relative focus-within:ring-2 focus-within:ring-sky-500'>
																<h3 tw='text-sm font-semibold text-zinc-800'>
																	<a href={announcement.href} tw='hover:underline focus:outline-none'>
																		{/* Extend touch target to entire panel */}
																		<span tw='absolute inset-0' aria-hidden='true' />
																		{announcement.title}
																	</a>
																</h3>
																<p tw='mt-1 text-sm text-zinc-600 line-clamp-2'>{announcement.preview}</p>
															</div>
														</li>
													))}
												</ul>
											</div>
											<div tw='mt-6'>
												<a
													href='#'
													tw='w-full flex justify-center items-center px-4 py-2 border border-zinc-300 shadow-sm text-sm font-medium rounded-md text-zinc-700 bg-white hover:bg-zinc-50'>
													View all
												</a>
											</div>
										</div>
									</div>
								</section>

								<section aria-labelledby='recent-purchases-title'>
									<div tw='rounded-lg bg-white overflow-hidden shadow'>
										<div tw='p-6'>
											<h2 tw='text-base font-medium text-zinc-900' id='recent-purchases-title'>
												Recent Purchases
											</h2>
											<div tw='flow-root mt-6'>
												<ul role='list' tw='-my-5 divide-y divide-zinc-200'>
													{recentPurchases.map((purchase) => (
														<li key={purchase.id} tw='py-4'>
															<div tw='flex items-center space-x-4'>
																<div tw='flex-1 min-w-0'>
																	<p tw='text-sm font-medium text-zinc-900 truncate'>
																		{purchase.resource} <span tw='text-emerald-600'>${Number((purchase.price / 100).toFixed(2))}</span>
																	</p>
																	<p tw='text-sm text-zinc-500 truncate'>{'@' + purchase.user} purchased</p>
																</div>
																<div>
																	<a
																		href={purchase.href}
																		tw='inline-flex items-center shadow-sm px-2.5 py-0.5 border border-zinc-300 text-sm leading-5 font-medium rounded-full text-zinc-700 bg-white hover:bg-zinc-50'>
																		View
																	</a>
																</div>
															</div>
														</li>
													))}
												</ul>
											</div>
											<div tw='mt-6'>
												<a
													href='#'
													tw='w-full flex justify-center items-center px-4 py-2 border border-zinc-300 shadow-sm text-sm font-medium rounded-md text-zinc-700 bg-white hover:bg-zinc-50'>
													View all
												</a>
											</div>
										</div>
									</div>
								</section>
							</div>
						</div>
					</div>
				</main>
				<footer>
					<div tw='max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 lg:max-w-7xl'>
						<div tw='border-t border-zinc-200 py-8 text-sm text-zinc-500 text-center sm:text-left'>
							<span tw='block sm:inline'>
								&copy; {new Date().getUTCFullYear()} Pterodactyl Market v{version}. All Rights Reserved.
							</span>
						</div>
					</div>
				</footer>
			</div>
		</PageContentBlock>
	);
};

export default Dashboard;
