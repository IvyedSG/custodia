<script setup lang="ts">
import { ref } from 'vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/composables/useAuth'
import { toast } from 'vue-sonner'

definePageMeta({
  layout: 'auth',
})

const { login } = useAuth()
const username = ref('admin@logistics.com')
const password = ref('admin123')
const isLoading = ref(false)
const errorMessage = ref('')
const showPassword = ref(false)

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const handleLogin = async () => {
  isLoading.value = true
  errorMessage.value = ''
  
  try {
    await login({
      username: username.value,
      password: password.value,
    })

    toast.success('¡Bienvenido!', {
      description: 'Sesión iniciada correctamente',
    })

    await navigateTo('/')
  } catch (error) {
    const err = error as Error
    errorMessage.value = err.message
    toast.error('Error de autenticación', {
      description: err.message,
    })
  } finally {
    isLoading.value = false
  }
}

const handleKeyPress = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    handleLogin()
  }
}
</script>

<template>
  <div class="min-h-screen w-full bg-[#f8fafc] relative">
    <div
      class="absolute inset-0 z-0"
      :style="{
        backgroundImage: `
          linear-gradient(to right, #e2e8f0 1px, transparent 1px),
          linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)
        `,
        backgroundSize: '20px 30px',
        WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)',
        maskImage: 'radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)',
      }"
    />

    <div class="relative z-10 min-h-screen flex items-center justify-center p-4">
      <Card class="w-full max-w-md">
        <CardHeader class="space-y-4 text-center">
          <div class="flex justify-center mb-2">
            <img 
              src="/logo.png" 
              alt="Logo" 
              class="w-24 h-24 object-contain"
            >
          </div>
          
          <div>
            <CardTitle class="text-4xl font-bold font-caveat">
              Logística
            </CardTitle>
          </div>
        </CardHeader>

        <CardContent class="space-y-4">
          <div class="space-y-2">
            <Label for="username">Usuario</Label>
            <Input
              id="username"
              v-model="username"
              type="text"
              placeholder="Ingresa tu usuario"
              autocomplete="username"
              :disabled="isLoading"
              @keypress="handleKeyPress"
            />
          </div>

          <div class="space-y-2">
            <Label for="password">Contraseña</Label>
            <div class="relative">
              <Input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Ingresa tu contraseña"
                autocomplete="current-password"
                :disabled="isLoading"
                class="pr-10"
                @keypress="handleKeyPress"
              />
              <button
                type="button"
                class="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-foreground transition-colors"
                :disabled="isLoading"
                @click="togglePasswordVisibility"
              >
                <svg
                  v-if="!showPassword"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-5 h-5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <svg
                  v-else
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-5 h-5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                  />
                </svg>
              </button>
            </div>
          </div>

          <Button
            class="w-full"
            :disabled="isLoading || !username || !password"
            @click="handleLogin"
          >
            <span v-if="isLoading" class="flex items-center gap-2">
              <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Iniciando sesión...
            </span>
            <span v-else>Iniciar Sesión</span>
          </Button>
        </CardContent>
      </Card>
    </div>
  </div>
</template>