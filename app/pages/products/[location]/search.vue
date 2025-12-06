<template>
    <section class="container mt-2 md:mt-8 mx-auto xl:w-5/6 lg:w-11/12 w-full pt-4">
        <SearchBar />
        <template v-if="pending">
            <CardLoader />
        </template>

        <template v-else-if="!pending && productList.length">
            <Breadcrumbs :items="items" class="mb-6 ml-2" />
            <section class="gap-4 grid grid-cols-2 lg:grid-cols-4 md:grid-cols-3">
                <ProductCard v-for="product in productList" :key="product.id" :product="product" />
            </section>
            <div class="mt-6 flex justify-center" v-if="!pending">
                <UPagination v-model:page="page" :show-controls="false" :total="totalCount" :items-per-page="limit"
                    show-edges active-variant="subtle" active-color="neutral" @update:page="scrollToTop" />
            </div>
        </template>

        <template v-else-if="!pending && !error && productList.length === 0">
            <p class="text-gray-500  my-4 text-center font-medium">Нема товарів для показу</p>
            <div class="w-54 mx-auto">
                <AppButton>
                    <NuxtLink :to="`/products/${routeLocation}`">Повернутися до списку</NuxtLink>
                </AppButton>
            </div>
        </template>

        <template v-else-if="error">
            <p>error</p>
        </template>
    </section>
</template>

<script setup>
import { useRoute } from 'vue-router'
import useApiGet from '~/composables/useGetApi'

const limit = 25
const route = useRoute()
const routeLocation = computed(() => route.params.location)
const page = ref(Number(route.query.page ?? 1))
const searchTerm = computed(() => (route.query.q ?? '').toString())

const url = computed(() => {
    const offset = (page.value - 1) * limit
    const base = `/api/v1/public/${routeLocation.value}/`
    return searchTerm.value.length > 2
        ? `${base}?filter_param=${encodeURIComponent(searchTerm.value)}&limit=${limit}&offset=${offset}`
        : `${base}?limit=${limit}&offset=${offset}`
})

const cacheKey = computed(() => `products-${routeLocation.value}-search-${searchTerm.value}-page-${page.value}`)
const { data, pending, error, refresh } = useApiGet(cacheKey, url)

const productList = computed(() => data.value?.data || [])

const totalCount = computed(() => data.value?.count || 0)

const items = computed(() => [
    { label: 'Головна', to: '/' },
    { label: routeLocation.value === 'stock' ? 'Товари на складі' : 'Під замовлення', to: `/products/${routeLocation.value}` },
    { label: `Результати пошуку` }
])

const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

// keep reactive when user changes page via query param
watch(() => route.query.page, (val) => {
    page.value = Number(val ?? 1)
})
</script>