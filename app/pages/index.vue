<script setup lang="ts">
import { Button } from '@/components/ui/button';

definePageMeta({
  layout: 'default',
})

const navigateToCustodia = () => {
  navigateTo('/custodia');
};
</script>

<template>
  <div class="flex flex-col items-center min-h-screen p-8 bg-cover bg-center pt-12" style="background-image: url('/bg.png');">
    <div class="flex flex-col items-center mb-8">
      <NuxtImg src="/logo.png" alt="Logo" class="w-36 h-36 mb-4" />
      <h1 class="relative text-8xl font-caveat font-bold text-gray-800">
        Bienvenido a
        <span class="relative inline-block px-2">
          <span class="relative z-10">Logística</span>
          <span class="absolute z-0 bg-[url('/bg-text1.png')] bg-cover bg-center rounded-lg w-[150%] h-[100%] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"/>
        </span>
      </h1>
    </div>

    <div class="flex justify-center mt-24">
      <div class="flex flex-col items-center">
        <Button
          variant="outline"
          class="flex flex-col items-center justify-center p-6 w-30 h-30 shadow-lg hover:shadow-xl transition-shadow duration-300 hover:-translate-y-1 transition-transform !bg-white !border-transparent"
          @click="navigateToCustodia"
        >
          <NuxtImg src="/school-locker.png" alt="Custodia Icon" class="size-16" />
        </Button>
        <span class="mt-4 text-xl font-semibold text-gray-800">Custodia</span>
      </div>
    </div>
  </div>
</template>