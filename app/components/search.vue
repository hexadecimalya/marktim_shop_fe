<template>
  <div class="bg-slate-50 border-b-2 h-12">
    <UInput v-model="value" placeholder="Пошук смаколиків..." icon="heroicons:magnifying-glass-20-solid" size="lg" variant="none" trailing />
  </div>
</template>

<script setup>
const value = ref('')

</script>


<style>

</style>