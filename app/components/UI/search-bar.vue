<template>
  <form @submit.prevent="submit" class="w-full mb-4 flex flex-col justify-center md:mx-0 mx-4">
    <UInput v-model="query" icon="i-lucide-search" class="md:w-full w-11/12" placeholder="Пошук..." variant="soft"
      minlength="2" name="search" @keydown.enter.prevent="query.length >= 3 && submit()">
      <template #trailing>
        <UButton color="neutral" variant="link" size="md" type="submit" icon="i-lucide-circle-arrow-right"
          aria-label="submit" :disabled="query.trim().length < 3" />
      </template>
    </UInput>

    <p v-if="query.length > 0 && query.length < 3" class="text-xs text-red-500 mt-1 w-11/12 text-left">
      Для пошуку введіть більше 2 літер</p>

  </form>
</template>

<script setup>
const emit = defineEmits(['update:search'])
const query = ref('')
const submit = () => {
  if (query.value.trim().length < 3) {
    query.value = ''
    return
  }
  emit('update:search', query.value)
  query.value = ''
}


// watchEffect(() => {
//   console.log(query.value)
// })

// watch(query, (val) => emit('update:search', val))
</script>
