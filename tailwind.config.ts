import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './client/src/**/*.{js,ts,jsx,tsx}',
    './client/index.html',
  ],
  theme: {
    extend: {
      colors: {
        'neon-cyan': '#00F5FF',
        'neon-pink': '#FF00E5',
        'neon-green': '#39FF14',
        'neon-dark': '#030303',
        'neon-gray': '#0a0a0a',
      },
      backgroundColor: {
        'neon-dark': '#030303',
        'neon-gray': '#0a0a0a',
      },
      textColor: {
        'neon-cyan': '#00F5FF',
        'neon-pink': '#FF00E5',
        'neon-green': '#39FF14',
      },
      borderColor: {
        'neon-cyan': '#00F5FF',
        'neon-pink': '#FF00E5',
        'neon-green': '#39FF14',
      },
      boxShadow: {
        'neon-cyan': '0 0 20px rgba(0, 245, 255, 0.5), 0 0 40px rgba(0, 245, 255, 0.3)',
        'neon-pink': '0 0 20px rgba(255, 0, 229, 0.5), 0 0 40px rgba(255, 0, 229, 0.3)',
        'neon-green': '0 0 20px rgba(57, 255, 20, 0.5), 0 0 40px rgba(57, 255, 20, 0.3)',
        'glowing-text': '0 0 10px rgba(0, 245, 255, 0.8), 0 0 20px rgba(255, 0, 229, 0.6)',
        'neon-card': '0 0 30px rgba(0, 245, 255, 0.3), inset 0 0 30px rgba(0, 245, 255, 0.1)',
      },
      keyframes: {
        'neon-pulse': {
          '0%, 100%': {
            opacity: '1',
            textShadow: '0 0 10px rgba(0, 245, 255, 0.8), 0 0 20px rgba(0, 245, 255, 0.6)',
          },
          '50%': {
            opacity: '0.8',
            textShadow: '0 0 20px rgba(0, 245, 255, 1), 0 0 30px rgba(255, 0, 229, 0.8)',
          },
        },
        'border-flow': {
          '0%': {
            backgroundPosition: '0% 50%',
          },
          '50%': {
            backgroundPosition: '100% 50%',
          },
          '100%': {
            backgroundPosition: '0% 50%',
          },
        },
        'glow-border': {
          '0%, 100%': {
            boxShadow: '0 0 5px rgba(0, 245, 255, 0.5), inset 0 0 5px rgba(0, 245, 255, 0.1)',
          },
          '50%': {
            boxShadow: '0 0 20px rgba(0, 245, 255, 0.8), inset 0 0 10px rgba(0, 245, 255, 0.2)',
          },
        },
        'float': {
          '0%, 100%': {
            transform: 'translateY(0px)',
          },
          '50%': {
            transform: 'translateY(-20px)',
          },
        },
        'typewriter': {
          '0%': {
            width: '0',
          },
          '100%': {
            width: '100%',
          },
        },
        'blink': {
          '0%, 49%': {
            opacity: '1',
          },
          '50%, 100%': {
            opacity: '0',
          },
        },
      },
      animation: {
        'neon-pulse': 'neon-pulse 3s ease-in-out infinite',
        'border-flow': 'border-flow 3s ease infinite',
        'glow-border': 'glow-border 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'typewriter': 'typewriter 0.05s steps(1) forwards',
        'blink': 'blink 1s step-end infinite',
      },
      backdropBlur: {
        xs: '2px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};

export default config;
