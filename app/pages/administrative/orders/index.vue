<template>
  <section class="w-11/12 mx-auto">
    <h1 class="text-2xl font-extrabold my-4">Всі замовлення</h1>

    <div class="flex flex-wrap gap-3 py-4 justify-between items-center">
      <div class="flex gap-3 items-center flex-wrap">

        <!-- Search -->
        <UInput v-model="search" placeholder="ID або клієнт..." icon="i-lucide:search" :loading="loading"
          class="w-52" />

        <!-- Date range -->
        <UInput v-model="filters.dateFrom" type="date" class="w-36" :disabled="loading" />
        <span class="text-sm text-gray-400">—</span>
        <UInput v-model="filters.dateTo" type="date" class="w-36" :disabled="loading" />

        <!-- Source -->
        <USelect v-model="filters.source" :items="sourceOptions" placeholder="Джерело" class="w-32"
          :disabled="loading" />

        <!-- Status -->
        <USelect v-model="filters.status" :items="statusOptions" placeholder="Статус" class="w-32"
          :disabled="loading" />

        <!-- Type -->
        <USelect v-model="filters.type" :items="typeOptions" placeholder="Тип" class="w-28" :disabled="loading" />

        <!-- Payment status -->
        <USelect v-model="filters.paymentStatus" :items="paymentStatusOptions" placeholder="Оплата" class="w-32"
          :disabled="loading" />

        <UButton v-if="hasActiveFilters" label="Скинути" color="neutral" variant="ghost" icon="i-lucide:x" size="sm"
          @click="resetFilters" />
      </div>

      <div class="flex items-center gap-4">
        <UButton label="RZ" icon="i-lucide:smile" @click="getRozetkaOrders()"/>
        <USwitch v-model="showPos" label="POS" :loading="loading" />
        <span class="text-sm text-gray-400 font-medium">{{ totalCount }} записів</span>
      </div>
    </div>

    <NoItemsFoundAdmin v-if="!loading && totalCount === 0" />

    <!-- Desktop table -->
    <div v-else-if="!loading && !error" class="hidden lg:block">
      <div
        class="grid grid-cols-[48px_80px_1fr_96px_80px_72px_96px_88px_72px] items-center bg-gray-50 border border-gray-200 rounded-t-xl px-3 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 gap-2">
        <div>ID</div>
        <div>Дата</div>
        <div>Клієнт</div>
        <div>Сума</div>
        <div>Джерело</div>
        <div>Тип</div>
        <div>Статус</div>
        <div>Оплата</div>
        <div class="text-end">Дії</div>
      </div>

      <div class="divide-y divide-gray-100 border-x border-b border-gray-200 rounded-b-lg">
        <div v-for="order in orders" :key="order.id"
          class="grid grid-cols-[48px_80px_1fr_96px_80px_72px_96px_88px_72px] items-center px-3 py-2 text-xs gap-2"
          :class="{ 'opacity-60': order.source === 'pos' }">
          <!-- ID -->
          <div class="font-mono text-gray-400">
            <NuxtLink :to="`/administrative/orders/${order.id}`" class="hover:underline text-blue-500">
              #{{ order.id }}
            </NuxtLink>
          </div>

          <!-- Date -->
          <div class="text-gray-400">{{ order.created }}</div>

          <!-- Customer -->
          <div class="truncate">
            <template v-if="order.source === 'pos'">
              <span class="text-gray-400 italic">— POS —</span>
            </template>
            <template v-else-if="order.customer">
              {{ order.customer.name }} {{ order.customer.last_name }}
            </template>
            <template v-else>
              <span class="text-gray-400">—</span>
            </template>
          </div>

          <!-- Total -->
          <div class="font-medium">₴ {{ formatMoney(order.total) }}</div>

          <!-- Source -->
          <div>
            <UBadge :color="sourceBadgeColor(order.source)" variant="subtle" size="sm">
              {{ order.source }}
            </UBadge>
          </div>

          <!-- Type -->
          <div>
            <UBadge :color="order.is_preorder ? 'warning' : 'primary'" variant="subtle" size="sm">
              {{ order.is_preorder ? 'Замовити' : 'На складі' }}
            </UBadge>
          </div>

          <!-- Status -->
          <div>
            <UBadge :color="statusBadgeColor(order.status)" variant="subtle" size="sm">
              {{ order.status }}
            </UBadge>
          </div>

          <!-- Payment status -->
          <div>
            <UBadge :color="paymentBadgeColor(order.payment_status)" variant="subtle" size="sm">
              {{ order.payment }}
            </UBadge>
          </div>

          <!-- Actions -->
          <div class="flex gap-1 justify-end">
            <UButton :to="`/administrative/orders/${order.id}`" icon="i-lucide:pencil" color="neutral"
              variant="ghost" size="xs" />
            <UButton icon="i-lucide:trash-2" color="error" variant="ghost" size="xs" @click="confirmDelete(order)" />
          </div>
        </div>
      </div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="text-sm text-red-500 py-4">
      Помилка завантаження.
      <UButton variant="link" label="Спробувати знову" @click="refresh" />
    </div>

    <!-- Loading skeleton -->
    <div v-else class="border border-gray-200 rounded-xl overflow-hidden">
      <div v-for="n in 8" :key="n" class="px-3 py-3 border-b border-gray-100 last:border-0">
        <USkeleton class="h-4 w-full" />
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="totalCount > 0" class="my-6 flex justify-center">
      <UPagination v-model:page="page" :show-controls="false" :total="totalCount" active-color="neutral"
        active-variant="subtle" :items-per-page="pageSize" show-edges />
    </div>

    <!-- Delete confirm modal -->
    <UModal v-model:open="deleteModal.open">
      <template #content>
        <div class="p-6 flex flex-col gap-4">
          <p class="text-sm">
            Видалити замовлення <span class="font-mono font-semibold">#{{ deleteModal.order?.id }}</span>?
            Цю дію неможливо скасувати.
          </p>
          <div class="flex justify-end gap-2">
            <UButton label="Скасувати" color="neutral" variant="subtle" @click="deleteModal.open = false" />
            <UButton label="Видалити" color="error" :loading="deleteModal.loading" @click="handleDelete" />
          </div>
        </div>
      </template>
    </UModal>
  </section>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
