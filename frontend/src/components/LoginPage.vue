<template>
  <div class="login-container">
    <div class="login-card">
      <div class="header">
        <h2 class="title">File Management System</h2>
        <p class="subtitle">Sign in to access your files</p>
      </div>
      <form class="login-form" @submit.prevent="handleLogin">
        
        <div v-if="errorMessage" class="error-message">
          <div class="error-content">
            <div class="error-icon">
              <XCircle />
            </div>
            <div class="error-text">
              <h3>{{ errorMessage }}</h3>
            </div>
          </div>
        </div>

       
        <div class="input-group">
          <div>
            <label for="email-address" class="sr-only">Email address</label>
            <input
              id="email-address"
              name="email"
              type="email"
              autocomplete="email"
              required
              v-model="email"
              class="input input-email"
              placeholder="Email address"
            />
          </div>
          <div>
            <label for="password" class="sr-only">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autocomplete="current-password"
              required
              v-model="password"
              class="input input-password"
              placeholder="Password"
            />
          </div>
        </div>

        
        <div>
          <button
            type="submit"
            :disabled="isLoading"
            class="submit-button"
          >
            <span v-if="isLoading" class="button-icon loading">
              <Loader class="icon spin" />
            </span>
            <span v-else class="button-icon">
              <Lock class="icon" />
            </span>
            {{ isLoading ? 'Signing in...' : 'Sign in' }}
          </button>
        </div>
        
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Lock, Loader, XCircle } from 'lucide-vue-next';
import axios from 'axios';
import { useRouter } from 'vue-router'; 

// Form data
const email = ref('');
const password = ref('');

const isLoading = ref(false);
const errorMessage = ref('');
const router = useRouter(); 

// Handle login submission
const handleLogin = async () => {
  try {
    isLoading.value = true;
    errorMessage.value = '';

    const response = await axios.post('http://localhost:5000/api/login', {
      email: email.value,
      password: password.value,
    });

    // If login is successful, store the sessionId and redirect
    if (response.data.sessionId) {
      localStorage.setItem('sessionId', response.data.sessionId); 
      console.log('Login successful');
      router.push('/home');
    }

  } catch (error) {
    console.error('Login error:', error);
    // Display error message if login fails
    if (error.response && error.response.data) {
      errorMessage.value = error.response.data.message || 'An error occurred. Please try again.';
    } else {
      errorMessage.value = 'An error occurred. Please try again.';
    }
  } finally {
    isLoading.value = false;
  }
};
</script>



<style scoped>
.login-container {
  min-height: 50vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  padding: 3rem 1rem;
}

.login-card {
  max-width: 28rem;
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.header {
  text-align: center;
}

.title {
  margin-top: 1.5rem;
  font-size: 1.875rem;
  font-weight: 800;
  color: #a94442;
}

.subtitle {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.login-form {
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.error-message {
  border-radius: 0.375rem;
  background-color: #fef2f2;
  padding: 1rem;
  margin-bottom: 1rem;
}

.error-content {
  display: flex;
}

.error-icon {
  flex-shrink: 0;
  color: #f87171;
}

.error-text {
  margin-left: 0.75rem;
}

.error-text h3 {
  font-size: 0.875rem;
  font-weight: 500;
  color: #991b1b;
}

.input-group {
  border-radius: 0.375rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  margin-bottom: -1px;
}

.input {
  appearance: none;
  position: relative;
  display: block;
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  color: #111827;
  font-size: 0.875rem;
  outline: none;
}

.input:focus {
  z-index: 10;
  border-color: #a94442;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.input-email {
  border-top-left-radius: 0.375rem;
  border-top-right-radius: 0.375rem;
}

.input-password {
  border-bottom-left-radius: 0.375rem;
  border-bottom-right-radius: 0.375rem;
}

.submit-button {
  position: relative;
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 0.625rem 1rem;
  border: 1px solid transparent;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 0.375rem;
  color: white;
  background-color: #a94442;
  cursor: pointer;
  margin-top: 30px;
}

.submit-button:hover {
  background-color: #d0ab86;
  color: #a94442;
}

.submit-button:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5);  
}

.submit-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.button-icon {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  padding-left: 0.75rem;
}

.icon {
  height: 1.25rem;
  width: 1.25rem;
  color: #ffffff;
}

.submit-button:hover .icon {
  color: #a94442;
}


.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}


.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
</style>