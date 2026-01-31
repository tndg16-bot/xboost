import { Inter } from 'next/font/google'

/**
 * Next.js Font Optimization
 *
 * Using Google Fonts with next/font for optimal performance
 * - Automatic self-hosting
 * - No layout shift
 * - Automatic font optimization
 */

export const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['400', '500', '600', '700'],
})

export const fontConfig = {
  variable: '--font-inter',
  fallback: ['system-ui', 'sans-serif'],
}
