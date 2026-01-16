<template>
    <section class="container mt-2 md:mt-8 mx-auto xl:w-5/6 lg:w-11/12 w-full pt-4">
        <SearchBar />
        <template v-if="pending">
            <CardLoader />
        </template>

        <template v-else-if="productList.length">
            <Breadcrumbs :items="items" class="mb-6 ml-2" />

            <section class="gap-4 grid grid-cols-2 lg:grid-cols-4 md:grid-cols-3">
                <ProductCard v-for="product in productList" :key="product.id" :product="product" />
            </section>

            <div class="mt-6 flex justify-center">
                <UPagination v-model:page="page" :total="totalCount" :items-per-page="limit" active-variant="subtle"
                    active-color="neutral" :show-controls="false" show-edges @update:page="scrollToTop" />
            </div>
        </template>

        <template v-else-if="!pending && !error">
            <p class="text-gray-500 mb-6 mt-4 text-center font-medium">
                Нема товарів для показу
            </p>

            <div class="w-54 mx-auto">
                <AppButton>
                    <NuxtLink to="/">на головну</NuxtLink>
                </AppButton>
            </div>
        </template>

        <template v-else>
            <p>error</p>
        </template>

    </section>
</template>

<script setup>
import useApiGet from '~/composables/useGetApi'

const limit = 24
const page = ref(1)

const route = useRoute()
const routeLocation = computed(() => route.params.location)

const url = computed(() => {
    const offset = (page.value - 1) * limit
    return `/public/${routeLocation.value}/?limit=${limit}&offset=${offset}`
})

const { data, pending, error } = useApiGet(
    () => `products-${routeLocation.value}-page-${page.value}`,
    url
)

// const productList = computed(() => data.value?.data || [])
const productList = computed(() => Array.isArray(data.value?.data) ? data.value.data : [])
const totalCount = computed(() => data.value?.count || 0)

const scrollToTop = () =>
    window.scrollTo({ top: 0, behavior: 'smooth' })

const routeLabel = computed(() =>
    routeLocation.value === 'stock' ? 'Товари на складі' : 'Під замовлення'
)

const items = computed(() => [
    { label: 'Головна', to: '/' },
    { label: routeLabel.value, to: `/products/${routeLocation.value}` },
    { label: 'Всі товари' }
])

// SEO
const config = useRuntimeConfig()

const canonicalUrl = computed(() =>
    `${config.public.siteUrl}/products/${routeLocation.value}/`
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
    canonical: canonicalUrl
})
</script>