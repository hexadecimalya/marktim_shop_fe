<template>
  <div class="w-5/6 mx-auto">
   
    <section class="max-w-6xl mx-auto p-4 space-y-4">
 <h1 class="text-2xl font-extrabold my-4">
      Новий продаж
    </h1>
      <!-- Клієнт -->
      <UCard>
        <template #header>Клієнт</template>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <UInput class="col-span-3" v-model="customerQuery" placeholder="Карта клієнта або імʼя"
            @input="searchCustomer" />
          <!-- <USelect v-if="foundCustomers.length" :options="foundCustomers" option-label="label" option-value="id"
            v-model="selectedCustomerId" /> -->
          <UModal title="Додати контрагента">
            <UButton label="Новий клієнт" />

            <template #body>
              <UForm @submit="handleAddCounterParty" class="space-y-4">
                <UFormField label="Тип контрагента" required>
                  <UDropdownMenu :items="dropdownItems" class="w-full" :content="{
                    align: 'start',
                    side: 'bottom',
                    sideOffset: 8
                  }" :ui="{
      content: 'w-96'
    }">
                    <UButton label="Обрати..." icon="i-lucide-user-round" color="neutral" variant="outline" />
                  </UDropdownMenu>
                </UFormField>
                <UFormField label="Імʼя та прізвище (Назва організації)" required>
                  <UInput class="w-full" />
                </UFormField>
                <UFormField label="Номер телефону">
                  <UInput class="w-full" />
                </UFormField>
                <UFormField label="Номер картки лояльності">
                  <UInput class="w-full" />
                </UFormField>
                <UFormField label="Коментар">
                  <UInput class="w-full" />
                </UFormField>

                <UButton type="submit" label="Зберегти" />
              </UForm>

            </template>

          </UModal>
        </div>
      </UCard>

      <!-- Додавання товару -->
      <UCard>
        <template #header>Товари</template>

        <div class="grid grid-cols-7 gap-4 mb-4">
          <UFormField label="Назва" class="col-span-3">

            <UInput v-model="productQuery" placeholder="Назва або штрих-код" @keyup.enter="addProductByQuery"
              class="w-full" />
          </UFormField>
          <UFormField label="Ціна">
            <UInput v-model.number="productForm.price" type="number" placeholder="Ціна" />
          </UFormField>
          <UFormField label="Кількість">
            <UInput v-model.number="productForm.qty" type="number" placeholder="Кількість" />

          </UFormField>
          <UFormField label="Знижка">
            <UInput v-model.number="productForm.discount" type="number" placeholder="Знижка %" />

          </UFormField>
          <div class="flex flex-col-reverse">
            <UButton icon="i-lucide-circle-plus" size="md" color="primary" variant="solid" @click="addManualProduct">
              Додати
            </UButton>
          </div>
        </div>

        <!-- Список -->
        <UTable :rows="items" :columns="columns">
          <template #sum-data="{ row }">
            {{ format(row.sum) }}
          </template>
          <template #actions-data="{ index }">
            <UButton color="red" variant="ghost" @click="removeItem(index)">✕</UButton>
          </template>
        </UTable>
      </UCard>

      <!-- Підсумок -->
      <UCard>
        <div class="flex justify-between items-center">
          <div class="text-xl font-semibold">Всього:</div>
          <div class="text-2xl font-bold">{{ format(total) }}</div>
        </div>
      </UCard>

      <!-- Оплата -->
      <UCard>
        <template #header>Оплата</template>
        <URadioGroup v-model="paymentMethod" :options="paymentOptions" />
      </UCard>

      <!-- Дії -->
      <div class="flex gap-4 justify-end">
        <UButton color="neutral" @click="holdReceipt">Відкласти чек</UButton>
        <UButton color="primary" @click="submitSale">Провести продаж</UButton>
      </div>

    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

/* --- Клієнт --- */
const customerQuery = ref('')
const foundCustomers = ref([])
const selectedCustomerId = ref(null)

const mockCustomers = [
  { id: 1, name: 'Іван Петренко', card: '1234' },
  { id: 2, name: 'Олена Коваль', card: '5678' }
]

function searchCustomer() {
  foundCustomers.value = mockCustomers
    .filter(c =>
      c.name.toLowerCase().includes(customerQuery.value.toLowerCase()) ||
      c.card.includes(customerQuery.value)
    )
    .map(c => ({ id: c.id, label: `${c.name} (${c.card})` }))
}

const selectedCustomer = computed(() =>
  mockCustomers.find(c => c.id === selectedCustomerId.value)
)

/* --- Товари --- */
const productQuery = ref('')
const productForm = ref({ price: 0, qty: 1, discount: 0 })

const dropdownItems = [
  {
    label: 'Profile',
    icon: 'i-lucide-user'
  },
  {
    label: 'Billing',
    icon: 'i-lucide-credit-card'
  },
  {
    label: 'Settings',
    icon: 'i-lucide-cog'
  }
]

const items = ref([])

const columns = [
  {
    id: 'name',
    accessorKey: 'name',
    header: 'Товар'
  },
  {
    id: 'price',
    accessorKey: 'price',
    header: 'Ціна'
  },
  {
    id: 'qty',
    accessorKey: 'qty',
    header: 'К-сть'
  },
  {
    id: 'discount',
    accessorKey: 'discount',
    header: 'Знижка %'
  },
  {
    id: 'sum',
    accessorKey: 'sum',
    header: 'Сума'
  },
  {
    id: 'actions',
    header: 'Дії',
  }
]


function calcSum(price, qty, discount) {
  return price * qty * (1 - discount / 100)
}

function addManualProduct() {
  if (!productQuery.value) return

  items.value.push({
    name: productQuery.value,
    price: productForm.value.price,
    qty: productForm.value.qty,
    discount: productForm.value.discount,
    sum: calcSum(productForm.value.price, productForm.value.qty, productForm.value.discount)
  })

  productQuery.value = ''
  productForm.value = { price: 0, qty: 1, discount: 0 }
}

function addProductByQuery() {
  // Тут може бути пошук по штрих-коду
  addManualProduct()
}

function removeItem(index) {
  items.value.splice(index, 1)
}

/* --- Підсумки --- */
const total = computed(() =>
  items.value.reduce((s, i) => s + i.sum, 0)
)

function format(v) {
  return new Intl.NumberFormat('uk-UA', { style: 'currency', currency: 'UAH' }).format(v)
}

/* --- Оплата --- */
const paymentMethod = ref('cash')
const paymentOptions = [
  { value: 'cash', label: 'Готівка' },
  { value: 'card', label: 'Картка' },
  { value: 'mixed', label: 'Змішана' }
]

function submitSale() {
  console.log('SALE', { items: items.value, total: total.value, paymentMethod: paymentMethod.value })
}

function holdReceipt() {
  console.log('HOLD', { items: items.value })
}

</script>
