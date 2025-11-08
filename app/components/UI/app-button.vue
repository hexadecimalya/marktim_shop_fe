<template>
<button
  type="button"
  class="w-full h-10 flex items-center justify-center gap-2 text-xs sm:text-sm font-medium uppercase rounded-md
         bg-mtgreen-300/90 backdrop-blur-sm text-white hover:bg-mtgreen-400/90 shadow-[0_2px_6px_rgba(0,0,0,0.15)]
         transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-mtgreen-200">
  <slot></slot>
</button>
</template>
<script setup>
</script>