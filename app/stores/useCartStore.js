import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCartStore = defineStore('cart', () => {

  // values

  const stockItems = ref([])
  const preorderItems = ref([])
  const totalQtyStockItems = computed(() => stockItems.value.reduce((sum, i) => sum + i.quantity, 0))
  const totalQtyPreorderItems = computed(() => preorderItems.value.reduce((sum, i) => sum + i.quantity, 0))

  // funcs

  const addItem = (product) => {
    const list = product.isPreorder ? preorderItems : stockItems
    const existing = list.value.find(i => i.id === product.id)
    if (existing) {
      existing.quantity += product.quantity
    } else {
      list.value.push({ ...product })
    }
  }

  const stockSubtotal = computed(() =>
    stockItems.value.reduce((sum, i) => sum + i.price * i.quantity, 0)
  )

  const preorderSubtotal = computed(() =>
    preorderItems.value.reduce((sum, i) =>
      sum + (i.quantity === 1 ? i.price * i.quantity : i.bulk_price * i.quantity), 0)
  )
const syncWithBackend = async () => {
  const config = useRuntimeConfig()

  const ids = stockItems.value.map(i => i.id)
  if (!ids.length) return

  const payload = {
    product_ids: ids
  }

  const res = await $fetch(
    `${config.public.apiBase}/public/stock/check_stock/`,
    {
      method: 'POST',
      body: payload,
    }
  )

  Object.entries(res).forEach(([id, serverItem]) => {
    const productId = Number(id)
    actualQuantity.value = serverItem.units_amount

    const localItem = stockItems.value.find(i => i.id === productId)
    if (!localItem) return

 
    if (localItem.price !== serverItem.sell_price) {
      localItem.price = serverItem.sell_price
    }


    if (serverItem.units_amount <= 0) {
      removeItem(productId)
    } else if (localItem.quantity > serverItem.units_amount) {
      localItem.quantity = serverItem.units_amount
    }
  })
}

  const updateQuantity = (id, qty) => {
    const item = stockItems.value.find(i => i.id === id) ||
      preorderItems.value.find(i => i.id === id)
    if (!item) return
    if (qty <= 0) {
      removeItem(id)
    } 
    else {
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