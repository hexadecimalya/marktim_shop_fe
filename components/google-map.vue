<template>
  <div ref="mapElement" class="map"></div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
const mapElement = ref(null);
const { $loadGoogleMaps } = useNuxtApp();

onMounted(async () => {
  const googleMaps = await $loadGoogleMaps();

  const map = new googleMaps.Map(mapElement.value, {
    center: { lat: 51.5198238, lng: 30.7573142 },
    zoom: 19,
    mapId: 'DEMO_MAP_ID'
  });

//   new googleMaps.marker.AdvancedMarkerElement({
//     map,
//     position: { lat: 51.5198524, lng: 30.7573142 },
//     title: 'MarkTim shop',
//     zIndex: 100
//   });
});
</script>

<style scoped>
.map {
  width: 100%;
  height: 50vh;
}
</style>