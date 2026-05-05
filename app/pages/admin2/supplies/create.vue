<template>
    <section class="w-11/12 mx-auto" v-if="hydrated">
        <h1 class="text-2xl font-extrabold my-4">Нова поставка</h1>
        <div>
            <!-- ── Top controls ─────────────────────────────────────────────────── -->
            <div class="grid grid-cols-5 gap-x-4 mb-4">
                <UFormField label="Курс (zl) за формулою">
                    <UInput v-model="exchangeRate" type="number" placeholder="Напр. 13.3"
                        @change="store.recalculateAll" />
                </UFormField>
                <UFormField label="Курс (zl) реальний">
                    <UInput v-model="exchangeRateReal" type="number" placeholder="Напр. 13.3" />
                </UFormField>

                <UFormField label="Постачальник" class="col-span-2">

                    <!-- <ClientOnly> -->
                        <USelectMenu class="w-full" v-model="counterpartyName" v-model:search-term="counterpartySearch"
                            :items="filteredCounterparties" label-key="name" value-key="id" :loading="cpLoading"
                            placeholder="Оберіть або створіть постачальника" />
                    <!-- </ClientOnly> -->
                    <!-- <UInput v-model="counterpartyName" placeholder="Введіть постачальника" class="w-full" /> -->
                </UFormField>
            </div>

            <!-- ── Sumup accordion ──────────────────────────────────────────────── -->
            <section v-if="sumupItems.length" class="mt-4 bg-gray-100  p-4 rounded-md">
                <UAccordion :items="sumupAccordionItems">
                    <template #sumup-content>
                        <div
                            class="grid grid-cols-10  bg-gray-50 border border-gray-200 rounded-t-xl px-2 py-3 text-xs font-semibold tracking-wider text-gray-500 mt-2">
                            <div class="flex justify-center">Дії</div>
                            <div class="col-span-6">Назва</div>
                            <div>Продаж</div>
                            <div>Опт</div>
                            <div class="flex justify-end">
                                <UIcon name="i-lucide:image" />
                            </div>
                        </div>
                        <div
                            class="divide-y divide-gray-100 border-x border-b border-gray-200 rounded-b-lg mb-2 bg-white">
                            <div v-for="item in sumupItems" :key="item.p_id"
                                class="grid grid-cols-10 items-center p-1 text-sm gap-x-1 hover:bg-blue-50/40 transition-colors">
                                <div class="flex justify-center">
                                    <UButton icon="i-lucide:plus" color="primary" variant="ghost" size="sm"
                                        @click="store.addRowFromSumup(item)" />
                                </div>
                                <div class="col-span-6 font-medium truncate">{{ item.name }}</div>
                                <div class="text-sm tabular-nums">{{ item.sell_price }}</div>
                                <div class="text-sm tabular-nums">{{ item.bulk_price }}</div>
                                <div class="flex justify-end">
                                    <img :src="item.file || placeholder" class="w-10 h-10 object-cover rounded" />
                                </div>
                            </div>
                        </div>
                    </template>
                </UAccordion>
            </section>

            <div v-else-if="sumupLoading" class="py-6">
                <AdminLoader />
            </div>

            <!-- ── Search ───────────────────────────────────────────────────────── -->
            <div class="my-4">
                <USeparator label="Пошук у базі" type="solid" />
            </div>

            <SearchBarAdmin @update:search="onSearch" />

            <section v-if="searchTerm.length >= 3 && !searchLoading && !searchError">
                <div
                    class="grid grid-cols-10 items-center bg-gray-50 border border-gray-200 rounded-t-xl px-4 py-3 text-xs font-semibold tracking-wider text-gray-500 mt-2">
                    <div class="flex justify-center">Дії</div>
                    <div class="col-span-6">Назва</div>
                    <div>Закуп (zl)</div>
                    <div>Промо (zl)</div>
                    <div class="flex justify-end">
                        <UIcon name="i-lucide:image" />
                    </div>
                </div>
                <div class="divide-y divide-gray-100 border-x border-b border-gray-200 rounded-b-lg">
                    <div v-for="product in searchResults" :key="product.id"
                        class="grid grid-cols-10 items-center p-1 text-sm gap-x-1 hover:bg-gray-50 transition-colors">
                        <div class="flex justify-center">
                            <UButton icon="i-lucide:plus" color="primary" variant="ghost" size="sm"
                                @click.stop="store.addRowFromSearch(product)" />
                        </div>
                        <div class="col-span-6 font-medium truncate">
                            {{ product.name || product.name_ukr }}
                        </div>
                        <div class="text-sm tabular-nums text-gray-500">{{ product.regular_price ?? '—' }}</div>
                        <div class="text-sm tabular-nums text-gray-500">{{ product.promo_price ?? '—' }}</div>
                        <div class="flex justify-end">
                            <img :src="product?.files?.[0]?.link || placeholder"
                                :class="{ 'hover:scale-350 hover:inset-10 duration-200 ease-out': product?.files?.[0]?.link }"
                                class="w-10 h-10 object-cover rounded shadow-sm" />
                        </div>
                    </div>
                </div>
                <div class="my-6 flex justify-center">
                    <UPagination v-model:page="page" :total="totalCount" :items-per-page="limit" :show-controls="false"
                        active-color="neutral" active-variant="subtle" />
                </div>
            </section>

            <div v-else-if="searchLoading && searchTerm.length >= 3" class="py-6">
                <AdminLoader />
            </div>

            <!-- ── Table Supply ──────────────────────────────────────────────────── -->
            <div class="my-4">
                <USeparator label="Таблиця поставки" type="solid" />
            </div>

            <!-- Header -->
            <div
                class="grid grid-cols-13 items-center bg-gray-50 border border-gray-200 rounded-t-xl px-2 py-3 text-xs font-semibold tracking-wider text-gray-500">
                <div class="flex justify-center">Дії</div>
                <div class="col-span-4">Назва</div>
                <div>К-сть</div>
                <div>Ціна </div>
                <div>%</div>
                <div class="text-center">Промо ціна</div>
                <div class="text-center">Фінальна</div>
                <div class="text-center">Сума</div>
                <div>Продаж</div>
                <div>Опт</div>
            </div>

            <!-- Rows -->
            <div class="border-x border-b border-gray-200 rounded-b-lg">
                <template v-for="(rows, receiptIdx) in receiptGroups" :key="receiptIdx">
                    <div v-for="row in rows" :key="row._id"
                        class="grid grid-cols-13 items-center px-2 py-1 text-sm gap-x-1 hover:bg-red-50/20 transition-colors border-b border-gray-100">
                        <!-- Delete -->
                        <div class="flex justify-center">
                            <UButton icon="i-lucide:trash-2" color="error" variant="ghost" size="sm"
                                @click="store.removeRow(row._id)" />
                        </div>

                        <!-- Name -->
                        <div class="col-span-4">
                            <UInput v-model="row.name" :disabled="row.nameDisabled" size="sm" class="w-full" />
                        </div>



                        <!-- Quantity -->
                        <UInput v-model="row.quantity" type="number" size="sm" @change="store.recalculate(row)" />
                        <!-- Regular price -->
                        <UInput v-model="row.regular_price" type="number" size="sm" @change="store.recalculate(row)" />
                        <!-- Discount -->
                        <UInput v-model="row.discount" type="number" size="sm" @change="store.recalculate(row)" />

                        <!-- promotion_price – display only -->
                        <div class="text-xs text-center text-gray-500 tabular-nums">
                            {{ row.promotion_price != null ? fmt(row.promotion_price) : '—' }}
                        </div>



                        <!-- price – display only -->
                        <div class="text-xs text-center text-gray-500 tabular-nums">
                            {{ row.price != null ? fmt(row.price) : '—' }}
                        </div>

                        <!-- sum – display only -->
                        <div class="text-xs text-center font-semibold tabular-nums">
                            {{ row.sum != null ? fmt(row.sum) : '—' }}
                        </div>
                        <!-- Sell price – locked when fromSumup -->
                        <UInput v-model="row.sell_price" :disabled="row.fromSumup" size="sm"
                            :class="{ 'font-bold': !row.fromSumup }" />

                        <!-- Bulk price – locked when fromSumup -->
                        <UInput v-model="row.bulk_price" :disabled="row.fromSumup" size="sm" />
                    </div>

                    <!-- Receipt separator – only for closed receipts -->
                    <div v-if="Number(receiptIdx) < currentReceiptIndex"
                        class="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-dashed border-gray-300">
                        <span class="text-xs text-gray-400 tracking-wide">
                            ── Кінець чеку {{ Number(receiptIdx) + 1 }} ──
                        </span>
                        <span class="text-sm text-gray-600">
                            Разом по чеку:
                            <span class="font-bold text-gray-900 ml-1">
                                {{ fmt(receiptTotals[Number(receiptIdx)]) }}
                            </span>
                        </span>
                    </div>
                </template>

                <!-- Empty state -->
                <div v-if="!supplyRows.length" class="py-10 text-center text-gray-400 text-sm">
                    Додайте позиції зі списку передзамовлень або через пошук
                </div>
            </div>

            <!-- Table actions + grand total -->
            <div class="flex items-center justify-between mt-3 mb-8">
                <div class="flex gap-2">
                    <UButton label="Кінець чеку" icon="i-lucide:receipt" variant="subtle" color="neutral"
                        :disabled="currentReceiptEmpty" @click="store.endOfReceipt" />
                    <UButton label="Додати рядок" icon="i-lucide:plus" variant="subtle" color="neutral"
                        @click="store.addEmptyRow" />
                </div>

                <div v-if="supplyRows.length" class="text-sm text-gray-600">
                    Загальна сума:
                    <span class="font-bold text-lg text-gray-900 ml-1 tabular-nums">
                        {{ fmt(total) }}
                    </span>
                </div>
            </div>
        </div>
        <div>
            <div class="my-4">
                <USeparator label="Накладні витрати" type="solid" />
            </div>
            <div class="flex items-start justify-start  gap-2">
                <UFormField label="Доставка Нова пошта">
                    <UInput v-model="deliveryFee" type="number" />
                </UFormField>
                <UFormField label="Додаткові витрати">
                    <UInput v-model="additionalSpendings" type="number" />
                </UFormField>
            </div>

        </div>
        <div class="flex items-end justify-end gap-2">
            <UButton label="Зберегти" variant="subtle" color="primary" :loading="isProcessing" @click="handleSave" />
            <UButton label="Скинути" variant="subtle" color="neutral" @click="store.clearSupply" />
            <UButton @click="downloadCSV" label="Експорт в CSV" variant="subtle" color="neutral">
            </UButton>
        </div>
    </section>

