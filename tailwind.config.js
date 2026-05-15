/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#025479',
          dark: '#014060',
          light: '#0375a8',
        },
      },
      keyframes: {
        'pop-in': {
          '0%': { opacity: '0', transform: 'translate(-50%, -50%) scale(0.5)' },
          '70%': { transform: 'translate(-50%, -50%) scale(1.2)' },
          '100%': { opacity: '1', transform: 'translate(-50%, -50%) scale(1)' },
        },
        'label-in': {
          '0%': { opacity: '0', transform: 'translateX(-50%) translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateX(-50%) translateY(0)' },
        },
      },
      animation: {
        'pop-in': 'pop-in 0.3s ease-out forwards',
        'label-in': 'label-in 0.2s ease-out forwards',
      },
    },
  },
  plugins: [],
}
