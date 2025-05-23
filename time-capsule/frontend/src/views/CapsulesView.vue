<template>
  <div v-if="capsule" class="detail-container">
    <!-- Detalhe da cápsula -->
    <div v-if="showCapsule" class="capsule-detail">
      <div class="capsule-content">
        <img
          :src="capsule.image_url"
          alt="Imagem da cápsula"
          class="capsule-image"
          @error="handleImageError"
        >
        <h2>{{ formatDate(capsule.release_date) }}</h2>
        <p>{{ capsule.message }}</p>
      </div>
      <button @click="closeDetail" class="back-button">Voltar para a lista</button>
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
        <button
          v-if="canView && !locationChecked"
          @click="validateLocation"
          class="back-button"
          style="margin-bottom:1rem;"
        >
          Validar local
        </button>
        <div v-if="locationChecked">
          <template v-if="locationAllowed">
            <p style="color:#27ae60;">Local validado! Clique abaixo para exibir a cápsula.</p>
            <button @click="showCapsule = true" class="back-button" style="margin-bottom:1rem;">
              Exibir Cápsula
            </button>
          </template>
          <template v-else>
            <p style="color:#e74c3c; margin-top: 1rem;">Você não está no local correto para abrir esta cápsula.</p>
          </template>
        </div>
      </div>
      <button @click="closeDetail" class="back-button">Voltar para a lista</button>
    </div>
  </div>

  <!-- Lista de cápsulas -->
  <div v-else class="capsules-container">
    <h1>Minhas Cápsulas do Tempo</h1>
    <div v-if="loading" class="loading">Carregando...</div>
    <div v-else-if="error" class="error-state">
      Erro ao carregar cápsulas: {{ error }}
      <button @click="fetchCapsules" class="retry-btn">Tentar novamente</button>
    </div>
    <div v-else-if="filteredCapsules.length === 0" class="empty-state">
      Nenhuma cápsula disponível no momento
      <router-link to="/create" class="create-link">Criar nova cápsula</router-link>
    </div>
    <div v-else class="capsules-grid">
      <div 
        v-for="capsuleItem in filteredCapsules" 
        :key="capsuleItem.id" 
        class="capsule-card"
        @click="openDetail(capsuleItem)"
      >
        <div v-if="isCapsuleAvailable(capsuleItem)" class="capsule-content">
          <img 
            :src="capsuleItem.image_url" 
            alt="Imagem da cápsula" 
            class="capsule-image"
            @error="handleImageError"
          >
          <div class="capsule-info">
            <h3>{{ formatDate(capsuleItem.release_date) }}</h3>
            <p>{{ truncateMessage(capsuleItem.message) }}</p>
          </div>
        </div>
        <div v-else class="capsule-locked">
          <div class="lock-icon">🔒</div>
          <h3>Cápsula Bloqueada</h3>
          <p>Disponível em {{ formatDate(capsuleItem.release_date) }}</p>
          <p class="location-hint" v-if="capsuleItem.lat && capsuleItem.lng">
            Localização necessária
          </p>
        </div>
        <div class="capsule-status" :class="statusClass(capsuleItem)">
          {{ statusText(capsuleItem) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { format, isAfter, parseISO } from 'date-fns'
import { useAuthStore } from '../stores/auth'
import LocationMap from '../components/LocationMap.vue'

const authStore = useAuthStore()

const capsules = ref([])
const filteredCapsules = ref([])
const loading = ref(true)
const error = ref(null)

const capsule = ref(null) // Detalhe da cápsula selecionada
const showCapsule = ref(false)
const canView = ref(false)
const locationChecked = ref(false)
const locationAllowed = ref(false)
const userLat = ref(null)
const userLng = ref(null)

const formatDate = (dateString) => format(parseISO(dateString), 'dd/MM/yyyy HH:mm')
const truncateMessage = (msg) => msg.length > 60 ? msg.slice(0, 60) + '...' : msg

const handleImageError = (e) => {
  e.target.src = 'https://placehold.co/600x400?text=Imagem+indispon%C3%ADvel'
}

function getDistanceFromLatLonInMeters(lat1, lon1, lat2, lon2) {
  function deg2rad(deg) { return deg * (Math.PI/180) }
  const R = 6371000
  const dLat = deg2rad(lat2-lat1)
  const dLon = deg2rad(lon2-lon1)
  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

const validateLocation = () => {
  locationChecked.value = false
  locationAllowed.value = false
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        userLat.value = position.coords.latitude
        userLng.value = position.coords.longitude
        if (capsule.value && capsule.value.lat && capsule.value.lng) {
          const distance = getDistanceFromLatLonInMeters(
            capsule.value.lat, capsule.value.lng, userLat.value, userLng.value
          )
          locationAllowed.value = distance < 100
          locationChecked.value = true
        }
      },
      () => {
        locationChecked.value = true
        locationAllowed.value = false
      }
    )
  } else {
    locationChecked.value = true
    locationAllowed.value = false
  }
}

