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
      },
      keyframes: {
        messageIn: {
          'from': { opacity: '0', transform: 'translateY(10px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        typingBounce: {
          '0%, 60%, 100%': { transform: 'translateY(0)' },
          '30%': { transform: 'translateY(-5px)' },
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
