import React, { useEffect, useState, Fragment } from 'react';

import 'twin.macro';
import { fetchCollection } from '@/api/fetch';
import { Loader } from '@/components/elements/generic';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/solid';
import { PaginationProps, PaginatedResult, ResourceResult } from '#types/market';

const Pagination = (props: PaginationProps) => {
	const limit = props.limit || 15;

	const [resources, setResources] = useState<ResourceResult[]>([]);
	const [loaded, setLoaded] = useState(false);

	const [page, setPage] = useState(1);
	const [pages, setPages] = useState(0);
	const [totalResourceCount, setTotalResourceCount] = useState(0);
	const [resourceCount, setResourceCount] = useState(0);

	useEffect(() => {
		setLoaded(false);
		fetchCollection<PaginatedResult>(
			props.paginatedEndpoint,
			`?perPage=${limit}${props.category ? `&filter=(category='${props.category}')` : ''}&page=${page}&sort=-updated&expand=profile${
				props.customQuery ? props.customQuery : ''
			}`
		).then((data: any) => {
			setResources(data.items);
			setTotalResourceCount(data.totalItems);
			setResourceCount(data.items.length || 0);
			setPages(Math.ceil(data.totalItems / limit));
			setLoaded(true);
		});
	}, [page, props.category]);

	if (!loaded) {
		return <Loader />;
	}

	return (
		<Fragment>
			<div tw='grid sm:grid-cols-2 lg:grid-cols-4 gap-6 gap-y-8'>
				{resources?.map((data: ResourceResult, index: number) => (
					<props.render key={`${data.id}, ${index}`} data={data as never} />
				))}
			</div>
			<div tw='mt-6 pt-3 flex items-center justify-between border-t border-gray-200 dark:border-zinc-700'>
				<div tw='flex-1 flex justify-between sm:hidden'>
					<a
						href='#'
						onClick={() => {
							page !== 1 && setPage(page - 1);
						}}
						tw='relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white bg-opacity-80 hover:bg-zinc-50 hover:bg-opacity-100'>
						Previous
					</a>
					<a
						href='#'
						onClick={() => {
							page !== pages && setPage(page + 1);
						}}
						tw='ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white bg-opacity-80 hover:bg-zinc-50 hover:bg-opacity-100'>
						Next
					</a>
				</div>
				<div tw='hidden sm:flex-1 sm:flex sm:items-center sm:justify-between'>
					<div>
						<p tw='text-sm text-gray-700 dark:text-zinc-300'>
							Showing <span tw='font-medium'>{(page - 1) * limit + 1}</span> to{' '}
							<span tw='font-medium'> {pages === page ? limit * (page - 1) + resourceCount : resourceCount * page}</span>
							{page == pages ? (
								' results'
							) : (
								<Fragment>
									{' '}
									of <span tw='font-medium'>{totalResourceCount}</span> results
								</Fragment>
							)}
						</p>
					</div>
					<div>
						<nav tw='relative z-0 inline-flex rounded-md shadow-sm -space-x-px' aria-label='Pagination'>
							<button
								onClick={() => {
									page !== 1 && setPage(page - 1);
								}}
								tw='relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white bg-opacity-80 text-sm font-medium text-gray-500 hover:bg-zinc-50 hover:bg-opacity-100 dark:(bg-zinc-700 border-zinc-700 bg-opacity-50 hover:bg-opacity-5 hover:bg-zinc-800 text-zinc-500)'>
								<span tw='sr-only'>Previous</span>
								<ChevronLeftIcon tw='h-5 w-5' aria-hidden='true' />
							</button>
							{[...Array(pages)].map((x, i) => {
								if (pages > 10) {
									return null;
								} else {
									if (page == i + 1) {
										return (
											<button
												onClick={() => setPage(i + 1)}
												aria-current='page'
												tw='z-10 bg-sky-50 border-sky-50 text-sky-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium shadow rounded ring-1 ring-sky-400 dark:(bg-sky-500 border-sky-500 text-sky-100 ring-1 ring-sky-300)'>
												{i + 1}
											</button>
										);
									} else {
										return (
											<button
												onClick={() => setPage(i + 1)}
												tw='bg-white bg-opacity-80 border-gray-300 text-gray-500 hover:bg-zinc-50 hover:bg-opacity-100 relative inline-flex items-center px-4 py-2 border text-sm font-medium dark:(bg-zinc-700 border-zinc-700 bg-opacity-50 hover:bg-opacity-5 hover:bg-zinc-800 text-zinc-500)'>
												{i + 1}
											</button>
										);
									}
								}
							})}
							<button
								onClick={() => {
									page !== pages && setPage(page + 1);
								}}
								tw='relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white bg-opacity-80 text-sm font-medium text-gray-500 hover:bg-zinc-50 hover:bg-opacity-100 dark:(bg-zinc-700 border-zinc-700 bg-opacity-50 hover:bg-opacity-5 hover:bg-zinc-800 text-zinc-500)'>
								<span tw='sr-only'>Next</span>
								<ChevronRightIcon tw='h-5 w-5' aria-hidden='true' />
							</button>
						</nav>
					</div>
				</div>
			</div>
		</Fragment>
	);
};

export default Pagination;
