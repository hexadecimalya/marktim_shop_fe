<template>
    <USlideover :title="title" :description="description">
        <template #body>
            <UCard variant="soft" :ui="{ body: { base: 'flex-1' }, root: 'border-none bg-white p-0' }">
                <ul>
                    <NuxtLink :to="baseLink">
                        <li class="hover:font-medium leading-relaxed">Всі товари</li>
                    </NuxtLink>
                    <NuxtLink v-for="category in categories" :key="category.id" :to="`${baseLink}/${category.slug}`">
                        <li class="hover:font-medium leading-relaxed">{{ category.name }}</li>
                    </NuxtLink>
                </ul>
            </UCard>
        </template>
    </USlideover>
</template>

<script setup>
defineProps({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    baseLink: {
        type: String,
        required: true
    },
    categories: {
        type: Array,
        required: true
    }
});
</script>