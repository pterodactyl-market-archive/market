import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
	server: {
		port: 3000,
	},
	envPrefix: 'PB',
	base: process.env.NODE_ENV === 'production' ? '/admin/' : './',
	build: {
		chunkSizeWarningLimit: 1000,
		reportCompressedSize: false,
	},
	plugins: [
		svelte({
			experimental: {
				useVitePreprocess: true,
			},
		}),
	],
	resolve: {
		alias: {
			'@': __dirname + '/src',
		},
	},
});
