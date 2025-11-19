<template>
    <div class="duration-200 hover:scale-102 border rounded-md border-gray-100 mx-auto hover:overflow-visible mt-2">
        <NuxtLink :to="`/products/${routeLocation}/${itemData.id}/`">
            <img :src="itemData.image" :alt="itemData.name" class="object-cover rounded-t-md" />
            <div class="sm:px-4 px-1 py-2 flex flex-col content-stretch">
                <!-- <span class="mr-3 text-xs uppercase text-gray-600 font-semibold line-clamp-1">Rana</span> -->
                <p
                    class="text-sm text-gray-800 line-clamp-2 border-t border-gray-100 min-h-10 mb-2">
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
        </NuxtLink>
        <ClientOnly>
            <div class="w-8/9 mx-auto mb-2
        ">
                <AppButton v-if="!isInCart" @click="addToCart">
                    До кошика
                </AppButton>

                <NuxtLink v-else to="/shopping-cart">
                    <AppButton>
                        оформити
                        <UIcon name="i-lucide:circle-arrow-right" />
                    </AppButton>
                </NuxtLink>
            </div>
        </ClientOnly>
    </div>
</template>
<script setup>

// import { useCartStore } from '~/store/use-cart-store'
import AppButton from './UI/app-button.vue'

const isDiscount = ref(false)
const route = useRoute()
const routeLocation = route.params.location || 'stock'
const isPreorderLocation = route.params.location === 'preorders'
const props = defineProps({
    product: Object
})

const itemData = {
    id: props.product.id,
    name: props.product.product.name_ukr || props.product.product.name,
    image: props.product.product.files[0].link,
    price: Math.trunc(props.product.sell_price),
    bulk_price: Math.trunc(props.product.bulk_price),
    old_price: Math.trunc(props.product.old_price),
    isPreorder: isPreorderLocation
}


const cart = useCartStore()
const isInCart = computed(() =>
    cart.stockItems.some(i => i.id === itemData.id) ||
    cart.preorderItems.some(i => i.id === itemData.id)
)

const addToCart = () => {
    cart.addItem({ ...itemData, quantity: 1 })
}

</script>