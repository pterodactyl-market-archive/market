import React, { useEffect, useState, Fragment } from 'react';

import tw, { css } from 'twin.macro';
import { classNames } from '@/helpers';
import { fetchRecord } from '@/api/fetch';
import { StarIcon } from '@heroicons/react/solid';
import { Link, useParams } from 'react-router-dom';
import { isProduction, formatPrice } from '@/helpers';
import { Dialog, Popover, Tab, Transition } from '@headlessui/react';
import { PageContentBlock, Spinner } from '@/components/elements/generic';

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
const product = {
	name: 'Application UI Icon Pack',
	version: { name: '1.0', date: 'June 5, 2021', datetime: '2021-06-05' },
	price: '$220',
	description:
		'The Application UI Icon Pack comes with over 200 icons in 3 styles: outline, filled, and branded. This playful icon pack is tailored for complex application user interfaces with a friendly and legible look.',
	highlights: ['200+ SVG icons in 3 unique styles', 'Compatible with Figma, Sketch, and Adobe XD', 'Drawn on 24 x 24 pixel grid'],
	imageSrc: 'https://tailwindui.com/img/ecommerce-images/product-page-05-product-01.jpg',
	imageAlt: 'Sample of 30 icons with friendly and fun details in outline, filled, and brand color styles.',
};
const reviews = [
	{
		id: 1,
		rating: 5,
		content: `
		  <p>This icon pack is just what I need for my latest project. There's an icon for just about anything I could ever need. Love the playful look!</p>
		`,
		date: 'July 16, 2021',
		datetime: '2021-07-16',
		author: 'Emily Selman',
		avatarSrc:
			'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80',
	},
	{
		id: 2,
		rating: 5,
		content: `
		  <p>Blown away by how polished this icon pack is. Everything looks so consistent and each SVG is optimized out of the box so I can use it directly with confidence. It would take me several hours to create a single icon this good, so it's a steal at this price.</p>
		`,
		date: 'July 12, 2021',
		datetime: '2021-07-12',
		author: 'Hector Gibbons',
		avatarSrc:
			'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80',
	},
];

const faqs = [
	{
		question: 'What format are these icons?',
		answer: 'The icons are in SVG (Scalable Vector Graphic) format. They can be imported into your design tool of choice and used directly in code.',
	},
	{
		question: 'Can I use the icons at different sizes?',
		answer:
			"Yes. The icons are drawn on a 24 x 24 pixel grid, but the icons can be scaled to different sizes as needed. We don't recommend going smaller than 20 x 20 or larger than 64 x 64 to retain legibility and visual balance.",
	},
];
const license = {
	content: `
	 <h4>Overview</h4>
	 
	 <p>For personal and professional use. You cannot resell or redistribute these icons in their original or modified state.</p>
	 
	 <ul role="list">
	 <li>You\'re allowed to use the icons in unlimited projects.</li>
	 <li>Attribution is not required to use the icons.</li>
	 </ul>
	 
	 <h4>What you can do with it</h4>
	 
	 <ul role="list">
	 <li>Use them freely in your personal and professional work.</li>
	 <li>Make them your own. Change the colors to suit your project or brand.</li>
	 </ul>
	 
	 <h4>What you can\'t do with it</h4>
	 
	 <ul role="list">
	 <li>Don\'t be greedy. Selling or distributing these icons in their original or modified state is prohibited.</li>
	 <li>Don\'t be evil. These icons cannot be used on websites or applications that promote illegal or immoral beliefs or activities.</li>
	 </ul>
  `,
};

