import React from 'react';

import App from '@/components/App';
import { Props } from '#types/component';
import { createRoot } from 'react-dom/client';
import { isProduction } from '@/helpers';

//state
import { StoreProvider } from 'easy-peasy';
import { store } from '@/state';

//styles
import '@/assets/styles/main.css';
import GlobalStyles from '@/assets/styles/GlobalStyles';

const container = document.getElementById('root');
const root = createRoot(container!);
const StoreProviderCasted = StoreProvider as unknown as React.ComponentType<Props>;

if (window.location.hostname === 'beta.pterodactylmarket.com') {
	if (localStorage.getItem('access-key') !== 'b9eeb29f-1ba7-476f-b9a2-e47355264d0a') {
		root.render(<b>403: access denied</b>);
	} else {
		root.render(
			<StoreProviderCasted store={store}>
				<GlobalStyles />
				<App />
			</StoreProviderCasted>
		);
	}
} else {
	root.render(
		<StoreProviderCasted store={store}>
			<GlobalStyles />
			<App />
		</StoreProviderCasted>
	);
}
