<template>
  <div class="create-container">
    <h1>Criar nova cápsula do tempo</h1>
    
    <form @submit.prevent="handleSubmit" class="capsule-form">
      <div class="form-group">
        <label for="message">Mensagem</label>
        <textarea 
          id="message" 
          v-model="message" 
          required 
          placeholder="Escreva sua mensagem para o futuro..."
          rows="5"
        ></textarea>
      </div>
      
      <div class="form-group">
        <label for="image">Imagem</label>
        <input 
          type="file" 
          id="image" 
          accept="image/*" 
          @change="handleImageUpload"
        >
        <div v-if="imagePreview" class="image-preview">
          <img :src="imagePreview" alt="Pré-visualização da imagem">
        </div>
      </div>
      
      <div class="form-group">
        <label for="release_date">Data de Liberação</label>
        <input 
          type="datetime-local" 
          id="release_date" 
          v-model="release_date" 
          required
        >
      </div>
      
      <div class="form-group">
        <label>
          <input type="checkbox" v-model="useLocation"> 
          Liberar apenas em um local específico
        </label>
        
        <div v-if="useLocation" class="location-fields">
          <div class="form-group">
            <label for="lat">Latitude</label>
            <input
              type="text"
              id="lat"
              :value="lat !== null ? lat.toFixed(10) : ''"
              @input="lat = $event.target.value ? Number($event.target.value) : null"
              placeholder="Ex: -23.5505000000"
            />
          </div>
          <div class="form-group">
            <label for="lng">Longitude</label>
            <input
              type="text"
              id="lng"
              :value="lng !== null ? lng.toFixed(10) : ''"
              @input="lng = $event.target.value ? Number($event.target.value) : null"
              placeholder="Ex: -46.6333000000"
            />
          </div>
          <div id="map" class="location-map"></div>
          <button 
            type="button" 
            @click="getCurrentLocation"
            class="location-btn"
          >
            Usar minha localização atual
          </button>
        </div>
      </div>
      
      <button type="submit" :disabled="isSubmitting" class="submit-btn">
        {{ isSubmitting ? 'Criando...' : 'Criar Cápsula' }}
      </button>
      
      <p v-if="error" class="error-message">{{ error }}</p>
      <p v-if="success" class="success-message">{{ success }}</p>
    </form>
  </div>
</template>

<script setup>
import 'leaflet/dist/leaflet.css'
import { ref, onMounted, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { useAuthStore } from '../stores/auth'
import L from 'leaflet'

const message = ref('')
const imageFile = ref(null)
const imagePreview = ref(null)
const release_date = ref('')
const useLocation = ref(false)
const lat = ref(null)
const lng = ref(null)
const isSubmitting = ref(false)
const error = ref(null)
const success = ref(null)
const router = useRouter()
const authStore = useAuthStore()

let map, marker

watch(useLocation, async (val) => {
  if (val) {
    await nextTick() // Garante que o DOM já renderizou o #map
    if (!map) {
      map = L.map('map').setView([lat.value || -23.5505, lng.value || -46.6333], 13)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map)
      marker = L.marker([lat.value || -23.5505, lng.value || -46.6333], { draggable: true }).addTo(map)
      marker.on('dragend', function(e) {
        const pos = e.target.getLatLng()
        lat.value = pos.lat
        lng.value = pos.lng
      })
    } else {
      map.invalidateSize()
    }
  } else {
    // Opcional: destruir o mapa se quiser liberar memória
    if (map) {
      map.remove()
      map = null
      marker = null
    }
  }
})

// Atualiza o marcador se lat/lng mudarem manualmente
watch([lat, lng], ([newLat, newLng]) => {
  if (marker && map && newLat && newLng) {
    marker.setLatLng([newLat, newLng])
    map.setView([newLat, newLng])
  }
})

// Converte a imagem para base64 para pré-visualização
const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    imageFile.value = file
    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreview.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

// Obtém a localização atual do usuário
const getCurrentLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        lat.value = position.coords.latitude
        lng.value = position.coords.longitude
      },
      (err) => {
        error.value = 'Erro ao obter localização: ' + err.message
      }
    )
  } else {
    error.value = 'Geolocalização não suportada pelo navegador'
  }
}

// Envia o formulário para criar a cápsula
const handleSubmit = async () => {
  if (!imageFile.value) {
    error.value = 'Por favor, selecione uma imagem'
    return
  }

  isSubmitting.value = true
  error.value = null
  success.value = null

  try {
    // Converte a imagem para base64
    const reader = new FileReader()
    reader.readAsDataURL(imageFile.value)
    reader.onload = () => {
      const imageBase64 = reader.result
      
      const payload = {
        message: message.value,
        image_base64: imageBase64,
        open_date: release_date.value,
        lat: useLocation.value ? lat.value : null,
        lng: useLocation.value ? lng.value : null
      }

      axios.post(`${import.meta.env.VITE_API_URL}/capsules`, payload, {
        headers: {
          Authorization: `Bearer ${authStore.token}`
        }
      })
      .then(response => {
        success.value = 'Cápsula criada com sucesso!'
        setTimeout(() => {
          router.push('/capsules')
        }, 1500)
      })
      .catch(err => {
        error.value = err.response?.data?.error || 'Erro ao criar cápsula'
      })
      .finally(() => {
        isSubmitting.value = false
      })
    }
  } catch (err) {
    error.value = 'Erro ao processar imagem: ' + err.message
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.create-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.capsule-form {
  background: #35495e;/*#fff;*/
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

input[type="text"],
input[type="number"],
input[type="datetime-local"],
textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

textarea {
  resize: vertical;
}

.image-preview {
  margin-top: 1rem;
}

.image-preview img {
  max-width: 100%;
  max-height: 300px;
  border-radius: 4px;
}

.location-fields {
  color: #2c3e50;
  margin-top: 1rem;
  padding: 1rem;
  background: #f5f5f5;
  border-radius: 4px;
}

.location-fields input[type="number"] {
  color: #2c3e50;
  background: #fff;
  border: 1.5px solid #35495e;
  font-weight: bold;
}

.location-map {
  width: 100%;
  height: 300px;
  margin-top: 1rem;
  border-radius: 8px;
  z-index: 1;
}

.location-btn {
  background: #3498db;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 0.5rem;
}

.location-btn:hover {
  background: #2980b9;
}

.submit-btn {
  background: #42b983;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  width: 100%;
}

.submit-btn:hover {
  background: #3aa876;
}

.submit-btn:disabled {
  background: #cccccc;
  cursor: not-allowed;
}

.error-message {
  color: #e74c3c;
  margin-top: 1rem;
}

.success-message {
  color: #2ecc71;
  margin-top: 1rem;
}
</style>