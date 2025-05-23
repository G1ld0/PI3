<!-- filepath: /workspaces/PI3/time-capsule/frontend/src/components/LocationMap.vue -->
<template>
  <div id="capsule-map" style="width:100%;height:300px;border-radius:8px;"></div>
</template>

<script setup>
import { onMounted, watch } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const props = defineProps({
  lat: Number,
  lng: Number
})

let map, marker

onMounted(() => {
  map = L.map('capsule-map').setView([props.lat, props.lng], 16)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map)
  marker = L.marker([props.lat, props.lng]).addTo(map)
})

watch(() => [props.lat, props.lng], ([newLat, newLng]) => {
  if (map && marker) {
    map.setView([newLat, newLng], 16)
    marker.setLatLng([newLat, newLng])
  }
})
</script>