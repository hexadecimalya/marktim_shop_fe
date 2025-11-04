<template>
  <!-- <div class="max-w-4xl lg:max-w-6xl container mx-auto p-2 my-2 md:my-4 lg:my-18 sm:p-6 border-2 border-gray-200/25 md:shadow-2xl"> -->
  <div
    class="max-w-4xl lg:max-w-6xl container mx-auto p-2 my-0 md:my-4 lg:my-12 sm:p-6 border-0 sm:border-1 border-gray-200 rounded-sm  ">
    <h1 class="font-semibold text-2xl mb-6">Кошик</h1>

    <!-- Empty cart state -->
    <template v-if="!loading && cart.stockItems.length === 0 && cart.preorderItems.length === 0" class="py-12">
      <h2 class="text-xl font-medium text-gray-600 mb-2 text-center">Йой! В кошику пусто... </h2>
      <p class="text-gray-500 mb-6 text-center">Схоже, що сюди не додали жодного товару.</p>
      <div class="w-54 mx-auto mb-6">
        <AppButton>
          <NuxtLink to="/">Розпочати покупки</NuxtLink>
        </AppButton>
      </div>
    </template>
    <template v-else-if="loading">
      <SummaryCardLoader />
    </template>

    <!-- Cart with items -->
    <template v-else-if="!loading" class="sm:p-4 p-0">
      <div v-if="stockItems.length" class="md:mb-8 mb-2">
        <div class="flex flex-col lg:flex-row sm:gap-6 gap-2">
          <div class="flex-1">
            <h2 class="md:text-lg font-semibold mb-4">Товари на складі</h2>
            <div v-for="item in stockItems" :key="item.id">
              <div class="grid grid-cols-5 md:grid-cols-6 items-start text-sm sm:my-4 my-1">
                <img :src="item.image" :alt="item.name" width="85" class="rounded-xs col-span-1">
                <div class="col-span-3 md:col-span-4">
                  <div class="line-clamp-1">{{ item.name }}</div>
                  <div>{{ item.price }} грн</div>
                  <div class="sm:inline-block flex justify-between items-center">
                    <div class="font-semibold flex items-center my-1">
                      <button @click="updateQty(item, item.quantity - 1)" :disabled="item.quantity <= 1"
                        class="mr-2 flex items-center">
                        <UIcon name="i-solar:minus-square-bold" class="sm:w-6 sm:h-6  w-7 h-7 opacity-80" />
                      </button>
                      <span class="text-gray-700">{{ item.quantity }}</span>
                      <button @click="updateQty(item, item.quantity + 1)" class="mx-2 flex items-center">
                        <UIcon name="i-solar:add-square-bold" class="sm:w-6 sm:h-6 w-7 h-7 opacity-80" />
                      </button>
                    </div>
                    <div @click="remove(item)" class="underline cursor-pointer">Видалити</div>
                  </div>
                </div>

                <div class="col-span-1 justify-self-end flex font-semibold text-xs sm:text-base">
                  <div class="sm:mr-2">{{ (item.price * item.quantity).toFixed(2) }} грн</div>
                </div>
              </div>
              <USeparator v-if="item.id !== stockItems[stockItems.length - 1].id" />
            </div>
          </div>
          <USeparator orientation="vertical" icon="i-solar:alt-arrow-right-outline"
            class="h-auto lg:inline-flex hidden" />
          <USeparator icon="i-solar:alt-arrow-down-outline" class="w-auto inline-flex lg:hidden" />
          <!-- RIGHT: Stock order summary -->
          <div class="w-full lg:w-80 lg:shrink-0 relative ">
            <h2 class="md:text-lg font-semibold mb-4">Замовлення</h2>
            <div class="space-y-2 mb-4 md:text-base text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600">Сума</span>
                <span class="font-medium">{{ stockSubtotal.toFixed(2) }} грн</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Знижка -3%</span>
                <!-- <span class="font-medium text-mtwine-800">- {{ stockDiscount.toFixed(2) }} грн</span> -->
              </div>
              <USeparator />
              <div class="pt-2 mt-2 flex justify-between">
                <span class="font-medium">Всього</span>
                <span class="font-bold">{{ stockSubtotal.toFixed(2) }} грн</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="preorderItems.length">
        <USeparator type="dashed" class="mb-8" />
        <div class="flex flex-col lg:flex-row sm:gap-6 gap-2">
          <div class="flex-1">
            <h2 class="md:text-lg font-semibold mb-4">Під замовлення</h2>
            <div v-for="item in preorderItems" :key="item.id">
              <div class="grid grid-cols-5 md:grid-cols-6 items-start text-sm sm:my-4 my-1">
                <img :src="item.image" :alt="item.name" width="100" class="rounded-xs col-span-1">
                <div class="col-span-3 md:col-span-4">
                  <div class="line-clamp-1">{{ item.name }}</div>
                  <div>{{ item.price }} грн {{ item.bulk_price ? `/ ${item.bulk_price}` : '' }} грн </div>
                  <div class="sm:inline-block flex justify-between items-center">
                    <div class="font-semibold flex items-center my-1">
                      <button @click="updateQty(item, item.quantity - 1)" :disabled="item.quantity <= 1"
                        class="mr-2 flex items-center">
                        <UIcon name="i-solar:minus-square-bold" class="sm:w-6 sm:h-6  w-7 h-7 opacity-80" />
                      </button>
                      <span class="text-gray-700">{{ item.quantity }}</span>
                      <button @click="updateQty(item, item.quantity + 1)" class="mx-2 flex items-center">
                        <UIcon name="i-solar:add-square-bold" class="sm:w-6 sm:h-6 w-7 h-7 opacity-80" />
                      </button>
                    </div>
                    <div @click="remove(item)" class="underline cursor-pointer">Видалити</div>
                  </div>
                </div>

                <div class="col-span-1 justify-self-end flex font-semibold text-xs sm:text-base">
                  <div class="sm:mr-2">{{ item.quantity === 1 ? (item.price * item.quantity).toFixed(2) :
                    (item.bulk_price * item.quantity).toFixed(2) }} грн</div>
                </div>
              </div>
              <USeparator v-if="item.id !== preorderItems[preorderItems.length - 1].id" />
            </div>
          </div>
          <USeparator orientation="vertical" icon="i-solar:alt-arrow-right-outline"
            class="h-auto lg:inline-flex hidden" />
          <USeparator icon="i-solar:alt-arrow-down-outline" class="w-auto inline-flex lg:hidden" />
          <!-- RIGHT: Preorder summary -->
          <div class="w-full lg:w-80 lg:shrink-0 relative min-h-60">
            <h2 class="md:text-lg font-semibold mb-4">Замовлення</h2>
            <div class="space-y-2 mb-4 md:text-base text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600">Сума</span>
                <span class="font-medium">{{ preorderSubtotal.toFixed(2) }} грн</span>
              </div>
              <div class="flex justify-between">
                <!-- <span class="text-gray-600">Знижка -3%</span> -->
                <!-- <span class="font-medium text-mtwine-800">- {{ preorderDiscount.toFixed(2) }} грн</span> -->
              </div>
              <USeparator />
              <div class="pt-2 mt-2 flex justify-between">
                <span class="font-medium">Всього</span>
                <!-- <span class="font-bold">{{ preorderSubtotal.toFixed(2) }} грн</span> -->
              </div>
            </div>

          </div>
        </div>
      </div>
      <div class="md:w-56 mx-auto">
        <NuxtLink to="/checkout">
          <AppButton>продовжити</AppButton>
        </NuxtLink>
      </div>

    </template>
    <!-- <template v-if="goShipping">
      Shipping
    </template> -->
  </div>


