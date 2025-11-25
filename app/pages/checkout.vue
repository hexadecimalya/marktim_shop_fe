<template>
    <div
        class="max-w-4xl lg:max-w-6xl container mx-auto p-2 my-0 md:my-4 lg:my-12 sm:p-6 border border-gray-200 rounded-sm">
        <h1 class="font-semibold text-2xl mb-2 md:mb-6">Оформити замовлення</h1>
        <!-- <div v-if="guestMode" class="my-4 text-center  bg-mtgreen-50 p-4">
            <div class="bg-mtgreen-50 border-l-4 border-mtgreen-200 p-4 rounded text-sm">
                <p>
                Для того, щоб скористатися всіми перевагами легкого шопінгу, рекомендуємо
                <NuxtLink to="/auth/register" class="underline">зареєструватися</NuxtLink>.
            </p>
            <p>
                Вже маєте обліковий запис?
                <NuxtLink to="/auth/login" class="underline">увійдіть</NuxtLink>, щоб отримати знижку, що відповідає
                Вашій
                картці клієнта.
            </p>
            </div>
            
        </div> -->

        <UForm :state="state" @submit="handleSubmit" class="space-y-6" :validate="validate">
            <h2 class="md:text-lg font-semibold my-4">1. Дані клієнта</h2>
            <div>
                <section class="w-full lg:w-1/2 space-y-4">
                    <UFormField label="Імʼя" name="firstName" required>
                        <UInput v-model="state.firstName" class="w-full" :ui="{ base: 'rounded-xs' }"
                            placeholder="Введіть імʼя" />
                    </UFormField>
                    <UFormField label="Прізвище" name="lastName" required>
                        <UInput v-model="state.lastName" class="w-full" :ui="{ base: 'rounded-xs' }"
                            placeholder="Введіть прізвище" />
                    </UFormField>
                    <UFormField label="Номер телефону" name="phone" required>
                        <UInput v-model="state.phone" class="w-full" :ui="{ base: 'rounded-xs' }"
                            placeholder="Використовуйте формат +38093XXXXXXX або 093XXXXXXX" />
                    </UFormField>
                    <UFormField label="Коментар" name="comment">
                        <UTextarea v-model="state.comment" :rows="4" size="xl" class="w-full" />
                    </UFormField>
                    <!-- <UFormField label="Електронна пошта" name="email">
                        <UInput v-model="state.email" class="w-full" :ui="{ base: 'rounded-xs' }" />
                    </UFormField> -->
                    <!-- <div class="flex justify-between">
                <div class="">Номер картки клієнта:</div>
                <div>0987654567</div>
            </div>
         -->

                </section>
            </div>

            <USeparator />
            <h2 class="md:text-lg font-semibold my-4">2. Методи доставки</h2>

            <URadioGroup v-model="deliveryType" :items="deliveryItems" class="my-4" />
            <div v-if="deliveryType === deliveryItems[1]" class="space-y-4">
                <DeliveryForm v-model:city="selectedCity" v-model:warehouse="selectedWarehouse" />
                <UCheckbox label="Отримувач інша людина" v-model="anotherRecipient" />

                <section v-if="anotherRecipient" class="w-full lg:w-1/2 space-y-4">
                    <UFormField label="Імʼя отримувача" name="anotherRfirstName">
                        <UInput v-model="state.anotherRfirstName" class="w-full" :ui="{ base: 'rounded-xs' }" />
                    </UFormField>
                    <UFormField label="Прізвище " name="anotherRLastName">
                        <UInput v-model="state.anotherRLastName" class="w-full" :ui="{ base: 'rounded-xs' }" />
                    </UFormField>
                    <UFormField label="Номер телефону" name="anotherRPhone">
                        <UInput v-model="state.anotherRPhone" class="w-full" :ui="{ base: 'rounded-xs' }" />
                    </UFormField>


                </section>
            </div>
            <div class="w-48 mx-auto">
                <AppButton type="submit" :disabled="isProcessing">
                    {{ !isProcessing ? 'підтвердити' : 'обробка' }}
                </AppButton>
            </div>
        </UForm>
    </div>


