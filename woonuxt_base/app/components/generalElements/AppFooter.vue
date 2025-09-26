<script setup lang="ts">
const { wooNuxtVersionInfo } = useHelpers();
const { wishlistLink } = useAuth();
</script>

<template>
  <footer class="bg-[#060b2f] text-[#C1C6E3] order-last">
    <div class="container flex flex-wrap justify-between gap-12 my-24 md:gap-24">
      <div class="mr-auto">
        <Logo />
        <WebsiteShortDescription />
        <LangSwitcher class="mt-8" />
      </div>
      <div class="w-3/7 lg:w-auto">
        <div class="mb-1 font-semibold">{{ $t('messages.general.information') }}</div>
        <div class="text-sm">
          <a class="py-1.5 block" href="https://github.com/scottyzen/woonuxt?tab=readme-ov-file#next-generation-front-end-for-woocommerce" target="_blank">{{
            $t('messages.general.about')
          }}</a>
          <a href="/" class="py-1.5 block">{{ $t('messages.general.careers') }}</a>
          <a href="/" class="py-1.5 block">{{ $t('messages.general.press') }}</a>
          <a href="https://woonuxt.com/faq" class="py-1.5 block" rel="noreferrer" target="_blank">{{ $t('messages.general.faqs') }}</a>
        </div>
      </div>
      <div class="w-3/7 lg:w-auto">
        <div class="mb-1 font-semibold">{{ $t('messages.shop.products') }}</div>
        <div class="text-sm">
          <NuxtLink :to="$localePath('/products')" class="py-1.5 block">{{ $t('messages.shop.newArrivals') }}</NuxtLink>
          <NuxtLink :to="$localePath('/products?filter=sale[true]')" class="py-1.5 block">{{ $t('messages.shop.onSale') }}</NuxtLink>
          <NuxtLink :to="$localePath('/products?orderby=rating&order=ASC&filter=rating[1]')" class="py-1.5 block">{{ $t('messages.shop.topRated') }}</NuxtLink>
          <a href="/" class="py-1.5 block">{{ $t('messages.shop.giftCards') }}</a>
        </div>
      </div>
      <div class="w-3/7 lg:w-auto">
        <div class="mb-1 font-semibold">{{ $t('messages.general.customerService') }}</div>
        <div class="text-sm">
          <NuxtLink :to="$localePath('/contact')" class="py-1.5 block">{{ $t('messages.general.contactUs') }}</NuxtLink>
          <a href="/" class="py-1.5 block">{{ $t('messages.general.shippingAndReturns') }}</a>
          <a href="/" class="py-1.5 block">{{ $t('messages.general.privacyPolicy') }}</a>
          <a href="/" class="py-1.5 block">{{ $t('messages.general.termsAndConditions') }}</a>
        </div>
      </div>
      <div class="w-3/7 lg:w-auto">
        <div class="mb-1 font-semibold">{{ $t('messages.account.myAccount') }}</div>
        <div class="text-sm">
          <NuxtLink :to="$localePath('/my-account/')" class="py-1.5 block">{{ $t('messages.account.myAccount') }}</NuxtLink>
          <NuxtLink :to="$localePath('/my-account/?tab=orders')" class="py-1.5 block">{{ $t('messages.shop.orderHistory') }}</NuxtLink>
          <NuxtLink :to="$localePath(wishlistLink)" class="py-1.5 block">{{ $t('messages.shop.wishlist') }}</NuxtLink>
          <a href="/" class="py-1.5 block">{{ $t('messages.general.newsletter') }}</a>
        </div>
      </div>
    </div>
    <div class="container border-t flex items-center justify-center mb-4">
      <div class="copywrite">
        <p class="py-4 text-xs text-center">
          <a href="https://woonuxt.com" :title="`WooNuxt v${wooNuxtVersionInfo}`">{{ `WooNuxt v${wooNuxtVersionInfo}` }}</a> - by
          <a href="https://scottyzen.com" title="Scott Kennedy - Web Developer" target="_blank">Scott Kennedy</a>
        </p>
      </div>
      <SocialIcons class="ml-auto" />
    </div>
  </footer>
</template>

<style scoped lang="postcss">
a {
  @apply hover:underline;
}
</style>
