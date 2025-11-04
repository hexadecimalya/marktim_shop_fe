<template>
    <USlideover v-model:open="toggleMenuLinks" description="Навігація" title="Сайт" v-model="toggleMenuLinks" ar >
        <slot></slot>
        <template #body>
            <MenuLinks @link-click="toggleMenuLinks = false"/>
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
