<template>
  <section class="w-11/12 max-w-5xl mx-auto">
    <h1 class="text-2xl font-extrabold my-4">Список передзамовлень</h1>

    <div v-if="!loading && !error">
      <UButton
        variant="subtle"
        class="mb-6"
        color="error"
        icon="i-lucide:hand"
        :disabled="isStopping"
        @click="handleStopPreorders"
      >
        Зупинити всі
      </UButton>

      <!-- Desktop table -->
      <div class="hidden md:block">
        <div class="grid grid-cols-6 items-center bg-gray-50 border border-gray-200 rounded-t-xl px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
          <div>Створено</div>
          <div class="col-span-2">Назва</div>
          <div>Статус</div>
          <div>Активний до</div>
          <div class="text-end">Дії</div>
        </div>
        <div class="border-x border-b border-gray-200 rounded-b-lg">
          <div v-for="preorder in preordersList" :key="preorder.id">
            <div class="grid grid-cols-6 px-4 py-2 text-sm items-center">
              <div class="text-gray-500 text-xs">{{ preorder.created }}</div>
              <div class="col-span-2 font-semibold text-gray-600">
                <NuxtLink :to="`/admin2/preorders/${preorder.id}`" class="hover:underline">
                  {{ preorder.name }}
                </NuxtLink>
              </div>
              <div>
                <UBadge variant="subtle" :color="preorder.active ? 'primary' : 'neutral'">
                  {{ preorder.active ? 'активований' : 'неактивний' }}
                </UBadge>
              </div>
              <div>
                <UPopover>
                  <UButton size="sm" variant="ghost" color="neutral">
                    {{ formatDate(validTillMap[preorder.id]) }}
                  </UButton>
                  <template #content>
                    <UCalendar
                      :model-value="toCalendarDate(validTillMap[preorder.id])"
                      @update:model-value="(val) => {
                        const str = fromCalendarDate(val)
                        validTillMap[preorder.id] = str
                        saveValidTill(preorder.id, str)
                      }"
                      color="neutral"
                      class="inline-flex"
                    />
                  </template>
                </UPopover>
              </div>
              <div class="flex gap-2 justify-end">
                <UTooltip
                  :text="!preorder.uiValidTill ? 'Спочатку оберіть дату' : (!preorder.active ? 'Активувати' : 'Вимкнути')"
                  :content="{ side: 'top' }"
                >
                  <UButton
                    variant="subtle"
                    :icon="preorder.active ? 'i-lucide:power-off' : 'i-lucide:power'"
                    :color="preorder.active ? 'primary' : 'neutral'"
                    :class="{ 'opacity-50': !preorder.uiValidTill }"
                    :disabled="isStatusSwithing"
                    @click="handleSwitchActiveStatusPreorder(preorder.id)"
                  />
                </UTooltip>
                <UTooltip text="Опублікувати в Viber" :content="{ side: 'top' }">
                  <UButton variant="subtle" icon="i-lucide:send" color="neutral" :disabled="isPublishing" @click="handlePubishPreorder(preorder.id)" />
                </UTooltip>
                <UTooltip text="Видалити" :content="{ side: 'top' }">
                  <UButton variant="subtle" icon="i-lucide:trash" color="error" :disabled="isDeleting" @click="handleDeletePreorder(preorder.id)" />
                </UTooltip>
              </div>
            </div>
            <USeparator />
          </div>
        </div>
      </div>

      <!-- Mobile cards -->
      <div class="flex flex-col gap-3 md:hidden">
        <div
          v-for="preorder in preordersList"
          :key="preorder.id"
          class="border border-gray-200 rounded-xl p-4 flex flex-col gap-3"
        >
          <div class="flex items-start justify-between gap-2">
            <NuxtLink
              :to="`/admin2/preorders/${preorder.id}`"
              class="font-semibold text-gray-700 hover:underline leading-snug"
            >
              {{ preorder.name }}
            </NuxtLink>
            <UBadge variant="subtle" :color="preorder.active ? 'primary' : 'neutral'" class="shrink-0">
              {{ preorder.active ? 'активований' : 'неактивний' }}
            </UBadge>
          </div>

          <div class="flex gap-4 text-xs text-gray-400">
            <span>🗓 Створено: {{ preorder.created }}</span>
          </div>

          <div class="flex items-center gap-2 text-xs text-gray-500">
            <span class="shrink-0">Активний до:</span>
            <UPopover>
              <UButton size="sm" variant="ghost" color="neutral">
                {{ formatDate(validTillMap[preorder.id]) }}
              </UButton>
              <template #content>
                <UCalendar
                  :model-value="toCalendarDate(validTillMap[preorder.id])"
                  @update:model-value="(val) => {
                    const str = fromCalendarDate(val)
                    validTillMap[preorder.id] = str
                    saveValidTill(preorder.id, str)
                  }"
                  color="neutral"
                  class="inline-flex"
                />
              </template>
            </UPopover>
          </div>

          <div class="flex gap-2 pt-2 border-t border-gray-100">
            <UTooltip
              :text="!preorder.uiValidTill ? 'Спочатку оберіть дату' : (!preorder.active ? 'Активувати' : 'Вимкнути')"
              :content="{ side: 'top' }"
            >
              <UButton
                variant="subtle"
                :icon="preorder.active ? 'i-lucide:power-off' : 'i-lucide:power'"
                :color="preorder.active ? 'primary' : 'neutral'"
                :class="{ 'opacity-50': !preorder.uiValidTill }"
                :disabled="isStatusSwithing"
                @click="handleSwitchActiveStatusPreorder(preorder.id)"
              />
            </UTooltip>
            <UTooltip text="Опублікувати в Viber" :content="{ side: 'top' }">
              <UButton variant="subtle" icon="i-lucide:send" color="neutral" :disabled="isPublishing" @click="handlePubishPreorder(preorder.id)" />
            </UTooltip>
            <UTooltip text="Видалити" :content="{ side: 'top' }">
              <UButton variant="subtle" icon="i-lucide:trash" color="error" :disabled="isDeleting" @click="handleDeletePreorder(preorder.id)" />
            </UTooltip>
          </div>
        </div>
      </div>

      <div class="my-6 flex justify-center">
        <UPagination
          v-model:page="page"
          :show-controls="false"
          :total="totalCount"
          active-color="neutral"
          active-variant="subtle"
          :items-per-page="limit"
          show-edges
        />
      </div>
    </div>

    <div v-else-if="error">{{ error }}</div>
    <div v-else><AdminLoader /></div>
  </section>
