/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'neon-cyan': '#00ffff',
        'neon-purple': '#8a2be2',
        'neon-pink': '#ff1493',
        'neon-green': '#39ff14',
        'neon-orange': '#ff6600',
      },
      fontFamily: {
        'mono': ['Orbitron', 'monospace'],
      },
      animation: {
        'slide-in': 'slideIn 0.5s ease-out',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite alternate',
        'neon-flicker': 'neonFlicker 4s ease-in-out infinite',
        'cyber-spin': 'spin 1s linear infinite',
        'float-particles': 'floatParticles 15s linear infinite',
      },
      keyframes: {
        slideIn: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        glowPulse: {
          '0%': { 
            filter: 'brightness(1) drop-shadow(0 0 10px #00ffff)',
          },
          '100%': { 
            filter: 'brightness(1.2) drop-shadow(0 0 20px #00ffff)',
          },
        },
        neonFlicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
          '75%': { opacity: '0.9' },
        },
        floatParticles: {
          '0%': {
            transform: 'translateY(100vh) translateX(0px) rotate(0deg)',
            opacity: '0',
          },
          '10%': {
            opacity: '1',
          },
          '90%': {
            opacity: '1',
          },
          '100%': {
            transform: 'translateY(-100px) translateX(100px) rotate(360deg)',
            opacity: '0',
          },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'cyber': '0 0 20px rgba(0, 255, 255, 0.3)',
        'cyber-lg': '0 0 30px rgba(0, 255, 255, 0.6)',
        'neon-pink': '0 0 20px rgba(255, 20, 147, 0.3)',
        'neon-green': '0 0 20px rgba(57, 255, 20, 0.3)',
      }
    },
  },
  plugins: [],
}