</template>

<script setup>
import placeholder from '@/assets/image_placeholder.png'

const store = useCreateSupplyStore()
const { execute } = useAuthFetchMulti()

const {
    exchangeRate,
    exchangeRateReal,
    counterpartyName,
    deliveryFee,
    additionalSpendings,
    supplyRows,
    currentReceiptIndex,
    receiptGroups,
    receiptTotals,
    total,
    supplyRowsWithCost
} = storeToRefs(store)

// ── Sumup ──────────────────────────────────────────────────────────────────────
// fromPreorder === true always → fetch sumup on load
const { data: sumupRaw, loading: sumupLoading } = useAuthFetchData('/orders/sumup/')
const sumupItems = computed(() => sumupRaw.value?.data || [])

const sumupAccordionItems = computed(() => [{
    label: `Список замовлень (${sumupItems.value.length})`,
    icon: 'i-lucide-list-checks',
    slot: 'sumup-content',
    defaultOpen: true,
}])
const { data: counterpartiesData, loading: cpLoading } = useAuthFetchData('/counterparties/')
const counterparties = computed(() => counterpartiesData.value?.data || [])

const counterpartySearch = ref('')

const filteredCounterparties = computed(() =>
    (counterparties.value ?? []).filter(b => b?.name?.toLowerCase().includes(counterpartySearch.value.toLowerCase())))

