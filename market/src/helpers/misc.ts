const delay = (time: number) => {
	return new Promise((resolve) => setTimeout(resolve, time));
};

function debounce<Params extends any[]>(func: (...args: Params) => any, timeout: number): (...args: Params) => void {
	let timer: NodeJS.Timeout;
	return (...args: Params) => {
		clearTimeout(timer);
		timer = setTimeout(() => {
			func(...args);
		}, timeout);
	};
}

function chooseRandomColor() {
	const colors = [
		'#ec4899',
		'#ef4444',
		'#f97316',
		'#f59e0b',
		'#84cc16',
		'#14b8a6',
		'#06b6d4',
		'#0ea5e9',
		'#3b82f6',
		'#6366f1',
		'#8b5cf6',
		'#a855f7',
		'#d946ef',
	];
	return colors[Math.floor(Math.random() * colors.length)];
}

const isProduction = process.env.NODE_ENV === 'production';

export { delay, debounce, chooseRandomColor, isProduction };
