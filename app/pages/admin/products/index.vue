<template>
    <section class="w-11/12 mx-auto">
        <h1 class="text-2xl font-extrabold my-4">Всі продукти</h1>
        <SearchBar />
        <!-- Table Header -->
        <div
            class="grid grid-cols-21 bg-mtgreen-100 border border-gray-200 rounded-t-lg p-3 text-sm font-semibold text-gray-700">
            <div class="">ID</div>
            <div class="col-span-10">Назва</div>
            <div class="col-span-8">Категорії</div>
            <div>Файли</div>
            <div class="text-end">Дії</div>
        </div>

        <!-- Rows -->
        <div v-if="!loading" class="divide-y divide-gray-100 border-x border-b border-gray-200 rounded-b-lg">
            <div v-for="product in productList" :key="product.id"
                class="grid grid-cols-21 items-center px-1 py-1 text-sm font-slim">
                <div class="font-semibold text-center hover:underline">
                    <NuxtLink :to="`/admin/products/${product.id}`">{{ product.id }}</NuxtLink>
                </div>
                <div class="col-span-10 font-medium">{{ product.name_ukr ? product.name_ukr : product.name }}</div>
                <div class="col-span-8 text-gray-500 space-x-0.5">
                    <u-badge v-for="category in product.categories" :key="category.id" color="neutral"
                        variant="subtle">{{ category.name }}</u-badge>
                </div>
                <div class="text-gray-500">2 файли</div>

                <!-- Delete Modal -->
                <div class="flex justify-end">
                    <UModal title="Підтвердити видалення">
                        <UButton variant="ghost" color="error" icon="i-lucide:trash" class="!p-1.5" size="xs" />

                        <template #body>
                            <div class="h-24 flex items-center justify-center text-center text-gray-700">
                                Видалити продукт <strong>"Назва продукту"</strong>?
                            </div>
                        </template>

                        <template #footer="{ close }">
                            <div class="flex justify-end gap-2">
                                <UButton label="Скасувати" color="neutral" variant="outline" @click="close" />
                                <UButton label="Видалити" color="error" @click="handleDeleteSupply(i)" />
                            </div>
                        </template>
                    </UModal>
                </div>
            </div>
        </div>

        <div v-else>loading...</div>
    </section>
    <div class="my-6 flex justify-center" v-if="!loading">
        <UPagination v-model:page="page" :show-controls="false" :total="totalCount" aactive-color="neutral"
            active-variant="subtle" :items-per-page="limit" show-edges />
    </div>


</template>
<script setup>
import SearchBar from '~/components/UI/search-bar.vue';

definePageMeta({
    layout: 'admin'
})

const limit = 50
const page = ref(1)
const totalCount = computed(() => data.value?.count ?? 0)
const url = computed(() => `https://marktim.shop/api/v1/public/products2/?limit=${limit}&offset=${(page.value - 1) * limit}`)
const key = computed(() => `products-list-page-${page.value}`)
const { data, error } = useFetchData(key, url)

const productList = computed(() => data.value?.data ?? [])
const loading = computed(() => !data.value && !productError.value)
const handleDeleteProduct = (id) => { }

</script>