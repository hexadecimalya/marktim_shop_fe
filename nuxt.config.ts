// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  colorMode: {
    preference: 'light'
  },
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      title: 'MARKTIM SHOP', // default fallback title
    }
  },
  modules: ['@nuxt/ui'],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  }
})
