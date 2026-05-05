import { defineStore } from 'pinia'

export const useCreateSupplyStore = defineStore('createSupply', () => {
  // ─── State ───────────────────────────────────────────────────────────────────
  const exchangeRate = ref(null) // formula's exchange rate
  const exchangeRateReal = ref(null) // actual rate
  const counterpartyName = ref(null)
  const supplyRows = ref([])
  const currentReceiptIndex = ref(0)
  const deliveryFee = ref(null) // Nova Post delivery fee at sending
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
    if (row.fromSumup) return
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
  // Called whenever quantity / discount / regular_price changes.
  const recalculate = (row) => {
    const qty = parseFloat(row.quantity) || 0
    const disc = parseFloat(row.discount) || 0
    const reg = parseFloat(row.regular_price) || 0

    // promotion_price – per-unit discounted price
    row.promotion_price = (disc > 0 && qty > 0)
      ? ((reg * qty) - disc) / qty
      : null

    // price – effective unit price shown on the receipt
    row.price = row.promotion_price !== null
      ? row.promotion_price
      : (reg > 0 ? reg : null)



    // prices for internal accounting


    // sum – total amount for this line
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
    supplyRows.value.forEach(row => {
      if (!row.fromSumup) calculatePrices(row)
    })
  }

  // ─── Row factory ─────────────────────────────────────────────────────────────
  const newRow = (overrides = {}) => ({
    _id: uid(),
    receiptIndex: currentReceiptIndex.value,
    name: '',
    nameDisabled: false,   // true when added from sumup or search
    fromSumup: false,   // sell_price / bulk_price locked when true
    p_id: null,
    sell_price: null,
    bulk_price: null,
    quantity: null,
    discount: null,
    regular_price: null,
    promotion_price: null,  // derived
    price: null,   // derived
    sum: null,   // derived
    ...overrides,
  })

  // ─── Actions ─────────────────────────────────────────────────────────────────

  // From Sumup table: name + sell/bulk prices are locked
  const addRowFromSumup = (item) => {
    supplyRows.value.push(newRow({
      name: item.name,
      nameDisabled: true,
      fromSumup: true,
      p_id: item.p_id,
      sell_price: item.sell_price,
      bulk_price: item.bulk_price,
    }))
  }

  // From Search: name is locked, prices calculated from DB data via calculatePrices
  const addRowFromSearch = (product) => {
    const row = newRow({
      name: product.name || product.name_ukr,
      nameDisabled: true,
      p_id: product.id,
      regular_price: product.regular_price ?? null,
    })
    calculatePrices(row)
    supplyRows.value.push(row)
  }

  // Manual entry: everything editable
  const addEmptyRow = () => {
    supplyRows.value.push(newRow())
  }

  const removeRow = (id) => {
    supplyRows.value = supplyRows.value.filter(r => r._id !== id)
  }

  // Mark current receipt as done → new rows go to next receipt group
  const endOfReceipt = () => {
    const hasRows = supplyRows.value.some(r => r.receiptIndex === currentReceiptIndex.value)
    if (!hasRows) return
    currentReceiptIndex.value++
  }

  const clearSupply = () => {
    supplyRows.value = []
    currentReceiptIndex.value = 0
    counterpartyName.value = ''
    exchangeRate.value = null
    exchangeRateReal = null
  }

  // ─── Computed ────────────────────────────────────────────────────────────────

  // Rows keyed by receiptIndex, preserving insertion order within each group
  const receiptGroups = computed(() => {
    const groups = {}
    supplyRows.value.forEach(row => {
      if (!groups[row.receiptIndex]) groups[row.receiptIndex] = []
      groups[row.receiptIndex].push(row)
    })
    return groups
  })

  // Sum of `sum` per receipt group
  const receiptTotals = computed(() => {
    const totals = {}
    Object.entries(receiptGroups.value).forEach(([idx, rows]) => {
      totals[Number(idx)] = rows.reduce((acc, r) => acc + (parseFloat(r.sum) || 0), 0)
    })
    return totals
  })

  // Grand total across all receipts
  const total = computed(() =>
    Object.values(receiptTotals.value).reduce((a, b) => a + b, 0)
  )

  // Total cost of products converted to UAH
  const totalInUAH = computed(() => {
    const rate = parseFloat(exchangeRateReal.value) || 0
    return total.value * rate * 1.25
  })

  // MonoBank fee
  const monoBankFee = 0.018

  const terminalTotalFee = computed(() => totalInUAH.value * monoBankFee)

  const totalOverheads = computed(() => {
    return (parseFloat(deliveryFee.value) || 0) + 
           (parseFloat(terminalTotalFee.value) || 0) + 
           (parseFloat(additionalSpendings.value) || 0)
  })

  // 5. The overhead ratio (how much extra UAH per 1 UAH of product)
  const overheadRatio = computed(() => {
    if (totalInUAH.value === 0) return 0
    return totalOverheads.value / totalInUAH.value
  })

watchEffect(() => console.log("коефіцієнт:", overheadRatio.value, "Сума грн:", totalInUAH.value, "Terminal:", terminalTotalFee.value, "Counterparty:", counterpartyName.value ))

const supplyRowsWithCost = computed(() => {
    const rate = parseFloat(exchangeRateReal.value) || 0
    const ratio = overheadRatio.value

    return supplyRows.value.map(row => {
      const basePriceUAH = (parseFloat(row.price) || 0) * rate * 1.25
      
      // cost_price = (Base Price) + (Base Price * Overhead Ratio)
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
    // computed
    receiptGroups,
    receiptTotals,
    total,
    totalInUAH,
    supplyRowsWithCost
  }
})
