<template>
    <!-- <ClientOnly> -->
        <section v-if="!pending" class="w-5/6  mx-auto">
            <h1 class="text-2xl font-extrabold my-4">
                {{ productData.name_ukr ?? productData.name }}
            </h1>
            <form @submit.prevent="handleSubmit" class="space-y-6">
                <pre>{{ data }}</pre>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 ">
                    <UFormField label="Назва (укр)" name="name_ukr" required>
                        <UInput class="w-full" v-model="formData.name_ukr" />
                    </UFormField>
                    <UFormField label="Бренд" name="brand" required>
                        <UInput v-model="formData.brand" class="w-full" placeholder="e.g. Deluxe" />
                    </UFormField>
                    <UFormField label="Назва (рос)" name="name_rus">
                        <UInput v-model="formData.name_rus" class="w-full" />
                    </UFormField>
                    <UFormField label="Original name" name="name_orig">
                        <UInput v-model="formData.name_orig" class="w-full" />
                    </UFormField>
                    <UFormField label="Фіскальна назва" name="name_fiscal">
                        <UInput v-model="formData.name_fiscal" class="w-full" placeholder="For alcohol only" />
                    </UFormField>
                    <UFormField label="Штрихкод" name="barcode">
                        <UInput v-model="formData.barcode" class="w-full" />
                    </UFormField>
                    <UFormField label="Description" name="description">
                        <UTextarea v-model="formData.description" :rows="4" size="xl" class="w-full" />
                    </UFormField>
                    <UFormField label="Categories" required>
                        <USelectMenu placeholder="Select category" multiple :items="categories" value-key="id"
                            label-key="name" v-model="formData.category" class="w-full" />
                    </UFormField>
                    <div class="grid grid-cols-3 gap-4">
                        <UFormField label="Weight/Volume"  required>
                            <UInput v-model="formData.measurements" />
                        </UFormField>
                        <UFormField label="Select unit" required>
                            <USelect v-model="formData.units" :items="unitsList" class="w-24 h-8" />
                        </UFormField>
                        <UCheckbox label="Sold by weight?" v-model="formData.loose" />
                    </div>
                </div>
                <UFileUpload color="neutral" highlight label="Drop your image here"
                    description="SVG, PNG, JPG or GIF (max. 2MB)" class="md:w-1/2 w-full min-h-92" />
                <div class="text-center">

                    <UButton>Зберегти зміни</UButton>
                </div>

            </form>
        </section>

        <section v-else><AdminLoader/></section>
    <!-- </ClientOnly> -->
</template>
<script setup>
const config = useRuntimeConfig()

const unitsList = ['г', 'кг', 'мл', 'л', 'шт']
const { list: categories } =  await useCategories();

const route = useRoute()

const { data, pending } = await useFetchData(
    `admin-product-${route.params.id}`,
    computed(() => `${config.public.siteUrl}/api/v1/public/products2/${route.params.id}/`)
)

const productData = computed(() => data?.value)

const formData = reactive({
    name_ukr: '',
    name_rus: '',
    name_fiscal: '',
    name_orig: '',
    measurements: '',
    units: unitsList[0],
    brand: '',
    description: '',
    barcode: '',
    loose: false,
    category: [],
    image: null
})

watch(productData, (p) => {
  if (!p) return

  Object.assign(formData, {
    name_ukr: p.name_ukr ?? '',
    name_rus: p.name ?? '',
    name_fiscal: p.name_fiscal ?? '',
    name_orig: p.name_original ?? '',
    measurements: p.measurements ?? '',
    units: p.units ?? unitsList[0],
    brand: p.brand ?? '',
    description: p.description ?? '',
    barcode: p.barcode ?? '',
    loose: p.loose ?? false,
    category: p.categories?.map(c => c.name) ?? [],
    image: p.image ?? null
  })
}, { immediate: true })

definePageMeta({
    layout: 'admin'
})
</script>
