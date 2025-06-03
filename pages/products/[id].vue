<template>
    <Breadcrumbs />
    <div
        class="lg:container sm:mt-8 mx-auto flex sm:flex-row flex-col justify-center bg-green-300 sm:bg-orange-200 md:bg-fuchsia-300 lg:bg-blue-200">
        <!-- <div class="lg:container sm:mt-8 mx-auto flex sm:flex-row flex-col justify-center bg-green-300 sm:bg-orange-200 md:bg-fuchsia-300 lg:bg-blue-200 "> -->

        <!-- <img class="sm:w-1/2" :src="product.product.files[0].link" /> -->
        <img class="sm:w-1/2" v-if="product.product && product.product.files && product.product.files[0]"
            :src="product.product.files[0].link" />

        <div class="p-4 lg:ml-4 md:w-2/5">
            <h1 class="font-semibold uppercase">Тут має бути ваша фірма</h1>
            <h2 class="text-base my-2 font-normal text-justify">
                {{ product.product.name_ukr }}
            </h2>
            <div class="text-xl sm:my-4 font-semibold">{{ product.sell_price }} грн</div>
            <div class="my-4">
                <div class="text-xs font-medium mb-0">кількість</div>
                <QuantityButton />
                <button class=" w-full h-12 bg-green-300 rounded-sm hover:bg-green-600 uppercase text-sm font-medium">До
                    кошика</button>
            </div>
        </div>
    </div>
    <div class="lg:container sm:mt-8 mx-auto p-4  ">
        <h1 class="font-semibold text-2xl"> Загальна інформація</h1>
        <div v-if="product.product.description" class="border-t border-dotted mt-2 py-2 text-justify">{{
            product.product.description_ukr }}</div>
        <div v-else class="border-t-2 border-dotted mt-2 py-2 text-justify">{{ productDescription }}</div>


    </div>
</template>

<script setup>
import useFetchData from '@/composables/use-fetchdata'
const productDescription = "By default the plugin will look for this file in the same directory as your Prettier configuration file. However, if your Tailwind configuration is somewhere else, you can specify this using the tailwindConfig option in your Prettier configuration"
const route = useRoute()
const { data, error: productError, pending: loading } = useFetchData(
    `product-${route.params.id}`,
    `https://marktim.shop/api/v1/public/stock/${route.params.id}/`
);

const product = computed(() => {
    return data.value ?? {}
})
console.log(route.params.id)
// console.log(data.value)

</script>