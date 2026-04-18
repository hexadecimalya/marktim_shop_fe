<template>
    <section class="w-11/12 mx-auto">
        <h1 class="text-2xl font-extrabold my-4">Всі продукти</h1>
        <SearchBarAdmin @update:search="onSearch" />

        <div class="flex py-4 justify-between ">
            <div class="flex space-x-4 items-center ">
                <USwitch label="В наявності" v-model="toggleInStock" :loading="loading" />
                <USwitch :disabled="!toggleInStock || loading" label="Без картинок" v-model="toggleNoImages" :loading="loading" />
            </div>
            <div class="flex items-center space-x-4">
                <span class="text-sm text-gray-400 font-medium">{{ totalCount }} записів</span>
<UButton @click="handleExport" label="Експорт вибірки" color="neutral" variant="subtle" 
    :disabled="!toggleInStock || loading || toggleNoImages" />
            </div>
        </div>
        <!-- Table Header -->
        <div
            class="grid grid-cols-21 items-center bg-gray-50 border border-gray-200 rounded-t-xl px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
            <div class="">ID</div>
            <div class="col-span-10">Назва</div>
            <div class="col-span-8">Категорії</div>
            <div>
                <UIcon name="i-lucide:image" />
            </div>
            <div class="text-end">Дії</div>
        </div>


        <div v-if="!loading && !error" class="divide-y divide-gray-100 border-x border-b border-gray-200 rounded-b-lg">
            <div v-for="product in productList" :key="product.id"
                class="grid grid-cols-21 items-center px-1 py-1 text-sm font-slim ">
                <div class="font-semibold text-center hover:underline text-gray-600">
                    <NuxtLink :to="`/admin2/products/${product.id}`">{{ product.id }}</NuxtLink>
                </div>
                <div class="col-span-10 font-medium">{{ product.name_ukr ? product.name_ukr : product.name }}</div>
                <div class="col-span-8 text-gray-500 space-x-0.5">
                    <u-badge v-for="category in product.categories" :key="category.id" color="neutral"
                        variant="subtle">{{ category.name }}</u-badge>
                </div>
                <div class="text-gray-500">{{ product.files.length ? product.files.length : '-' }}</div>


                <div class="flex justify-end">
                    <UModal :key="product.id" :open="openedProductId === product.id"
                        @update:open="(val) => openedProductId = val ? product.id : null" title="Підтвердити видалення"
                        :description="`Видалити продукт ${product.name_ukr ?? product.name}?`"
                        :ui="{ description: 'font-bold text-black my-4 text-md' }">
                        <UButton variant="ghost" color="error" icon="i-lucide:trash" class="p-1.5!" size="xs"
                            @click="openedProductId = product.id" />
                        <template #footer="{ close }">
                            <div class="flex justify-end gap-2">
                                <UButton label="Скасувати" color="neutral" variant="outline" @click="close" />
                                <UButton label="Видалити" color="error" @click="handleDeleteProduct(product.id)" />
                            </div>
                        </template>
                    </UModal>
                </div>
            </div>
        </div>

        <div v-else-if="loading">
            <AdminLoader />
        </div>
    </section>
    <div class="my-6 flex justify-center" v-if="!loading">
        <UPagination v-model:page="page" :show-controls="false" :total="totalCount" active-color="neutral"
            active-variant="subtle" :items-per-page="limit" show-edges @update:page="scrollToTop" />
    </div>


</template>
<script setup>

const toast = useToast()
const { execute } = useAuthFetchMulti()
const scrollToTop = () =>
    window.scrollTo({ top: 0, behavior: 'smooth' })

const openedProductId = ref(null)
const searchTerm = ref('')
const page = ref(1)
const onSearch = (value) => {
    console.log('search value:', value)
    searchTerm.value = value
    page.value = 1 // reset pagination on new search
}

// filter in stock items and no images items
const toggleInStock = ref(false)
const toggleNoImages = ref(false)
const exportImages = ref(false)


const limit = 50

const totalCount = computed(() => data.value?.count ?? 0)

const url = computed(() => {
    const offset = (page.value - 1) * limit
    const params = new URLSearchParams({ order_by: '-id', offset: String(offset) })

    if (searchTerm.value.length >= 3) params.set('filter_param', searchTerm.value)
    if (toggleInStock.value) params.set('in_stock', 'true')
    if (toggleNoImages.value) params.set('wo_pictures', 'true')
        return `/products2/?${params.toString()}`
})

const handleExport = () => {
    const offset = (page.value - 1) * limit
    const params = new URLSearchParams({ order_by: '-id', offset: String(offset) })

    if (searchTerm.value.length >= 3) params.set('filter_param', searchTerm.value)
    if (toggleInStock.value)          params.set('in_stock', 'true')
    params.set('export', 'true')

    const baseURL = useRuntimeConfig().public.apiBase
    window.open(`${baseURL}/products/?${params.toString()}`)
}

watch([searchTerm, toggleInStock, toggleNoImages, page], () => {
    exportImages.value = false
})

const { data, error, loading, refresh } = useAuthFetchData(
    url
)

const productList = computed(() => data.value?.data ?? [])

const productIsDeleting = ref(false)

const handleDeleteProduct = async (id) => {
    productIsDeleting.value = true
    try {
        const res = await execute(`/products2/${id}`, {
            method: 'DELETE'
        })

        await refresh()
        toast.add({
            title: 'Продукт успішно видалено',
            icon: 'i-lucide:check',
            color: 'success'
        })
        openedProductId.value = null
    }
    catch (e) {
        console.error('Failed to delete product', e?.response?._data || e)
        toast.add({
            title: 'Помилка видалення',
            icon: 'i-lucide:ban',
            color: 'error'
        })
    }
    finally {
        productIsDeleting.value = false
    }
}

definePageMeta({
    layout: 'admin'
})
</script>