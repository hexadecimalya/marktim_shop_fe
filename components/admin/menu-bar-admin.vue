<template>
    <div class="sticky top-0 z-40 w-full shadow-md flex items-center justify-between h-14 bg-white">
        <MobileMenuSlideover class="md:hidden">
            <UIcon name="i-heroicons:bars-3-16-solid" class="w-6 h-6 ml-4" />
        </MobileMenuSlideover>
        <nav>
            <ul class="flex space-x-4">
                <li>Products</li>
                <DropdownMenu :items="items" :ui="{
                    content: 'w-48'
                }">
                    <li>Preorders</li>

                </DropdownMenu>
                <li></li>
                <li></li>
                <li></li>
            </ul>
        </nav>
        <div class="flex w-24 flex-none justify-evenly">

            <NuxtLink to="/auth/login">
                <UIcon name="i-solar:user-circle-linear" class="w-6 h-6 " />
            </NuxtLink>
        </div>
    </div>
</template>
<script setup>
import DropdownMenu from '@nuxt/ui/runtime/components/DropdownMenu.vue';
const items = [
    {
        label: 'List',
        icon: 'i-lucide-align-justify'
    },
    {
        label: 'Create',
        icon: 'i-lucide-plus'
    }
]

</script>