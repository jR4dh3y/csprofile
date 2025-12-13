/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        // Custom dark theme palette
        background: '#1e1e20',
        surface: '#2a2a2c',
        primary: '#c59edc',
        secondary: '#e6dfef',
        highlight: '#c3fb5b',
        warning: '#ffb86c',
        error: '#ff6e79',
        text: '#dcd9e7',
        muted: '#9c96ad',
        border: '#3a3a3d',
        selection: '#4a3b5f'
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
};
