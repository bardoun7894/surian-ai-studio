import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/**/*.blade.php',
        './resources/**/*.js',
        './resources/**/*.vue',
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['"Qomra"', '"Cairo"', '"Noto Sans Arabic"', 'Arial', 'sans-serif'],
                display: ['"Qomra"', '"Cairo"', '"Noto Kufi Arabic"', 'Arial', 'sans-serif'],
                poppins: ['"Poppins"', 'sans-serif'],
                body: ['"Qomra"', '"Cairo"', 'sans-serif'],
            },
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                gov: {
                    forest: 'rgb(var(--color-gov-forest) / <alpha-value>)',
                    emerald: 'rgb(var(--color-gov-emerald) / <alpha-value>)',
                    emeraldStatic: '#094239', // Always green, for original identity elements
                    emeraldLight: 'rgb(var(--color-gov-emerald-light) / <alpha-value>)',
                    teal: 'rgb(var(--color-gov-teal) / <alpha-value>)',
                    gold: '#b9a779',
                    sand: '#988561',
                    beige: '#edebe0',
                    umber: '#260f14',
                    cherry: '#4a151e',
                    red: '#6b1f2a',
                    charcoal: '#161616',
                    stone: '#3d3a3b'
                },
                mofa: {
                    teal: 'rgb(var(--color-mofa-teal) / <alpha-value>)',
                    light: '#f0fdfa'
                },
                primary: {
                    DEFAULT: 'var(--color-primary)',
                    50: '#f2fafa',
                    100: '#e1f4f4',
                    200: '#c5eaea',
                    300: '#9cd9d9',
                    400: '#6ac0c0',
                    500: '#46a3a3',
                    600: 'var(--color-primary)', // Base
                    700: '#126868',
                    800: '#125454',
                    900: '#124545',
                    950: '#062929',
                },
                secondary: {
                    DEFAULT: '#D4AF37',
                    50: '#fbf9eb',
                    100: '#f6f1cd',
                    200: '#efe29e',
                    300: '#e6cd67',
                    400: '#deb83e',
                    500: '#d4af37', // Base
                    600: '#b58b29',
                    700: '#916723',
                    800: '#785324',
                    900: '#664623',
                    950: '#3a2510',
                },
                surface: {
                    light: '#F8FAFC',
                    dark: 'var(--color-surface-dark)',
                }
            },
            borderRadius: {
                'lg': '0.75rem', // 12px
                'xl': '1rem',    // 16px
            },
            boxShadow: {
                'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
                'card': '0 0 0 1px rgba(0, 0, 0, 0.03), 0 2px 8px rgba(0, 0, 0, 0.04)',
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-out forwards',
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                }
            }
        },
    },
    plugins: [],
};
