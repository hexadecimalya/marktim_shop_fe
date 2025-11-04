<template>
    <section class="w-5/6 lg:w-3/5 mx-auto">
        <h1 class="text-2xl font-extrabold my-4">
            Список поставок
        </h1>
        <div v-for="i in 10">
            <div class="grid grid-cols-7 my-2 items-center text-xs md:text-sm">
                <div>Дата</div>
                <div>
                    <!-- <UCheckbox v-model="value" color="neutral" /> -->
                    <p>
                        ID
                    </p>
                </div>
                <div class="col-span-2 flex space-x-2 items-center">Name of supplier</div>
                <div>
                    <AppButtonAdm @click="isActive = !isActive" :isActive="isActive">{{ isActive ? 'активна' : 'вимкнена'
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

const exportImages = (id) => {
    // console.log('exporting')
}

definePageMeta({
    layout: 'admin'
})
</script>