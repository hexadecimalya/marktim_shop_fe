<template>
    <section class="container mt-8 mx-auto xl:w-5/6 lg:w-11/12 w-full pt-4">
        <template v-if="loading || !productList.length">
            <CardLoader />
        </template>
        <template v-else>
            <Breadcrumbs :items="items" class="mb-6" />
            <section class="gap-4 grid grid-cols-2 lg:grid-cols-4 md:grid-cols-3">
                <ProductCard v-for="product in productList" :key="product.id" :product="product" />
                <!-- <ProductCard v-for="product in productList.slice(0, 40)" :key="product.id" :product="product" /> -->
            </section>
          <div class="mt-6 flex justify-center" v-if="!loading ">
                <UPagination v-model:page="page" :show-controls="false" :total="totalCount" active-color="neutral" :items-per-page="limit" show-edges />
            </div>
        </template>
    </section>


</template>
<script setup>
import CardLoader from '@/components/UI/card-loader.vue';
import useFetchData from '~/composables/useFetchData';
const route = useRoute()
const routeLocation = computed(() => route.params.location)
const limit = 24
const page = ref(1)
const totalCount = computed(() => data.value?.count ?? 0)
// const totalPages = computed(() => Math.ceil(totalCount.value / limit))
const url = computed(() => {
    return `https://marktim.shop/api/v1/public/${routeLocation.value}/?limit=${limit}&offset=${(page.value - 1) * limit}`
}
)

const key = computed(() => `products-${routeLocation.value}-page-${page.value}`)
const routeLabel = routeLocation.value === 'stock' ? 'Товари на складі' : 'Під замовлення'
const { data, error: productError } = useFetchData(key, url)
const productList = computed(() => {
    return data.value?.data ?? []
})

const loading = computed(() => !data.value && !productError.value)
// console.log(totalPages.value)
// watchEffect(() => console.log('total count is:', totalCount.value))

const items = ref([
    {
        label: 'Головна',
        to: '/',
    },
    {
        label: routeLabel,
        to: `/products/${route.params.location}`,
    },
    {
        label: 'Всі товари'
    },

]
)

</script>