<template>
  <section class="w-11/12 mx-auto">
    <h1 class="text-2xl font-extrabold my-4">Всі продукти</h1>
    <SearchBarAdmin @update:search="onSearch" />

    <div class="flex flex-wrap gap-3 py-4 justify-between items-center">
      <div class="flex gap-4 items-center flex-wrap">
        <USwitch label="В наявності" v-model="toggleInStock" :loading="loading" />
        <USwitch :disabled="!toggleInStock || loading" label="Без картинок" v-model="toggleNoImages"
          :loading="loading" />
      </div>
      <div class="flex items-center gap-4">
        <span class="text-sm text-gray-400 font-medium">{{ totalCount }} записів</span>
        <UButton @click="handleExport" label="Експорт вибірки" color="neutral" variant="subtle"
          :disabled="!toggleInStock || loading || toggleNoImages || isExporting" />
      </div>
    </div>
    <NoItemsFoundAdmin v-if="!loading && totalCount === 0" />
    <!-- Desktop table -->
    <div v-else-if="!loading && !error" class="hidden lg:block">
      <div
        class="grid grid-cols-25 items-center bg-gray-50 border border-gray-200 rounded-t-xl px-2 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
        <div>ID</div>
        <div class="col-span-13">Назва</div>
        <div class="col-span-4">Код</div>
        <div class="col-span-5">Категорії</div>
        <div class="flex justify-center">
          <UIcon name="i-lucide:image" />
        </div>
        <div class="text-end">Дії</div>
      </div>
      <div class="divide-y divide-gray-100 border-x border-b border-gray-200 rounded-b-lg">
        <div v-for="product in productList" :key="product.id"
          class="grid grid-cols-25 items-center px-1 py-1 text-xs gap-2">
          <div class="text-center hover:underline text-xs text-gray-400 font-mono">
            <NuxtLink :to="`/administrative/products/${product.id}`">{{ product.id }}</NuxtLink>
          </div>
          <!-- <div @click="copyName(product.name, product.id)"
          
            class="col-span-13 font-medium cursor-pointer group flex items-center gap-1.5 truncate hover:overflow-visible"
            :class="copiedId === product.id ? 'text-green-500' : ''">
            {{ product.name_ukr ?? product.name }}
            <UIcon :name="copiedId === product.id ? 'i-lucide:check' : 'i-lucide:clipboard'"
              class="shrink-0 text-gray-300 group-hover:text-gray-400 transition-colors size-3.5"
              :class="copiedId === product.id ? 'text-green-500' : ''" />
          </div> -->
          <div class="col-span-13 font-medium group flex items-center gap-1.5 truncate hover:overflow-visible">
            {{ product.name_ukr ?? product.name }}
          </div>
          <div class="col-span-4 text-xs">{{ product.product_code || '-' }}</div>
          <div class="col-span-5 text-gray-500 space-x-0.5 truncate hover:overflow-visible">
            <UBadge v-for="category in product.categories" :key="category.id" color="neutral" variant="subtle">
              {{ category.name }}
            </UBadge>
          </div>
          <div class="text-gray-500 text-center mr-2">{{ product.files.length || '-' }}</div>
          <div class="flex justify-end mr-1">
            <UModal :key="product.id" :open="openedProductId === product.id"
              @update:open="(val) => openedProductId = val ? product.id : null" title="Підтвердити видалення"
              :description="`Видалити продукт ${product.name_ukr ?? product.name}?`"
              :ui="{ description: 'font-bold text-black my-4 text-md' }">
              <UButton variant="subtle" color="error" icon="i-lucide:trash" class="p-1.5!" size="xs"
                @click="openedProductId = product.id" />
              <template #footer="{ close }">
                <div class="flex justify-end gap-2">
                  <UButton label="Скасувати" color="neutral" variant="outline" @click="close" />
                  <UButton label="Видалити" color="error" @click="handleDeleteProduct(product.id)" />
                </div>
              </template>
            </UModal>
          </div>
        </div>
      </div>
    </div>


    <!-- Mobile cards -->
    <div v-if="!loading && !error" class="flex flex-col gap-3 lg:hidden">
      <div v-for="product in productList" :key="product.id"
        class="border border-gray-200 rounded-xl p-4 flex flex-col gap-2">
        <div class="flex items-start justify-between gap-2">
          <NuxtLink :to="`/administrative/products/${product.id}`"
            class="text-sm font-semibold leading-snug hover:underline">
            {{ product.name_ukr ?? product.name }}
          </NuxtLink>
          <UModal :key="product.id" :open="openedProductId === product.id"
            @update:open="(val) => openedProductId = val ? product.id : null" title="Підтвердити видалення"
            :description="`Видалити продукт ${product.name_ukr ?? product.name}?`"
            :ui="{ description: 'font-bold text-black my-4 text-md' }">
            <UButton variant="subtle" color="error" icon="i-lucide:trash" size="xs"
              @click="openedProductId = product.id" />
            <template #footer="{ close }">
              <div class="flex justify-end gap-2">
                <UButton label="Скасувати" color="neutral" variant="outline" @click="close" />
                <UButton label="Видалити" color="error" @click="handleDeleteProduct(product.id)" />
              </div>
            </template>
          </UModal>
        </div>

        <div class="flex gap-3 text-xs text-gray-400 font-mono">
          <span>ID: {{ product.id }}</span>
          <span>Код: {{ product.product_code }}</span>
          <span v-if="product.files.length" class="flex items-center gap-1">
            <UIcon name="i-lucide:image" class="size-3" /> {{ product.files.length }}
          </span>
        </div>

        <div v-if="product.categories.length" class="flex flex-wrap gap-1">
          <UBadge v-for="category in product.categories" :key="category.id" color="neutral" variant="subtle">
            {{ category.name }}
          </UBadge>
        </div>
      </div>
    </div>


    <div v-else-if="loading">
      <AdminLoader />
    </div>
  </section>

  <div class="my-6 flex justify-center" v-if="!loading">
    <UPagination v-model:page="page" :show-controls="false" :total="totalCount" active-color="neutral"
      active-variant="subtle" :items-per-page="limit" show-edges @update:page="scrollToTop" />
  </div>
