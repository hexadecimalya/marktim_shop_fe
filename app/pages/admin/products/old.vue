<template>
    <ClientOnly>
        <section v-if="productDataReady" class="w-5/6  mx-auto">
            <h1 class="text-2xl font-extrabold my-4">
                {{ productData.name_ukr ?? productData.name }}
            </h1>
            <form @submit.prevent="handleSubmit" class="space-y-6">
                <!-- <pre>{{ formData }}</pre> -->
            <!-- <UForm @submit="handleSubmit" :state="formData" class="space-y-6"> -->


                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 ">
                    <UFormField label="Назва (укр)" name="name_ukr" required>
                        <UInput v-model="formData.name_ukr" class="w-full" />
                    </UFormField>
                    <!-- <UFormField label="Бренд" required>
                    <UInput v-model="initialProductData.brand" class="w-full" placeholder="e.g. Deluxe" />
                </UFormField>
                <UFormField label="Назва (рос)">
                    <UInput v-model="initialProductData.name_rus" class="w-full" />
                </UFormField>
                <UFormField label="Original name" name="name_orig">
                    <UInput v-model="initialProductData.name_orig" class="w-full" />
                </UFormField>
                <UFormField label="Fiscal name">
                    <UInput v-model="initialProductData.name_rus" class="w-full" placeholder="For alcohol only" />
                </UFormField>
                <UFormField label="Barcode">
                    <UInput v-model="initialProductData.barcode" class="w-full" />
                </UFormField>
                <UFormField label="Description">
                    <UTextarea v-model="initialProductData.description" :rows="4" size="xl" class="w-full" />
                </UFormField>
                <UFormField label="Categories" required>
                    <USelectMenu placeholder="Select category" multiple :items="categories" value-key="id"
                        label-key="name" v-model="initialProductData.category" class="w-full" />
                </UFormField>
                <div class="grid grid-cols-3 gap-4">
                    <UFormField label="Weight/Volume" required>
                        <UInput v-model="initialProductData.measurements" />
                    </UFormField>
                    <UFormField label="Select unit" required>
                        <USelect v-model="initialProductData.units" :items="unitsList" class="w-24 h-8" />
                    </UFormField>
                    <UCheckbox label="Sold by weight?" v-model="initialProductData.loose" /> -->

                    <!-- </div> -->

                </div>

                <UFileUpload color="neutral" highlight label="Drop your image here"
                    description="SVG, PNG, JPG or GIF (max. 2MB)" class="md:w-1/2 w-full min-h-92" />
                <div class="text-center">
                    <!-- <pre>{{ newProductData }}</pre> -->
                    <UButton>Зберегти зміни</UButton>
                </div>
            <!-- </UForm> -->
            </form>
        </section>

        <section v-else>loading ...</section>
    </ClientOnly>
</template>
<script setup>
const unitsList = ['г', 'кг', 'мл', 'л', 'шт']
// const { list: categories } =  useCategories()
const route = useRoute()
const config = useRuntimeConfig()
const { data, pending } = useFetchData(
  `admin-product-${route.params.id}`,
  computed(() => `${config.public.siteUrl}/api/v1/public/products2/${route.params.id}/`)
)

const productData = computed(() => data?.value || {})
const productDataReady = computed(() => Object.keys(productData.value).length > 0)

const formData = reactive({
  name_ukr: ''
})

watchEffect(() => {
  if (productDataReady.value) {
    formData.name_ukr = productData.value.name_ukr ?? ''
  }
})

const handleSubmit = () => {
  const updatedProduct = {
    name_ukr: formData.name_ukr
    // Add other fields as needed
  }
  // Submit logic here
}

definePageMeta({
  layout: 'admin'
})
</script>