</template>

<script setup>
import { storeToRefs } from 'pinia'
import AppButton from '~/components/UI/app-button.vue';

let loading = ref(true)

const cart = useCartStore()
const {
  stockItems,
  preorderItems,
  stockSubtotal,
  preorderSubtotal,
  // stockDiscount,
  // preorderDiscount,
  // stockTotal,
  preorderTotal
} = storeToRefs(cart)

onMounted(() => {
  loading.value = false
})


const updateQty = (item, newQty) => {
  cart.updateQuantity(item.id, newQty)
}

const remove = (item) => {
  cart.removeItem(item.id)
}

// const route = useRoute()
// const runtimeConfig = useRuntimeConfig()

// const canonicalUrl = computed(() =>
//   new URL(route.path, runtimeConfig.public.siteUrl).toString()
// )


useSeoMeta({
  title: 'Оформлення замовлення',
  description: 'Перевірте ваші товари, заповніть дані доставки і завершіть замовлення у MarkTim Shop — швидко, просто і зручно.',
  ogTitle: 'Оформлення замовлення | MarkTim Shop',
  ogDescription: 'Оформіть замовлення у MarkTim Shop всього за кілька кроків: товари, дані доставки та підтвердження.',
  ogType: 'website',

  // ogUrl: canonicalUrl.value,

  twitterCard: 'summary_large_image',

  robots: 'noindex, nofollow',
  googleBot: 'noindex, nofollow, noimageindex',
  // canonical: canonicalUrl.value
})

</script>