export default function useFetchData(key, url, options = {}) {
  const { data, error, refresh } = useAsyncData(
    key,
    () => $fetch(unref(url), options),
    { watch: [url] } 
  )
  return { data, error, refresh }
}
  