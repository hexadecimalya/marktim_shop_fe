<template>
    <div class="max-w-4xl lg:max-w-6xl container mx-auto p-8 my-2 md:my-4 lg:my-12 sm:p-18 text-center">
        <p class="text-5xl font-bold my-6">
            {{ error.statusCode }} :(
        </p>
        <p class="2xl  my-2">Йой! Щось пішло не туди...</p>
        <p class="font-semibold  my-2"> {{ error.message }}</p>
            <div class="w-62 mx-auto">
        <AppButton>
          <NuxtLink to="/">Повернутися на головну</NuxtLink>
        </AppButton>
      </div>
    </div>
</template>
<script setup>
import AppButton from './components/UI/app-button.vue';
defineProps(['error'])
</script>