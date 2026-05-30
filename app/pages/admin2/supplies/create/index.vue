<template>
  <div class="mx-auto max-w-6xl p-4 md:p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-semibold text-gray-900">
        Створити поставку
      </h1>
      <p class="mt-1 text-sm text-gray-500">
        Виберіть валюту, у якій буде рахуватися логіка та всі наступні кроки.
      </p>
    </div>

    <div class="grid gap-4 md:grid-cols-3">
      <div
        v-for="item in supplyTypes"
        :key="item.key"
        class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
      >
        <div class="flex items-start justify-between gap-3">
          <div>
            <h2 class="text-lg font-semibold text-gray-900">
              {{ item.title }}
            </h2>
            <p class="mt-1 text-sm text-gray-500">
              {{ item.description }}
            </p>
          </div>

          <UBadge variant="subtle" color="neutral" class="shrink-0">
            {{ item.currencyLabel }}
          </UBadge>
        </div>

        <div class="mt-5">
          <UButton
            block
            size="lg"
            color="neutral"
            variant="subtle"
            icon="i-lucide:arrow-right"
            @click="startSupply(item.key)"
          >
            Розпочати
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup >
const supplyTypes = [
  {
    key: 'pln',
    title: 'Поставка з Польщі',
    description: 'Підходить для сценарію, де розрахунки ведуться у злотих.',
    currencyLabel: 'PLN',
  },
  {
    key: 'uah',
    title: 'Поставка з України',
    description: 'Використовуйте цей варіант для поставок у гривні.',
    currencyLabel: 'UAH',
  },
  {
    key: 'eur',
    title: 'Поставка Європа',
    description: 'Для європейських поставок з базовою валютою євро.',
    currencyLabel: 'EUR',
  },
] 



const startSupply = async (type) => {
  await navigateTo(`/admin2/supplies/create/${type}`)
}
definePageMeta({ layout: 'admin' })
</script>

