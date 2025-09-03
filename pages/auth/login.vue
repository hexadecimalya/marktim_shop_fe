<template>
    <div
        class="max-w-2xl lg:max-w-2xl container mx-auto p-2 my-2 md:my-18 sm:p-6 rounded-xs border-2 border-gray-200/25 md:shadow-2xl space-y-4">
        <h1 class="font-semibold text-2xl mb-6">Увійти в обліковий запис </h1>
        <form @submit.prevent="handleLogin">
            <UFormField label="Електронна пошта" name="email">
                <UInput v-model="state.email" class="w-full" :ui="{ base: 'rounded-xs' }" placeholder="Введіть email" />
            </UFormField>
            <UFormField label="Пароль" name="password">
                <UInput v-model="state.password" type="password" class="w-full" :ui="{ base: 'rounded-xs' }"
                    placeholder="Введіть пароль" />
            </UFormField>
            <AppButton class="my-4">Увійти</AppButton>
            <USeparator label="або" />
            <NuxtLink to="/auth/register">
                <AppButton class="my-4">
                    Зареєструватися
                </AppButton>
            </NuxtLink>
        </form>

    </div>


</template>
<script setup>

const state = reactive({
    email: '',
    password: '',
    pending: false,
    success: false
})
const handleLogin = () => {
    state.pending = true
    try {
        
    }
    finally {
        state.pending = false
    }
}
</script>