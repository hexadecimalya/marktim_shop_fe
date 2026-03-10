export default defineNuxtRouteMiddleware((to) => {
    const userStore = useUserStore()
    userStore.initStore()  

    const isAuthenticated = Boolean(userStore.user.access_token)
    const isLoginPage = to.path === '/admin2/login'

    if (isAuthenticated && isLoginPage) return navigateTo('/admin2')
    if (!isAuthenticated && !isLoginPage) return navigateTo('/admin2/login')
})