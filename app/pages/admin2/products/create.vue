<template>
    <div class="w-5/6 lg:w-3/5 mx-auto mb-10">
        <h1 class="text-2xl font-extrabold my-4">
            Створити новий продукт
        </h1>
        <UForm :validate="validate" :state="product" @submit="handleSaveProduct" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <UFormField label="Назва (українською)" name="name_ukr" required>
                    <UInput v-model="product.name_ukr" class="w-full" />
                </UFormField>
                <UFormField label="Бренд" required name="brand">
                    <USelectMenu class="w-full" v-model="product.brand" v-model:search-term="brandSearch"
                        :items="filteredBrands" label-key="name" value-key="id" placeholder="Оберіть або створіть бренд"
                        create-item="always" @create="createBrand" />
                </UFormField>
                <UFormField label="Назва (російською)" required name="name">
                    <UButton label="перекласти" @click="triggerTranslation" class="mb-2" color="neutral"
                        :loading="isTranslating" />
                    <UInput v-model="product.name" class="w-full" />
                </UFormField>
                <UFormField label="Оригінальна назва" name="name_original">
                    <UInput v-model="product.name_original" class="w-full" />
                </UFormField>
                <UFormField label="Фіскальна назва" name="name_fiscal">
                    <UInput v-model="product.name_fiscal" class="w-full" placeholder="Лиш для алкоголю" />
                </UFormField>
                <UFormField label="Штрих-код" name="barcodes">
                    <UInput v-model="product.barcodes" class="w-full" />
                </UFormField>
                <UFormField label="Опис" name="description_ukr">
                    <UTextarea v-model="product.description_ukr" :rows="4" size="xl" class="w-full" />
                </UFormField>
                <UFormField label="Категорії" name="categories" required>
                    <USelectMenu v-if="Array.isArray(categoriesList) && categoriesList.length"
                        placeholder="Обрати категорію" multiple :items="categoriesList" value-key="name"
                        label-key="name" v-model="product.categories" class="w-full" />
                    <div v-else>завантаження...</div>
                </UFormField>
                <div class="grid grid-cols-3 gap-4">
                    <UFormField label="Вага/обʼєм" required name="measurements">
                        <UInput v-model="product.measurements" type="number" step="0.01" />
                    </UFormField>
                    <UFormField label="Одиниця" required name="measure_units">
                        <ClientOnly>
                            <USelect v-if="Array.isArray(units_list) && units_list.length"
                                v-model="product.measure_units" :items="units_list" value-key="id" label-key="name"
                                class="w-24 h-8" />
                            <template #fallback>
                                <div>loading...</div>
                            </template>
                        </ClientOnly>
                    </UFormField>
                    <UCheckbox label="Ваговий товар?" v-model="product.loose" />
                </div>
            </div>
            <UFormField name="images">
                <UFileUpload v-model="uploadedFile" icon="i-lucide-image" label="Drop your images here"
                    description="SVG, PNG, JPG or GIF (max. 2MB)" layout="list" class="w-96 min-h-48">
                </UFileUpload>
            </UFormField>

            <div class="text-center">
                <UButton type="submit" variant="subtle" color="primary" :disabled="productIsSaving"
                    :loading="productIsSaving">
                    Зберегти</UButton>
            </div>
        </UForm>
    </div>
</template>

<script setup>
const toast = useToast()


definePageMeta({
    layout: 'admin'
})
const { execute } = useAuthFetchMulti()

const { data: brandsData } = useAuthFetchData('/brands/')
const { data: dataUnits, error: unitsError, loading: unitsLoading } = useAuthFetchData('/measure-units/')
const { list: categoriesList } = await useCategories()


const uploadedFile = ref([])
// state
const product = reactive({
    name_ukr: '',
    name: '',
    name_original: '',
    name_fiscal: '',
    barcodes: null,
    description_ukr: '',
    brand: null,
    measurements: null,
    categories: [],
    measure_units: null,
    loose: false,
    images: null
})



