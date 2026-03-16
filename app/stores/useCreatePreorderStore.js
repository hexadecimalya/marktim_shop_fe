import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCreatePreorderStore = defineStore('new-preorder', () => {
  const preorderItems = ref([])
  const exchangeRate = ref(null)
  const preorderIsInitialized = ref(false)
  const preorderName = ref(undefined)

 
  const calculatePromo = (product) => {
    const reg = parseFloat(product.regular_price) || 0
    if (!reg) return product

    const promoType = product.promoSelected ?? 0

    if (promoType === 0) {
      product.promo_price = null 
    }
      else if (promoType === 1) {
      product.promo_price = parseFloat(((reg + reg * 0.6) / 2).toFixed(2))
    } else if (promoType === 2) {
      product.promo_price = parseFloat(((reg + reg * 0.5) / 2).toFixed(2))
    } else if (promoType === 3) {
      product.promo_price = parseFloat(((reg + reg * 0.4) / 2).toFixed(2))
    } else if (promoType === 4) {
      product.promo_price = parseFloat(((reg + reg * 0.3) / 2).toFixed(2))
    } else if (promoType === 5) {
      product.promo_price = parseFloat(((reg * 2) / 3).toFixed(2))
    }

    return calculatePrices(product)
  }
  const calculatePrices = (product) => {
    const rate = exchangeRate.value
    if (!rate) return product

    const calculateFloatingRate = (zlPrice) => {
      if (zlPrice < 2.49) return 1.4
      else if (zlPrice < 6.99) return 1.3
      else if (zlPrice < 8.49) return 1.28
      else return 1.27
    }

    const margin = 1.25 * 1.1

    const reg = parseFloat(product.regular_price) || 0

    const promo = parseFloat(product.promo_price) || 0;

    if (promo > 0) {
      product.sell_price = Math.ceil(promo * rate * margin * calculateFloatingRate(promo)) 
      product.old_price = reg > 0 ? Math.ceil(reg * rate * margin * calculateFloatingRate(reg)) : null 
    } else {
      product.sell_price = reg > 0 ? Math.ceil(reg * rate * margin * calculateFloatingRate(reg)) : 0 
      product.old_price = null
    }

    product.bulk_price = product.sell_price ? Math.ceil(product.sell_price * 0.95) : 0

    return product
  }

  const addItem = (product) => {
    const exists = preorderItems.value.find(item => item.id === product.id)
    if (!exists) {
      preorderItems.value.push({ ...product })
    } else {
      const index = preorderItems.value.findIndex(item => item.id === product.id)
      preorderItems.value[index] = { ...product }
    }
  }

  const removeItem = (id) => {
    preorderItems.value = preorderItems.value.filter(item => item.id !== id)
  }

  const setExchangeRate = (val) => {
    exchangeRate.value = parseFloat(val)
    preorderIsInitialized.value = true
    // preorderItems.value = preorderItems.value.map(item => calculatePrices(item))
  }

  const clearPreorder = () => {
    preorderItems.value = []
    preorderIsInitialized.value = false
    preorderName.value = undefined
    exchangeRate.value = null
  }


  return {
    preorderItems,
    exchangeRate,
    preorderIsInitialized,
    preorderName,
    addItem,
    removeItem,
    setExchangeRate,
    clearPreorder,
    calculatePrices,
    calculatePromo

  }
}, { persist: true })