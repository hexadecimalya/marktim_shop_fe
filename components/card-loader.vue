<template>
    <div class="gap-4 grid grid-cols-2 lg:grid-cols-4 space-y-4">
        <div v-for="i in 4">
            <div class="flex flex-col gap-1 items-center">
                <USkeleton class="h-42 w-[200px]" />
                <USkeleton class="h-12 w-[200px]" />
                <USkeleton class="h-6 w-[50px]" />
                <USkeleton class="rounded-xs h-12 w-[200px]" />
            </div>
        </div>
    </div>
</template>
<script setup>
</script>