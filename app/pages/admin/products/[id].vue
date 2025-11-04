<template>
    <section class="w-5/6 lg:w-3/5 mx-auto">
        <h1 class="text-2xl font-extrabold my-4">
            Імʼя продукту
        </h1>
         <form @submit.prevent="handleSubmit" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 ">
                <UFormField label="Name (ukrainian)" name="name_ukr" required>
                    <UInput v-model="newProductData.name_ukr" class="w-full" />
                </UFormField>
                <UFormField label="Brand"  required>
                    <UInput v-model="newProductData.brand" class="w-full" placeholder="e.g. Deluxe" />
                </UFormField>
                <UFormField label="Name (ru)">
                    <UInput v-model="newProductData.name_rus" class="w-full" />
                </UFormField>
                <UFormField label="Original name" name="name_orig">
                    <UInput v-model="newProductData.name_orig" class="w-full" />
                </UFormField>
                <UFormField label="Fiscal name">
                    <UInput v-model="newProductData.name_rus" class="w-full" placeholder="For alcohol only" />
                </UFormField>
                <UFormField label="Barcode">
                    <UInput v-model="newProductData.barcode" class="w-full" />
                </UFormField>
                <UFormField label="Description">
                    <UTextarea v-model="newProductData.description" :rows="4" size="xl" class="w-full" />
                </UFormField>
                <UFormField label="Categories" required>
                    <USelectMenu placeholder="Select category" multiple :items="categories" value-key="id"
                        label-key="name" v-model="newProductData.category" class="w-full" />
                </UFormField>
                <div class="grid grid-cols-3 gap-4">
                    <UFormField label="Weight/Volume" required>
                        <UInput v-model="newProductData.measurements" />
                    </UFormField>
                    <UFormField label="Select unit" required>
                        <USelect v-model="newProductData.units" :items="unitsList" class="w-24 h-8" />
                    </UFormField>
                    <!-- <UFormField label="Sold by weight?" required> -->
                    <UCheckbox label="Sold by weight?" v-model="newProductData.loose" />
                    <!-- </UFormField> -->
                </div>

            </div>
            <UFileUpload color="neutral" highlight label="Drop your image here"
                description="SVG, PNG, JPG or GIF (max. 2MB)" class="md:w-1/2 w-full min-h-92" />
            <div class="text-center">
                <!-- <pre>{{ newProductData }}</pre> -->
                <UButton>Зберегти зміни</UButton>
            </div>
        </form>
    </section>
</template>
<script setup>
const unitsList = ['г', 'кг', 'мл', 'л', 'шт']
const { list: categories } =  useCategories();

// const catItems = [
//     { id: 1, cat_name: 'Молочна продукція' },
//     { id: 2, cat_name: 'М\'ясні вироби' },
//     { id: 3, cat_name: 'Хлібобулочні вироби' },
//     { id: 4, cat_name: 'Овочі та фрукти' },
//     { id: 5, cat_name: 'Напої' },
//     { id: 6, cat_name: 'Кондитерські вироби' },
//     { id: 7, cat_name: 'Консерви' },
//     { id: 8, cat_name: 'Заморожені продукти' },
//     { id: 9, cat_name: 'Снеки та горіхи' },
//     { id: 10, cat_name: 'Побутова хімія' }
// ]


//fetch data

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