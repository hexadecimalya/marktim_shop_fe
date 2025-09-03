<template>
    <div class="duration-200 hover:scale-102 border-1 border-gray-100 mx-auto hover:overflow-visible">
        <NuxtLink :to="`/products/${routeLocation}/${itemData.id}/`">
            <img :src="itemData.image" :alt="itemData.name" class="object-cover rounded-t-xl" />
            <div class="px-4 py-3 flex flex-col content-stretch">
                <span class="mr-3 text-xs uppercase text-gray-600 font-semibold line-clamp-1">Rana</span>
                <p
                    class="text-sm text-gray-800 text-justify tracking-tight line-clamp-2 border-t border-gray-300 xl:min-h-[3rem] min-h-[4rem] mb-2">
                    {{
                        itemData.name
                    }} </p>
                <div class="">

                    <div class="flex items-center justify-evenly space-x-2">
                        <p class="flex text-lg mt-3 font-bold" :class="isDiscount ? 'text-red-600' : ''">{{
                            itemData.price }} <span class="text-sm">грн</span></p>
                        <p v-if="isDiscount" class="flex text-md font-bold my-3 line-through">2000 <span
                                class="text-sm ">грн</span></p>
                    </div>
                </div>
            </div>
        </NuxtLink>
        <div class="w-8/9 mx-auto mb-2
        ">
            <AppButton v-if="!isInCart" @click="addToCart">
                До кошика
            </AppButton>

            <NuxtLink v-else to="/shopping-cart">
                <AppButton>
                    Оформити замовлення
                </AppButton>
            </NuxtLink>
        </div>
    </div>
</template>
<script setup>

// import { useCartStore } from '~/store/use-cart-store'
import AppButton from './UI/app-button.vue'
const isDiscount = ref(false)
const route = useRoute()
const routeLocation = route.params.location || 'stock'


const props = defineProps({
    product: Object,

})

const itemData = {
    id: props.product.id,
    name:
        props.product.product.name_ukr ||
        props.product.product.name,
    image: props.product.product.files[0].link,
    price: props.product.sell_price,
    // bulk: props.product.bulk_price || null
}

const cart = useCartStore()
const isInCart = computed(() =>
    cart.items.some(i => i.id === itemData.id)
)

const addToCart = () => {
    cart.addItem({ ...itemData, quantity: 1 })
}
// console.log(itemData)
</script>