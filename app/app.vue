<template>
<UApp>
    <NuxtLayout :name="layout">
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
<script setup>
  const route = useRoute();
const routeLocation = computed(() => route.path)
const selectedLayout = ref('default')
const adminRoute = '/admin2'

const layout = computed(() => {
  if (routeLocation.value.startsWith(adminRoute)){
    selectedLayout.value = 'admin'
  } else {
    return
  }
  return selectedLayout.value
})


</script>
<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.3s
}

.page-enter-from,
.page-leave-to {
  opacity: 0.5;
  filter: grayscale(1);
}
</style>
