import { defineStore } from 'pinia'
import { supabase } from '../composables/useSupabase'
import axios from 'axios'
import { useRouter } from 'vue-router'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
    isLoading: false,
    error: null
  }),
  actions: {
    async login(email, password) {
      try {
        this.isLoading = true
        this.error = null
        
        // 1. Autentica no Supabase
        const { data: supabaseData, error: supabaseError } = await supabase.auth.signInWithPassword({
          email,
          password
        })
        
        if (supabaseError) throw supabaseError
    
        // 2. Obtém token JWT do nosso backend
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/login`, 
          { email, password },
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        )
    
        if (!response.data.access_token) {
          throw new Error('Token não recebido do backend')
        }
    
        this.user = supabaseData.user
        this.token = response.data.access_token
        
        return true
      } catch (error) {
        console.error('Erro no login:', error)
        this.error = error.response?.data?.error || 
                    error.message || 
                    'Erro ao conectar com o servidor'
        return false
      } finally {
        this.isLoading = false
      }
    },
    async logout() {
      try {
        await supabase.auth.signOut()
        this.user = null
        this.token = null
      } catch (error) {
        console.error('Erro no logout:', error)
      }
    },
    async checkAuth() {
      try {
        const { data } = await supabase.auth.getUser()
        this.user = data.user
      } catch (error) {
        this.user = null
      }
    }
  }
})