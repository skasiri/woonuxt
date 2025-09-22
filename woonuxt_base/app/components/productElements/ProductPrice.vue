<script setup lang="ts">
interface ProductPriceProps {
  regularPrice?: string | null;
  salePrice?: string | null;
}

const { regularPrice, salePrice } = defineProps<ProductPriceProps>();
</script>

<template>
  <div v-if="regularPrice" class="flex font-semibold text-[#C1C6E3]">
    <span :class="{ 'text-[#C1C6E3] line-through font-normal': salePrice }" v-html="regularPrice" />
    <span v-if="salePrice" class="ml-2 text-[#FF6B00]" v-html="salePrice" />
  </div>
</template>
