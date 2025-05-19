const fetchedData = ref({
    products: [],
    isLoading: false
})

const fetchProducts = async () => {
    const url = 'https://marktim.shop/api/v1/public/stock/?page_size=10'
    try {
        fetchedData.value.isLoading = true;
        let response = await $fetch(url, { method: 'GET' });
        fetchedData.value.products = response.data ? response.data : [];
        // console.log(fetchedData.value.products)
    } catch (error) {
        console.error(error.message);
    } finally {
        fetchedData.value.isLoading = false
    }
}



export default function useProducts() {
    return {
        fetchedData,
        fetchProducts
    }
}

//https://marktim.shop/api/v1/public/categories/