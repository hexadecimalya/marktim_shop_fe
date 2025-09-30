<template>
    <USlideover title="Категорії" :description="props.linkType.description">
        <li :class="[isActiveLink(props.linkType.link)
            ? linkVariant.active
            : linkVariant.inactive]">
            {{ props.linkType.displayedName }}
        </li>
        <template #body>
            <UCard variant="soft" :ui="{ body: { base: 'flex-1' }, root: 'border-none bg-white p-0' }">
                <ul>
                    <NuxtLink :to="props.linkType.link">
                        <li class="hover:font-medium leading-relaxed ">Всі товари
                        </li>
                    </NuxtLink>
                    <NuxtLink v-for="category in categories" :key="category.id"
                        :to="`${props.linkType.link}/category/${category.slug}`">
                        <li class="hover:font-medium leading-relaxed
 ">{{ category.name }}</li>
                    </NuxtLink>
                       <!-- <NuxtLink v-for="category in categories" :key="category.id"
                        :to="{ path: `${props.linkType.link}`, query: { category: category.slug } }">
                        <li class="hover:font-medium leading-relaxed
 ">{{ category.name }}</li>
                    </NuxtLink> -->
                </ul>
            </UCard>
        </template>
    </USlideover>
</template>
<script setup>

import  useCategories  from '~/composables/useCategories';

// let categories = [];

const { list:categories } =  useCategories();
// const categories = Object.values(categoriesObj.value);


// const { data: categories, error: categoryError } = useFetchData(
//     'categories', computed(() => 'https://marktim.shop/api/v1/public/categories/')

// );



// if (categoryError.value) {
//     console.error('Error fetching categories:', categoryError.value);
// } else {
//     const setCats = useCategories(1, categories)
// }

const props = defineProps({
    linkType: {
        type: Object,
        required: true
    }
})


const linkVariant = {
    active: 'underline underline-offset-4 font-semibold',
    inactive: 'hover:underline hover:underline-offset-4 hover:font-semibold'
}

const isActiveLink = (routePath) => {
    const route = useRoute();
    return routePath == route.path

}

</script>