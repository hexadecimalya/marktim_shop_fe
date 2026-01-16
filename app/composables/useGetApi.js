export default function useApiGet(key, url, options = {}) {
  const config = useRuntimeConfig()

  return useAsyncData(
    key,
    () => $fetch(url.value || url, {
      baseURL: config.public.apiBase,
      ...options,
    }),
    {
      watch: [url],
      lazy: false,
      server: true,
      immediate: true,
      dedupe: 'cancel',
      default: () => null,
    }
  )
}

