<template>
    <section class="w-11/12 mx-auto mb-4" v-if="hydrated">
        <h1 class="text-2xl font-extrabold my-4">Нова поставка</h1>
        <div>
            <!-- ── Top controls ─────────────────────────────────────────────────── -->
            <div class="grid grid-cols-5 gap-x-4 mb-4">
                <UFormField label="Курс (zl) за формулою">
                    <UInput v-model="exchangeRate" type="number" placeholder="Напр. 13.3"
                        @change="store.recalculateAll" />
                </UFormField>
                <UFormField label="Постачальник" class="col-span-2">
                    <USelectMenu class="w-full" v-model="counterpartyName" v-model:search-term="counterpartySearch"
                        :items="filteredCounterparties" label-key="name" value-key="id" :loading="cpLoading"
                        placeholder="Оберіть або створіть постачальника"> <template #item="{ item }">
                            <span>{{ item.name }}</span>
                            <UIcon v-if="item.favoured" trailing name="i-heroicons-star-solid"
                                class="text-yellow-400 size-4 ml-1" />
                        </template></USelectMenu>
                </UFormField>
            </div>

            <div>
                <!-- ── Sumup accordion ──────────────────────────────────────────────── -->
                <section v-if="sumupItems.length" class="mt-4 bg-gray-100 p-4 rounded-md">
                    <UAccordion :items="sumupAccordionItems">
                        <template #sumup-content>
                            <div
                                class="grid grid-cols-8 bg-gray-50 border border-gray-200 rounded-t-xl px-2 py-3 text-xs font-semibold tracking-wider text-gray-500 mt-2">
                                <div class="flex justify-center">Дії</div>
                                <div class="col-span-6">Назва</div>
                                <div class="flex justify-end">
                                    <UIcon name="i-lucide:image" />
                                </div>
                            </div>
                            <div
                                class="divide-y divide-gray-100 border-x border-b border-gray-200 rounded-b-lg mb-2 bg-white">
                                <div v-for="item in sumupItems" :key="item.p_id"
                                    class="grid grid-cols-8 items-center p-1 text-sm gap-x-1 hover:bg-blue-50/40 transition-colors">
                                    <div class="flex justify-center">
                                        <UButton icon="i-lucide:plus" color="primary" variant="ghost" size="sm"
                                            @click="store.addRowFromSumup(item)" />
                                    </div>
                                    <div class="col-span-6 font-medium truncate">{{ item.name }}</div>
                                    <div class="flex justify-end">
                                        <img :src="item.file || placeholder" class="w-10 h-10 object-cover rounded" />
                                    </div>
                                </div>
                            </div>
                        </template>
                    </UAccordion>
                </section>
                <AdminLoader v-else-if="sumupLoading" />
                <!-- ── Table Supply ──────────────────────────────────────────────────── -->
                <div class="my-4">
                    <USeparator label="Таблиця поставки" type="solid" />
                </div>

                <!-- Header -->
                <div
                    class="grid grid-cols-14 items-center bg-gray-50 border border-gray-200 rounded-t-xl px-2 py-3 text-xs font-semibold tracking-wider text-gray-500">
                    <div class="flex justify-center">Дії</div>
                    <div class="col-span-4">Назва</div>
                    <div>К-сть</div>
                    <div>Ціна</div>
                    <div>%</div>
                    <div class="text-center">Промо ціна</div>
                    <div class="text-center">Фінальна</div>
                    <div class="text-center">Сума</div>
                    <div>Продаж</div>
                    <div>Опт</div>
                    <div class="text-center">Собівартість</div>
                </div>

                <!-- Rows -->
                <div class="border-x border-b border-gray-200 rounded-b-lg">
                    <template v-for="(rows, receiptIdx) in receiptGroups" :key="receiptIdx">
                        <div v-for="row in rows" :key="row._id"
                            class="grid grid-cols-14 items-center px-2 py-1 text-sm gap-x-1 hover:bg-red-50/20 transition-colors border-b border-gray-100">
                            <!-- Delete -->
                            <div class="flex justify-center">
                                <UButton icon="i-lucide:trash-2" color="error" variant="ghost" size="sm"
                                    @click="store.removeRow(row._id)" />
                            </div>

                            <!-- Name -->
                            <div class="col-span-4">
                                <UInput v-model="row.name" :disabled="row.nameDisabled" size="sm" class="w-full">
                                    <template v-if="!row.nameDisabled && row.name?.trim() && !row.product_id" #trailing>
                                        <UButton icon="i-lucide:check" color="primary" variant="ghost" size="xs"
                                            :loading="isSavingProduct" @click.stop="handleCreateProduct(row)" />
                                    </template>
                                </UInput>
                            </div>

                            <!-- Quantity -->
                            <UInput v-model="row.quantity" type="number" size="sm"
                                @change="store.recalculateRow(row)" />
                            <!-- Regular price -->
                            <UInput v-model="row.regular_price" type="number" size="sm"
                                @change="store.recalculateRow(row)" />
                            <!-- Discount -->
                            <UInput v-model="row.discount" type="number" size="sm"
                                @change="store.recalculateRow(row)" />

                            <!-- promotion_price – display only -->
                            <div class="text-xs text-center text-gray-500 tabular-nums">
                                {{ row.promotion_price != null ? fmt(row.promotion_price) : "—" }}
                            </div>

                            <!-- price – display only -->
                            <div class="text-xs text-center text-gray-500 tabular-nums">
                                {{ row.price != null ? fmt(row.price) : "—" }}
                            </div>

                            <!-- sum – display only -->
                            <div class="text-xs text-center font-semibold tabular-nums bg-mtgreen-100 rounded-lg py-1">
                                {{ row.sum != null ? fmt(row.sum) : "—" }}
                            </div>
                            <!-- Sell price -->
                            <UInput v-model="row.sell_price" size="sm" />

                            <!-- Bulk price -->
                            <UInput v-model="row.bulk_price" size="sm" />
                            <div class="text-center text-xs tabular-nums">{{ fmt(row.cost_price) || "-" }}</div>
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
                            :disabled="currentReceiptNotFinished" @click="store.endOfReceipt" />
                        <UButton label="Створити нову позицію" icon="i-lucide:plus" variant="subtle" color="neutral"
                            @click="store.addEmptyRow" />
                        <UButton icon="i-lucide:sigma" label="Виконати агрегацію" variant="subtle"
                            :disabled="!hasValidRows" color="info" @click="store.aggregateRows" />
                    </div>

                    <div v-if="supplyRows.length" class="text-sm text-gray-600">
                        Загальна сума:
                        <span class="font-bold text-lg text-gray-900 ml-1 tabular-nums">
                            {{ fmt(total) }}
                        </span>
                    </div>
                </div>
                <!-- ── Search ──────────────────────────────────────────────────────── -->
                <div class="my-4">
                    <USeparator label="Пошук у базі" type="solid" />
                </div>
                <SearchBarAdmin @update:search="onSearch" />
                <div>
                    <section v-if="searchTerm.length >= 3 && !searchLoading && searchResults.length != 0">
                        <div
                            class="grid grid-cols-8 items-center bg-gray-50 border border-gray-200 rounded-t-xl px-4 py-3 text-xs font-semibold tracking-wider text-gray-500 mt-2">
                            <div class="flex justify-center">Дії</div>
                            <div class="col-span-6">Назва</div>
                            <div class="flex justify-end">
                                <UIcon name="i-lucide:image" />
                            </div>
                        </div>
                        <div class="divide-y divide-gray-100 border-x border-b border-gray-200 rounded-b-lg">
                            <div v-for="product in searchResults" :key="product.id"
                                class="grid grid-cols-8 items-center p-1 text-sm gap-x-1 hover:bg-gray-50 transition-colors">
                                <div class="flex justify-center">
                                    <UButton icon="i-lucide:plus" color="primary" variant="ghost" size="sm"
                                        @click.stop="store.addRowFromSearch(product)" />
                                </div>
                                <div class="col-span-6 font-medium truncate">
                                    {{ product.name || product.name_ukr }}
                                </div>
                                <div class="flex justify-end">
                                    <img :src="product?.files?.[0]?.link || placeholder" :class="{
                                        'hover:scale-350 hover:inset-10 duration-200 ease-out':
                                            product?.files?.[0]?.link,
                                    }" class="w-10 h-10 object-cover rounded shadow-sm" />
                                </div>
                            </div>
                        </div>
                        <div class="my-6 flex justify-center">
                            <UPagination v-model:page="page" :total="totalCount" :items-per-page="limit"
                                :show-controls="false" active-color="neutral" active-variant="subtle" />
                        </div>
                    </section>
                    <AdminLoader v-else-if="searchLoading && searchTerm.length >= 3" />
                    <NoItemsFoundAdmin v-else-if="!searchLoading && totalCount === 0" />
                </div>
                <!-- ── Overheads ───────────────────────────────────────────────────── -->
                <div>
                    <div class="my-4">
                        <USeparator label="Накладні витрати" type="solid" />
                    </div>
                    <div class="flex items-start justify-start gap-2">
                        <UFormField label="Курс (zl) реальний">
                            <UInput v-model="exchangeRateReal" type="number" placeholder="Напр. 13.3" @change="store.recalculateAll()" />
                        </UFormField>
                        <UFormField label="Доставка Нова пошта">
                            <UInput v-model="deliveryFee" type="number" @change="store.recalculateAll()" />
                        </UFormField>
                        <UFormField label="Додаткові витрати">
                            <UInput v-model="additionalSpendings" type="number" @change="store.recalculateAll()" />
                        </UFormField>
      
                    </div>
                </div>
                <!-- ── Actions ────────────────────────────────────────────────────── -->
                <div class="my-4">
                    <USeparator label="Дії" type="solid" />
                </div>
                <div class=" my-4 flex justify-end bg-gray-100 p-4 rounded-md">
                    <!-- <div class="flex items-center justify-end gap-2">
                        <UCheckbox v-model="isFinished" label="Завершити поставку" indicator="end" variant="card"
                            class="border border-green-500" default-value :disabled="!isReadyToBeFinished"
                            @change="validateFinish" />
                        <UButton v-if="isFinished" class="py-4" icon="i-lucide:sigma" label="Виконати агрегацію позицій"
                            variant="subtle" color="neutral" @click="store.aggregateRows" />
                    </div> -->
                    <div class="flex items-end justify-end gap-2">
                        <UButton :label="!isFinished ? 'Зберегти чернетку' : 'Зберегти'" color="primary"
                            icon="i-lucide:save" :disabled="!hasValidRows" :loading="isSavingSupply"
                            @click="handleSave" />
                        <UButton label="Скинути" variant="subtle" color="neutral" @click="store.clearSupply" />
                        <UButton @click="downloadCSV" :disabled="!isReadyToBeFinished" label="Експорт в CSV"
                            icon="i-lucide:download" variant="subtle" color="neutral">
                        </UButton>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import placeholder from "@/assets/image_placeholder.png";

