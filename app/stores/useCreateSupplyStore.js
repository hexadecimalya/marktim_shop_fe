import { defineStore } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

export const useCreateSupplyStore = defineStore('createSupply', () => {
  // ─── State ───────────────────────────────────────────────────────────────────
  const exchangeRate = ref(null)       // formula's exchange rate
  const exchangeRateReal = ref(null)   // actual rate
  const counterpartyName = ref(null)
  const supplyRows = ref([])
  const currentReceiptIndex = ref(0)
  const deliveryFee = ref(null)        // Nova Post delivery fee at sending
  const additionalSpendings = ref(null) // transfer fee, etc

  // ─── Helpers ─────────────────────────────────────────────────────────────────
  const uid = () => Math.random().toString(36).slice(2, 9)

  const calculateFloatingRate = (zlPrice) => {
    if (zlPrice < 2.49) return 1.4
    if (zlPrice < 6.99) return 1.3
    if (zlPrice < 8.49) return 1.28
    return 1.27
  }

  // Mutates sell_price & bulk_price on the row.
  // Skips if row came from sumup (prices are locked to what clients ordered at).
  const calculatePrices = (row) => {
    const rate = parseFloat(exchangeRate.value) || 0
    if (!rate) return

    const margin = 1.25 * 1.1
    const reg = parseFloat(row.regular_price) || 0
    const promo = parseFloat(row.promotion_price) || 0

    if (promo > 0) {
      row.sell_price = Math.ceil(promo * rate * margin * calculateFloatingRate(promo))
    } else {
      row.sell_price = reg > 0
        ? Math.ceil(reg * rate * margin * calculateFloatingRate(reg))
        : 0
    }

    row.bulk_price = row.sell_price
      ? Math.ceil(row.sell_price * 0.95)
      : 0
  }

  // Recalculates all derived fields for a single row, then triggers calculatePrices.
  const recalculate = (row) => {
    const qty = parseFloat(row.quantity) || 0
    const disc = parseFloat(row.discount) || 0
    const reg = parseFloat(row.regular_price) || 0

    row.promotion_price = (disc > 0 && qty > 0)
      ? ((reg * qty) - disc) / qty
      : null

    row.price = row.promotion_price !== null
      ? row.promotion_price
      : (reg > 0 ? reg : null)

    if (qty > 0 && reg > 0) {
      row.sum = disc > 0
        ? (reg * qty) - disc
        : reg * qty
    } else {
      row.sum = null
    }

    calculatePrices(row)
  }

  // After exchangeRate changes, recalculate sell/bulk for all non-sumup rows.
  const recalculateAll = () => {
    supplyRows.value.forEach(row => calculatePrices(row))
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
    calculatePrices(row)
    supplyRows.value.push(row)
  }

  const addRowFromSearch = (product) => {
    const row = newRow({
      name: product.name || product.name_ukr,
      nameDisabled: true,
      product_id: product.id,
      regular_price: product.regular_price ?? null,
    })
    calculatePrices(row)
    supplyRows.value.push(row)
  }

  const addEmptyRow = () => {
    supplyRows.value.push(newRow())
  }

  const removeRow = (id) => {
    console.log(supplyRows.value)
    supplyRows.value = supplyRows.value.filter(r => r._id !== id)
    console.log(supplyRows.value)

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

  watchEffect(() => console.log(counterpartyName.value))

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
    }))

    supplyRows.value = rows

    // Set currentReceiptIndex to the max receipt group that exists
    const maxIdx = rows.reduce((max, r) => Math.max(max, r.receiptIndex), 0)
    currentReceiptIndex.value = maxIdx
  }

  const aggregateRows = () => {
    // Group all rows by product_id (guaranteed non-null at this stage)
    const grouped = {}
    supplyRows.value.forEach(row => {
      ; (grouped[row.product_id] ??= []).push(row)
    })

    const result = []

    Object.values(grouped).forEach(rows => {
      // Single row — just unlock prices and pass through
      if (rows.length === 1) {
        const r = rows[0]
        result.push({ ...r, nameDisabled: true })
        return
      }

      // ── Quantity ──────────────────────────────────────────────────────────
      const totalQty = rows.reduce((acc, r) => acc + (parseFloat(r.quantity) || 0), 0)

      // ── Weighted average price (zl) ───────────────────────────────────────
      // Extract raw scalars explicitly to avoid Vue Proxy getter interference
      const priceRows = rows
        .map(r => ({ price: parseFloat(r.price), sum: parseFloat(r.sum), qty: parseFloat(r.quantity) }))
        .filter(r => !isNaN(r.price) && !isNaN(r.sum) && r.price > 0)

      const totalSum = priceRows.reduce((acc, r) => acc + r.sum, 0)
      const qtyOfPriced = priceRows.reduce((acc, r) => acc + r.qty, 0)
      const avgPrice = qtyOfPriced > 0 ? totalSum / qtyOfPriced : null

      const firstRow = rows[0]

      const merged = {
        _id: firstRow._id,
        receiptIndex: 0,
        name: firstRow.name,
        nameDisabled: true,
        product_id: firstRow.product_id,
        quantity: totalQty || null,
        regular_price: avgPrice != null ? Number(avgPrice.toFixed(4)) : parseFloat(firstRow.regular_price) || null,
        discount: null,
        promotion_price: null,
        price: avgPrice != null ? Number(avgPrice.toFixed(3)) : null,
        sum: totalSum > 0 ? Number(totalSum.toFixed(2)) : null,
        sell_price: null,
        bulk_price: null,
      }

      // Let the existing formula derive sell/bulk from the averaged regular_price
      calculatePrices(merged)

      result.push(merged)
    })

    supplyRows.value = result
    currentReceiptIndex.value = 0
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
      totals[Number(idx)] = rows.reduce((acc, r) => acc + (parseFloat(r.sum) || 0), 0)
    })
    return totals
  })

  const total = computed(() =>
    Object.values(receiptTotals.value).reduce((a, b) => a + b, 0)
  )

  const totalInUAH = computed(() => {
    const rate = parseFloat(exchangeRateReal.value) || 0
    return total.value * rate * 1.25
  })

  const monoBankFee = 0.018

  const terminalTotalFee = computed(() => totalInUAH.value * monoBankFee)

  const totalOverheads = computed(() => {
    return (parseFloat(deliveryFee.value) || 0) +
      (parseFloat(terminalTotalFee.value) || 0) +
      (parseFloat(additionalSpendings.value) || 0)
  })

  const overheadRatio = computed(() => {
    if (totalInUAH.value === 0) return 0
    return totalOverheads.value / totalInUAH.value
  })


  const supplyRowsWithCost = computed(() => {
    const rate = parseFloat(exchangeRateReal.value) || 0
    const ratio = overheadRatio.value

    return supplyRows.value.map(row => {
      const basePriceUAH = (parseFloat(row.price) || 0) * rate * 1.25
      const costPrice = basePriceUAH + (basePriceUAH * ratio)

      return {
        ...row,
        cost_price: costPrice > 0 ? Number(costPrice.toFixed(2)) : null
      }
    })
  })

  return {
    // state
    exchangeRate,
    exchangeRateReal,
    counterpartyName,
    supplyRows,
    currentReceiptIndex,
    deliveryFee,
    additionalSpendings,
    // actions
    recalculate,
    recalculateAll,
    calculatePrices,
    addRowFromSumup,
    addRowFromSearch,
    addEmptyRow,
    removeRow,
    endOfReceipt,
    clearSupply,
    loadFromBackend,
    updateRowProduct,
    aggregateRows,
    // computed
    receiptGroups,
    receiptTotals,
    total,
    totalInUAH,
    supplyRowsWithCost,
  }

})
