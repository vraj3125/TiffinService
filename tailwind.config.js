/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: '#FDF6E9',
          50: '#FFFDF9',
          100: '#FDF6E9',
          200: '#F8EAC9',
        },
        terracotta: {
          50: '#FBEBE3',
          100: '#F5D2C0',
          300: '#E29A72',
          400: '#D97D4E',
          500: '#C1502E',
          600: '#A63F22',
          700: '#843319',
        },
        mustard: {
          50: '#FCF3DD',
          100: '#F8E4AF',
          300: '#EFC661',
          400: '#E4AF3A',
          500: '#D9A441',
          600: '#B8862B',
        },
        forest: {
          50: '#E8EFE6',
          100: '#C7D9C2',
          300: '#6E9463',
          400: '#4B7440',
          500: '#2F5233',
          600: '#233E27',
          700: '#1A2E1D',
        },
      },
      fontFamily: {
        display: ['"Poppins"', 'system-ui', 'sans-serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 2px 12px rgba(80, 50, 20, 0.08)',
        card: '0 4px 20px rgba(80, 50, 20, 0.10)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
    },
  },
  plugins: [],
}
