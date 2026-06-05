<template>
    <section class="w-full max-w-5xl mx-auto px-4">
        <h1 class="text-2xl font-extrabold my-4">
            Список поставок (experimental)
        </h1>

        <div v-if="!loading && !error && suppliesList.length !== 0">
            <div class="hidden md:block">
                <div
                    class="grid grid-cols-7 items-center bg-gray-50 border border-gray-200 rounded-t-xl px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    <div>ID</div>
                    <div class="col-span-2">Постачальник</div>
                    <div>Позицій</div>
                    <div>Статус</div>
                    <div>Створено</div>
                    <div class="text-end">Дії</div>
                </div>
                <div class="border-x border-b border-gray-200 rounded-b-lg">
                    <div v-for="supply in suppliesList" :key="supply.id">
                        <div class="grid grid-cols-7 px-4 py-3 text-sm items-center">
                            <div class="font-mono text-gray-400 text-xs">{{ supply.id }}</div>
                            <div class="col-span-2 font-medium">{{ supply.supplier?.name || 'no name' }}</div>
                            <div>{{ supply.supply_products.length }}</div>
                            <div>
                                <UBadge variant="subtle" :color="!supply.draft ? 'primary' : 'neutral'">
                                    {{ supply.draft ? 'чернетка' : 'проведена' }}
                                </UBadge>
                            </div>
                            <div class="text-gray-600">{{ supply.created }}</div>
                            <div class="flex space-x-3 justify-end">
                                <UTooltip text="Редагувати" :content="{ side: 'top' }">
                                    <NuxtLink :to="editRoute(supply)">
                                        <UButton class="justify-self-end" variant="subtle" icon="i-lucide:pencil"
                                            color="neutral" />
                                    </NuxtLink>
                                </UTooltip>

                                <UModal title="Підтвердити дію">
                                    <UTooltip text="Видалити" :content="{ side: 'top' }">
                                        <UButton class="justify-self-end" variant="subtle" icon="i-lucide:trash"
                                            color="error" />
                                    </UTooltip>
                                    <template #body>
                                        <div class="p-4 text-sm text-center">
                                            Видалити поставку {{ supply.id }} від {{ supply.supplier?.name }}?
                                        </div>
                                    </template>
                                    <template #footer="{ close }">
                                        <UButton label="Скасувати" color="neutral" variant="outline" @click="close" />
                                        <UButton @click="handleDeleteSupply(supply.id)" label="Видалити"
                                            color="error" />
                                    </template>
                                </UModal>
                            </div>
                        </div>
                        <USeparator />
                    </div>
                </div>
            </div>

            <div class="flex flex-col gap-3 md:hidden">
                <div v-for="supply in suppliesList" :key="supply.id"
                    class="border border-gray-200 rounded-xl p-4 flex flex-col gap-3">
                    <div class="flex items-center justify-between">
                        <span class="font-mono text-xs text-gray-500">#{{ supply.id }}</span>
                        <UBadge variant="subtle" :color="!supply.draft ? 'primary' : 'neutral'">
                            {{ supply.draft ? 'чернетка' : 'проведена' }}
                        </UBadge>
                    </div>
                    <div class="text-sm font-medium">{{ supply.supplier?.name || 'no name' }}</div>
                    <div class="flex gap-4 text-xs text-gray-500">
                        <span>📦 {{ supply.supply_products.length }} товарів</span>
                        <span>🗓 {{ supply.created }}</span>
                    </div>
                    <div class="flex gap-2 pt-1 border-t border-gray-100 justify-end">
                        <UTooltip text="Редагувати" :content="{ side: 'top' }">
                            <NuxtLink :to="editRoute(supply)">
                                <UButton variant="subtle" icon="i-lucide:pencil" color="neutral" />
                            </NuxtLink>
                        </UTooltip>

                        <UModal title="Підтвердити дію">
                            <UTooltip text="Видалити" :content="{ side: 'top' }">
                                <UButton variant="subtle" icon="i-lucide:trash" color="error" />
                            </UTooltip>
                            <template #body>
                                <p class="p-4 text-sm text-center">Видалити поставку {{ supply.id }} від {{
                                    supply.supplier?.name }}?</p>
                            </template>
                            <template #footer="{ close }">
                                <UButton label="Скасувати" color="neutral" variant="outline" @click="close" />
                                <UButton label="Видалити" color="error" @click="handleDeleteSupply(supply.id)" />
                            </template>
                        </UModal>
                    </div>
                </div>
            </div>
        </div>

        <div v-else-if="!loading && !suppliesList.length"
            class="flex flex-col items-center justify-center py-12 gap-3 text-center">
            <UIcon name="i-lucide:clipboard-list" class="w-10 h-10 text-gray-300" />
            <p class="text-sm font-medium text-gray-700">Немає [експериментальних] поставок</p>
            <p class="text-xs text-gray-400">Вони з'являться тут</p>
        </div>

        <AdminLoader v-if="loading" />
    </section>

    <div class="my-6 flex justify-center" v-if="!loading && suppliesList.length !== 0">
        <UPagination v-model:page="page" :show-controls="false" :total="totalCount" active-color="neutral"
            active-variant="subtle" :items-per-page="limit" show-edges />
    </div>
</template>

<script setup>
definePageMeta({
    layout: 'admin'
})

const { execute } = useAuthFetchMulti()
const toast = useToast()
//const isActive = ref(false)

const page = ref(1)
const limit = 30
const totalCount = computed(() => data.value?.count ?? 0)
const url = computed(() => `/supplies/?page_size=${limit}&page=${page.value}&order_by=-id`) // add ordering to backend

const editRoute = (supply) => `/admin2/supplies/edit/${supply.type}-${supply.id}`

const { data, error, loading, refresh } = useAuthFetchData(
    url
)
const suppliesList = computed(() => data.value?.data ?? [])


const isExporting = ref(false)


const isDeleting = ref(false)
const handleDeleteSupply = async (id) => {
    isDeleting.value = true
    try {
        await execute(`/supplies/${id}/`, { method: 'DELETE' })
        toast.add({ title: 'Поставка успішно видалена', icon: 'i-lucide:check', color: 'success' })
        refresh()
    } catch (e) {
        console.error(e, 'Error deleting supply')
        toast.add({ title: 'Помилка видалення', icon: 'i-lucide:ban', color: 'error' })
    } finally {
        isDeleting.value = false
    }
}

useHead({title: 'Поставки (для складу)'})

</script>