/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
        display: ['"Syne"', 'sans-serif'],
        body: ['"DM Sans"', 'sans-serif'],
      },
      colors: {
        base: {
          950: '#060608',
          900: '#0c0c10',
          800: '#13131a',
          700: '#1a1a24',
          600: '#22222f',
          500: '#2e2e40',
        },
        amber: { DEFAULT: '#f59e0b', dim: '#b45309', glow: '#fbbf2440' },
        teal:  { DEFAULT: '#14b8a6', dim: '#0f766e', glow: '#14b8a640' },
        indigo:{ DEFAULT: '#6366f1', dim: '#4338ca', glow: '#6366f140' },
        green: { DEFAULT: '#22c55e', dim: '#15803d', glow: '#22c55e40' },
        zinc:  { 400: '#a1a1aa', 500: '#71717a', 600: '#52525b', 700: '#3f3f46', 800: '#27272a' },
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'flow': 'flow 2s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease forwards',
        'slide-up': 'slideUp 0.4s ease forwards',
        'glow-amber': 'glowAmber 2s ease-in-out infinite',
        'glow-teal': 'glowTeal 2s ease-in-out infinite',
        'glow-indigo': 'glowIndigo 2s ease-in-out infinite',
        'glow-green': 'glowGreen 2s ease-in-out infinite',
        'scan': 'scan 4s linear infinite',
        'blink': 'blink 1s step-end infinite',
        'stream-in': 'streamIn 0.3s ease forwards',
      },
      keyframes: {
        flow: {
          '0%, 100%': { opacity: '0.4', transform: 'scaleX(0.8)' },
          '50%': { opacity: '1', transform: 'scaleX(1)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        glowAmber: {
          '0%, 100%': { boxShadow: '0 0 8px 0px #f59e0b40' },
          '50%': { boxShadow: '0 0 20px 4px #f59e0b60' },
        },
        glowTeal: {
          '0%, 100%': { boxShadow: '0 0 8px 0px #14b8a640' },
          '50%': { boxShadow: '0 0 20px 4px #14b8a660' },
        },
        glowIndigo: {
          '0%, 100%': { boxShadow: '0 0 8px 0px #6366f140' },
          '50%': { boxShadow: '0 0 20px 4px #6366f160' },
        },
        glowGreen: {
          '0%, 100%': { boxShadow: '0 0 8px 0px #22c55e40' },
          '50%': { boxShadow: '0 0 20px 4px #22c55e60' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        streamIn: {
          from: { opacity: '0', transform: 'translateX(-4px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
}