const toast = useToast()

const store = useCreatePlnSupplyStore();
const { execute } = useAuthFetchMulti();

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
    totalInUAH,
    supplyRowsWithCost,
} = storeToRefs(store);

// ── Sumup ──────────────────────────────────────────────────────────────────────
// fromPreorder === true always → fetch sumup on load
const { data: sumupRaw, loading: sumupLoading } = useAuthFetchData("/orders/sumup/");
const sumupItems = computed(() => sumupRaw.value?.data || []);

const sumupAccordionItems = computed(() => [
    {
        label: `Список замовлень (${sumupItems.value.length})`,
        icon: "i-lucide-list-checks",
        slot: "sumup-content",
        defaultOpen: true,
    },
]);
const { data: counterpartiesData, loading: cpLoading } = useAuthFetchData(
    "/counterparties/"
);
const counterparties = computed(() => counterpartiesData.value?.data || []);

const counterpartySearch = ref("");

const filteredCounterparties = computed(() =>
    (counterparties.value ?? [])
        .filter(b => b?.name?.toLowerCase().includes(counterpartySearch.value.toLowerCase()))
        .sort((a, b) => b.favoured - a.favoured)
)


// ── Search & pagination ────────────────────────────────────────────────────────
const searchTerm = ref("");
const page = ref(1);
const limit = 20;

