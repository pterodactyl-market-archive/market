import React, { useEffect, useState, Fragment } from 'react';

import tw from 'twin.macro';
import { classNames } from '@/helpers';
import { Link, useParams } from 'react-router-dom';
import { ResourceCard } from '@/components/elements/market';
import { PageContentBlock, Pagination } from '@/components/elements/generic';
import { Dialog, Disclosure, Menu, Popover, Tab, Transition } from '@headlessui/react';
import { XIcon } from '@heroicons/react/outline';
import { ChevronDownIcon } from '@heroicons/react/solid';

const sortOptions = [
	{ name: 'Latest Updated', href: '#', current: true },
	{ name: 'Most Popular', href: '#', current: false },
	{ name: 'Best Rating', href: '#', current: false },
	{ name: 'Price: Low to High', href: '#', current: false },
	{ name: 'Price: High to Low', href: '#', current: false },
];

const filters = [
	{
		id: 'category',
		name: 'Category',
		options: [
			{ value: 'paid', label: 'Paid', checked: false },
			{ value: 'free', label: 'Free', checked: false },
		],
	},
];

const Footer = (props: { title: string }) => {
	const { id } = useParams();
	const [activeFilters, setActiveFilter] = useState([] as any);
	const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

	return (
		<PageContentBlock title={`${props.title}: ${id}`}>
			{/* Mobile filter dialog */}
			<Transition.Root show={mobileFiltersOpen} as={Fragment}>
				<Dialog as='div' tw='fixed inset-0 flex z-40 sm:hidden' onClose={setMobileFiltersOpen}>
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
						enterFrom='translate-x-full'
						enterTo='translate-x-0'
						leave='transition ease-in-out duration-300 transform'
						leaveFrom='translate-x-0'
						leaveTo='translate-x-full'>
						<div tw='ml-auto relative max-w-xs w-full h-full bg-white shadow-xl py-4 pb-12 flex flex-col overflow-y-auto'>
							<div tw='px-4 flex items-center justify-between'>
								<h2 tw='text-lg font-medium text-zinc-900'>Filters</h2>
								<button
									type='button'
									tw='-mr-2 w-10 h-10 bg-white p-2 rounded-md flex items-center justify-center text-zinc-400'
									onClick={() => setMobileFiltersOpen(false)}>
									<span tw='sr-only'>Close menu</span>
									<XIcon tw='h-6 w-6' aria-hidden='true' />
								</button>
							</div>

							{/* Filters */}
							<form tw='mt-4'>
								{filters.map((section) => (
									<Disclosure as='div' key={section.name} tw='border-t border-zinc-200 px-4 py-6'>
										{({ open }) => (
											<>
												<h3 tw='-mx-2 -my-3 flow-root'>
													<Disclosure.Button tw='px-2 py-3 bg-white w-full flex items-center justify-between text-sm text-zinc-400'>
														<span tw='font-medium text-zinc-900'>{section.name}</span>
														<span tw='ml-6 flex items-center'>
															<ChevronDownIcon className={classNames(open ? '-rotate-180' : 'rotate-0', 'h-5 w-5 transform')} aria-hidden='true' />
														</span>
													</Disclosure.Button>
												</h3>
												<Disclosure.Panel tw='pt-6'>
													<div tw='space-y-6'>
														{section.options.map((option, optionIdx) => (
															<div key={option.value} tw='flex items-center'>
																<input
																	id={`filter-mobile-${section.id}-${optionIdx}`}
																	name={`${section.id}[]`}
																	defaultValue={option.value}
																	type='checkbox'
																	defaultChecked={option.checked}
																	tw='h-4 w-4 border-zinc-300 rounded text-sky-600 focus:ring-sky-500'
																/>
																<label htmlFor={`filter-mobile-${section.id}-${optionIdx}`} tw='ml-3 text-sm text-zinc-500'>
																	{option.label} {id}
																</label>
															</div>
														))}
													</div>
												</Disclosure.Panel>
											</>
										)}
									</Disclosure>
								))}
							</form>
						</div>
					</Transition.Child>
				</Dialog>
			</Transition.Root>

			<main>
				<div tw='bg-white pt-16'>
					<div tw='max-w-7xl mx-auto pt-16 pb-6 px-4 sm:px-6 lg:px-8'>
						<span tw='mb-2 max-w-xl text-sm text-zinc-700'>Marketplace</span>
						<h1 tw='text-3xl font-extrabold tracking-tight text-zinc-900 capitalize'>{id}</h1>
					</div>
				</div>
				<section aria-labelledby='filter-heading'>
					<h2 id='filter-heading' tw='sr-only'>
						Filters
					</h2>

					<div tw='relative z-10 bg-white border-b border-zinc-200 pb-4'>
						<div tw='max-w-7xl mx-auto px-4 flex items-center justify-between sm:px-6 lg:px-8'>
							<Menu as='div' className='relative inline-block text-left'>
								<div>
									<Menu.Button className='group inline-flex justify-center text-sm font-medium text-zinc-700 hover:text-zinc-900'>
										Sort
										<ChevronDownIcon tw='flex-shrink-0 -mr-1 ml-1 h-5 w-5 text-zinc-400 group-hover:text-zinc-500' aria-hidden='true' />
									</Menu.Button>
								</div>

								<Transition
									as={Fragment}
									enter='transition ease-out duration-100'
									enterFrom='transform opacity-0 scale-95'
									enterTo='transform opacity-100 scale-100'
									leave='transition ease-in duration-75'
									leaveFrom='transform opacity-100 scale-100'
									leaveTo='transform opacity-0 scale-95'>
									<Menu.Items tw='origin-top-left absolute left-0 mt-2 w-40 rounded-md shadow-2xl bg-white ring-1 ring-black ring-opacity-5 focus:outline-none'>
										<div tw='py-1'>
											{sortOptions.map((option) => (
												<Menu.Item key={option.name}>
													{({ active }) => (
														<a
															href={option.href}
															className={classNames(
																option.current ? 'font-medium text-zinc-900' : 'text-zinc-500',
																active ? 'bg-zinc-100' : '',
																'block px-4 py-2 text-sm'
															)}>
															{option.name}
														</a>
													)}
												</Menu.Item>
											))}
										</div>
									</Menu.Items>
								</Transition>
							</Menu>

							<button
								type='button'
								tw='inline-block text-sm font-medium text-zinc-700 hover:text-zinc-900 sm:hidden'
								onClick={() => setMobileFiltersOpen(true)}>
								Filters
							</button>

							<div tw='hidden sm:block'>
								<div tw='flow-root'>
									<Popover.Group tw='-mx-4 flex items-center divide-x divide-zinc-200'>
										{filters.map((section, sectionIdx) => (
											<Popover key={section.name} tw='px-4 relative inline-block text-left'>
												<Popover.Button className='group inline-flex justify-center text-sm font-medium text-zinc-700 hover:text-zinc-900'>
													<span>{section.name}</span>
													{sectionIdx === 0 ? (
														<span tw='ml-1.5 rounded py-0.5 px-1.5 bg-zinc-200 text-xs font-semibold text-zinc-700 tabular-nums'>1</span>
													) : null}
													<ChevronDownIcon tw='flex-shrink-0 -mr-1 ml-1 h-5 w-5 text-zinc-400 group-hover:text-zinc-500' aria-hidden='true' />
												</Popover.Button>

												<Transition
													as={Fragment}
													enter='transition ease-out duration-100'
													enterFrom='transform opacity-0 scale-95'
													enterTo='transform opacity-100 scale-100'
													leave='transition ease-in duration-75'
													leaveFrom='transform opacity-100 scale-100'
													leaveTo='transform opacity-0 scale-95'>
													<Popover.Panel tw='origin-top-right absolute right-0 mt-2 bg-white rounded-md shadow-2xl p-4 ring-1 ring-black ring-opacity-5 focus:outline-none'>
														<form tw='space-y-4'>
															{section.options.map((option, optionIdx) => (
																<div key={option.value} tw='flex items-center'>
																	<input
																		id={`filter-${section.id}-${optionIdx}`}
																		name={`${section.id}[]`}
																		defaultValue={option.value}
																		type='checkbox'
																		defaultChecked={option.checked}
																		tw='h-4 w-4 border-zinc-300 rounded text-sky-600 focus:ring-sky-500'
																	/>
																	<label
																		htmlFor={`filter-${section.id}-${optionIdx}`}
																		tw='ml-3 pr-6 text-sm font-medium text-zinc-900 whitespace-nowrap'>
																		{option.label}
																	</label>
																</div>
															))}
														</form>
													</Popover.Panel>
												</Transition>
											</Popover>
										))}
									</Popover.Group>
								</div>
							</div>
						</div>
					</div>

					{/* Active filters */}
					<div tw='bg-zinc-100'>
						<div tw='max-w-7xl mx-auto py-3 px-4 sm:flex sm:items-center sm:px-6 lg:px-8'>
							<h3 tw='text-xs font-semibold uppercase tracking-wide text-zinc-500'>
								Filters
								<span tw='sr-only'>, active</span>
							</h3>

							<div aria-hidden='true' tw='hidden w-px h-5 bg-zinc-300 sm:block sm:ml-4' />

							<div tw='mt-2 sm:mt-0 sm:ml-4'>
								<div tw='-m-1 flex flex-wrap items-center'>
									{activeFilters.length > 0 &&
										activeFilters.map((activeFilter: any) => (
											<span
												key={activeFilter?.value}
												tw='m-1 inline-flex rounded-full border border-zinc-200 items-center py-1.5 pl-3 pr-2 text-sm font-medium bg-white text-zinc-900'>
												<span>{activeFilter?.label}</span>
												<button
													type='button'
													tw='flex-shrink-0 ml-1 h-4 w-4 p-1 rounded-full inline-flex text-zinc-400 hover:bg-zinc-200 hover:text-zinc-500'>
													<span tw='sr-only'>Remove filter for {activeFilter?.label}</span>
													<svg tw='h-2 w-2' stroke='currentColor' fill='none' viewBox='0 0 8 8'>
														<path strokeLinecap='round' strokeWidth='1.5' d='M1 1l6 6m0-6L1 7' />
													</svg>
												</button>
											</span>
										))}
								</div>
							</div>
						</div>
					</div>
				</section>
				<div tw='bg-zinc-50'>
					<section aria-labelledby='products-heading' tw='max-w-2xl mx-auto pt-8 pb-8 px-4 sm:px-6 lg:max-w-7xl lg:px-8'>
						<Pagination paginatedEndpoint='resources' category={id} render={ResourceCard} />
					</section>
				</div>
			</main>
		</PageContentBlock>
	);
};
export default Footer;