const fetchCapsules = async () => {
  try {
    loading.value = true
    error.value = null
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/capsules`, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    capsules.value = response.data.capsules
    filteredCapsules.value = capsules.value // ajuste se tiver filtro
  } catch (err) {
    error.value = 'Erro ao carregar cápsulas'
  } finally {
    loading.value = false
  }
}

const openDetail = (capsuleItem) => {
  capsule.value = capsuleItem
  locationChecked.value = false
  locationAllowed.value = false
  // Se não exige localização e a data já passou, exibe direto
  if ((!capsuleItem.lat || !capsuleItem.lng) && isAfter(new Date(), parseISO(capsuleItem.release_date))) {
    showCapsule.value = true
    canView.value = true
  } else {
    showCapsule.value = false
    canView.value = isAfter(new Date(), parseISO(capsuleItem.release_date))
  }
}

const closeDetail = () => {
  capsule.value = null
  showCapsule.value = false
  locationChecked.value = false
  locationAllowed.value = false
}

const isCapsuleAvailable = (capsuleItem) =>
  isAfter(new Date(), parseISO(capsuleItem.release_date)) &&
  (!capsuleItem.lat || !capsuleItem.lng)

const statusClass = (capsuleItem) =>
  isCapsuleAvailable(capsuleItem) ? 'available' : 'locked'

const statusText = (capsuleItem) =>
  isCapsuleAvailable(capsuleItem) ? 'Disponível' : 'Bloqueada'

onMounted(fetchCapsules)
</script>

<style scoped>
.capsules-container {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.loading {
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  font-size: 1.1rem;
  color: #666;
}

.create-link {
  display: block;
  margin-top: 1rem;
  color: #42b983;
  font-weight: 500;
  text-decoration: none;
}

.error-state {
  text-align: center;
  padding: 2rem;
  color: #e74c3c;
}

.retry-btn {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.capsules-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.capsule-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  position: relative;
  width: 300px;
  min-height: 290px;      /* aumente o mínimo */
  height: auto;           /* altura automática conforme conteúdo */
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
}

.capsule-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.capsule-content, .capsule-locked {
  min-height: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.capsule-image {
  width: 100%;
  height: 120px;
  object-fit: cover;
  background: #f5f5f5;
  display: block;
}

.capsule-info {
  padding: 1rem;
}

.capsule-info h3 {
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
}

.capsule-info p {
  margin: 0;
  color: #666;
}

.capsule-locked {
  padding: 2rem 1rem;
  text-align: center;
  background: #f9f9f9;
  height: calc(100% - 60px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.lock-icon {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.capsule-locked h3 {
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
}

.capsule-locked p {
  margin: 0;
  color: #666;
}

.location-hint {
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: #42b983;
}

.capsule-status {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0.5rem;
  text-align: center;
  font-weight: 500;
}

.capsule-status.available {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.capsule-status.locked {
  background-color: #fff3e0;
  color: #e65100;
}

.detail-container {
  padding: 2rem;
  max-width: 800px;
  margin: 2rem auto;
}

.capsule-detail {
  text-align: center;
}

.access-denied {
  text-align: center;
  padding: 2rem;
  background: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.location-info {
  margin-top: 1rem;
}

.coordinates {
  font-size: 0.9rem;
  color: #666;
}

.back-button {
  padding: 0.5rem 1rem;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 1rem;
}

.access-denied,
.capsule-detail,
.capsule-content,
.location-info,
.capsule-locked,
.capsule-info h3,
.capsule-info p,
.coordinates {
  color: #222 !important;
  background: #fff !important;
}

.access-denied h2,
.capsule-detail h2,
.capsule-locked h3 {
  color: #2c3e50 !important;
}

.capsule-status.locked {
  background-color: #fff3e0;
  color: #e65100;
}

.capsule-status.available {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.capsule-detail .capsule-image {
  width: 100%;
  max-width: 100%;
  height: auto;
  max-height: 500px;
  object-fit: contain;
  background: #f5f5f5;
  margin: 0 auto;
}
</style>