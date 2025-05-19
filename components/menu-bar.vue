<template>
    <div class="sticky top-0 z-40 w-full bg-white shadow-md flex items-center justify-center ">
        <button type="button" @click="toggleBurgerMenu" class="md:hidden h-14 ">
            <div v-if="!isOpen" class="pl-4">
                <UIcon name="i-heroicons:bars-3-16-solid" class="w-6 h-6" />
            </div>
            <div v-else class="pl-4">
                <UIcon name="i-heroicons:x-mark-16-solid" class="w-7 h-7" />
            </div>
        </button>

        <div class="hidden h-8 lg:flex ml-4 xl:ml-10">
            <img src="/assets/MarkTim.png" alt="">
            <NuxtLink to="/"></NuxtLink>
        </div>
        <div class="relative flex-1 xl:w-4/6 xl:px-4 py-4 px-2">
            <nav class="lg:text-sm text-xs uppercase font-medium">
                <ul class="space-x-4 lg:space-x-8"
                    :class="{ 'md:flex': isOpen, 'md:flex hidden md:justify-between lg:justify-center': !isOpen }">
                    <li class="lg:mx-8 mx-4" :class="[isActiveLink('/')
                        ? linkVariant.active
                        : linkVariant.inactive]">
                        <NuxtLink to="/">Головна</NuxtLink>
                    </li>
                    <li>
                        <USlideover title="Категорії" :description="categoryType">
                    <li :class="[isActiveLink('/in-stock')
                        ? linkVariant.active
                        : linkVariant.inactive]">
                        В наявності
                    </li>
                    <template #body>
                        <UCard variant="soft" :ui="{ body: { base: 'flex-1' }, root: 'border-none bg-white p-0' }">
                            <ul>
                                <NuxtLink to="/in-stock">
                                    <li class="hover:font-medium leading-relaxed ">Всі товари
                                    </li>
                                </NuxtLink>
                                <NuxtLink v-for="category in categories" :key="category.id"
                                    :to="`/in-stock/${category.slug}`">
                                    <li class="hover:font-medium leading-relaxed
 ">{{ category.name }}</li>
                                </NuxtLink>
                            </ul>
                        </UCard>
                    </template>
                    </USlideover>
                    </li>
                    <USlideover title="Категорії" :description="categoryType">
                        <li :class="[isActiveLink('/preorders')
                            ? linkVariant.active
                            : linkVariant.inactive]">
                            Передзамовлення
                        </li>
                        <template #body>
                            <UCard variant="soft" :ui="{ body: { base: 'flex-1' }, root: 'border-none bg-white p-0' }">
                                <ul>
                                    <NuxtLink to="/preorders">
                                        <li class="hover:font-medium leading-relaxed ">Всі товари
                                        </li>
                                    </NuxtLink>
                                    <NuxtLink v-for="category in categories" :key="category.id"
                                        :to="`/preorders/${category.slug}`">
                                        <li class="hover:font-medium leading-relaxed
 ">{{ category.name }}</li>
                                    </NuxtLink>
                                </ul>
                            </UCard>
                        </template>
                    </USlideover>
                    <li :class="[isActiveLink('/delivery')
                        ? linkVariant.active
                        : linkVariant.inactive]">
                        <NuxtLink to="/delivery">Доставка та оплата
                        </NuxtLink>
                    </li>
                    <li :class="[isActiveLink('/about')
                        ? linkVariant.active
                        : linkVariant.inactive]">
                        <NuxtLink to="/about">Про нас</NuxtLink>
                    </li>
                </ul>
            </nav>
        </div>
        <div class="flex w-24 flex-none justify-evenly">
            <button>
                <NuxtLink to="/shopping-cart">
                    <UIcon name="i-heroicons:shopping-cart" class="w-6 h-6" />
                </NuxtLink>
            </button>
            <button>
                <UIcon name="i-heroicons:user" class="w-6 h-6 " />
            </button>
        </div>
    </div>
</template>
<script setup>

import useFetchData from '~/composables/use-fetchdata';




const linkVariant = {
    active: 'border-b-1 border-mtwine-800 text-mtwine-800',
    inactive: 'hover:border-b-1 hover:border-mtwine-800 text:border-mtwine-800'
}

const isActiveLink = (routePath) => {
    const route = useRoute();
    return routePath == route.path

}

const isOpen = ref(false)
const toggleBurgerMenu = () => isOpen.value = !isOpen.value

const categoryType = 'в наявності на складі'

// const { data: categories } = useFetchData('https://marktim.shop/api/v1/public/categories/');

const { data: categories, error: categoryError } = useFetchData(
    'categories',
    'https://marktim.shop/api/v1/public/categories/'
);

if (categoryError.value) {
    console.error('Error fetching categories:', categoryError.value);
}

// onMounted(()=>{
//     fetchData("https://marktim.shop/api/v1/public/categories/")
// })

</script>