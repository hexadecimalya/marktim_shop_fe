<template>
<button
  type="button"
  class="w-full h-10 flex items-center justify-center gap-2 text-xs sm:text-sm font-medium uppercase rounded-md
         bg-mtgreen-300/90 backdrop-blur-sm text-white hover:bg-mtgreen-400/90 shadow-[0_2px_6px_rgba(0,0,0,0.15)]
         transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-mtgreen-200">
  <slot></slot>
</button>
<!-- creamy -->
<!-- <button
  type="button"
  class="w-full h-10 flex items-center justify-center gap-2 text-sm font-semibold uppercase
         bg-[#f7f6f2] text-mtgreen-700 hover:bg-mtgreen-50 border border-mtgreen-100
         rounded-md transition-colors duration-200 focus:outline-none focus:ring-1 focus:ring-mtgreen-200">
  <slot></slot>
</button> -->
    <!-- <button type="button"
  class="w-full h-9 flex items-center justify-center gap-2 text-sm font-medium rounded-sm uppercase
         bg-mtgreen-300 hover:bg-mtgreen-400 text-white focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-mtgreen-200">
        <slot></slot>
    </button> -->
</template>
<script setup>
</script>