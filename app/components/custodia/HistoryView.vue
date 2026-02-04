<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTransactionService } from '@/services/useTransactionService'
import { useUserService } from '@/services/useUserService'
import { usePagination } from '@/composables/usePagination'
import { useDate } from '@/composables/useDate'
import { store } from '@/lib/store'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { CalendarIcon, ArrowDownToLine, ArrowUpFromLine } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { getLocalTimeZone, type DateValue } from '@internationalized/date'

interface HistoryEntry {
  id: string
  date: string
  time: string
  action: 'check-in' | 'delivery'
  userName: string
  ticketCode: string
  location: string
  teamName: string
  phoneNumber: string
}

const { formatLongDate, formatISODate, formatDisplayDate } = useDate()
const { getTeamName } = useUserService()

const searchQuery = ref('')
const selectedAction = ref('all')
const selectedDate = ref<DateValue | undefined>()

const historyData = computed<HistoryEntry[]>(() => {
  const entries: HistoryEntry[] = []

  store.transactions.forEach((tx) => {
    if (tx.inTime) {
      const [date, time] = tx.inTime.split('T')
      entries.push({
        id: `${tx.id}-in`,
        date: date!,
        time: time!.slice(0, 5),
        action: 'check-in',
        userName: `${tx.user?.firstName || ''} ${tx.user?.lastName || ''}`.trim(),
        ticketCode: tx.ticketCode,
        location: tx.lockerCode || 'N/A',
        teamName: tx.teamName || 'N/A',
        phoneNumber: tx.user?.phoneNumber || 'N/A',
      })
    }

    // Delivery entry
    if (tx.outTime) {
      const [date, time] = tx.outTime.split('T')
      entries.push({
        id: `${tx.id}-out`,
        date: date!,
        time: time!.slice(0, 5),
        action: 'delivery',
        userName: `${tx.user?.firstName || ''} ${tx.user?.lastName || ''}`.trim(),
        ticketCode: tx.ticketCode,
        location: tx.lockerCode || 'N/A',
        teamName: tx.teamName || 'N/A',
        phoneNumber: tx.user?.phoneNumber || 'N/A',
      })
    }
  })

  return entries.sort((a, b) => {
    const timeA = new Date(`${a.date}T${a.time}`).getTime()
    const timeB = new Date(`${b.date}T${b.time}`).getTime()
    return timeB - timeA
  })
})

const filteredHistory = computed(() => {
  let filtered = historyData.value

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    filtered = filtered.filter(item =>
      item.userName.toLowerCase().includes(q) ||
      item.ticketCode.toLowerCase().includes(q) ||
      item.teamName.toLowerCase().includes(q)
    )
  }

  if (selectedAction.value !== 'all') {
    filtered = filtered.filter(item => {
      const mappedAction = selectedAction.value === 'ingreso' ? 'check-in' : 'delivery'
      return item.action === mappedAction
    })
  }

  if (selectedDate.value) {
    const dateStr = formatISODate(selectedDate.value)
    filtered = filtered.filter(item => item.date === dateStr)
  }

  return filtered
})

const {
  currentPage,
  pageSize,
  pageSizes,
  totalPages,
  totalItems,
  paginatedData,
  rangeStart,
  rangeEnd,
  prevPage,
  nextPage,
} = usePagination(filteredHistory)
</script>

