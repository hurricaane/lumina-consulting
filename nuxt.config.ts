import tailwindcss from "@tailwindcss/vite";
import vue from "@vitejs/plugin-vue";

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
      htmlAttrs: { lang: "fr" },
      meta: [{ charset: "utf-8" }],
      link: [
        { rel: "icon", type: "image/png", sizes: "96x96", href: "/favicon-96x96.png" },
        { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
        { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
        { rel: "manifest", href: "/site.webmanifest" },
      ],
    },
  },

  css: ["./app/assets/css/main.css"],

  vite: {
    plugins: [
      tailwindcss(),
    ],
  },

  nitro: {
    rollupConfig: {
      plugins: [
        vue(),
      ],
    },
  },

  routeRules: {
    "/atelier": { redirect: { to: "/a-propos", statusCode: 301 } },
  },

  modules: [
    "motion-v/nuxt",
    "@nuxt/eslint",
    "@nuxt/image",
    "@nuxtjs/prismic",
    "@nuxtjs/seo",
    "@nuxt/ui",
    "@vercel/analytics",
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

  site: {
    name: "Lumina Consulting",
    url: "https://luminaconsulting.fr",
    separator: "·",
  },

  sitemap: {
    sources: ["/api/__sitemap__/prismic"],
    exclude: ["/slice-simulator", "/api/preview"],
  },
});
