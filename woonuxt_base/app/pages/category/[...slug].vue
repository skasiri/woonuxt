<script setup lang="ts">
// @ts-nocheck
const route = useRoute();

// Build the WP URI from catch-all segments, e.g. ["pay-with-crypto","roblox"] -> "/category/pay-with-crypto/roblox/"
const slugSegments = (route.params.slug as string[]) || [];
const categoryUri = '/category/' + slugSegments.map((s) => encodeURIComponent(s)).join('/') + '/';

const first = 12;
const { data, execute } = await (useAsyncGql as any)('getPostCategoryByUri', { uri: categoryUri, first });
const category = computed(() => data.value?.category || null);
const posts = computed(() => category.value?.posts?.nodes || []);
const pageInfo = computed(() => category.value?.posts?.pageInfo || {});

if (!category.value) {
  throw showError({ statusCode: 404, statusMessage: 'Category not found' });
}

// SEO from WP SEO fields if available
useSeoMeta({
  title: category.value?.seo?.title || category.value?.name || 'Category',
  description: category.value?.seo?.metaDesc || (category.value?.description || '').replace(/<[^>]*>/g, '').slice(0, 160),
  ogTitle: category.value?.seo?.opengraphTitle || category.value?.name,
  ogDescription: category.value?.seo?.opengraphDescription || (category.value?.description || '').replace(/<[^>]*>/g, '').slice(0, 200),
});

// Simple client-side pagination (Load more)
const isLoadingMore = ref(false);
const loadMore = async () => {
  if (!pageInfo.value?.hasNextPage || isLoadingMore.value) return;
  isLoadingMore.value = true;
  await execute({ uri: categoryUri, first, after: pageInfo.value.endCursor });
  isLoadingMore.value = false;
};
</script>

<template>
  <main class="container py-8 xl:max-w-5xl" v-if="category">
    <header class="mb-8">
      <h1 class="text-3xl font-semibold text-white" v-html="category.name" />
      <div class="mt-4 prose prose-invert max-w-none" v-if="category.description" v-html="category.description" />
    </header>

    <section v-if="posts.length" class="grid gap-6 md:grid-cols-2">
      <article v-for="post in posts" :key="post.id" class="p-4 border rounded-lg border-white/20">
        <NuxtLink :to="`/${post.slug}`" class="block">
          <div class="flex gap-4">
            <NuxtImg
              v-if="post.featuredImage?.node?.sourceUrl"
              :src="post.featuredImage.node.sourceUrl"
              :alt="post.featuredImage.node.altText || ''"
              class="rounded-md w-[120px] h-[120px] object-cover"
              :width="120"
              :height="120"
              sizes="120px" />
            <div class="flex-1">
              <h2 class="text-xl font-semibold text-white" v-html="post.title" />
              <div class="mt-2 text-sm text-[#A3ABD9]" v-if="post.date">{{ new Date(post.date).toLocaleDateString() }}</div>
              <div class="mt-3 text-[#C1C6E3]" v-if="post.excerpt" v-html="post.excerpt" />
            </div>
          </div>
        </NuxtLink>
      </article>
    </section>

    <div v-else class="text-[#A3ABD9]">No posts found in this category.</div>

    <div class="mt-8 flex justify-center" v-if="pageInfo?.hasNextPage">
      <button class="px-4 py-2 text-sm font-semibold text-white border rounded-md border-white/30" :disabled="isLoadingMore" @click="loadMore">
        <span v-if="!isLoadingMore">Load more</span>
        <span v-else>Loading…</span>
      </button>
    </div>
  </main>
</template>
