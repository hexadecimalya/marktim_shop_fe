export default defineNuxtRouteMiddleware((to, from) => {
    const cart = useCartStore()
    if (cart.stockItems.length === 0 && cart.preorderItems.length === 0) {
        return navigateTo('/shopping-cart')
    }
})