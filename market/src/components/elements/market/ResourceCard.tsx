import React, { useEffect, useState, Fragment } from 'react';

import tw from 'twin.macro';
import { Link } from 'react-router-dom';
import { StarIcon } from '@heroicons/react/solid';
import { isProduction, formatPrice } from '@/helpers';
import { LightBulbIcon } from '@heroicons/react/solid';
import { BadgeCheckIcon } from '@heroicons/react/outline';

const ResourceCard = (props: { data: any }) => {
	const icon = props.data.icon
		? `${!isProduction ? 'https://beta.pterodactylmarket.com' : ''}/api/files/resources/${props.data.id}/${props.data.icon}`
		: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='rgb(161 161 170)'%3E%3Cpath fillRule='evenodd' d='M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z' clipRule='evenodd' /%3E%3C/svg%3E`;

	return (
		<Link
			to={`/marketplace/resource/${props.data.id}`}
			tw='relative rounded-lg border border-zinc-200 bg-white hover:shadow-sm flex items-center hover:border-zinc-300 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-sky-500 px-4 py-5 transition-all'
			className='group'>
			<div tw='flex flex-col justify-between -mb-2.5 w-full'>
				<div tw='-mx-4 relative'>
					{props.data.featured && (
						<div tw='absolute -top-3 right-2'>
							<Link
								to='/help/docs/featured'
								className='inline-flex items-center py-0.5 pl-1 pr-2 rounded-full text-xs font-medium bg-cyan-100 text-cyan-700 shadow-sm hover:bg-cyan-600 hover:text-cyan-50 transition'>
								<LightBulbIcon tw='w-4 h-4 mr-1' />
								Sponsored
							</Link>
						</div>
					)}
					<div
						css={[
							tw`flex h-24 bg-cover bg-center -mt-5 rounded-t-md p-0 bg-zinc-400`,
							{
								backgroundImage: `url(${!isProduction ? 'https://beta.pterodactylmarket.com' : ''}/api/files/resources/${props.data.id}/${
									props.data.banner
								})`,
							},
						]}></div>
					<div css={tw`-mt-14 top-0 w-20 h-20 flex ml-6`}>
						<img
							src={icon}
							css={tw`w-20 h-20 rounded-xl shadow-inner object-cover shadow group-hover:shadow-md bg-zinc-100 z-[1] transition-all`}
							alt={`Image for ${props.data.name}`}
						/>
					</div>
				</div>

				<p className='mt-4 text-[1rem] font-medium text-zinc-900 h-7'>{props.data.name}</p>
				<p className='mb-1 text-sm font-medium text-sky-600'>
					<span tw='text-xs'>@</span>
					{props.data['@expand'].profile.username}
					{props.data['@expand'].profile.seller_status === 'verified' && <BadgeCheckIcon tw='inline w-4 h-4 ml-0.5 mb-0.5' />}
				</p>
				<p className='text-sm text-zinc-500 h-[3.8rem]'>
					{props.data.details
						? props.data.details.substr(0, 90).replace(/<[^>]*>?/gm, '') + (props.data.details.length > 90 ? '...' : '')
						: 'The author has not yet provided a description.'}
				</p>
				<div className='flex-1 flex flex-row justify-between mt-2 border-t border-zinc-200 -mx-4 px-3 pt-2'>
					<p className='text-sm font-medium text-green-800 py-0.5 px-1.5 rounded bg-green-100 w-fit'>
						${formatPrice((props.data.price / 100).toString())}
					</p>
					<p className='font-medium text-zinc-600 py-0.5'>
						<div tw='flex items-center'>
							<StarIcon className='text-zinc-300 h-5 w-5 flex-shrink-0' aria-hidden='true' />{' '}
							<StarIcon className='text-zinc-300 h-5 w-5 flex-shrink-0' aria-hidden='true' />
							<StarIcon className='text-zinc-300 h-5 w-5 flex-shrink-0' aria-hidden='true' />
							<StarIcon className='text-zinc-300 h-5 w-5 flex-shrink-0' aria-hidden='true' />
							<StarIcon className='text-zinc-300 h-5 w-5 flex-shrink-0' aria-hidden='true' />
							<span tw='text-xs ml-1'>(0)</span>
						</div>
					</p>
				</div>
			</div>
		</Link>
	);
};

export default ResourceCard;
