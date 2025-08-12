<template>
    <div class="sticky top-0 z-40 w-full shadow-md flex items-center justify-between h-14 bg-gray-700 font-medium text-white ">
        <MobileMenuSlideover class="md:hidden">
            <UIcon name="i-heroicons:bars-3-16-solid" class="w-6 h-6 ml-4" />
        </MobileMenuSlideover>
        <nav>
            <ul class="flex space-x-4 mx-4">
                <li class="cursor-default">Products</li>
                <DropdownMenu :items="itemsPreorders" :ui="{ content: 'w-48', color: 'bg-gray-800'}" :content="{ align: 'start' } ">
                   <li class="cursor-default">Preorders</li>
                </DropdownMenu>
                <li class="cursor-default">Deliveries</li>
                <li></li>
                <li></li>
            </ul>
        </nav>
        <div class="flex w-24 flex-none justify-evenly">
            <NuxtLink to="/auth/login">
                <UIcon name="i-solar:logout-2-linear" class="w-6 h-6 bg-white" />
            </NuxtLink>
        </div>
    </div>
</template>
<script setup>
import DropdownMenu from '@nuxt/ui/runtime/components/DropdownMenu.vue';
const itemsPreorders = [
    {
        label: 'List',
        icon: 'i-lucide-align-justify',
        to: '/admin/preorders'
    },
    {
        label: 'Create',
        icon: 'i-lucide-plus',
         to: '/admin/preorders/create'
    },
    {
        label: 'Sum up',
        icon: 'i-lucide-sigma',
        to: '/admin/preorders/sumup'
    }
]

</script>