<template>
  <!-- <section class="container mt-0 sm:mt-4 mx-auto xl:w-5/6 lg:w-11/12 w-full pt-4"> -->
  <section class="py-4 md:py-8 px-4 max-w-5xl mx-auto">
    <h1 class="text-2xl md:text-3xl font-semibold py-4">
      Нова поставка

    </h1>
    
    
    <template v-if="loading || !productList.length">
      <CardLoader />
    </template>
    <template v-else>
      <section class="gap-4 grid grid-cols-2 lg:grid-cols-4 md:grid-cols-3">
        <ProductCard v-for="product in productList" :key="product.id" :product="product" />
      </section>
      <div class="mt-6 flex justify-center" v-if="!loading">
        <UPagination v-model:page="page" :show-controls="false" :total="totalCount" active-color="neutral" active-variant="subtle"
          :items-per-page="limit" show-edges  @update:page="scrollToTop" />
      </div>
    </template>
  </section>

</template>

<script setup>
import CardLoader from '@/components/UI/card-loader.vue';
import useFetchData from '~/composables/useFetchData';
const page = ref(1)
const totalCount = computed(() => data.value?.count ?? 0)
const limit = 24
const productList = computed(() => {
  return data.value?.data ?? []
})
// create endpoint for supplies
const { data, error: productError, pending: loading } = useFetchData(
  'active-supplies',
  computed(() => `https://marktim.shop/api/v1/public/stock/active_supplies/?limit=${limit}&offset=${(page.value - 1) * limit}`)
);
const scrollToTop = () => window.scrollTo({ top:0, behavior: 'smooth'})

useSeoMeta({
  title: 'Головна сторінка',
  ogTitle: 'MarkTim Shop – Європейські товари високої якості',
  description: 'MarkTim – інтернет-магазин якісних європейських товарів. Широкий асортимент, гарантована якість та швидка доставка по Україні.',
  ogDescription: 'Відкрийте для себе світ європейської якості з MarkTim Shop. У нас ви знайдете унікальні товари, гарантований сервіс та швидку доставку. Зробіть перше замовлення і переконайтеся самі!',
})
definePageMeta({ breadcrumbs: false })
</script>
