<template>
    <USlideover title="Категорії" :description="props.linkType.description" v-model:open="open">
        <li :class="[isActiveLink(props.linkType.link)
            ? linkVariant.active
            : linkVariant.inactive]">
            {{ props.linkType.displayedName }}
        </li>
        <template #body>
            <UCard variant="soft" :ui="{ body: { base: 'flex-1' }, root: 'border-none bg-white p-0' }">
                <ul>
                    <NuxtLink :to="props.linkType.link" @click="open = false; $emit('link-click')" >
                        <li class="hover:font-medium leading-relaxed ">Всі товари
                        </li>
                    </NuxtLink>
                    <NuxtLink v-for="category in categories" :key="category.id" @click="open = false; $emit('link-click')" 
                        :to="`${props.linkType.link}/category/${category.slug}`">
                        <li class="hover:font-medium leading-relaxed
 ">{{ category.name }}</li>
                    </NuxtLink>
                </ul>
            </UCard>
        </template>
    </USlideover>
</template>
<script setup>

import useCategories from '~/composables/useCategories';
const open = ref(false)


const emit = defineEmits(['link-click'])

const { list: categories } =  useCategories();

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