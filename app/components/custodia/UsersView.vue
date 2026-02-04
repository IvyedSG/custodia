<script setup lang="ts">
import { ref, computed } from 'vue'
import { useUserService } from '@/services/useUserService'
import { usePagination } from '@/composables/usePagination'
import type { User } from '@/types'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { toast } from 'vue-sonner'
import UserFormModal from './UserFormModal.vue'

const { users, teams, getTeamName } = useUserService()

const searchQuery = ref('')
const isUserModalOpen = ref(false)
const selectedUser = ref<User | null>(null)
const isDeletingId = ref<number | null>(null)
const isDeleteConfirmOpen = ref(false)
const userToDelete = ref<User | null>(null)

const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value
  const query = searchQuery.value.toLowerCase()
  return users.value.filter(user =>
    `${user.firstName} ${user.lastName}`.toLowerCase().includes(query) ||
    user.phoneNumber.includes(query) ||
    user.documentNumber.includes(query)
  )
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
} = usePagination(filteredUsers)

const getRoleBadgeVariant = (role?: string) => {
  const variants: Record<string, 'default' | 'secondary' | 'outline'> = {
    'ADMIN': 'default',
    'OPERATOR': 'secondary',
    'USER': 'outline'
  }
  return role ? (variants[role] || 'outline') : 'outline'
}

const getRoleLabel = (role?: string) => {
  const labels: Record<string, string> = {
    'ADMIN': 'Administrador',
    'OPERATOR': 'Operador',
    'USER': 'Usuario'
  }
  return role ? (labels[role] || role) : 'N/A'
}

const handleCreate = () => {
  selectedUser.value = null
  isUserModalOpen.value = true
}

const handleEdit = (user: User) => {
  selectedUser.value = user
  isUserModalOpen.value = true
}

const confirmDelete = (user: User) => {
  userToDelete.value = user
  isDeleteConfirmOpen.value = true
}

const performDelete = async () => {
  if (!userToDelete.value) return
  const userId = userToDelete.value.id

  isDeletingId.value = userId
  try {
    const idx = users.value.findIndex(u => u.id === userId)
    if (idx !== -1) {
      users.value.splice(idx, 1)
    }
    toast.success('Usuario eliminado', { description: 'El voluntario ha sido eliminado exitosamente.' })
  } catch (error) {
    toast.error('Error al eliminar', { description: (error as Error).message })
  } finally {
    isDeletingId.value = null
    userToDelete.value = null
    isDeleteConfirmOpen.value = false
  }
}

const onUserSaved = () => {
  isUserModalOpen.value = false
}
</script>

