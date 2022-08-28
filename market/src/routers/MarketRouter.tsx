import React, { useEffect, useState, Fragment } from 'react';

import tw from 'twin.macro';
import Page from '@/components/Page';
import { useStoreState } from 'easy-peasy';
import { Spinner } from '@/components/elements/generic';
import { Browse } from '@/components/pages/market';
import { Route, Routes } from 'react-router-dom';
import { store, ApplicationStore } from '@/state';

export default () => {
	const UserData = useStoreState((state: ApplicationStore) => state.user.data);

	return (
		<Fragment>
			<Routes>
				<Route path='/:id' element={<Page component={Browse} title='Browse' />} />
			</Routes>
		</Fragment>
	);
};
