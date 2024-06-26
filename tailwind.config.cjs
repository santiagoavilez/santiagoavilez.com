/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	darkMode: 'class', // or 'media' or 'class'
	theme: {
		extend: {
			colors: {
				'cerulean': {
					'50': '#ecfeff',
					'100': '#cefaff',
					'200': '#a3f4fe',
					'300': '#63e9fd',
					'400': '#1dd4f3',
					'500': '#01b7da',
					'600': '#0491b6',
					'700': '#0b7493',
					'800': '#135d77',
					'900': '#144e65',
				},
			},
			keyframes:{
				"bg-animation":{
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
			},
			animation: {
				"bg-animation": "bg-animation 10s linear infinite",
			},
		},
	},
	plugins: [],
}