<template>
  <div class="flex-1 overflow-hidden flex flex-col">
    <div class="flex-1 overflow-hidden bg-white rounded-b-xl shadow-sm flex flex-col">
      <div class="p-4">
        <div class="flex items-center justify-between gap-4">
          <div class="flex-1 max-w-md">
            <Input
              id="user-search"
              v-model="searchQuery"
              aria-label="Buscar voluntarios"
              placeholder="Buscar por nombre, teléfono, documento..."
              class="text-base px-4 py-3 h-12"
            />
          </div>
          <div>
            <Button class="h-12 text-base px-4" @click="handleCreate">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2">
                <path d="M5 12h14" />
                <path d="M12 5v14" />
              </svg>
              Nuevo Voluntario
            </Button>
          </div>
        </div>
      </div>

      <div class="flex-1 overflow-hidden px-3 lg:px-6 pb-6">
        <div class="h-full border flex flex-col">
          <div class="w-full">
            <table class="w-full table-fixed border-collapse">
              <colgroup>
                <col style="width:25%">
                <col style="width:15%">
                <col style="width:15%">
                <col style="width:15%">
                <col style="width:15%">
                <col style="width:15%">
              </colgroup>
              <thead class="bg-gray-50/80 border-b border-gray-200">
                <tr>
                  <th class="text-left font-semibold text-gray-700 text-sm lg:text-base px-2 lg:px-4 py-2 lg:py-3">Nombre</th>
                  <th class="text-left font-semibold text-gray-700 text-sm lg:text-base px-2 lg:px-4 py-2 lg:py-3">Teléfono</th>
                  <th class="text-left font-semibold text-gray-700 text-sm lg:text-base px-2 lg:px-4 py-2 lg:py-3">Documento</th>
                  <th class="text-left font-semibold text-gray-700 text-sm lg:text-base px-2 lg:px-4 py-2 lg:py-3">Rol</th>
                  <th class="text-left font-semibold text-gray-700 text-sm lg:text-base px-2 lg:px-4 py-2 lg:py-3">Equipo</th>
                  <th class="text-left font-semibold text-gray-700 text-sm lg:text-base px-2 lg:px-4 py-2 lg:py-3">Acciones</th>
                </tr>
              </thead>
            </table>
          </div>

          <div class="flex-1 overflow-auto">
            <table class="w-full table-fixed border-collapse">
              <colgroup>
                <col style="width:25%">
                <col style="width:15%">
                <col style="width:15%">
                <col style="width:15%">
                <col style="width:15%">
                <col style="width:15%">
              </colgroup>
              <tbody>
                <tr
                  v-for="user in paginatedData"
                  :key="user.id"
                  class="hover:bg-gray-50/50 transition-colors border-t"
                >
                  <td class="px-2 lg:px-4 py-2 lg:py-4 align-middle font-medium text-sm lg:text-base">
                    {{ user.firstName }} {{ user.lastName }}
                  </td>
                  <td class="px-2 lg:px-4 py-2 lg:py-4 align-middle text-sm lg:text-base text-gray-600">
                    {{ user.phoneNumber || 'N/A' }}
                  </td>
                  <td class="px-2 lg:px-4 py-2 lg:py-4 align-middle text-sm lg:text-base text-gray-600">
                    {{ user.documentNumber || 'N/A' }}
                  </td>
                  <td class="px-2 lg:px-4 py-2 lg:py-4 align-middle">
                    <Badge :variant="getRoleBadgeVariant(user.role)" class="text-sm px-2.5 py-1">
                      {{ getRoleLabel(user.role) }}
                    </Badge>
                  </td>
                  <td class="px-2 lg:px-4 py-2 lg:py-4 align-middle text-sm lg:text-base text-gray-600">
                    {{ getTeamName(user.teamId) }}
                  </td>
                  <td class="px-2 lg:px-4 py-2 lg:py-4 align-middle">
                    <div class="flex gap-2">
                      <Button variant="ghost" size="sm" @click="handleEdit(user)">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                          <path d="m15 5 4 4" />
                        </svg>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        :disabled="isDeletingId === user.id"
                        @click="confirmDelete(user)"
                      >
                        <svg v-if="isDeletingId !== user.id" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-red-600">
                          <path d="M3 6h18" />
                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                        </svg>
                        <svg v-else class="animate-spin" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" />
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                        </svg>
                      </Button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>

            <div v-if="filteredUsers.length === 0" class="text-center py-12">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="mx-auto mb-4 text-gray-300">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <h3 class="text-lg font-semibold text-gray-900 mb-1">No se encontraron voluntarios</h3>
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

    <UserFormModal
      v-model:open="isUserModalOpen"
      :user="selectedUser"
      @saved="onUserSaved"
    />

    <Dialog :open="isDeleteConfirmOpen" @update:open="(v) => (isDeleteConfirmOpen = v)">
      <DialogContent class="max-w-md">
        <DialogHeader>
          <DialogTitle class="text-lg">Eliminar voluntario</DialogTitle>
          <DialogDescription>¿Estás seguro de que deseas eliminar a este voluntario?</DialogDescription>
        </DialogHeader>
        <DialogFooter class="gap-4 sm:gap-4 justify-end">
          <Button variant="outline" :disabled="isDeletingId !== null" @click="isDeleteConfirmOpen = false">Cancelar</Button>
          <Button :disabled="isDeletingId !== null" @click="performDelete">
            <svg v-if="isDeletingId !== null" class="animate-spin mr-2" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
            <span v-if="isDeletingId === null">Eliminar</span>
            <span v-else>Eliminando...</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
</template>
