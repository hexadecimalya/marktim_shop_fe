<template>
    <div class="relative flex xl:px-4 py-4 px-2">
        <nav class="text-[15px] tracking-wide font-medium">
            <ul class="space-y-2 md:space-y-0 md:space-x-4 lg:space-x-8 md:flex md:justify-between">
                <li :class="[isActiveLink('/')
                    ? linkVariant.active
                    : linkVariant.inactive]">
                    <NuxtLink to="/" @click="handleClick" >Головна</NuxtLink>
                </li>
                <CategoriesListSlideover :linkType="linkType[0]" @link-click="handleClick" />
                <CategoriesListSlideover :linkType="linkType[1]" @link-click="handleClick" />
                <li :class="[isActiveLink('/delivery')
                    ? linkVariant.active
                    : linkVariant.inactive]">
                    <NuxtLink to="/delivery" @click="handleClick">Доставка та оплата
                    </NuxtLink>
                </li>
                <li :class="[isActiveLink('/about')
                    ? linkVariant.active
                    : linkVariant.inactive]">
                    <NuxtLink to="/about" @click="handleClick">Про нас</NuxtLink>
                </li>
            </ul>
        </nav>
    </div>
</template>
<script setup>


const linkVariant = {
  active: 'text-mtgreen-700 font-semibold underline underline-offset-4',
  inactive: 'text-gray-700 hover:text-mtgreen-600 hover:underline hover:underline-offset-4 transition-colors duration-200'
}
const emit = defineEmits(['link-click'])

const handleClick = () => {
  emit('link-click')
}


const linkType = [
    {
        link: '/products/stock',
        displayedName: 'В наявності',
        description: 'Товари в наявності на складі',
        key: ''
    },
    {
        link: '/products/preorders',
        displayedName: 'Передзамовлення',
        description: 'Товари під замовлення',
        key: ''
    },

]

const isActiveLink = (routePath) => {
    const route = useRoute();
    return routePath == route.path

}
</script>