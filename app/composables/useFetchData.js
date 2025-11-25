export default function useFetchData(key, url, options = {}) {
  const { data, error, pending, refresh } = useAsyncData(
    key,
    () => {
      const safeUrl = unref(url)
      if (!safeUrl || safeUrl.includes('NaN')) return Promise.resolve({})
      return $fetch(safeUrl, options)
    },
    {
      watch: [url],
      default: () => ({ data: [] })
    }
  )
  return { data, error, pending, refresh }
}
