// Tailwind config -> https://v3.tailwindcss.com/docs/theme

/** @type {import('tailwindcss').Config} */
import colors from "tailwindcss/colors";
import defaultTheme from "tailwindcss/defaultTheme";

export default {
	content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
	darkMode: "class",
	theme: {
		colors: {
			// optionally add more colors from tailwindcss/colors
			// https://tailwindcss.com/docs/customizing-colors#default-color-palette
			slate: colors.slate,
			stone: colors.stone,
			zinc: colors.zinc,
			white: colors.white,
			black: colors.black,
			transparent: "transparent",
			// Standard Tailwind colors needed by components
			gray: colors.gray,
			blue: colors.blue,
			red: colors.red,
			green: colors.green,
			yellow: colors.yellow,
			purple: colors.purple,
			pink: colors.pink,
			indigo: colors.indigo,
			teal: colors.teal,
			orange: colors.orange,
			cyan: colors.cyan,
			emerald: colors.emerald,
			lime: colors.lime,
			// makes the custom colors available in the theme object so we can use them in utility classes (e.g. focus:ring-theme-accent)
			theme: {
				primary: "var(--color-accent)",
				secondary: "var(--color-accent-alt)",
				grey: "#999999",
			},
		},
		backgroundColor: {
			slate: colors.slate,
			stone: colors.stone,
			zinc: colors.zinc,
			white: colors.white,
			black: colors.black,
			transparent: 'transparent',
			gray: colors.gray,
			blue: colors.blue,
			red: colors.red,
			green: colors.green,
			yellow: colors.yellow,
			purple: colors.purple,
			pink: colors.pink,
			indigo: colors.indigo,
			teal: colors.teal,
			orange: colors.orange,
			cyan: colors.cyan,
			emerald: colors.emerald,
			lime: colors.lime,
			theme: {
				primary: "var(--color-background, #ffffff)",
				secondary: "var(--color-text, #000000)",
				accent: "var(--color-accent, #3498db)",
				"accent-alt": "var(--color-accent-alt, #e67e22)",
			},
		},
		backgroundImage: {
			"gradient-linear": generateGradient({
				type: "linear",
				angle: 145,
				colors: ["var(--color-background)", "var(--color-gradient)"],
			}),
			"gradient-radial": generateGradient({
				type: "radial",
				position: "bottom",
				colors: [
					"var(--color-gradient)",
					"var(--color-accent)",
					"var(--color-accent-alt)",
					"var(--color-shadow)",
				],
			}),
		},
		borderColor: {
			slate: colors.slate,
			stone: colors.stone,
			zinc: colors.zinc,
			white: colors.white,
			black: colors.black,
			transparent: 'transparent',
			gray: colors.gray,
			blue: colors.blue,
			red: colors.red,
			green: colors.green,
			yellow: colors.yellow,
			purple: colors.purple,
			pink: colors.pink,
			indigo: colors.indigo,
			teal: colors.teal,
			orange: colors.orange,
			cyan: colors.cyan,
			emerald: colors.emerald,
			lime: colors.lime,
			theme: {
				primary: "var(--color-accent)",
				secondary: "var(--color-accent-alt)",
			},
		},
		boxShadowColor: {
			theme: {
				primary: "var(--color-shadow)",
				secondary: "var(--color-text)",
				grey: "#999999",
			},
		},
		textColor: {
			slate: colors.slate,
			stone: colors.stone,
			zinc: colors.zinc,
			white: colors.white,
			black: colors.black,
			transparent: 'transparent',
			gray: colors.gray,
			blue: colors.blue,
			red: colors.red,
			green: colors.green,
			yellow: colors.yellow,
			purple: colors.purple,
			pink: colors.pink,
			indigo: colors.indigo,
			teal: colors.teal,
			orange: colors.orange,
			cyan: colors.cyan,
			emerald: colors.emerald,
			lime: colors.lime,
			theme: {
				primary: "var(--color-text)",
				secondary: "var(--color-background)",
				accent: "var(--color-accent)",
				"accent-alt": "var(--color-accent-alt)",
			},
		},
		textDecorationColor: {
			theme: {
				primary: "var(--color-accent)",
				secondary: "var(--color-accent-alt)",
			},
		},
		fontFamily: {
			sans: [
				"Roboto",
				...defaultTheme.fontFamily.sans,
			],
			serif: [
				"SUSE",
				...defaultTheme.fontFamily.serif,
			],
			mono: [
				"Fira Code",
				...defaultTheme.fontFamily.mono,
			],
		},
		typography: {
			DEFAULT: {
				css: {
					maxWidth: "85ch",
				},
			},
		},
		minHeight: {
			screen: "100vh",
		},
		extend: {
			colors: {
				ai: {
					cyan: '#00f0ff',
					magenta: '#ff00ff',
					blue: '#0066ff',
					green: '#00ff88',
					purple: '#9d00ff',
				},
				bg: {
					primary: '#0a0a0f',
					secondary: '#12121a',
					tertiary: '#1a1a2e',
				}
			},
			backgroundImage: {
				'gradient-ai': 'linear-gradient(135deg, #00f0ff 0%, #ff00ff 100%)',
				'gradient-holographic': 'linear-gradient(135deg, #00f0ff 0%, #0066ff 25%, #9d00ff 50%, #ff00ff 75%, #00f0ff 100%)',
			},
			boxShadow: {
				'glow-cyan': '0 0 20px #00f0ff',
				'glow-magenta': '0 0 20px #ff00ff',
				'glow-lg': '0 0 30px rgba(0, 240, 255, 0.5)',
			},
			animation: {
				'float': 'float 6s ease-in-out infinite',
				'glow': 'glow 2s ease-in-out infinite alternate',
				'glitch': 'glitch 1s linear infinite',
			},
			keyframes: {
				float: {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-20px)' },
				},
				glow: {
					'from': { boxShadow: '0 0 10px #00f0ff' },
					'to': { boxShadow: '0 0 30px #ff00ff' },
				},
			},
			borderRadius: {
				theme: "var(--border-radius)",
			},
		},
	},
	plugins: [require("@tailwindcss/typography")],
};

/**
 * Generate a CSS gradient string.
 *
 * @param {object} options
 * @param {string} options.type - The type of gradient. Either "linear" or "radial".
 * @param {string[]} options.colors - An array of color stops.
 * @param {string} [options.direction="right"] - The direction of the gradient.
 * @param {number} [options.angle=0] - The angle of the gradient.
 * @param {string} [options.shape="ellipse"] - The shape of the gradient.
 * @param {string} [options.position="center"] - The position of the gradient.
 * @returns {string} The generated gradient string.
 */

function generateGradient({
	type,
	colors,
	direction = "top",
	angle = 0,
	shape = "ellipse",
	position = "center",
}) {
	if (!Array.isArray(colors) || colors.length < 2)
		throw new Error("At least two colors must be provided");

	if (type === "radial")
		return `radial-gradient(${shape} at ${position}, ${colors.join(", ")})`;

	return `linear-gradient(${angle ? angle + "deg" : "to " + direction
		}, ${colors.join(", ")})`;
}
