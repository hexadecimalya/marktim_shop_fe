import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCartStore = defineStore('cart', () => {
  const items = ref([]) // { id, name, price, image, quantity }

  const totalQuantity = computed(() =>
    items.value.reduce((sum, i) => sum + i.quantity, 0)
  )
  const subtotal = computed(() =>
    items.value.reduce((sum, i) => sum + i.price * i.quantity, 0)
  )
  const discount = computed(() => subtotal.value * 0.03)
  const total = computed(() => subtotal.value - discount.value)

  const addItem = (product) => {
    const existing = items.value.find(i => i.id === product.id)
    if (existing) {
      existing.quantity += product.quantity
    } else {
      items.value.push({ ...product })
    }
  }

  const updateQuantity = (id, qty) => {
    const item = items.value.find(i => i.id === id)
    if (!item) return
    if (qty <= 0) {
      removeItem(id)
    } else {
      item.quantity = qty
    }
  }

  const removeItem = (id) => {
    items.value = items.value.filter(i => i.id !== id)
  }

  const clearCart = () => {
    items.value = []
  }

  return {
    items,
    totalQuantity,
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