<template>
  <div class="register-container">
    <h1>Criar Conta</h1>
    <form @submit.prevent="handleRegister">
      <div class="form-group">
        <label for="email">Email</label>
        <input 
          id="email" 
          type="email" 
          v-model="email" 
          required 
          placeholder="seu@email.com"
        >
      </div>
      <div class="form-group">
        <label for="password">Senha</label>
        <input 
          id="password" 
          type="password" 
          v-model="password" 
          required 
          placeholder="••••••••"
          minlength="6"
        >
      </div>
      <div class="form-group">
        <label for="confirmPassword">Confirmar Senha</label>
        <input 
          id="confirmPassword" 
          type="password" 
          v-model="confirmPassword" 
          required 
          placeholder="••••••••"
          minlength="6"
        >
      </div>
      <button type="submit" :disabled="isLoading">
        {{ isLoading ? 'Criando...' : 'Criar Conta' }}
      </button>
      <p v-if="error" class="error">{{ error }}</p>
      <p class="login-link">
        Já tem conta? <router-link to="/login">Faça login</router-link>
      </p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../composables/useSupabase'

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const isLoading = ref(false)
const error = ref(null)
const router = useRouter()

const handleRegister = async () => {
  if (password.value !== confirmPassword.value) {
    error.value = "As senhas não coincidem"
    return
  }

  isLoading.value = true
  error.value = null

  try {
    const { error: supabaseError } = await supabase.auth.signUp({
      email: email.value,
      password: password.value
    })

    if (supabaseError) throw supabaseError

    router.push('/login')
  } catch (err) {
    error.value = err.message
  } finally {
    isLoading.value = false
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email: email.value,
      password: password.value
    })

    if (error) throw error

    // Autentica automaticamente após o registro
    const loginSuccess = await authStore.login(email.value, password.value)
    
    if (loginSuccess) {
      router.push('/capsules')
    }
  } catch (err) {
    error.value = err.message
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.register-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 2rem;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  width: 100%;
  padding: 0.75rem;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 1rem;
}

button:hover {
  background-color: #3aa876;
}

button:disabled {
  background: #cccccc;
  cursor: not-allowed;
}

.error {
  color: #ff4444;
  margin-top: 1rem;
}

.login-link {
  margin-top: 1rem;
  text-align: center;
}
</style>