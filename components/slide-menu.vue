<template>
    <USlideover :title="title" :description="description">
      <!-- The trigger slot is placed exactly where you want its list item to be rendered -->
      <template #trigger>
        <slot name="trigger"></slot>
      </template>
      <!-- The body slot defines the content to be displayed in the dropdown -->
      <template #body>
        <slot name="body"></slot>
      </template>
    </USlideover>
  </template>
  
  <script setup>
  const props = defineProps({
    title: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
  });
  </script>