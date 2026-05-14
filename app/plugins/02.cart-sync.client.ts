// plugins/cart-sync.client.ts
import { toast } from "#build/ui";
export default defineNuxtPlugin(async () => {
  // await nuxtApp.runWithContext(() => Promise.resolve());
  const route = useRoute();
  const EXCLUDED_PREFIXES = ["/admin2"];

  const isExcluded = EXCLUDED_PREFIXES.some((prefix) =>
    route.path.startsWith(prefix),
  );

  if (isExcluded) return;
  const cart = useCartStore();
  // if (import.meta.client) {
  //   await nextTick();
  // }
  if (!cart.stockItems.length && !cart.preorderItems.length) {
    return;
  }

  const toast = useToast();

  try {
    await useCartValidator({ cart });
  } catch (err) {
    console.error("Cart validation failed:", err);
  }
});
