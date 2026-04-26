<template>
    <section class="w-5/6 mx-auto">
        <h1 class="text-2xl font-extrabold my-4">
            Список поставок
        </h1>
         <div v-if="!loading && !error">
            <UButton variant="subtle" class="mx-auto mb-6" color="error" icon="i-lucide:hand" :disabled="isStopping"
                @click="handleStopSupplies">Зупинити всі</UButton>
            <div
                class="grid grid-cols-5 items-center bg-gray-50 border border-gray-200 rounded-t-xl px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                <div>Створено</div>
                <div>ID</div>
                <div>Постачальник</div>
                <div>Статус</div>
                <div class="text-end">Дії</div>
            </div>
            <div class="border-x border-b border-gray-200 rounded-b-lg px-2 ">
                <div v-for="supply in suppliesList" :key="supply.id">
                    <div class="grid grid-cols-5  px-1 py-1 text-sm font-slim items-center">

                        <div>{{ supply.created }}</div>
                        <div>
                            <p>
                                {{ supply.id }}
                            </p>
                        </div>
                        <div class=" flex space-x-2 items-center">{{ supply.supplier.name }}</div>
                        <div>
                            <UBadge variant="subtle" :color="supply.metadata.active ? 'primary' : 'neutral'"> {{
                                supply.metadata.active ? 'активована' : 'неактивна' }}</UBadge>
                        </div>

                        <div class="flex space-x-3 justify-end">
                            <UTooltip :text="!supply.metadata.active ? 'Активувати' : 'Вимкнути'"
                                :content="{ side: 'top' }">
                                <UButton variant="subtle"
                                    :icon="!supply.metadata.active ? 'i-lucide:power' : 'i-lucide:power-off'"
                                    :color="supply.metadata.active ? 'primary' : 'neutral'" :disabled="isStatusSwithing"
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
            description: supply.id,
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