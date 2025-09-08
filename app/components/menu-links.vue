<template>
    <div class="relative flex xl:px-4 py-4 px-2">
        <nav class="text-md normal-case font-medium tracking-wide">
            <ul class="space-y-1 md:space-y-0 md:space-x-4 lg:space-x-8 md:flex md:justify-between">
                <li :class="[isActiveLink('/')
                    ? linkVariant.active
                    : linkVariant.inactive]">
                    <NuxtLink to="/">Головна</NuxtLink>
                </li>
                <CategoriesListSlideover :linkType="linkType[0]" />
                <CategoriesListSlideover :linkType="linkType[1]" />
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
</template>
<script setup>
const linkVariant = {
    active: 'underline underline-offset-4 font-semibold',
    inactive: 'hover:underline hover:underline-offset-4 hover:font-semibold'
}

const linkType = [
    {
        link: '/products/in-stock',
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