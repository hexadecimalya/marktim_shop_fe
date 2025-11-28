<template>
    <div class="grid grid-cols-5 gap-1 h-12 content-center p-2 text-sm font-medium">
        <div>#{{ orderData.id }}</div>
        <div>{{ orderData.date }}</div>
        <div>{{ orderData.amount }} грн</div>
        <!-- <div :class="statusColor"></div> -->
         <UBadge class="w-28" size="md" :color="statusColor" variant="outline">{{ orderData.status }} </UBadge>
        <div class="justify-self-end">
            <NuxtLink :to="`/user/order-${orderData.id}`">
                <UIcon name="i-solar:eye-bold" class="sm:w-6 sm:h-6  w-7 h-7 opacity-80" />
            </NuxtLink>
        </div>
    </div>
</template>
<script setup>


const props = defineProps({
    orderData: {
        id: Number,
        date: String,
        amount: Number,
        status: String
    }
}
)

const statusColor = computed(() => {
    switch (props.orderData.status) {
        case 'Виконано':
            return 'primary'
        case 'Відмінено':
            return 'error'
        case 'Обробляється':
            return 'warning'
    }
})


</script>
