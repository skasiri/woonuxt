<template>
  <div>
    <h1>Test Locale GraphQL</h1>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">Error: {{ error }}</div>
    <div v-else>
      <h2>Current Locale: {{ localeInfo.currentLocale }}</h2>
      <h2>Current Endpoint: {{ localeInfo.currentEndpoint }}</h2>
      <div v-if="localeData">
        <h3>Locale Data:</h3>
        <pre>{{ JSON.stringify(localeData, null, 2) }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup>
// Simple test query
const testQuery = `
  query {
    __schema {
      queryType {
        name
      }
    }
  }
`;

const { localeQuery, getLocaleInfo } = useLocaleGqlSimple();
const localeInfo = getLocaleInfo();
const localeData = ref(null);
const loading = ref(true);
const error = ref(null);

onMounted(async () => {
  try {
    console.log('Testing locale GraphQL...');
    console.log('Current locale:', localeInfo.currentLocale);
    console.log('Current endpoint:', localeInfo.currentEndpoint);

    const { data } = await localeQuery(testQuery);
    localeData.value = data;
    console.log('Locale data received:', data);
  } catch (err) {
    error.value = err.message;
    console.error('Error:', err);
  } finally {
    loading.value = false;
  }
});
</script>
