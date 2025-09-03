<template>
    <USlideover v-model:open="toggleMenuLinks" title="Навігація"  >
        <slot></slot>
        <template #body>
            <MenuLinks />
        </template>
    </USlideover>
</template>
<script setup>

import { useMediaQuery } from '@vueuse/core'

const toggleMenuLinks = ref(false)
const isMdOrLarger = useMediaQuery('(min-width: 768px)')
watch(isMdOrLarger, (isLarge) => {
    if (isLarge) {
        toggleMenuLinks.value = false
    }
})
</script>
