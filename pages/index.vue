<template>
  <section class="container mt-8 mx-auto xl:w-5/6 lg:w-11/12 w-full pt-4">
    <h1 class="text-xl md:ml-0 ml-2 md:text-3xl font-semibold mb-4">Нова поставка </h1>
    <template v-if="loading || !productList.length">
      <CardLoader />
    </template>
    <template v-else>
      <section class="gap-4 grid grid-cols-2 lg:grid-cols-4 md:grid-cols-3">
        <ProductCard v-for="product in productList.slice(0, 8)" :key="product.id" :product="product" />
      </section>
    </template>
  </section>
  <section class="container mt-8 mx-auto xl:w-5/6 lg:w-11/12 w-full pt-4">
    <h1 class="text-xl md:ml-0 ml-2 md:text-3xl font-semibold mb-4">Так смакує світ </h1>
    <div class="flex justify-center items-center">
      <UCarousel v-slot="{ item }"  :ui="{ item: 'lg:basis-1/4 basis-1/3' }"  dots :items="items" class="flex justify-center">
        <img :src="item" width="234" height="234" class="rounded-xs">
      </UCarousel>
    </div>

  </section>
  <!-- <section class="py-12 px-4 max-w-5xl mx-auto">
    <h2 class="text-3xl font-semibold mb-4">Наш підхід</h2> 
    <div class="grid md:grid-cols-4 grid-cols-2 sm:gap-16 gap-8 text-center">
      <div>
      <img src="/assets/cat-italy.jpg" class="rounded-xs" alt="">
        <div class="font-semibold">Італія</div>
         <div class="text-sm">завітайте до нас персонально або робіть замовлення на зручному сайті</div>
      </div>
      <div>
        <UIcon name="i-solar-delivery-linear" class="size-8" />
        <div class="font-semibold">Іспанія</div>
        <div class="text-sm">ваші замовлення блискавично передаються транспортній службі</div>
      </div>
      <div>
        <UIcon name="i-solar-sale-linear" class="size-8" />
        <div class="font-semibold">Азія</div>
        <div class="text-sm">персоналізовані картки лояльності для приємного шопінгу</div>
      </div>
      <div>
        <UIcon name="i-solar-gift-linear" class="size-8" />
        <div class="font-semibold">Франція</div>
        <div class="text-sm">підберемо ідеальний подарунок для самого вибагливого гурмана</div>
      </div>
    </div>
  </section> -->
</template>

<script setup>
import CardLoader from '@/components/UI/card-loader.vue';
import useFetchData from '@/composables/use-fetchdata';


const productList = computed(() => {
  return data.value?.data ?? []
})

const items = [
  '/Users/alinapantina/Documents/Marktim/marktim-nuxt-latest/mt-fe/assets/cat-asia.jpg',
  'https://picsum.photos/468/468?random=2',
  'https://picsum.photos/468/468?random=3',
  'https://picsum.photos/468/468?random=4',
  'https://picsum.photos/468/468?random=5',
  'https://picsum.photos/468/468?random=6'
]

const { data, error: productError, pending: loading } = useFetchData(
  'products',
  'https://marktim.shop/api/v1/public/stock/?page_size=10'
);

if (productError.value) {
  console.error('Error fetching products:', productError.value);
}
useSeoMeta({
  title: 'Головна сторінка',
  ogTitle: 'MarkTim Shop – Європейські товари високої якості',
  description: 'MarkTim – інтернет-магазин якісних європейських товарів. Широкий асортимент, гарантована якість та швидка доставка по Україні.',
  ogDescription: 'Відкрийте для себе світ європейської якості з MarkTim Shop. У нас ви знайдете унікальні товари, гарантований сервіс та швидку доставку. Зробіть перше замовлення і переконайтеся самі!',
  ogImage: 'https://example.com/image.png',
  twitterCard: 'summary_large_image',
})
</script>
