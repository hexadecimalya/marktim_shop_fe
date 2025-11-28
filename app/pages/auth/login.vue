<template>
    <div
        class="max-w-2xl lg:max-w-2xl container mx-auto p-2 my-2 md:my-18 sm:p-6 rounded-xs border-2 border-gray-200/25 md:shadow-2xl space-y-4">
        <h1 class="font-semibold text-2xl mb-6">Увійти в обліковий запис </h1>
        <UForm @submit.prevent="handleLogin" :state="state">
            <UFormField label="Електронна пошта" name="email">
                <UInput v-model="state.email" required class="w-full" :ui="{ base: 'rounded-xs' }" placeholder="Введіть email" />
            </UFormField>
            <UFormField label="Пароль" name="password" >
                <UInput v-model="state.password" required type="password" class="w-full" :ui="{ base: 'rounded-xs' }"
                    placeholder="Введіть пароль" />
            </UFormField>
            <AppButton type="submit" class="my-4">Увійти</AppButton>
        </UForm>
        <USeparator label="або" />
        <NuxtLink to="/auth/register">
            <AppButton class="my-4">
                Зареєструватися
            </AppButton>
        </NuxtLink>

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
        console.log('logging')
    }
    finally {
        state.pending = false
    }
}
</script>