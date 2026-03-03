<template>
    <div>
        <section>
            <div v-for="savedItem in preorderItems" :key="savedItem.id" class="bg-blue-100">
                <div>
                    {{ savedItem.name }}
                </div>
                <UInput v-model="savedItem.old_price" />
                <UInput v-model="savedItem.sell_price" />
                <UInput v-model="savedItem.bulk_price" />
                <UInput v-model="savedItem.regular_price" @change="" />
                <UInput v-model="savedItem.promo_price" />

            </div>
        </section>
        <section>
            <div>preorder init info</div>
        </section>
        <section>
            <div v-for="product in aggrProductList" :key="product.id">
                <UCheckbox :model-value="isProductInPreorder(product.id)"
                    @update:model-value="(val) => toggleProduct(val, product)" />
                <div>
                    {{ product.name }}
                </div>
                <UInput v-model="product.old_price" />
                <UInput v-model="product.sell_price" />
                <UInput v-model="product.bulk_price" />
                <UInput v-model="product.regular_price" />
                <UInput v-model="product.promo_price" />

            </div>
        </section>
    </div>
</template>
<script setup>
// hello

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
    const base = `/public/products2/`
    return searchTerm.value.length >= 3
        ? `${base}?filter_param=${encodeURIComponent(searchTerm.value)}&limit=${limit}&offset=${offset}`
        : `${base}?limit=${limit}&offset=${offset}`
})

const { data, loading, error } = useAuthFetchData(url)
const aggrProductList = computed(() => {
    const newData = Object.fromEntries((data.value?.data ?? []).map(item => [item.id, {
        id: item.id, image: item.files?.[0]?.link ?? null, name: item.name_ukr || item.name,
        // old_price: preorderItems.value.old_price || undefined, sell_price: preorderItems.value.sell_price || undefined, bulk_price: preorderItems.value.bulk_price || undefined, promo_price: preorderItems.value.promo_price || undefined, regular_price: preorderItems.value.regular_price || undefined, 
    }]))
    return newData
})

const isProductInPreorder = (id) => Object.hasOwn(preorderItems.value, id)
const toggleProduct = (checked, product) => {
    if (checked) {
        store.addItem(product)
    }

}
watchEffect(() => console.log(aggrProductList.value))

</script>