</template>
<script setup>

const orderInfo = useState('orderInfo', ()=> null)
const cart = useCartStore()
const {
    stockItems,
    preorderItems,
} = storeToRefs(cart)


const router = useRouter()
const deliveryItems = ref(['Я заберу замовлення самостійно в MarkTim', 'Доставка по Україні'])
// const guestMode = ref(true)
const selectedCity = ref(null)
const selectedWarehouse = ref(null)
const deliveryType = ref(deliveryItems.value[0])
const anotherRecipient = ref(false)
const state = reactive({
    // email: '',
    phone: '',
    firstName: '',
    lastName: '',
    deliveryType: '',
    comment: '',
    anotherRfirstName: '',
    anotherRLastName: '',
    anotherRPhone: '',

})

const validate = (state) => {
    const errors = []

    if (!state.firstName || state.firstName.trim().length < 2) {
        errors.push({ name: 'firstName', message: 'Обовʼязкове поле' })
    }
    if (!state.firstName || state.lastName.trim().length < 2) {
        errors.push({ name: 'lastName', message: 'Обовʼязкове поле' })
    }
    if (!state.phone || state.phone.trim().length < 10) {
        errors.push({ name: 'phone', message: 'Обовʼязкове поле' })
    }

    if (anotherRecipient.value) {
        if (!state.firstName || state.anotherRfirstName.trim().length < 2) {
            errors.push({ name: 'anotherRfirstName', message: 'Обовʼязкове поле' })
        }
        if (!state.firstName || state.anotherRLastName.trim().length < 2) {
            errors.push({ name: 'anotherRLastName', message: 'Обовʼязкове поле' })
        }
        if (!state.phone || state.anotherRPhone.trim().length < 10) {
            errors.push({ name: 'anotherRPhone', message: 'Обовʼязкове поле' })
        }
    }
    return errors
}
const isProcessing = ref(false)

const handleSubmit = async () => {
    isProcessing.value = true
    //unpacking 
    const products = [
        ...stockItems.value.map(item => ({
            id: item.id,
            product_preorder_id: null,
            stock_id: item.id,
            amount: item.quantity
        })),
        ...preorderItems.value.map(item => ({
            id: item.id,
            product_preorder_id: item.id,
            stock_id: null,
            amount: item.quantity
        }))
    ]

    const newOrder = {
        phone_number: state.phone.trim(),
        name: state.firstName,
        last_name: state.lastName,
        order_type: stockItems.value.length && preorderItems.value.length
            ? "stock/preorder"
            : stockItems.value.length
                ? "stock"
                : "preorder",

        comment: state.comment,
        delivery_type: deliveryType.value === deliveryItems.value[0]
            ? "takeaway"
            : "ukraine_delivery",
        city: selectedCity.value?.label ?? null,
        np_dept: selectedWarehouse.value?.label ?? null,
        another_r_phone: state.anotherRPhone || null,
        another_r_name: state.anotherRfirstName || null,
        another_r_lastname: state.anotherRLastName || null,
        products
    }
    try {
        const res = await $fetch('https://marktim.shop/api/v1/public/orders/', {
            method: 'POST',
            body: newOrder,
            headers: {
                'Content-Type': 'application/json',
            }
        })
        orderInfo.value = {
            id: res.id,
            deliveryType: deliveryType.value
        }
        // redirect
        router.push({
            path: "/order-confirmation",
            query: {
                number: res.id
            },
        })
    } catch (e) {
        console.log("Order error:", e)
    } finally {
        isProcessing.value = false
    }
}

// redirect on reload
definePageMeta({ middleware: 'checkout' })
useHead({
  title: 'Дані замовника'
})
</script>