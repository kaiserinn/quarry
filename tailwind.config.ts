import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

export default {
    content: ["./src/**/*.{html,js,svelte,ts}"],

    theme: {
        extend: {
            fontFamily: {
                serif: ["New Computer Modern", ...defaultTheme.fontFamily.serif],
                mono: ["New Computer Modern Mono", ...defaultTheme.fontFamily.mono],
            },
            colors: {
                text: {
                    0: "hsl(var(--text-000))",
                    100: "hsl(var(--text-100))",
                    200: "hsl(var(--text-200))",
                    300: "hsl(var(--text-300))",
                    400: "hsl(var(--text-400))",
                    500: "hsl(var(--text-500))",
                },
                accent: {
                    main: {
                        0: "hsl(var(--accent-main-000))",
                        100: "hsl(var(--accent-main-100))",
                        200: "hsl(var(--accent-main-200))",
                        900: "hsl(var(--accent-main-900))",
                    },
                    secondary: {
                        0: "hsl(var(--accent-secondary-000))",
                        100: "hsl(var(--accent-secondary-100))",
                        200: "hsl(var(--accent-secondary-200))",
                        900: "hsl(var(--accent-secondary-900))",
                    },
                    pro: {
                        0: "hsl(var(--accent-pro-000))",
                        100: "hsl(var(--accent-pro-100))",
                        200: "hsl(var(--accent-pro-200))",
                        900: "hsl(var(--accent-pro-900))",
                    },
                },
                background: {
                    0: "hsl(var(--bg-000))",
                    100: "hsl(var(--bg-100))",
                    200: "hsl(var(--bg-200))",
                    300: "hsl(var(--bg-300))",
                    400: "hsl(var(--bg-400))",
                    500: "hsl(var(--bg-500))",
                },
                border: {
                    100: "hsl(var(--border-100))",
                    200: "hsl(var(--border-200))",
                    300: "hsl(var(--border-300))",
                    400: "hsl(var(--border-400))",
                },
            },
        },
    },
} as Config;
