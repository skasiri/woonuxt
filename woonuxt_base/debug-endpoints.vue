<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Debug Endpoints</h1>

    <div class="mb-4">
      <h2 class="text-xl font-semibold mb-2">Runtime Config:</h2>
      <pre class="bg-gray-100 p-4 rounded">{{ JSON.stringify(config.public.localeGqlEndpoints, null, 2) }}</pre>
    </div>

    <div class="mb-4">
      <h2 class="text-xl font-semibold mb-2">Current Locale Info:</h2>
      <pre class="bg-blue-100 p-4 rounded">{{ JSON.stringify(localeInfo, null, 2) }}</pre>
    </div>

    <div class="mb-4">
      <h2 class="text-xl font-semibold mb-2">Environment Variables:</h2>
      <pre class="bg-green-100 p-4 rounded">{{ JSON.stringify(envVars, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup>
const config = useRuntimeConfig();
const { getLocaleInfo } = useLocaleGqlSimple();

const localeInfo = getLocaleInfo();

// Show environment variables that are available
const envVars = {
  LOCALE_GQL_RU_ENDPOINT: process.env.LOCALE_GQL_RU_ENDPOINT,
  LOCALE_GQL_EN_ENDPOINT: process.env.LOCALE_GQL_EN_ENDPOINT,
  NODE_ENV: process.env.NODE_ENV,
  // Add more as needed
};
</script>
