import useFetchData from "./useFetchData";
import { useRuntimeConfig } from "#app";

export default async function useCategories() {
    const config = useRuntimeConfig()
    const list = ref([])

    const { data } = await useFetchData('categories',
        `${config.public.siteUrl}/api/v1/public/categories/`)

    watchEffect(() => {
        if (Array.isArray(data.value.data)) {
            list.value = data.value.data.filter(c => c?.id) // skip empty slugs
        }
    })
    const bySlug = computed(() =>
        Object.fromEntries(list.value.map(c => [c.slug, c]))
    )

    return { list, bySlug }
}