</template>
<script setup>

const toast = useToast()
const { execute } = useAuthFetchMulti()
const scrollToTop = () =>
  window.scrollTo({ top: 0, behavior: 'smooth' })

const openedProductId = ref(null)
const searchTerm = ref('')
const page = ref(1)
const onSearch = (value) => {
  searchTerm.value = value
  page.value = 1 // reset pagination on new search
}

// filter in stock items and no images items
const toggleInStock = ref(false)
const toggleNoImages = ref(false)
const exportImages = ref(false)


const limit = 50

const totalCount = computed(() => data.value?.count ?? 0)

const url = computed(() => {
  const offset = (page.value - 1) * limit
  const params = new URLSearchParams({ order_by: '-id', offset: String(offset) })

  if (searchTerm.value.length >= 3) params.set('filter_param', searchTerm.value)
  if (toggleInStock.value) params.set('in_stock', 'true')
  if (toggleNoImages.value) params.set('wo_pictures', 'true')
  return `/products2/?${params.toString()}`
})

const isExporting = ref(false)

const handleExport = async () => {
  const userStore = useUserStore()
  if (!userStore.user.access_token) {
    userStore.initStore();
  }
  const offset = (page.value - 1) * limit
  const params = new URLSearchParams({ order_by: '-id', offset: String(offset) })

  if (searchTerm.value.length >= 3) params.set('filter_param', searchTerm.value)
  if (toggleInStock.value) params.set('in_stock', 'true')
  params.set('export', 'true')

  const baseURL = useRuntimeConfig().public.apiBase

  isExporting.value = true

  try {
    const blob = await $fetch(`${baseURL}/products/?${params.toString()}`, {
      method: 'GET',
      responseType: 'blob',
      headers: {
        'Authorization': `Bearer ${userStore.user.access_token}`
      }
    })

    const url = window.URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    const date = new Date().toISOString().slice(0, 10)

    link.setAttribute('download', `export-images-${date}.zip`)

    document.body.appendChild(link)
    link.click()

    link.remove()
    window.URL.revokeObjectURL(url)

    toast.add({ title: 'Успіх', description: 'Файл завантажено', color: 'success' })
  } catch (e) {
    console.error('Download error:', e)

    if (e.status === 401) {
      toast.add({ title: 'Помилка', description: 'Термін дії сесії вичерпано', color: 'error' })
    } else {
      toast.add({ title: 'Помилка', description: 'Не вдалося завантажити файл', color: 'error' })
    }
  } finally {
    isExporting.value = false
  }
}

watch([searchTerm, toggleInStock, toggleNoImages, page], () => {
  exportImages.value = false
})

const { data, error, loading, refresh } = useAuthFetchData(
  url
)

const productList = computed(() => data.value?.data ?? [])

const productIsDeleting = ref(false)

const handleDeleteProduct = async (id) => {
  productIsDeleting.value = true
  try {
    const res = await execute(`/products2/${id}`, {
      method: 'DELETE'
    })

    await refresh()
    toast.add({
      title: 'Продукт успішно видалено',
      icon: 'i-lucide:check',
      color: 'success'
    })
    openedProductId.value = null
  }
  catch (e) {
    console.error('Failed to delete product', e?.response?._data || e)
    toast.add({
      title: 'Помилка видалення',
      icon: 'i-lucide:ban',
      color: 'error'
    })
  }
  finally {
    productIsDeleting.value = false
  }
}
// const copiedId = ref(null)

// const copyName = async (name, id) => {
//     try {
//         await navigator.clipboard.writeText(name)
//         copiedId.value = id
//         setTimeout(() => (copiedId.value = null), 2000)
//     } catch (err) {
//         console.error('Copy failed', err)
//     }
// }

definePageMeta({
  layout: 'admin'
})
useHead({ title: 'Всі товари' })
</script>