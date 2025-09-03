<template>
    <div
        class="max-w-4xl lg:max-w-6xl container mx-auto p-2 my-2 md:my-4 lg:my-12 sm:p-6  border-1 border-gray-200 rounded-sm  ">
        <h1 class="font-semibold text-2xl mb-6">Оформити замовлення</h1>
        <div class="my-4 text-center  bg-mtgreen-50 p-4">
            <p>
                Для того, щоб скористатися всіми перевагами легкого шопінгу, рекомендуємо
                <NuxtLink to="/auth/register" class="underline">зареєструватися</NuxtLink>.
            </p>
            <p>
                Вже маєте обліковий запис?
                <NuxtLink to="/auth/login" class="underline">увійдіть</NuxtLink>, щоб отримати знижку, що відповідає Вашій
                картці клієнта.
            </p>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-6">
            <h2 class="md:text-lg font-semibold my-4">1. Дані клієнта</h2>
            <USeparator />
            <h2 class="md:text-lg font-semibold my-4">2. Методи доставки</h2>
            <USeparator />
            <URadioGroup v-model="value" :items="items" class="my-4" />
            <div v-if="value === items[1]">
            <DeliveryForm />
            </div>
            <div class="w-48 mx-auto">
                <AppButton>        
                    <NuxtLink :to="{ path : '/order-confirmation', query: {  selectedDelivery : value } }">
                        підтвердити
                    </NuxtLink>
        </AppButton>
            </div>
        </form>
    </div>

</template>
<script setup>
const items = ref(['Я заберу замовлення самостійно в MarkTim', 'Доставка по Україні'])
const value = ref(items.value[0])
const guestUserData = ref({
    email: '',
    phone: '',
    firstName: '',
    lastName: '',

})
const handleSubmit = () => {
    console.log(guestUserData.value, 'Here u are')
}
</script>