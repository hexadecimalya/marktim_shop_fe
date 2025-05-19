<template>
  <UCard v-if="contactDetails" class="2xl:w-5/12 lg:w-7/12 w-11/12 mx-auto mt-8 bg-slate-50">
    <template #header>
      Крок 1 - Контактні дані
    </template>
    <form>
      <UFormGroup label="Номер телефону" name="tel" class="mb-4" :required="true"
        help="Перевірте коректність введеного номеру">
        <UInput type="tel" placeholder="+380" required />
      </UFormGroup>
      <UFormGroup label="Імʼя" name="name" class="mb-4" :required="true">
        <UInput type="text" required />
      </UFormGroup>
      <UFormGroup label="Прізвище" name="surname" class="mb-4" :required="true">
        <UInput type="text" required />
      </UFormGroup>
      <UFormGroup label="Коментар" name="comment" class="mb-4">
        <UInput type="text" />
      </UFormGroup>
      <UButton class="my-4 mx-auto">Далі</UButton>
    </form>
  </UCard>


  <UCard v-else-if="deliveryOptions" class="2xl:w-5/12 lg:w-7/12 w-11/12 mx-auto mt-8 bg-slate-50">
    <template #header>
      Крок 2 - Доставка
    </template>
    <form>
      <URadioGroup v-model="selected" legend="Оберіть опцію" :options="options" />
<UButton class="my-4 mx-auto">Оформити замовлення</UButton>
    </form>
  </UCard>

  <UCard v-else>
    <template #header>
      Замовлення оформлено успішно!
    </template>
  </UCard>


</template>




<script setup>

const contactDetails = ref(false)
const deliveryOptions = ref(true)
const options = [{
  value: 'offline',
  label: 'Самовивіз з магазину'
}, {
  value: 'delivery',
  label: 'Доставка по Україні'
}]

const selected = ref('offline')
</script>