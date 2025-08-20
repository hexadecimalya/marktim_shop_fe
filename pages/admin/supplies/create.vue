<template>

    <section class="w-5/6 mx-auto">
        <h1 class="text-2xl font-extrabold my-4">
            New supply
        </h1>
        <div>
            <UFileUpload v-model="value" label="Drop your table here" description="XLS or XLSX" class="w-48 min-h-48"
                accept="application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" />
        </div>
    </section>
</template>


<script setup>

const value = ref(null)
definePageMeta({
    layout: 'admin'
})
</script>