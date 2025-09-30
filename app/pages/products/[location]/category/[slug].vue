<template>
    <section class="container mt-8 mx-auto xl:w-5/6 lg:w-11/12 w-full pt-4">
        <h1 class="text-xl md:ml-0 ml-2 md:text-3xl font-semibold mb-4">
            {{ routeLocation === 'stock' ? 'Товари на складі'  : 'Під замовлення' }} </h1>
        <h2>
          {{ categoryName }}
        </h2>
        <template v-if="loading || !productList.length " >
            <CardLoader />
        </template>
        <template v-else>
            <section class="gap-4 grid grid-cols-2 lg:grid-cols-4 md:grid-cols-3">
                <ProductCard v-for="product in productList.slice(0, 40)" :key="product.id" :product="product" />
            </section>
        </template>

    </section>


</template>
<script setup>

import useFetchData from '@/composables/use-fetchdata';
const route = useRoute()
const routeLocation = computed(() => route.params.location) // stock or preorder
const selectedSlug = computed(() => route.params.slug || '')

const { bySlug } = useCategories()

const categoryId = computed(() => bySlug.value[selectedSlug.value]?.id ?? null)
const categoryName = computed(() => bySlug.value[selectedSlug.value]?.name ?? null)
// const selectedCategory = computed(() => findIdBySlug(selectedSlug.value))

const url = computed(() => {
    const base = `https://marktim.shop/api/v1/public/${routeLocation.value}/`
    return categoryId.value
        ? `${base}?category=${encodeURIComponent(categoryId.value)}`
        : base
})

const key = computed(() => `products-${routeLocation.value}-${selectedSlug.value || 'all'}`)

const { data, error: productError } = useFetchData(key, url)
const loading = computed(() => !data.value && !productError.value && categoryId.value && categoryName.value)
const productList = computed(() => {
    return data.value?.data ?? []
})

console.log(selectedSlug.value)
console.log(categoryId.value)

</script>