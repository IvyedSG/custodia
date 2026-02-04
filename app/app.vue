<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Toaster } from '@/components/ui/sonner'
import 'vue-sonner/style.css'

const isCheckingAuth = ref(true)
const route = useRoute()
const { isAuthenticated } = useAuth()

onMounted(async () => {
  if (import.meta.client) {
    const isLoginPage = route.path === '/login'
    const authenticated = isAuthenticated()
    
    if (authenticated && isLoginPage) {
      await navigateTo('/', { replace: true })
    } else if (!authenticated && !isLoginPage) {
      await navigateTo('/login', { replace: true })
    }
    
    isCheckingAuth.value = false
  }
})
</script>

<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    
    <div v-if="isCheckingAuth" class="fixed inset-0 z-[100] flex items-center justify-center bg-[#f8fafc]">
      <div class="text-center">
        <svg class="animate-spin h-8 w-8 mx-auto text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <p class="mt-4 text-sm text-muted-foreground">Cargando...</p>
      </div>
    </div>
    
    <Toaster position="top-right" />
  </div>
</template>