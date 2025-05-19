const fetchedCats = ref({
    categories: [],
    isLoading: false
})

const fetchCats = async () => {
    const url = 'https://marktim.shop/api/v1/public/categories/'
    try {
        fetchedCats.value.isLoading = true;
        let response = await $fetch(url, { method: 'GET' });
        fetchedCats.value.categories = response?? [];
        console.log('Here u are:', response[0].name)
    } catch (error) {
        console.error(error.message);
    } finally {
        fetchedCats.value.isLoading = false
    }
}



export default function useCategories() {
    return {
        fetchedCats,
        fetchCats
    }
}

//https://marktim.shop/api/v1/public/categories/