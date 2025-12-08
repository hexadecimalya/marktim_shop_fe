<template>
  <form @submit.prevent="submit" class="w-full mb-4 flex flex-col">
    <UInput
      v-model="query"
      placeholder="Пошук..."
      minlength="2"
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
        <!-- <UButton
          v-else
          color="neutral"
          variant="link"
          size="md"
          type="reset"
          icon="i-lucide-circle-x"
          @click="clear"
        /> -->
      </template>
    </UInput>

    <p v-if="query.length > 0 && query.length < 3" class="text-xs text-red-500 mt-1">
      Для пошуку введіть більше 2 літер
    </p>
  </form>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const query = ref('')
// const clearField = ref(false)

onMounted(() => {
  query.value = (route.query.q ?? '').toString()
})

// const clear = () => {
//   query.value = ''
//   clearField.value = false
//   // optionally emit, if parent needs it:
//   // emit('field-clear')
// }

const submit = () => {
  const q = query.value.trim()
  if (q.length < 3) return

  const location = route.params.location
  router.push({
    path: `/products/${location}/search`,
    query: { q }
  })
}
</script>
