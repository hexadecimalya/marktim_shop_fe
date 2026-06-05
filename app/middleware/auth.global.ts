import { useUserStore } from "~/stores/useUserStore";

export default defineNuxtRouteMiddleware((to) => {
  const userStore = useUserStore();

  if (!userStore.user.access_token) {
    userStore.initStore();
  }

  const isAuthenticated = Boolean(userStore.user.access_token);
  const isLoginPage = to.path === "/administrative/login";

  if (isLoginPage && !isAuthenticated) {
    return;
  } else if (isLoginPage && isAuthenticated) {
    return navigateTo("/administrative");
  } else if (to.path.startsWith("/administrative") && !isAuthenticated)
    return navigateTo("/administrative/login");
});