<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Button } from '@/components/ui/button'
import ShelfView from '@/components/custodia/ShelfView.vue'
import TableView from '@/components/custodia/TableView.vue'
import HistoryView from '@/components/custodia/HistoryView.vue'
import UsersView from '@/components/custodia/UsersView.vue'
import LocationDetailModal from '@/components/custodia/LocationDetailModal.vue'
import NewEntryModal from '@/components/custodia/NewEntryModal.vue'
import SearchByPhoneModal from '@/components/custodia/SearchByPhoneModal.vue'
import type { CustodiaItem, LocationWithItems } from '@/components/custodia/types'
import { useCustodia } from '@/composables/useCustodia'
import { toast } from 'vue-sonner'


const { allLocations, isLoading, isError, refetchActiveTransactions, overflowItems } = useCustodia()

const viewMode = ref<'shelf' | 'table' | 'history' | 'users'>('shelf')
const selectedLocation = ref<LocationWithItems | null>(null)
const isLocationModalOpen = ref(false)
const isNewEntryModalOpen = ref(false)
const isSearchModalOpen = ref(false)
const preselectedLocation = ref<number | undefined>(undefined)

const activeItems = computed<CustodiaItem[]>(() => {
  const lockerItems = allLocations.value.flatMap(loc => 
    loc.items.filter(it => !it.entregado)
  )
  
  const shelfExtras = (overflowItems?.value || []).filter(it => !it.entregado)
  
  // Deduplicate by ticket code
  const uniqueItemsMap = new Map<string, CustodiaItem>()
  const addItem = (it: CustodiaItem) => {
    const key = it.numeracion || it.id || String(Math.random())
    if (!uniqueItemsMap.has(String(key))) {
      uniqueItemsMap.set(String(key), it)
    }
  }

  lockerItems.forEach(addItem)
  shelfExtras.forEach(addItem)
  
  return Array.from(uniqueItemsMap.values())
})

watch(isError, (hasError) => {
  if (hasError) {
    toast.error('Error al cargar datos', {
      description: 'No se pudieron sincronizar las transacciones activas.',
    })
  }
})

const openLocation = (location: LocationWithItems) => {
  selectedLocation.value = location
  isLocationModalOpen.value = true
}

const openNewEntry = (locationNumber?: number) => {
  isLocationModalOpen.value = false
  preselectedLocation.value = locationNumber
  isNewEntryModalOpen.value = true
}

const openItemDetail = (item: CustodiaItem) => {
  const locNum = Number(item.ubicacion)
  const location = allLocations.value.find(loc => loc.location === locNum)
  
  if (location) {
    selectedLocation.value = location
  } else {
    selectedLocation.value = {
      location: isNaN(locNum) ? 0 : locNum,
      items: [item],
      isEmpty: false,
    }
  }
  isLocationModalOpen.value = true
}

const handleDelivered = async () => {
  await refetchActiveTransactions()
  isLocationModalOpen.value = false
}

const handleRegistered = async () => {
  await refetchActiveTransactions()
  isNewEntryModalOpen.value = false
}

const openSearchModal = () => {
  isSearchModalOpen.value = true
}

const handleSearchDelivered = async () => {
  await refetchActiveTransactions()
  isSearchModalOpen.value = false
}

const goHome = () => navigateTo('/')
</script>

<template>
  <div class="flex flex-col h-screen p-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
    <div class="mb-0">
      <div class="flex items-center justify-between mb-4">
        <h1 class="text-5xl font-caveat font-bold text-gray-800">
          Custodia
        </h1>

        <div class="flex items-center gap-2">
          <Button variant="outline" class="!bg-white hover:!bg-gray-50" @click="openSearchModal">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            Buscar por Ticket
          </Button>

          <Button @click="openNewEntry()">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2">
            <path d="M5 12h14" />
            <path d="M12 5v14" />
          </svg>
          Nuevo Ingreso
          </Button>

          <Button variant="ghost" class="bg-red-600 text-white !text-white hover:!bg-red-600 hover:!text-white focus:!bg-red-600 focus:!text-white active:!bg-red-600 active:!text-white !border-transparent focus:ring-2 focus:ring-red-300" @click="goHome">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2">
              <path d="M3 9.5L12 3l9 6.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1V9.5z" />
            </svg>
            Salir
          </Button>
        </div>
      </div>

      <div class="bg-white rounded-t-xl shadow-sm border-b border-gray-200">
        <div class="flex">
          <button
            :class="[
              'flex-1 flex items-center justify-center gap-2 px-6 py-4 text-sm font-semibold transition-colors relative',
              viewMode === 'shelf' 
                ? 'text-blue-600 bg-blue-50/50' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            ]"
            @click="viewMode = 'shelf'"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <path d="M3 9h18" />
              <path d="M3 15h18" />
              <path d="M9 3v18" />
              <path d="M15 3v18" />
            </svg>
            Estante
            <div v-if="viewMode === 'shelf'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
          </button>
          
          <button
            :class="[
              'flex-1 flex items-center justify-center gap-2 px-6 py-4 text-sm font-semibold transition-colors relative',
              viewMode === 'table' 
                ? 'text-blue-600 bg-blue-50/50' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            ]"
            @click="viewMode = 'table'"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 3h7v7H3z" />
              <path d="M14 3h7v7h-7z" />
              <path d="M14 14h7v7h-7z" />
              <path d="M3 14h7v7H3z" />
            </svg>
            Custodia
            <div v-if="viewMode === 'table'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
          </button>
          
          <button
            :class="[
              'flex-1 flex items-center justify-center gap-2 px-6 py-4 text-sm font-semibold transition-colors relative',
              viewMode === 'history' 
                ? 'text-blue-600 bg-blue-50/50' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            ]"
            @click="viewMode = 'history'"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
              <path d="M12 7v5l4 2" />
            </svg>
            Historial
            <div v-if="viewMode === 'history'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
          </button>
          
          <button
            :class="[
              'flex-1 flex items-center justify-center gap-2 px-6 py-4 text-sm font-semibold transition-colors relative',
              viewMode === 'users' 
                ? 'text-blue-600 bg-blue-50/50' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            ]"
            @click="viewMode = 'users'"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            Voluntarios
            <div v-if="viewMode === 'users'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
          </button>
        </div>
      </div>
    </div>

    <div v-if="isLoading && (viewMode === 'shelf' || viewMode === 'table')" class="flex-1 flex items-center justify-center bg-white rounded-b-xl shadow-sm">
      <div class="text-center">
        <svg class="animate-spin h-8 w-8 mx-auto text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <p class="mt-4 text-sm text-muted-foreground">Cargando datos de custodia...</p>
      </div>
    </div>

    <ShelfView 
      v-if="!isLoading && viewMode === 'shelf'" 
      :locations="allLocations"
      @open-location="openLocation"
      @open-new-entry="openNewEntry"
    />

    <TableView
      v-if="!isLoading && viewMode === 'table'"
      :data="activeItems"
      @open-detail="openItemDetail"
    />
 
    <HistoryView v-if="viewMode === 'history'" />
 
    <UsersView v-if="viewMode === 'users'" />
 
    <LocationDetailModal
      v-model:open="isLocationModalOpen"
      :location="selectedLocation"
      @delivered="handleDelivered"
      @add-new="openNewEntry"
    />
 
    <NewEntryModal
      v-model:open="isNewEntryModalOpen"
      :preselected-location="preselectedLocation"
      @registered="handleRegistered"
    />
 
    <SearchByPhoneModal
      v-model:open="isSearchModalOpen"
      :all-transactions="activeItems"
      @delivered="handleSearchDelivered"
    />
  </div>
</template>