const View = () => {
	const { id } = useParams();
	const [data, setData] = useState({} as any);
	const [loaded, setLoaded] = useState(false);
	const [CreatedDate, setCreatedDate] = useState('');
	const [imageUrl, setImageUrl] = useState('');

	const FormattedDate = new Date(CreatedDate);
	const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

	useEffect(() => {
		if (id) {
			setLoaded(false);
			setData({});
			fetchRecord('resources', id, '?expand=profile,packages').then((item: any) => {
				setData(item);
				if (item['@expand']['packages']) setCreatedDate(item['@expand']['packages'][0].created);
				if (item['gallery'][0])
					setImageUrl(`${!isProduction ? 'https://beta.pterodactylmarket.com' : ''}/api/files/resources/${id}/${item['gallery'][0]}`);
				setLoaded(true);
			});
		}
	}, [id]);

	if (!loaded) {
		return (
			<div css={tw`w-full h-screen flex justify-center items-center bg-white`}>
				<Spinner size='large' isBlue />
			</div>
		);
	} else {
		return (
			<PageContentBlock title={`Viewing ${data.category.slice(0, -1)}: ${data.name}`}>
				<main tw='mx-auto pt-14 px-4 sm:pt-16 sm:px-6 lg:max-w-[95rem] lg:px-8 mt-[4.2rem]'>
					<div tw='bg-white rounded-lg p-8 mb-8 shadow-sm border border-zinc-200'>
						<div tw='lg:grid lg:grid-rows-1 lg:grid-cols-7 lg:gap-x-8 lg:gap-y-10 xl:gap-x-16'>
							<div className='group' tw='relative lg:row-end-1 lg:col-span-4 cursor-pointer'>
								<div tw='aspect-[16/9] rounded-md bg-zinc-100 overflow-hidden'>
									{imageUrl ? (
										<img src={imageUrl} tw='object-center object-cover group-hover:brightness-[0.80] group-hover:shadow-inner transition' />
									) : (
										<div tw='grid h-full place-items-center'>
											<span tw='font-bold text-lg text-zinc-600 rounded-lg px-4 py-1.5 bg-white border border-zinc-200'>
												This author has not provided any images for this resource
											</span>
										</div>
									)}
								</div>
								<div tw='opacity-0 group-hover:opacity-100 absolute -bottom-7 left-3 transition flex space-x-2.5'>
									{data.gallery.map((image: string) => {
										const formattedLink = `${!isProduction ? 'https://beta.pterodactylmarket.com' : ''}/api/files/resources/${id}/${image}`;
										return (
											<img
												onClick={() => setImageUrl(formattedLink)}
												src={formattedLink}
												tw='transition object-center object-cover aspect-[16/9] h-16 rounded shadow border border-zinc-300 hover:border-sky-400'
												css={imageUrl === formattedLink && tw`ring-1 ring-sky-400 border-sky-400`}
											/>
										);
									})}
								</div>
							</div>

							<div tw='max-w-2xl mx-auto mt-14 sm:mt-16 lg:max-w-none lg:mt-0 lg:row-end-2 lg:row-span-2 lg:col-span-3'>
								<div tw='flex flex-col-reverse'>
									<div tw='mt-4'>
										<h1 tw='text-2xl font-extrabold tracking-tight text-zinc-900 sm:text-3xl'>{data.name}</h1>

										<h2 id='information-heading' tw='sr-only'>
											Product information
										</h2>
										{data['@expand']['packages'] && (
											<p tw='text-sm text-zinc-500 mt-2'>
												Version {data['@expand'].packages[0].version}
												{` (Updated ${months[FormattedDate.getMonth()]} ${FormattedDate.getDay()}, ${FormattedDate.getFullYear()})`}
											</p>
										)}
									</div>

									<div>
										<h3 tw='sr-only'>Reviews</h3>
										<div tw='flex items-center'>
											{[0, 1, 2, 3, 4].map((rating) => (
												<StarIcon
													key={rating}
													className={classNames(4 > rating ? 'text-yellow-400' : 'text-zinc-300', 'h-5 w-5 flex-shrink-0')}
													aria-hidden='true'
												/>
											))}
											<span tw='ml-2 text-sm text-zinc-500'>4 reviews</span>
										</div>
									</div>
								</div>

								<p tw='text-zinc-500 mt-6'>{data.description}</p>

								<div tw='mt-10 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2'>
									<button
										type='button'
										tw='w-full bg-sky-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-50 focus:ring-sky-500'>
										Purchase for ${formatPrice((data.price / 100).toString())}
									</button>
									<button
										type='button'
										tw='w-full bg-sky-50 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-sky-700 hover:bg-sky-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-50 focus:ring-sky-500'>
										Contact author
									</button>
								</div>

								<div tw='border-t border-zinc-200 mt-10 pt-10'>
									<h3 tw='text-sm font-medium text-zinc-900'>Features</h3>
									<div tw='mt-4 prose prose-sm text-zinc-500'>
										<ul role='list'>
											{product.highlights.map((highlight) => (
												<li key={highlight}>{highlight}</li>
											))}
										</ul>
									</div>
								</div>

								<div tw='border-t border-zinc-200 mt-10 pt-10'>
									<h3 tw='text-sm font-medium text-zinc-900'>License</h3>
									<p tw='mt-4 text-sm text-zinc-500'>
										For personal and professional use. You cannot resell or redistribute this {data.category.slice(0, -1)} in its original or modified
										state.{' '}
										<a href='#' tw='font-medium text-sky-600 hover:text-sky-500'>
											Read full license
										</a>
									</p>
								</div>
								<div tw='border-t border-zinc-200 mt-10 pt-10'>
									<h3 tw='text-sm font-medium text-zinc-900'>License</h3>
									<p tw='mt-4 text-sm text-zinc-500'>
										For personal and professional use. You cannot resell or redistribute this {data.category.slice(0, -1)} in its original or modified
										state.{' '}
										<a href='#' tw='font-medium text-sky-600 hover:text-sky-500'>
											Read full license
										</a>
									</p>
								</div>
							</div>

							<div tw='w-full max-w-2xl mx-auto mt-16 lg:max-w-none lg:mt-0 lg:col-span-4'>
								<Tab.Group as='div'>
									<div tw='border-b border-zinc-200'>
										<Tab.List tw='-mb-px flex space-x-8'>
											<Tab
												className={({ selected }) =>
													classNames(
														selected ? 'border-sky-600 text-sky-600' : 'border-transparent text-zinc-700 hover:text-zinc-800 hover:border-zinc-300',
														'whitespace-nowrap py-6 border-b-2 font-medium text-sm'
													)
												}>
												Customer Reviews
											</Tab>
											<Tab
												className={({ selected }) =>
													classNames(
														selected ? 'border-sky-600 text-sky-600' : 'border-transparent text-zinc-700 hover:text-zinc-800 hover:border-zinc-300',
														'whitespace-nowrap py-6 border-b-2 font-medium text-sm'
													)
												}>
												FAQ
											</Tab>
											<Tab
												className={({ selected }) =>
													classNames(
														selected ? 'border-sky-600 text-sky-600' : 'border-transparent text-zinc-700 hover:text-zinc-800 hover:border-zinc-300',
														'whitespace-nowrap py-6 border-b-2 font-medium text-sm'
													)
												}>
												License
											</Tab>
										</Tab.List>
									</div>
									<Tab.Panels as={Fragment}>
										<Tab.Panel tw='-mb-10'>
											<h3 tw='sr-only'>Customer Reviews</h3>

											{reviews.map((review, reviewIdx) => (
												<div key={review.id} tw='flex text-sm text-zinc-500 space-x-4'>
													<div tw='flex-none py-10'>
														<img src={review.avatarSrc} alt='' tw='w-10 h-10 bg-zinc-100 rounded-full' />
													</div>
													<div className={classNames(reviewIdx === 0 ? '' : 'border-t border-zinc-200', 'flex-1 py-10')}>
														<h3 tw='font-medium text-zinc-900'>{review.author}</h3>
														<p>
															<time dateTime={review.datetime}>{review.date}</time>
														</p>

														<div tw='flex items-center mt-4'>
															{[0, 1, 2, 3, 4].map((rating) => (
																<StarIcon
																	key={rating}
																	className={classNames(review.rating > rating ? 'text-yellow-400' : 'text-zinc-300', 'h-5 w-5 flex-shrink-0')}
																	aria-hidden='true'
																/>
															))}
														</div>
														<p tw='sr-only'>{review.rating} out of 5 stars</p>

														<div tw='mt-4 prose prose-sm max-w-none text-zinc-500' dangerouslySetInnerHTML={{ __html: review.content }} />
													</div>
												</div>
											))}
										</Tab.Panel>

										<Tab.Panel as='dl' tw='text-sm text-zinc-500'>
											<h3 tw='sr-only'>Frequently Asked Questions</h3>

											{faqs.map((faq) => (
												<Fragment key={faq.question}>
													<dt tw='mt-10 font-medium text-zinc-900'>{faq.question}</dt>
													<dd tw='mt-2 prose prose-sm max-w-none text-zinc-500'>
														<p>{faq.answer}</p>
													</dd>
												</Fragment>
											))}
										</Tab.Panel>

										<Tab.Panel tw='pt-10'>
											<h3 tw='sr-only'>License</h3>

											<div tw='prose prose-sm max-w-none text-zinc-500' dangerouslySetInnerHTML={{ __html: license.content }} />
										</Tab.Panel>
									</Tab.Panels>
								</Tab.Group>
							</div>
						</div>
					</div>
				</main>
			</PageContentBlock>
		);
	}
};

export default View;
