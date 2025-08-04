<template>
  <div class="max-w-4xl lg:max-w-6xl container mx-auto p-2 my-2 sm:p-6">
    <h1 class="font-semibold text-2xl mb-6">Кошик</h1>

    <!-- Empty cart state -->
    <div v-if="cart.items.length === 0" class="text-center py-12">
      <h2 class="text-xl font-medium text-gray-600 mb-2">Йой! В кошику пусто... </h2>
      <p class="text-gray-500 mb-6">Схоже, що сюди не додали жодного товару.</p>
      <button
        class="px-6 py-2 text-white font-semibold rounded-sm transition-colors uppercase text-sm bg-gray-800 hover:bg-gray-600">
        <NuxtLink to="/">Розпочати покупки</NuxtLink>
      </button>
    </div>

    <!-- Cart with items -->
    <!-- Cart items list -->
    <div v-else class="sm:p-4 p-0">
      <div class="flex flex-col lg:flex-row sm:gap-6 gap-2">
        <div class="flex-1">
          <h2 class="md:text-lg font-semibold mb-4">Товари</h2>
          <div v-for="item in items" :key="item.id">
            <div class="grid grid-cols-5 md:grid-cols-6 items-start text-sm sm:my-4 my-1">
              <img :src="item.image" :alt="item.name" width="100" class="rounded-xs col-span-1">
              <div class="col-span-3 md:col-span-4">
                <div class="line-clamp-1">{{ item.name }}</div>
                <div>{{ item.price }} грн</div>
                <div class="sm:inline-block flex justify-between items-center">
                  <div class="font-semibold flex items-center my-1">
                    <button @click="updateQty(item, item.quantity - 1)" :disabled="item.quantity <= 1" class="mr-2 flex items-center">
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
            <USeparator v-if="item.id !== items[items.length - 1].id" />
          </div>
        </div>
        <USeparator orientation="vertical" icon="i-solar:alt-arrow-right-outline"
          class="h-auto lg:inline-flex hidden" />
        <USeparator icon="i-solar:alt-arrow-down-outline" class="w-auto inline-flex lg:hidden" />
        <!-- RIGHT: Order summary -->
        <div class="w-full lg:w-80 lg:shrink-0 relative min-h-60">

          <h2 class="md:text-lg font-semibold mb-4">Замовлення</h2>

          <div class="space-y-2 mb-4 md:text-base text-sm">
            <div class="flex justify-between">
              <span class="text-gray-600">Сума</span>
              <span class="font-medium">{{ subtotal.toFixed(2) }} грн</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Знижка -3%</span>
              <span class="font-medium text-mtwine-800">- {{ discount.toFixed(2) }} грн</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Доставка</span>
              <span class="font-medium">Згідно тарифів перевізника</span>
            </div>
            <USeparator />
            <div class="pt-2 mt-2 flex justify-between">
              <span class="font-medium">Всього</span>
              <span class="font-bold">{{ total.toFixed(2) }} грн</span>
            </div>
          </div>

          <button
            class="absolute bottom-0 mt-auto w-full h-12 text-white font-semibold rounded-sm transition-colors  uppercase text-sm bg-gray-800 hover:bg-gray-600">
            Продовжити
          </button>
        </div>

      </div>
    </div>
  </div>


</template>

<script setup>
import { useCartStore } from '~/store/use-cart-store';
import { storeToRefs } from 'pinia'

const cart = useCartStore()
// expose directly in template:
// now these are *refs* tied to the store’s state
const { items, subtotal, discount, total } = storeToRefs(cart)

function updateQty(item, newQty) {
  cart.updateQuantity(item.id, newQty)
}

function remove(item) {
  cart.removeItem(item.id)
}



</script>

<style></style>