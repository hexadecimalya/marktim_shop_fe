<template>
    <section class="w-5/6 lg:w-3/5 mx-auto">
        <h1 class="text-2xl font-extrabold my-4">
            List of supplies
        </h1>
        <div v-for="i in 10">
            <div class="grid grid-cols-5 my-2 items-center text-xs md:text-sm">
                <div>Date</div>
                <div class="col-span-2 flex space-x-2 items-center">
                    <!-- <UCheckbox v-model="value" color="neutral" /> -->
                    <p>
                        Name of supply
                    </p>
                </div>
                <div>Name of supplier</div>
                <UButton class="justify-self-end" variant="ghost" icon="i-lucide:trash" color="error" />

            </div>
            <USeparator />
        </div>
    </section>
</template>

<script setup>


definePageMeta({
    layout: 'admin'
})
</script>