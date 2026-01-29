<template>
    <div class="w-5/6 lg:w-3/5 mx-auto mb-10">
        <h1 class="text-2xl font-extrabold my-4">
            Створити новий продукт
        </h1>
        <form @submit.prevent="handleSubmit" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 ">
                <UFormField label="Назва (українською)" name="name_ukr" required>
                    <UInput v-model="newProductData.name_ukr" class="w-full" />
                </UFormField>
                <UFormField label="Бренд" required>
                    <UInput v-model="newProductData.brand" class="w-full" placeholder="наприклад, Deluxe" />
                </UFormField>
                <UFormField label="Назва (російською)">
                    <UInput v-model="newProductData.name_rus" class="w-full" />
                </UFormField>
                <UFormField label="Оригінальна назва" name="name_orig">
                    <UInput v-model="newProductData.name_orig" class="w-full" />
                </UFormField>
                <UFormField label="Фіскальна назва">
                    <UInput v-model="newProductData.name_rus" class="w-full" placeholder="Лиш для алкоголю" />
                </UFormField>
                <UFormField label="Штрих-код">
                    <UInput v-model="newProductData.barcode" class="w-full" />
                </UFormField>
                <UFormField label="Опис">
                    <UTextarea v-model="newProductData.description" :rows="4" size="xl" class="w-full" />
                </UFormField>

                <UFormField label="Категорії" required>
                    <ClientOnly>
                        <USelectMenu v-if="categories.length" placeholder="Оберіть категорію" multiple :items="categories"
                            value-key="id" label-key="name" v-model="newProductData.category" class="w-full" />
                        <div v-else>завантаження...</div>
                    </ClientOnly>
                </UFormField>
                <div class="grid grid-cols-3 gap-4">
                    <UFormField label="Вага/обʼєм" required>
                        <UInput v-model="newProductData.measurements" />
                    </UFormField>
                    <UFormField label="Одиниця" required>
                        <USelect v-model="newProductData.units" :items="unitsList" class="w-24 h-8" />
                    </UFormField>
                    <!-- <UFormField label="Sold by weight?" required> -->
                    <UCheckbox label="Ваговий товар?" v-model="newProductData.loose" />
                    <!-- </UFormField> -->
                </div>

            </div>
            <UFileUpload color="neutral" highlight label="Drop your image here"
                description="SVG, PNG, JPG or GIF (max. 2MB)" class="md:w-1/2 w-full min-h-92" />
            <div class="text-center">
                <!-- <pre>{{ newProductData }}</pre> -->
                <UButton>Save product</UButton>
            </div>
        </form>
    </div>
</template>
<script setup>

// definePageMeta({
//     layout: 'admin'
// })
const { list: categories } = useCategories();


const unitsList = ['г', 'кг', 'мл', 'л', 'шт']
const newProductData = reactive({
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

const handleSubmit = () => { }
definePageMeta({
  layout: 'admin'
})
</script>