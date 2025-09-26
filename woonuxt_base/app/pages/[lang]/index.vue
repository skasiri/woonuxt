<script lang="ts" setup>
const { locales, setLocale, t } = useI18n();
const route = useRoute();

const lang = route.params.lang as string;

const exists = locales.value.some((l) => l.code === lang);

if (!exists) {
  throw showError({ statusCode: 404, statusMessage: t('messages.general.languageNotFound') });
}

setLocale(lang as any);
</script>

<template>
  <HomePage />
</template>
