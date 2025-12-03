<template>
  <section class="py-4 md:py-8 px-4 max-w-5xl mx-auto">
    <h1 class="text-2xl md:text-3xl font-semibold py-4">Нова поставка</h1>

    <template v-if="loading || !productList.length">
      <CardLoader />
    </template>

    <template v-else>
      <section class="gap-4 grid grid-cols-2 lg:grid-cols-4 md:grid-cols-3">
        <ProductCard v-for="product in productList" :key="product.id" :product="product" />
      </section>

      <div class="mt-6 flex justify-center" v-if="!loading">
        <UPagination
          v-model:page="page"
          :show-controls="false"
          :total="totalCount"
          active-color="neutral"
          active-variant="subtle"
          :items-per-page="limit"
          show-edges
          @update:page="scrollToTop"
        />
      </div>
    </template>
  </section>
</template>

<script setup>

import useApiGet from '~/composables/useGetApi'
const config = useRuntimeConfig()

// pagination & UI
const page = ref(1)
const limit = 24
const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

// computed URL + key (reactive)
const url = computed(() =>
  `/api/v1/public/stock/active_supplies/?limit=${limit}&offset=${(page.value - 1) * limit}`
)

const key = computed(() => `active-supplies-page-${page.value}`)

// fetch (NO await) — composable should watch url for SSR & SEO-safe refetch
const { data, pending: loading, error: productError } = useApiGet(() => key.value, url)

// derived
const productList = computed(() => data.value?.data ?? [])
const totalCount = computed(() => data.value?.count ?? 0)

// SEO (pass computed refs, not .value)
const seoTitle = computed(() => 'Головна сторінка — MarkTim Shop')
const seoDescription = computed(() =>
  'MarkTim – інтернет-магазин якісних європейських товарів. Широкий асортимент, гарантована якість та швидка доставка по Україні.'
)
const ogImage = computed(() => `${config.public.siteUrl}/og-default.png`)

useSeoMeta({
  title: seoTitle,
  description: seoDescription,
  ogTitle: seoTitle,
  ogDescription: seoDescription,
  ogImage: ogImage,
  ogUrl: computed(() => `${config.public.siteUrl}/`),
  canonical: computed(() => `${config.public.siteUrl}/`),
  twitterCard: 'summary_large_image',
  twitterImage: ogImage,
  twitterTitle: seoTitle,
  twitterDescription: seoDescription
})

// optional: handle fetch errors server-side (SSR-friendly)
watch(
  productError,
  (err) => {
    if (err) {
      console.error('Active supplies fetch error', err)
      // optionally throw to surface 4xx/5xx on SSR:
      // const status = err.statusCode || err.status || 500
      // throw createError({ statusCode: status, message: err.message || 'Fetch error' })
    }
  },
  { immediate: true }
)

definePageMeta({ breadcrumbs: false })
</script>
