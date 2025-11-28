<template>
    <section class="container mt-8 mx-auto xl:w-5/6 lg:w-11/12 w-full pt-4">
        <template v-if="pending && !productList.length">
            <CardLoader />
        </template>
        <template v-else-if="!pending && !productList.length">
            Нема активних передзамовлень
        </template>
        <template v-else>
            <Breadcrumbs :items="items" class="mb-6" />
            <section class="gap-4 grid grid-cols-2 lg:grid-cols-4 md:grid-cols-3">
                <ProductCard v-for="product in productList" :key="product.id" :product="product" />
                <!-- <ProductCard v-for="product in productList.slice(0, 40)" :key="product.id" :product="product" /> -->
            </section>
            <div class="mt-6 flex justify-center" v-if="!pending ">
                <UPagination v-model:page="page" :show-controls="false" :total="totalCount" active-color="neutral" active-variant="subtle"
                    :items-per-page="limit" show-edges @update:page="scrollToTop" />
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
const url = computed(() => {
    return `https://marktim.shop/api/v1/public/${routeLocation.value}/?limit=${limit}&offset=${(page.value - 1) * limit}`
}
)

const key = computed(() => `products-${routeLocation.value}-page-${page.value}`)
const routeLabel = routeLocation.value === 'stock' ? 'Товари на складі' : 'Під замовлення'
const { data, pending, error: productError } = useFetchData(key, url)
const productList = computed(() => {
    return data.value?.data ?? []
})
const scrollToTop = () => window.scrollTo({ top:0, behavior: 'smooth'})


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

// SEO section
const config = useRuntimeConfig()
const canonicalUrl = computed(() => `${config.public.siteUrl}/${routeLocation.value}/`)
const seoTitle = computed(() => {
    return `Європейські продукти ${routeLabel.toLowerCase()} в MarkTim Shop`
})

const seoDescription = computed(() => {
    return `Товари ${routeLabel.toLowerCase()} у MarkTim Shop. Обирайте найкращі товари з доставкою по Україні.`
})

watchEffect(() => {
    useSeoMeta({
        title: seoTitle.value,
        description: seoDescription.value,
        ogTitle: seoTitle.value,
        ogDescription: seoDescription.value,
        ogImage: `${config.public.siteUrl}/og-default.png`,
        ogUrl: canonicalUrl.value,
        canonical: canonicalUrl.value,
        twitterCard: 'summary_large_image',
        twitterImage: `${config.public.siteUrl}/og-default.png`,
        twitterTitle: seoTitle.value,
        twitterDescription: seoDescription.value,
    })
})

</script>