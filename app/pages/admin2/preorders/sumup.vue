<template>
    <section class="w-11/12 mx-auto mb">
        <h1 class="text-2xl font-extrabold my-4">
            Підрахунок товарів на закупівлю
        </h1>
        
        <div class="grid grid-cols-21 items-center bg-gray-50 border border-gray-200 rounded-t-xl px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
            <div class="col-span-2">ID</div>
            <div class="col-span-11">Назва</div>
            <div class="col-span-2">Ціна</div>
            <div class="col-span-2">Кількість</div>
            <div class="col-span-2 flex justify-center">
                <UIcon name="i-lucide:image" />
            </div>
            <div class="text-end col-span-2">Ліміт</div>
        </div>

        <AdminLoader v-if="productLoading" />
        
        <div v-else-if="productError" class="text-center py-10 text-red-500">
            Помилка завантаження продукту
        </div>

        <div v-else class="border-x border-b border-gray-200 rounded-b-lg">
            <UForm :state="state" @submit="handlePublishProducts">
                <div class="divide-y divide-gray-100">
                    <div v-for="(item, index) in state.items" :key="item.id"
                        class="grid grid-cols-21 items-center px-1 py-1 text-md font-medium hover:bg-gray-50">
                        
                        <div class="col-span-2 pl-4 text-gray-500 text-sm">#{{ item.id }}</div>
                        <div class="col-span-11 pr-2 line-clamp-1">{{ item.name }}</div>
                        <div class="col-span-2 font-bold">{{ item.price }} </div>
                        
                        <div class="col-span-2 px-1">
                            <UInput v-model="state.items[index].amount" type="number" size="sm" />
                        </div>
                        
                        <div class="flex justify-center col-span-2">
                            <img :src="item.img || placeholder"
                                class="w-12 h-12 object-cover rounded shadow-sm border border-gray-100 hover:scale-150 transition-transform duration-200" />
                        </div>
                        
                        <div class="col-span-2 px-1">
                            <UInput v-model="state.items[index].limit_price"
                        size="sm" />
                        </div>
                    </div>
                </div>

                <div class="p-4 bg-gray-50 rounded-b-lg border-t border-gray-200 flex justify-end space-x-4">
                    <UButton 
                        @click="handleExportProductsList"
                        :loading="isExporting"
                        size="lg" 
                        color="neutral" 
                        icon="i-lucide:arrow-down-to-line"
                    >
                        Завантажити список
                    </UButton>
                     <UButton
                        type="submit" 
                        size="lg" 
                        color="primary" 
                        :loading="isPublishing"
                        icon="i-lucide:send"

                    >
                        Опублікувати в Viber
                    </UButton>
                </div>
            </UForm>
        </div>
    </section>
</template>


<script setup>
import placeholder from '@/assets/image_placeholder.png'


definePageMeta({
    layout: 'admin'
})

const toast = useToast()
const { execute } = useAuthFetchMulti() 

const { data: productData, error: productError, loading: productLoading } = useAuthFetchData(
    '/orders/sumup/'
)


const state = reactive({ items: [] })


watch(productData, (newData) => {
    if (newData?.data) {
       const mappedData = newData.data.map(p => ({
            id: p.p_id,         
            name: p.name,
            original_name: p.original_name || "",
            amount: p.total_amount, 
            limit_price: "",
            price: p.price,
            img: p.file            
        }))

        state.items = mappedData.sort((a, b) => 
            a.name.localeCompare(b.name, 'uk')
        )
    }
}, { immediate: true })

const isPublishing = ref(false)

const handlePublishProducts = async () => {
    if (state.items.length === 0) return
    
    isPublishing.value = true
    try {
        const payload = state.items 

        await execute('/orders/publish/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: payload
        })
        
        toast.add({ title: 'Success', description: 'Товари опубліковано!', color: 'success' })
    }
    catch (e) {
        console.error(e, "Помилка публікації.")
        toast.add({ title: 'Error', description: 'Помилка при публікації', color: 'error' })
    }
    finally {
        isPublishing.value = false
    }
}
 
const isExporting = ref(false)

const handleExportProductsList = async () => {
    const userStore = useUserStore()
    if (!userStore.user.access_token) {
        userStore.initStore();
    }

    isExporting.value = true
    const config = useRuntimeConfig()
    
    try {
        const blob = await $fetch(`${config.public.apiBase}/orders/sumup/export_to_buy/`, {
            method: 'GET', 
            responseType: 'blob',
            headers: {
                'Authorization': `Bearer ${userStore.user.access_token}`
            }
        })

        const url = window.URL.createObjectURL(blob)
        
        const link = document.createElement('a')
        link.href = url
        
        const date = new Date().toISOString().slice(0, 10)
        link.setAttribute('download', `export-products-${date}.xlsx`)
        
        document.body.appendChild(link)
        link.click()
        
        link.remove()
        window.URL.revokeObjectURL(url)

        toast.add({ title: 'Успіх', description: 'Файл завантажено', color: 'success' })
    } catch (e) {
        console.error('Download error:', e)

        if (e.status === 401) {
            toast.add({ title: 'Помилка', description: 'Термін дії сесії вичерпано', color: 'error' })
        } else {
            toast.add({ title: 'Помилка', description: 'Не вдалося завантажити файл', color: 'error' })
        }
    } finally {
        isExporting.value = false
    }
}
</script>