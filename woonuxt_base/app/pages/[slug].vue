<script setup lang="ts">
// @ts-nocheck
const route = useRoute();
const slug = route.params.slug as string;

// Fetch WP post by slug
const { data } = await (useAsyncGql as any)('getPost', { slug });
const post = computed(() => data.value?.post || null);

if (!post.value) {
  throw showError({ statusCode: 404, statusMessage: 'Post not found' });
}

// Basic SEO
useSeoMeta({
  title: post.value?.title || 'Blog',
  description: (post.value?.excerpt || '').replace(/<[^>]*>/g, '').slice(0, 160),
  ogTitle: post.value?.title || 'Blog',
  ogDescription: (post.value?.excerpt || '').replace(/<[^>]*>/g, '').slice(0, 200),
});
</script>

<template>
  <main class="container py-8 xl:max-w-5xl" v-if="post">
    <article class="prose prose-invert max-w-none">
      <header class="mb-6">
        <h1 class="text-3xl font-semibold text-[#C1C6E3]" v-html="post.title" />
        <div class="mt-2 text-sm text-[#A3ABD9]" v-if="post.date">
          {{ new Date(post.date).toLocaleDateString() }}
        </div>
        <NuxtImg
          v-if="post.featuredImage?.node?.sourceUrl"
          class="mt-6 rounded-lg"
          :src="post.featuredImage.node.sourceUrl"
          :alt="post.featuredImage.node.altText || ''"
          :width="post.featuredImage.node.mediaDetails?.width || 1200"
          :height="post.featuredImage.node.mediaDetails?.height || 630"
          sizes="100vw sm:800px lg:1200px" />
      </header>

      <div v-html="post.content" />
    </article>
  </main>
</template>
