<template>
    <section class="w-5/6  mx-auto">
        <h1 class="text-2xl font-extrabold my-4">
            Всі продукти
        </h1>

        <div class="grid grid-cols-7 border-b-1 bg-gray-100 border-gray-300 rounded-t-lg p-2 font-semibold ">
            <div>ID</div>
            <div class="col-span-2">Назва</div >
            <div class="col-span-2">Категорії</div>
            <div>Файли</div>
            <div class="text-end">Видалити</div>
        </div>
    </section>
</template>
<script setup>
definePageMeta({
    layout: 'admin'
})

const handleDeleteSupply = (id) => { }

</script>