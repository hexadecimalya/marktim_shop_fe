// composables/useCartValidator.ts

import { useRuntimeConfig, useToast } from '#imports'
import { storeToRefs } from 'pinia'
import { useCartStore } from '#imports'

type CartStore = ReturnType<typeof useCartStore>

type CartValidatorOptions = {
  cart: CartStore
}

type StockApiResponse = Record<
  string,
  {
    id: number
    units_amount: number
    sell_price: number
  }
>

export const useCartValidator = async ({
  cart
}: CartValidatorOptions) => {
  const config = useRuntimeConfig()

  const { stockItems, preorderItems } = storeToRefs(cart)

  await Promise.all([
    syncStock({
      stockItems: stockItems.value,
      cart,
      apiBase: config.public.apiBase
    }),

    syncPreorders({
      preorderItems: preorderItems.value,
      cart,
      apiBase: config.public.apiBase
    })
  ])
}

type SyncStockParams = {
  stockItems: any[]
  cart: CartStore
  apiBase: string
}

const syncStock = async ({
  stockItems,
  cart,
  apiBase
}: SyncStockParams) => {
  if (!stockItems.length) return

  const toast = useToast()

  try {
    const ids = stockItems.map((item) => item.id)

    const response = await $fetch<StockApiResponse>(
      `${apiBase}/public/stock/check_stock/`,
      {
        method: 'POST',
        body: {
          product_ids: ids
        }
      }
    )

    let hasChanges = false

    Object.entries(response).forEach(([id, serverItem]) => {
      const productId = Number(id)

      const localItem = stockItems.find(
        (item) => item.id === productId
      )

      if (!localItem) return

      const previousPrice = localItem.price
      const previousQuantity = localItem.quantity

      // update max available qty
      localItem.maxQuantity = serverItem.units_amount

      // update price
      if (localItem.price !== serverItem.sell_price) {
        localItem.price = serverItem.sell_price
      }

      // remove unavailable item
      if (serverItem.units_amount <= 0) {
        cart.removeItem(productId, false)
      }

      // clamp quantity to stock
      else if (localItem.quantity > serverItem.units_amount) {
        localItem.quantity = serverItem.units_amount
      }

      const priceChanged =
        previousPrice !== localItem.price

      const quantityChanged =
        previousQuantity !== localItem.quantity

      if (priceChanged || quantityChanged) {
        hasChanges = true
      }
    })

    if (hasChanges) {
      toast.add({
        title: 'Кошик оновлено',
        description:
          'Деякі товари були оновлені згідно з актуальними залишками та цінами.',
        color: 'primary'
      })
    }
  } catch (error) {
    console.warn('Stock sync failed:', error)
  }
}

type SyncPreordersParams = {
  preorderItems: any[]
  cart: CartStore
  apiBase: string
}

const syncPreorders = async ({
  preorderItems,
  cart,
  apiBase
}: SyncPreordersParams) => {
  console.log(preorderItems)
  if (!preorderItems.length) return

  await Promise.all(
    preorderItems.map(async (item) => {
      if (!item.product_preorder_id) return

      try {
        const response = await $fetch<{
          exists: boolean
        }>(`${apiBase}/public/preorders/`, {
          query: {
            check_product_id:
              item.product_preorder_id
          }
        })
        console.log(response)
        if (!response?.exists) {
          cart.removeItem(item.id, true)
        }
      } catch (error) {
        console.warn(
          `Preorder validation failed for item ${item.id}:`,
          error
        )
      }
    })
  )
}