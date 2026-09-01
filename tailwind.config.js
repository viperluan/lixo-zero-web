/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Paleta Lixo Zero
        brand: {
          'primary-dark': '#26708C', // Azul escuro
          'primary-light': '#6AA0D1', // Azul claro
          'secondary-dark': '#6D9B3E', // Verde escuro
          'secondary-light': '#BECC50', // Verde claro/Amarelo
          accent: '#36A339', // Verde vibrante
          warning: '#F2AF25', // Laranja
          danger: '#D83624', // Vermelho
          purple: '#9178B5', // Roxo
          dark: '#2E292C', // Cinza escuro/Preto
          light: '#FFFFFF', // Branco
        },
      },
      fontFamily: {
        sans: ['Barlow', 'system-ui', 'sans-serif'],
        display: ['Shrikhand', 'Barlow', 'serif'],
      },
      spacing: {
        section: '6rem',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        modalIn: {
          from: { opacity: '0', transform: 'translateY(-12px) scale(0.98)' },
          to: { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'modal-in': 'modalIn 0.2s ease-out',
      },
    },
  },
  plugins: [],
};