const onSearch = (value) => {
    searchTerm.value = value;
    page.value = 1;
};

const searchUrl = computed(() => {
    const offset = (page.value - 1) * limit;
    const base = "/products2/";
    return searchTerm.value.length >= 3
        ? `${base}?filter_param=${encodeURIComponent(
            searchTerm.value
        )}&limit=${limit}&offset=${offset}&order_by=-id&`
        : `${base}?order_by=-id&limit=${limit}&offset=${offset}`;
});

const { data: searchData, loading: searchLoading, error: searchError } = useAuthFetchData(
    searchUrl
);

const searchResults = computed(() => searchData.value?.data || []);
const totalCount = computed(() => searchData.value?.count ?? 0);

// ── Export ───────────────────────────────────────────────────────────────────────
const isProcessing = ref(false);

const downloadCSV = () => {
    if (!supplyRows.value.length) return alert("Таблиця порожня");
    if (!counterpartyName.value) return alert("Введіть постачальника");

    isProcessing.value = true;


    const rows = supplyRowsWithCost.value.map((row) => {
        const isFractional = Number(row.quantity) % 1 !== 0;

        return {
            name: row.name,
            cost_price: Number(row.cost_price).toFixed(2),
            sell_price: row.sell_price,
            bulk_price: row.bulk_price || null,
            quantity: row.quantity,
            unit: isFractional ? "кг" : "шт",
            loose: isFractional ? "да" : "нет",
        }
    });

    isProcessing.value = false;
    if (rows.length === 0) return;

    const headersConfig = [
        { key: "name", label: "Наименование" },
        { key: "quantity", label: "Количество" },
        { key: "cost_price", label: "Закупочная цена" },
        { key: "cost_price", label: "Цена: Закупочная" },
        { key: "bulk_price", label: "ОПТ от 2х шт" },
        { key: "sell_price", label: "Продажа" },
        { key: "unit", label: "Единица измерения" },
        { key: "loose", label: "Весовой товар" },
    ];

    const headers = headersConfig.map((item) => item.label).join(";");

    const csvContent = rows
        .map((row) => {
            return headersConfig
                .map((item) => {
                    const value = row[item.key] ?? "";
                    return `"${String(value).replace(/"/g, '""')}"`;
                })
                .join(";");
        })
        .join("\n");


    const fullCsv = `${headers}\n${csvContent}`;

    // Create Blob and Trigger Download
    // Adding BOM (\uFEFF) ensures Excel recognizes UTF-8 encoding immediately
    const blob = new Blob(["\uFEFF" + fullCsv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `supply_data_${Date.now()}.csv`);
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

const isSavingProduct = ref(false);

const handleCreateProduct = async (row) => {
    if (!row.name?.trim()) return          // guard before the flag
    isSavingProduct.value = true
    try {
        const res = await execute("/products/", {
            method: "POST",
            body: { name: row.name.trim() },
        })
        store.updateRowProduct(row._id, res.id ?? res.data?.id)
    } catch (e) {
        console.error('Failed to create product', e?.response?._data || e)
    } finally {
        isSavingProduct.value = false
    }
}

const hasValidRows = computed(() => supplyRows.value.length > 0 && supplyRows.value.every(row => {
    return (
        row.product_id &&
        row.sell_price != null &&
        row.price != null &&
        row.quantity != null &&
        row.quantity > 0
    );
}));

const isReadyToBeFinished = computed(() => {

    const hasHeaderFields =
        !!exchangeRateReal.value &&
        deliveryFee.value !== null &&
        !!counterpartyName.value;
    //console.log(hasHeaderFields)
    const hasValidRows = supplyRows.value.length > 0 && supplyRows.value.every(row => {
        return (
            row.product_id &&           // Наявність ID (товар створено або знайдено)
            row.sell_price != null &&   // Ціна продажу
            row.price != null &&        // Ціна закупівлі (zl)
            row.quantity != null &&     // Кількість
            row.quantity > 0
        );
    });

    return hasHeaderFields && hasValidRows;
});

const isFinished = ref(false)

const validateFinish = () => {
    if (isFinished.value) {
        toast.add({
            title: 'Поставка готова до збереження',
            description: 'Всі обов’язкові поля заповнено вірно.',
            icon: 'i-lucide:check',
            color: 'success'
        })
    } else {
        toast.add({
            title: 'Статус змінено',
            description: 'Поставку переведено у статус чернетки.',
            icon: 'i-lucide:info',
            color: 'neutral'
        })
    }
}


// ── Save ───────────────────────────────────────────────────────────────────────
//const isDraft = ref(true);
const isSavingSupply = ref(false);

const handleSave = async () => {
    if (!supplyRows.value.length) return alert("Таблиця порожня");
    if (!counterpartyName.value) return alert("Введіть постачальника");

    isSavingSupply.value = true;
    try {
        const payload = {
            supplier_id: counterpartyName.value,
            type: "pln",
            exchange_rate_f: exchangeRate.value,
            exchange_rate_real: exchangeRateReal.value || 0,
            delivery_fee: deliveryFee.value || 0,
            additional_spendings: additionalSpendings.value || 0,
            draft: true,
            receipt_totals: receiptTotals.value,
            total: total.value,
            total_in_uah: totalInUAH.value,
            supply_products: supplyRowsWithCost.value.map((row) => ({
                product: row.product_id,  // product_id -> product
                receipt_index: row.receiptIndex,
                sell_price: row.sell_price,
                bulk_price: row.bulk_price,
                quantity: row.quantity,
                cost_price: row.cost_price || 0,
                discount: row.discount || 0,
                regular_price: row.regular_price,
                promotion_price: row.promotion_price || 0,
                price: row.price,
                sum: row.sum,
            })),
        };
        console.log("PAYLOAD:", payload)
        await execute('/supplies/type/pln/', { method: 'POST', body: payload })
        toast.add({
            title: 'Поставка збережена',
            description: 'Вона буде доступною в списку',
            icon: 'i-lucide:check',
            color: 'success'
        })
        store.clearSupply();
        await navigateTo('/administrative/supplies/list')
    } catch (e) {
        console.error(e);
        toast.add({
            title: 'Помилка в збереженні',
            description: 'Помолися Говінді за душу грішного розробника.',
            icon: 'i-lucide:ban',
            color: 'error'
        })
    } finally {
        isSavingSupply.value = false;
    }
};

const fmt = (n) => (n != null ? Number(n).toFixed(2) : "—");


const currentReceiptNotFinished = computed(() => {
    const rowsForReceipt = supplyRows.value.filter(
        r => r.receiptIndex === currentReceiptIndex.value
    );

    const emptyReceipt = rowsForReceipt.length === 0;

    const hasValidFields = rowsForReceipt.some(row => {
        return (
            row.price !== null &&
            row.quantity !== null &&
            row.quantity >= 0
        );
    });

    return emptyReceipt || !hasValidFields;
});



const hydrated = ref(false);
onMounted(() => {
    hydrated.value = true;
});

definePageMeta({ layout: "admin" });
useHead({ title: 'Нова поставка PLN' })
</script>
