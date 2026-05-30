<template>
    <section class="w-11/12 mx-auto mb-4" v-if="hydrated">
        <h1 class="text-2xl font-extrabold my-4">Нова поставка</h1>
        <div>
            <!-- ── Top controls ─────────────────────────────────────────────────── -->
            <div class="grid grid-cols-5 gap-x-4 mb-4 ">
                <UFormField label="Націнка">
                    <UInput v-model="margin" placeholder="Напр. 1.4" @change="store.recalculateAll" />
                </UFormField>
                <UFormField label="Постачальник" class="col-span-2">
                    <USelectMenu class="w-full" v-model="counterpartyName" v-model:search-term="counterpartySearch"
                        :items="filteredCounterparties" label-key="name" value-key="id" :loading="cpLoading"
                        placeholder="Оберіть або створіть постачальника">
                        <template #item="{ item }">
                            <span>{{ item.name }}</span>
                            <UIcon v-if="item.favoured" trailing name="i-heroicons-star-solid"
                                class="text-yellow-400 size-4 ml-1" />
                        </template>
                    </USelectMenu>
                </UFormField>
            </div>

            <div>
                <!-- ── Sumup accordion  ──────────────────────────────────────────────── -->
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
                    class="grid grid-cols-10 items-center bg-gray-50 border border-gray-200 rounded-t-xl px-2 py-3 text-xs font-semibold tracking-wider text-gray-500">
                    <div class="flex justify-center">Дії</div>
                    <div class="col-span-4">Назва</div>
                    <div>К-сть</div>
                    <div>Ціна</div>
                    <div class="text-center">Сума</div>
                    <div>Продаж</div>
                    <div class="text-center" v-if="isReadyToBeFinished">Собівартість</div>
                </div>

                <!-- Rows -->
                <div class="border-x border-b border-gray-200 rounded-b-lg">
                    <div v-for="row in supplyRows" :key="row._id"
                        class="grid grid-cols-10 items-center px-2 py-1 text-sm gap-x-1 hover:bg-red-50/20 transition-colors border-b border-gray-100">
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
                        <UInput v-model="row.quantity" type="number" size="sm" @change="store.recalculateAll" />

                        <!-- Regular price -->
                        <UInput v-model="row.regular_price" type="number" size="sm" @change="store.recalculateAll" />

                        <!-- sum – display only -->
                        <div class="text-xs text-center font-semibold tabular-nums">
                            {{ row.sum != null ? fmt(row.sum) : "—" }}
                        </div>

                        <!-- Sell price -->
                        <UInput v-model="row.sell_price" size="sm" />

                        <div class="text-center">{{ fmt(row.cost_price) || "-" }}</div>
                    </div>

                    <!-- Empty state -->
                    <div v-if="!supplyRows.length" class="py-10 text-center text-gray-400 text-sm">
                        Додайте позиції зі списку передзамовлень або через пошук
                    </div>
                </div>

                <!-- Table actions + grand total -->
                <div class="flex items-center justify-between mt-3 mb-8">
                    <div class="flex gap-2">
                        <UButton label="Створити нову позицію" icon="i-lucide:plus" variant="subtle" color="neutral"
                            @click="store.addEmptyRow" />
                    </div>

                    <div v-if="supplyRows.length" class="text-sm text-gray-600">
                        Загальна сума:
                        <span class="font-bold text-lg text-gray-900 ml-1 tabular-nums">
                            {{ fmt(total) }}
                        </span>
                    </div>
                </div>
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

                <div>
                    <div class="my-4">
                        <USeparator label="Накладні витрати" type="solid" />
                    </div>
                    <div class="flex items-start justify-start gap-2">
                        <UFormField label="Доставка Нова пошта">
                            <UInput v-model="deliveryFee" min="0" type="number" @change="store.recalculateAll" />
                        </UFormField>
                        <UFormField label="Додаткові витрати">
                            <UInput v-model="additionalSpendings" min="0" type="number"
                                @change="store.recalculateAll" />
                        </UFormField>
                    </div>
                </div>
                <div class="my-4">
                    <USeparator label="Дії" type="solid" />
                </div>
                <div class=" my-4 flex justify-between bg-gray-100 p-4 rounded-md">
                    <div class="flex items-center justify-end gap-2">
                        <UCheckbox v-model="isFinished" label="Завершити поставку" indicator="end" variant="card"
                            class="border border-green-500" default-value :disabled="!isReadyToBeFinished"
                            @change="validateFinish" />
                    </div>
                    <div class="flex items-end justify-end gap-2">
                        <UButton :label="!isFinished ? 'Зберегти чернетку' : 'Зберегти'" color="primary"
                            icon="i-lucide:save" :loading="isSavingSupply" @click="handleSave" />
                        <UButton label="Скинути" variant="subtle" color="neutral" @click="store.clearSupply" />
                        <UButton @click="downloadCSV" label="Експорт в CSV" icon="i-lucide:download" variant="subtle"
                            :disabled="!isReadyToBeFinished" color="neutral">
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

