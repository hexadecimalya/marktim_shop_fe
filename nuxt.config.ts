// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  runtimeConfig: {
    npApiKey: process.env.NP_API_KEY,
  },
  pages: true,
  colorMode: {
    preference: "light",
  },
  devtools: { enabled: true },
  components: [
    {
      path: "components",
      pathPrefix: false, // disables folder name prefix
    },
  ],
  css: ["assets/css/main.css"],
  app: {
    head: {
      title: 'MARKTIM SHOP', // default fallback title
    }
  },
  modules: ["@nuxt/ui", "@pinia/nuxt"],
  vite: {
    plugins: [tailwindcss()],
  },
});
