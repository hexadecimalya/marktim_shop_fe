<template>
  <!-- <div class="block border-2 w-full h-12 rounded-sm mb-4 text-center text-lg font-medium"> -->
  <div class="flex flex-row h-12 w-full rounded-lg relative bg-transparent my-4">
    <button
      class="bg-white hover:bg-gray-200 h-full w-1/3 rounded-l cursor-pointer outline-none" @click="decQuantity">
      <span class="m-auto text-2xl" >−</span>
    </button>
    <input 
      class="outline-none focus:outline-none text-center w-1/3 font-semibold text-md flex items-center"
      name="custom-input-number" :value="quantity"  ></input>
    <button class="bg-white hover:bg-gray-200 h-full w-1/3 rounded-r cursor-pointer" @click="incQuantity">
      <span class="m-auto text-2xl" >+</span>
    </button>
  </div>

</template>

<script setup>
let quantity = ref(1)
const incQuantity = () => quantity.value++
const decQuantity = () => quantity.value--
</script>