<template>
  <div class="flex-1 overflow-hidden flex flex-col">
    <div class="flex-1 overflow-hidden bg-white rounded-b-xl shadow-sm flex flex-col">
      <div class="p-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <Input
              id="history-search"
              v-model="searchQuery"
              aria-label="Buscar en historial"
              placeholder="Buscar por nombre, ticket, equipo..."
              class="text-base px-4 py-3 h-12"
            />
          </div>

          <div>
            <Select v-model="selectedAction">
              <SelectTrigger id="history-action" aria-label="Filtrar por acción" class="text-base px-4 !h-12">
                <SelectValue placeholder="Todas las acciones" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" class="text-base">Todas las acciones</SelectItem>
                <SelectItem value="ingreso" class="text-base">Ingresos</SelectItem>
                <SelectItem value="entrega" class="text-base">Entregas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Popover>
              <PopoverTrigger as-child>
                <Button
                  variant="outline"
                  aria-label="Seleccionar fecha"
                  :class="cn('w-full justify-start text-left font-normal text-base h-12', !selectedDate && 'text-muted-foreground')"
                >
                  <CalendarIcon class="mr-2 h-5 w-5" />
                  {{ selectedDate ? formatLongDate(selectedDate) : 'Seleccionar fecha' }}
                </Button>
              </PopoverTrigger>
              <PopoverContent class="w-auto p-0">
                <Calendar v-model="selectedDate" initial-focus />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

  <div class="flex-1 overflow-hidden pt-0 px-3 lg:px-6 pb-4">
    <div class="h-full border flex flex-col">
          <div class="w-full">
            <table class="w-full table-fixed border-collapse">
              <colgroup>
                <col style="width:12.5%">
                <col style="width:12.5%">
                <col style="width:12.5%">
                <col style="width:12.5%">
                <col style="width:12.5%">
                <col style="width:12.5%">
                <col style="width:12.5%">
                <col style="width:12.5%">
              </colgroup>
              <thead class="bg-gray-50/80 border-b border-gray-200">
                <tr>
                  <th class="text-left font-semibold text-gray-700 text-sm lg:text-base px-2 lg:px-4 py-2 lg:py-3">Fecha</th>
                  <th class="text-left font-semibold text-gray-700 text-sm lg:text-base px-2 lg:px-4 py-2 lg:py-3">Hora</th>
                  <th class="text-left font-semibold text-gray-700 text-sm lg:text-base px-2 lg:px-4 py-2 lg:py-3">Acción</th>
                  <th class="text-left font-semibold text-gray-700 text-sm lg:text-base px-2 lg:px-4 py-2 lg:py-3">Nombre</th>
                  <th class="text-left font-semibold text-gray-700 text-sm lg:text-base px-2 lg:px-4 py-2 lg:py-3">N° Ticket</th>
                  <th class="text-left font-semibold text-gray-700 text-sm lg:text-base px-2 lg:px-4 py-2 lg:py-3">Ubicación</th>
                  <th class="text-left font-semibold text-gray-700 text-sm lg:text-base px-2 lg:px-4 py-2 lg:py-3">Equipo</th>
                  <th class="text-left font-semibold text-gray-700 text-sm lg:text-base px-2 lg:px-4 py-2 lg:py-3">Teléfono</th>
                </tr>
              </thead>
            </table>
          </div>

          <div class="flex-1 overflow-auto">
            <table class="w-full table-fixed border-collapse">
              <colgroup>
                <col style="width:12.5%">
                <col style="width:12.5%">
                <col style="width:12.5%">
                <col style="width:12.5%">
                <col style="width:12.5%">
                <col style="width:12.5%">
                <col style="width:12.5%">
                <col style="width:12.5%">
              </colgroup>
              <tbody>
                <tr
                  v-for="item in paginatedData"
                  :key="item.id"
                  class="hover:bg-gray-50/50 transition-colors border-t"
                >
    <td class="px-2 lg:px-4 py-2 lg:py-4 align-middle font-medium text-sm lg:text-base">{{ formatDisplayDate(item.date) }}</td>
    <td class="px-2 lg:px-4 py-2 lg:py-4 align-middle text-sm lg:text-base text-gray-600">{{ item.time }}</td>
    <td class="px-2 lg:px-4 py-2 lg:py-4 align-middle">
        <Badge
      :variant="item.action === 'check-in' ? 'default' : 'secondary'"
      class="font-medium gap-1.5 text-sm lg:text-base px-3 py-1"
        >
                      <component
                        :is="item.action === 'check-in' ? ArrowDownToLine : ArrowUpFromLine"
                        class="h-4 w-4"
                      />
                      {{ item.action === 'check-in' ? 'Ingreso' : 'Entrega' }}
                    </Badge>
                  </td>
                  <td class="px-4 py-4 align-middle font-medium text-base">{{ item.userName }}</td>
                  <td class="px-4 py-4 align-middle">
                    <Badge variant="outline" class="font-mono text-base px-2.5 py-1">#{{ item.ticketCode }}</Badge>
                  </td>
                  <td class="px-4 py-4 align-middle">
                    <Badge variant="outline" class="bg-amber-50 text-amber-700 border-amber-200 text-base px-2.5 py-1">{{ item.location }}</Badge>
                  </td>
                  <td class="px-4 py-4 align-middle text-base">{{ item.teamName }}</td>
                  <td class="px-4 py-4 align-middle text-base text-gray-600">{{ item.phoneNumber }}</td>
                </tr>
              </tbody>
            </table>

            <div v-if="filteredHistory.length === 0" class="text-center py-12">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="mx-auto mb-4 text-gray-300">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v 5h5" />
                <path d="M12 7v5l4 2" />
              </svg>
              <h3 class="text-lg font-semibold text-gray-900 mb-1">No se encontraron registros</h3>
              <p class="text-sm text-gray-500">Intenta ajustar los filtros de búsqueda</p>
            </div>
          </div>

          <div class="px-4 py-3 border-t bg-white flex items-center justify-between gap-4">
            <div class="text-sm text-gray-600">
              Mostrando
              <span class="font-medium">{{ rangeStart }}</span>
              -
              <span class="font-medium">{{ rangeEnd }}</span>
              de <span class="font-medium">{{ totalItems }}</span>
            </div>

            <div class="flex items-center gap-3">
              <div class="flex items-center gap-2">
                <label class="text-sm text-gray-600">Filas</label>
                <select v-model.number="pageSize" class="text-sm border rounded px-2 py-1 focus:ring-1 focus:ring-blue-500">
                  <option v-for="s in pageSizes" :key="s" :value="s">{{ s }}</option>
                </select>
              </div>

              <div class="flex items-center gap-2">
                <button class="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 transition-colors" :disabled="currentPage <= 1" @click="prevPage">Anterior</button>
                <span class="text-sm text-gray-600 font-medium whitespace-nowrap">
                  Página <span class="text-gray-900">{{ currentPage }}</span> / {{ totalPages }}
                </span>
                <button class="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 transition-colors" :disabled="currentPage >= totalPages" @click="nextPage">Siguiente</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
