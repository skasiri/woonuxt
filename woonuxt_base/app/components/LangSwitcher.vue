<script setup>
const { locales, locale, setLocaleCookie } = useI18n();
const switchLocalePath = useSwitchLocalePath();
const router = useRouter();

function onChange(event) {
  const newCode = event.target.value;
  setLocaleCookie(newCode);
  const path = switchLocalePath(newCode);
  router.push(path);
}
</script>

<template>
  <select id="language-switcher" :value="locale" aria-label="Language switcher" class="bg-white" @change="onChange">
    <option v-for="l in locales" :key="l.code" :value="l.code">
      <NuxtLink :to="switchLocalePath(l.code)" :lang="l.code">
        {{ l.name }}
      </NuxtLink>
    </option>
  </select>
</template>
