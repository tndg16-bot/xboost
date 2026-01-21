export const typography = {
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
  fontWeight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
} as const;

export type TypographyToken = typeof typography;
