<template>
    <div
        class="sticky top-0 z-40 w-full shadow-md flex items-center justify-between h-14 bg-gray-700 font-medium text-white ">
        <MobileMenuSlideover class="md:hidden">
            <UIcon name="i-heroicons:bars-3-16-solid" class="w-6 h-6 ml-4" />
        </MobileMenuSlideover>
        <nav>

            <ul class="flex space-x-4 mx-4">
                <DropdownMenu :items="itemsSales" :ui="{ content: 'w-48', color: 'bg-gray-800' }"
                    :content="{ align: 'start' }">

                    <li class="cursor-pointer">Продажі</li>
                </DropdownMenu>
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
                <DropdownMenu :items="itemsEntities" :ui="{ content: 'w-48', color: 'bg-gray-800' }"
                    :content="{ align: 'start' }">
                    <li class="cursor-pointer">Довідники</li>
                </DropdownMenu>
                <!-- <DropdownMenu :items="itemsTools" :ui="{ content: 'w-48', color: 'bg-gray-800' }"
                    :content="{ align: 'start' }">
                    <li class="cursor-pointer">Інструменти</li>
                </DropdownMenu>
                <li></li> -->
            </ul>
        </nav>
        <div class="flex w-24 flex-none justify-evenly">
            <button @click="userStore.logOut()">
                <UIcon name="i-solar:logout-2-linear" class="w-6 h-6 bg-white" />
            </button>
        </div>
    </div>
</template>
<script setup>
import DropdownMenu from '@nuxt/ui/runtime/components/DropdownMenu.vue';
const userStore = useUserStore()



const itemsPreorders = [
    {
        label: 'Всі',
        icon: 'i-lucide-align-justify',
        to: '/admin2/preorders'
    },
    {
        label: 'Створити',
        icon: 'i-lucide-plus',
        to: '/admin2/preorders/create'
    },
    {
        label: 'Підрахувати',
        icon: 'i-lucide-sigma',
        to: '/admin2/preorders/sumup'
    }
]
const itemsSales = [
    {
        label: 'Всі',
        icon: 'i-lucide-align-justify',
        to: '/admin2/sales'
    },
    {
        label: 'Створити',
        icon: 'i-lucide-plus',
        to: '/admin2/sales/create'
    }
]
const itemsProducts = [
    {
        label: 'Всі',
        icon: 'i-lucide-align-justify',
        to: '/admin2/products'
    },
    {
        label: 'Створити',
        icon: 'i-lucide-plus',
        to: '/admin2/products/create'
    }
]

const itemsSupplies = [
    {
        label: 'Всі',
        icon: 'i-lucide-align-justify',
        to: '/admin2/supplies'
    },
    {
        label: 'Experimental: Create',
        icon: 'i-lucide-plus',
        to: '/admin2/supplies/create'
    },
     {
        label: 'Experimental: List',
        icon: 'i-lucide-pencil',
        to: '/admin2/supplies/list'
    }
]

const itemsEntities = [
    {
        label: 'Категорії',
        icon: 'i-lucide-chart-bar-stacked',
        to: '/admin2/entities/categories'
    },
    {
        label: 'Контрагенти',
        icon: 'i-lucide-users',
        to: '/admin2/entities/counterparties'
    },
    {
        label: 'Бренди',
        icon: 'i-lucide-scroll-text',
        to: '/admin2/entities/brands'
    }
]

const itemsTools = [
    {
        label: 'Viber збір',
        icon: 'i-lucide-chart-bar-stacked',
        to: '/admin2/tools/viber-preorders'
    },
    // {
    //     label: 'Контрагенти',
    //     icon: 'i-lucide-users',
    //     to: '/admin2/entities/counterparties'
    // },
    // {
    //     label: 'Бренди',
    //     icon: 'i-lucide-scroll-text',
    //     to: '/admin2/entities/brands'
    // }
]

</script>