<template>
    <section class="container mt-8 mx-auto xl:w-5/6 lg:w-11/12 w-full pt-4">
        <h1 class="text-xl md:ml-0 ml-2 md:text-3xl font-semibold mb-4">Товари в наявності </h1>
        <template v-if="loading">
            <CardLoader />
        </template>
        <template v-else>
            <section class="gap-4 grid grid-cols-2 lg:grid-cols-4 md:grid-cols-3">
                <ProductCard v-for="product in products.slice(0, 40)" :key="product.id" :product="product"
                     />
            </section>
        </template>

    </section>


</template>
<script setup>
import useFetchData from '~/composables/use-fetchdata';


const products = computed(()=> {
    return data.value?.data ?? []
})


const { data, error: productError, pending: loading } = useFetchData(
  'products',
  'https://marktim.shop/api/v1/public/stock/?page_size=10'
);

if (productError.value) {
  console.error('Error fetching products:', categoryError.value);
}

// console.log("here are the prods", data.value)

// onMounted(() => {
//     fetchData("https://marktim.shop/api/v1/public/stock/?page_size=10")
// })



</script>