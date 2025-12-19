/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // App semantic tokens (initial; can be replaced with Figma-derived values).
        appBg: {
          light: '#FFFFFF',
          dark: '#0B0F17',
        },
        appFg: {
          light: '#0B0F17',
          dark: '#EAF0FF',
        },
        appCard: {
          light: '#F6F7FB',
          dark: '#121A2A',
        },
        appBorder: {
          light: '#E5E7EB',
          dark: '#22304D',
        },
        appAccent: {
          light: '#3B82F6',
          dark: '#6EA8FF',
        },
        appDanger: {
          light: '#EF4444',
          dark: '#FF6B6B',
        },
      },
    },
  },
  plugins: [],
};
