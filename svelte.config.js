import adapter from '@sveltejs/adapter-node';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),
		alias: {
			'$stores': 'src/lib/stores',
			'$components': 'src/lib/components',
			'$utils': 'src/lib/utils',
			'$assets': 'src/lib/assets',
		}
	}
};

export default config;
