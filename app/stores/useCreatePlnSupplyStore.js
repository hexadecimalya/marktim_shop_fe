import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCreatePlnSupplyStore = defineStore('createPlnSupply', () => {
  // ─── State ───────────────────────────────────────────────────────────────────
  const exchangeRate = ref('')       // formula's exchange rate
  const exchangeRateReal = ref('')   // actual rate
  const counterpartyName = ref(null)
  const supplyRows = ref([])
  const currentReceiptIndex = ref(0)
  const deliveryFee = ref('')        // Nova Post delivery fee at sending
  const additionalSpendings = ref('') // transfer fee, etc

  // ─── Number Helpers (Store Internal) ─────────────────────────────────────────
  // Extracts a safe float, guaranteeing we never do math on NaN or undefined
  const toNum = (val) => parseFloat(val) || 0

  // Rounds any value to 2 decimal places (or custom) and returns a strict Number
  const round = (val, decimals = 2) => Number(toNum(val).toFixed(decimals))

  // ─── Helpers ─────────────────────────────────────────────────────────────────
  const uid = () => Math.random().toString(36).slice(2, 9)

  const calculateFloatingRate = (zlPrice) => {
    if (zlPrice < 2.49) return 1.4
    if (zlPrice < 6.99) return 1.3
    if (zlPrice < 8.49) return 1.28
    return 1.27
  }

  const recalculateRow = (row) => {
    const qty = toNum(row.quantity)
    const disc = toNum(row.discount)
    const reg = toNum(row.regular_price)

    // row-level base values
    row.promotion_price = (disc > 0 && qty > 0)
      ? round(((reg * qty) - disc) / qty)
      : null

    row.price = row.promotion_price !== null
      ? row.promotion_price
      : (reg > 0 ? reg : null)

    row.sum = (qty > 0 && reg > 0)
      ? round(disc > 0 ? (reg * qty) - disc : reg * qty)
      : null

    // sell/bulk
    const rate = toNum(exchangeRate.value)
    const priceForSale = toNum(row.price)
    const ratio = overheadRatio.value
    const rateReal = toNum(exchangeRateReal.value)
    const baseUAH = toNum(row.price) * rateReal * 1.25

    if (rate > 0 && priceForSale > 0) {
      const markupMultiplier = 1.25 * 1.1
      const floatRate = calculateFloatingRate(priceForSale)

      row.sell_price = Math.ceil(priceForSale * rate * markupMultiplier * floatRate)
      row.bulk_price = Math.ceil(row.sell_price * 0.95)
      row.cost_price = baseUAH > 0 ? round(baseUAH * (1 + ratio)) : null

    } else {
      row.sell_price = null
      row.bulk_price = null
      row.cost_price = null

    }
  }

  const recalculateAll = () => {
    supplyRows.value.forEach(row => recalculateRow(row))
  }

  // ─── Row factory ─────────────────────────────────────────────────────────────
  const newRow = (overrides = {}) => ({
    _id: uid(),
    receiptIndex: currentReceiptIndex.value,
    name: '',
    nameDisabled: false,
    product_id: null,
    sell_price: null,
    bulk_price: null,
    quantity: null,
    cost_price: null,
    discount: null,
    regular_price: null,
    promotion_price: null,
    price: null,
    sum: null,
    ...overrides,
  })

  // ─── Actions ─────────────────────────────────────────────────────────────────

  const addRowFromSumup = (item) => {
    const row = newRow({
      name: item.name,
      nameDisabled: true,
      product_id: item.p_id,
    })
    recalculateRow(row)
    supplyRows.value.push(row)
  }

  const addRowFromSearch = (product) => {
    const row = newRow({
      name: product.name || product.name_ukr,
      nameDisabled: true,
      product_id: product.id,
      regular_price: product.regular_price ?? null,
    })
    recalculateRow(row)
    supplyRows.value.push(row)
  }

  const addEmptyRow = () => {
    supplyRows.value.push(newRow())
  }

  const removeRow = (id) => {
    supplyRows.value = supplyRows.value.filter(r => r._id !== id)
  }

  const updateRowProduct = (rowId, productId) => {
    const row = supplyRows.value.find(r => r._id === rowId)
    if (!row || !productId) return
    row.product_id = productId
    row.nameDisabled = true
  }

  const endOfReceipt = () => {
    const hasRows = supplyRows.value.some(r => r.receiptIndex === currentReceiptIndex.value)
    if (!hasRows) return
    currentReceiptIndex.value++
  }

  const clearSupply = () => {
    supplyRows.value = []
    currentReceiptIndex.value = 0
    counterpartyName.value = null
    exchangeRate.value = null
    exchangeRateReal.value = null
    deliveryFee.value = null
    additionalSpendings.value = null
  }


  const loadFromBackend = (supply) => {
    clearSupply()

    exchangeRate.value = supply.exchange_rate_f ?? null
    exchangeRateReal.value = supply.exchange_rate_real ?? null
    counterpartyName.value = supply.supplier?.id ?? null
    deliveryFee.value = supply.delivery_fee ?? null
    additionalSpendings.value = supply.additional_spendings ?? null

    // Restore rows
    const rows = (supply.supply_products ?? []).map(p => ({
      _id: p._id || uid(),
      receiptIndex: p.receipt_index ?? 0,
      name: p.product_detail.name ?? '',
      nameDisabled: !!p.product_detail.id,
      product_id: p.product_detail.id ?? null,
      sell_price: p.sell_price ?? null,
      bulk_price: p.bulk_price ?? null,
      quantity: p.quantity ?? null,
      discount: p.discount ?? null,
      regular_price: p.regular_price ?? null,
      promotion_price: p.promotion_price ?? null,
      price: p.price ?? null,
      sum: p.sum ?? null,
      cost_price: p.cost_price ?? null
    }))

    supplyRows.value = rows
    recalculateAll()

    // Set currentReceiptIndex to the max receipt group that exists
    const maxIdx = rows.reduce((max, r) => Math.max(max, r.receiptIndex), 0)
    currentReceiptIndex.value = maxIdx
  }

  const aggregateRows = () => {
    const grouped = {}
    supplyRows.value.forEach(row => {
      ; (grouped[row.product_id] ??= []).push(row)
    })

    const result = []

    Object.values(grouped).forEach(rows => {
      if (rows.length === 1) {
        result.push({ ...rows[0], nameDisabled: true })
        return
      }

      // ── Quantity ──────────────────────────────────────────────────────────
      const totalQty = rows.reduce((acc, r) => acc + toNum(r.quantity), 0)

      // ── Weighted average price (zl) ───────────────────────────────────────
      const priceRows = rows
        .map(r => ({ price: toNum(r.price), sum: toNum(r.sum), qty: toNum(r.quantity) }))
        .filter(r => r.price > 0 && r.sum > 0)

      const totalSum = priceRows.reduce((acc, r) => acc + r.sum, 0)
      const qtyOfPriced = priceRows.reduce((acc, r) => acc + r.qty, 0)
      const avgPrice = qtyOfPriced > 0 ? (totalSum / qtyOfPriced) : null

      const firstRow = rows[0]

      const merged = {
        _id: firstRow._id,
        receiptIndex: 0,
        name: firstRow.name,
        nameDisabled: true,
        product_id: firstRow.product_id,
        quantity: totalQty || null,
        regular_price: avgPrice !== null ? round(avgPrice, 4) : toNum(firstRow.regular_price) || null,
        discount: null,
        promotion_price: null,
        price: avgPrice !== null ? round(avgPrice, 3) : null,
        sum: totalSum > 0 ? round(totalSum) : null,
        sell_price: null,
        bulk_price: null,
      }

      //recalculateRow(merged)
      result.push(merged)
      //recalculateRow(merged)
    })

    supplyRows.value = result
    currentReceiptIndex.value = 0
    recalculateAll()
  }

  // ─── Computed ────────────────────────────────────────────────────────────────

  const receiptGroups = computed(() => {
    const groups = {}
    supplyRows.value.forEach(row => {
      if (!groups[row.receiptIndex]) groups[row.receiptIndex] = []
      groups[row.receiptIndex].push(row)
    })
    return groups
  })

  const receiptTotals = computed(() => {
    const totals = {}
    Object.entries(receiptGroups.value).forEach(([idx, rows]) => {
      totals[Number(idx)] = round(rows.reduce((acc, r) => acc + toNum(r.sum), 0))
    })
    return totals
  })

  const total = computed(() =>
    round(Object.values(receiptTotals.value).reduce((a, b) => a + b, 0))
  )

  const totalInUAH = computed(() => round(total.value * toNum(exchangeRateReal.value) * 1.25))
  const monoBankFee = 0.018

  const terminalTotalFee = computed(() => round(totalInUAH.value * monoBankFee))

  const totalOverheads = computed(() =>
    round(toNum(deliveryFee.value) + terminalTotalFee.value + toNum(additionalSpendings.value))
  )

  const overheadRatio = computed(() => {
    return totalInUAH.value > 0 ? totalOverheads.value / totalInUAH.value : 0
  })

  return {
    exchangeRate,
    exchangeRateReal,
    counterpartyName,
    supplyRows,
    currentReceiptIndex,
    deliveryFee,
    additionalSpendings,
    recalculateAll,
    addRowFromSumup,
    addRowFromSearch,
    addEmptyRow,
    removeRow,
    endOfReceipt,
    clearSupply,
    loadFromBackend,
    updateRowProduct,
    aggregateRows,
    recalculateRow,
    receiptGroups,
    receiptTotals,
    total,
    totalInUAH,
  }
})