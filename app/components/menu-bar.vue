<template>
  <div class="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-sm border-b border-mtgreen-100 shadow-[0_1px_2px_rgba(0,0,0,0.03)]
         flex items-center justify-between h-14 transition-colors duration-200">
    <MobileMenuSlideover class="md:hidden ml-4">
      <UIcon name="i-heroicons:bars-3-16-solid" class="w-6 h-6 text-mtgreen-700" />
    </MobileMenuSlideover>

    <div class="hidden h-8 lg:flex ml-4 xl:ml-10">
      <button @click="router.push({ path: '/' , force: true})" class="cursor-pointer">
        <img src="/assets/MarkTim.png" class="h-8" alt="Marktim Shop logo" />
      </button>
    </div>

    <MenuLinks class="hidden md:flex" />

    <div class="flex items-center justify-center gap-4 mr-4">
      <NuxtLink to="/shopping-cart" class="relative flex items-center">
        <ClientOnly>
          <UBadge icon="i-solar:cart-large-2-linear"
            class="flex items-center gap-1 text-xs px-2 py-1 font-semibold text-white bg-gray-600 rounded-md h-7 tracking-tight shadow-sm">
            {{ totalQtyStockItems }} / {{ totalQtyPreorderItems }}
          </UBadge>
          <template #fallback>
            <UBadge icon="i-solar:cart-large-2-linear"
              class="flex items-center text-xs px-2 py-1 font-semibold text-white bg-gray-600 rounded-md h-7 tracking-tight">
              - / -
            </UBadge>
          </template>
        </ClientOnly>
      </NuxtLink>

      <!-- <NuxtLink to="/auth/login" class="flex items-center transition-colors">
      <UIcon name="i-solar:user-circle-bold" class="w-8 h-8 bg-gray-600"  />
    </NuxtLink> -->
    </div>
  </div>

</template>
<script setup>

const router = useRouter()


const cart = useCartStore()
const { totalQtyPreorderItems, totalQtyStockItems } = storeToRefs(cart)



</script>