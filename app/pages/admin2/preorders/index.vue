<template>

    <section class="w-5/6 mx-auto">
        <h1 class="text-2xl font-extrabold my-4">
            Список передзамовлень
        </h1>



        <div v-if="!loading && !error">
            <div
                class="grid grid-cols-5 my-2 items-center md:text-sm  bg-mtgreen-100 border border-gray-200 rounded-t-lg p-3 text-sm font-semibold text-gray-700">

                <div class="col-span-2">Назва</div>
                <div>Статус</div>
                <div>Активний до
                </div>
                <div class="text-end">Дії</div>
            </div>
            <div v-for="preorder in preordersList" :key="preorder.id">
                <div class="grid grid-cols-5 my-2 items-center text-xs md:text-sm px-3">
                    <div class="col-span-2 flex space-x-2 items-center">
                       
                        <NuxtLink :to="`/admin2/preorders/${preorder.id}`" class="hover:underline cursor-pointer">
                            {{ preorder.name }}
                        </NuxtLink>
                    </div>
                    <div>
                        <UButton variant="subtle" :color="preorder.active ? 'primary' : 'neutral'"> {{ preorder.active ?
                            'вимкнути' : 'активувати' }} </UButton>
                    </div>
                    <div class="flex align-middle">
                        <UPopover>
                            <UButton size="sm" variant="ghost" color="neutral">
                                {{
                                    preorder.uiValidTill
                                        ? df.format(preorder.uiValidTill.toDate(getLocalTimeZone()))
                                        : 'Обрати дату'
                                }}
                            </UButton>

                            <template #content>
                                <UCalendar v-model="preorder.uiValidTill" color="neutral" class="inline-flex" />
                            </template>
                        </UPopover>
                    </div>
                    <UButton class="justify-self-end" variant="ghost" icon="i-lucide:trash" color="error" />

                </div>
                <USeparator />
            </div>
            <div class="my-6 flex justify-center">
                <UPagination v-model:page="page" :show-controls="false" :total="totalCount" active-color="neutral"
                    active-variant="subtle" :items-per-page="limit" show-edges />
            </div>

        </div>

        <div v-else-if="error">
            {{ error }}
        </div>
        <div v-else>
            <AdminLoader />
        </div>


    </section>

</template>

<script setup>
import { CalendarDate, DateFormatter, getLocalTimeZone } from '@internationalized/date'
const isActive = ref(false)
const df = new DateFormatter('ua-UA', {
    dateStyle: 'medium'
})
const page = ref(1)
const limit = 30
const totalCount = computed(() => data.value?.count ?? 0)
const url = "/api/v1/preorders/"


const { data, error, loading } = useAuthFetchData(url)

const preordersList = computed(() => {
    return (data.value?.data ?? []).map(preorder => {
        let uiValidTill = null

        const raw = preorder.metadata?.valid_till

        if (raw) {
            // Expecting "YYYY-MM-DD"
            const [year, month, day] = raw.split('-').map(Number)
            uiValidTill = new CalendarDate(year, month, day)
        }

        return {
            ...preorder,
            uiValidTill
        }
    })
})

const value = ref(false)
const selectedDate = shallowRef(new CalendarDate(2022, 1, 10))
definePageMeta({
  layout: 'admin'
})
</script>