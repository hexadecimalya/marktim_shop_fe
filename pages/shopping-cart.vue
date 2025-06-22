<template>
  <!-- <div
  class="lg:container sm:mt-8 mx-auto flex sm:flex-row flex-col justify-center bg-green-300 sm:bg-orange-200 md:bg-fuchsia-300 lg:bg-blue-200"> -->
  <!-- <div class=" mx-auto xl:w-1/2 md:w-2/3 w-full p-4 sm:p-6 bg-green-300 sm:bg-orange-200 md:bg-fuchsia-300 lg:bg-blue-200"> -->
  <div class="max-w-4xl container mx-auto p-4 my-2 sm:p-6">
    <h1 class="font-semibold text-2xl mb-6">Кошик</h1>
    
    <!-- Empty cart state -->
    <div v-if="cart.length === 0" class="text-center py-12">
      <div class="mb-4">
        <IconShoppingCart class="w-16 h-16 mx-auto text-gray-300" />
      </div>
      <h2 class="text-xl font-medium text-gray-600 mb-2">Your cart is empty</h2>
      <p class="text-gray-500 mb-6">Looks like you haven't added anything to your cart yet.</p>
      <button class="px-6 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors">
        <NuxtLink to="/">Розпочати покупки</NuxtLink>
      </button>
    </div>
    
    <!-- Cart with items -->
    <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6 shadow-md ">
      <!-- Cart items list -->
      <div class="md:col-span-3">
        <div class="bg-white shadow-sm divide-y">
          <div v-for="(item, index) in cart" :key="index" class="p-4 flex items-center">
            <!-- Product image -->
            <div class="w-16 h-16 flex-shrink-0 bg-gray-100 rounded-xs overflow-hidden">
              <img :src="item.image" :alt="item.name" class="w-full h-full object-cover" />
            </div>
            
            <!-- Product details -->
            <div class="ml-4 flex-grow">
              <h3 class="font-medium md:text-base text-xs line-clamp-1">{{ item.name }}</h3>
              <!-- <p class="md:text-sm text-xs text-gray-500">{{ item.variant }}</p> -->
            </div>
            
            <!-- Quantity controls -->
            <div class="flex items-center border rounded-xs border-gray-200 ">
              <button 
                @click="updateQuantity(index, item.quantity - 1)" 
                class="px-2 py-1 text-gray-500 hover:text-gray-700"
                :disabled="item.quantity <= 1"
              >
              <UIcon name="i-heroicons:minus-16-solid" class="w-4 h-4" />
              </button>
              <span class="px-2 py-1 text-sm">{{ item.quantity }}</span>
              <button 
                @click="updateQuantity(index, item.quantity + 1)" 
                class="px-2 py-1 text-gray-500 hover:text-gray-700"
              >
              <UIcon name="i-heroicons:plus-16-solid" class="w-4 h-4" />
              </button>
            </div>
            
            <!-- Price -->
            <div class="ml-6 text-right">
              <p class="font-medium md:text-base text-xs" >{{ (item.price * item.quantity).toFixed(2) }} грн</p>
              <p class="text-xs md:text-sm text-gray-500">{{ item.price.toFixed(2) }} грн/шт</p>
            </div>
            
            <!-- Remove button -->
            <button @click="removeItem(index)" class="ml-4 text-gray-400 hover:text-red-500">
              <UIcon name="lucide-trash" />
            </button>
          </div>
        </div>
      </div>
      </div>
      <!-- Order summary -->
      <div class="md:col-span-1">
        <div class="bg-white  shadow-md p-4">
          <h2 class="md:text-lg text-base font-medium mb-4">Замовлення</h2>
          
          <div class="space-y-2 mb-4  md:text-base text-xs">
            <div class="flex justify-between">
              <span class="text-gray-600">Сума</span>
              <span class="font-medium">${{ subtotal.toFixed(2) }}</span>
            </div>
          
            <div class="flex justify-between">
              <span class="text-gray-600">Знижка -3% </span>
              <span class="font-medium text-mtwine-800">- {{ discount.toFixed(2) }} грн</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Доставка</span>
              <span class="font-medium">Згідно тарифів перевізника</span>
            </div>
            <div class="border-t pt-2 mt-2 flex justify-between">
              <span class="font-medium">Всього</span>
              <span class="font-bold">{{ total.toFixed(2) }} грн</span>
            </div>
          </div>
          
          <!-- <button class="w-full py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors">
            Proceed to Checkout
          </button> -->
          <button class=" w-full h-12 bg-mtgreen-100 rounded-sm transition-colors hover:bg-mtgreen-200 uppercase text-sm font-medium">Продовжити</button>
        </div>
      </div>
    </div>
  <!-- </div> -->
 
</template>

<script setup>

const cart = ref([
  {
    name: 'Minimalist Analog Watch',
    variant: 'Black / Leather',
    price: 149.99,
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
  },
  {
    name: 'Premium Wireless Earbuds',
    variant: 'White',
    price: 89.99,
    quantity: 2,
    image: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
  },
  {
    name: 'Slim Fit T-shirt',
    variant: 'Navy Blue / Medium',
    price: 24.99,
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
  }
]);

// Computed values for order summary
const subtotal = computed(() => {
  return cart.value.reduce((sum, item) => sum + (item.price * item.quantity), 0);
});

const shipping = computed(() => {
  return subtotal.value > 100 ? 0 : 10;
});

const discount = computed(() => {
  return subtotal.value * 0.08;
});



const total = computed(() => {
  return subtotal.value + shipping.value;
});

// Methods
const updateQuantity = (index, newQuantity) => {
  if (newQuantity > 0) {
    cart.value[index].quantity = newQuantity;
  }
};

const removeItem = (index) => {
  cart.value.splice(index, 1);
};

</script>

<style>

</style>