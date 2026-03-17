<template>
    <div class="duration-200 hover:scale-102 border rounded-md border-gray-100 mx-auto hover:overflow-visible hover: ">
        <div class="relative group">
            <NuxtLink :to="`/products/${routeLocation}/${itemData.id}/`">
                <img :src="`${itemData.image}`" :alt="itemData.name" class="object-cover rounded-t-md" />
                <!-- <div v-if="gluten_free || sugar_free || lactose_free || vegan" class="absolute top-[5%] right-[5%] h-[16%] rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center gap-2 px-2
             opacity-0 group-hover:opacity-100  translate-x-full group-hover:translate-x-[-5%] 
  transition-transform duration-300 ease-out">

                    <UIcon v-if="gluten_free" name="i-lucide:wheat-off" class="w-5 h-5 opacity-80" />
                    <UIcon v-if="sugar_free" name="i-lucide:candy-off" class="w-5 h-5 opacity-80" />
                    <UIcon v-if="vegan" name="i-lucide:leaf" class="w-5 h-5 opacity-80" />
                    <UIcon v-if="lactose_free" name="i-lucide:milk-off" class="w-5 h-5 opacity-80" />
                </div> -->
                <div
                    class="absolute top-[5%] right-[5%] flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <UTooltip v-if="gluten_free" text="Без глютену">
                        <div class="bg-amber-100 rounded-full p-1.5 shadow-sm">
                            <UIcon name="i-lucide:wheat-off" class="w-4 h-4 text-amber-600" />
                        </div>
                    </UTooltip>
                    <UTooltip v-if="lactose_free" text="Без лактози">
                        <div class="bg-blue-100 rounded-full p-1.5 shadow-sm">
                            <UIcon name="i-lucide:milk-off" class="w-4 h-4 text-blue-500" />
                        </div>
                    </UTooltip>
                    <UTooltip v-if="sugar_free" text="Без цукру">
                        <div class="bg-pink-100 rounded-full p-1.5 shadow-sm">
                            <UIcon name="i-lucide:candy-off" class="w-4 h-4 text-pink-600" />
                        </div>
                    </UTooltip>
                    <UTooltip v-if="vegan" text="Без глютену">
                        <div class="bg-green-100 rounded-full p-1.5 shadow-sm">
                            <UIcon name="i-lucide:leaf" class="w-4 h-4 text-green-600" />
                        </div>
                    </UTooltip>
                </div>
            </NuxtLink>
        </div>
        <div class="sm:px-4 px-1 py-2 flex flex-col content-stretch">
            <!-- <span class="mr-3 text-xs uppercase text-gray-600 font-semibold line-clamp-1">Rana</span> -->
            <p class="text-sm text-gray-800 line-clamp-2 border-t border-gray-100 min-h-10 mb-2">
                {{
                    itemData.name
                }} </p>

            <div class="flex items-center justify-evenly space-x-2 ">
                <div v-if="itemData.old_price" class="flex text-lg font-bold line-through">{{
                    itemData.old_price }} <span class="text-sm">грн</span></div>
                <div class="flex items-center justify-evenly">
                    <div class="flex text-lg font-bold" :class="{ 'text-red-600': itemData.old_price }"> {{
                        itemData.price }} <span v-if="!itemData.bulk_price" class="text-sm">грн</span></div>
                    <div v-if="itemData.bulk_price" class="flex text-lg font-bold"
                        :class="{ 'text-red-600': itemData.old_price }"> /{{
                            itemData.bulk_price }} <span class="text-sm">грн</span></div>
                </div>
            </div>

        </div>

        <ClientOnly>
            <div class="w-8/9 mx-auto mb-2
        ">
                <AppButton v-if="!isInCart" @click="addToCart">
                    До кошика
                </AppButton>

                <NuxtLink v-else to="/shopping-cart" class="w-full h-10 flex items-center justify-center gap-2 text-xs sm:text-sm font-medium uppercase rounded-md
         bg-mtgreen-300/90 backdrop-blur-sm text-white hover:bg-mtgreen-400/90 shadow-[0_2px_6px_rgba(0,0,0,0.15)]
         transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-mtgreen-200">
                    оформити


                </NuxtLink>
            </div>
        </ClientOnly>
    </div>
</template>
<script setup>

// import { useCartStore } from '~/store/use-cart-store'
import AppButton from './UI/app-button.vue'
import placeholder from '@/assets/image_placeholder.png'
const isDiscount = ref(false)
const route = useRoute()
const routeLocation = route.params.location || 'stock'
const isPreorderLocation = route.params.location === 'preorders'
const props = defineProps({
    product: Object
})

const itemData = computed(() => ({
    id: props.product.id,
    name: props.product.product.name_ukr || props.product.product.name,
    image: props.product.product.files?.[0]?.link ?? placeholder,
    price: Math.trunc(props.product.sell_price),
    old_price: props.product.old_price ? Math.trunc(props.product.old_price) : null,
    bulk_price: props.product.bulk_price ? Math.trunc(props.product.bulk_price) : null,
    isPreorder: isPreorderLocation,
    categories: props.product.product.categories ?? [],
}))

const dietaryIds = { gluten_free: 38, sugar_free: 40, lactose_free: 39, vegan: 55 }

const hasCategory = (id) => props.product.product.categories.some(c => c.id === id)

const gluten_free = computed(() => hasCategory(dietaryIds.gluten_free))
const sugar_free = computed(() => hasCategory(dietaryIds.sugar_free))
const lactose_free = computed(() => hasCategory(dietaryIds.lactose_free))
const vegan = computed(() => hasCategory(dietaryIds.vegan))



const cart = useCartStore()
const isInCart = computed(() =>
    cart.stockItems.some(i => i.id === itemData.value.id) ||
    cart.preorderItems.some(i => i.id === itemData.value.id)
)

const addToCart = () => {
    cart.addItem({ ...itemData.value, quantity: 1 })
}

</script>