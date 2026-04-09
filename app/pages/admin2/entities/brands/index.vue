<template>
  <section class="w-4/6 mx-auto py-6" v-if="hydrated">

    <!-- Header -->
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-2xl font-extrabold tracking-tight text-gray-900">Бренди</h1>
      <span class="text-sm text-gray-400 font-medium">
        {{ filteredBrands.length }}
        <template v-if="brandSearch"> з {{ brands_list.length }}</template>
        записів
      </span>
    </div>

    <!-- Search bar -->
    <div class="mb-4">
      <UInput
        v-model="brandSearch"
        icon="i-lucide:search"
        placeholder="Пошук бренду..."
        size="sm"
        :trailing-icon="brandSearch ? 'i-lucide:x' : undefined"
        @click:trailing="brandSearch = ''"
        class="w-full"
      />
    </div>

    <!-- Table Header -->
    <div class="grid grid-cols-12 items-center bg-gray-50 border border-gray-200 rounded-t-xl px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
      <div class="col-span-1">#</div>
      <div class="col-span-7">Назва</div>
      <div class="col-span-2 text-center">Редагувати</div>
      <div class="col-span-2 text-center">Видалити</div>
    </div>

    <!-- Rows -->
    <div class="border-x border-b border-gray-200 rounded-b-xl overflow-hidden divide-y divide-gray-100">
      <div
        v-for="brand in filteredBrands"
        :key="brand.id"
        class="grid grid-cols-12 items-center px-4 py-2.5 transition-colors duration-150"
        :class="editingId === brand.id ? 'bg-blue-50/60' : 'hover:bg-gray-50'"
      >
        <!-- ID -->
        <div class="col-span-1 text-xs text-gray-400 font-mono">{{ brand.id }}</div>

        <!-- Name field -->
        <div class="col-span-7 pr-4">
          <UInput
            v-if="editingId === brand.id"
            v-model="editingName"
            size="sm"
            autofocus
            @keyup.enter="saveEdit(brand)"
            @keyup.escape="cancelEdit"
            placeholder="Назва бренду"
          />
          <span v-else class="text-sm text-gray-800 font-medium">{{ brand.name }}</span>
        </div>

        <!-- Edit / Save actions -->
        <div class="col-span-2 flex justify-center gap-1">
          <template v-if="editingId === brand.id">
            <UButton
              icon="i-lucide:check"
              size="xs"
              variant="soft"
              color="primary"
              :loading="savingId === brand.id"
              @click="saveEdit(brand)"
              title="Зберегти"
            />
            <UButton
              icon="i-lucide:x"
              size="xs"
              variant="ghost"
              color="neutral"
              @click="cancelEdit"
              title="Скасувати"
            />
          </template>
          <template v-else>
            <UButton
              icon="i-lucide:pencil"
              size="xs"
              variant="subtle"
              color="neutral"
              @click="startEdit(brand)"
              :disabled="editingId !== null"
              title="Редагувати"
            />
          </template>
        </div>

        <!-- Delete -->
        <div class="col-span-2 flex justify-center">
          <UButton
            icon="i-lucide:trash-2"
            size="xs"
            variant="subtle"
            color="error"
            :loading="deletingId === brand.id"
            :disabled="editingId !== null"
            @click="confirmDelete(brand)"
            title="Видалити"
          />
        </div>
      </div>

      <!-- Empty state -->
      <div v-if="filteredBrands.length === 0" class="py-12 text-center text-sm text-gray-400">
        <template v-if="brandSearch">Нічого не знайдено за запитом «{{ brandSearch }}»</template>
        <template v-else>Бренди відсутні</template>
      </div>
    </div>

    <!-- Delete confirmation modal -->
    <UModal v-model:open="showDeleteModal">
      <template #content>
        <div class="p-6 space-y-4">
          <h3 class="text-base font-semibold text-gray-900">Видалити бренд?</h3>
          <p class="text-sm text-gray-500">
            Ви впевнені, що хочете видалити бренд
            <span class="font-medium text-gray-800">«{{ pendingDelete?.name }}»</span>?
            Цю дію не можна скасувати.
          </p>
          <div class="flex justify-end gap-2 pt-2">
            <UButton variant="ghost" color="neutral" @click="showDeleteModal = false">Скасувати</UButton>
            <UButton color="error" :loading="deletingId !== null" @click="executeDelete">Видалити</UButton>
          </div>
        </div>
      </template>
    </UModal>

  </section>
</template>

<script setup>
definePageMeta({ layout: 'admin' })

const hydrated = ref(false)
const { execute } = useAuthFetchMulti()

onMounted(() => {
  hydrated.value = true
})

// Data
const { data: brandsData } = useAuthFetchData('/brands/')
const brands_list = computed(() => brandsData?.value?.data ?? [])

// Search
const brandSearch = ref('')
const filteredBrands = computed(() =>
  brands_list.value.filter(b =>
    b.name.toLowerCase().includes(brandSearch.value.toLowerCase().trim())
  )
)

// Edit state
const editingId   = ref(null)
const editingName = ref('')
const savingId    = ref(null)

const startEdit = (brand) => {
  editingId.value   = brand.id
  editingName.value = brand.name
}

const cancelEdit = () => {
  editingId.value   = null
  editingName.value = ''
}

const saveEdit = async (brand) => {
  const trimmed = editingName.value.trim()
  if (!trimmed || trimmed === brand.name) {
    cancelEdit()
    return
  }

  savingId.value = brand.id
  try {
    await execute(`/brands/${brand.id}/`, {
      method: 'PUT',
      body: { name: trimmed.toLowerCase() }
    })
    brand.name = trimmed.toLowerCase()
    cancelEdit()
  } catch (e) {
    console.error('Failed to update brand', e)
  } finally {
    savingId.value = null
  }
}

// Delete state
const deletingId      = ref(null)
const showDeleteModal = ref(false)
const pendingDelete   = ref(null)

const confirmDelete = (brand) => {
  pendingDelete.value   = brand
  showDeleteModal.value = true
}

const executeDelete = async () => {
  if (!pendingDelete.value) return
  deletingId.value = pendingDelete.value.id
  try {
    await execute(`/brands/${pendingDelete.value.id}/`, { method: 'DELETE' })
    // Remove from list optimistically
    const idx = brands_list.value.findIndex(b => b.id === pendingDelete.value.id)
    if (idx !== -1) brands_list.value.splice(idx, 1)
    showDeleteModal.value = false
    pendingDelete.value   = null
  } catch (e) {
    console.error('Failed to delete brand', e)
  } finally {
    deletingId.value = null
  }
}
</script>