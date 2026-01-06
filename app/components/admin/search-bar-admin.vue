<template>
  <form @submit.prevent="submit" class="w-full mb-4 flex flex-col">
    <UInput
      v-model="query"
      placeholder="Пошук..."
      minlength="3"
      name="search"
      @keydown.enter.prevent="query.trim().length >= 3 && submit()"
    >
      <template #trailing>
        <UButton
          
          color="neutral"
          variant="link"
          size="md"
          type="submit"
          icon="i-lucide-search"
      
        />
      </template>
    </UInput>

    <p v-if="query.length > 0 && query.length < 3" class="text-xs text-red-500 mt-1">
      Для пошуку введіть більше 2 літер
    </p>
  </form>
</template>

<script setup>

const emit = defineEmits(['update:search'])
const query = ref('')

const submit = () => {
  if (query.value.trim().length < 3) return
  emit('update:search', query.value)
//   query.value = ''
}



</script>
