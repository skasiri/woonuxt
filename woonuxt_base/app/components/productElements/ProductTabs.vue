<script setup lang="ts">
import { computed, ref } from 'vue';
import type { PropType } from 'vue';

interface Product {
  description?: string;
  reviewCount?: number;
}

const { product, local_product } = defineProps({
  product: { type: Object as PropType<Product>, required: true },
  local_product: { type: Object as PropType<Product>, required: false },
});
// Get store settings (assuming useAppConfig is available globally in Nuxt)
const { storeSettings } = (globalThis as any).useAppConfig?.() || { storeSettings: { showReviews: true } };

// Computed properties for locale-aware product data
const productDescription = computed(() => local_product?.description || product.description);
const productReviewCount = computed(() => local_product?.reviewCount || product.reviewCount);

const initialTab = productDescription.value ? 0 : 1;
const show = ref(initialTab);
</script>

<template>
  <div>
    <nav class="border-b flex gap-8 tabs">
      <button v-if="productDescription" type="button" :class="show === 0 ? 'active' : ''" @click.prevent="show = 0">
        {{ $t('messages.shop.productDescription') }}
      </button>
      <button v-if="storeSettings.showReviews" type="button" :class="show === 1 ? 'active' : ''" @click.prevent="show = 1">
        {{ $t('messages.shop.reviews') }} ({{ productReviewCount }})
      </button>
    </nav>
    <div class="tab-contents">
      <div v-if="show === 0 && productDescription" class="font-light mt-8 prose prose-invert text-[#C1C6E3]" v-html="productDescription" />
      <ProductReviews v-if="show === 1" :product="product" />
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.tabs button {
  @apply border-transparent border-b-2 text-lg pb-8;
  margin-bottom: -1px;
  color: #c1c6e3;
}

.tabs button.active {
  @apply border-primary;
  color: #c1c6e3;
}

.tab-contents h2,
.tab-contents h3 {
  color: #c1c6e3;
}
</style>
