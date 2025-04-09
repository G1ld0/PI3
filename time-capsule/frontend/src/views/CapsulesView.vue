<template>
  <div class="capsules-container">
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
        v-for="capsule in filteredCapsules" 
        :key="capsule.id" 
        class="capsule-card"
        @click="handleCapsuleClick(capsule)"
      >
        <div v-if="isCapsuleAvailable(capsule)" class="capsule-content">
          <img 
            :src="capsule.image_url" 
            alt="Imagem da cápsula" 
            class="capsule-image"
            @error="handleImageError"
          >
          <div class="capsule-info">
            <h3>{{ formatDate(capsule.release_date) }}</h3>
            <p>{{ truncateMessage(capsule.message) }}</p>
          </div>
        </div>
        
        <div v-else class="capsule-locked">
          <div class="lock-icon">🔒</div>
          <h3>Cápsula Bloqueada</h3>
          <p>Disponível em {{ formatDate(capsule.release_date) }}</p>
          <p class="location-hint" v-if="capsule.lat && capsule.lng">
            Localização necessária
          </p>
        </div>
        
        <div class="capsule-status" :class="statusClass(capsule)">
          {{ statusText(capsule) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { format, isAfter, parseISO } from 'date-fns'
import { useAuthStore } from '../stores/auth'

const capsules = ref([])
const loading = ref(true)
const error = ref(null)
const router = useRouter()
const authStore = useAuthStore()

// Formatação de dados
const formatDate = (dateString) => {
  return format(parseISO(dateString), 'dd/MM/yyyy HH:mm')
}

const truncateMessage = (message) => {
  return message.length > 50 ? message.substring(0, 50) + '...' : message
}

// Lógica de status
const isCapsuleAvailable = (capsule) => {
  return isAfter(new Date(), parseISO(capsule.release_date))
}

const statusClass = (capsule) => {
  return isCapsuleAvailable(capsule) ? 'available' : 'locked'
}

const statusText = (capsule) => {
  return isCapsuleAvailable(capsule) ? 'Disponível' : 'Bloqueada'
}

// Filtra apenas cápsulas com dados válidos
const filteredCapsules = computed(() => {
  return capsules.value.filter(c => c.id && c.release_date)
})

// Manipulação de erros
const handleImageError = (e) => {
  e.target.src = 'https://placehold.co/300x200?text=Imagem+indispon%C3%ADvel'
}

// Navegação para cápsula
const handleCapsuleClick = (capsule) => {
  if (isCapsuleAvailable(capsule)) {
    router.push(`/capsules/${capsule.id}`)
  } else {
    alert(`Esta cápsula estará disponível em ${formatDate(capsule.release_date)}`)
  }
}

// Busca cápsulas
const fetchCapsules = async () => {
  try {
    loading.value = true
    error.value = null
    
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/capsules`, {
      headers: {
        Authorization: `Bearer ${authStore.token}`
      }
    })
    
    capsules.value = response.data.capsules || []
    
  } catch (err) {
    console.error('Erro ao carregar cápsulas:', err)
    error.value = err.response?.data?.error || err.message || 'Erro desconhecido'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchCapsules()
})
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
}

.capsule-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.capsule-content, .capsule-locked {
  height: 100%;
}

.capsule-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  background: #f5f5f5;
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
</style>