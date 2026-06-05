<template>
    <div class="w-5/6 lg:w-3/5 mx-auto mb-10">
        <h1 class="text-2xl font-extrabold my-4">
            Редагувати продукт
        </h1>
        <!-- <div  class="text-center py-10">Завантаження...</div> -->
        <AdminLoader v-if="productLoading" />
        <div v-else-if="productError" class="text-center py-10 text-red-500">Помилка завантаження продукту</div>

        <UForm v-else :validate="validate" :state="product" @submit="handleSaveProduct" class="space-y-6">
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
                    <UTextarea v-model="product.description_ukr" :rows="4" size="xl" class=" text-xs w-full" />
                </UFormField>

                <UFormField label="Категорії" name="categories" required>
                    <USelectMenu v-if="Array.isArray(categoriesList) && categoriesList.length"
                        placeholder="Обрати категорію" multiple :items="categoriesList" value-key="name"
                        label-key="name" v-model="product.categories" class="w-full" />
                    <div v-else>завантаження...</div>
                </UFormField>

                <div class="grid grid-cols-3 gap-4">
                    <UFormField label="Вага/обʼєм" :required="!product.loose" name="measurements">
                        <UInput v-model="product.measurements" type="number" :disabled="product.loose" />
                    </UFormField>
                    <UFormField label="Одиниця" required name="measure_units">
                        <ClientOnly>
                            <USelect v-model="product.measure_units" :items="units_list" value-key="id" label-key="name"
                                class="w-24 h-8" />
                            <template #fallback>
                                <div>loading...</div>
                            </template>
                        </ClientOnly>
                    </UFormField>
                    <UCheckbox label="Ваговий товар?" id="checkbox-id" v-model="product.loose" />
                </div>
                <UFormField label="Код продукту" name="product_code">
                    <UInput v-model="product.product_code" class="w-full" />
                </UFormField>

            </div>
            <div v-if="product.name_rozetka || product.rozetka_id"
                class="border border-green-200 bg-linear-to-br from-green-50 to-emerald-50/30 rounded-xl p-4">
                <!-- Header -->
                <div class="flex items-center gap-2 mb-4">
                    <div class="flex items-center justify-center w-7 h-7 rounded-full bg-green-500">
                        <UIcon name="i-lucide:check" class="text-white w-4 h-4" />
                    </div>
                    <span class="text-sm font-semibold text-green-700">Товар присутній на Rozetka</span>
                </div>

                <!-- Fields -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <UFormField label="Код продукту" name="rozetka_id">
                        <UInput v-model="product.rozetka_id" class="w-full" />
                    </UFormField>
                    <UFormField label="Код в прайсі" name="rozetka_price_offer_id">
                        <UInput v-model="product.rozetka_price_offer_id" class="w-full" />
                    </UFormField>

                    <div class="bg-white/70 rounded-lg px-3 py-2 border border-green-100">
                        <p class="text-xs text-gray-400 mb-0.5">Назва</p>
                        <p class="text-sm font-medium text-gray-700">{{ product.name_rozetka }}</p>
                    </div>
                    <div class="bg-white/70 rounded-lg px-3 py-2 border border-green-100">
                        <p class="text-xs text-gray-400 mb-0.5">Назва (укр)</p>
                        <p class="text-sm font-medium text-gray-700">{{ product.name_rozetka_ukr }}</p>
                    </div>
                </div>
            </div>
            <!-- Existing images -->
            <div v-if="existingImages.length" class="space-y-2">
                <p class="text-sm font-medium">Поточні зображення</p>
                <div class="flex flex-wrap gap-3">
                    <div v-for="img in existingImages" :key="img.id" class="relative group w-24 h-24">
                        <img :src="img.link" class="w-full h-full object-cover rounded-md border" />
                        <button type="button" @click="markImageForDeletion(img)"
                            class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
                        <div v-if="imagesToDelete.includes(img.id)"
                            class="absolute inset-0 bg-red-500/40 rounded-md flex items-center justify-center text-white text-xs font-bold">

                        </div>
                    </div>
                </div>
            </div>
            <ClientOnly>
                <UFormField name="images">
                    <UFileUpload v-model="uploadedFile" icon="i-lucide-image" label="Drop your images here" multiple
                        description="SVG, PNG, JPG or GIF (max. 2MB)" layout="list" class="w-96 min-h-48" />
                </UFormField>
            </ClientOnly>
            <div class="text-center flex justify-center gap-4">
                <UButton type="submit" variant="subtle" color="primary" :disabled="productIsSaving"
                    :loading="productIsSaving">
                    Зберегти зміни
                </UButton>
                <UButton type="button" variant="outline" color="neutral" icon="i-lucide:copy" @click="openAsCopy">
                    Створити копію
                </UButton>
            </div>
        </UForm>
    </div>
</template>

<script setup>
import AdminLoader from '~/components/UI/admin-loader.vue'

const toast = useToast()
const route = useRoute()
const productId = route.params.id

definePageMeta({
    layout: 'admin'
})

const { execute } = useAuthFetchMulti()
const { data: brandsData } = useAuthFetchData('/brands/')
const { data: dataUnits, error: unitsError, loading: unitsLoading } = useAuthFetchData('/measure-units/')
const { list: categoriesList } = await useCategories()

// Fetch existing product
const { data: productData, error: productError, loading: productLoading } = useAuthFetchData(`/products2/${productId}/`)

const uploadedFile = ref([])
const existingImages = ref([])
const imagesToDelete = ref([])

