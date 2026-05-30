<template>
    <section class="w-full max-w-5xl mx-auto px-4">
        <h1 class="text-2xl font-extrabold my-4">Список поставок</h1>

        <div v-if="!loading && !error">
            <UButton variant="subtle" class="mb-6" color="error" icon="i-lucide:hand" :disabled="isStopping"
                @click="handleStopSupplies">
                Зупинити всі
            </UButton>

            <!-- Desktop table -->
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
                            <div class="col-span-2 font-medium">{{ supply.supplier.name }}</div>
                            <div>{{ supply.total_items }}</div>
                            <div>
                                <UBadge variant="subtle" :color="supply.metadata.active ? 'primary' : 'neutral'">
                                    {{ supply.metadata.active ? 'активована' : 'неактивна' }}
                                </UBadge>
                            </div>
                            <div class="text-gray-600">{{ supply.created }}</div>
                            <div class="flex space-x-3 justify-end">
                                <UTooltip :text="!supply.metadata.active ? 'Активувати' : 'Вимкнути'"
                                    :content="{ side: 'top' }">
                                    <UButton variant="subtle"
                                        :icon="!supply.metadata.active ? 'i-lucide:power' : 'i-lucide:power-off'"
                                        :color="supply.metadata.active ? 'primary' : 'neutral'"
                                        :disabled="isStatusSwithing"
                                        @click="handleSwitchActiveStatusSupply(supply.id)" />
                                </UTooltip>
                                <UTooltip text="Завантажити картинки" :content="{ side: 'top' }">
                                    <UButton class="justify-self-end" variant="subtle" icon="i-lucide:download"
                                        color="neutral" :disabled="isExporting" @click="handleExport(supply.id)" />
                                </UTooltip>

                                <UModal title="Confirm deleting">
                                    <UTooltip text="Видалити" :content="{ side: 'top' }">
                                        <UButton class="justify-self-end" variant="subtle" icon="i-lucide:trash"
                                            color="error" />

                                    </UTooltip>
                                    <template #body>
                                        <div class="h-48 m-4 mx-auto">
                                            Видалити поставку #123?
                                        </div>

                                    </template>
                                    <template #footer="{ close }">
                                        <UButton label="Cancel" color="neutral" variant="outline" @click="close" />
                                        <UButton @click="handleDeleteSupply(id)" label="Видалити" color="neutral" />
                                    </template>
                                </UModal>
                            </div>
                        </div>
                        <USeparator />
                    </div>
                </div>
            </div>

            <!-- Mobile cards -->
            <div class="flex flex-col gap-3 md:hidden">
                <div v-for="supply in suppliesList" :key="supply.id"
                    class="border border-gray-200 rounded-xl p-4 flex flex-col gap-3">
                    <div class="flex items-center justify-between">
                        <span class="font-mono text-xs text-gray-500">#{{ supply.id }}</span>
                        <UBadge variant="subtle" :color="supply.metadata.active ? 'primary' : 'neutral'">
                            {{ supply.metadata.active ? 'активована' : 'неактивна' }}
                        </UBadge>
                    </div>
                    <div class="text-sm font-medium">{{ supply.supplier.name }}</div>
                    <div class="flex gap-4 text-xs text-gray-500">
                        <span>📦 {{ supply.total_items }} позицій</span>
                        <span>🗓 {{ supply.created }}</span>
                    </div>
                    <div class="flex gap-2 pt-1 border-t border-gray-100">
                        <UTooltip :text="!supply.metadata.active ? 'Активувати' : 'Вимкнути'"
                            :content="{ side: 'top' }">
                            <UButton variant="subtle"
                                :icon="supply.metadata.active ? 'i-lucide:power-off' : 'i-lucide:power'"
                                :color="supply.metadata.active ? 'primary' : 'neutral'" :disabled="isStatusSwithing"
                                @click="handleSwitchActiveStatusSupply(supply.id)" />
                        </UTooltip>
                        <UTooltip text="Завантажити картинки" :content="{ side: 'top' }">
                            <UButton variant="subtle" icon="i-lucide:download" color="neutral" :disabled="isExporting"
                                @click="handleExport(supply.id)" />
                        </UTooltip>
                        <UModal title="Підтвердіть видалення">
                            <UTooltip text="Видалити" :content="{ side: 'top' }">
                                <UButton variant="subtle" icon="i-lucide:trash" color="error" />
                            </UTooltip>
                            <template #body>
                                <p class="p-4 text-sm">Видалити поставку #{{ supply.id }}?</p>
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
        <AdminLoader v-if="loading" />
    </section>

    <div class="my-6 flex justify-center" v-if="!loading">
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
const url = computed(() => `/deliveries/?page_size=${limit}&page=${page.value}`)

const { data, error, loading, refresh } = useAuthFetchData(
    url
)

const isExporting = ref(false)

const suppliesList = computed(() => data.value?.data ?? [])

const handleExport = async (id) => {
    const userStore = useUserStore()
    if (!userStore.user.access_token) {
        userStore.initStore();
    }

    isExporting.value = true
    const config = useRuntimeConfig()

    try {
        const blob = await $fetch(`${config.public.apiBase}/deliveries/${id}/export_imgs/`, {
            method: 'GET',
            responseType: 'blob',
            headers: {
                'Authorization': `Bearer ${userStore.user.access_token}`
            }
        })

        const url = window.URL.createObjectURL(blob)

        const link = document.createElement('a')
        link.href = url

        link.setAttribute('download', `export-images-${id}.zip`)

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

    // console.log('exporting')
}
const isStatusSwithing = ref(false)
const handleSwitchActiveStatusSupply = async (id) => {
    const supply = suppliesList.value.find(s => s.id === id)


    isStatusSwithing.value = true
    try {
        await execute(`/deliveries/${id}/toggle_activity/`, { method: 'GET' })
        toast.add({
            title: 'Статус успішно змінено',
            description: `Поставка ${supply.id} від ${supply.supplier.name}`,
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

const isStopping = ref(false)

const handleStopSupplies = async () => {

    isStopping.value = true
    try {
        await execute(`/deliveries/stop/`, { method: 'GET' })
        toast.add({
            title: 'Активні поставки зупинені',
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

const handleDeleteSupply = (id) => {
    console.log('deleted')
}



</script>