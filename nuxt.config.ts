// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";
export default defineNuxtConfig({
  analyze: true, // generates .nuxt/analyze/ report
  compatibilityDate: "2024-11-01",
  runtimeConfig: {
    public: {
      apiBase:
        process.env.NUXT_PUBLIC_API_BASE || "https://marktim.shop/api/v1",
      siteUrl: "https://marktim.shop",
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
  modules: [
    "@nuxt/ui",
    "@pinia/nuxt",
    "@vueuse/nuxt",
    "@nuxt/icon",
  ],

  icon: {
    // mode: "svg",
    serverBundle: {
      collections: ["lucide", "solar", "mingcute"],
    },
  },
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: [
        "@vue/devtools-core",
        "@vue/devtools-kit",
        "pinia-plugin-persistedstate",
        "@internationalized/date",
      ],
    },
  },
});
