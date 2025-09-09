import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCartStore = defineStore('cart', () => {
  const stockItems = ref([])
  const preorderItems = ref([])

  const stockSubtotal = computed(() =>
    stockItems.value.reduce((sum, i) => sum + i.price * i.quantity, 0)
  )
  const preorderSubtotal = computed(() =>
    preorderItems.value.reduce((sum, i) => sum + i.price * i.quantity, 0)
  )

  const subtotal = computed(() => stockSubtotal.value + preorderSubtotal.value)

  // const totalQuantity = computed(() =>
  //   stockItems.value.reduce((sum, i) => sum + i.quantity, 0) +
  //   preorderItems.value.reduce((sum, i) => sum + i.quantity, 0)
  // )

  const totalQtyStockItems = computed(() =>
    stockItems.value.reduce((sum, i) => sum + i.quantity, 0)
  )

  const totalQtyPreorderItems = computed(() =>
    preorderItems.value.reduce((sum, i) => sum + i.quantity, 0)
  )

  const totalQuantity = computed(() => totalQtyStockItems.value + totalQtyPreorderItems.value)

  const discount = computed(() => subtotal.value * 0.03)
  const total = computed(() => subtotal.value - discount.value)

  const addItem = (product) => {
    const list = product?.isPreorder ? preorderItems : stockItems // tut
    console.log(preorderItems.value)
    const existing = list.value.find(i => i.id === product.id)
    if (existing) {
      existing.quantity += product.quantity
    } else {
      list.value.push({ ...product })
    }
  }




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

  const removeItem = (id) => {
    stockItems.value = stockItems.value.filter(i => i.id !== id)
    preorderItems.value = preorderItems.value.filter(i => i.id !== id)
  }

  const clearCart = () => {
    stockItems.value = []
    preorderItems.value = []
  }

  return {
    stockItems,
    preorderItems,
    totalQuantity,
    totalQtyStockItems,
    totalQtyPreorderItems,
    stockSubtotal,
    preorderSubtotal,
    subtotal,
    discount,
    total,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
  }
}, {
  persist: true
})


