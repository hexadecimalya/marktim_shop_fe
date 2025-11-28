// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  runtimeConfig: {
    // npApiKey: process.env.NP_API_KEY,
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || "https://marktim.shop",
    },
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
      title: "MARKTIM SHOP", // default fallback title
      // link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
    },
  },
  modules: ["@nuxt/ui", "@pinia/nuxt", "@vueuse/nuxt","@nuxt/icon" ],
  // icon: {
  //   mode: "svg", // ✅ IMPORTANT: NO API calls
    // serverBundle: {
    //   collections: ["lucide", "solar"],
    // },
  // },
  vite: {
    plugins: [tailwindcss()],
  },
});