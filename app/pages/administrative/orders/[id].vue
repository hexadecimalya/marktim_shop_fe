<template>
  <section class="w-11/12 mx-auto pb-10">
    <div class="flex flex-wrap items-center justify-between gap-3 my-4">
      <div class="flex items-center gap-3">
        <UButton to="/administrative/orders" icon="i-lucide:arrow-left" color="neutral" variant="ghost" size="sm"
          aria-label="Повернутися до замовлень" />
        <div>
          <h1 class="text-2xl font-extrabold">Замовлення #{{ route.params.id }}</h1>
          <p v-if="order?.created" class="text-sm text-gray-400 mt-1">
            Створено {{ order.created }}
          </p>
        </div>
      </div>

      <UBadge v-if="order" :color="order.is_preorder ? 'warning' : 'primary'" variant="subtle">
        {{ order.is_preorder ? 'Передзамовлення' : 'На складі' }}
      </UBadge>
    </div>

    <div v-if="loading" class="grid lg:grid-cols-[1fr_320px] gap-5">
      <div class="border border-gray-200 rounded-xl p-5 space-y-4">
        <USkeleton class="h-9 w-52" />
        <USkeleton v-for="n in 4" :key="n" class="h-14 w-full" />
      </div>
      <USkeleton class="h-80 w-full rounded-xl" />
    </div>

    <div v-else-if="error" class="border border-red-200 bg-red-50 rounded-xl p-5 text-sm text-red-600">
      Не вдалося завантажити замовлення.
      <UButton label="Спробувати знову" variant="link" color="error" @click="refresh" />
    </div>

    <form v-else-if="order" class="grid lg:grid-cols-[minmax(0,1fr)_320px] gap-5" @submit.prevent="saveOrder">
      <div class="border border-gray-200 rounded-xl bg-white overflow-visible">
        <div class="p-5 border-b border-gray-100">
          <h2 class="font-bold">Товари</h2>
          <p class="text-sm text-gray-400 mt-1">Змініть склад, кількість або знижку.</p>

          <div v-if="!isReadOnly" class="relative mt-4">
            <UInput v-model="productSearch" placeholder="Пошук товарів на складі..." icon="i-lucide:search"
              :loading="productsLoading" class="w-full" @focus="productSearchOpen = true" @blur="closeProductSearch" />

            <div v-if="productSearchOpen"
              class="absolute z-20 top-full mt-1 w-full max-h-72 overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-lg">
              <button v-for="product in filteredProducts" :key="productKey(product)" type="button"
                class="w-full flex items-center justify-between gap-3 px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-0"
                @mousedown.prevent="addProduct(product)">
                <span class="min-w-0">
                  <span class="block text-xs font-medium truncate">{{ product.name_ukr || product.name }}</span>
                  <span v-if="product.product_code || product.article" class="block text-xs text-gray-400 mt-0.5">
                    {{ product.product_code || product.article }}
                  </span>
                </span>
                <span class="shrink-0 text-sm font-semibold">₴ {{ formatMoney(productPrice(product)) }}</span>
              </button>

              <div v-if="productsError" class="px-4 py-4 text-sm text-red-500">
                Не вдалося завантажити товари.
              </div>
              <div v-else-if="!productsLoading && filteredProducts.length === 0"
                class="px-4 py-4 text-sm text-gray-400">
                Товарів не знайдено.
              </div>
            </div>
          </div>
        </div>

        <div v-if="form.products.length === 0" class="p-10 text-center text-sm text-gray-400">
          Додайте хоча б один товар.
        </div>

        <div v-else class="divide-y divide-gray-100">
          <div
            class="hidden md:grid grid-cols-[minmax(0,1fr)_110px_110px_110px_36px] gap-3 px-5 py-3 bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-500">
            <span>Назва</span>
            <span>Кількість</span>
            <span>Ціна</span>
            <span>Знижка</span>
            <span class="text-right">Сума</span>
            <span />
          </div>

          <div v-for="(item, index) in form.products" :key="item.localKey"
            class="grid md:grid-cols-[minmax(0,1fr)_110px_110px_110px_36px] gap-3 items-center px-5 py-4">
            <div class="min-w-0">
              <p class="font-medium truncate text-sm">{{ item.name_ukr || item.name }}</p>
              <p class="text-xs text-gray-400 mt-1">₴ {{ formatMoney(item.regular_price) }} / шт.</p>
            </div>

            <label class="md:hidden text-xs text-gray-400 -mb-2">Кількість</label>
            <div v-if="isReadOnly" class="font-medium text-sm">{{ item.amount }} шт.</div>
            <UInput v-if="!isReadOnly" v-model.number="item.amount" type="number" min="0.01" step="1" required aria-label="Кількість" />

            <label class="md:hidden text-xs text-gray-400 -mb-2">Знижка, %</label>
             <div v-if="isReadOnly" class="font-medium text-sm">{{ item.discount }}</div>
            <UInput v-if="!isReadOnly" v-model.number="item.discount" type="number" min="0" max="100" step="0.01"
              aria-label="Знижка у відсотках" />

            <div class="md:text-right font-semibold whitespace-nowrap">
              <span class="md:hidden text-xs text-gray-400 font-normal mr-2">Сума</span>
              ₴ {{ formatMoney(lineTotal(item)) }}
            </div>

            <UButton v-if="!isReadOnly" type="button" icon="i-lucide:trash-2" color="error" variant="ghost" size="xs"
              aria-label="Видалити товар" @click="removeProduct(index)" />
          </div>
        </div>
      </div>

      <aside class="space-y-5">
        <div class="border border-gray-200 rounded-xl bg-white p-5">
          <h2 class="font-bold mb-4">Клієнт</h2>
          <template v-if="order.customer">
            <p class="font-medium">{{ customerName }}</p>
            <p v-if="order.customer.contact_number" class="text-sm text-gray-400 mt-1">
              {{ order.customer.contact_number }}
            </p>
          </template>
          <p v-else class="text-sm text-gray-400">Клієнта не вказано</p>
        </div>

        <div class="border border-gray-200 rounded-xl bg-white p-5 space-y-4">
          <h2 class="font-bold">Оплата</h2>

          <label class="block">
            <span class="block text-sm font-medium mb-1.5">Спосіб оплати</span>
            <USelect v-model="form.payment_method" :items="paymentMethodOptions" class="w-full" />
          </label>

          <label class="block">
            <span class="block text-sm font-medium mb-1.5">Статус оплати</span>
            <USelect v-model="form.payment_status" :items="paymentStatusOptions" class="w-full" />
          </label>
        </div>

        <div class="border border-gray-200 rounded-xl bg-white p-5">
          <div class="flex items-center justify-between gap-3">
            <span class="text-sm text-gray-500">Позицій</span>
            <span class="font-medium">{{ form.products.length }}</span>
          </div>
          <div class="flex items-end justify-between gap-3 mt-3 pt-3 border-t border-gray-100">
            <span class="font-bold">Разом</span>
            <span class="text-xl font-extrabold">₴ {{ formatMoney(orderTotal) }}</span>
          </div>

          <p v-if="saveError" class="text-sm text-red-500 mt-4">{{ saveError }}</p>

          <div class="grid grid-cols-2 gap-2 mt-5">
            <UButton type="button" label="Скасувати" color="neutral" variant="subtle" block
              @click="router.push('/administrative/orders')" />
            <UButton type="submit" label="Зберегти" icon="i-lucide:save" :loading="saving" block />
          </div>
          <div class="border border-gray-200 rounded-xl bg-gray-50 p-5 mt-5"
            v-if="form.payment_status === 'paid' && !isReadOnly">
            <p class="text-sm text-gray-600 mb-3 text-center">
              Оплату підтверджено. Тепер ви можете списати товари зі складу.
            </p>
            <UButton type="button" label="Списати зі складу" icon="i-lucide:package-minus" color="primary" block
              @click="deductStock" />
          </div>
        </div>
      </aside>
    </form>
  </section>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const { execute } = useAuthFetchMulti()

