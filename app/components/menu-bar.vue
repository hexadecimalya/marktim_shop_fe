<template>
    <div class="sticky top-0 z-40 w-full shadow-md flex items-center justify-between h-14 bg-white">
        <MobileMenuSlideover class="md:hidden">
            <UIcon name="i-heroicons:bars-3-16-solid" class="w-6 h-6 ml-4" />
        </MobileMenuSlideover>
        <div class="hidden h-8 lg:flex ml-4 xl:ml-10">
            <NuxtLink to="/"><img src="/assets/MarkTim.png" class="h-8" alt="Marktim Shop logo" /></NuxtLink>
        </div>
        <MenuLinks class="hidden md:flex" />
        <div class="flex w-24 flex-none justify-evenly">
            <button>
                <NuxtLink to="/shopping-cart">
                    <div class="relative flex items-center">
                        <div class="relative">
                            <UIcon name="i-solar:cart-large-2-linear" class="w-6 h-6" />
                            <UBadge
                                class="absolute -top-2 -right-2.5 text-xs px-1.5 py-0.5 font-bold rounded-full text-white bg-gray-600">
                                {{ totalQuantity }}
                            </UBadge>
                        </div>
                    </div>
                </NuxtLink>
            </button>
            <button>
                <NuxtLink to="/auth/login">
                    <UIcon name="i-solar:user-circle-linear" class="w-6 h-6 " />
                </NuxtLink>
            </button>
        </div>
    </div>
</template>
<script setup>



const store = useCartStore()
const { totalQuantity } = storeToRefs(store)



</script>