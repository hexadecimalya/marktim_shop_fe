<template>

    <section class="w-5/6 mx-auto">
        <h1 class="text-2xl font-extrabold my-4">
            Нове передзамовлення
        </h1>
        <UModal v-if="!preorderInit" title="Тип передзамовлення" v-model:open="modalOpened"
            description="Обрати тип передзамовлення">
            <UButton label="Створити" color="neutral" variant="subtle" />

            <template #body>
                <UForm :validate="validateExchangeRate" :state="formInitState" @submit="togglePreorder">
                    <URadioGroup v-model="formInitState.selectedType" :items="formInitState.preorderType" />
                    <UFormField v-if="formInitState.selectedType === formInitState.preorderType[0]"
                        label="Прогнозований курс" name="exchangeRate" class="mt-2">
                        <UInput type="text" v-model="formInitState.exchangeRate"></UInput>
                    </UFormField>

                    <UButton label="Зберегти" color="primary" variant="subtle" class="mt-4" type="submit" />
                </UForm>

            </template>
        </UModal>
        <section v-if="!preorderInit">
            <div class="grid grid-cols-4 my-4 gap-x-4">
                <UFormField label="Встановлений курс">
                    <div>{{ formInitState.exchangeRate }} zl</div>
                </UFormField>
                <UFormField label="Назва" class="col-span-2">
                    <UInput type="text" v-model="preorderName" class="w-full" />
                </UFormField>
                <div class="flex justify-end">
                    <UFormField label="Дії">
                        <UButton label="Зберегти" variant="subtle" />
                    </UFormField>
                </div>

            </div>
            <SearchBarAdmin @update:search="onSearch" />
            <!-- Table Header -->
            <div
                class="grid grid-cols-14 bg-mtgreen-100 border border-gray-200 rounded-t-lg p-3 text-sm font-semibold text-gray-700">
                <div class="">Дії</div>
                <div class="col-span-7">Назва</div>
                <div>Стара</div>
                <div>Продаж</div>
                <div>Опт</div>
                <div>Закуп</div>
                <div>Промо</div>
                <div class="text-end">
                    <UIcon name="i-lucide:image" />

                </div>

                <!-- <div class="text-end">Дії</div> -->
            </div>

            <!-- Rows -->
            <section v-if="!loading && !error">
                <div class="divide-y divide-gray-100 border-x border-b border-gray-200 rounded-b-lg">
                    <div v-for="product in productList" :key="product.id"
                        class="grid grid-cols-14 items-center p-1 text-sm font-slim gap-x-1">
                        <UCheckbox/>
                        <div class="col-span-7 font-medium hover:underline"><NuxtLink :to="`/admin/products/${product.id}`">{{ product.name_ukr ? product.name_ukr : product.name }}</NuxtLink>
                        </div>
              
                        <UInput />
                        <UInput />
                        <UInput />
                        <UInput />
                        <UInput />
    <img :src="`${product?.files?.[0]?.link}`" width="70"/>
                        <!-- <div class="text-gray-500">{{ product.files.length ? product.files[0] : '-' }}</div> -->

                    </div>

                </div>
                <div class="my-6 flex justify-center" v-if="!loading">
                    <UPagination v-model:page="page" :show-controls="false" :total="totalCount" active-color="neutral"
                        active-variant="subtle" :items-per-page="limit" show-edges />
                </div>
            </section>


            <div v-else-if="loading">
                <AdminLoader />
            </div>
        </section>




    </section>

</template>


<script setup>
const formInitState = reactive({
    exchangeRate: undefined,
    preorderType: ['Польща (zl)', 'Звичайне (грн)'],
    selectedType: undefined
})
const preorderType = ref(['Польща (zl)', 'Звичайне (грн)'])
// const selectedType = ref(undefined)
// const exchangeRate = ref(null)
const modalOpened = ref(false)
const preorderInit = ref(false)
const preorderName = ref(null)

const searchTerm = ref('')
const page = ref(1)
const limit = 50
const totalCount = computed(() => data.value?.count ?? 0)
const onSearch = (value) => {
    searchTerm.value = value
    page.value = 1 // reset pagination on new search
}

const url = computed(() => {
    const offset = (page.value - 1) * limit
    const base = `/api/v1/public/products2/`
    return searchTerm.value.length >= 3
        ? `${base}?filter_param=${encodeURIComponent(searchTerm.value)}&limit=${limit}&offset=${offset}`
        : `${base}?limit=${limit}&offset=${offset}`
})

const { data, error, loading } = useFetchData(
    url
)
const productList = computed(() => data.value?.data ?? [])

const validateExchangeRate = (state) => {
    const errors = []
    if (state.selectedType[0] && !state.exchangeRate) {
        errors.push({ name: 'exchangeRate', message: 'Введіть курс обміну для розрахунків' })
    }
    return errors
}
const togglePreorder = () => {

    modalOpened.value = false
    preorderInit.value = true
}
definePageMeta({
  layout: 'admin'
})
</script>