<template>
    <div
        class="max-w-2xl lg:max-w-2xl container mx-auto p-2 my-2 md:my-18 sm:p-6 rounded-xs border-2 border-gray-200/25 md:shadow-2xl space-y-4">
        <h1 class="font-semibold text-2xl mb-6">Створити обліковий запис </h1>

        <UFormField label="Електронна пошта" name="email">
            <UInput v-model="state.email" class="w-full" :ui="{ base: 'rounded-xs' }" placeholder="Введіть email" />
        </UFormField>
        <UFormField label="Пароль" name="password">
            <UInput v-model="state.password" type="password" class="w-full" :ui="{ base: 'rounded-xs' }"
                placeholder="Введіть пароль" />
        </UFormField>
        <UFormField label="Підтвердіть пароль" name="password">
            <UInput v-model="state.password" type="password" class="w-full" :ui="{ base: 'rounded-xs' }"
                placeholder="Підтвердіть пароль" />
        </UFormField>
        <AppButton class="my-4">Зареєструватися</AppButton>
    </div>


</template>
<script setup>
import { reactive } from 'vue'
import AppButton from '~/components/UI/app-button.vue';
const state = reactive({
    email: '',
    password: ''
})
const handleInput = () => { }
</script>