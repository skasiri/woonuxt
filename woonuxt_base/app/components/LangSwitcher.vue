<script setup>
const { locales, locale, setLocale, setLocaleCookie } = useI18n();

watch(locale, async (newLocale, oldLocale) => {
  if (newLocale && newLocale !== oldLocale) {
    await setLocale(newLocale);
    setLocaleCookie(newLocale);
  }
});
</script>

<template>
  <select id="language-switcher" v-model="locale" aria-label="Language switcher" class="bg-white">
    <option v-for="l in locales" :key="l.code" :value="l.code" v-html="l.name" />
  </select>
</template>
