import tailwindcss from "@tailwindcss/vite"

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [tailwindcss()]
  },
  modules: [
    '@nuxt/ui',
    'shadcn-nuxt',
    '@nuxt/fonts',
    '@nuxt/test-utils/module',
    '@nuxt/image'
  ],
  typescript: {
    tsConfig: {
      compilerOptions: {
        types: ['vitest/globals', '@nuxt/test-utils/runtime']
      }
    }
  },
  app: {
    head: {
      link: [
        { rel: 'manifest', href: '/manifest.webmanifest' },
        { rel: 'icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', href: '/icons/192.svg' }
      ],
      meta: [
        { name: 'theme-color', content: '#0d9488' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
        { name: 'apple-mobile-web-app-title', content: 'Logística' }
      ]
    }
  },
  fonts: {
    provider: 'google',
    families: [
      {
        name: 'DM Sans',
        provider: 'google',
        weights: ['400', '500', '700'],
        styles: ['normal'],
        subsets: ['latin'],
        global: true
      },
      {
        name: 'Caveat',
        provider: 'google',
        weights: ['400', '700'],
        styles: ['normal'],
        subsets: ['latin']
      }
    ]
  }
})