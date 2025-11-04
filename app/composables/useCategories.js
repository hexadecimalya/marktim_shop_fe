import useFetchData from "./useFetchData";

export default function useCategories() {
    const list = ref([])

    const { data } = useFetchData('categories',
        computed(() => 'https://marktim.shop/api/v1/public/categories/')
    )

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