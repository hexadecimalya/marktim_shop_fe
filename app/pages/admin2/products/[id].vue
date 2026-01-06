<template>
    <section v-if="product && product.id" class="w-5/6 mx-auto" :key="prodId">
        <h1 class="text-2xl font-extrabold my-4">
            {{ product.name_ukr ?? product.name }}
        </h1>
<pre>{{ product }}</pre>
        <form @submit.prevent="handleSubmit" class="space-y-6">
            <!-- <pre>{{ data }}</pre> -->

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <UFormField label="Назва (укр)" name="name_ukr" required>
                    <UInput class="w-full" v-model="formData.name_ukr" />
                </UFormField>

                <UFormField label="Бренд" name="brand">
                    <UInput v-model="formData.brand" class="w-full" placeholder="e.g. Deluxe" />
                </UFormField>

                <UFormField label="Назва (рос)" name="name_rus">
                    <UInput v-model="formData.name_rus" class="w-full" />
                </UFormField>

                <UFormField label="Оригінальне імʼя" name="name_orig">
                    <UInput v-model="formData.name_orig" class="w-full" />
                </UFormField>

                <UFormField label="Фіскальна назва" name="name_fiscal">
                    <UInput v-model="formData.name_fiscal" class="w-full" placeholder="Лиш для алкоголю" />
                </UFormField>

                <UFormField label="Штрихкод" name="barcode">
                    <UInput v-model="formData.barcode" class="w-full" />
                </UFormField>

                <UFormField label="Description" name="description">
                    <UTextarea v-model="formData.description" :rows="4" size="xl" class="w-full" />
                </UFormField>

                <!-- <UFormField label="Категорії" name="category" required>
                    <USelectMenu placeholder="Обрати категорію" multiple :items="categories" value-key="id"
                        label-key="name" v-model="formData.category" class="w-full" />
                </UFormField> -->
                <UFormField label="Категорії" name="category" required>
                    <USelectMenu v-if="Array.isArray(categories) && categories.length" placeholder="Обрати категорію"
                        multiple :items="categories" value-key="id" label-key="name" v-model="formData.category"
                        class="w-full" />
                    <div v-else>завантаження...</div>
                </UFormField>

                <div class="grid grid-cols-3 gap-4">
                    <UFormField label="Вага/Обʼєм" name="measurment" required>
                        <UInput v-model="formData.measurements" />
                    </UFormField>

                    <UFormField label="Одиниця" name="unit" required>
                        <USelect v-model="formData.units" :items="unitsList" class="w-24 h-8" />
                    </UFormField>

                    <UCheckbox label="Ваговий товар?" v-model="formData.loose" />
                </div>
            </div>
            <div class="flex">
                <img :src="formData.image" width="400" class="border rounded-md border-gray-300" />

            </div>
            <UFileUpload v-if="!formData.image" color="neutral" highlight label="Drop your image here"
                description="SVG, PNG, JPG or GIF (max. 2MB)" class="md:w-1/2 w-full min-h-92" />

            <div class="text-center mb-6">
                <UButton type="submit">Зберегти зміни</UButton>
            </div>
        </form>
    </section>

    <section v-else-if="loading" class="w-5/6 mx-auto">
        <AdminLoader />
    </section>
    <section v-else class="text-gray-500 mb-6 text-center">
        <p>
            При обробці запиту виникла помилка
        </p>
        <p>
            {{ error }}
        </p>

    </section>
</template>

<script setup>



// Route
const route = useRoute()
const prodId = route.params.id

// Constants
const unitsList = ['г', 'кг', 'мл', 'л', 'шт']

const { list: categories } = await useCategories()

const { data, error, loading, refresh } = useFetchData(
    computed(() => `/api/v1/public/products2/${prodId}/`)
)

const product = computed(() => data.value ?? null)

const mapProductToForm = (product) => {
    return {
        name_ukr: product?.name_ukr ?? '',
        name_rus: product?.name ?? '',
        name_fiscal: product?.name_fiscal ?? '',
        name_orig: product?.name_original ?? '',
        measurements: product?.measurements ?? '',
        units: product?.units ?? unitsList[0],
        brand: product?.brand ?? '',
        description: product?.description ?? '',
        barcode: product?.barcode ?? '',
        loose: product?.loose ?? false,
        category: product?.categories?.map(c => c.id) ?? [],
        image: product?.files?.[0]?.link ?? null
    }
}


const formData = reactive(mapProductToForm(product.value))
watchEffect(() => {
    if (product.value?.id) {
        Object.assign(formData, mapProductToForm(product.value))
    }
})

const handleSubmit = async () => {
    const payload = {
        name_ukr: formData.name_ukr,
        name_rus: formData.name_rus,
        name_fiscal: formData.name_fiscal,
        name_orig: formData.name_orig,
        measurements: formData.measurements,
        units: formData.units,
        brand: formData.brand,
        description: formData.description,
        barcode: formData.barcode,
        loose: formData.loose,
        category: formData.category,
        image: formData.image
    }

    try {
        await $fetch(`/api/v1/public/products2/${prodId}/`, {
            method: 'PUT',
            body: payload
        })
        // Optionally refresh product data to show updated server state
        await refresh()
    } catch (e) {
        // Handle errors (toast, UI feedback)
        console.error(e)
    }
}

// definePageMeta({ layout: 'admin' })
</script>
