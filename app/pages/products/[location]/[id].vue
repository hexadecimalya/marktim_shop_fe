<template>

  <div v-if="!pending && product.product" class="container mx-auto xl:w-5/6 lg:w-11/12 w-full pt-4 mt-0 sm:mt-4">
    <Breadcrumbs class="hidden sm:inline-block" :items="items" />

    <div class="lg:container sm:mt-8 mt-0 mx-auto flex sm:flex-row flex-col justify-center">
      <img class="sm:w-1/2" :src="product.product.files[0]?.link ?? placeholder" />

      <div class="p-4 lg:ml-4 md:w-2/5">
        <h2 class="text-base my-2 font-medium text-justify">
          {{ product.product.name_ukr }}
        </h2>

        <div class="text-xl sm:my-4 font-semibold">
          {{ Math.trunc(product.sell_price) }} грн
          {{ product.bulk_price ? `/ ${Math.trunc(product.bulk_price)} грн від 2 шт` : '' }}
        </div>

        <div v-if="!isInCart" class="my-4">
          <div class="text-xs font-medium mb-0">кількість</div>
          <div class="flex flex-row h-12 w-full rounded-md relative bg-transparent my-4 border border-gray-100 ">
            <button class="hover:bg-gray-200 h-full w-1/3 rounded-l cursor-pointer outline-none" @click="decQuantity">
              <span class="m-auto text-2xl">−</span>
            </button>

            <input
              class="outline-none focus:outline-none text-center w-1/3 font-semibold text-md flex items-center"
              name="custom-input-number"
              :value="quantity"
            />

            <button class="hover:bg-gray-200 h-full w-1/3 rounded-r cursor-pointer" @click="incQuantity">
              <span class="m-auto text-2xl">+</span>
            </button>
          </div>

          <AppButton @click="handleAddToCart"
            class="w-full h-12 not-[]:rounded-xs uppercase text-xs font-medium tracking-normal justify-center"
            trailing>
            Додати до кошика
          </AppButton>
        </div>

        <div v-else class="mt-4 sm:mt-28 mb-4">
          <NuxtLink to="/shopping-cart">
            <UButton
              class="w-full h-12 not-[]:rounded-sm uppercase text-xs font-medium text-mtgreen-50 tracking-normal justify-center bg-mtgreen-300 hover:bg-mtgreen-400"
              trailing>
              Оформити замовлення
            </UButton>
          </NuxtLink>
        </div>

        <div v-if="categoriesList.length">
          <UBadge class="mx-2 my-2" size="md" color="neutral" variant="outline"
            v-for="category in categoriesList" :key="category.slug">
            <NuxtLink :to="`/products/${routeLocation}/category/${category.slug}`">
              {{ category.name }}
            </NuxtLink>
          </UBadge>
        </div>

      </div>
    </div>

    <div class="lg:container sm:mt-8 mx-auto p-4">
      <h1 class="font-semibold text-2xl mb-2"> Загальна інформація</h1>
      <USeparator />
      <div v-if="product.product.description" class="mt-2 py-2 text-justify">
        {{ product.product.description_ukr }}
      </div>
      <div v-else class="mt-2 text-justify text-sm">
        Потрібен детальніший опис чи порада? Зв’яжіться з нами – ми з радістю допоможемо!
      </div>
    </div>
  </div>

  <div v-else>
    <ProductLoader />
  </div>
</template>

<script setup>
import useApiGet from '~/composables/useGetApi' // your composable (uses useAsyncData internally)
import ProductLoader from '@/components/UI/product-loader.vue'
import placeholder from '@/assets/image_placeholder_big.png'

const config = useRuntimeConfig()
const route = useRoute()

const routeLocation = computed(() => route.params.location) // 'stock' or 'preorder'
const prodId = computed(() => Number(route.params.id))

const routeLabel = computed(() =>
  routeLocation.value === 'stock' ? 'Товари на складі' : 'Під замовлення'
)

const cart = useCartStore()
const isInCart = computed(() =>
  cart.stockItems.some(i => i.id === prodId.value) ||
  cart.preorderItems.some(i => i.id === prodId.value)
)

const quantity = ref(1)
const incQuantity = () => { quantity.value++ }
const decQuantity = () => { quantity.value = Math.max(1, quantity.value - 1) }

const handleAddToCart = () => {
  const p = product.value ?? {}
  const payload = {
    id: prodId.value,
    name: p.product?.name_ukr || p.product?.name || '',
    price: p.sell_price,
    bulkPrice: p.bulk_price,
    image: p.product?.files?.[0]?.link ?? placeholder,
    quantity: quantity.value,
    isPreorder: routeLocation.value === 'preorder'
  }

  if (isInCart.value) {
    cart.updateQuantity(prodId.value, quantity.value)
  } else {
    cart.addItem(payload)
  }
}


const url = computed(() => `/api/v1/public/${routeLocation.value}/${route.params.id}/`)

const { data, pending, error, refresh } = useApiGet(
  () => `product-${route.params.id}`,
  url
)

// product object (match old shape)
const product = computed(() => data.value ?? {})


watch(
  error,
  (err) => {
    if (err) {
      const status = err.statusCode || err.status || 404
      throw createError({ statusCode: status, message: err.message || 'Такого продукту не знайдено' })
    }
  },
  { immediate: true }
)

const items = computed(() => [
  { label: 'Головна', to: '/' },
  { label: routeLabel.value, to: `/products/${routeLocation.value}` },
  { label: product.value?.product?.name_ukr ?? product.value?.product?.name ?? null }
])

const categoriesList = computed(() => product.value?.product?.categories ?? [])

const canonicalUrl = computed(() => `${config.public.siteUrl}/${routeLocation.value}/${prodId.value}/`)
const seoTitle = computed(() => product.value?.product?.name_ukr || 'Цей смаколик доступний до замовлення')
const seoDescription = computed(() =>
  (product.value?.product?.name_ukr && product.value?.sell_price)
    ? `Купуйте ${product.value.product.name_ukr} від у MarkTim Shop за ${product.value.sell_price} грн. Доставка по всій Україні.`
    : `Від повсякденних продуктів до вишуканих делікатесів - обирайте найкращі товари з доставкою по Україні.`
)
const seoImage = computed(() => product.value?.product?.files?.[0]?.link ?? `${config.public.siteUrl}/og-default.png`)

useSeoMeta({
  title: seoTitle,
  description: seoDescription,
  ogTitle: seoTitle,
  ogDescription: seoDescription,
  ogImage: seoImage,
  ogImageAlt: seoTitle,
  ogUrl: canonicalUrl,
  canonical: canonicalUrl,
  twitterCard: 'summary_large_image',
  twitterImage: seoImage,
  twitterTitle: seoTitle,
  twitterDescription: seoDescription
})

// watch(pending, (v) => console.log('product pending:', v))
</script>
