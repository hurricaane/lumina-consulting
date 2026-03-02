import tailwindcss from "@tailwindcss/vite";

// @ts-expect-error Don't know why this fires
import { apiEndpoint, repositoryName } from "./slicemachine.config.json";
import "./shared/lib/env";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2026-01-02",
  devtools: { enabled: true },

  app: {
    head: {
      title: "Lumina Consulting",
      titleTemplate: "%s",
      htmlAttrs: { lang: "fr" },
      meta: [{ charset: "utf-8" }],
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
    },
  },

  css: ["./app/assets/css/main.css"],

  vite: {
    plugins: [
      tailwindcss(),
    ],
  },

  modules: [
    "motion-v/nuxt",
    "@nuxt/eslint",
    "@nuxt/image",
    "@nuxtjs/prismic",
    "@nuxtjs/seo",
    "@nuxt/ui",
  ],

  // Module Configuration
  prismic: {
    endpoint: apiEndpoint || repositoryName,
    preview: "/api/preview",
    clientConfig: {
      routes: [
        { type: "page", uid: "home", path: "/" },
        { type: "page", path: "/:uid" },
      ],
    },
  },

  eslint: {
    config: {
      standalone: false,
    },
  },

  colorMode: {
    preference: "light",
    fallback: "light",
  },
});
