<template>
    <Breadcrumbs />
      <div v-if="product && product.product" :key="product">
        <div
            class="lg:container sm:mt-8 mx-auto flex sm:flex-row flex-col justify-center bg-green-300 sm:bg-orange-200 md:bg-fuchsia-300 lg:bg-blue-200">
            <img class="sm:w-1/2" :src="product.product.files[0].link" />

            <div class="p-4 lg:ml-4 md:w-2/5">
                <h1 class="font-semibold uppercase">Тут має бути ваша фірма</h1>
                <h2 class="text-base my-2 font-normal text-justify">
                    {{ product.product.name_ukr }}
                </h2>
                <div class="text-xl sm:my-4 font-semibold">{{ product.sell_price }} грн</div>
                <div class="my-4">
                    <div class="text-xs font-medium mb-0">кількість</div>
                    <QuantityButton />
                    <button
                        class=" w-full h-12 bg-green-300 rounded-sm hover:bg-green-600 uppercase text-sm font-medium">До
                        кошика</button>
                </div>
            </div>
        </div>
        <div class="lg:container sm:mt-8 mx-auto p-4  ">
            <h1 class="font-semibold text-2xl"> Загальна інформація</h1>
            <div v-if="product.product.description" class="border-t border-dotted mt-2 py-2 text-justify">{{
                product.product.description_ukr }}</div>
            <div v-else class="border-t-2 border-dotted mt-2 py-2 text-justify text-sm">Потрібен детальніший опис чи порада? Зв’яжіться з нами – ми з радістю допоможемо!</div>
        </div>
    </div>
    <div v-else>
        <ProductLoader />
    </div>
    <!-- <div v-else class="text-center text-4xl font-mono text-red-500 mt-8">Something went wrong</div> -->

</template>
<script setup>
import useFetchData from '@/composables/use-fetchdata'
import ProductLoader from '@/components/UI/product-loader.vue';

const route = useRoute()
const { data, error: productError, pending: loading } = useFetchData(
    `product-${route.params.id}`,
    `https://marktim.shop/api/v1/public/stock/${route.params.id}/`);

const product = computed(() => {
    const fetched_data = data.value ?? {}
    console.log(fetched_data)
    if (fetched_data && fetched_data.product){
        useSeoMeta({
            title: ()=> `${fetched_data.product.name_ukr} – ${fetched_data.product.categories[0].name} | Купити в MarkTim Shop`,
            //   title: ()=> `${product.value.product.name_ukr} – ${product.value.category} | ${product.value.brand} | Купити в MarkTim Shop`,
            //   description: `Купуйте ${product.value.name} від ${product.value.brand} у MarkTim Shop. Доставка по всій Україні.`,
            //   ogTitle: `${product.value.product.name_ukr} – ${product.value.brand} | MarkTim Shop`,
            //   ogDescription: `Відкрийте ${product.category} від ${product.value.brand} у MarkTim Shop! Європейська якість, швидка доставка.`,
            //   ogImage: product.value.product.files[0].link,
            //   ogUrl: `https://marktim.shop/products/${product.id}`,
            //   canonical: `https://marktim.shop/products/${product.id}`,
            //   keywords: `${product.value.product.name_ukr}, ${product.value.brand}, ${product.value.category}, купити, доставка по Україні`,
            //   productPriceAmount: product.value.sell_price,
            //   productBrand: product.value.brand,
            //   twitterCard: 'summary_large_image'
        });
    }
    
    return fetched_data
})

</script>