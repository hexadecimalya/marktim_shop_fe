<template>
  <div class="w-5/6 mx-auto">
    <h1 class="text-2xl font-extrabold my-4">
      Передзамовлення <span class="underline"> {{ preorderData.name }}</span>
    </h1>
    <div v-if="error">
      {{ error }}
    </div>
    <div v-else-if="!loading && !error">
      <!-- Table Header -->
      <div
        class="grid grid-cols-14 bg-mtgreen-100 border border-gray-200 rounded-t-lg p-3 text-sm font-semibold text-gray-700 text-center">
        <div class="text-center">
          <UIcon name="i-lucide:image" />

        </div>
        <div class="col-span-7">Назва</div>
        <div>Стара</div>
        <div>Продаж</div>
        <div>Опт</div>
        <div>Закуп</div>
        <div>Промо</div>
        <div class="text-center">Дії</div>
      </div>
      <!-- Rows -->
      <section v-if="!loading && !error">
        <div class="divide-y divide-gray-100 border-x border-b border-gray-200 rounded-b-lg px-4">
          <UForm @submit="savePreorder">
            <div v-for="product in productList" :key="product.id"
              class="grid grid-cols-14 p-1 text-sm font-slim gap-x-1">
              <img :src="`${product?.files?.[0]?.link}`" width="70" />
              <div class="col-span-7 font-medium hover:underline content-center">
                <NuxtLink :to="`/admin2/products/${product.product_id}`">{{ product.name_ukr ? product.name_ukr :
                  product.name }}
                </NuxtLink>
              </div>
              <UInput v-model="product.oldPrice" color="warning" highlight/>
              <UInput v-model="product.sellPrice" />
              <UInput v-model="product.bulkPrice" />
              <UInput v-model="product.promotionPrice" />
              <UInput v-model="product.regularPrice" />
              <!-- <div class="text-gray-500">{{ product.files.length ? product.files[0] : '-' }}</div> -->
              <div class="grid grid-cols-2">
                <UButton class="justify-self-end" variant="ghost" icon="i-lucide:save" color="primary" />
                <UButton class="justify-self-end" variant="ghost" icon="i-lucide:trash" color="error" />
              </div>

            </div>

            <!-- <div class="w-48 mx-auto">
              <UButton label="Зберегти" color="primary" variant="subtle" class="my-4" type="submit" />

            </div> -->

          </UForm>
        </div>
        <!-- <div class="my-6 flex justify-center" v-if="!loading">
          <UPagination v-model:page="page" :show-controls="false" :total="totalCount" active-color="neutral"
            active-variant="subtle" :items-per-page="limit" show-edges />
        </div> -->
      </section>

    </div>
    <div v-else>
      <AdminLoader />
    </div>
  </div>


</template>

<script setup>
const route = useRoute()
const preorderId = route.params.id
const url = computed(() => `/api/v1/preorders/${preorderId}`)

const { data, error, loading } = useAuthFetchData(url.value)
const preorderData = computed(() => data.value ?? {})
const productList = ref([])
watch(preorderData, (val) => { if (val?.products) { productList.value = val.products.map(p => ({ ...p, oldPrice: p.old_price ?? '', sellPrice: p.sell_price ?? '', bulkPrice: p.bulk_price ?? '', limitPrice: p.limit_price ?? '', promotionPrice: p.promotion_price ?? '', regularPrice: p.regular_price ?? '', })) } }, { immediate: true })


const savePreorder = () => {
  //krya
}
definePageMeta({
  layout: 'admin'
})
</script>
