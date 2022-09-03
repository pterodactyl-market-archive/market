import React, { useEffect, useState, Fragment } from 'react';

import tw from 'twin.macro';
import { Link } from 'react-router-dom';
import { classNames, isProduction, debounce } from '@/helpers';
import { Dialog, Popover, Tab, Transition } from '@headlessui/react';
import { PageContentBlock, Container, Pagination } from '@/components/elements/generic';
import { useStoreState } from 'easy-peasy';
import { store, ApplicationStore } from '@/state';
import { TruckIcon, KeyIcon, UserCircleIcon, TicketIcon, ShieldCheckIcon } from '@heroicons/react/outline';

const SettingsNavigation = () => {
	const [visible, setVisible] = useState(true);

	const handleScroll = debounce(() => {
		const currentScrollPos = window.pageYOffset;
		setVisible(currentScrollPos < 10);
	}, 5);

	useEffect(() => {
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, [visible, handleScroll]);

	const navigation = [
		{ name: 'Account', href: '/settings/account', icon: UserCircleIcon, current: false },
		{ name: 'Security', href: '/settings/security', icon: KeyIcon, current: true },
		{ name: 'Purchases', href: '/settings/account/purchases', icon: TruckIcon, current: false },
		{ name: 'Tickets', href: '/settings/account/tickets', icon: TicketIcon, current: false },
		{ name: 'Status', href: '/settings/status', icon: ShieldCheckIcon, current: false },
	];

	return (
		<aside tw='py-6 px-2 sm:px-6 xl:py-0 xl:px-0 xl:col-span-3'>
			<nav tw='space-y-1 xl:fixed xl:w-72 -mt-[2.5rem] xl:-mt-0' style={{ transition: 'top 0.6s', top: visible ? '9rem' : '6rem' }}>
				{navigation.map((item) => (
					<Link
						key={item.name}
						to={item.href}
						className={classNames(
							item.current ? 'bg-zinc-200/60 text-sky-700' : 'text-zinc-900 hover:text-zinc-900 hover:bg-zinc-200/60',
							'group rounded-md px-3 py-2 flex items-center text-sm font-medium'
						)}
						aria-current={item.current ? 'page' : undefined}>
						<item.icon
							className={classNames(
								item.current ? 'text-sky-500 group-hover:text-sky-500' : 'text-zinc-400 group-hover:text-zinc-500',
								'flex-shrink-0 -ml-1 mr-3 h-6 w-6'
							)}
							aria-hidden='true'
						/>
						<span tw='truncate'>{item.name}</span>
					</Link>
				))}
			</nav>
		</aside>
	);
};

const Security = (props: { title: string }) => {
	const UserData = useStoreState((state: ApplicationStore) => state.user.data);

	return (
		<PageContentBlock title={`${props.title}`}>
			<div tw='pt-36'>
				<div tw='max-w-7xl mx-auto px-2 sm:px-4 xl:px-8 '>
					<div tw='xl:grid xl:grid-cols-12 xl:gap-x-5'>
						<SettingsNavigation />
						<div tw='space-y-6 sm:px-6 xl:px-0 xl:col-span-9'>
							<form action='#' method='POST'>
								<div tw='shadow sm:rounded-md sm:overflow-hidden'>
									<div tw='bg-white py-6 px-4 space-y-6 sm:p-6'>
										<div>
											<h3 tw='text-lg leading-6 font-medium text-zinc-900'>Profile</h3>
											<p tw='mt-1 text-sm text-zinc-500'>This information will be displayed publicly so be careful what you share.</p>
										</div>

										<div tw='grid grid-cols-4 gap-6'>
											<div tw='col-span-4 sm:col-span-3'>
												<label htmlFor='company-website' tw='block text-sm font-medium text-zinc-700'>
													Username
												</label>
												<div tw='mt-1 rounded-md shadow-sm flex'>
													<span tw='bg-zinc-50 border border-r-0 border-zinc-300 rounded-l-md px-3 inline-flex items-center text-zinc-500 sm:text-sm'>
														@
													</span>
													<input
														type='text'
														name='username'
														id='username'
														autoComplete='username'
														tw='focus:ring-sky-500 focus:border-sky-500 flex-grow block w-full min-w-0 rounded-none rounded-r-md sm:text-sm border-zinc-300'
														defaultValue={UserData!.username}
													/>
												</div>
											</div>
											<div tw='flex-grow xl:mt-0 xl:ml-6 xl:flex-grow-0 xl:flex-shrink-0'>
												<p tw='text-sm font-medium text-gray-700' aria-hidden='true'>
													Avatar
												</p>
												<div tw='mt-1 xl:hidden'>
													<div tw='flex items-center'>
														<div tw='flex-shrink-0 inline-block rounded-full overflow-hidden h-12 w-12' aria-hidden='true'>
															<img tw='rounded-full h-full w-full' src={UserData!.profile.avatar} alt='' />
														</div>
														<div tw='ml-5 rounded-md shadow-sm'>
															<div
																className='group'
																tw='relative border border-gray-300 rounded-md py-2 px-3 flex items-center justify-center hover:bg-gray-50 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-sky-500'>
																<label htmlFor='mobile-user-photo' tw='relative text-sm leading-4 font-medium text-gray-700 pointer-events-none'>
																	<span>Change</span>
																	<span tw='sr-only'> user photo</span>
																</label>
																<input
																	id='mobile-user-photo'
																	name='user-photo'
																	type='file'
																	tw='absolute w-full h-full opacity-0 cursor-pointer border-gray-300 rounded-md'
																/>
															</div>
														</div>
													</div>
												</div>

												<div tw='hidden relative rounded-full overflow-hidden xl:block'>
													<img tw='relative rounded-full w-40 h-40' src={UserData!.profile.avatar} alt='' />
													<label
														htmlFor='desktop-user-photo'
														tw='absolute inset-0 w-full h-full bg-black bg-opacity-40 flex items-center justify-center text-sm font-semibold text-white opacity-0 hover:opacity-100 focus-within:opacity-100 w-40 h-40 rounded-full transition'>
														<span>Change</span>
														<span tw='sr-only'> user photo</span>
														<input
															type='file'
															id='desktop-user-photo'
															name='user-photo'
															tw='absolute inset-0 w-full h-full opacity-0 cursor-pointer border-gray-300 rounded-md'
														/>
													</label>
												</div>
											</div>
											<div tw='col-span-4 sm:col-span-3 xl:-mt-32 '>
												<label htmlFor='about' tw='block text-sm font-medium text-zinc-700'>
													About
												</label>
												<div tw='mt-1'>
													<textarea
														id='about'
														name='about'
														rows={3}
														tw='shadow-sm focus:ring-sky-500 focus:border-sky-500 mt-1 block w-full sm:text-sm border border-zinc-300 rounded-md'
														placeholder='Tell us a little bit about yourself'
														defaultValue={''}
													/>
												</div>
												<p tw='mt-2 text-sm text-zinc-500'>Brief description for your profile. URLs are hyperlinked.</p>
											</div>

											<div tw='col-span-4'>
												<div tw='grid grid-cols-2 gap-6'>
													<div tw='col-span-2 sm:col-span-1'>
														<label htmlFor='first-name' tw='block text-sm font-medium text-gray-700'>
															First name
														</label>
														<input
															type='text'
															name='first-name'
															id='first-name'
															autoComplete='given-name'
															tw='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm'
														/>
													</div>
													<div tw='col-span-2 sm:col-span-1'>
														<label htmlFor='last-name' tw='block text-sm font-medium text-gray-700'>
															Last name
														</label>
														<input
															type='text'
															name='last-name'
															id='last-name'
															autoComplete='family-name'
															tw='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm'
														/>
													</div>
												</div>
											</div>
											<div tw='col-span-4'>
												<label tw='block text-sm font-medium text-zinc-700'>Banner image</label>
												<div tw='mt-1 border-2 border-zinc-300 border-dashed rounded-md px-6 pt-5 pb-6 flex justify-center'>
													<div tw='space-y-1 text-center'>
														<svg tw='mx-auto h-12 w-12 text-zinc-400' stroke='currentColor' fill='none' viewBox='0 0 48 48' aria-hidden='true'>
															<path
																d='M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02'
																strokeWidth={2}
																strokeLinecap='round'
																strokeLinejoin='round'
															/>
														</svg>
														<div tw='flex text-sm text-zinc-600'>
															<label
																htmlFor='file-upload'
																tw='relative cursor-pointer bg-white rounded-md font-medium text-sky-600 hover:text-sky-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-sky-500'>
																<span>Upload a file</span>
																<input id='file-upload' name='file-upload' type='file' tw='sr-only' />
															</label>
															<p tw='pl-1'>or drag and drop</p>
														</div>
														<p tw='text-xs text-zinc-500'>PNG, JPG, GIF up to 10MB</p>
													</div>
												</div>
											</div>
										</div>
									</div>
									<div tw='px-4 py-3 bg-zinc-50 text-right sm:px-6'>
										<button
											type='submit'
											tw='bg-sky-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500'>
											Save
										</button>
									</div>
								</div>
							</form>

							<form action='#' method='POST'>
								<div tw='shadow sm:rounded-md sm:overflow-hidden'>
									<div tw='bg-white py-6 px-4 space-y-6 sm:p-6'>
										<div>
											<h3 tw='text-lg leading-6 font-medium text-zinc-900'>Notifications</h3>
											<p tw='mt-1 text-sm text-zinc-500'>Provides informtion and promotions to your set email.</p>
										</div>

										<fieldset>
											<legend tw='text-base font-medium text-zinc-900'>By Email</legend>
											<div tw='mt-4 space-y-4'>
												<div tw='flex items-start'>
													<div tw='h-5 flex items-center'>
														<input
															id='comments'
															name='comments'
															type='checkbox'
															tw='focus:ring-sky-500 h-4 w-4 text-sky-600 border-zinc-300 rounded'
														/>
													</div>
													<div tw='ml-3 text-sm'>
														<label htmlFor='comments' tw='font-medium text-zinc-700'>
															Comments
														</label>
														<p tw='text-zinc-500'>Get notified when someones posts a comment on a resource.</p>
													</div>
												</div>
												<div>
													<div tw='flex items-start'>
														<div tw='h-5 flex items-center'>
															<input
																id='candidates'
																name='candidates'
																type='checkbox'
																tw='focus:ring-sky-500 h-4 w-4 text-sky-600 border-zinc-300 rounded'
															/>
														</div>
														<div tw='ml-3 text-sm'>
															<label htmlFor='candidates' tw='font-medium text-zinc-700'>
																Support
															</label>
															<p tw='text-zinc-500'>Get notified when your support ticket gets updated.</p>
														</div>
													</div>
												</div>
												<div>
													<div tw='flex items-start'>
														<div tw='h-5 flex items-center'>
															<input id='offers' name='offers' type='checkbox' tw='focus:ring-sky-500 h-4 w-4 text-sky-600 border-zinc-300 rounded' />
														</div>
														<div tw='ml-3 text-sm'>
															<label htmlFor='offers' tw='font-medium text-zinc-700'>
																Offers
															</label>
															<p tw='text-zinc-500'>Get notified when a promotion or sale is occurring.</p>
														</div>
													</div>
												</div>
											</div>
										</fieldset>
									</div>
									<div tw='px-4 py-3 bg-zinc-50 text-right sm:px-6'>
										<button
											type='submit'
											tw='bg-sky-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-600'>
											Save
										</button>
									</div>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</PageContentBlock>
	);
};

export default Security;
