<script setup lang="ts">
import type { LocationWithItems } from './types'

interface Props {
  locations: LocationWithItems[]
}

defineProps<Props>()

const emit = defineEmits<{
  openLocation: [location: LocationWithItems]
  openNewEntry: [locationNumber: number]
}>()

// Función para obtener el color del casillero
const getLockerColor = (location: LocationWithItems) => {
  if (location.isEmpty) return 'bg-green-100 border-green-300 hover:bg-green-200' // Libre
  
  // Si no está vacío, significa que tiene al menos un objeto activo (en custodia)
  return 'bg-amber-100 border-amber-400 hover:bg-amber-200' // Ocupado
}

// Función para manejar el click en un locker
const handleLockerClick = (location: LocationWithItems) => {
  if (location.isEmpty) {
    emit('openNewEntry', location.location)
  } else {
    emit('openLocation', location)
  }
}
</script>

<template>
  <div class="flex-1 overflow-hidden">
    <div class="bg-white rounded-b-xl p-4 shadow-sm h-full">
  <!-- Grid de Lockers (responsive: mobile/tablet/desktop) - now supports 48 lockers (8 cols x 6 rows on md+) -->
  <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-8 gap-2 h-full">
        <button
          v-for="location in locations"
          :key="location.location"
          :class="[
            'rounded-lg border-3 transition-colors duration-200 flex flex-col items-center justify-center p-3 md:p-2 lg:p-4 relative cursor-pointer overflow-hidden',
            getLockerColor(location),
          ]"
          @click="handleLockerClick(location)"
        >
          <!-- Número del locker - más grande y visible -->
          <!-- Badge pequeño y pegado a la esquina -->
          <div class="absolute top-1 left-1 bg-white rounded-full w-8 h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 flex items-center justify-center shadow-sm border border-gray-200 z-10">
            <span class="text-sm md:text-base lg:text-base font-semibold text-gray-800">{{ location.location }}</span>
          </div>
          
          <!-- Información del locker -->
          <div v-if="!location.isEmpty" class="text-center w-full mt-2 md:mt-3">
            <!-- Un solo ticket -->
            <p v-if="location.items.length === 1" class="text-sm md:text-lg lg:text-xl font-black text-gray-900 leading-tight">
              #{{ location.items[0]?.numeracion }}
            </p>
            <!-- Dos tickets -->
            <div v-else-if="location.items.length === 2" class="flex gap-2 justify-center items-center">
              <p v-for="(it, idx) in location.items" :key="it?.numeracion ?? idx" class="text-sm md:text-base lg:text-lg font-bold text-gray-900 leading-tight">
                #{{ it?.numeracion }}
              </p>
            </div>
            <!-- Múltiples tickets (3 o más) -> mostrar resumen en lugar de listar tickets -->
            <div v-else class="space-y-0.5">
              <p class="text-sm md:text-base lg:text-lg font-bold text-gray-900 leading-tight">
                {{ location.items.length }} objetos
              </p>
            </div>
          </div>
          <div v-else class="text-center mt-3">
            <p class="text-sm md:text-base lg:text-lg font-bold text-green-700">Libre</p>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>