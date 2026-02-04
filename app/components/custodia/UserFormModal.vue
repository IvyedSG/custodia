<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
import { Calendar } from '@/components/ui/calendar'
import { CalendarIcon } from 'lucide-vue-next'
import { useUserService } from '@/services/useUserService'
import { useDate } from '@/composables/useDate'
import type { User } from '@/types'
import { toast } from 'vue-sonner'
import { cn } from '@/lib/utils'
import { getLocalTimeZone, type DateValue, CalendarDate, today } from '@internationalized/date'

interface Props {
  open: boolean
  user?: User | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  saved: []
}>()

const formData = ref({
  firstName: '',
  lastName: '',
  phoneNumber: '',
  documentNumber: '',
  birthday: undefined as DateValue | undefined,
  email: '',
  teamId: undefined as number | undefined,
  role: 'USER' as 'ADMIN' | 'OPERATOR' | 'USER',
})

const isSubmitting = ref(false)
const isEditMode = computed(() => !!props.user?.id)

const { teams, createUser, updateUser } = useUserService()
const { formatLongDate } = useDate()

const resetForm = () => {
  formData.value = {
    firstName: '',
    lastName: '',
    phoneNumber: '',
    documentNumber: '',
    birthday: undefined,
    email: '',
    teamId: undefined,
    role: 'USER',
  }
}

watch([() => props.user, () => props.open], ([user, isOpen]) => {
  if (isOpen && user) {
    formData.value = {
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      documentNumber: user.documentNumber,
      birthday: undefined, 
      email: user.email || '',
      teamId: user.teamId,
      role: user.role || 'USER',
    }
  } else if (isOpen && !user) {
    resetForm()
  }
}, { immediate: true })

const canSubmit = computed(() => {
  if (isSubmitting.value) return false
  const { firstName, lastName, phoneNumber } = formData.value
  return !!(firstName.trim() && lastName.trim() && phoneNumber.trim())
})

const phoneNumberModel = computed({
  get: () => formData.value.phoneNumber,
  set: (v) => { formData.value.phoneNumber = v.replace(/\D+/g, '').slice(0, 15) }
})

const documentNumberModel = computed({
  get: () => formData.value.documentNumber,
  set: (v) => { formData.value.documentNumber = (v || '').replace(/[^a-zA-Z0-9]/g, '').slice(0, 20) }
})

const birthdayPlaceholder = computed(() => {
  const now = today(getLocalTimeZone())
  return new CalendarDate(now.year - 20, now.month, now.day)
})

const handleSubmit = async () => {
  if (!canSubmit.value) return
  isSubmitting.value = true

  try {
    const payload = {
      ...formData.value,
      email: formData.value.email.trim() || undefined,
      birthday: undefined, 
    }

    if (isEditMode.value && props.user?.id) {
      await updateUser(props.user.id, payload)
      toast.success('Usuario actualizado')
    } else {
      await createUser(payload)
      toast.success('Usuario creado')
    }

    emit('saved')
    emit('update:open', false)
  } catch (error) {
    toast.error('Error al guardar', { description: (error as Error).message })
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle class="text-2xl">
          {{ isEditMode ? 'Editar Voluntario' : 'Nuevo Voluntario' }}
        </DialogTitle>
        <DialogDescription class="text-base">
          {{ isEditMode ? 'Actualiza la información del voluntario' : 'Completa los datos del nuevo voluntario' }}
        </DialogDescription>
      </DialogHeader>

  <form class="space-y-5" @submit.prevent="handleSubmit">
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <Label for="firstName" class="text-base font-medium text-gray-700">
              Nombre <span class="text-red-500">*</span>
            </Label>
            <Input
              id="firstName"
              v-model="formData.firstName"
              placeholder="Ej. Juan"
              class="text-base px-4 py-3 h-12"
              required
            />
          </div>
          <div class="space-y-2">
            <Label for="lastName" class="text-base font-medium text-gray-700">
              Apellido <span class="text-red-500">*</span>
            </Label>
            <Input
              id="lastName"
              v-model="formData.lastName"
              placeholder="Ej. Pérez"
              class="text-base px-4 py-3 h-12"
              required
            />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <Label for="phoneNumber" class="text-base font-medium text-gray-700">
              Teléfono <span class="text-red-500">*</span>
            </Label>
            <Input
              id="phoneNumber"
              v-model="phoneNumberModel"
              placeholder="Ej. 912345678"
              class="text-base px-4 py-3 h-12"
              required
              minlength="9"
              maxlength="15"
            />
          </div>
          <div class="space-y-2">
            <Label for="documentNumber" class="text-base font-medium text-gray-700">
              Documento
            </Label>
            <Input
              id="documentNumber"
              v-model="documentNumberModel"
              placeholder="DNI o documento"
              class="text-base px-4 py-3 h-12"
              minlength="8"
              maxlength="20"
            />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <Label for="email" class="text-base font-medium text-gray-700">
              Email
            </Label>
            <Input
              id="email"
              v-model="formData.email"
              type="email"
              placeholder="correo@ejemplo.com"
              class="text-base px-4 py-3 h-12"
            />
          </div>
          <div class="space-y-2">
            <Label for="birthday" class="text-base font-medium text-gray-700">
              Fecha de Nacimiento
            </Label>
            <Popover>
              <PopoverTrigger as-child>
                <Button
                  variant="outline"
                  :class="cn(
                    'w-full justify-start text-left font-normal h-12 text-base px-4',
                    !formData.birthday && 'text-muted-foreground'
                  )"
                >
                  <CalendarIcon class="mr-2 h-5 w-5 flex-shrink-0" />
                  <span class="truncate">
                    {{ formData.birthday ? formatLongDate(formData.birthday as DateValue) : 'Seleccionar fecha' }}
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent class="w-auto p-0">
                <Calendar 
                  v-model="formData.birthday as DateValue" 
                  initial-focus
                  :placeholder="birthdayPlaceholder"
                  locale="es-ES"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <Label for="role" class="text-base font-medium text-gray-700">
              Rol <span class="text-red-500">*</span>
            </Label>
            <Select v-model="formData.role" required>
              <SelectTrigger id="role" class="text-base px-4 !h-12 w-full">
                <SelectValue placeholder="Seleccionar rol" class="truncate block max-w-full overflow-hidden text-ellipsis whitespace-nowrap" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USER" class="text-base">Usuario</SelectItem>
                <SelectItem value="OPERATOR" class="text-base">Operador</SelectItem>
                <SelectItem value="ADMIN" class="text-base">Administrador</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div class="space-y-2">
            <Label for="team" class="text-base font-medium text-gray-700">
              Equipo
            </Label>
            <Select v-model="formData.teamId">
              <SelectTrigger id="team" class="text-base px-4 !h-12 w-full">
                <SelectValue placeholder="Seleccionar equipo" class="truncate block max-w-full overflow-hidden text-ellipsis whitespace-nowrap" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  v-for="team in teams"
                  :key="team.id"
                  :value="team.id"
                  class="text-base"
                >
                  {{ team.name }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

  <DialogFooter class="gap-4 sm:gap-4 justify-end">
          <Button
            type="button"
            variant="outline"
            class="text-base"
            :disabled="isSubmitting"
            @click="emit('update:open', false)"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            class="text-base"
            :disabled="!canSubmit"
          >
            <svg
              v-if="isSubmitting"
              class="animate-spin mr-2"
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
            <span v-if="!isSubmitting">{{ isEditMode ? 'Actualizar' : 'Crear' }}</span>
            <span v-else>{{ isEditMode ? 'Actualizando...' : 'Creando...' }}</span>
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
