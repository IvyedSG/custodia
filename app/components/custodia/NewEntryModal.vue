<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { CheckIcon, ChevronsUpDownIcon } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useTransactionService } from '@/services/useTransactionService'
import { useUserService } from '@/services/useUserService'
import type { User, TransactionRequest } from '@/types'
import { toast } from 'vue-sonner'

interface Props {
  open: boolean
  preselectedLocation?: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  registered: []
}>()

const formData = ref({
  phoneNumber: '',
  userName: '',
  ticketCode: '',
  location: '',
  teamId: '' as number | string,
})

const foundUserId = ref<number | null>(null)
const isSubmitting = ref(false)

const { availableTickets, startTransaction } = useTransactionService()
const { users, teams, searchUser, createUser } = useUserService()

const availableTicketCodes = computed(() => availableTickets.value)
const teamsList = computed(() => teams.value.map(t => ({ id: t.id, name: t.name })))

const isTicketPopoverOpen = ref(false)
const isTeamPopoverOpen = ref(false)

const ticketValue = computed({
  get: () => formData.value.ticketCode || '',
  set: (v) => { formData.value.ticketCode = v }
})

const teamValue = computed({
  get: () => String(formData.value.teamId || ''),
  set: (v) => { formData.value.teamId = Number(v) || v }
})

const handleTicketSelect = (ev: CustomEvent) => {
  const val = ev?.detail?.value as string | undefined
  if (val) {
    ticketValue.value = val
    isTicketPopoverOpen.value = false
  }
}

const handleTeamSelect = (ev: CustomEvent) => {
  const val = ev?.detail?.value as string | undefined
  if (val) {
    teamValue.value = val
    isTeamPopoverOpen.value = false
  }
}

watch(() => props.preselectedLocation, (newVal) => {
  if (newVal !== undefined) {
    formData.value.location = String(newVal)
  }
}, { immediate: true })

watch(() => formData.value.phoneNumber, async (newVal) => {
  if (newVal.length === 9) {
    const user = await searchUser(newVal)
    if (user) {
      foundUserId.value = user.id
      formData.value.userName = `${user.firstName} ${user.lastName}`.trim()
    } else {
      foundUserId.value = null
    }
  } else {
    foundUserId.value = null
  }
})

const onPhoneInput = (e: Event) => {
  const target = e.target as HTMLInputElement
  const digits = (target.value || '').replace(/\D+/g, '').slice(0, 9)
  target.value = digits
  formData.value.phoneNumber = digits
}

const resetForm = () => {
  formData.value = {
    phoneNumber: '',
    userName: '',
    ticketCode: '',
    location: props.preselectedLocation ? String(props.preselectedLocation) : '',
    teamId: '',
  }
  foundUserId.value = null
}

const canSubmit = computed(() => {
  const { ticketCode, location, teamId, userName } = formData.value
  if (!ticketCode || !location || !teamId) return false
  if (!foundUserId.value && !userName.trim()) return false
  if (isSubmitting.value) return false
  return true
})

const handleSubmit = async () => {
  if (!canSubmit.value) return
  isSubmitting.value = true

  try {
    let userId = foundUserId.value

    if (!userId) {
      const [firstName, ...rest] = formData.value.userName.trim().split(' ')
      const lastName = rest.join(' ') || '-'
      const newUser = await createUser({
        firstName,
        lastName,
        phoneNumber: formData.value.phoneNumber,
        documentNumber: '',
      })
      userId = newUser.id
    }

    const request: TransactionRequest = {
      userId: userId!,
      teamId: Number(formData.value.teamId),
      ticketCode: formData.value.ticketCode,
      itemDescription: formData.value.userName,
      lockerCode: formData.value.location,
    }

    await startTransaction(request)

    toast.success('Registro exitoso', {
      description: `Ticket ${formData.value.ticketCode} asignado al casillero ${formData.value.location}`
    })

    resetForm()
    emit('update:open', false)
    emit('registered')
  } catch (error) {
    toast.error('Error al registrar', { description: (error as Error).message })
  } finally {
    isSubmitting.value = false
  }
}

