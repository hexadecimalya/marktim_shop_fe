<template>
<MenuBarTest/>
<!-- <Search /> -->

<slot />
<!-- Just some space between footer and the page -->
    <div class="h-8"></div>
  <AppFooter />
  </template>
  
  <script setup>




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
  /* Set the font family for the entire site */
  body {
    font-family: 'Montserrat';
   
  }

  </style>