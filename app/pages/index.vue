<template>
  <section class="container mt-2 md:mt-8 mx-auto xl:w-5/6 lg:w-11/12 w-full pt-4">
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

const config = useRuntimeConfig()
import useApiGet from '~/composables/useGetApi'

const page = ref(1)
const limit = 24
const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

const url = computed(() =>
  `/public/stock/active_supplies/?limit=${limit}&offset=${(page.value - 1) * limit}`
)

const key = computed(() => `active-supplies-page-${page.value}`)


const { data, pending: loading, error: productError } = useApiGet(() => key.value, url)


const productList = computed(() => data.value?.data ?? [])
const totalCount = computed(() => data.value?.count ?? 0)


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
  ogUrl: 'https://marktim.shop',
  canonical: 'https://marktim.shop',
  twitterCard: 'summary_large_image',
  twitterImage: ogImage,
  twitterTitle: seoTitle,
  twitterDescription: seoDescription
})


watch(
  productError,
  (err) => {
    if (err) {
      console.error('Active supplies fetch error', err)
      // const status = err.statusCode || err.status || 500
      // throw createError({ statusCode: status, message: err.message || 'Fetch error' })
    }
  },
  { immediate: true }
)

definePageMeta({ breadcrumbs: false })
</script>