// ── Search & pagination ────────────────────────────────────────────────────────
const searchTerm = ref('')
const page = ref(1)
const limit = 25

const onSearch = (value) => {
    searchTerm.value = value
    page.value = 1
}

const searchUrl = computed(() => {
    if (searchTerm.value.length < 3) return null
    const offset = (page.value - 1) * limit
    const base = '/preorders/products/'
    return `${base}?filter_param=${encodeURIComponent(searchTerm.value)}&limit=${limit}&offset=${offset}&order_by=-id&`
})

const { data: searchData, loading: searchLoading, error: searchError } = useAuthFetchData(searchUrl)
const searchResults = computed(() => searchData.value?.data || [])
const totalCount = computed(() => searchData.value?.count ?? 0)

// ── Export ───────────────────────────────────────────────────────────────────────
const isProcessing = ref(false)

const downloadCSV = () => {
    if (!supplyRows.value.length) return alert('Таблиця порожня')
    if (!counterpartyName.value) return alert('Введіть постачальника')

    isProcessing.value = true

    const rows = supplyRowsWithCost.value.map(row => ({
        name: row.name,
        cost_price: row.cost_price,
        sell_price: row.sell_price,
        bulk_price: row.bulk_price,
        quantity: row.quantity
    }))


    isProcessing.value = false
    if (rows.length === 0) return;

    // set headers
    const headerMap = {
        name: 'Название',
        quantity: 'Количество',
        cost_price: 'Закупочная цена',
        // cost_price: 'Цена: Закупочная',
        sell_price: 'Продажа',
        bulk_price: 'ОПТ от 2х шт'
    }

    const headers = Object.keys(headerMap)
        .map(key => headerMap[key])
        .join(',');

    // Create Rows based on the map's keys to ensure order matches
    const csvContent = rows.map(row => {
        return Object.keys(headerMap)
            .map(key => {
                const value = row[key] ?? '';
                // Escape quotes and wrap in quotes to handle commas in names
                return `"${String(value).replace(/"/g, '""')}"`;
            })
            .join(',');
    }).join('\n');

    const fullCsv = `${headers}\n${csvContent}`;

    // Create Blob and Trigger Download
    // Adding BOM (\uFEFF) ensures Excel recognizes UTF-8 encoding immediately
    const blob = new Blob(['\uFEFF' + fullCsv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `supply_data_${Date.now()}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url); // Clean up memory
};

// ── Save ───────────────────────────────────────────────────────────────────────
const handleSave = async () => {
    // if (!supplyRows.value.length) return alert('Таблиця порожня')
    // if (!counterpartyName.value) return alert('Введіть постачальника')

    // isProcessing.value = true
    // try {
    //     const payload = {
    //         name: counterpartyName.value,
    //         exchange_rate: exchangeRate.value,
    //         draft: true,
    //         receipt_totals: receiptTotals.value,
    //         total: total.value,
    //         rows: supplyRows.value.map(row => ({
    //             p_id: row.p_id,
    //             name: row.name,
    //             receipt_index: row.receiptIndex,
    //             sell_price: row.sell_price,
    //             bulk_price: row.bulk_price,
    //             quantity: row.quantity,
    //             discount: row.discount,
    //             regular_price: row.regular_price,
    //             promotion_price: row.promotion_price,
    //             price: row.price,
    //             sum: row.sum,
    //         })),
    //     }
    //     await execute('/supplies/', { method: 'POST', body: payload })
    //     store.clearSupply()
    // } catch (e) {
    //     console.error(e)
    // } finally {
    //     isProcessing.value = false
    // }

    console.log("Posted to backend, but for now it just grandiloquent words")
}

const fmt = (n) => n != null ? Number(n).toFixed(2) : '—'

const currentReceiptEmpty = computed(() =>
    !supplyRows.value.some(r => r.receiptIndex === currentReceiptIndex.value)
)

const hydrated = ref(false)
onMounted(() => { hydrated.value = true })

definePageMeta({ layout: 'admin' })
</script>
