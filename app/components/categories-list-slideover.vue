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
                    <NuxtLink to="/products/in-stock">
                        <li class="hover:font-medium leading-relaxed ">Всі товари
                        </li>
                    </NuxtLink>
                    <NuxtLink v-for="category in categories" :key="category.id"
                        :to="`/products/in-stock/?category=${category.slug}`">
                        <li class="hover:font-medium leading-relaxed
 ">{{ category.name }}</li>
                    </NuxtLink>
                </ul>
            </UCard>
        </template>
    </USlideover>
</template>
<script setup>
import useFetchData from '~/composables/use-fetchdata';

const { data: categories, error: categoryError } = useFetchData(
    'categories',
    'https://marktim.shop/api/v1/public/categories/'
);

if (categoryError.value) {
    console.error('Error fetching categories:', categoryError.value);
}

const props = defineProps({
    linkType: {
        type: Object,
        required: true
    }
})


const linkVariant = {
    active: 'underline font-semibold',
    inactive: 'hover:underline hover:font-semibold'
}

const isActiveLink = (routePath) => {
    const route = useRoute();
    return routePath == route.path

}

</script>