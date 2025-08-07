<template>
<MenuBar/>
<!-- <Search /> -->

<slot />
<!-- Just some space between footer and the page -->
    <div class="h-8"></div>
  <!-- footer -->
  </template>
  <script setup>
import MenuBar from '~/components/menu-bar.vue';




  // Link to Google Fonts
  useHead({
    titleTemplate: '%s - MarkTim Shop ', // %s is a template for STRING that will replaced at every page ;
    link: [
      {
        rel: 'preconnect',
        href: 'https://fonts.googleapis.com'
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap',
        crossorigin: ''
      }
    ]
  })
  </script>
  
  <style>
  body {
    font-family: 'Montserrat';
   
  }

  </style>