const store = useCreateUahSupplyStore();
const { execute } = useAuthFetchMulti();

const {
    counterpartyName,
    margin,
    deliveryFee,
    additionalSpendings,
    supplyRows,
    total,
} = storeToRefs(store);

// ── Sumup ──────────────────────────────────────────────────────────────────────
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

const { data: counterpartiesData, loading: cpLoading } = useAuthFetchData("/counterparties/");
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
    const base = "/preorders/products/";
    return searchTerm.value.length >= 3
        ? `${base}?filter_param=${encodeURIComponent(
            searchTerm.value
        )}&limit=${limit}&offset=${offset}&order_by=-id&`
        : `${base}?order_by=-id&limit=${limit}&offset=${offset}`;
});

const { data: searchData, loading: searchLoading, error: searchError } = useAuthFetchData(searchUrl);

const searchResults = computed(() => searchData.value?.data || []);
const totalCount = computed(() => searchData.value?.count ?? 0);

// ── Export ───────────────────────────────────────────────────────────────────────
const isProcessing = ref(false);

const downloadCSV = () => {
    if (!supplyRows.value.length) return alert("Таблиця порожня");
    if (!counterpartyName.value) return alert("Введіть постачальника");

    isProcessing.value = true;

    const rows = supplyRows.value.map((row) => {
        const isFractional = Number(row.quantity) % 1 !== 0;

        return {
            name: row.name,
            cost_price: row.cost_price,
            sell_price: row.sell_price,
            quantity: row.quantity,
            // Conditionally assign values based on the fraction check
            unit: isFractional ? "кг" : "шт",
            loose: isFractional ? "да" : "нет",
        };
    });

    isProcessing.value = false;
    if (rows.length === 0) return;


    const headersConfig = [
        { key: "name", label: "Наименование" },
        { key: "quantity", label: "Количество" },
        { key: "cost_price", label: "Закупочная цена" },
        { key: "cost_price", label: "Цена: Закупочная" },
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
}

const isSavingProduct = ref(false);

const handleCreateProduct = async (row) => {
    if (!row.name?.trim()) return
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

const isReadyToBeFinished = computed(() => {
    const hasFields = deliveryFee.value && !!counterpartyName.value && margin.value;
    const hasValidRows = supplyRows.value.length > 0 && supplyRows.value.every(row => {
        return (
            row.product_id &&
            row.sell_price != null &&
            row.regular_price != null &&
            row.quantity != null &&
            row.quantity > 0
        );
    });

    return hasFields && hasValidRows;
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
const isSavingSupply = ref(false);

const handleSave = async () => {
    if (!supplyRows.value.length) return alert("Таблиця порожня");
    if (!counterpartyName.value) return alert("Введіть постачальника");

    isSavingSupply.value = true;
    try {
        const payload = {
            supplier_id: counterpartyName.value,
            delivery_fee: deliveryFee.value || 0,
            draft: true,
            margin: margin.value,
            additional_spendings: additionalSpendings.value || 0,
            total: total.value,
            supply_products: supplyRows.value.map((row) => ({
                product: row.product_id,
                sell_price: row.sell_price,
                quantity: row.quantity,
                cost_price: row.cost_price.toFixed(2) || 0,
                regular_price: row.regular_price || 0,
                sum: row.sum,
            })),
        };
        console.log(payload)
        await execute('/supplies/type/uah/', { method: 'POST', body: payload })
        toast.add({
            title: 'Поставка збережена',
            description: 'Вона буде доступною в списку',
            icon: 'i-lucide:check',
            color: 'success'
        })
        store.clearSupply();
        await navigateTo('/admin2/supplies/list')
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

const hydrated = ref(false);
onMounted(() => {
    hydrated.value = true;
});

definePageMeta({ layout: "admin" });
</script>