<template>
    <div class="space-x-4 space-y-4">
        <USelectMenu v-model="selectedCity" v-model:search-term="searchTerm" :items="items" :loading="loading"
             placeholder="Оберіть місто" class="w-80" />
        <USelectMenu v-if="warehouseItems.length > 0" v-model="selectedWarehouse" :items="warehouseItems"
            :loading="loadingWarehouses" placeholder="Оберіть відділення" class="w-full md:w-1/2" />
    </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRuntimeConfig } from '#app'

const config = useRuntimeConfig()

const items = ref([])           
const selectedCity = ref(null)  
const searchTerm = ref('')       
const loading = ref(false)

const warehouseItems = ref([])
const selectedWarehouse = ref(null)
const loadingWarehouses = ref(false)

async function fetchCities(query) {
    if (!query || query.trim().length < 3) {
        items.value = []
        return
    }

    loading.value = true
    try {
        const res = await $fetch('https://api.novaposhta.ua/v2.0/json/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: {
                apiKey: config.npApiKey,
                modelName: 'Address',
                calledMethod: 'getCities',
                methodProperties: { FindByString: query }
            }
        })

        items.value = (res?.data || []).map(c => ({
            label: c.Description, 
            value: c.Ref          
        }))
    } catch (e) {
        console.error('Nova Poshta error:', e)
        items.value = []
    } finally {
        loading.value = false
    }
}

// simple debounce so we don't fetch on every keystroke
let t
watch(searchTerm, (q) => {
    clearTimeout(t)
    t = setTimeout(() => fetchCities(q), 350)
})

watch(selectedCity, async (cityRef) => {
    if (!cityRef) {
        warehouseItems.value = []
        return
    }
    loadingWarehouses.value = true
    try {
        const res = await $fetch('https://api.novaposhta.ua/v2.0/json/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: {
                apiKey: config.npApiKey,
                modelName: 'AddressGeneral',
                calledMethod: 'getWarehouses',
                methodProperties: { CityRef: cityRef.value }
            }
        })
        warehouseItems.value = (res?.data || []).map(w => ({
            label: w.Description, 
            value: w.Ref         
        }))
    } catch (e) {
        console.error('Warehouses error:', e)
        warehouseItems.value = []
    } finally {
        loadingWarehouses.value = false
    }
})
</script>
