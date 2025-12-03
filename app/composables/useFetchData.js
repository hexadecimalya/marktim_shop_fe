export default async function useFetchData(key, url, options = {}) {
  const { data, error, pending, status, refresh } = useAsyncData(
    key,
    () => {
      const safeUrl = unref(url)
      if (!safeUrl || safeUrl.includes('NaN')) return Promise.resolve({})
      return $fetch(safeUrl, options)
     },
    {
      default: () => ({ data: [] })
    //   transform: options.transform,
    }
  )
  return { data, error, pending, status, refresh }
}
