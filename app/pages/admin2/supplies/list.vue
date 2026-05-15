<template>
    <section class="w-5/6 mx-auto">
        <h1 class="text-2xl font-extrabold my-4">
            Список поставок
        </h1>
        <div v-if="!loading && !error">
            <div>

                <div
                    class="grid grid-cols-6 items-center
             bg-gray-50 border border-gray-200 rounded-t-xl px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    <div>Створено</div>
                    <div>ID</div>
                    <div>Постачальник</div>
                    <div>Товари</div>
                    <div>Статус</div>
                    <div class="text-end">Дії</div>
                </div>
            </div>
            <div class="border-x border-b border-gray-200 rounded-b-lg px-2 ">
                <div v-for="supply in suppliesList" :key="supply.id"
                    class="grid grid-cols-6 px-1 py-1 text-sm font-slim items-center ">

                    <div>{{ supply.created }}</div>
                    <div class="hover:underline  text-xs text-gray-700 font-mono">
                        <NuxtLink :to="`/admin2/supplies/edit-${supply.id}`">
                            {{ supply.id }}
                        </NuxtLink>
                    </div>

                    <div>{{ supply.supplier }}</div>
                    <div>{{ supply.supply_products.length }}</div>
                    <div>
                        <UBadge variant="subtle" :color="!supply.draft ? 'primary' : 'neutral'"> {{
                            supply.draft ? 'чернетка' : 'проведена' }}</UBadge>
                    </div>

                    <div class="flex space-x-3 justify-end">
                        <!-- <UTooltip :text="!supply.metadata.active ? 'Активувати' : 'Вимкнути'"
                                :content="{ side: 'top' }">
                                <UButton variant="subtle"
                                    :icon="!supply.metadata.active ? 'i-lucide:power' : 'i-lucide:power-off'"
                                    :color="supply.metadata.active ? 'primary' : 'neutral'" :disabled="isStatusSwithing"
                                    />
                            </UTooltip>
                            <UTooltip text="Завантажити картинки" :content="{ side: 'top' }">
                                <UButton class="justify-self-end" variant="subtle" icon="i-lucide:download"
                                    color="neutral" :disabled="isExporting" />
                            </UTooltip> -->

                        <UModal title="Підтвердити дію">
                            <UTooltip text="Видалити" :content="{ side: 'top' }">
                                <UButton class="justify-self-end" variant="subtle" icon="i-lucide:trash"
                                    color="error" />

                            </UTooltip>
                            <template #body>
                                <div class="h-48 m-4 mx-auto">
                                    Видалити поставку {{ supply.id}} від {{ supply.supplier?.name }}?
                                </div>

                            </template>
                            <template #footer="{ close }">
                                <UButton label="Cancel" color="neutral" variant="outline" @click="close" />
                                <UButton @click="handleDeleteSupply(supply.id)" label="Видалити" color="neutral" />
                            </template>
                        </UModal>
                    </div>
                </div>
            </div>
            <USeparator />
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
const url = computed(() => `/supplies/?page_size=${limit}&page=${page.value}&order_by=-id`) // add ordering to backend

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



</script>