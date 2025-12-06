/**
 * Site Configuration
 * Global site settings and metadata
 */

export const siteConfig = {
  name: 'Export Web Application',
  description: 'Professional export management system',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  
  // Localization
  locales: ['en', 'id'] as const,
  defaultLocale: 'en' as const,
  
  // Navigation
  navigation: {
    main: [
      { href: '/', labelKey: 'nav.home' },
      { href: '/about', labelKey: 'nav.about' },
      // Add more navigation items
    ],
  },
} as const;

export type Locale = (typeof siteConfig.locales)[number];


