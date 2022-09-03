import React, { useEffect, useState, Fragment } from 'react';

import tw from 'twin.macro';
import Page from '@/components/Page';
import { Dashboard } from '@/components/pages/seller';
import { getUserProfile } from '@/api/user';
import { useStoreState } from 'easy-peasy';
import { Spinner } from '@/components/elements/generic';
import { Route, Routes } from 'react-router-dom';
import { store, ApplicationStore } from '@/state';

export default () => {
	const UserData = useStoreState((state: ApplicationStore) => state.user.data);

	return (
		<Fragment>
			<Routes>
				<Route path='/dashboard' element={<Page component={Dashboard} title='Seller Dashboard' />} />
				<Route path='/settings' element={<Page component={Dashboard} title='Seller Settings' />} />
			</Routes>
		</Fragment>
	);
};
