import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
// REMAKE

export const useCreatePreorderStore = defineStore('new-preorder', () => {

  // values

  const preorderItems = ref({})

  // funcs

  const addItem = (product) => {
    const list = preorderItems
    list.value.push({ ...product })
  }

    const removeItem = (id) => {
    stockItems.value = stockItems.value.filter(i => i.id !== id)
    preorderItems.value = preorderItems.value.filter(i => i.id !== id)
  }

  const preorderSubtotal = computed(() =>
    preorderItems.value.reduce((sum, i) =>
      sum + (i.quantity === 1 ? i.price * i.quantity : i.bulk_price * i.quantity), 0)
  )

  // const subtotal = computed(() => stockSubtotal.value + preorderSubtotal.value)

  // const totalQuantity = computed(
  //   () => totalQtyStockItems.value + totalQtyPreorderItems.value
  // )

  // const stockDiscount = computed(() => stockSubtotal.value * 0.03)
  // const preorderDiscount = computed(
  //   () => preorderSubtotal.value * 0.03
  // )
  // const stockTotal = computed(() => stockSubtotal.value - stockDiscount.value)
  // const preorderTotal = computed(
  //   () => preorderSubtotal.value - preorderDiscount.value
  // )
  // const stockTotal = computed(() => stockSubtotal.value - stockDiscount.value)

  // const discount = computed(
  //   () => stockDiscount.value + preorderDiscount.value
  // )
  // const total = computed(
  //   () => stockTotal.value + preorderTotal.value
  // )





  const updateQuantity = (id, qty) => {
    const item = stockItems.value.find(i => i.id === id) ||
      preorderItems.value.find(i => i.id === id)
    if (!item) return
    if (qty <= 0) {
      removeItem(id)
    } else {
      item.quantity = qty
    }
  }

  // const removeItem = (id) => {
  //   stockItems.value = stockItems.value.filter(i => i.id !== id)
  //   preorderItems.value = preorderItems.value.filter(i => i.id !== id)
  // }

  const clearCart = () => {
    stockItems.value = []
    preorderItems.value = []
  }

  return {
    stockItems,
    preorderItems,
    // totalQuantity,
    totalQtyStockItems,
    totalQtyPreorderItems,
    stockSubtotal,
    preorderSubtotal,
    // subtotal,
    // stockDiscount,
    // preorderDiscount,
    // stockTotal,
    // preorderTotal,
    // discount,
    // total,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
  }
}, {
  persist: true
})