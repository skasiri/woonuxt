<script setup lang="ts">
const { wishlistLink } = useAuth();
</script>

<template>
  <nav>
    <NuxtLink :to="$localePath('/')">{{ $t('messages.general.home') }}</NuxtLink>
    <NuxtLink :to="$localePath('/products')">{{ $t('messages.general.allProducts') }}</NuxtLink>
    <NuxtLink :to="$localePath('/categories')">{{ $t('messages.shop.category', 2) }}</NuxtLink>
    <NuxtLink :to="$localePath('/contact')">{{ $t('messages.general.contact') }}</NuxtLink>
    <NuxtLink class="lg:hidden" :to="$localePath(wishlistLink)" :prefetch="false">{{ $t('messages.general.wishlist') }}</NuxtLink>
    <NuxtLink class="lg:hidden" :to="$localePath('/my-account')" :prefetch="false">{{ $t('messages.general.myAccount') }}</NuxtLink>
  </nav>
</template>
