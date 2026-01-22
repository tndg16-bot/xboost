import type { Config } from 'tailwindcss';

export const uiTheme: Config['theme'] = {
  extend: {
    colors: {
      blue: { 400: '#38BDF8', 500: '#1DA1F2', 600: '#0284C7', 700: '#0369A1', 900: '#0C4A6E' },
      green: { 400: '#4ADE80', 500: '#17BF63', 600: '#16A34A', 700: '#15803D' },
      red: { 500: '#EF4444', 600: '#DC2626' },
      yellow: { 500: '#F59E0B', 600: '#D97706' },
    },
    fontSize: {
      'display-lg': ['2.5rem', { lineHeight: '3rem', letterSpacing: '-0.02em' }],
      'display-md': ['2rem', { lineHeight: '2.5rem', letterSpacing: '-0.015em' }],
      'display-sm': ['1.75rem', { lineHeight: '2.25rem', letterSpacing: '-0.01em' }],
      'heading-lg': ['1.5rem', { lineHeight: '2rem', letterSpacing: '-0.01em' }],
      'heading-md': ['1.25rem', { lineHeight: '1.75rem', letterSpacing: '-0.005em' }],
      'heading-sm': ['1.125rem', { lineHeight: '1.5rem', letterSpacing: '0em' }],
      'body-lg': ['1rem', { lineHeight: '1.75rem', letterSpacing: '0.005em' }],
      'body-md': ['0.875rem', { lineHeight: '1.5rem', letterSpacing: '0.01em' }],
      'body-sm': ['0.75rem', { lineHeight: '1.25rem', letterSpacing: '0.015em' }],
      'caption': ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.02em' }],
      'label': ['0.625rem', { lineHeight: '0.75rem', letterSpacing: '0.05em' }],
    },
    borderRadius: { xs: '0.25rem', sm: '0.375rem', md: '0.5rem', lg: '0.75rem', xl: '1rem', '2xl': '1.5rem', '3xl': '2rem' },
    boxShadow: {
      'xs': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      'sm': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
      'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
      'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
      'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
    },
    zIndex: { dropdown: '10', sticky: '20', fixed: '30', modalBackdrop: '40', modal: '50', popover: '60', tooltip: '70' },
    keyframes: {
      'fade-in': { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
      'zoom-in-95': { '0%': { transform: 'scale(0.95)', opacity: '0' }, '100%': { transform: 'scale(1)', opacity: '1' } },
    },
    animation: { 'fade-in': 'fade-in 200ms ease-out', 'zoom-in-95': 'zoom-in-95 200ms ease-out' },
  },
};
