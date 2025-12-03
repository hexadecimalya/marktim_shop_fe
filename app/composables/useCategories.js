import { useRuntimeConfig } from '#app'

export default function useCategories() {
  const config = useRuntimeConfig()

  const url = `${config.public.siteUrl}/api/v1/public/categories/`

  const { data, error } = useAsyncData(
    'categories',
     () => $fetch(url)
  )

  const list = computed(() =>
    Array.isArray(data.value?.data)
      ? data.value.data.filter(c => c?.id)
      : []
  )

  const bySlug = computed(() =>
    Object.fromEntries(list.value.map(c => [c.slug, c]))
  )

  return {
    list,
    bySlug,
    error
  }
}