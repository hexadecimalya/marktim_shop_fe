// const fetchedData = ref({
//     products: [],
//     isLoading: false
// })
// const data = ref([])
// const error = ref(null)
// const loading = ref(false)

// const fetchData = async (url) => {
//     loading.value = true
//     try {
//         const response = await useAsyncData((url) => $fetch(url, { method: 'GET' }));
//         data.value = response ?? [];
//         // console.log(fetchedData.value.products)
//     } catch (err) {
//         error.value = err.message;
//         console.error(error.value);
//     } finally {
//         loading.value = false
//     }
// }
// export default function useFetchdata() {
//     return {
//         fetchData,
//         data,
//         error,
//         loading
//     }
// }

export default function useFetchData(key, url, options = {}) {
    // useAsyncData works both universally (SSR) and on the client.
    // It accepts a key (for caching/identification) and a function that returns a promise.
    const { data, error, refresh } = useAsyncData(key, () => $fetch(url, options));
    return { data, error, refresh };
  }

//https://marktim.shop/api/v1/public/categories/

