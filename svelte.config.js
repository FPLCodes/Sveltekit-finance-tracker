const sveltePreprocess = require('svelte-preprocess');
const pkg = require('./package.json');

/** @type {import('@sveltejs/kit').Config} */
module.exports = {
	kit: {
		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte',
		vite: {
			ssr: {
				external: Object.keys(pkg.dependencies || {})
			}
		}
	},

	preprocess: [
		sveltePreprocess({
			defaults: {
				style: 'postcss'
			},
			postcss: true
		})
	]
};
