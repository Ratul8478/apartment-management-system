/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#334155',
          700: '#1E293B',
          800: '#0F172A',
          900: '#0B132B',
          950: '#070A15',
        },
        brand: {
          blue: '#2563EB',
          'blue-hover': '#1D4ED8',
          'blue-light': '#3B82F6',
          indigo: '#4F46E5',
          'indigo-hover': '#4338CA',
          green: '#059669',
          emerald: '#059669',
          'emerald-light': '#10B981',
          red: '#E11D48',
          coral: '#E11D48',
          amber: '#D97706',
          violet: '#7C3AED',
          cyan: '#0891B2',
        },
        surface: {
          bg: '#F8FAFC',
          card: '#FFFFFF',
          dark: '#0F172A',
          border: '#E2E8F0',
          'border-dark': '#1E293B',
        },
        text: {
          primary: '#0F172A',
          secondary: '#475569',
          muted: '#94A3B8',
        }
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #2563EB 0%, #4F46E5 50%, #7C3AED 100%)',
        'brand-gradient-hover': 'linear-gradient(135deg, #1D4ED8 0%, #4338CA 50%, #6D28D9 100%)',
        'emerald-gradient': 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
        'dark-gradient': 'linear-gradient(180deg, #0F172A 0%, #0B132B 60%, #070A15 100%)',
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.7) 100%)',
        'card-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 1) 0%, rgba(248, 250, 252, 0.85) 100%)',
      },
      boxShadow: {
        'glow-blue': '0 0 25px -5px rgba(37, 99, 235, 0.35)',
        'glow-indigo': '0 0 25px -5px rgba(79, 70, 229, 0.35)',
        'glow-purple': '0 0 25px -5px rgba(124, 58, 237, 0.35)',
        'glow-emerald': '0 0 25px -5px rgba(16, 185, 129, 0.35)',
        'premium-card': '0 10px 30px -10px rgba(15, 23, 42, 0.08), 0 4px 12px -2px rgba(15, 23, 42, 0.03)',
      },
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        xl: '12px',
        '2xl': '16px',
        '3xl': '24px',
      }
    },
  },
  plugins: [],
}

