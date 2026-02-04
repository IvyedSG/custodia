<script setup lang="ts">
import { computed, ref } from 'vue'
import { useTransactionService } from '@/services/useTransactionService'
import { toast } from 'vue-sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import type { CustodiaItem, LocationWithItems } from './types'

interface Props {
  open: boolean
  location: LocationWithItems | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  deliver: [item: CustodiaItem]
  addNew: [locationNumber: number]
  delivered: []
}>()

const { endTransaction, updateLockerCode } = useTransactionService()
const submittingItemId = ref<number | null>(null)
const isUpdatingLocker = ref(false)

const newLockerCode = ref('')
const editPopoverOpen = ref<Record<number, boolean>>({})

const handleUpdateLockerCode = async (item: CustodiaItem) => {
  if (!newLockerCode.value.trim()) {
    toast.error('Error', { description: 'Debe ingresar un número de locker válido.' })
    return
  }

  isUpdatingLocker.value = true
  try {
    await updateLockerCode(item.id, newLockerCode.value.trim())
    toast.success('Locker actualizado', { 
      description: `El objeto ha sido movido al locker #${newLockerCode.value.trim()}.` 
    })
    editPopoverOpen.value[item.id] = false
    newLockerCode.value = ''
    emit('delivered') 
    emit('update:open', false) 
  } catch (error) {
    toast.error('Error', { description: (error as Error).message })
  } finally {
    isUpdatingLocker.value = false
  }
}

const handleDeliver = async (item: CustodiaItem) => {
  if (submittingItemId.value !== null) return
  
  submittingItemId.value = item.id
  try {
    await endTransaction(item.id)
    toast.success('Objeto entregado', { description: `El objeto con numeración ${item.numeracion} ha sido entregado.` })
    emit('delivered')
    emit('update:open', false)
  } catch (error) {
    toast.error('Error al entregar', { description: (error as Error).message })
  } finally {
    submittingItemId.value = null
  }
}

const activeItems = computed(() => {
  return props.location?.items.filter(item => !item.entregado) || []
})

const deliveredItems = computed(() => {
  return props.location?.items.filter(item => item.entregado) || []
})
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="max-w-3xl max-h-[85vh]">
      <DialogHeader>
        <DialogTitle class="text-3xl flex items-center gap-3">
          <span>Espacio #{{ location?.location }}</span>
          <Badge variant="outline" class="text-lg font-normal px-3 py-1">
            {{ activeItems.length }} {{ activeItems.length === 1 ? 'objeto' : 'objetos' }}
          </Badge>
        </DialogTitle>
        <DialogDescription class="text-base">
          Objetos almacenados en este locker
        </DialogDescription>
      </DialogHeader>

      <ScrollArea class="max-h-[calc(85vh-200px)]">
        <div class="space-y-6 pr-4">
          <div v-if="activeItems.length > 0">
            <h3 class="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-amber-600">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              En Custodia
            </h3>
            <div class="space-y-4">
              <div
                v-for="item in activeItems"
                :key="item.id"
                class="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-5 border border-amber-200"
              >
                <div class="flex items-start justify-between mb-4">
                  <div>
                    <h4 class="font-bold text-gray-900 text-xl">{{ item.nombres }}</h4>
                    <p class="text-base text-gray-600 mt-2">{{ item.equipo }}</p>
                  </div>
                  <div class="flex items-center gap-2">
                    <Badge variant="outline" class="font-mono text-base bg-white px-3 py-1.5">
                      #{{ item.numeracion }}
                    </Badge>
                    <Popover 
                      v-model:open="editPopoverOpen[item.id]"
                      @update:open="(open) => { if (open) newLockerCode = String(location?.location || '') }"
                    >
                      <PopoverTrigger as-child>
                        <button 
                          class="p-1.5 hover:bg-amber-100 rounded-md transition-colors"
                          title="Cambiar número de locker"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-600">
                            <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/>
                            <path d="m15 5 4 4"/>
                          </svg>
                        </button>
                      </PopoverTrigger>
                      <PopoverContent class="w-80" align="end">
                        <div class="space-y-3">
                          <div class="space-y-1">
                            <h4 class="font-semibold text-base">Cambiar Locker</h4>
                          </div>
                          <div class="flex gap-2">
                            <Input
                              v-model="newLockerCode"
                              type="text"
                              placeholder="Nuevo locker"
                              class="flex-1 text-base h-10"
                              @keyup.enter="handleUpdateLockerCode(item)"
                            />
                            <Button 
                              size="default"
                              :disabled="isUpdatingLocker || !newLockerCode.trim()"
                              @click="handleUpdateLockerCode(item)"
                            >
                              <svg v-if="!isUpdatingLocker" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                              <svg v-else class="animate-spin" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" />
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                              </svg>
                            </Button>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-4 mb-4">
                  <div class="bg-white/60 rounded px-4 py-3 border border-amber-100">
                    <p class="text-sm text-gray-600 mb-1">Teléfono</p>
                    <p class="text-base font-semibold text-gray-900">{{ item.telefono }}</p>
                  </div>
                  <div class="bg-white/60 rounded px-4 py-3 border border-amber-100">
                    <p class="text-sm text-gray-600 mb-1">Ingreso</p>
                    <p class="text-base font-semibold text-gray-900">
                      {{ item.fechaIngreso || 'N/A' }} {{ item.horaIngreso || '' }}
                    </p>
                  </div>
                </div>

                <Button
                  size="default"
                  class="w-full text-base"
                  :disabled="submittingItemId !== null"
                  @click="handleDeliver(item)"
                >
                  <svg v-if="submittingItemId !== item.id" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="mr-2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <svg v-else class="animate-spin mr-2" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" />
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  <span v-if="submittingItemId !== item.id">Marcar como Entregado</span>
                  <span v-else>Entregando...</span>
                </Button>
              </div>
            </div>
          </div>

          <div v-if="deliveredItems.length > 0">
            <Separator class="my-5" />
            <h3 class="text-base font-semibold text-gray-600 mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="text-gray-500">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Entregados
            </h3>
            <div class="space-y-3">
              <div
                v-for="item in deliveredItems"
                :key="item.id"
                class="bg-gray-50 rounded-lg p-4 border border-gray-200 opacity-75"
              >
                <div class="flex items-center justify-between">
                  <div>
                    <h4 class="font-semibold text-gray-700 text-base">{{ item.nombres }}</h4>
                    <p class="text-sm text-gray-500 mt-1">{{ item.equipo }}</p>
                  </div>
                  <Badge variant="outline" class="font-mono text-sm px-2 py-1">
                    #{{ item.numeracion }}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <div v-if="activeItems.length === 0 && deliveredItems.length === 0" class="text-center py-8">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="mx-auto mb-3 text-gray-300">
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <path d="M3 9h18" />
              <path d="M9 21V9" />
            </svg>
            <p class="text-sm text-gray-500">Este locker está vacío</p>
          </div>
        </div>
      </ScrollArea>

      <DialogFooter class="gap-2">
        <Button variant="outline" @click="emit('addNew', location?.location || 0)">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2">
            <path d="M5 12h14" />
            <path d="M12 5v14" />
          </svg>
          Añadir otro objeto
        </Button>
        <Button variant="outline" @click="emit('update:open', false)">
          Cerrar
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
