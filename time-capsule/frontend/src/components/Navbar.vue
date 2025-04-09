<template>
  <nav class="navbar">
    <div class="navbar-container">
      <router-link to="/" class="logo">Time Capsule</router-link>
      
      <div class="nav-links">
        <template v-if="authStore.user">
          <router-link to="/capsules" class="nav-link">Minhas Cápsulas</router-link>
          <router-link to="/create" class="nav-link">Criar Cápsula</router-link>
          <button @click="handleLogout" class="logout-btn">Sair</button>
        </template>
        <template v-else>
          <router-link to="/login" class="nav-link">Login</router-link>
          <router-link to="/register" class="nav-link">Registrar</router-link>
        </template>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.navbar {
  background-color: #2c3e50;
  padding: 1rem 0;
}

.navbar-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.logo {
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
  text-decoration: none;
}

.nav-links {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.nav-link {
  color: white;
  text-decoration: none;
  font-size: 1rem;
  padding: 0.5rem 0;
}

.nav-link:hover {
  text-decoration: underline;
}

.logout-btn {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 1rem;
  padding: 0;
}

.logout-btn:hover {
  text-decoration: underline;
}
</style>