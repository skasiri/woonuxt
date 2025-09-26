import { createResolver } from '@nuxt/kit';
import { defineNuxtConfig } from 'nuxt/config';

const { resolve } = createResolver(import.meta.url);

// Environment variables with fallbacks
const GQL_HOST = process.env.GQL_HOST || 'http://localhost:4000/graphql';
const APP_HOST = process.env.APP_HOST || 'http://localhost:3000';

export default defineNuxtConfig({
  compatibilityDate: '2025-08-10',

  app: {
    head: {
      htmlAttrs: { lang: 'en', dir: 'ltr' },
      link: [{ rel: 'icon', href: '/logo.svg', type: 'image/svg+xml' }],
    },
    pageTransition: { name: 'page', mode: 'default' },
  },

  plugins: [resolve('./app/plugins/init.ts'), resolve('./app/plugins/i18n-direction.client.ts')],

  components: [{ path: resolve('./app/components'), pathPrefix: false }],

  modules: [resolve('./modules/woonuxt-bridge.ts'), 'nuxt-graphql-client', '@nuxtjs/tailwindcss', '@nuxt/icon', '@nuxt/image', '@nuxtjs/i18n'],

  'graphql-client': {
    clients: {
      default: {
        host: GQL_HOST,
        corsOptions: { mode: 'cors', credentials: 'include' },
        headers: { Origin: APP_HOST },
      },
    },
  },

  alias: {
    '#constants': resolve('./app/constants'),
    '#woo': '../.nuxt/gql/default',
  },

  hooks: {
    'pages:extend'(pages) {
      const addPage = (name: string, path: string, file: string) => {
        pages.push({ name, path, file: resolve(`./app/pages/${file}`) });
      };

      addPage('product-page-pager', '/products/page/:pageNumber', 'products.vue');
      addPage('product-category-page', '/product-category/:categorySlug', 'product-category/[slug].vue');
      addPage('product-category-page-pager', '/product-category/:categorySlug/page/:pageNumber', 'product-category/[slug].vue');
      addPage('order-received', '/checkout/order-received/:orderId', 'order-summary.vue');
      addPage('order-summary', '/order-summary/:orderId', 'order-summary.vue');
    },
  },

  nitro: {
    routeRules: {
      '/checkout/order-received/**': { prerender: false },
      '/order-summary/**': { prerender: false },
    },
  },

  // Multilingual support
  i18n: {
    locales: [
      { code: 'en', file: 'en-US.json', name: 'English 🇺🇸' },
      { code: 'de', file: 'de-DE.json', name: 'Deutsch 🇩🇪' },
      { code: 'es', file: 'es-ES.json', name: 'Español 🇪🇸' },
      { code: 'fr', file: 'fr-FR.json', name: 'Français 🇫🇷' },
      { code: 'it', file: 'it-IT.json', name: 'Italiano 🇮🇹' },
      { code: 'pt', file: 'pt-BR.json', name: 'Português 🇧🇷' },
      { code: 'ru', file: 'ru-RU.json', name: 'Русский 🇷🇺' },
      { code: 'ar', file: 'ar-SA.json', name: 'العربية 🇸🇦' },
      { code: 'fa', file: 'fa-IR.json', name: 'فارسی 🇮🇷' },
    ],
    langDir: 'locales',
    defaultLocale: 'en',
    strategy: 'prefix_except_default',
    restructureDir: false,
  },
});
