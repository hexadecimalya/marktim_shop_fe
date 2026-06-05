<template>


  <section class="w-full max-w-6xl mx-auto px-4">
    <h1 class="text-2xl font-extrabold my-4">
      Товари, яких нема на Rozetka
    </h1>

    <div v-if="!loading && !error && itemsList.length !== 0">
      <UButton variant="subtle" class="mb-6" color="neutral" icon="i-lucide:download" :disabled="!checkedItems.length"
        @click="downloadCSV">
        Завантажити CSV
      </UButton>
      <div
        class="grid grid-cols-5 items-center bg-gray-50 border border-gray-200 rounded-t-xl px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
        <div>Артикул</div>
        <div class="col-span-3">Назва</div>
        <div class="text-end">Ціна</div>
      </div>
      <div class="flex flex-col gap-3">
        <div class="border-x border-b border-gray-200 rounded-b-lg">
          <div v-for="item in itemsList" :key="item.id">
            <div class="grid grid-cols-5 px-4 py-2 text-sm items-center">
              <div class="flex gap-2">
                <UCheckbox :model-value="isProductInList(item.id)"
                  @update:model-value="(val) => toggleProductSelection(val, item)" />{{ item.product_code }}
              </div>
              <div class="col-span-3 font-medium">{{ item.name }}</div>
              <div class="text-end">{{ item.price }}</div>
            </div>
            <USeparator />
          </div>
        </div>
      </div>
      <div class="my-6 flex justify-center">
        <UPagination v-model:page="page" :show-controls="false" :total="totalCount" active-color="neutral"
          active-variant="subtle" :items-per-page="limit" show-edges />
      </div>
    </div>
    <div v-else-if="!loading && !itemsList.length"
      class="flex flex-col items-center justify-center py-12 gap-3 text-center">
      <UIcon name="i-lucide:clipboard-list" class="w-10 h-10 text-gray-300" />
      <p class="text-sm font-medium text-gray-700">Немає товарів</p>
      <p class="text-xs text-gray-400">Вони з'являться тут</p>
    </div>

    <AdminLoader v-if="loading" />
  </section>


</template>

<script setup>
const page = ref(1)
const limit = 50
const offset = (page.value - 1) * limit;

const url = computed(() => `/products/?product=true&rozetka=true&in_stock=true&page_size=${limit}&page=${page.value}` )
const { data, loading, error } = useAuthFetchData(url)

const totalCount = computed(() => data.value?.count ?? 0)
const itemsList = computed(() => data.value?.data ?? [])



const checkedItems = ref([])

const checkedIdsSet = computed(() => {
  return new Set(checkedItems.value.map(item => item.id))
})

const isProductInList = (id) => {
  return checkedIdsSet.value.has(id)
}

const toggleProductSelection = (checked, product) => {
  if (checked) {
    const index = checkedItems.value.findIndex(item => item.id === product.id)

    if (index === -1) {
      checkedItems.value.push({ ...product })
    } else {
      checkedItems.value[index] = { ...product }
    }
  } else {
    checkedItems.value = checkedItems.value.filter(item => item.id !== product.id)
  }
}

//── CSV Export ─────────────────────────────────────────────────────────────────
const downloadCSV = () => {

  const rows = checkedItems.value.map((row) => {
    return {
      name: row.name,
      product_code: row.product_code,
      price: row.price,

    };
  });

  const headersConfig = [
    { key: "product_code", label: "Артикул" },
    { key: "name", label: "Назва" },
    { key: "price", label: "Ціна" },
  ];

  const headers = headersConfig.map((h) => h.label).join(";");
  const csvContent = rows
    .map((row) =>
      headersConfig.map((h) => `"${String(row[h.key] ?? "").replace(/"/g, '""')}"`).join(";")
    )
    .join("\n");

  const blob = new Blob(["\uFEFF" + `${headers}\n${csvContent}`], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `add_to_rozetka_${Date.now()}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  checkedItems.value = [];
};


definePageMeta({ layout: 'admin' })
useHead({ title: 'Товари не на Rozetka' })
</script>