watch(uploadedFile, (file) => {
    product.images = file
})

const brands_list = computed(() => brandsData?.value?.data ?? [])

const brandSearch = ref('')

const filteredBrands = computed(() =>
    (brands_list.value ?? []).filter(b => b?.name?.toLowerCase().includes(brandSearch.value.toLowerCase()))
)
const isTranslating = ref(false)
const triggerTranslation = async () => {
    if (!product.name_ukr) return
    isTranslating.value = true
    try {
        const res = await $fetch('/api/translate/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: product.name_ukr,
                source: 'uk',
                target: 'ru'
            })

        })
        // const data = await res.json()
        product.name = res.translated
    }
    catch (e) {
        console.error(e)
    }
    finally {
        isTranslating.value = false
    }

}

const validate = (state) => {
    const errors = []

    if (!state.name_ukr || state.name_ukr.trim().length < 1) {
        errors.push({ name: 'name_ukr', message: 'Обовʼязкове поле' })
    }
    if (!state.name || state.name.trim().length < 1) {
        errors.push({ name: 'name', message: 'Обовʼязкове поле' })
    }
    if (!state.brand) {
        errors.push({ name: 'brand', message: 'Вкажіть бренд' })
    }
    if (!state.categories || state.categories.length < 1) {
        errors.push({ name: 'categories', message: 'Оберіть хоча б одну категорію' })
    }
    if (!state.measurements || isNaN(Number(state.measurements)) || Number(state.measurements) <= 0) {
        errors.push({ name: 'measurements', message: 'Введіть вагу' })
    }
    if (!state.measure_units) {
        errors.push({ name: 'measure_units', message: 'Оберіть одиницю' })
    }

    return errors
}
const createBrand = async (newBrandName) => {
    if (!newBrandName || !newBrandName.trim()) return
    try {
        const res = await execute('/brands/', {
            method: 'POST',
            body: { name: newBrandName.trim().toLowerCase() }
        })
        console.log(res)
        brandsData.value.data.push(res)

        product.brand = res.id
        brandSearch.value = ''
    } catch (e) {
        console.error('Failed to create brand', e?.response?._data || e)
    }
}
const units_list = computed(() => dataUnits?.value?.data ?? [])

const productIsSaving = ref(false)

const handleSaveProduct = async () => {
    productIsSaving.value = true
    try {
        const payload = new FormData()

        for (const [key, value] of Object.entries(product)) {
            if (key === 'images') continue
            if (key === 'barcodes') {
                const barcodeStr = value || '';
                const barcodeArray = barcodeStr.split(',').map(s => s.trim()).filter(Boolean);
                if (barcodeArray.length > 0) {
                    payload.append('barcodes', JSON.stringify({ all: barcodeArray }));
                }
                continue;
            }
            if (Array.isArray(value)) {
                value.forEach(v => payload.append(key, v))
            } else if (value !== null && value !== undefined) {
                payload.append(key, String(value))
            }
        }

        if (uploadedFile.value instanceof File) {
            payload.append('images', uploadedFile.value, uploadedFile.value.name)
        }


        //for (const [k, v] of payload.entries()) console.log(k, v)

        const response = await execute('/products2/', {
            method: 'POST',
            body: payload
        })
        resetForm()
        toast.add({
            title: 'Продукт успішно збережено',
            icon: 'i-lucide:check',
            color: 'success'
        })

    } catch (e) {
        console.error('Failed to save product', e?.response?._data || e)
        toast.add({
            title: 'Помилка збереження',
            icon: 'i-lucide:ban',
            color: 'error'
        })
    }
    finally {
        productIsSaving.value = false
    }
}


const resetForm = () => {
    Object.assign(product, {
        name_ukr: '',
        name: '',
        name_original: '',
        name_fiscal: '',
        barcodes: null,
        description_ukr: '',
        brand: null,
        measurements: null,
        categories: [],
        measure_units: null,
        loose: false,
    })
    uploadedFile.value = null
}

</script>
