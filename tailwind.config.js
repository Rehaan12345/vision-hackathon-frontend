import flowbite from 'flowbite/plugin';
import daisyui from 'daisyui';

/** @type {import('tailwindcss').Config} */
export default {
	darkMode: 'class',
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		'./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}',
		'./src/components/**/*.{html,js,svelte,ts}'
	],
	theme: {
		extend: {}
	},
plugins: [
	flowbite,
	daisyui
	// require("flowbite-typography")
]
};