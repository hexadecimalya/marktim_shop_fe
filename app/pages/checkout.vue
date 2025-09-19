<template>
    <div
        class="max-w-4xl lg:max-w-6xl container mx-auto p-2 my-0 md:my-4 lg:my-12 sm:p-6  border-1 border-gray-200 rounded-sm  ">
        <h1 class="font-semibold text-2xl mb-6">Оформити замовлення</h1>
        <div v-if="guestMode" class="my-4 text-center  bg-mtgreen-50 p-4">
            <p>
                Для того, щоб скористатися всіми перевагами легкого шопінгу, рекомендуємо
                <NuxtLink to="/auth/register" class="underline">зареєструватися</NuxtLink>.
            </p>
            <p>
                Вже маєте обліковий запис?
                <NuxtLink to="/auth/login" class="underline">увійдіть</NuxtLink>, щоб отримати знижку, що відповідає
                Вашій
                картці клієнта.
            </p>
        </div>

        <UForm :state="state" @submit="handleSubmit" class="space-y-6">
            <h2 class="md:text-lg font-semibold my-4">1. Дані клієнта</h2>
            <div>
                <section class="w-full lg:w-1/2 space-y-4">
                    <UFormField label="Імʼя" name="firstName">
                        <UInput v-model="state.firstName" class="w-full" :ui="{ base: 'rounded-xs' }" />
                    </UFormField>
                    <UFormField label="Прізвище" name="lastName">
                        <UInput v-model="state.lastName" class="w-full" :ui="{ base: 'rounded-xs' }" />
                    </UFormField>
                    <UFormField label="Номер телефону" name="phone">
                        <UInput v-model="state.phone" class="w-full" :ui="{ base: 'rounded-xs' }" />
                    </UFormField>

                    <UFormField label="Електронна пошта" name="email">
                        <UInput v-model="state.email" class="w-full" :ui="{ base: 'rounded-xs' }" />
                    </UFormField>
                    <!-- <div class="flex justify-between">
                <div class="">Номер картки клієнта:</div>
                <div>0987654567</div>
            </div>
         -->

                </section>
            </div>

            <USeparator />
            <h2 class="md:text-lg font-semibold my-4">2. Методи доставки</h2>

            <URadioGroup v-model="value" :items="items" class="my-4" />
            <div v-if="value === items[1]" class="space-y-4">
                <DeliveryForm />
                <UCheckbox label="Отримувач інша людина" v-model="anotherRecipient" />

                <section v-if="anotherRecipient" class="w-full lg:w-1/2 space-y-4">
                    <UFormField label="Імʼя отримувача" name="firstName">
                        <UInput v-model="state.firstNameDelivery" class="w-full" :ui="{ base: 'rounded-xs' }" />
                    </UFormField>
                    <UFormField label="Прізвище " name="lastName">
                        <UInput v-model="state.lastNameDelivery" class="w-full" :ui="{ base: 'rounded-xs' }" />
                    </UFormField>
                    <UFormField label="Номер телефону" name="phone">
                        <UInput v-model="state.phoneDelivery" class="w-full" :ui="{ base: 'rounded-xs' }" />
                    </UFormField>


                </section>
            </div>
            <div class="w-48 mx-auto">
                <AppButton type="submit">
                    <NuxtLink :to="{ path: '/order-confirmation', query: { selectedDelivery: value } }">
                        підтвердити
                    </NuxtLink>
                </AppButton>
            </div>
        </UForm>
    </div>


</template>
<script setup>
const items = ref(['Я заберу замовлення самостійно в MarkTim', 'Доставка по Україні'])
const guestMode = ref(true)
const value = ref(items.value[0])
const anotherRecipient = ref(false)
const state = reactive({
    email: '',
    phone: '',
    firstName: '',
    lastName: '',
    firstNameDelivery: '',
    lastNameDelivery: '',
    phoneDelivery: '',
})

const handleSubmit = () => {
    // send to backend
    console.log(state, 'Here u are')
}




definePageMeta({middleware: 'checkout'})
</script>