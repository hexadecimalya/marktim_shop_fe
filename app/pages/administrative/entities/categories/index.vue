<template>
  <section class="w-4/6 mx-auto py-6" v-if="hydrated">
   <div class="flex items-center justify-between mb-4">
      <h1 class="text-2xl font-extrabold tracking-tight text-gray-900">Категорії</h1>
      <!-- <span class="text-sm text-gray-400 font-medium"> {{ filteredBrands.length }}
        <template v-if="brandSearch"> з {{ brands_list.length }}</template>
        записів
      </span> -->
   </div>
      </section></template>
<script setup>
definePageMeta({ layout: 'admin' })
useHead({title: 'Категорії товару'})

const hydrated = ref(false)
const { execute } = useAuthFetchMulti()

onMounted(() => {
  hydrated.value = true
})
</script>