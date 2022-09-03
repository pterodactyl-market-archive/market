import React, { useEffect, useState, Fragment } from 'react';

import tw from 'twin.macro';
import Page from '@/components/Page';
import { Account, Security } from '@/components/pages/market/settings';
import { getUserProfile } from '@/api/user';
import { useStoreState } from 'easy-peasy';
import { Spinner } from '@/components/elements/generic';
import { Route, Routes } from 'react-router-dom';
import { store, ApplicationStore } from '@/state';

export default () => {
	const UserData = useStoreState((state: ApplicationStore) => state.user.data);
	const [CreatedDate, SetCreatedDate] = useState('');

	useEffect(() => {
		getUserProfile(UserData!.uuid, false, UserData!.token).then((data: any) => {
			SetCreatedDate(data.created);
		});
	}, []);

	const FormattedDate = new Date(CreatedDate);
	const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

	return (
		<Fragment>
			<Routes>
				<Route path='/account' element={<Page component={Account} title='Account Settings' />} />
				<Route path='/security' element={<Page component={Security} title='Account Security' />} />
			</Routes>
			<div tw='max-w-7xl m-auto'>
				<div tw='grid place-items-end mt-5 mb-5 mr-8'>
					<p tw='right-2 text-sm text-zinc-500 sm:col-span-6'>
						{CreatedDate ? (
							<Fragment>
								<span>This account was created on </span>
								<time>
									{`${months[FormattedDate.getMonth()]} ${FormattedDate.getDay()}, ${FormattedDate.getFullYear()}, 
						at ${FormattedDate.toLocaleString('en-US', {
							hour: 'numeric',
							minute: 'numeric',
							second: 'numeric',
							hour12: true,
						})}`}
								</time>
								.
							</Fragment>
						) : (
							'Fetching account creation date.'
						)}
					</p>
				</div>
			</div>
		</Fragment>
	);
};
