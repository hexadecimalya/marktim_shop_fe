<template>

    <div v-if="product && product.product">

        <!-- <Breadcrumbs /> -->
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
            <div v-else class="border-t-2 border-dotted mt-2 py-2 text-justify text-sm">Потрібен детальніший опис чи
                порада? Зв’яжіться з нами – ми з радістю допоможемо!</div>
        </div>
    </div>
    <div v-else-if="loading">
        <ProductLoader />
    </div>
    <div v-else class="text-center text-4xl font-mono text-red-500 mt-8">Something went wrong</div>

</template>
<script setup>
import useFetchData from '@/composables/use-fetchdata'
import ProductLoader from '@/components/UI/product-loader.vue';

const route = useRoute()
// console.log(route)
const { data, error: productError, pending: loading } = useFetchData(
    `product-${route.params.id}`,
    `https://marktim.shop/api/v1/public/stock/${route.params.id}/`);


const product = computed(() => data.value ?? {})
watch(product, (updProduct) => {
    if (updProduct && updProduct.product) {
        useSeoMeta({
            title: updProduct.product.name_ukr || 'Цей смаколик саме доступний до замовлення',
            description: `Купуйте ${updProduct.product.name_ukr} від ${updProduct.product.brand} у MarkTim Shop. Доставка по всій Україні.` || 'Від повсякденних продуктів до вишуканих делікатесів - у нашому магазині ви знайдете все для своєї кухні',
            ogTitle: `${updProduct.product.name_ukr} – ${updProduct.brand} | MarkTim Shop`,
            ogDescription: `Відкрийте ${product.category} від ${updProduct.brand} у MarkTim Shop! Європейська якість, швидка доставка.`,
            ogImage: updProduct.product.files[0].link,
            ogUrl: `https://marktim.shop/products/${product.id}`,
            canonical: `https://marktim.shop/products/${product.id}`,
            keywords: `${updProduct.product.name_ukr}, ${updProduct.brand}, ${updProduct.category}, купити, доставка по Україні`,
            productPriceAmount: updProduct.sell_price,
            productBrand: updProduct.brand,
            twitterCard: 'summary_large_image'
        });

    }
})

</script>