<template>
    <div v-if="!pending && !error">{{ product }}</div>
    <div v-else-if="error">no  product</div>
    <div v-else>wait till end</div>
</template>
<script setup>
const { data, error, pending } = await useFetchData('unique-prod-95', 'https://marktim.shop/api/v1/public/stock/95/');
const product = computed(() => data?.value)
</script>