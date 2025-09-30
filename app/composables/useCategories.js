import useFetchData from "./use-fetchdata";

export default function useCategories() {
    const list = ref([])

    const { data } = useFetchData('categories',
        computed(() => 'https://marktim.shop/api/v1/public/categories/')
    )

    watchEffect(() => {
        if (Array.isArray(data.value)) {
            list.value = data.value.filter(c => c?.id) // skip empty slugs
        }
    })
    const bySlug = computed(() =>
        Object.fromEntries(list.value.map(c => [c.slug, c]))
    )

// const findIdBySlug = (slug) => bySlug.value[slug]?.id ?? null

    
    // const findIdBySlug = (slug) =>
    //     bySlug.value[slug]?.id ?? null

    return { list, bySlug }
}