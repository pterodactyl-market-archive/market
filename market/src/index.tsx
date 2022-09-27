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

root.render(
	<StoreProviderCasted store={store}>
		<GlobalStyles />
		<App />
	</StoreProviderCasted>
);