const product = reactive({
    name_ukr: '',
    name: '',
    name_original: '',
    name_fiscal: '',
    barcodes: {
        all: []
    },
    description_ukr: '',
    product_code: '',
    brand: null,
    measurements: null,
    categories: [],
    rozetka_id: '',
    rozetka_price_offer_id: '',
    name_rozetka_ukr: '',
    name_rozetka: '',
    measure_units: null,
    loose: false,
    images: []
})

// Populate form once product data is loaded
watch(productData, (data) => {
    if (!data) return
    const p = data?.data ?? data
    Object.assign(product, {
        name_ukr: p.name_ukr ?? '',
        name: p.name ?? '',
        name_original: p.name_original ?? '',
        name_fiscal: p.name_fiscal ?? '',
        //barcodes: p.barcodes ?? [],
        barcodes: p.barcodes?.all ? p.barcodes.all.join(', ') : (Array.isArray(p.barcodes) ? p.barcodes.join(', ') : ''),
        description_ukr: p.description_ukr ?? '',
        brand: p.brand?.id ?? null,
        product_code: p.product_code ?? '',
        rozetka_id: p.rozetka_id,
        rozetka_price_offer_id: p.rozetka_price_offer_id,
        name_rozetka_ukr: p.name_rozetka_ukr,
        name_rozetka: p.name_rozetka,
        measurements: p.measurements ?? null,
        categories: p.categories?.map(c => c.name ?? c) ?? [],
        measure_units: p.measure_units?.id ?? null,
        loose: p.loose ?? false,
    })
    existingImages.value = p.files ?? []
}, { immediate: true })

watch(uploadedFile, (file) => {
    product.images = file
})

const markImageForDeletion = (img) => {
    if (imagesToDelete.value.includes(img.id)) {
        imagesToDelete.value = imagesToDelete.value.filter(id => id !== img.id)
    } else {
        imagesToDelete.value.push(img.id)
    }
}

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
        const res = await fetch('/api/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: product.name_ukr, source: 'uk', target: 'ru' })
        })
        const data = await res.json()
        product.name = data.translated
    } catch (e) {
        console.error(e)
    } finally {
        isTranslating.value = false
    }
}

const validate = (state) => {
    const errors = []
    if (!state.name_ukr || state.name_ukr.trim().length < 1)
        errors.push({ name: 'name_ukr', message: 'Обовʼязкове поле' })
    if (!state.name || state.name.trim().length < 1)
        errors.push({ name: 'name', message: 'Обовʼязкове поле' })
    if (!state.brand)
        errors.push({ name: 'brand', message: 'Вкажіть бренд' })
    if (!state.categories || state.categories.length < 1)
        errors.push({ name: 'categories', message: 'Оберіть хоча б одну категорію' })
    if ((!state.measurements || isNaN(Number(state.measurements)) || Number(state.measurements) <= 0) && !state.loose)
        errors.push({ name: 'measurements', message: 'Введіть вагу' })
    if (!state.measure_units)
        errors.push({ name: 'measure_units', message: 'Оберіть одиницю' })
    return errors
}

const createBrand = async (newBrandName) => {
    if (!newBrandName || !newBrandName.trim()) return
    try {
        const res = await execute('/brands/', {
            method: 'POST',
            body: { name: newBrandName.trim().toLowerCase() }
        })
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
                const barcodeArray = value.split(',').map(s => s.trim()).filter(Boolean)

                payload.append('barcodes', JSON.stringify({ all: barcodeArray }))
                continue
            }
            if (Array.isArray(value)) {
                value.forEach(v => payload.append(key, v))
            } else if (value !== null && value !== undefined) {
                payload.append(key, String(value))
            }
        }

        if (Array.isArray(uploadedFile.value)) {
            uploadedFile.value.forEach(file => {
                payload.append('images', file, file.name)
            })
        }

        if (imagesToDelete.value.length) {
            await Promise.all(
                imagesToDelete.value.map(id =>
                    execute(`/products/${productId}/files/${id}/`, { method: 'DELETE' })
                )
            )
        }
        const res = await execute(`/products2/${productId}/`, {
            method: 'PATCH',
            body: payload
        })

        const refreshed = await execute(`/products2/${productId}/`)
        const updatedProduct = refreshed?.data ?? refreshed


        existingImages.value = updatedProduct.files ?? []

        toast.add({
            title: 'Продукт успішно оновлено',
            icon: 'i-lucide:check',
            color: 'success'
        })

        // Remove deleted images from the displayed list
        existingImages.value = existingImages.value.filter(img => !imagesToDelete.value.includes(img.id))
        imagesToDelete.value = []
        uploadedFile.value = []

    } catch (e) {
        console.error('Failed to update product', e?.response?._data || e)
        toast.add({
            title: 'Помилка збереження',
            icon: 'i-lucide:ban',
            color: 'error'
        })
    } finally {
        productIsSaving.value = false
    }
}

const router = useRouter()

const openAsCopy = () => {
    const copyData = {
        name_ukr:        product.name_ukr,
        name_original:   product.name_original,
        name_fiscal:     product.name_fiscal,
        description_ukr: product.description_ukr,
        brand:           product.brand,
        measurements:    product.measurements,
        categories:      product.categories,
        measure_units:   product.measure_units,
        loose:           product.loose,
    }
    sessionStorage.setItem('product_copy_prefill', JSON.stringify(copyData))
    window.open(router.resolve('/administrative/products/create').href, '_blank')
}


useHead({title: 'Редагування продукту'})
</script>