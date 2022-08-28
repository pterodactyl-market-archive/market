import React, { useEffect, useState, Fragment } from 'react';

import tw from 'twin.macro';
import { Link } from 'react-router-dom';
import { chooseRandomColor, isProduction } from '@/helpers';
import { ShoppingCartIcon } from '@heroicons/react/solid';

// {item.body.substr(0, 250).replace(/<[^>]*>?/gm, "") + (item.body.length > 250 ? "..." : "")}

const Resource = (props: { data: any }) => {
	const icon = props.data.icon
		? `${!isProduction ? 'https://beta.pterodactylmarket.com' : ''}/api/files/resources/${props.data.id}/${props.data.icon}`
		: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='rgb(161 161 170)'%3E%3Cpath fillRule='evenodd' d='M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z' clipRule='evenodd' /%3E%3C/svg%3E`;
	const banner = props.data.banner
		? `${!isProduction ? 'https://beta.pterodactylmarket.com' : ''}/api/files/resources/${props.data.id}/${props.data.banner}`
		: 'https://boring-avatars-api.vercel.app/api/avatar?size=512&variant=beam';

	return (
		<Link
			to={`/resource/${props.data.id}`}
			tw='relative rounded-lg border border-zinc-200 bg-white hover:shadow-sm flex items-center hover:border-zinc-300 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-sky-500 px-4 py-5 transition-all'
			className='group'>
			<div tw='flex flex-col justify-between -mb-2.5'>
				<div tw='-mx-4'>
					<div
						css={[
							tw`w-full flex h-24 bg-cover bg-center -mt-5 rounded-t-md p-0`,
							{
								backgroundImage: `url(${banner})`,
							},
						]}></div>
					<div css={tw`-mt-14 top-0 w-20 h-20 flex ml-6`}>
						<img
							src={icon}
							css={tw`w-20 h-20 rounded-xl shadow-inner object-cover shadow group-hover:shadow-md bg-zinc-100 dark:bg-zinc-600 z-[1] transition-all`}
							alt={`Image for ${props.data.name}`}
						/>
					</div>
				</div>

				<p className='mt-4 text-lg font-medium text-zinc-900'>{props.data.name}</p>
				<p className='mb-1 text-sm font-medium text-sky-600'>@{props.data['@expand'].profile.username}</p>
				<p className='text-sm text-gray-500'>{props.data.description}</p>
				<div className='mt-1 flex-1 flex flex-col justify-end'>
					<p className='text-base font-medium text-gray-900'>${Number((props.data.price / 100).toFixed(2))}</p>
				</div>
			</div>
		</Link>
	);
};

export default Resource;