</template>

<script setup>
import { CalendarDate } from '@internationalized/date'

const { execute } = useAuthFetchMulti()
const toast = useToast()

const page = ref(1)
const limit = 30
const totalCount = computed(() => data.value?.count ?? 0)
const url = computed(() => `/preorders/?preorder=true&page_size=${limit}&page=${page.value}`)

const { data, error, loading, refresh } = useAuthFetchData(url)


const validTillMap = reactive({})

watch(
    () => data.value?.data,
    (list) => {
        if (!list) return
        for (const p of list) {
            if (validTillMap[p.id] === undefined)
                validTillMap[p.id] = p.metadata?.valid_till ?? null
        }
    },
    { immediate: true }
)

const preordersList = computed(() =>
    (data.value?.data ?? []).map(preorder => ({
        ...preorder,
        get uiValidTill() { return validTillMap[preorder.id] ?? null }
    }))
)

// --- Date helpers ---

function toCalendarDate(str) {
    if (!str) return null
    const [y, m, d] = str.split('-').map(Number)
    return new CalendarDate(y, m, d)
}

function fromCalendarDate(cd) {
    if (!cd) return null
    return `${cd.year}-${String(cd.month).padStart(2, '0')}-${String(cd.day).padStart(2, '0')}`
}

function formatDate(str) {
    if (!str) return 'Обрати дату'
    const [y, m, d] = str.split('-').map(Number)
    return new Date(y, m - 1, d).toLocaleDateString('uk-UA', { dateStyle: 'medium' })
}


const saveValidTill = async (id, dateStr) => {
    try {
        await execute(`/preorders/${id}/save_date/?date=${dateStr}`, { method: 'GET' })
    } catch (e) {
        console.error(e)
    }
}

const isStatusSwithing = ref(false)

const handleSwitchActiveStatusPreorder = async (id) => {
    const preorder = preordersList.value.find(p => p.id === id)

    if (!validTillMap[id]) {
        toast.add({
            title: 'Дата не обрана',
            description: `Будь ласка, оберіть дату "Активний до" для ${preorder?.name || 'цього передзамовлення'}`,
            icon: 'i-lucide:calendar-clock',
            color: 'warning'
        })
        return
    }

    isStatusSwithing.value = true
    try {
        await execute(`/preorders/${id}/toggle_activity/`, { method: 'GET' })
        toast.add({
            title: 'Статус успішно змінено',
            description: preorder.name,
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

const isPublishing = ref(false)

const handlePubishPreorder = async (id) => {
    isPublishing.value = true
    try {
        await execute(`/preorders/${id}/publish/viber/`, { method: 'GET' })
        toast.add({ title: 'Публікація передзамовлення в процесі', icon: 'i-lucide:check', color: 'success' })
        refresh()
    } catch (e) {
        console.error(e, 'Error publishing preorder')
        toast.add({ title: 'Помилка публікації', icon: 'i-lucide:ban', color: 'error' })
    } finally {
        isPublishing.value = false
    }
}

const isDeleting = ref(false)

const handleDeletePreorder = async (id) => {
    isDeleting.value = true
    try {
        await execute(`/preorders/${id}/`, { method: 'DELETE' })
        toast.add({ title: 'Передзамовлення успішно видалено', icon: 'i-lucide:check', color: 'success' })
        refresh()
    } catch (e) {
        console.error(e, 'Error deleting preorder')
        toast.add({ title: 'Помилка видалення', icon: 'i-lucide:ban', color: 'error' })
    } finally {
        isDeleting.value = false
    }
}
const isStopping = ref(false)

const handleStopPreorders = async () => {

    isStopping.value = true
    try {
        await execute(`/preorders/stop/`, { method: 'GET' })
        toast.add({
            title: 'Передзамовлення зупинені',
            icon: 'i-lucide:check-circle',
            color: 'success'
        })
        refresh()
    } catch (e) {
        console.error(e)
        toast.add({ title: 'Помилка зміни статусу', icon: 'i-lucide:ban', color: 'error' })
    } finally {
        isStopping.value = false
    }
}

definePageMeta({ layout: 'admin' })
</script>