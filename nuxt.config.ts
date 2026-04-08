// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  future: { compatibilityVersion: 4 },
  devtools: { enabled: true },

  modules: [
    '@vueuse/nuxt',
    '@nuxt/eslint',
    '@nuxtjs/i18n',
    '@nuxtjs/sitemap',
    '@nuxt/image',
    '@nuxt/fonts',
  ],

  image: {
    quality: 82,
    format: ['avif', 'webp'],
  },

  fonts: {
    defaults: {
      preload: true,
      weights: [400, 500, 600, 700],
    },
  },

  site: {
    url: 'https://emericguyon.com',
    name: 'Emeric Guyon — Fullstack Freelance Developer',
  },

  sitemap: {
    xslColumns: [
      { label: 'URL', width: '65%' },
      { label: 'Last Modified', width: '25%' },
    ],
    urls: [
      'elitetrackr',
      'ekkinox',
      '25lieuxinnovation',
      'evianchezvous',
      'lonn',
      'juriscan',
      'parentsdouceur',
      'inria',
      'uplexa',
    ].map(slug => ({ loc: `/projets/${slug}`, _i18nTransform: true })),
  },

  i18n: {
    baseUrl: 'https://emericguyon.com',
    locales: [
      { code: 'fr', file: 'fr.json', name: 'Français', language: 'fr-FR' },
      { code: 'en', file: 'en.json', name: 'English', language: 'en-US' },
    ],
    defaultLocale: 'fr',
    langDir: 'locales',
    strategy: 'prefix_except_default',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_locale',
      cookieSecure: true,
      alwaysRedirect: false,
      fallbackLocale: 'fr',
    },
  },

  css: ['~/assets/css/main.css'],

  postcss: {
    plugins: {
      '@tailwindcss/postcss': {},
    },
  },

  typescript: {
    strict: true,
  },

  components: [
    { path: '~/components', pathPrefix: false },
    { path: '~/components/ui', prefix: '' },
    { path: '~/components/home', prefix: 'Home' },
    { path: '~/components/project', prefix: 'Project' },
    { path: '~/components/icons', prefix: 'Icons' },
  ],

  imports: {
    dirs: ['composables/**', 'stores/**', 'types/**'],
  },

  nitro: {
    routeRules: {
      // Static assets — cache 1 year (immutable, hashed filenames)
      '/_nuxt/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
      // Images and fonts — cache 1 year
      '/images/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
      '/_ipx/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
      '/fonts/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
      // HTML pages — revalidate every hour
      '/**': { headers: { 'cache-control': 'public, max-age=3600, must-revalidate' } },
    },
  },

  app: {
    viewTransition: false,
    head: {
      meta: [
        { name: 'author', content: 'Emeric Guyon' },
        { name: 'google-site-verification', content: 'c1MlNK_2JRfKCwGLV8IlMcZunZ9QkXOTKPGivPx3iBA' },
        { name: 'theme-color', content: '#050505' },
      ],
      script: [
        {
          innerHTML: `(function(){try{var h=document.documentElement;h.classList.add('app-loading');h.style.opacity='0';var m=document.cookie.match(/(?:^|;\\s*)theme=(dark|light)/);var d=m?m[1]==='dark':window.matchMedia('(prefers-color-scheme:dark)').matches;if(d)h.classList.add('dark')}catch(e){}})()`,
          type: 'text/javascript',
          tagPosition: 'head',
        },
        ...(!import.meta.dev
          ? [{
              src: 'https://analytics.elitetrackr.com/script.js',
              defer: true,
              'data-website-id': 'f1fbaa2f-37d8-4072-b09c-d961faf36ad2',
            }]
          : []),
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        // Critical fonts: preloaded locally (no external RTT)
        { rel: 'preload', as: 'font', type: 'font/woff2', href: '/fonts/ClashDisplay-Bold.woff2', crossorigin: '' },
        { rel: 'preload', as: 'font', type: 'font/woff2', href: '/fonts/Satoshi-Regular.woff2', crossorigin: '' },
        { rel: 'preload', as: 'font', type: 'font/woff2', href: '/fonts/Satoshi-Medium.woff2', crossorigin: '' },
        // Plus Jakarta Sans + JetBrains Mono are now self-hosted by @nuxt/fonts
      ],
    },
  },
})