const { execute } = useAuthFetchMulti()

const PAGE_SIZE = 20

const search = ref('')
const page = ref(1)
const showPos = ref(false)
const pageSize = PAGE_SIZE

const filters = ref({
  dateFrom: '',
  dateTo: '',
  source: null,
  status: null,
  type: null,
  paymentStatus: null,
})

const deleteModal = ref({ open: false, order: null, loading: false })

const sourceOptions = [
  { label: 'Всі джерела', value: null },
  { label: 'Web', value: 'web' },
  { label: 'POS', value: 'pos' },
  { label: 'Адмін', value: 'manual' },
  { label: 'Rozetka', value: 'rozetka' },
]

const statusOptions = [
  { label: 'Всі статуси', value: null },
  { label: 'Новий', value: 'new' },
  { label: 'Підтверджено', value: 'confirmed' },
  { label: 'Відправлено', value: 'shipped' },
  { label: 'Завершено', value: 'completed' },
  { label: 'Відмінено', value: 'cancelled' },
]

const typeOptions = [
  { label: 'Всі типи', value: null },
  { label: 'Склад', value: 'stock' },
  { label: 'Передзамовлення', value: 'preorder' },
]

const paymentStatusOptions = [
  { label: 'Вся оплата', value: null },
  { label: 'Очікується', value: 'pending' },
  { label: 'Оплачено', value: 'paid' },
  { label: 'Не оплачено', value: 'failed' },
  { label: 'Повернення', value: 'refunded' },
]

const url = computed(() => {
  const params = new URLSearchParams()
  params.set('page', page.value)
  params.set('page_size', PAGE_SIZE)

  if (search.value.trim()) {
    const isId = /^\d+$/.test(search.value.trim())
    params.set(isId ? 'id' : 'customer', search.value.trim())
  }
  if (!showPos.value) params.set('exclude_source', 'pos')
  if (filters.value.dateFrom) params.set('date_from', filters.value.dateFrom)
  if (filters.value.dateTo) params.set('date_to', filters.value.dateTo)
  if (filters.value.source) params.set('source', filters.value.source)
  if (filters.value.status) params.set('status', filters.value.status)
  if (filters.value.paymentStatus) params.set('payment_status', filters.value.paymentStatus)
  if (filters.value.type) params.set('type', filters.value.type)

  return `/orders2/?${params.toString()}`
})

const { data, error, loading, refresh } = useAuthFetchData(url)

const orders = computed(() => data.value?.data ?? [])
const totalCount = computed(() => data.value?.count ?? 0)

const hasActiveFilters = computed(() =>
  Object.values(filters.value).some(Boolean) || search.value.trim()
)

// Reset page on filter/search change
watch([search, filters, showPos], () => { page.value = 1 }, { deep: true })

const resetFilters = () => {
  search.value = ''
  filters.value = { dateFrom: '', dateTo: '', source: null, status: null, type: null, paymentStatus: null }
}

const formatDate = (iso) => {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('uk-UA', { day: '2-digit', month: '2-digit', year: '2-digit' })
}

const formatMoney = (val) => {
  if (val == null) return '—'
  return Number(val).toLocaleString('uk-UA')
}

const sourceBadgeColor = (source) => {
  return { web: 'success', pos: 'neutral', manual: 'warning' }[source] ?? 'neutral'
}

const statusBadgeColor = (status) => {
  return {
    new: 'neutral', confirmed: 'info', shipped: 'info',
    completed: 'success', cancelled: 'error',
  }[status] ?? 'neutral'
}

const paymentBadgeColor = (status) => {
  return { pending: 'warning', paid: 'success', failed: 'error', refunded: 'info' }[status] ?? 'neutral'
}

const confirmDelete = (order)  => {
  deleteModal.value = { open: true, order, loading: false }
}

 const handleDelete = async() =>  {
  deleteModal.value.loading = true
  try {
    await execute(`/orders2/${deleteModal.value.order.id}/`, { method: 'DELETE' })
    deleteModal.value.open = false
    refresh()
  } catch (e) {
    console.error(e)
  } finally {
    deleteModal.value.loading = false
  }
}

const isGettingRZOrders = ref(false)

const getRozetkaOrders = async () => {
  isGettingRZOrders.value = true
  try {
     await execute(`/orders2/rozetka/sync/`, { method: 'POST' })
    refresh()
  } catch (e) {
    console.error(e)
  } finally {
    isGettingRZOrders.value = false
  }
}

definePageMeta({
  layout: 'admin'
})
useHead({ title: 'Всі продажі' })
</script>