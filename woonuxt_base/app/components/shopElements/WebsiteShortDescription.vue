<script setup lang="ts">
const { description } = useAppConfig();
</script>

<template>
  <p class="mt-4 text-sm text-[#C1C6E3] xl:max-w-md">{{ description }}</p>
</template>
