<template>
    <div
        class="sticky top-0 z-40 w-full shadow-md flex items-center justify-between h-14 bg-gray-700 font-medium text-white ">
        <MobileMenuSlideover class="md:hidden">
            <UIcon name="i-heroicons:bars-3-16-solid" class="w-6 h-6 ml-4" />
        </MobileMenuSlideover>
        <nav>
            <ul class="flex space-x-4 mx-4">
                <DropdownMenu :items="itemsProducts" :ui="{ content: 'w-48', color: 'bg-gray-800' }"
                    :content="{ align: 'start' }">

                    <li class="cursor-pointer">Продукти</li>
                </DropdownMenu>
                <DropdownMenu :items="itemsPreorders" :ui="{ content: 'w-48', color: 'bg-gray-800' }"
                    :content="{ align: 'start' }">
                    <li class="cursor-pointer">Передзамовлення</li>
                </DropdownMenu>
               <DropdownMenu :items="itemsSupplies" :ui="{ content: 'w-48', color: 'bg-gray-800' }"
                    :content="{ align: 'start' }">
                    <li class="cursor-pointer">Поставки</li>
                </DropdownMenu>
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
        label: 'Всі',
        icon: 'i-lucide-align-justify',
        to: '/admin/preorders'
    },
    {
        label: 'Створити',
        icon: 'i-lucide-plus',
        to: '/admin/preorders/create'
    },
    {
        label: 'Підрахувати',
        icon: 'i-lucide-sigma',
        to: '/admin/preorders/sumup'
    }
]

const itemsProducts = [
    {
        label: 'Всі',
        icon: 'i-lucide-align-justify',
        to: '/admin/products'
    },
    {
        label: 'Створити',
        icon: 'i-lucide-plus',
        to: '/admin/products/create'
    }
]

const itemsSupplies = [
    {
        label: 'Всі',
        icon: 'i-lucide-align-justify',
        to: '/admin/supplies'
    },
    {
        label: 'Створити',
        icon: 'i-lucide-plus',
        to: '/admin/supplies/create'
    }
]

</script>