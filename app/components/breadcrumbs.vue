<template>
  <UBreadcrumb :items="items" :ui="{link: 'text-gray-600'}" />
</template>

<script setup>
import { breadcrumb } from '#build/ui';


const props = defineProps({
  items: Array
})

</script>