watch(() => props.open, (isOpen) => {
  if (isOpen) resetForm()
})
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="max-w-2xl">
      <DialogHeader>
        <DialogTitle class="text-3xl">Nuevo Ingreso a Custodia</DialogTitle>
        <DialogDescription class="text-base">
          Registra un nuevo objeto en custodia
          <span v-if="preselectedLocation" class="font-semibold text-purple-600 text-lg">
            - Espacio #{{ preselectedLocation }}
          </span>
        </DialogDescription>
      </DialogHeader>

      <form class="space-y-5" @submit.prevent="handleSubmit">
        <!-- Phone Number -->
        <div>
          <div class="flex items-center">
            <Label for="phoneNumber" class="text-base font-medium text-gray-700">Nº Teléfono</Label>
            <Badge v-if="foundUserId" class="ml-3 bg-emerald-50 text-emerald-700 border-emerald-200 text-sm px-2 py-0.5">Voluntario encontrado</Badge>
          </div>
          <Input
            id="phoneNumber"
            v-model="formData.phoneNumber"
            type="tel"
            maxlength="9"
            placeholder="Ej. 912345678"
            class="mt-2 bg-white text-gray-900 text-sm lg:text-base placeholder-gray-400 border border-gray-300 rounded-md px-3 lg:px-4 py-2 lg:py-3 h-10 lg:h-12 shadow-sm focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
            @input="onPhoneInput"
          />
        </div>

        <div class="grid grid-cols-2 gap-5">
          <div>
            <Label for="userName" class="text-base font-medium text-gray-700">Nombre Completo *</Label>
            <Input
              id="userName"
              v-model="formData.userName"
              placeholder="Ej. Juan Pérez"
              required
              class="mt-2 bg-white text-gray-900 text-sm lg:text-base placeholder-gray-400 border border-gray-300 rounded-md px-3 lg:px-4 py-2 lg:py-3 h-10 lg:h-12 shadow-sm focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
              :disabled="!!foundUserId"
            />
          </div>

          <div>
            <Label for="ticketCode" class="text-base font-medium text-gray-700">N° Ticket *</Label>
            <Popover v-model:open="isTicketPopoverOpen">
              <PopoverTrigger as-child>
                <Button
                  variant="outline"
                  role="combobox"
                  :aria-expanded="isTicketPopoverOpen"
                  class="w-full justify-between mt-2 bg-white text-gray-900 text-sm lg:text-base placeholder-gray-400 border border-gray-300 rounded-md px-3 lg:px-4 py-2 lg:py-3 h-10 lg:h-12 shadow-sm focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                  :disabled="availableTicketCodes.length === 0"
                >
                  {{ ticketValue || (availableTicketCodes.length === 0 ? 'No hay tickets disponibles' : 'Selecciona un ticket') }}
                  <ChevronsUpDownIcon class="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent class="w-full max-w-xs p-0">
                <Command>
                  <CommandInput placeholder="Buscar ticket..." />
                  <CommandList>
                    <CommandEmpty>No se encontró ticket.</CommandEmpty>
                    <CommandGroup>
                      <CommandItem
                        v-for="code in availableTicketCodes"
                        :key="code"
                        :value="code"
                        class="text-base"
                        @select="handleTicketSelect"
                      >
                        {{ code }}
                        <CheckIcon :class="cn('ml-auto', ticketValue === code ? 'opacity-100' : 'opacity-0')" class="h-4 w-4" />
                      </CommandItem>
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-5">
          <div>
            <Label for="location" class="text-base font-medium text-gray-700">Ubicación *</Label>
            <Input
              id="location"
                v-model="formData.location"
                type="number"
                min="1"
                max="48"
                placeholder="1-48"
                required
                class="mt-2 text-sm lg:text-base px-3 lg:px-4 py-2 lg:py-3 h-10 lg:h-12 focus:ring-purple-500 focus:border-purple-500"
                :disabled="preselectedLocation !== undefined"
              />
          </div>

          <div>
            <Label for="teamId" class="text-base font-medium text-gray-700">Equipo *</Label>
            <Popover v-model:open="isTeamPopoverOpen">
              <PopoverTrigger as-child>
                <Button
                  variant="outline"
                  role="combobox"
                  :aria-expanded="isTeamPopoverOpen"
                  class="w-full justify-between mt-2 bg-white text-gray-900 text-sm lg:text-base placeholder-gray-400 border border-gray-300 rounded-md px-3 lg:px-4 py-2 lg:py-3 h-10 lg:h-12 shadow-sm focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                  :disabled="teamsList.length === 0"
                >
                  {{ teamValue ? (teamsList.find(t => String(t.id) === teamValue)?.name || teamValue) : (teamsList.length === 0 ? 'No hay grupos disponibles' : 'Selecciona un grupo') }}
                  <ChevronsUpDownIcon class="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent class="w-full max-w-md p-0">
                <Command>
                  <CommandInput placeholder="Buscar grupo..." />
                  <CommandList>
                    <CommandEmpty>No se encontró grupo.</CommandEmpty>
                    <CommandGroup>
                      <CommandItem
                        v-for="team in teamsList"
                        :key="team.id"
                        :value="String(team.id)"
                        class="text-base"
                        @select="handleTeamSelect"
                      >
                        {{ team.name }}
                        <CheckIcon :class="cn('ml-auto', teamValue === String(team.id) ? 'opacity-100' : 'opacity-0')" class="h-4 w-4" />
                      </CommandItem>
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </form>

      <DialogFooter>
        <Button type="button" variant="outline" class="text-base" :disabled="isSubmitting" @click="emit('update:open', false)">
          Cancelar
        </Button>
  <Button class="text-base" :disabled="!canSubmit" @click="handleSubmit">
          <svg v-if="!isSubmitting" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2">
            <path d="M5 12h14" />
            <path d="M12 5v14" />
          </svg>
          <svg v-else class="animate-spin mr-2" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
          <span v-if="!isSubmitting">Registrar Ingreso</span>
          <span v-else>Registrando...</span>
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>