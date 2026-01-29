<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h1 class="mb-6 text-center text-lg font-semibold text-gray-800">
        Admin Login
      </h1>
<div v-if="authErr" class="text-red-500 p-2 bg-red-100 border border-red-300 mb-4 rounded-md" >
  {{ authErr }}
</div>
      <UForm
        :validate="validate"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
      >
        <UFormField label="Імʼя користувача" name="login">
          <UInput class="w-full"
            v-model="state.login"
            size="lg"
            
          />
        </UFormField>

        <UFormField label="Пароль" name="password">
          <UInput
            v-model="state.password"
            class="w-full"
            type="password"
            size="lg"
      
          />
        </UFormField>

        <UButton
          type="submit"
          block
        color="neutral"
         
          size="lg"
        loading-auto
        >
          Увійти
        </UButton>
      </UForm>
    </div>
  </div>
</template>

<script setup>
const config = useRuntimeConfig()
const userAuth = useUserStore()
const { initUserDataFromObject } = userAuth
const state = reactive({
  login: '',
  password: ''
})
const validate = (state) => {
  const errors = []
  if (!state.login) errors.push({ name: 'login', message: 'Обовʼязкове поле' })
  if (!state.password) errors.push({ name: 'password', message: 'Обовʼязкове поле' })
  return errors
}
const authErr = ref('')
const isProcessing = ref(false)

const onSubmit = async () => {
  try {
    isProcessing.value = true
    const res = await $fetch(`${config.public.apiBase}/auth/token/`, {
      method: 'POST',
      body: {
        username: state.login,
        password: state.password
      }
    })
      const { user_details, ...tokens } = res

    const userData = {
      ...tokens,
      ...user_details
    }

    initUserDataFromObject(userData)
    await navigateTo('/admin2')

   
  } catch (error) {
    if (error?.status === 401 ){
      authErr.value = 'Невірний логін або пароль'
    } else {
      authErr.value = 'Помилка сервера. Спробуйте пізніше'
    }
    state.login = '',
    state.password = ''

  }
  finally{
    isProcessing.value = false
  }
}


definePageMeta({
  layout: 'auth'
})
</script>
