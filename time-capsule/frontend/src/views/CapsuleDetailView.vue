<template>
  <div class="detail-container" v-if="capsule" :key="canViewCapsule">
    <div v-if="canViewCapsule" class="capsule-detail">
      <button @click="goBack" class="back-button">← Voltar</button>
      
      <h1>Cápsula de {{ formatDate(capsule.release_date) }}</h1>
      
      <div class="capsule-content">
        <img 
          :src="capsule.image_url" 
          alt="Imagem da cápsula"
          class="detail-image"
          @error="handleImageError"
        >
        
        <div class="message-container">
          <p class="message">{{ capsule.message }}</p>
          <p class="creation-date">
            Criada em: {{ formatDate(capsule.created_at) }}
          </p>
        </div>
      </div>
    </div>
    
    <div v-else class="access-denied">
      <div class="lock-icon">🔒</div>
      <h2>Cápsula Bloqueada</h2>
      <p>Esta cápsula estará disponível a partir do dia {{ formatDate(capsule.release_date) }}</p>
      
      <div v-if="capsule.lat && capsule.lng" class="location-info">
        <p>Você precisa estar no local especificado para abrir</p>
        <p class="coordinates">
          Latitude: {{ capsule.lat.toFixed(6) }}, 
          Longitude: {{ capsule.lng.toFixed(6) }}
        </p>
        <LocationMap :lat="capsule.lat" :lng="capsule.lng" />
        <div v-if="locationChecked && !locationAllowed">
          <p style="color:#e74c3c; margin-top: 1rem;">Você não está no local correto para abrir esta cápsula.</p>
        </div>
      </div>
      
      <button @click="goBack" class="back-button">Voltar para a lista</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { format, isAfter, parseISO } from 'date-fns'
import { useAuthStore } from '../stores/auth'
import LocationMap from '../components/LocationMap.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const capsule = ref(null)
const loading = ref(true)
const canView = ref(false)

const userLat = ref(null)
const userLng = ref(null)
const locationChecked = ref(false)
const locationAllowed = ref(false)

const formatDate = (dateString) => {
  return format(parseISO(dateString), 'dd/MM/yyyy HH:mm')
}

const handleImageError = (e) => {
  e.target.src = 'https://placehold.co/600x400?text=Imagem+indispon%C3%ADvel'
}

const goBack = () => {
  router.push('/capsules')
}

const checkAccess = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/capsules/${route.params.id}/check`,
      {
        headers: {
          Authorization: `Bearer ${authStore.token}`
        }
      }
    )
    
    canView.value = response.data.can_open
  } catch (error) {
    console.error('Erro ao verificar acesso:', error)
  }
}

function getDistanceFromLatLonInMeters(lat1, lon1, lat2, lon2) {
  function deg2rad(deg) {
    return deg * (Math.PI/180)
  }
  const R = 6371000 // Raio da Terra em metros
  const dLat = deg2rad(lat2-lat1)
  const dLon = deg2rad(lon2-lon1) // CORRIGIDO AQUI
  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

const checkIfAtLocation = () => {
  if (capsule.value && capsule.value.lat && capsule.value.lng && userLat.value && userLng.value) {
    const distance = getDistanceFromLatLonInMeters(
      capsule.value.lat, capsule.value.lng, userLat.value, userLng.value
    )
    locationAllowed.value = distance < 50 // 50 metros de tolerância
    locationChecked.value = true
  }
}

const getUserLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        userLat.value = position.coords.latitude
        userLng.value = position.coords.longitude
        checkIfAtLocation()
      },
      (err) => {
        locationChecked.value = true
        locationAllowed.value = false
      }
    )
  } else {
    locationChecked.value = true
    locationAllowed.value = false
  }
}

const fetchCapsule = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/capsules/${route.params.id}`,
      {
        headers: {
          Authorization: `Bearer ${authStore.token}`
        }
      }
    )
    
    capsule.value = response.data
    await checkAccess()
  } catch (error) {
    console.error('Erro ao carregar cápsula:', error)
  } finally {
    loading.value = false
  }
}

const canViewCapsule = computed(() => {
  if (!capsule.value?.lat || !capsule.value?.lng) return canView.value
  return canView.value && locationAllowed.value
})

watch(
  () => locationAllowed.value,
  (allowed) => {
    if (allowed && canView.value) {
      // Força o Vue a reavaliar o v-if e mostrar a cápsula
      // Não precisa fazer nada, pois a computed já depende dessas duas variáveis
      // Mas se quiser garantir, pode forçar um refresh ou navegar para a mesma rota:
      // router.replace(router.currentRoute.value.fullPath)
    }
  }
)

onMounted(async () => {
  await fetchCapsule()
  if (capsule.value && capsule.value.lat && capsule.value.lng) {
    getUserLocation()
  }
})
</script>

<style scoped>
.detail-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.back-button {
  background: none;
  border: none;
  color: #42b983;
  font-size: 1rem;
  cursor: pointer;
  margin-bottom: 1rem;
  padding: 0.5rem 0;
}

.back-button:hover {
  text-decoration: underline;
}

.capsule-detail h1 {
  color: #2c3e50;
  margin-bottom: 1.5rem;
}

.capsule-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.detail-image {
  width: 100%;
  max-height: 400px;
  object-fit: contain;
  border-radius: 8px;
  background: #f5f5f5;
}

.message-container {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.message {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #333;
  white-space: pre-line;
}

.creation-date {
  margin-top: 1rem;
  font-size: 0.9rem;
  color: #666;
  text-align: right;
}

.access-denied {
  text-align: center;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.lock-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.access-denied h2 {
  color: #2c3e50;
  margin-bottom: 1rem;
}

.access-denied p {
  color: #666;
  margin-bottom: 1rem;
}

.location-info {
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
}

.coordinates {
  font-family: monospace;
  font-size: 0.9rem;
  color: #42b983;
}

.loading {
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
}

.error-state {
  text-align: center;
  padding: 2rem;
  color: #e74c3c;
}
</style>