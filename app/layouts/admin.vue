<template>
        <main>
            <NavbarAdmin />
          <slot />
        </main>

</template>

<script setup>
import NavbarAdmin from '~/components/admin/navbar-admin.vue';
useHead({
  titleTemplate: '[adm] %s',
   link: [
    { rel: 'icon', type: 'image/ico', href: '/favicon-adm.ico' }
  ] 
})

</script>