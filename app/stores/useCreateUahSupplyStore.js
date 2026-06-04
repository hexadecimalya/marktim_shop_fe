import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCreateUahSupplyStore = defineStore('createUahSupply', () => {
  // ─── State ───────────────────────────────────────────────────────────────────
  const counterpartyName = ref(null)
  const supplyRows = ref([])
  const margin = ref(null)
  const deliveryFee = ref(null)        
  const additionalSpendings = ref(null) 

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
    ...overrides,
  })

  // ─── Actions ─────────────────────────────────────────────────────────────────
  const addRowFromSumup = (item) => {
    supplyRows.value.push(newRow({
      name: item.name,
      nameDisabled: true,
      product_id: item.p_id,
    }))
  }

  const addRowFromSearch = (product) => {
    supplyRows.value.push(newRow({
      name: product.name || product.name_ukr,
      nameDisabled: true,
      product_id: product.id,
    }))
  }

  const addEmptyRow = () => {
    supplyRows.value.push(newRow())
  }

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
  }

  const loadFromBackend = (supply) => {
    clearSupply()
    counterpartyName.value = supply.supplier?.id ?? null
    deliveryFee.value = supply.delivery_fee ?? null
    additionalSpendings.value = supply.additional_spendings ?? null

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
    }))

    //recalculateAll()
  }

  const recalculateAll = () => {
    // Step 1: Calculate row-level basic sums
    supplyRows.value.forEach(row => {
      const qty = parseFloat(row.quantity) || 0
      const reg = parseFloat(row.regular_price) || 0
      row.sum = qty > 0 && reg > 0 ? reg * qty : null
    })

    // Step 2: Grab the freshly computed overhead ratio 
    const ratio = overheadRatio.value
    const currentMargin = parseFloat(margin.value) || 0

    // Step 3: Recalculate cost & sell distributions for all rows
    supplyRows.value.forEach(row => {
      const reg = parseFloat(row.regular_price) || 0
      if (reg > 0) {
        row.cost_price = Number(reg + (reg * ratio)).toFixed(2)
        row.sell_price = row.cost_price > 0 && currentMargin > 0 
          ? Math.ceil(row.cost_price * currentMargin) 
          : 0
      } else {
        row.cost_price = null
        row.sell_price = null
      }
    })
  }

  // ─── Computed ────────────────────────────────────────────────────────────────
  const total = computed(() =>
    supplyRows.value.reduce((acc, row) => acc + (parseFloat(row.sum) || 0), 0)
  )

  const monoBankFee = 0.018
  const terminalTotalFee = computed(() => total.value * monoBankFee)

  const totalOverheads = computed(() => {
    return (parseFloat(deliveryFee.value) || 0) +
      (parseFloat(terminalTotalFee.value) || 0) +
      (parseFloat(additionalSpendings.value) || 0)
  })

  const overheadRatio = computed(() => {
    if (total.value === 0) return 0
    return totalOverheads.value / total.value
  })

  return {
    counterpartyName,
    supplyRows,
    deliveryFee,
    margin,
    additionalSpendings,
    recalculateAll,
    addRowFromSumup,
    addRowFromSearch,
    addEmptyRow,
    removeRow,
    clearSupply,
    loadFromBackend,
    updateRowProduct,
    total,
  }
})