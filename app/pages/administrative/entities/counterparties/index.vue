<template>
  <section class="w-4/6 mx-auto py-6" v-if="hydrated">

    <!-- Header -->
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-2xl font-extrabold tracking-tight text-gray-900">Контрагенти</h1>
      <span class="text-sm text-gray-400 font-medium">
        {{ filteredCounterparties.length }}
        <template v-if="counterpartiesSearch"> з {{ counterparties_list.length }}</template>
        записів
      </span>
    </div>

    <!-- Search bar -->
    <div class="mb-4">
      <UInput v-model="counterpartiesSearch" icon="i-lucide:search" placeholder="Пошук..." size="sm"
        :trailing-icon="counterpartiesSearch ? 'i-lucide:x' : undefined" @click:trailing="counterpartiesSearch = ''"
        class="w-full" />
    </div>

    <!-- Table Header -->
    <div class="hidden md:block">
      <div
        class="grid grid-cols-8 items-center bg-gray-50 border border-gray-200 rounded-t-xl px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
        <div>#</div>
        <div class="col-span-6">Назва</div>
        <div class="text-end">Дії</div>
      </div>

      <!-- Rows -->
      <div class="border-x border-b border-gray-200 rounded-b-xl overflow-hidden divide-y divide-gray-100">
        <div v-for="counterparty in filteredCounterparties" :key="counterparty.id"
          class="grid grid-cols-8 items-center px-4 py-2.5 transition-colors duration-150">
          <!-- ID -->
          <div class="text-xs text-gray-400 font-mono">{{ counterparty.id }}</div>

          <!-- Name field -->
          <div class="col-span-6 pr-4 text-sm">
            {{ counterparty.name }}
          </div>

          <!-- Edit / Save actions -->
          <div class="flex space-x-3 justify-end">
            <UTooltip :text="!counterparty.favoured ? 'Додати в улюблені' : 'Видалити з улюблених'"
              :content="{ side: 'top' }">
              <UButton :variant="counterparty.favoured ? 'solid' : 'subtle'" icon="i-lucide:star"
                :disabled="isStatusSwithing" :color="counterparty.favoured ? 'warning' : 'neutral'"
                @click="addToFavs(counterparty.id)"  />
            </UTooltip>
            <UTooltip text="Редагувати" :content="{ side: 'top' }">
              <UButton class="justify-self-end" variant="subtle" icon="i-lucide:pencil" color="neutral"
                @click="goToEditPage(counterparty.id)" disabled/>
            </UTooltip>

            <UModal title="Підтвердити дію">
              <UTooltip text="Видалити" :content="{ side: 'top' }">
                <UButton class="justify-self-end" variant="subtle" icon="i-lucide:trash" color="error"
                  @click="confirmDelete(counterparty)" disabled/>

              </UTooltip>
              <template #body>
                <div class="h-48 m-4 mx-auto">
                  Видалити контрагента <span class="font-semibold">{{ counterparty.name }}</span>?
                </div>

              </template>
              <template #footer="{ close }">
                <UButton label="Cancel" color="neutral" variant="outline" @click="close" />
                <UButton @click="executeDelete(id)" label="Видалити" color="neutral" />
              </template>
            </UModal>
          </div>
        </div>

        <!-- Empty state -->
        <div v-if="filteredCounterparties.length === 0" class="py-12 text-center text-sm text-gray-400">
          <template v-if="counterpartiesSearch">Нічого не знайдено за запитом «{{ counterpartiesSearch }}»</template>
          <template v-else>Контрагенти відсутні</template>
        </div>
      </div>


      <!-- Delete confirmation modal -->
      <UModal v-model:open="showDeleteModal">
        <template #content>
          <div class="p-6 space-y-4">
            <h3 class="text-base font-semibold text-gray-900">Видалити бренд?</h3>
            <p class="text-sm text-gray-500">
              Ви впевнені, що хочете видалити контрагента
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
    </div>

    <!-- Mobile cards -->
    <div class="flex flex-col gap-3 md:hidden">
      <div v-for="counterparty in filteredCounterparties" :key="counterparty.id"
        class="border border-gray-200 rounded-xl px-4 py-3 flex items-center justify-between gap-3">
        <div class="min-w-0">
          <div class="text-sm font-medium truncate">{{ counterparty.name }}</div>
          <div class="text-xs text-gray-400 font-mono mt-0.5">#{{ counterparty.id }}</div>
        </div>
        <div class="flex gap-2 shrink-0">
          <UButton :variant="counterparty.favoured ? 'solid' : 'subtle'" icon="i-lucide:star"
            :color="counterparty.favoured ? 'warning' : 'neutral'" :disabled="isStatusSwithing" size="sm"
            @click="addToFavs(counterparty.id)" />
          <UButton variant="subtle" icon="i-lucide:pencil" color="neutral" size="sm"
            @click="goToEditPage(counterparty.id)" disabled />
          <UButton variant="subtle" icon="i-lucide:trash" color="error" size="sm"
            @click="confirmDelete(counterparty)" disabled/>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>

definePageMeta({ layout: 'admin' })
const toast = useToast()

const hydrated = ref(false)
const { execute } = useAuthFetchMulti()

onMounted(() => {
  hydrated.value = true
})

// Data
const { data: counterpartiesData, refresh } = useAuthFetchData('/counterparties/')
const counterparties_list = computed(() => counterpartiesData?.value?.data ?? [])

// Search
const counterpartiesSearch = ref('')
const filteredCounterparties = computed(() =>
  counterparties_list.value.filter(cp =>
    cp.name.toLowerCase().includes(counterpartiesSearch.value.toLowerCase().trim())
  )
)



const isStatusSwithing = ref(false)
const addToFavs = async (id) => {
  const cp = counterparties_list.value.find(c => c.id === id)
  const status = computed(() => cp.favoured = !cp.favoured)
  isStatusSwithing.value = true
  try {
    await execute(`/counterparties/${id}/`, { method: 'PUT', body: { id: id, favoured: status.value } })
    toast.add({
      title: 'Статус успішно змінено',
      description: cp.name,
      icon: 'i-lucide:check-circle',
      color: 'success'
    })
    refresh()
  } catch (e) {
    console.error(e)
    toast.add({ title: 'Помилка зміни статусу', icon: 'i-lucide:ban', color: 'error' })
  } finally {
    isStatusSwithing.value = false
  }

}



// Delete state
const deletingId = ref(null)
const showDeleteModal = ref(false)
const pendingDelete = ref(null)


const goToEditPage = async (id) => {
  await navigateTo(`/administrative/counterparties/${id}`)
}

const confirmDelete = (brand) => {
  pendingDelete.value = brand
  showDeleteModal.value = true
}

const executeDelete = async () => {
  console.log('DELETED')
  //   if (!pendingDelete.value) return
  //   deletingId.value = pendingDelete.value.id
  //   try {
  //     await execute(`/brands/${pendingDelete.value.id}/`, { method: 'DELETE' })
  //     // Remove from list optimistically
  //     const idx = brands_list.value.findIndex(b => b.id === pendingDelete.value.id)
  //     if (idx !== -1) brands_list.value.splice(idx, 1)
  //     showDeleteModal.value = false
  //     pendingDelete.value   = null
  //   } catch (e) {
  //     console.error('Failed to delete counterparty', e)
  //   } finally {
  //     deletingId.value = null
  //   }
}

useHead({title: 'Контрагенти'})
</script>