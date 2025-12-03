<template>
  <div class="container mx-auto xl:w-5/6 lg:w-11/12 w-full pt-4 mt-4">
    <section v-if="categoryName && !pending && productList.length !== 0">
      <Breadcrumbs :items="items" class="mb-6 ml-2" />
      <section class="gap-4 grid grid-cols-2 lg:grid-cols-4 md:grid-cols-3" v-if="categoryId">
        <ProductCard v-for="product in productList" :key="product.id" :product="product" />
      </section>

      <div class="mt-6 flex justify-center" v-if="!loading">
        <UPagination
          v-model:page="page"
          :show-controls="false"
          :total="totalCount"
          active-color="neutral"
          active-variant="subtle"
          :items-per-page="limit"
          show-edges
          @update:page="scrollToTop"
        />
      </div>
    </section>

    <section v-else-if="!pending && productList.length === 0" class="ml-2">
      <p class="text-gray-500 mb-6 text-center">
        Продукти в даній категорії відсутні
      </p>
      <div class="w-54 mx-auto">
        <AppButton><NuxtLink to="/">на головну</NuxtLink></AppButton>
      </div>
    </section>

    <section v-else>
      <HeaderLoader />
      <CardLoader />
    </section>
  </div>
</template>

<script setup>
import useApiGet from '~/composables/useGetApi'
const config = useRuntimeConfig()
const route = useRoute()


const routeLocation = computed(() => route.params.location) 
const selectedSlug = computed(() => route.params.slug || '')


const { data: categoriesRaw } = useNuxtData('categories')
const list = computed(() =>
  Array.isArray(categoriesRaw.value?.data) ? categoriesRaw.value.data.filter(c => c?.id) : []
)
const bySlug = computed(() => Object.fromEntries(list.value.map(c => [c.slug, c])))
const categoryId = computed(() => bySlug.value[selectedSlug.value]?.id ?? null)
const categoryName = computed(() => bySlug.value[selectedSlug.value]?.name ?? null)


const limit = 24
const page = ref(1)
const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })


const url = computed(() => {
  const base = `/api/v1/public/${routeLocation.value}/`
  const offset = (page.value - 1) * limit

  if (categoryId.value) {
    return `${base}?category=${encodeURIComponent(categoryId.value)}&limit=${limit}&offset=${offset}`
  }
  return `${base}?limit=${limit}&offset=${offset}`
})


const key = computed(() => `products-${routeLocation.value}-category-${selectedSlug.value}-page-${page.value}`)


const { data, error: requestError, pending } = useApiGet(() => key.value, url)


const loading = computed(() => !data.value && !requestError.value)
const productList = computed(() => data.value?.data ?? [])
const totalCount = computed(() => data.value?.count ?? 0)


const routeLabel = computed(() => (routeLocation.value === 'stock' ? 'Товари на складі' : 'Під замовлення'))
const items = computed(() => [
  { label: 'Головна', to: '/' },
  { label: routeLabel.value, to: `/products/${routeLocation.value}` },
  { label: categoryName.value }
])


const canonicalBase = computed(() => `${config.public.siteUrl}/products/${routeLocation.value}/category`)
const canonicalUrl = computed(() => {
  const slugPart = selectedSlug.value ? `/${selectedSlug.value}` : ''
  const pagePart = page.value > 1 ? `?page=${page.value}` : ''
  return `${canonicalBase.value}${slugPart}${pagePart}`
})

const seoTitle = computed(() =>
  categoryName.value ? `${categoryName.value} — ${routeLabel.value}` : `${routeLabel.value} | MarkTim Shop`
)

const seoDescription = computed(() =>
  categoryName.value
    ? `${categoryName.value} ${routeLocation.value === 'stock' ? 'в наявності' : 'під замовлення'} — обирайте з асортименту MarkTim Shop. Безпечна оплата й доставка по Україні.`
    : `Товари ${routeLabel.value} у MarkTim Shop. Обирайте найкращі товари з доставкою по Україні.`
)

const ogImage = computed(() => `${config.public.siteUrl}/og-default.png`)

useSeoMeta({
  title: seoTitle,
  description: seoDescription,
  ogTitle: seoTitle,
  ogDescription: seoDescription,
  ogImage: ogImage,
  ogImageAlt: seoTitle,
  ogUrl: canonicalUrl,
  canonical: canonicalUrl,
  twitterCard: 'summary_large_image',
  twitterImage: ogImage,
  twitterTitle: seoTitle,
  twitterDescription: seoDescription
})


watch(
  requestError,
  (err) => {
    if (err) {

      // const status = err.statusCode || err.status || 500
      // throw createError({ statusCode: status, message: err.message || 'Fetch error' })

      console.error('Category fetch error', err)
    }
  },
  { immediate: true }
)
</script>