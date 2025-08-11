<template>
    <div
    class="max-w-4xl lg:max-w-6xl container mx-auto p-2 my-2 md:my-4 lg:my-18 sm:p-6 border-2 border-gray-200/25 md:shadow-2xl">
    <h1 class="font-semibold text-2xl mb-6">Замовлення #2932</h1>
   
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
                                    <span class="text-gray-700">{{ item.quantity }}</span>
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
                        <span class="font-medium">40 грн</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-600">Знижка -3%</span>
                        <span class="font-medium text-mtwine-800">- 2 грн</span>
                    </div>
                    <USeparator />
                    <div class="pt-2 mt-2 flex justify-between">
                        <span class="font-medium">Всього</span>
                        <span class="font-bold">20 грн</span>
                    </div>
                </div>
                <!-- <AppButton>продовжити</AppButton> -->
            </div>

        </div>
    </div>
</template>
<script setup></script>