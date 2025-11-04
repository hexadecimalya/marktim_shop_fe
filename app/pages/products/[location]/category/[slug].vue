<template>
    <div class="container mx-auto xl:w-5/6 lg:w-11/12 w-full pt-4 mt-4">
        <section v-if="categoryName && status !== 'pending' && productList.length !== 0">
            <Breadcrumbs :items="items" class="mb-6" />
            <section class="gap-4 grid grid-cols-2 lg:grid-cols-4 md:grid-cols-3" v-if="categoryId">
                <ProductCard v-for="product in productList" :key="product.id" :product="product" />
            </section>
            <div class="mt-6 flex justify-center" v-if="!loading ">
                <UPagination v-model:page="page" :show-controls="false" :total="totalCount" active-color="neutral" active-variant="subtle"
                    :items-per-page="limit" show-edges />
            </div>
        </section>
        <section v-else-if="status !== 'pending' && productList.length === 0" class="ml-2">
            <div class="mb-6">
                Продукти в даній категорії відсутні
            </div>
            <div class="w-54 mx-auto">
                <AppButton>
                    <NuxtLink to="/">на головну</NuxtLink>
                </AppButton>
            </div>
        </section>
        <section v-else>
            <HeaderLoader />
            <CardLoader />
        </section>
    </div>
</template>

<script setup>

const route = useRoute()
const routeLocation = computed(() => route.params.location) // stock or preorder

const selectedSlug = computed(() => route.params.slug || '')

const { data: categoriesRaw } = useNuxtData('categories') // sync access to cached value
const list = computed(() => Array.isArray(categoriesRaw.value.data) ? categoriesRaw.value.data.filter(c => c?.id) : [])
const bySlug = computed(() => Object.fromEntries(list.value.map(c => [c.slug, c])))
const categoryId = computed(() => bySlug.value[route.params.slug]?.id ?? null)
const categoryName = computed(() => bySlug.value[selectedSlug.value]?.name ?? null)
const routeLabel = routeLocation.value === 'stock' ? 'Товари на складі' : 'Під замовлення'
const limit = 24
const page = ref(1)
const totalCount = computed(() => data.value?.count ?? 0)
const url = computed(() => {
    const base = `https://marktim.shop/api/v1/public/${routeLocation.value}/`
    return categoryId.value ? `${base}?category=${encodeURIComponent(categoryId.value)}&limit=${limit}&offset=${(page.value - 1) * limit}` : `${base}/?limit=${limit}&offset=${(page.value - 1) * limit}`
})

const key = computed(() => `products-${routeLocation.value}-${selectedSlug.value}-${page.value}`)
const { data, error: requestError, status } = useFetchData(key, url)
const loading = computed(() => !data.value && !requestError.value)
const productList = computed(() => {
    return data.value?.data ?? []
})

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
        label: categoryName
    },

]
)
// SEO section

const canonicalBase = computed(() => `'http://localhost:3000/products/${routeLocation.value}/category`)
const canonicalUrl = computed(() => {
    const slugPart = selectedSlug.value ? `/${selectedSlug.value}` : ''
    const pagePart = page.value > 1 ? `?page=${page.value}` : ''
    return `${canonicalBase.value}${slugPart}${pagePart}`
})

const seoTitle = computed(() => {
    if (categoryName.value) return `${categoryName.value} — ${routeLabel}`
    return `${routeLabel} | 'MarkTim Shop'`
})

const seoDescription = computed(() => {
    if (categoryName.value) {
        return `${categoryName.value} ${routeLocation.value === 'stock' ? 'в наявності' : 'під замовлення'} — обирайте з асортименту MarkTim Shop. Безпечна оплата й доставка по Україні.`
    }
    return `Товари ${routeLabel} у MarkTim Shop. Обирайте найкращі товари з доставкою по Україні.`
})

watchEffect(() => {
    useSeoMeta({
        title: seoTitle.value,
        description: seoDescription.value,
        ogTitle: seoTitle.value,
        ogDescription: seoDescription.value,
        ogImage: 'http://localhost:3000/og-default.png',
        ogImageAlt: seoTitle.value,
        ogUrl: canonicalUrl.value,
        canonical: canonicalUrl.value,
        twitterCard: 'summary_large_image',
        twitterImage: 'http://localhost:3000/og-default.png',
        twitterTitle: seoTitle.value,
        twitterDescription: seoDescription.value,
    })
})



</script>