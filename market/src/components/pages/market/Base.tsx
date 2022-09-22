import React, { useEffect, useState, Fragment } from 'react';

import tw from 'twin.macro';
import { Hero, ResourceCard } from '@/components/elements/market';
import { PageContentBlock, Container, Pagination } from '@/components/elements/generic';
import { Dialog, Popover, Tab, Transition } from '@headlessui/react';
import {
	CreditCardIcon,
	ShieldCheckIcon,
	MenuIcon,
	QuestionMarkCircleIcon,
	SearchIcon,
	LightningBoltIcon,
	CodeIcon,
	ShoppingBagIcon,
	XIcon,
} from '@heroicons/react/outline';
import { classNames, isProduction } from '@/helpers';
import { Link } from 'react-router-dom';
import { HeroBackground } from '@/assets/images';
import { PaginationProps, PaginatedResult, ResourceResult } from '#types/market';
import { fetchCollection } from '@/api/fetch';

const testimonials = [
	{
		id: 1,
		quote:
			'This site is perfect for selling my addons. The notice system is well done, no false notices are present. As a customer and seller I highly recommend Pterodactyl Market',
		attribution: 'Bagou450',
	},
	{
		id: 2,
		quote:
			'This site is perfect for selling my addons. The notice system is well done, no false notices are present. As a customer and seller I highly recommend Pterodactyl Market',
		attribution: 'Bagou450',
	},
	{
		id: 3,
		quote:
			'This site is perfect for selling my addons. The notice system is well done, no false notices are present. As a customer and seller I highly recommend Pterodactyl Market',
		attribution: 'Bagou450',
	},
];

const features = [
	{
		name: 'Competitive rates',
		color: 'bg-green-500',
		description: 'Consequuntur omnis dicta cumque, inventore atque ab dolores aspernatur tempora ab doloremque.',
		icon: CreditCardIcon,
	},
	{
		name: 'Curated content',
		color: 'bg-blue-500',
		description: `Our team of developers code reviews all content to the best of our ability before it's available to the general public.`,
		icon: ShieldCheckIcon,
	},
	{
		name: 'Reliable Platform',
		color: 'bg-amber-500',
		description: 'Uptime, security and speed are things we take very seriously, our systems are internally audited often to ensure peace of mind.',
		icon: LightningBoltIcon,
	},
	{
		name: 'Constantly Developing',
		color: 'bg-rose-500',
		description: `We're constantly taking in suggestions and developing new features, our goal is to have a platform where all users are satisfied.`,
		icon: CodeIcon,
	},
];

const categories = [
	{
		name: 'Themes',
		href: '#',
		imageSrc: 'https://source.boringavatars.com/marble/512/?square',
	},
	{
		name: 'Addons',
		href: '#',
		imageSrc: 'https://source.boringavatars.com/pixel/512/?square',
	},
	{
		name: 'Eggs',
		href: '#',
		imageSrc: 'https://source.boringavatars.com/sunset/512/?square',
	},
	{
		name: 'Services',
		href: '#',
		imageSrc: 'https://source.boringavatars.com/bauhaus/512/?square',
	},
];

