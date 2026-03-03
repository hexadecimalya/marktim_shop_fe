<template>
    <section class="w-5/6 mx-auto" v-if="hydrated">
        <h1 class="text-2xl font-extrabold my-4">Нове передзамовлення</h1>
        <div>
            <div>
                <UModal v-model:open="modalOpened" title="Тип передзамовлення" v-if="!preorderIsInitialized"
                    description="Оберіть тип">
                    <UButton label="Створити" color="neutral" variant="subtle" v-if="!preorderIsInitialized" icon="i-lucide-clipboard-list" />
                    <template #body>
                        <UForm :state="formInitState" @submit="initPreorder">
                            <URadioGroup v-model="formInitState.selectedType" :items="formInitState.preorderType" />

                            <UFormField v-if="formInitState.selectedType === 'Польща (zl)'" label="Прогнозований курс"
                                name="exchangeRate" class="mt-2">
                                <UInput v-model="formInitState.exchangeRate" placeholder="Напр. 10.3" />
                            </UFormField>

                            <UButton label="Зберегти" color="primary" variant="subtle" class="mt-4" type="submit" />
                        </UForm>
                    </template>
                </UModal>
                <div v-if="preorderIsInitialized">
                    <section v-if="preorderItems.length" class="mt-4 bg-mtgreen-100 p-4 rounded-md">
                        <!-- <h2 class="text-xl font-bold mb-2 flex items-center gap-2">
                    Переглянути передзамовлення
                </h2> -->

                        <UAccordion :items="accordionItems" :key="preorderItems">
                            <template #preorder-content>
                                <div
                                    class="grid grid-cols-14 bg-gray-600 rounded-t-lg p-3 text-sm font-semibold text-white mt-2">
                                    <div class="flex justify-center">Дії</div>
                                    <div class="col-span-7">Назва</div>
                                    <div>Стара</div>
                                    <div>Продаж</div>
                                    <div>Опт</div>
                                    <div>Закуп (zl)</div>
                                    <div>Промо (zl)</div>
                                    <div class="text-end">
                                        <UIcon name="i-lucide:image" />
                                    </div>
                                </div>

                                <div
                                    class="divide-y divide-gray-100 border-x border-b border-gray-200 rounded-b-lg mb-6 bg-white">
                                    <div v-for="product in preorderItems" :key="product.id"
                                        class="grid grid-cols-14 items-center p-1 text-sm gap-x-1 hover:bg-red-50/30 transition-colors">

                                        <div class="flex justify-center">
                                            <UButton icon="i-lucide:trash-2" color="error" variant="ghost" size="sm"
                                                @click="store.removeItem(product.id)" />
                                        </div>

                                        <div class="col-span-7 font-medium truncate">
                                            {{ product.name_ukr || product.name }}
                                        </div>

                                        <UInput v-model="product.old_price" @change="syncWithStore(product)" />
                                        <UInput v-model="product.sell_price" class="font-bold"
                                            @change="syncWithStore(product)" />
                                        <UInput v-model="product.bulk_price" @change="syncWithStore(product)" />

                                        <UInput v-model="product.regular_price"
                                            @change="store.calculatePrices(product)" />
                                        <UInput v-model="product.promo_price"
                                            @change="store.calculatePrices(product)" />

                                        <div class="flex justify-end">
                                            <img :src="product?.files?.[0]?.link || placeholder"
                                                class="w-10 h-10 object-cover rounded" />
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </UAccordion>
                    </section>

                    <section>
                        <div class="grid grid-cols-4 mt-2 gap-x-4">
                            <UFormField label="Встановлений курс">
                                <div class="font-bold">{{ formInitState.exchangeRate || '—' }} zl</div>
                            </UFormField>
                            <UFormField label="Назва" class="col-span-2">
                                <UInput type="text" v-model="preorderName" placeholder="Введіть назву передзамовлення"
                                    class="w-full" />
                            </UFormField>
                            <div class="flex justify-end items-end space-x-2">
                                <UButton label="Зберегти все" variant="subtle" color="primary" @click="handlePreorder"
                                    :loading="isProcessing" />
                                <UButton label="Скинути" @click="store.clearPreorder" color="neutral" variant="subtle" />
                            </div>
                        </div>

                        <div class="my-4">
                            <USeparator label="Додати продукти" type="solid" />
                        </div>
                    </section>
                </div>

            </div>
        </div>
        <section v-if="preorderIsInitialized">
            <div class="my-4">
                <SearchBarAdmin @update:search="onSearch" />

            </div>

            <div class="grid grid-cols-14 bg-gray-700 rounded-t-lg p-3 text-sm font-semibold text-white mt-4">
                <div class="flex justify-center">Дії</div>
                <div class="col-span-7">Назва</div>
                <div>Стара</div>
                <div>Продаж</div>
                <div>Опт</div>
                <div>Закуп (zl)</div>
                <div>Промо (zl)</div>
                <div class="text-end">
                    <UIcon name="i-lucide:image" />
                </div>
            </div>

            <section v-if="!loading && !error">
                <div class="divide-y divide-gray-100 border-x border-b border-gray-200 rounded-b-lg">
                    <div v-for="product in productList" :key="product.id"
                        class="grid grid-cols-14 items-center p-1 text-sm gap-x-1 hover:bg-gray-50 transition-colors">

                        <div class="flex justify-center">
                            <UCheckbox :disabled="!product.regular_price && !product.sell_price"
                                :model-value="isProductInPreorder(product.id)"
                                @update:model-value="(val) => toggleProductSelection(val, product)" />
                        </div>

                        <div class="col-span-7 font-medium hover:underline truncate">
                            <NuxtLink :to="`/admin2/products/${product.id}`">
                                {{ product.name_ukr || product.name }}
                            </NuxtLink>
                        </div>
                        <UInput v-model="product.old_price" variant="soft" placeholder="—"
                            @update:model-value="syncWithStore(product)" />
                        <UInput v-model="product.sell_price" class="font-bold"
                            @update:model-value="syncWithStore(product)" />
                        <UInput v-model="product.bulk_price" @update:model-value="syncWithStore(product)" />

                        <UInput v-model="product.regular_price" @change="store.calculatePrices(product)" />
                        <UInput v-model="product.promo_price" @change="store.calculatePrices(product)" />

                        <div class="flex justify-end">
                            <img :src="product?.files?.[0]?.link || placeholder"
                                class="w-10 h-10 object-cover rounded shadow-sm" />
                        </div>
                    </div>
                </div>

                <div class="my-6 flex justify-center">
                    <UPagination v-model:page="page" :total="totalCount" :items-per-page="limit" />
                </div>
            </section>

            <div v-else-if="loading" class="py-10">
                <AdminLoader />
            </div>
        </section>

    </section>
