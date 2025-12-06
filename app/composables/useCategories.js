export default async function useCategories() {
  const config = useRuntimeConfig()

  const url = `${config.public.siteUrl}/api/v1/public/categories/`
  const res = await $fetch(url)


  const list = computed(() =>
    Array.isArray(res?.data)
      ? res.data.filter(c => c?.id)
      : []
  )

  const bySlug = computed(() =>
    Object.fromEntries(list.value.map(c => [c.slug, c]))
  )

  return {
    list,
    bySlug,
  }
}