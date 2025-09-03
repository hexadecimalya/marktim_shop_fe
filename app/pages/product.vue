<template>
  <Breadcrumbs />

  <div
    class="lg:container sm:mt-8 mx-auto flex sm:flex-row flex-col justify-center bg-green-300 sm:bg-orange-200 md:bg-fuchsia-300 lg:bg-blue-200">
    <!-- <div class="lg:container sm:mt-8 mx-auto flex sm:flex-row flex-col justify-center bg-green-300 sm:bg-orange-200 md:bg-fuchsia-300 lg:bg-blue-200 "> -->

    <img class="sm:w-1/2" src="../assets/1_test.png" />

    <div class="p-4 lg:ml-4 md:w-2/5">
      <h1 class="font-semibold uppercase">JOHNNIE WALKER</h1>
      <h2 class="text-base my-2 font-normal text-justify">
        Blue Label whisky escocés James Jean Edición Limitada Nuevo Año de la Serpiente botella 70 cl
      </h2>
      <div class="text-xl sm:my-4 font-semibold">145 грн</div>
      <div class="my-4">
        <div class="text-xs uppercase mb-0">Кількість</div>
        <QuantityButton />
        <button class=" w-full h-12 bg-green-300 rounded-sm hover:bg-green-600 uppercase text-sm font-medium">До
          кошика</button>

      </div>
    </div>

  </div>
  <div v-if="productDescription" class="lg:container sm:mt-8 mx-auto p-4  ">
    <h1 class="font-semibold"> General Information</h1>

    <div class="border-t-2 mt-2 py-2 text-justify">
      {{ productDescription }}
    </div>
  </div>

</template>

<script setup>


const productDescription = "By default the plugin will look for this file in the same directory as your Prettier configuration file. However, if your Tailwind configuration is somewhere else, you can specify this using the tailwindConfig option in your Prettier configuration"
</script>