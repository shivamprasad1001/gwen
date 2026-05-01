/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        warm: {
          base:    '#FAF7F2',
          surface: '#F3EFE8',
          sidebar: '#EDEAE3',
          border:  '#E0D9CF',
          accent:  '#C17D4A',
          'accent-soft': '#E8D5BE',
          'text-primary':   '#2C2825',
          'text-secondary': '#7A6E65',
          'text-muted':     '#A89E94',
        }
      },
      fontFamily: {
        lora: ['Lora', 'serif'],
        sans: ['DM Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        'sm': '8px',
        'md': '14px',
        'lg': '20px',
        'xl': '28px',
      },
      boxShadow: {
        'warm-soft': '0 2px 12px rgba(44, 40, 37, 0.06)',
        'warm-md': '0 4px 24px rgba(44, 40, 37, 0.10)',
      },
      animation: {
        'message-in': 'messageIn 300ms ease forwards',
        'typing-bounce': 'typingBounce 1.4s infinite',
        'blob': 'blob 7s infinite',
        'fade-in-up': 'fadeInUp 1s ease-out forwards',
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        messageIn: {
          'from': { opacity: '0', transform: 'translateY(10px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        typingBounce: {
          '0%, 60%, 100%': { transform: 'translateY(0)' },
          '30%': { transform: 'translateY(-5px)' },
        },
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1', filter: 'drop-shadow(0 0 10px rgba(193,125,74,0.4))' },
          '50%': { opacity: '0.8', filter: 'drop-shadow(0 0 20px rgba(193,125,74,0.8))' },
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
