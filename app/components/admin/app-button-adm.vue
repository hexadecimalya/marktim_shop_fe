<template>
    <UButton class="text-xs md:text-sm px-2 md:px-3 py-1 md:py-2" variant="subtle"
        :color="isActive ? 'primary' : 'neutral'">
        <slot></slot>
    </UButton>

</template>
<script setup lang="ts">
defineProps<{
    isActive: boolean
}>()
</script> 