<template>
  <div class="w-full mb-4">
    <input
      v-model="query"
      type="text"
      placeholder="Пошук ..."
      class="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-mtgreen-400 transition"
    />
    <i class="i-lucide:search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base"></i>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const emit = defineEmits(['update:search'])
const query = ref('')

watch(query, (val) => emit('update:search', val))
</script>
