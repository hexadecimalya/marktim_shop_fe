<template>
    <section class="w-5/6 lg:w-3/5 mx-auto">
        <h1 class="text-2xl font-extrabold my-4">
            Список поставок
        </h1>
        <div v-for="supply in dummySupply">
            <div class="grid grid-cols-7 my-2 items-center text-xs md:text-sm">
                <div>{{ supply.date }}</div>
                <div>
                    <!-- <UCheckbox v-model="value" color="neutral" /> -->
                    <p>
                        {{ supply.id }}
                    </p>
                </div>
                <div class="col-span-2 flex space-x-2 items-center">{{ supply.supplier }}</div>
                <div>
                    <AppButtonAdm @click="supply.isActive = !supply.isActive" :isActive="isActive">{{ supply.isActive ? 'активна' : 'вимкнена'
                    }}</AppButtonAdm>


                </div>
                <UTooltip text="Завантажити картинки">
                    <UButton class="justify-self-end" variant="ghost" icon="i-lucide:download" color="black" />
                </UTooltip>
                <UModal title="Confirm deleting">

                    <UButton class="justify-self-end" variant="ghost" icon="i-lucide:trash" color="error" />

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
            <USeparator />
        </div>
    </section>
</template>

<script setup>

const isActive = ref(false)
const handleDeleteSupply = (id) => {
    console.log('deleted')
}

const dummySupply = [
  {
    id: 1,
    date: '10.01.2025',
    isActive: true,
    supplier: 'Головач Северина',
    finished: true
  },
  {
    id: 2,
    date: '12.01.2025',
    isActive: false,
    supplier: 'Мельник Артем',
    finished: false
  },
  {
    id: 3,
    date: '15.01.2025',
    isActive: true,
    supplier: 'Коваль Софія',
    finished: true
  },
  {
    id: 4,
    date: '18.01.2025',
    isActive: true,
    supplier: 'Бондар Владислав',
    finished: false
  },
  {
    id: 5,
    date: '20.01.2025',
    isActive: false,
    supplier: 'Шевченко Аліна',
    finished: true
  },
  {
    id: 6,
    date: '23.01.2025',
    isActive: true,
    supplier: 'Ткачук Ігор',
    finished: false
  },
  {
    id: 7,
    date: '25.01.2025',
    isActive: false,
    supplier: 'Олійник Марія',
    finished: true
  },
  {
    id: 8,
    date: '28.01.2025',
    isActive: true,
    supplier: 'Сидоренко Дмитро',
    finished: false
  },
  {
    id: 9,
    date: '30.01.2025',
    isActive: true,
    supplier: 'Романюк Катерина',
    finished: true
  },
  {
    id: 10,
    date: '02.02.2025',
    isActive: false,
    supplier: 'Іванчук Павло',
    finished: false
  }
]


const exportImages = (id) => {
    // console.log('exporting')
}

definePageMeta({
    layout: 'admin'
})
</script>