</template>

<script setup>
import placeholder from '@/assets/image_placeholder.png'
const store = useCreatePreorderStore()
const { preorderItems, preorderName, exchangeRate, preorderIsInitialized } = storeToRefs(store)


// Initial State
const modalOpened = ref(false)
const isProcessing = ref(false)
const accordionItems = computed(() => [{
    label: `Показати обрані товари (${preorderItems.value.length})`,
    icon: 'i-lucide-smile',
    slot: 'preorder-content', 
    defaultOpen: true
}])

const formInitState = reactive({
    exchangeRate: exchangeRate.value || undefined,
    preorderType: ['Польща (zl)', 'Звичайне (грн) (функція недоступна)'],
    selectedType: 'Польща (zl)'
})

const initPreorder = () => {
    modalOpened.value = false
    preorderIsInitialized.value = true
    store.setExchangeRate(formInitState.exchangeRate)
}


// Search & Pagination
const searchTerm = ref('')

const page = ref(1)
const limit = 25

const onSearch = (value) => {
    searchTerm.value = value
    page.value = 1
}

const url = computed(() => {
    const offset = (page.value - 1) * limit
    const base = `/preorders/products/`
    return searchTerm.value.length >= 3
        ? `${base}?filter_param=${encodeURIComponent(searchTerm.value)}&limit=${limit}&offset=${offset}&order_by=-id&`
        : `${base}?order_by=-id&limit=${limit}&offset=${offset}`
})

const { data, loading, error } = useAuthFetchData(url)
// const productList = computed(() => data.value?.data ?? [])
const productList = ref([])

watch(data, (newData) => {
    if (!newData?.data) return

    productList.value = newData.data.map(product => {
        const existing = preorderItems.value.find(item => item.id === product.id)
        return existing
            ? { ...product, ...existing }
            : {
                ...product,
                old_price: null,
                sell_price: null,
                bulk_price: null,
                regular_price: product.regular_price ?? null,
                promo_price: null
            }
    })
})
const totalCount = computed(() => data.value?.count ?? 0)

// Update existed items as making manual changes 
const syncWithStore = (product) => {
    if (isProductInPreorder(product.id)) {
        store.addItem(product)
    }
}

const isProductInPreorder = (id) => {
    const items = Array.isArray(preorderItems.value)
        ? preorderItems.value
        // if it's an object (e.g. numeric keys) convert to array, or fallback to empty array
        : (preorderItems.value ? Object.values(preorderItems.value) : [])

    return items.some(item => item && item.id === id)
}

const toggleProductSelection = (checked, product) => {
    if (checked) {
        store.addItem(product)
    } else {
        store.removeItem(product.id)
    }
}

const handlePreorder = async () => {
    if (preorderItems.value.length === 0) return alert("Список порожній")
    else if (!preorderName.value) return alert("Введіть назву передзамовлення")
    isProcessing.value = true
    try {
        const payload = {
            name: preorderName.value,
            active: false,
            exchange_rate: exchangeRate.value,
            products: preorderItems.value.map(item => ({
                product_id: item.id,
                old_price: item.old_price,
                sell_price: item.sell_price,
                bulk_price: item.bulk_price,
                regular_price: parseFloat(item.regular_price) || null,
                promotion_price: parseFloat(item.promo_price) || null
            }))
        }

        const runtimeConfig = useRuntimeConfig()
        const userStore = useUserStore()

        const response = await $fetch('/preorders/', {
            baseURL: runtimeConfig.public.apiBase,
            method: 'POST',
            body: payload,
            headers: {
                Authorization: `Bearer ${userStore.user.access_token}`
            }
        })
        store.clearPreorder()
        formInitState.exchangeRate = null
        console.log(response)
        // console.log(payload)

    } catch (e) {
        console.log(e)
    }

    finally {
        isProcessing.value = false

    }
}


const hydrated = ref(false)
onMounted(() => {
    hydrated.value = true
})
definePageMeta({ layout: 'admin' })
</script>