import { useUserStore } from "~/stores/useUserStore";

export default defineNuxtRouteMiddleware((to) => {
  const userStore = useUserStore();

  if (!userStore.user.access_token) {
    userStore.initStore();
  }

  const isAuthenticated = Boolean(userStore.user.access_token);
  const isLoginPage = to.path === "/admin2/login";

  if (isLoginPage && !isAuthenticated) {
    return;
  } else if (isLoginPage && isAuthenticated) {
    return navigateTo("/admin2");
  } else if (to.path.startsWith("/admin2/") && !isAuthenticated)
    return navigateTo("/admin2/login");
});