const Base = (props: { title: string }) => {
	const [resources, setResources] = useState<ResourceResult[]>([]);
	const [loaded, setLoaded] = useState(false);

	const [resourceCount, setResourceCount] = useState(0);
	const [sellerCount, setSellerCount] = useState(0);
	const [salesCount, setSalesCount] = useState(0);

	useEffect(() => {
		setLoaded(false);
		Promise.all([
			fetchCollection<PaginatedResult>('resources', `?perPage=4&sort=-updated&expand=profile`).then((data: any) => {
				setResources(data.items);
				setResourceCount(data.totalItems);
			}),
			fetchCollection<PaginatedResult>('profiles', `?perPage=1&filter=(group=%27seller%27)`).then((data: any) => {
				setSellerCount(data.totalItems);
			}),
			fetchCollection<PaginatedResult>('purchases', '?perPage=1').then((data: any) => {
				setSalesCount(data.totalItems);
			}),
		]).then(() => setLoaded(true));
	}, []);

	return (
		<PageContentBlock title={`${props.title}`}>
			<div tw='bg-white'>
				<div tw='relative bg-zinc-900'>
					<div aria-hidden='true' tw='absolute inset-0 overflow-hidden'>
						<img src={HeroBackground} alt='' tw='w-full h-full object-center object-cover' />
					</div>
					<div aria-hidden='true' tw='absolute inset-0 bg-zinc-900 opacity-70' />
					<div tw='relative max-w-3xl mx-auto pb-16 pt-36 px-6 flex flex-col items-center text-center'>
						<Link
							to='/blog/release'
							tw='inline-flex justify-between items-center py-1 px-1 pr-4 mb-6 text-sm text-zinc-300 backdrop-blur-sm backdrop-filter bg-opacity-10 bg-white rounded-full hover:bg-zinc-50 transition hover:bg-opacity-20'>
							<span tw='text-xs bg-sky-600 rounded-full text-white px-4 py-1.5 mr-3 backdrop-blur-sm backdrop-filter bg-opacity-90'>Release</span>
							<span tw='text-sm font-medium'>Read our blog post</span>
							<svg tw='ml-2 w-5 h-5' fill='currentColor' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'>
								<path
									fillRule='evenodd'
									d='M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z'
									clipRule='evenodd'></path>
							</svg>
						</Link>
						<h1 tw='text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-sky-500 lg:text-6xl drop-shadow pb-1'>
							Pterodactyl Market
						</h1>
						<p tw='mt-3 text-xl text-white'>
							Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
							minim veniam.
						</p>
					</div>
				</div>
				<main>
					<div className='bg-zinc-50 overflow-hidden'>
						<div className='relative max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8'>
							<svg
								className='absolute top-0 left-full transform -translate-x-1/2 -translate-y-3/4 lg:left-auto lg:right-full lg:translate-x-2/3 lg:translate-y-1/4'
								width={404}
								height={784}
								fill='none'
								viewBox='0 0 404 784'
								aria-hidden='true'>
								<defs>
									<pattern id='8b1b5f72-e944-4457-af67-0c6d15a99f38' x={0} y={0} width={20} height={20} patternUnits='userSpaceOnUse'>
										<rect x={0} y={0} width={4} height={4} className='text-zinc-200' fill='currentColor' />
									</pattern>
								</defs>
								<rect width={404} height={784} fill='url(#8b1b5f72-e944-4457-af67-0c6d15a99f38)' />
							</svg>
							<div className='relative lg:grid lg:grid-cols-3 lg:gap-x-8'>
								<div className='lg:col-span-1'>
									<h2 className='text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl'>Consumer Friendly</h2>
									<h2 className='text-3xl font-medium tracking-tight text-zinc-600 sm:text-4xl'>
										Our goal is to create the gold standard for marketplaces.
									</h2>
								</div>
								<dl className='mt-10 space-y-10 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-x-8 sm:gap-y-10 lg:mt-0 lg:col-span-2'>
									{features.map((feature) => (
										<div key={feature.name}>
											<dt>
												<div className={`flex items-center justify-center h-12 w-12 rounded-md text-white ${feature.color}`}>
													<feature.icon className='h-6 w-6' aria-hidden='true' />
												</div>
												<p className='mt-5 text-lg leading-6 font-medium text-zinc-900'>{feature.name}</p>
											</dt>
											<dd className='mt-2 text-base text-zinc-500'>{feature.description}</dd>
										</div>
									))}
								</dl>
							</div>
						</div>
					</div>
					<div className='bg-zinc-50 pt-12 sm:pt-16'>
						<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
							<div className='max-w-4xl mx-auto text-center'>
								<h2 className='text-3xl font-extrabold text-zinc-900 sm:text-4xl'>Trusted by developers from around the world</h2>
								<p className='mt-3 text-xl text-zinc-500 sm:mt-4'>
									Lorem ipsum dolor, sit amet consectetur adipisicing elit. Repellendus repellat laudantium.
								</p>
							</div>
						</div>
						<div className='mt-10 pb-12 bg-white sm:pb-16'>
							<div className='relative'>
								<div className='absolute inset-0 h-1/2 bg-zinc-50' />
								<div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
									<div className='max-w-4xl mx-auto'>
										<dl className='rounded-lg bg-white shadow-sm border border-zinc-200 sm:grid sm:grid-cols-3'>
											<div className='flex flex-col border-b border-zinc-100 p-6 text-center sm:border-0 sm:border-r'>
												<dt className='order-2 mt-2 text-lg leading-6 font-medium text-zinc-500'>Resources</dt>
												<dd className='order-1 text-5xl font-extrabold text-sky-500'>{resourceCount.toLocaleString('en-US')}</dd>
											</div>
											<div className='flex flex-col border-t border-b border-zinc-100 p-6 text-center sm:border-0 sm:border-l sm:border-r'>
												<dt className='order-2 mt-2 text-lg leading-6 font-medium text-zinc-500'>Sellers</dt>
												<dd className='order-1 text-5xl font-extrabold text-blue-500'>{sellerCount.toLocaleString('en-US')}</dd>
											</div>
											<div className='flex flex-col border-t border-zinc-100 p-6 text-center sm:border-0 sm:border-l'>
												<dt className='order-2 mt-2 text-lg leading-6 font-medium text-zinc-500'>Purchases</dt>
												<dd className='order-1 text-5xl font-extrabold text-lime-500'>{salesCount.toLocaleString('en-US')}</dd>
											</div>
										</dl>
									</div>
								</div>
							</div>
						</div>
					</div>

					{resources.length > 0 && (
						<section aria-labelledby='latest-heading'>
							<div className='-mb-3 -mt-4 px-4 sm:px-6 lg:py-10 lg:px-8 xl:max-w-7xl xl:mx-auto'>
								<div className='md:flex md:items-center md:justify-between'>
									<h2 id='favorites-heading' className='text-2xl font-extrabold tracking-tight text-zinc-900'>
										Latest Content
									</h2>
									<a href='#' className='hidden text-sm font-medium text-sky-600 hover:text-sky-500 md:block'>
										Browse everything
										<span aria-hidden='true'> &rarr;</span>
									</a>
								</div>
								<div tw='mt-4 flow-root'>
									<div tw='-my-2'>
										<div tw='-mx-4 sm:-mx-6 lg:-mx-8 xl:mx-0 box-content py-2 relative h-[19rem] xl:h-auto overflow-x-auto xl:overflow-visible'>
											<div tw='absolute min-w-0 px-4 flex space-x-8 sm:px-6 lg:px-8 xl:relative xl:px-0 xl:space-x-0 xl:grid xl:grid-cols-4 xl:gap-x-8'>
												{resources?.map((product: ResourceResult, index: number) => (
													<ResourceCard data={product} key={index} />
												))}
											</div>
										</div>
									</div>
								</div>

								<div className='mt-1.5 text-sm md:hidden mb-6'>
									<a href='#' className='font-medium text-sky-600 hover:text-sky-500'>
										Browse everything
										<span aria-hidden='true'> &rarr;</span>
									</a>
								</div>
							</div>
						</section>
					)}

					<section aria-labelledby='category-heading' tw='py-10 xl:max-w-7xl xl:mx-auto xl:px-8 -mb-3 -mt-4'>
						<div tw='px-4 sm:px-6 sm:flex sm:items-center sm:justify-between lg:px-8 xl:px-0'>
							<h2 id='category-heading' tw='text-2xl font-extrabold tracking-tight text-zinc-900'>
								Popular categories
							</h2>
							<a href='#' tw='hidden text-sm font-semibold text-sky-600 hover:text-sky-500 sm:block'>
								Browse all categories
								<span aria-hidden='true'> &rarr;</span>
							</a>
						</div>
						<div tw='mt-4 flow-root'>
							<div tw='-my-2'>
								<div tw='box-content py-2 relative h-80 overflow-x-auto xl:overflow-visible'>
									<div tw='absolute min-w-0 px-4 flex space-x-8 sm:px-6 lg:px-8 xl:relative xl:px-0 xl:space-x-0 xl:grid xl:grid-cols-4 xl:gap-x-8'>
										{categories.map((category) => (
											<a
												key={category.name}
												href={category.href}
												tw='relative w-56 h-80 rounded-lg p-6 flex flex-col overflow-hidden hover:opacity-75 xl:w-auto transition'>
												<span aria-hidden='true' tw='absolute inset-0'>
													<img src={category.imageSrc} alt='' tw='w-full h-full object-center object-cover' />
												</span>
												<span aria-hidden='true' tw='absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-zinc-800 opacity-50' />
												<span tw='relative mt-auto text-center text-xl font-bold text-white'>{category.name}</span>
											</a>
										))}
									</div>
								</div>
							</div>
						</div>
						<div tw='mt-6 px-4 sm:hidden'>
							<a href='#' tw='block text-sm font-semibold text-sky-600 hover:text-sky-500'>
								Popular categories
								<span aria-hidden='true'> &rarr;</span>
							</a>
						</div>
					</section>
					<div tw='bg-zinc-100 mt-16'>
						<section aria-labelledby='testimonial-heading' tw='relative py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
							<div tw='max-w-2xl mx-auto lg:max-w-none'>
								<h2 id='testimonial-heading' tw='text-2xl font-extrabold tracking-tight text-zinc-900'>
									What are people saying?
								</h2>
								<div tw='mt-16 space-y-16 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-x-8'>
									{testimonials.map((testimonial) => (
										<blockquote key={testimonial.id} tw='sm:flex lg:block'>
											<svg
												width={24}
												height={18}
												viewBox='0 0 24 18'
												xmlns='http://www.w3.org/2000/svg'
												aria-hidden='true'
												tw='flex-shrink-0 text-zinc-300'>
												<path
													d='M0 18h8.7v-5.555c-.024-3.906 1.113-6.841 2.892-9.68L6.452 0C3.188 2.644-.026 7.86 0 12.469V18zm12.408 0h8.7v-5.555C21.083 8.539 22.22 5.604 24 2.765L18.859 0c-3.263 2.644-6.476 7.86-6.451 12.469V18z'
													fill='currentColor'
												/>
											</svg>
											<div tw='mt-8 sm:mt-0 sm:ml-6 lg:mt-10 lg:ml-0'>
												<p tw='text-lg text-zinc-600'>{testimonial.quote}</p>
												<cite tw='mt-4 block font-semibold not-italic text-zinc-900'>{testimonial.attribution}</cite>
											</div>
										</blockquote>
									))}
								</div>
							</div>
						</section>
					</div>
				</main>
			</div>
		</PageContentBlock>
	);
};

export default Base;
