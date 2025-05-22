<template>
  <div class="home-container">
    <h1>🕰️ Time Capsule</h1>
    <p class="subtitle">Guarde memórias para serem abertas no futuro ou em locais especiais</p>
    
    <div class="cta-buttons">
      <router-link to="/login" class="cta-button">Entrar</router-link>
      <router-link to="/register" class="cta-button secondary">Registrar</router-link>
    </div>
    
    <div class="features">
      <div class="feature">
        <h3>⏳ Cápsulas Temporais</h3>
        <p>Defina uma data futura para liberação</p>
      </div>
      <div class="feature">
        <h3>📍 Cápsulas Geográficas</h3>
        <p>Só podem ser abertas em locais específicos</p>
      </div>
      <div class="feature">
        <h3>🔒 Segurança</h3>
        <p>Suas memórias protegidas até o momento certo</p>
      </div>
    </div>
  </div>
</template>

<script setup>
// Página inicial não precisa de lógica complexa
</script>

<style scoped>
.home-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  color: white;
}

.subtitle {
  font-size: 1.2rem;
  margin-bottom: 2rem;
}

.cta-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 3rem;
}

.cta-button {
  padding: 0.75rem 1.5rem;
  background-color: #42b983;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-weight: bold;
}

.cta-button.secondary {
  background-color: #35495e;
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.feature {
  background:  #35495e;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.feature h3 {
  margin-top: 0;
  color: white;
}
</style>