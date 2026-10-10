import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: '#f15a22',
          'orange-dark': '#d94f1a',
          accent: '#ef8022',
          navy: '#0f2149',
          'navy-light': '#1a2f5e',
          ink: '#231f20',
          smoke: '#f5f5f5',
          line: '#e5e5e5',
          muted: '#6b7280',
        },
      },
      fontFamily: {
        sans: [
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
      maxWidth: {
        site: '1440px',
      },
    },
  },
  plugins: [],
};

export default config;
