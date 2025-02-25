/** @type {import('tailwindcss').Config} */
import daisyui from 'daisyui'

export default {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {},
	},
	darkMode: 'class',
	plugins: [daisyui],
	daisyui: {
		themes: false,
		darkTheme: 'dark',
		base: true,
		styled: true,
		utils: true,
		prefix: '',
		logs: true,
		themeRoot: ':root',
	},
}
