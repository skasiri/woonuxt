<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">ProductTabs Test</h1>

    <div class="mb-4">
      <h2 class="text-xl font-semibold mb-2">Test 1: با local_product</h2>
      <ProductTabs :product="mainProduct" :local_product="localProduct" />
    </div>

    <div class="mb-4">
      <h2 class="text-xl font-semibold mb-2">Test 2: بدون local_product</h2>
      <ProductTabs :product="mainProduct" />
    </div>

    <div class="mb-4">
      <h2 class="text-xl font-semibold mb-2">Test 3: local_product ناقص</h2>
      <ProductTabs :product="mainProduct" :local_product="incompleteLocalProduct" />
    </div>
  </div>
</template>

<script setup>
// Test data
const mainProduct = {
  description: '<p>This is the main product description in English.</p>',
  reviewCount: 5,
};

const localProduct = {
  description: '<p>این توضیحات محصول به زبان فارسی است.</p>',
  reviewCount: 8,
};

const incompleteLocalProduct = {
  description: '<p>توضیحات فارسی ناقص</p>',
  // reviewCount missing - should fallback to main product
};
</script>
