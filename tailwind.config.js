/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "#0a0a0a", // Ultra dark
                foreground: "#ededed",
                glass: "rgba(255, 255, 255, 0.03)",
                "glass-border": "rgba(255, 255, 255, 0.08)",
                primary: "#3b82f6", // Blue-500
                secondary: "#64748b", // Slate-500
                accent: "#8b5cf6", // Violet-500
            },
            backgroundImage: {
                'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.01) 100%)',
                'main-gradient': 'radial-gradient(circle at top center, #1e1b4b 0%, #0a0a0a 100%)', // Midnight blue hint
            },
            backdropBlur: {
                xs: '2px',
            }
        },
    },
    plugins: [],
}