const orderUrl = computed(() => `/orders2/${route.params.id}/`)
const { data, error, loading, refresh } = useAuthFetchData(orderUrl)

const isReadOnly = computed(() => {
  return customerName.value.trim().toLowerCase() === 'rozetka marketplace';
});

const saving = ref(false)
const saveError = ref('')
const productSearch = ref('')
const productSearchOpen = ref(false)
let localKey = 0

// The endpoint name intentionally follows the API supplied for this screen.
// `search` is harmless on backends that ignore it and enables server-side search
// when the in-stock result is paginated.
const productsUrl = computed(() => {
  const params = new URLSearchParams({ filter_param: 'in_stock' })
  if (productSearch.value.trim()) params.set('search', productSearch.value.trim())
  return `/products2/?${params.toString()}`
})
const {
  data: productsData,
  error: productsError,
  loading: productsLoading,
} = useAuthFetchData(productsUrl)

const form = reactive({
  products: [],
  payment_method: null,
  payment_status: null,
})

const order = computed(() => data.value?.data ?? data.value ?? null)
const availableProducts = computed(() => {
  const payload = productsData.value
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.data)) return payload.data
  if (Array.isArray(payload?.results)) return payload.results
  return []
})

const filteredProducts = computed(() => {
  const needle = productSearch.value.trim().toLocaleLowerCase('uk-UA')
  if (!needle) return availableProducts.value.slice(0, 30)
  return availableProducts.value
    .filter((product) => {
      const haystack = [productName(product), product.sku, product.article]
        .filter(Boolean)
        .join(' ')
        .toLocaleLowerCase('uk-UA')
      return haystack.includes(needle)
    })
    .slice(0, 30)
})

