export default function useApiGet(key, url, options = {}) {
  const config = useRuntimeConfig()

  return useAsyncData(
    key,
    () => $fetch(url.value || url, {
      baseURL: config.public.siteUrl,
      ...options,
    }),
    {
      watch: [url],
      lazy: false,
      server: true,
      immediate: true,
    
      default: () => null,
    }
  )
}

