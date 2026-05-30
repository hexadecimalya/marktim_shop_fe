import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCreateEurSupplyStore = defineStore('createEurSupply', () => {
  // ─── State ───────────────────────────────────────────────────────────────────
  const exchangeRate = ref(null)
  const counterpartyName = ref(null)
  const supplyRows = ref([])
  const margin = ref(null)
  const discount = ref(null)
  const deliveryFee = ref(null)        // Nova Post delivery fee at sending
  const additionalSpendings = ref(null)

  // ─── Number Helpers (Store Internal) ─────────────────────────────────────────
  const toNum = (val) => parseFloat(val) || 0

  // Rounds any value to 2 decimal places and returns a strict Number
  const round = (val) => Number(toNum(val).toFixed(2))

  // ─── Helpers ─────────────────────────────────────────────────────────────────
  const uid = () => Math.random().toString(36).slice(2, 9)

  // ─── Row factory ─────────────────────────────────────────────────────────────
  const newRow = (overrides = {}) => ({
    _id: uid(),
    name: '',
    nameDisabled: false,
    product_id: null,
    sell_price: null,
    cost_price: null,
    quantity: null,
    regular_price: null,
    sum: null,
    promotion_price: null,
    promotion_sum: null,
    ...overrides,
  })

  // ─── Actions ─────────────────────────────────────────────────────────────────
  const addRowFromSumup = (item) => {
    supplyRows.value.push(newRow({ name: item.name, nameDisabled: true, product_id: item.p_id }))
  }

  const addRowFromSearch = (product) => {
    supplyRows.value.push(newRow({ name: product.name || product.name_ukr, nameDisabled: true, product_id: product.id }))
  }

  const addEmptyRow = () => supplyRows.value.push(newRow())

  const removeRow = (id) => {
    supplyRows.value = supplyRows.value.filter(r => r._id !== id)
    recalculateAll()
  }

  const updateRowProduct = (rowId, productId) => {
    const row = supplyRows.value.find(r => r._id === rowId)
    if (!row || !productId) return
    row.product_id = productId
    row.nameDisabled = true
  }

  const clearSupply = () => {
    supplyRows.value = []
    counterpartyName.value = null
    deliveryFee.value = null
    additionalSpendings.value = null
    margin.value = null
    discount.value = null
    exchangeRate.value = null
  }

  const loadFromBackend = (supply) => {
    clearSupply()
    counterpartyName.value = supply.supplier?.id ?? null
    deliveryFee.value = supply.delivery_fee ?? null
    additionalSpendings.value = supply.additional_spendings ?? null
    margin.value = supply.margin ?? null;
    discount.value = supply.fidelity_discount ?? null;
    exchangeRate.value = supply.exchange_rate_real ?? null;

    supplyRows.value = (supply.supply_products ?? []).map(p => ({
      _id: p._id || uid(),
      name: p.product_detail.name ?? '',
      nameDisabled: !!p.product_detail.id,
      product_id: p.product_detail.id ?? null,
      sell_price: p.sell_price ?? null,
      quantity: p.quantity ?? null,
      regular_price: p.regular_price ?? null,
      cost_price: p.cost_price ?? null,
      sum: p.sum ?? null,
      promotion_price: p.promotion_price ?? null,
      promotion_sum: p.promotion_sum ?? null,
    }))

    recalculateAll()
  }

  const recalculateAll = () => {
    const discountAsDecimal = discount.value / 100
    const ratio = overheadRatio.value
    const currentMargin = margin.value
    const rate = exchangeRate.value


    supplyRows.value.forEach(row => {
      const qty = row.quantity
      const reg = row.regular_price

      // 1. Basic sums
      row.sum = (qty > 0 && reg > 0) ? round(reg * qty) : null

      // 2. Promotions
      if (discount.value) {
        row.promotion_price = round(reg - (reg * discountAsDecimal))
        row.promotion_sum = round(row.promotion_price * qty)
      } else {
        row.promotion_price = null
        row.promotion_sum = null
      }

      // 3. Cost and Sell Distributions
      // Figure out the base price we are doing overhead math on
      const activePrice = discount.value ? toNum(row.promotion_price) : reg

      if (activePrice > 0) {
        row.cost_price = round((activePrice + (activePrice * ratio)) * rate)
      } else {
        row.cost_price = null
      }

      row.sell_price = (row.cost_price > 0 && currentMargin > 0)
        ? Math.ceil(row.cost_price * currentMargin)
        : null
    })
  }

  // ─── Computed ────────────────────────────────────────────────────────────────
  const total = computed(() =>
    round(supplyRows.value.reduce((acc, row) => acc + toNum(row.sum), 0))
  )

  const totalPromo = computed(() =>
    round(supplyRows.value.reduce((acc, row) => acc + toNum(row.promotion_sum), 0))
  )

  const monoBankFee = 0.018

  const totalInUAH = computed(() => {
    const baseTotal = discount.value ? totalPromo.value : total.value
    return round(baseTotal * exchangeRate.value)
  })

  const terminalTotalFee = computed(() => round(totalInUAH.value * monoBankFee))

  const totalOverheads = computed(() =>
    round(deliveryFee.value + terminalTotalFee.value + additionalSpendings.value)
  )

  const overheadRatio = computed(() => {
    return totalInUAH.value > 0 ? (totalOverheads.value / totalInUAH.value) : 0
  })

  return {
    counterpartyName,
    supplyRows,
    deliveryFee,
    margin,
    additionalSpendings,
    discount,
    exchangeRate,
    recalculateAll,
    addRowFromSumup,
    addRowFromSearch,
    addEmptyRow,
    removeRow,
    clearSupply,
    loadFromBackend,
    updateRowProduct,
    total,
    totalPromo,
    totalInUAH
  }
})