const customerName = computed(() => {
  const customer = order.value?.customer
  if (!customer) return '—'
  return [customer.name, customer.last_name].filter(Boolean).join(' ') || '—'
})

const paymentMethodOptions = computed(() => withCurrentOption([
  { label: 'Готівка', value: 'cash' },
  { label: 'Картка', value: 'card' },
], form.payment_method))

const paymentStatusOptions = computed(() => withCurrentOption([
  { label: 'Очікується', value: 'pending' },
  { label: 'Оплачено', value: 'paid' },
  { label: 'Не оплачено', value: 'failed' },
  { label: 'Повернення', value: 'refunded' },
], form.payment_status))

const orderTotal = computed(() => form.products.reduce((sum, item) => sum + lineTotal(item), 0))

watch(order, (value) => {
  if (!value) return
  form.payment_method = value.payment_method ?? value.payment ?? null
  form.payment_status = value.payment_status ?? null
  form.products = (value.products ?? []).map(normalizeOrderProduct)
}, { immediate: true })

function withCurrentOption(options, current) {
  if (!current || options.some((option) => option.value === current)) return options
  return [{ label: current, value: current }, ...options]
}

function productName(product) {
  return product?.product.name_ukr
    ?? product?.product.name
    ?? `Товар #${product?.product.product_id ?? product?.id ?? '—'}`
}

function productPrice(product) {
  return Number(
    product?.regular_price
    ?? product?.price
    ?? product?.selling_price
    ?? product?.stock?.price
    ?? 0,
  )
}

function productKey(product) {
  return `${product?.stock_id ?? 'stock'}:${product?.product_id ?? product?.id}`
}

function normalizeOrderProduct(item) {
  return {
    localKey: ++localKey,
    id: item.id ?? null,
    product_id: item.product_id ?? item.product?.id ?? item.stock?.product_id ?? null,
    stock_id: item.stock_id ?? item.stock?.id ?? null,
    product_preorder_id: item.product_preorder_id ?? null,
    name: productName(item),
    regular_price: productPrice(item),
    amount: Number(item.amount ?? item.quantity ?? 1),
    discount: Number(item.discount ?? 0),
  }
}

function addProduct(product) {
  const candidate = normalizeOrderProduct({
    ...product,
    product_id: product.product_id ?? product.id,
    stock_id: product.stock_id ?? product.stock?.id ?? null,
  })

  const existing = form.products.find((item) => (
    candidate.stock_id != null && item.stock_id === candidate.stock_id
  ) || (
      candidate.product_id != null && item.product_id === candidate.product_id
    ))

  if (existing) {
    existing.amount = Number(existing.amount) + 1
  } else {
    form.products.push(candidate)
  }

  productSearch.value = ''
  productSearchOpen.value = false
}

function removeProduct(index) {
  form.products.splice(index, 1)
}

function closeProductSearch() {
  window.setTimeout(() => { productSearchOpen.value = false }, 120)
}

function lineTotal(item) {
  const amount = Math.max(0, Number(item.amount) || 0)
  const discount = Math.min(100, Math.max(0, Number(item.discount) || 0))
  return amount * (Number(item.regular_price) || 0) * (1 - discount / 100)
}

function formatMoney(value) {
  return Number(value || 0).toLocaleString('uk-UA', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })
}


async function saveOrder() {
  saveError.value = ''
  if (form.products.length === 0) {
    saveError.value = 'Додайте хоча б один товар.'
    return
  }
  if (form.products.some((item) => !Number.isFinite(Number(item.amount)) || Number(item.amount) <= 0)) {
    saveError.value = 'Кількість кожного товару має бути більшою за нуль.'
    return
  }

  saving.value = true
  try {
    await execute(`/orders2/${route.params.id}/`, {
      method: 'PATCH',
      body: {
        payment: form.payment_method,
        payment_status: form.payment_status,
        products: form.products.map((item) => ({
          id: item.id,
          product_id: item.product_id,
          stock_id: item.stock_id,
          product_preorder_id: item.product_preorder_id,
          regular_price: Number(item.regular_price) || 0,
          amount: Number(item.amount),
          discount: Math.min(100, Math.max(0, Number(item.discount) || 0)),
        })),
      },
    })
    toast.add({ title: 'Замовлення збережено', color: 'success', icon: 'i-lucide:check' })
    await refresh()
  } catch (requestError) {
    console.error(requestError)
    saveError.value = 'Не вдалося зберегти зміни. Перевірте дані та спробуйте ще раз.'
  } finally {
    saving.value = false
  }
}

definePageMeta({ layout: 'admin' })
useHead(() => ({ title: `Замовлення #${route.params.id}` }))
</script>
