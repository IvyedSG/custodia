<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useTransactionService } from '@/services/useTransactionService'
import { toast } from 'vue-sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { CustodiaItem } from './types'

interface Props {
  open: boolean
  allTransactions: CustodiaItem[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  delivered: []
}>()

const ticketQuery = ref('')
const { endTransaction } = useTransactionService()
const submittingItemId = ref<number | null>(null)

const userTransactions = computed<CustodiaItem[]>(() => {
  const q = ticketQuery.value.trim()
  if (q.length < 2) return []

  return props.allTransactions.filter(transaction =>
    String(transaction.numeracion || '').toLowerCase().includes(q.toLowerCase()) && !transaction.entregado
  )
})
watch(() => props.open, (isOpen) => {
  if (!isOpen) {
    ticketQuery.value = ''
  }
})

const handleDeliver = async (item: CustodiaItem) => {
  if (submittingItemId.value !== null) return
  if (!item?.id) {
    toast.error('Error', { description: 'ID de transacción no encontrado' })
    return
  }

  submittingItemId.value = item.id
  try {
    await endTransaction(item.id)
    toast.success('Objeto entregado', { 
      description: `El objeto #${item.numeracion} ha sido entregado.` 
    })
    emit('delivered')
  } catch (error) {
    toast.error('Error al entregar', { description: (error as Error).message })
  } finally {
    submittingItemId.value = null
  }
}
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="max-w-2xl max-h-[85vh]">
      <DialogHeader>
        <DialogTitle class="text-2xl">Buscar por Teléfono</DialogTitle>
        <DialogDescription class="text-base">
          Ingrese el número de teléfono del voluntario para ver sus objetos en custodia
        </DialogDescription>
      </DialogHeader>

      <div class="space-y-4">
        <Input
          v-model="ticketQuery"
          type="text"
          placeholder="Ingrese código de ticket (ej. TS-050)"
          class="w-full text-base h-11"
          autofocus
        />

        <div v-if="ticketQuery.length >= 2 && userTransactions.length === 0" class="text-center py-8">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="mx-auto mb-3 text-gray-300">
            <circle cx="12" cy="12" r="10" />
            <path d="m15 9-6 6" />
            <path d="m9 9 6 6" />
          </svg>
          <p class="text-sm text-gray-500">
            No se encontraron objetos para esa numeración
          </p>
        </div>

        <ScrollArea v-if="userTransactions.length > 0" class="h-[400px] w-full">
          <div class="space-y-4 pr-4">
            <div
              v-for="item in userTransactions"
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
                  <Badge variant="outline" class="text-sm bg-white px-2 py-1">
                    Locker {{ item.ubicacion }}
                  </Badge>
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
        </ScrollArea>
      </div>
    </DialogContent>
  </Dialog>
</template>
