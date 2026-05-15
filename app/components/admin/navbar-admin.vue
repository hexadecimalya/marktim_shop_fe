<template>
    <div class="sticky top-0 z-40 w-full shadow-md bg-gray-700 font-medium text-white">

        <!-- Main bar -->
        <div class="flex items-center justify-between h-14 px-4">

            <!-- Desktop nav -->
            <nav class="hidden md:block">
                <ul class="flex space-x-4">
                    <DropdownMenu v-for="menu in menus" :key="menu.label" :items="menu.items"
                        :ui="{ content: 'w-48', color: 'bg-gray-800' }" :content="{ align: 'start' }">
                        <li class="cursor-pointer hover:text-gray-300 transition-colors">
                            {{ menu.label }}
                        </li>
                    </DropdownMenu>
                </ul>
            </nav>

            <!-- Mobile: hamburger + label -->
            <button class="md:hidden flex items-center gap-2 focus:outline-none" @click="mobileOpen = !mobileOpen"
                :aria-expanded="mobileOpen" aria-label="Toggle menu">
                <UIcon :name="mobileOpen ? 'i-lucide-x' : 'i-lucide-menu'"
                    class="w-6 h-6 bg-white transition-transform duration-200"
                    :class="mobileOpen ? 'rotate-90' : 'rotate-0'" />
                <span class="text-sm select-none">Меню</span>
            </button>

            <!-- Logout -->
            <button @click="userStore.logOut()" class="ml-auto md:ml-0">
                <UIcon name="i-solar:logout-2-linear" class="w-6 h-6 bg-white" />
            </button>
        </div>

        <!-- Mobile dropdown panel -->
        <Transition enter-active-class="transition-all duration-300 ease-out" enter-from-class="opacity-0 max-h-0"
            enter-to-class="opacity-100 max-h-screen" leave-active-class="transition-all duration-200 ease-in"
            leave-from-class="opacity-100 max-h-screen" leave-to-class="opacity-0 max-h-0">
            <div v-if="mobileOpen" class="md:hidden overflow-hidden bg-gray-800 border-t border-gray-600">
                <div v-for="menu in menus" :key="menu.label" class="border-b border-gray-700 last:border-b-0">

                    <!-- Section header / accordion toggle -->
                    <button
                        class="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-700 transition-colors"
                        @click="toggleSection(menu.label)">
                        <span>{{ menu.label }}</span>
                        <UIcon name="i-lucide-chevron-down" class="w-4 h-4 bg-white transition-transform duration-200"
                            :class="openSection === menu.label ? 'rotate-180' : ''" />
                    </button>

                    <!-- Submenu items -->
                    <Transition enter-active-class="transition-all duration-200 ease-out"
                        enter-from-class="opacity-0 max-h-0" enter-to-class="opacity-100 max-h-64"
                        leave-active-class="transition-all duration-150 ease-in" leave-from-class="opacity-100 max-h-64"
                        leave-to-class="opacity-0 max-h-0">
                        <div v-if="openSection === menu.label" class="overflow-hidden bg-gray-900">
                            <NuxtLink v-for="item in menu.items" :key="item.to" :to="item.to"
                                class="flex items-center gap-3 px-6 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
                                @click="mobileOpen = false">
                                <UIcon :name="item.icon" class="w-4 h-4 bg-current shrink-0" />
                                {{ item.label }}
                            </NuxtLink>
                        </div>
                    </Transition>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script setup>
import DropdownMenu from '@nuxt/ui/runtime/components/DropdownMenu.vue'

const userStore = useUserStore()

const mobileOpen = ref(false)
const openSection = ref(null)

function toggleSection(label) {
    openSection.value = openSection.value === label ? null : label
}

// Close mobile menu on route change
const route = useRoute()
watch(() => route.path, () => {
    mobileOpen.value = false
    openSection.value = null
})

const menus = [
    {
        label: 'Продажі',
        items: [
            { label: 'Всі', icon: 'i-lucide-align-justify', to: '/admin2/sales' },
            { label: 'Створити', icon: 'i-lucide-plus', to: '/admin2/sales/create' },
        ],
    },
    {
        label: 'Продукти',
        items: [
            { label: 'Всі', icon: 'i-lucide-align-justify', to: '/admin2/products' },
            { label: 'Створити', icon: 'i-lucide-plus', to: '/admin2/products/create' },
        ],
    },
    {
        label: 'Передзамовлення',
        items: [
            { label: 'Всі', icon: 'i-lucide-align-justify', to: '/admin2/preorders' },
            { label: 'Створити', icon: 'i-lucide-plus', to: '/admin2/preorders/create' },
            { label: 'Підрахувати', icon: 'i-lucide-sigma', to: '/admin2/preorders/sumup' },
        ],
    },
    {
        label: 'Поставки',
        items: [
            { label: 'Всі', icon: 'i-lucide-align-justify', to: '/admin2/supplies' },
            { label: 'Experimental: Create', icon: 'i-lucide-plus', to: '/admin2/supplies/create' },
            { label: 'Experimental: List', icon: 'i-lucide-pencil', to: '/admin2/supplies/list' },
        ],
    },
    {
        label: 'Довідники',
        items: [
            { label: 'Категорії', icon: 'i-lucide-chart-bar-stacked', to: '/admin2/entities/categories' },
            { label: 'Контрагенти', icon: 'i-lucide-users', to: '/admin2/entities/counterparties' },
            { label: 'Бренди', icon: 'i-lucide-scroll-text', to: '/admin2/entities/brands' },
        ],
    },
]
</script>