<template>
    <div
        class="max-w-4xl lg:max-w-6xl container mx-auto p-2 my-2 md:my-4 lg:my-12 sm:p-6  border-1 border-gray-200 rounded-sm  ">
        <div class="my-4 text-center p-4">

            <h1 class="text-2xl font-bold  mb-4">Дякуємо за замовлення!</h1>
            <p class="text-lg text-gray-800 mb-6">
                Ваше замовлення № <span class="font-semibold">123456</span> успішно прийнято.
            </p>

            <!-- Самовивіз -->
            <div v-if="showInfo.selectedDelivery === 'Я заберу замовлення самостійно в MarkTim'" class="bg-mtgreen-50 border-l-4 border-mtgreen-400 p-4 mb-4">
                <h2 class="font-semibold text-mtgreen-400 text-lg mb-1">
                    <UIcon name="i-solar:bag-smile-linear" class="w-6 h-6" />

                    <p>
                        Метод доставки: Самовивіз

                    </p>
                </h2>
                <p class="text-gray-700">
                    Ви можете вже вирушати до магазину MarkTim — наші працівники негайно розпочали обробку вашого
                    замовлення. Чекаємо на вас!
                </p>
            </div>

            <!-- Доставка -->
            <div v-else class="bg-mtgreen-50 border-l-4 border-mtgreen-400 p-4 mb-4">
                <h2 class="font-semibold text-mtgreen-400 text-lg mb-1">
                    <UIcon name="i-solar:bag-smile-linear" class="w-6 h-6" />

                    <p>
                        Метод доставки: По Україні

                    </p>
                </h2>
                <p class="text-gray-700">
                    Очікуйте на дзвінок або повідомлення від нашого менеджера — він зв’яжеться з вами найближчим
                    часом для уточнення деталей оплати та доставки.
                </p>
            </div>


            <p class="text-gray-600 mt-6">
                Дякуємо, що обрали <span class="font-semibold text-gray-800">MarkTim</span>. Ми вже працюємо над
                тим, щоб ви отримали своє замовлення якнайшвидше 💙
            </p>
        </div>
    </div>
</template>
<script setup>
const route = useRoute()
const showInfo = route.query
</script>