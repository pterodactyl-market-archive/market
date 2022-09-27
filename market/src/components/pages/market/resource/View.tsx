import React, { useEffect, useState, Fragment } from 'react';

import { encode } from 'base-64';
import tw, { css } from 'twin.macro';
import { classNames } from '@/helpers';
import { ApplicationStore } from '@/state';
import { useStoreState } from 'easy-peasy';
import { updateUserProfile } from '@/api/user';
import { isProduction, formatPrice } from '@/helpers';
import { BadgeCheckIcon } from '@heroicons/react/outline';
import { fetchRecord, fetchCollection } from '@/api/fetch';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Dialog, Popover, Tab, Transition } from '@headlessui/react';
import { PageContentBlock, Spinner } from '@/components/elements/generic';
import { StarIcon, ArrowsExpandIcon, ShoppingBagIcon } from '@heroicons/react/solid';

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

const View = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const [open, setOpen] = useState(false);
	const [tabIndex, setTabIndex] = useState(0);
	const [data, setData] = useState({} as any);
	const [loaded, setLoaded] = useState(false);
	const [imageUrl, setImageUrl] = useState('');
	const [reviews, setReviews] = useState({} as any);
	const [CreatedDate, setCreatedDate] = useState('');

	const UserData = useStoreState((state: ApplicationStore) => state.user.data);
	const FormattedDate = new Date(CreatedDate);
	const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

	useEffect(() => {
		if (id) {
			setLoaded(false);
			setData({});
			Promise.all([
				fetchRecord('resources', id, '?expand=profile,packages').then((item: any) => {
					setData(item);
					if (item['@expand']['packages']) setCreatedDate(item['@expand']['packages'][0].created);
					if (item['gallery'][0])
						setImageUrl(`${!isProduction ? 'https://beta.pterodactylmarket.com' : ''}/api/files/resources/${id}/${item['gallery'][0]}`);
				}),
				fetchCollection('reviews', `?expand=reviewer&filter=(resource='${id}')`).then((data: any) => {
					setReviews(data.items);
				}),
			]).then(() => setLoaded(true));
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
				<Transition.Root show={open} as={Fragment}>
					<Dialog as='div' className='fixed z-[60] inset-0 overflow-y-auto' onClose={setOpen}>
						<div className='flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0'>
							<Transition.Child
								as={Fragment}
								enter='ease-out duration-300'
								enterFrom='opacity-0'
								enterTo='opacity-100'
								leave='ease-in duration-200'
								leaveFrom='opacity-100'
								leaveTo='opacity-0'>
								<Dialog.Overlay className='fixed inset-0 bg-black bg-opacity-60 transition-opacity' style={{ backdropFilter: 'blur(2px)' }} />
							</Transition.Child>
							<span className='hidden sm:inline-block sm:align-middle sm:h-screen' aria-hidden='true'>
								&#8203;
							</span>
							<Transition.Child
								as={Fragment}
								enter='ease-out duration-300'
								enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
								enterTo='opacity-100 translate-y-0 sm:scale-100'
								leave='ease-in duration-200'
								leaveFrom='opacity-100 translate-y-0 sm:scale-100'
								leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'>
								<div className='inline-block align-bottom rounded-lg overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-5xl sm:w-full'>
									<img src={imageUrl} alt='' className='object-cover' />
								</div>
							</Transition.Child>
						</div>
					</Dialog>
				</Transition.Root>
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
								<div
									onClick={() => setOpen(true)}
									tw='absolute top-3 right-3 opacity-0 group-hover:opacity-100 p-1.5 bg-white rounded-md hover:text-sky-600 transition'>
									<ArrowsExpandIcon tw='w-5 h-5' />
								</div>
								<div tw='opacity-0 group-hover:opacity-100 absolute -bottom-7 left-3 transition space-x-2.5 hidden sm:flex'>
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

							<div tw='px-10 max-w-2xl mx-auto mt-14 sm:mt-16 lg:max-w-none lg:mt-0 lg:row-end-2 lg:row-span-2 lg:col-span-3'>
								<div tw='flex flex-col-reverse'>
									<div tw='mt-0.5'>
										<h1 tw='text-2xl font-extrabold tracking-tight text-zinc-900 sm:text-3xl'>
											{data.name}
											<p tw='text-xs text-zinc-500 font-medium'>
												v{data['@expand'].packages ? data['@expand'].packages[0].version : 'none?'} last updated{' '}
												{data['@expand'].packages
													? `${months[FormattedDate.getMonth()]} ${FormattedDate.getDay()}, ${FormattedDate.getFullYear()}`
													: 'never?'}
											</p>
										</h1>
										<div tw='mt-2 flex items-center'>
											<p tw='text-lg text-zinc-900 sm:text-xl'>${formatPrice((data.price / 100).toString())}</p>
											<div tw='ml-4 pl-4 border-l border-zinc-300'>
												<h3 tw='sr-only'>Reviews</h3>
												<div tw='flex items-center'>
													{[0, 1, 2, 3, 4].map((rating) => (
														<StarIcon
															key={rating}
															className={classNames(4 > rating ? 'text-yellow-400' : 'text-zinc-300', 'h-5 w-5 flex-shrink-0')}
															aria-hidden='true'
														/>
													))}
													<span tw='ml-1.5 text-sm text-zinc-500'>4 reviews</span>
												</div>
											</div>
										</div>
										<h2 id='information-heading' tw='sr-only'>
											Product information
										</h2>
									</div>
								</div>
								<p tw='text-zinc-500 mt-6'>{data.description}</p>
								<div tw='mt-10'>
									{data.payment_method == 'stripe' ? (
										<button
											disabled={!UserData?.token}
											type='button'
											onClick={() => {
												updateUserProfile(UserData!.token, UserData!.account.id, {
													shopping_cart: data['@expand'].profile['shopping_cart'].concat(id),
												}).then(() => navigate(`/basket?promo=${encode(id!)}`));
											}}
											tw='w-full bg-sky-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-50 focus:ring-sky-500 disabled:pointer-events-none disabled:opacity-80 shadow-sm hover:shadow transition uppercase font-bold'>
											{UserData?.token ? (
												<span>
													add to cart <span tw='text-xs text-sky-200'>BETA</span>
												</span>
											) : (
												'account required'
											)}
										</button>
									) : (
										<button
											disabled={!UserData?.token}
											type='button'
											tw='w-full bg-sky-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-50 focus:ring-sky-500 disabled:pointer-events-none disabled:opacity-80 shadow-sm hover:shadow transition uppercase font-bold'>
											{UserData?.token ? `pay $${formatPrice((data.price / 100).toString())} with paypal` : 'account required'}
										</button>
									)}
									<Link
										tw='inline-flex items-center px-4 py-2 bg-sky-200 border border-transparent rounded-md font-semibold text-xs text-sky-900 uppercase tracking-widest hover:bg-sky-300 hover:bg-opacity-80 transition mt-3 w-full flex items-center justify-center hover:shadow-sm transition'
										to={`/marketplace/resource/${id}/releases`}>
										Release history
									</Link>
									<div tw='border border-zinc-200 rounded-lg divide-y divide-zinc-100 mt-8'>
										<div tw='w-full flex items-center justify-between p-6 space-x-6'>
											<div tw='flex-1 truncate'>
												<div tw='flex items-center space-x-1'>
													<h3 tw='text-zinc-900 text-sm font-medium truncate'>@{data['@expand'].profile.username}</h3>
													{data['@expand'].profile.seller_status === 'verified' && <BadgeCheckIcon tw='text-green-500 inline w-4 h-4 ' />}
												</div>
												<p tw='mt-1 text-zinc-500 text-sm truncate'>{data['@expand'].profile.discord}</p>
											</div>
											<div tw='flex -space-x-2 overflow-hidden'>
												<img tw='inline-block h-10 w-10 rounded-full ring-2 ring-white' src={data['@expand'].profile.avatar} />
											</div>
										</div>
										<div>
											<div tw='-mt-px flex divide-x divide-zinc-200'>
												<div tw='w-0 flex-1 flex'>
													<Link
														to={`/user/${data['@expand'].profile.username}/resources`}
														tw='relative -mr-px w-0 flex-1 inline-flex items-center justify-center py-4 text-sm text-zinc-700  font-medium border border-transparent rounded-bl-lg hover:text-zinc-500'>
														<ShoppingBagIcon tw='w-5 h-5 text-zinc-400' />
														<span tw='ml-3'>View all resources</span>
													</Link>
												</div>
											</div>
										</div>
									</div>
								</div>
								<div tw='border-t border-zinc-200 mt-10 pt-10'>
									<h3 tw='text-sm font-medium text-zinc-900'>Highlights</h3>
									<div tw='mt-4 prose prose-sm text-zinc-500'>
										<ul role='list'>
											<li>
												Works with Pterodactyl{' '}
												<span tw='font-medium text-zinc-600'>{data.pterodactyl_version ? data.pterodactyl_version : 'none?'}</span>
											</li>
											<li>
												This {data.category.slice(0, -1)} has{' '}
												<span tw='font-medium text-zinc-600'>
													{data.downloads} download{data.downloads === 1 ? '' : 's'}
												</span>
											</li>
											<li>
												Version <span tw='font-medium text-zinc-600'>{data['@expand'].packages ? data['@expand'].packages[0].version : 'none?'}</span>{' '}
												was last updated{' '}
												<span tw='font-medium text-zinc-600'>
													{data['@expand'].packages
														? `${months[FormattedDate.getMonth()]} ${FormattedDate.getDay()}, ${FormattedDate.getFullYear()}`
														: 'never?'}
												</span>
											</li>
											<li>
												This {data.category.slice(0, -1)} was created on{' '}
												<span tw='font-medium text-zinc-600'>{new Date(data.created).toISOString().slice(0, 10).replace(/-/g, '/')}</span>
											</li>
											<li>
												You can buy this {data.category.slice(0, -1)} using{' '}
												<span tw='font-medium text-zinc-600 capitalize'>{data.payment_method}</span>
											</li>
										</ul>
									</div>
								</div>
								<div tw='border-t border-zinc-200 mt-10 pt-10'>
									<h3 tw='text-sm font-medium text-zinc-900'>License</h3>
									<p tw='mt-4 text-sm text-zinc-500'>
										For personal and professional use. You cannot resell or redistribute this {data.category.slice(0, -1)} in its original or modified
										state.{' '}
										<button onClick={() => setTabIndex(2)} tw='font-medium text-sky-600 hover:text-sky-500'>
											Read full license
										</button>
									</p>
								</div>
							</div>

							<div tw='w-full max-w-2xl mx-auto mt-16 lg:max-w-none lg:mt-0 lg:col-span-4'>
								<Tab.Group onChange={(i: any) => setTabIndex(i)} selectedIndex={tabIndex} as='div'>
									<div tw='border-b border-zinc-200'>
										<Tab.List tw='-mb-px flex space-x-8'>
											<Tab
												className={({ selected }) =>
													classNames(
														selected ? 'border-sky-600 text-sky-600' : 'border-transparent text-zinc-700 hover:text-zinc-800 hover:border-zinc-300',
														'whitespace-nowrap py-6 border-b-2 font-medium text-sm'
													)
												}>
												Customer reviews
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
													<div tw='flex-none py-10 w-32'>
														<img src={review['@expand'].reviewer.avatar} alt='' tw='w-10 h-10 bg-zinc-100 rounded-full' />
														<Link to={`/user/${review['@expand'].reviewer.username}`} tw='mt-3 font-medium text-sky-600'>
															@{review['@expand'].reviewer.username}
														</Link>
														<p tw='mt-0.5 text-xs'>
															<time dateTime={review.created}>{new Date(review.created).toISOString().slice(0, 10).replace(/-/g, '/')}</time>
														</p>
														<div tw='flex items-center mt-1 -ml-1'>
															{[0, 1, 2, 3, 4].map((rating) => (
																<StarIcon
																	key={rating}
																	className={classNames(review.stars > rating ? 'text-yellow-400' : 'text-zinc-300', 'h-5 w-5 flex-shrink-0')}
																	aria-hidden='true'
																/>
															))}
														</div>
														<p tw='sr-only'>{review.rating} out of 5 stars</p>
													</div>
													<div className={classNames(reviewIdx === 0 ? '' : 'border-t border-zinc-200 ', 'flex-1 py-10')}>
														<div tw='prose prose-sm max-w-none text-zinc-900 font-medium'>{review.title}</div>
														<div tw='mt-2 prose prose-sm max-w-none text-zinc-500'>{review.content}</div>
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
											{data.license ? (
												<div>
													<h3 tw='sr-only'>License</h3>
													<div tw='prose prose-sm max-w-none text-zinc-500' dangerouslySetInnerHTML={{ __html: data.license }} />
												</div>
											) : (
												<span tw='font-medium text-sm text-zinc-800'>
													{`This author has not yet set a extended license for this ${data.category.slice(0, -1)}.`}
												</span>
											)}
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
