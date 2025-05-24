<template>

    <div class="duration-200 hover:scale-102 border-1 border-gray-100 mx-auto hover:overflow-visible">
        <NuxtLink :to="`/products/${itemData.id}/`">
            <img :src="itemData.image" :alt="itemData.name" class="object-cover rounded-t-xl" />
            <!-- <div @mouseenter="showFullTitle = true" @mouseleave="showFullTitle = false" class="px-4 py-3 xl:w-64 lg:w-60"> -->
            <div class="px-4 py-3 flex flex-col content-stretch">
                <span class="mr-3 text-xs uppercase text-gray-600 font-semibold line-clamp-1">Rana</span>
                <!-- <span class="text-gray-400 mr-3 text-xs">{{ cardData.brand() }}</span> -->
                <p class="text-sm text-gray-800 text-justify tracking-tight line-clamp-2 border-t-1  border-gray-300 ">
                    {{
                        itemData.name
                    }}</p>
                <div class="">

                    <div class="flex items-center justify-evenly space-x-2">
                        <p class="flex text-lg my-3 font-bold" :class="isDiscount ? 'text-red-600' : ''">{{
                            itemData.regular_price }} <span class="text-sm">грн</span></p>
                        <p v-if="isDiscount" class="flex text-md font-bold my-3 line-through">2000 <span
                                class="text-sm ">грн</span></p>

                    </div>

                    <button
                        class=" w-full h-12 transition-colors bg-mtgreen-100 rounded-sm hover:bg-mtgreen-200 uppercase text-sm font-medium">До
                        кошика</button>

                </div>
            </div>
        </NuxtLink>
    </div>
</template>
<script setup>

const isDiscount = ref(false)



const props = defineProps({
    product: Object
})

const itemData = {
    id: props.product.id,
    name: props.product.product.name_ukr ? props.product.product.name_ukr : props.product.product.name,
    image: props.product.product.files[0].link,
    regular_price: props.product.sell_price
}

console.log(itemData)

</script>