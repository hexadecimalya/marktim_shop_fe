
import { useUserStore } from '~/stores/useUserStore'

export default defineNuxtRouteMiddleware((to) => {
  const userStore = useUserStore()

  if (!userStore.user.access_token) {
    userStore.initStore()
  }

  const isAuthenticated = Boolean(userStore.user.access_token)
  const isLoginPage = to.path === '/admin2/login'

  // 🔐 block unauthenticated users
  if (!isAuthenticated && !isLoginPage) {
    return navigateTo('/admin2/login')
  }

  // 🚫 prevent logged-in users from seeing login
  if (isAuthenticated && isLoginPage) {
    return navigateTo('/admin2')
  }
})