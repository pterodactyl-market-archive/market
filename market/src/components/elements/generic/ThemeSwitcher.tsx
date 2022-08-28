import React, { useEffect, useState, Fragment } from 'react';

import tw from 'twin.macro';
import { MoonIcon, SunIcon } from '@heroicons/react/solid';

const themeSelector = () => {
	if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
		document.documentElement.classList.add('dark');
		if (window.matchMedia('(prefers-color-scheme: dark)').matches === true) {
			localStorage.theme = 'dark';
		}
	} else {
		document.documentElement.classList.remove('dark');
		if (window.matchMedia('(prefers-color-scheme: dark)').matches === false) {
			localStorage.theme = 'light';
		}
	}

	const [pteroTheme, setPteroTheme] = useState(localStorage.theme);
	const updatePteroTheme = () => {
		if (localStorage.theme != null) {
			if (localStorage.theme === 'dark') {
				localStorage.theme = 'light';
				setPteroTheme('light');
			} else {
				localStorage.theme = 'dark';
				setPteroTheme('dark');
			}
		}
	};

	return (
		<button css={tw`-ml-10`} onClick={() => updatePteroTheme()} title='Change theme'>
			{pteroTheme === 'dark' ? <SunIcon css={tw`h-5 w-5 text-yellow-300`} /> : <MoonIcon css={tw`h-5 w-5 text-sky-800`} />}
		</button>
	);
};

export default themeSelector;
