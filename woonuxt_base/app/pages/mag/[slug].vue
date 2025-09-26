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
        <div class="flex flex-col gap-4 md:flex-row md:items-center">
          <div class="md:flex-1">
            <h1 class="text-3xl font-semibold text-white" v-html="post.title" />
            <div class="mt-4 text-[#FFDEDE]" v-if="post.excerpt" v-html="post.excerpt" />
            <div class="mt-2 text-sm text-[#A3ABD9]" v-if="post.date">
              {{ new Date(post.date).toLocaleDateString() }}
            </div>
          </div>

          <NuxtImg
            v-if="post.featuredImage?.node?.sourceUrl"
            class="rounded-md md:shrink-0 w-[200px] h-[200px] object-cover"
            :src="post.featuredImage.node.sourceUrl"
            :alt="post.featuredImage.node.altText || ''"
            :width="200"
            :height="200"
            sizes="200px" />
        </div>
      </header>

      <div v-html="post.content" />
    </article>
  </main>
</template>
