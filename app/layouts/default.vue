<template>
<MenuBar/>
<!-- <Search /> -->

  <slot />
 
    <div class="h-8"></div>
  <AppFooter />
  </template>
  <script setup>

    const { data } = useFetchData('categories',
        computed(() => 'https://marktim.shop/api/v1/public/categories/')
    )

  // Link to Google Fonts
  useHead({
    titleTemplate: '%s | MarkTim Shop ', // %s is a template for STRING that will replaced at every page ;
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
useSeoMeta({
  ogSiteName: 'MarkTim Shop',
  ogImage: 'http://localhost:3000/og-default.png',
  ogType: 'website',
  twitterCard: 'summary_large_image',
  icon: 'http://localhost:3000/favicon.ico',
  lang: 'ua'
  
})

  </script>
  
  <style>
  body {
    font-family: 'Montserrat';
   
  }

  </style>