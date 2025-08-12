<template>

    <section class="w-5/6 lg:w-3/5 mx-auto">
        <h1 class="text-2xl font-extrabold my-4">
            List of preorders
        </h1>
        <div v-for="i in 10">
            <div class="grid grid-cols-5 my-2 items-center text-xs md:text-sm">
                <div class="col-span-2 flex space-x-2 items-center">
                    <UCheckbox v-model="value" color="neutral" />
                    <p>
                        Name of preorder
                    </p>
                </div>
                <div>
                    <UButton variant="subtle">activate</UButton>
                </div>
                <div class="flex align-middle">
                    <UPopover>
                        <UButton size="sm md:md" variant="ghost" color="neutral">{{ selectedDate ?
                            df.format(selectedDate.toDate(getLocalTimeZone())) : 'Select a date' }}</UButton>
                        <template #content>
                            <UCalendar v-model="selectedDate" color="neutral" class="inline-flex" />
                        </template>
                    </UPopover>
                </div>
                <UButton class="justify-self-end" variant="ghost" icon="i-lucide:trash" color="error" />

            </div>
            <USeparator />
        </div>
    </section>

</template>

<script setup>
import { CalendarDate, DateFormatter, getLocalTimeZone } from '@internationalized/date'

const df = new DateFormatter('ua-UA', {
    dateStyle: 'medium'
})

const value = ref(false)
const selectedDate = shallowRef(new CalendarDate(2022, 1, 10))
definePageMeta({
    layout: 'admin'
})
</script>