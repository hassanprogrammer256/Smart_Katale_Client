import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'main_green': '#035A54',
        'dark_green':'#004526',
        'main_grey': '#414548',
      },
  
      fontFamily: {
        heading: ["Germania One", 'system-ui'],
        fair: ["Bodoni Moda", 'serif'],
        calm: ["Alumni Sans Pinstripe", 'sans-serif'],
        normal: [ "Playfair Display", 'serif'],
      },

    },
  },
  plugins: [],
};

export default config;
