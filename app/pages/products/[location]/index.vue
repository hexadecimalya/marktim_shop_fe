<template>
    <section class="container mt-2 md:mt-8 mx-auto xl:w-5/6 lg:w-11/12 w-full pt-4">
        <!-- <SearchBar v-show="routeLocation === 'stock'" @update:search="onSearch" /> -->
        <!-- not loading AND there are products -->
        <template v-if="pending">
            <CardLoader />
        </template>
        <template v-else-if="!pending && productList.length">
            <Breadcrumbs :items="items" class="mb-6 ml-2" />
            <section class="gap-4 grid grid-cols-2 lg:grid-cols-4 md:grid-cols-3">
                <ProductCard v-for="product in productList" :key="product.id" :product="product" />

            </section>
            <div class="mt-6 flex justify-center" v-if="!pending">
                <UPagination v-model:page="page" :show-controls="false" :total="totalCount" active-color="neutral"
                    active-variant="subtle" :items-per-page="limit" show-edges @update:page="scrollToTop" />
            </div>
        </template>


        <!-- loading AND there is a search query -->

        <template v-else-if="!pending && !error && productList.length === 0">
            <p class="text-gray-500 mb-6 mt-4 text-center font-medium">
                Нема товарів для показу
            </p>
            <div class="w-54 mx-auto">
                <AppButton>
                    <NuxtLink to="/">на головну</NuxtLink>
                </AppButton>
            </div>
        </template>
        <template v-else-if="error">
            <p>error</p>
        </template>

    </section>


</template>
<script setup>

import useApiGet from '~/composables/useGetApi'
const limit = 100
const page = ref(1)
const searchTerm = ref('')
const route = useRoute()
const routeLocation = computed(() => route.params.location)

const url = computed(() => {
    const offset = (page.value - 1) * limit
    const base = `/api/v1/public/${routeLocation.value}/`

    return searchTerm.value.length > 2
        ? `${base}?filter_param=${encodeURIComponent(searchTerm.value)}&limit=${limit}&offset=${offset}`
        : `${base}?limit=${limit}&offset=${offset}`
})
const config = useRuntimeConfig()
const routeLabel = computed(() => routeLocation.value === 'stock' ? 'Товари на складі' : 'Під замовлення')
const { data, pending, error, refresh } = useApiGet(
    () => `products-${routeLocation.value}-page-${page.value}-search-${searchTerm.value}`,
    url
)

const productList = computed(() => data.value?.data || [])
const totalCount = computed(() => data.value?.count || 0)

const onSearch = (val) => {
    searchTerm.value = val
    page.value = 1
}
const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })



const items = computed(() => [
  {
    label: 'Головна',
    to: '/',
  },
  {
    label: routeLabel.value,
    to: `/products/${routeLocation.value}`,
  },
  {
    label: 'Всі товари'
  }
])

// SEO section
const canonicalUrl = computed(() =>
    `${config.public.siteUrl}/${routeLocation.value}/`
)

const seoTitle = computed(() =>
    `Європейські продукти ${routeLabel.value.toLowerCase()} в MarkTim Shop`
)

const seoDescription = computed(() =>
    `Товари ${routeLabel.value.toLowerCase()} у MarkTim Shop. Обирайте найкращі товари з доставкою по Україні.`
)


useSeoMeta({
    title: seoTitle,
    description: seoDescription,

    ogTitle: seoTitle,
    ogDescription: seoDescription,
    ogImage: () => `${config.public.siteUrl}/og-default.png`,
    ogUrl: canonicalUrl,
    canonical: canonicalUrl,

    twitterCard: 'summary_large_image',
    twitterImage: () => `${config.public.siteUrl}/og-default.png`,
    twitterTitle: seoTitle,
    twitterDescription: seoDescription,
})


</script>