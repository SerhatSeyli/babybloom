/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Soft pastel color palette
        babyblue: {
          light: '#E6F3FF',
          DEFAULT: '#A6D1FA',
          dark: '#7FB4E8'
        },
        babypink: {
          light: '#FFEDF2',
          DEFAULT: '#FFC2D1',
          dark: '#FF9EB5'
        },
        mintgreen: {
          light: '#E8F8F5',
          DEFAULT: '#A8E6CF',
          dark: '#88D4BE'
        },
        lavender: {
          light: '#F3EFFF',
          DEFAULT: '#D4C1F9',
          dark: '#B69DF8'
        },
        peach: {
          light: '#FFF6F0',
          DEFAULT: '#FFCDB2',
          dark: '#FFB593'
        },
        // Primary brand color is now lavender
        primary: '#D4C1F9',
        'primary-dark': '#B69DF8',
        'primary-light': '#F3EFFF',
        // Secondary colors
        secondary: '#A8E6CF',
        accent: '#FFC2D1',
        // Dark mode colors - updated for a softer, more pastel-friendly dark theme
        'dark-bg': '#292639',
        'dark-card': '#36324A',
        'dark-input': '#3E3A54',
        'dark-text': '#F9FAFB',
        'dark-text-secondary': '#D1D5DB',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      boxShadow: {
        'soft': '0 4px 20px rgba(0, 0, 0, 0.05)',
        'pressed': '0 1px 3px rgba(0, 0, 0, 0.1)',
        'elevated': '0 10px 25px rgba(0, 0, 0, 0.05)',
        'glow': '0 0 15px rgba(212, 193, 249, 0.5)',
      },
      fontFamily: {
        'rounded': ['Nunito', 'system-ui', 'sans-serif'],
        'display': ['Quicksand', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'float-slow': 'float 6s ease-in-out infinite',
        'scale-in': 'scaleIn 0.3s ease-out forwards',
        'bounce-soft': 'bounceSoft 2s infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in-down': 'fadeInDown 0.7s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.5s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: 0 },
          '100%': { transform: 'scale(1)', opacity: 1 },
        },
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(0)', animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)' },
          '50%': { transform: 'translateY(-15px)', animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
