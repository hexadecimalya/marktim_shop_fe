import * as Sentry from "@sentry/nuxt";

Sentry.init({
  // If set up, you can use the Nuxt runtime config here
dsn: "https://db8335d63ae8642a69b2a9d2c882a92b@o4510743114481664.ingest.de.sentry.io/4510743115726928",
  // modify depending on your custom runtime config

  // Adds request headers and IP for users, for more info visit:
  // https://docs.sentry.io/platforms/javascript/guides/nuxt/configuration/options/#sendDefaultPii
  sendDefaultPii: true,
});