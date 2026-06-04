<template>
  <section class="w-4/6 mx-auto py-6" v-if="hydrated">

    <!-- Header -->
    <!-- <div class="flex items-center justify-between mb-4"> -->
      <h1 class="text-2xl font-extrabold tracking-tight text-gray-900 mb-4">Загальні довідники</h1>
      <ul class="font-mono space-y-2">
        <li class="hover:scale-102 hover:font-semibold hover:px-4"><NuxtLink to="/admin2/entities/categories"><UIcon name="i-lucide:chart-bar-stacked"/> Категорії </NuxtLink></li>
         <li class="hover:scale-102 hover:font-semibold hover:px-4"><NuxtLink to="/admin2/entities/counterparties"><UIcon name="i-lucide:users"/> Контрагенти </NuxtLink></li>
         <li class="hover:scale-102 hover:font-semibold hover:px-4"><NuxtLink to="/admin2/entities/brands"><UIcon name="i-lucide:scroll-text"/> Бренди </NuxtLink></li>
   
      </ul>
      <!-- </div> -->
      </section>
</template>

<script setup>
definePageMeta({ layout: 'admin' })
useHead({title: 'Всі довідники'})

const hydrated = ref(false)
const { execute } = useAuthFetchMulti()

onMounted(() => {
  hydrated.value = true
})
</script>
