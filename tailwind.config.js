import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Qomra"', '"Cairo"', '"Noto Sans Arabic"', 'Arial', 'sans-serif'],
        display: ['"Qomra"', '"Cairo"', '"Noto Kufi Arabic"', 'Arial', 'sans-serif'],
        poppins: ['"Poppins"', 'sans-serif'],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        gov: {
          forest: '#094239',
          emerald: '#094239',
          emeraldLight: '#115E59',
          teal: '#428177',
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
          teal: '#054239',
          light: '#f0fdfa'
        }
      },
      backgroundImage: {
        'pattern-islamic': "url('/assets/header-bg.png')",
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
export default config;
