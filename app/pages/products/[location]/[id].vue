<template>

    <div v-if="product && product.product" class="container mx-auto xl:w-5/6 lg:w-11/12 w-full pt-4 mt-0 sm:mt-4">
        <Breadcrumbs class="hidden sm:inline-block" :items="items" />
    
        <div class="lg:container sm:mt-8 mt-0 mx-auto flex sm:flex-row flex-col justify-center">
            <img class="sm:w-1/2" :src="product.product.files[0]?.link ?? placeholder" />

            <div class="p-4 lg:ml-4 md:w-2/5">
                <!-- <h1 class="font-semibold uppercase">Тут має бути ваша фірма</h1> -->
                <h2 class="text-base my-2 font-medium text-justify">
                    {{ product.product.name_ukr }}
                </h2>
                <div class="text-xl sm:my-4 font-semibold">{{ Math.trunc(product.sell_price) }} грн {{
                    product.bulk_price
                        ? `/ ${Math.trunc(product.bulk_price)} грн від 2 шт` : '' }}</div>
                <div v-if="!isInCart" class="my-4">
                    <div class="text-xs font-medium mb-0">кількість</div>
                    <div
                        class="flex flex-row h-12 w-full rounded-md relative bg-transparent my-4 border border-gray-100 ">
                        <button class="hover:bg-gray-200 h-full w-1/3 rounded-l cursor-pointer outline-none"
                            @click="decQuantity">
                            <span class="m-auto text-2xl">−</span>
                        </button>
                        <input
                            class="outline-none focus:outline-none text-center w-1/3 font-semibold text-md flex items-center"
                            name="custom-input-number" :value="quantity"></input>
                        <button class="hover:bg-gray-200 h-full w-1/3 rounded-r cursor-pointer" @click="incQuantity">
                            <span class="m-auto text-2xl">+</span>
                        </button>
                    </div>
                    <AppButton @click="handleAddToCart"
                        class="w-full h-12 not-[]:rounded-xs uppercase text-xs font-medium tracking-normal justify-center"
                        icon="lucide-circle-plus" trailing>Додати до кошика
                    </AppButton>
                </div>
                <div v-else class="mt-4 sm:mt-28 mb-4">
                    <NuxtLink to="/shopping-cart">
                        <UButton
                            class="w-full h-12 not-[]:rounded-sm uppercase text-xs font-medium text-mtgreen-50 tracking-normal justify-center bg-mtgreen-300  hover:bg-mtgreen-400"
                            icon="lucide-circle-arrow-right" trailing>Оформити замовлення</UButton>
                    </NuxtLink>
                </div>
                <div v-if="categoriesList.length">
                    <!-- Категорії: -->
                    <UBadge class="mx-2 my-2" size="md" color="neutral" variant="outline"
                        v-for="category in categoriesList" :key="category.slug">
                        <NuxtLink :to="`/products/${routeLocation}/category/${category.slug}`">
                            {{ category.name }}
                        </NuxtLink>
                    </UBadge>
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
    <div v-else>
        <ProductLoader />
    </div>
    <!-- <div v-else-if="productError" class="text-center text-4xl font-mono text-red-500 mt-8">Something went wrong
    </div> -->

</template>
<script setup>
import useFetchData from '~/composables/useFetchData'
import ProductLoader from '@/components/UI/product-loader.vue';
import placeholder from '@/assets/image_placeholder_big.png'

const route = useRoute()
const routeLocation = route.params.location // stock or preorder
const routeLabel = routeLocation === 'stock' ? 'Товари на складі' : 'Під замовлення'


const cart = useCartStore()
const prodId = Number(route.params.id)

const isInCart = computed(() =>
    cart.stockItems.some(i => i.id === prodId) ||
    cart.preorderItems.some(i => i.id === prodId)
)

const quantity = ref(1)
const incQuantity = () => quantity.value++
const decQuantity = () => quantity.value = Math.max(1, quantity.value - 1)

const handleAddToCart = () => {
    const payload = {
        id: prodId,
        name: product.value.product.name_ukr ||
            product.value.product.name,
        price: product.value.sell_price,
        bulkPrice: product.value.bulk_price,
        image: product.value.product.files[0].link,
        quantity: quantity.value,
        isPreorder: routeLocation === 'preorder'
    }
    if (isInCart.value) {
        cart.updateQuantity(prodId, quantity.value)
    } else {
        cart.addItem(payload)
    }
}


// console.log(route)
const { data, error: productError } = useFetchData(
    `product-${route.params.id}`, computed(() => `https://marktim.shop/api/v1/public/${routeLocation}/${route.params.id}/`)
);

const product = computed(() => data.value ?? {})

if (productError.value) {
    throw createError({ statusCode: 404, statusMessage: 'Такого продукту не знайдено' })
}
// const { previous, goBackFallback } = usePreviousRoute()
// console.log(previous.value)

const items = computed(() => [
    {
        label: 'Головна',
        to: '/',
    },
    {
        label: routeLabel,
        to: `/products/${route.params.location}`,
    },
    {
        label: product.value?.product?.name_ukr ?? null,
    },
]
)

const categoriesList = computed(() => product.value?.product?.categories ?? [])

// SEO section

const canonicalUrl = computed(() => `http://localhost:3000/products/${routeLocation}/${route.params.id}`)
const seoTitle = computed(() => {
    return product.value?.product?.name_ukr || 'Цей смаколик саме доступний до замовлення'
})

const seoDescription = computed(() => {
    return `Купуйте ${product.value?.product?.name_ukr} від Brand у MarkTim Shop за ${product.value.sell_price} грн. Доставка по всій Україні.` || `Від повсякденних продуктів до вишуканих делікатесів - обирайте найкращі товари з доставкою по Україні.`
})

const seoImage = computed(() => product.value?.product?.files?.[0]?.link ?? "http://localhost:3000/og-default.png")


watchEffect(() => {
    useSeoMeta({
        title: seoTitle.value,
        description: seoDescription.value,
        ogTitle: seoTitle.value,
        ogDescription: seoDescription.value,
        ogImage: seoImage.value,
        ogImageAlt: seoTitle.value,
        ogUrl: canonicalUrl.value,
        canonical: canonicalUrl.value,
        twitterCard: 'summary_large_image',
        twitterImage: seoImage.value,
        twitterTitle: seoTitle.value,
        twitterDescription: seoDescription.value,
    })
})


</script>