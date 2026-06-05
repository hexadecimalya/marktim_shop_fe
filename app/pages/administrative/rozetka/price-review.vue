<template>
  <section class="w-full max-w-6xl mx-auto px-4">
    <div class="flex items-center justify-between my-4">
      <div>
        <h1 class="text-2xl font-extrabold">Змінити ціни на Rozetka</h1>
        <p v-if="itemsList.length && !loading" class="text-sm text-gray-400 mt-1">
          {{ itemsList.length }} товарів з різницею в ціні
        </p>
      </div>
      <UButton variant="subtle" color="neutral" icon="i-lucide:refresh-cw" :loading="loading" :disabled="loading"
        @click="loadPrices">
        {{ hasFetched ? 'Оновити' : 'Завантажити ціни' }}
      </UButton>
    </div>

    <!-- idle state -->
    <div v-if="!hasFetched && !loading" class="flex flex-col items-center justify-center py-20 gap-3 text-center">
      <UIcon name="i-lucide:tag" class="w-10 h-10 text-gray-300" />
      <p class="text-sm font-medium text-gray-700">Список не завантажено</p>
      <p class="text-xs text-gray-400 max-w-xs">
        Натисніть "Завантажити ціни", щоб отримати товари, ціни яких потребують оновлення
      </p>
    </div>

    <!-- loading -->
    <AdminLoader v-if="loading" />

    <!-- empty after fetch -->
    <div v-else-if="hasFetched && !itemsList.length"
      class="flex flex-col items-center justify-center py-12 gap-3 text-center">
      <UIcon name="i-lucide:circle-check" class="w-10 h-10 text-green-400" />
      <p class="text-sm font-medium text-gray-700">Всі ціни актуальні</p>
      <p class="text-xs text-gray-400">Відповідно до рекомендованих розрахунків</p>
    </div>

    <!-- table -->
    <div v-else-if="hasFetched && !loading && itemsList.length">
      <div
        class="grid grid-cols-8 items-center bg-gray-50 border border-gray-200 rounded-t-xl px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
        <div class="flex items-center gap-2">
          <UCheckbox :model-value="allSelected" :indeterminate="someSelected && !allSelected"
            @update:model-value="toggleAll" />
          RZ ID
        </div>
        <div class="col-span-4">Назва</div>
        <div class="text-end">Поточна ціна</div>
        <div class="text-end">Розрахунок</div>
        <div class="text-end">Різниця</div>
      </div>

      <div class="border-x border-b border-gray-200 rounded-b-lg">
        <div v-for="item in sortedItemsList" :key="item.rozetka_id"
          class="grid grid-cols-8 px-4 py-2 text-sm items-center cursor-pointer hover:bg-gray-50 transition-colors"
          :class="{ 'bg-blue-50': isSelected(item.rozetka_id) }" @click="toggleItem(item)">
          <div class="flex items-center gap-2" @click.stop>
            <UCheckbox :model-value="isSelected(item.rozetka_id)"
              @update:model-value="(val) => toggleItemByVal(val, item)" />
            <span class="text-gray-400 text-xs">{{ item.rozetka_id }}</span>
          </div>
          <div class="col-span-4 font-medium truncate" :title="item.name">{{ item.name }}</div>
          <div class="text-end text-gray-500">{{ formatPrice(item.rozetka_sell_price) }}</div>
          <div class="text-end font-medium text-orange-400">{{ formatPrice(item.suggested_price) }}</div>
          <div class="text-end">
            <span class="text-xs font-medium">
              {{ priceDiffPercent(item) }}%
            </span>
          </div>
        </div>
        <USeparator />
      </div>

      <div class="flex items-center justify-between my-4 ">
        <p class="text-sm text-gray-400">
          Обрано {{ checkedItems.length }} з {{ itemsList.length }}
        </p>
        <UButton color="primary" :disabled="!checkedItems.length || isApplying" :loading="isApplying"
          icon="i-lucide:check" @click="applyPrices">
          Застосувати{{ checkedItems.length ? ` (${checkedItems.length})` : '' }}
        </UButton>
      </div>
    </div>
  </section>
</template>

<script setup>
const { execute } = useAuthFetchMulti()
const toast = useToast()

const hasFetched = ref(false)
const loading = ref(false)
const itemsList = ref([])

const sortedItemsList = computed(() =>
  [...itemsList.value].sort((a, b) => priceDiffPercent(b) - priceDiffPercent(a)))
const checkedItems = ref([])
const isApplying = ref(false)
const excludedIds = new Set([595306078, 595306084, 595306081, 376506069, 376506066, 376506060 ])

const checkedIdsSet = computed(() => new Set(checkedItems.value.map(i => i.rozetka_id)))
const isSelected = (id) => checkedIdsSet.value.has(id)
const allSelected = computed(() => itemsList.value.length > 0 && checkedItems.value.length === itemsList.value.length)
const someSelected = computed(() => checkedItems.value.length > 0)

const formatPrice = (price) => `${Number(price).toLocaleString('uk-UA')} ₴`
const priceDiffPercent = (item) =>
  ((((item.suggested_price - item.rozetka_sell_price) / item.rozetka_sell_price) * 100).toFixed(1)) * -1


const toggleAll = (val) => {
  checkedItems.value = val ? [...itemsList.value] : []
}

const toggleItem = (product) => {
  if (isSelected(product.rozetka_id)) {
    checkedItems.value = checkedItems.value.filter(i => i.rozetka_id !== product.rozetka_id)
  } else {
    checkedItems.value.push({ ...product })
  }
}

const toggleItemByVal = (val, product) => {
  if (val) {
    if (!isSelected(product.rozetka_id)) checkedItems.value.push({ ...product })
  } else {
    checkedItems.value = checkedItems.value.filter(i => i.rozetka_id !== product.rozetka_id)
  }
}

const loadPrices = async () => {
  loading.value = true
  checkedItems.value = []
  try {
    const data = await execute(
      '/products/?product=true&rozetka=true&price_diff=true',
      { method: 'GET' }
    )
    itemsList.value = (data?.data ?? []).filter(i => !excludedIds.has(i.rozetka_id))
    hasFetched.value = true
  } catch (e) {
    console.error(e)
    toast.add({ title: 'Помилка завантаження', icon: 'i-lucide:ban', color: 'error' })
  } finally {
    loading.value = false
  }
}

const applyPrices = async () => {
  if (!checkedItems.value.length) return
  isApplying.value = true
  try {
    const payload = {
      rozetka_ids: checkedItems.value.map(i => i.rozetka_id),
    }
    await execute('/products/update_rozetka_prices/', { method: 'POST', body: payload })
    toast.add({
      title: 'Ціни збережено',
      description: 'Будуть актуальними при найближчій синхронізації',
      icon: 'i-lucide:check',
      color: 'success',
    })
    checkedItems.value = []
    //await loadPrices()
  } catch (e) {
    console.error(e)
    toast.add({
      title: 'Помилка в збереженні цін',
      icon: 'i-lucide:ban',
      color: 'error',
    })
  } finally {
    isApplying.value = false
  }
}

definePageMeta({ layout: 'admin' })
useHead({ title: 'Змінити ціни на Rozetka' })
</script>