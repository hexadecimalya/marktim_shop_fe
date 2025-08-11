<template>
    <div
        class="max-w-4xl lg:max-w-6xl container mx-auto p-2 my-2 md:my-4 lg:my-18 sm:p-6 border-2 border-gray-200/25 md:shadow-2xl">
        <h1 class="font-semibold text-2xl mb-6">Hello, Moto</h1>
        <h2 class="text-xl font-medium my-6">Інформація користувача</h2>
        <section class="w-full lg:w-1/2 space-y-4">
            <UFormField label="Імʼя" name="firstName">
                <UInput v-model="state.firstName" class="w-full" :ui="{ base: 'rounded-xs' }" />
            </UFormField>
            <UFormField label="Прізвище" name="lastName">
                <UInput v-model="state.lastName" class="w-full" :ui="{ base: 'rounded-xs' }" />
            </UFormField>

            <UFormField label="Електронна пошта" name="email">
                <UInput v-model="state.email" class="w-full" :ui="{ base: 'rounded-xs' }" />
            </UFormField>
            <UFormField label="Пароль" name="password">
                <UInput v-model="state.password" type="password" class="w-full" :ui="{ base: 'rounded-xs' }"
                 />
            </UFormField>
            <div class="flex justify-between">
                <div class="">Номер картки клієнта:</div>
                <div>0987654567</div>
            </div>
        
            <AppButton>зберегти зміни</AppButton>
        </section>

        <USeparator class="mt-8"/>
        <h2 class="text-xl font-medium my-6">Мої замовлення</h2>
        <section v-if="dummyOrderData">
            <div class="grid grid-cols-5 gap-1 font-semibold bg-gray-100 h-10 content-center p-2 rounded-t-xs">
                <div>номер</div>
                <div>дата</div>
                <div>сума</div>
                <div>статус</div>
                <div class="justify-self-end">дії</div>
            </div>
            <USeparator />
            <div>
                <OrderCardMini v-for="order in dummyOrderData" class="hover:bg-gray-50" :key="order.id"
                    :order-data="order" />
                <USeparator />
            </div>
        </section>
        <section v-else class="text-center my-6">
            <h2 class="text-lg font-medium text-gray-600 mb-4">Історія замовлень порожня</h2>
            <div class="w-54 mx-auto">
                <AppButton>
                    <NuxtLink to="/">Розпочати покупки</NuxtLink>
                </AppButton>
            </div>
        </section>
    </div>



</template>
<script setup>
const dummyOrderData = [
    {
        id: 1,
        date: "12.05.2025",
        amount: 123,
        status: "Обробляється"
    },
    {
        id: 2,
        date: "17.05.2025",
        amount: 343,
        status: "Виконано"
    },
    {
        id: 3,
        date: "12.06.2025",
        amount: 232,
        status: "Відмінено"
    },
    {
        id: 4,
        date: "02.04.2025",
        amount: 34242,
        status: "Виконано"
    },
    {
        id: 5,
        date: "20.05.2025",
        amount: 765,
        status: "Виконано"
    }
]

const state = reactive({
    email: 'test@hotmail.com',
    password: '',
    firstName:'Elliot',
    lastName:'Johnson',
})
</script>