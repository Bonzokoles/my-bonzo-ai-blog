/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    theme: {
        extend: {
            colors: {
                theme: {
                    text: "var(--text-primary)",
                    "text-secondary": "var(--text-secondary)",
                    bg: "var(--bg-primary)",
                    "bg-secondary": "var(--bg-secondary)",
                    accent: "var(--text-accent)",
                },
                ai: {
                    cyan: "var(--ai-cyan)",
                    magenta: "var(--ai-deep-blue)",
                    "cyan-glow": "var(--ai-cyan)",
                }
            },
            fontFamily: {
                graffiti: ["ThrolaconTrial", "sans-serif"],
                sans: ["SUSE", "Roboto", "sans-serif"],
            },
        },
    },
    plugins: [],
}
