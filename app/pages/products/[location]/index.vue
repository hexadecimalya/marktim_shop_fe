<template>
    <section class="container mt-8 mx-auto xl:w-5/6 lg:w-11/12 w-full pt-4">
        <h1 class="text-xl md:ml-0 ml-2 md:text-3xl font-semibold mb-4">{{ routeLocation === 'stock' ?'Товари на складі' : 'Під замовлення' }} </h1>
        <template v-if="loading || !productList.length">
           <CardLoader />
        </template>
        <template v-else>
            <section class="gap-4 grid grid-cols-2 lg:grid-cols-4 md:grid-cols-3">
                <ProductCard v-for="product in productList.slice(0, 40)" :key="product.id" :product="product"
                     />
            </section>
        </template>

    </section>


</template>
<script setup>
import CardLoader from '@/components/UI/card-loader.vue';
import useFetchData from '@/composables/use-fetchdata';
const route = useRoute()
const routeLocation = computed(() => route.params.location)
const url = computed(() =>
  `https://marktim.shop/api/v1/public/${routeLocation.value}/?page_size=10`
)
// const link = computed(() => routeLocation === 'in -stock' ? 'stock' : 'preorders' )
const key = computed(() => `products-${routeLocation.value}`)
const productList = computed(()=> {
    return data.value?.data ?? []
})

// const route = useRoute()
console.log(route.params.location)

const { data, error: productError } = useFetchData(key, url)


const loading = computed(() => !data.value && !productError.value)

</script>