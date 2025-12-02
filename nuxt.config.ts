// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/ui'],
  css: ['~/assets/css/main.css'],
  colorMode: {
    preference: 'dark',
    classSuffix: '',
  },
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/', '/robots.txt'],
      ignore: ['/reveal'],
    },
  },
  routeRules: {
    '/**': { cache: { maxAge: 60 * 10 } },
  },
})
