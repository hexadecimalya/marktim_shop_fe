<template>
    <div class="sticky top-0 z-40 w-full shadow-md flex items-center justify-between h-14 bg-white">
        <MobileMenuSlideover class="md:hidden">
            <UIcon name="i-heroicons:bars-3-16-solid" class="w-6 h-6 ml-4" />
        </MobileMenuSlideover>
        <div class="hidden h-8 lg:flex ml-4 xl:ml-10">
            <NuxtLink to="/"><img src="/assets/MarkTim.png" class="h-8" alt="Marktim Shop logo" /></NuxtLink>
        </div>
        <MenuLinks class="hidden md:flex" />
        <div class="flex items-center justify-center gap-4">
            <NuxtLink to="/shopping-cart" class="flex items-center">
                <UBadge icon="i-solar:cart-large-2-linear"
                    class="flex items-center text-xs px-2 py-1 font-bold text-white bg-gray-600 h-7 tracking-tight">
                    {{ totalQtyStockItems }} / {{ totalQtyPreorderItems }}
                </UBadge>
            </NuxtLink>

            <NuxtLink to="/auth/login" class="flex items-center">
                <UIcon name="i-solar:user-circle-bold" class="w-8 h-8 mr-2" />
            </NuxtLink>
        </div>
    </div>
</template>
<script setup>



const cart = useCartStore()
const { totalQtyPreorderItems, totalQtyStockItems } = storeToRefs(cart)



</script>